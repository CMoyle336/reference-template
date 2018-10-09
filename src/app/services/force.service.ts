import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as jsforce from 'jsforce';
import { Observable, ReplaySubject, BehaviorSubject } from 'rxjs/Rx';
import { CacheService, JSForceService, SalesforceConfig, defaults } from 'ng-salesforce';
import * as CryptoJS from 'crypto-js';
import * as _ from 'lodash';

declare var window: any;

let _windowConfig = window.sv || {};
@Injectable()
export class ForceService {

    private static STOP_EXCEPTIONS = ['INVALID_SESSION_ID', 'API_CURRENTLY_DISABLED', 'ERROR_HTTP_403', 'ERROR_HTTP_400'];


    public loginChange: ReplaySubject<any> = new ReplaySubject<any>();
    public loggingIn: boolean = false;
    public stopOnException: boolean = false;
    public connection: any;
    public anonymousConnection: any;
    public onLogout: EventEmitter<boolean> = new EventEmitter<boolean>();
    private queryBuffer = [];

    constructor(private http: HttpClient, private _cache: CacheService, @Inject('configuration') private config: SalesforceConfig) {
        JSForceService.fixSoapLogin(jsforce, this.config.organizationId, this.config.instanceUrl);
        JSForceService.fixIdentity(jsforce, this.config.instanceUrl);
        JSForceService.addSoapCallout(jsforce, this.config.production);
        this.resetConnection();
    }

    setPassword(password: string) {
        return this.userId().flatMap(userId => {
            return this.connection.soap.setPassword(userId, password);
        });
    }

    getConnection(): Observable<any> {
        if (this.connection && this.connection.accessToken)
            return Observable.of(this.connection);
        else
            return this.login(null, null).flatMap(u => Observable.of(this.connection));
    }

    login(username: string, password: string): Observable<any> {
        if (!username || !password) {
            let credentialKey = localStorage.getItem(defaults.STORAGE_KEY);
            if (credentialKey) {
                let storedCredentials = JSON.parse(atob(credentialKey));
                if (storedCredentials && storedCredentials.username && storedCredentials.password)
                    return this.doLogin(storedCredentials.username, storedCredentials.password);
                else
                    return Observable.throw(new Error('Invalid Login'));
            } else {
                return Observable.throw(new Error('Invalid Login'));
            }
        } else {
            return this.doLogin(username, password);
        }
    }

    loginOauth(clientId: string, redirectUri: string): void {
        jsforce.browser.init({
            clientId: clientId,
            redirectUri: redirectUri
        });
        jsforce.browser.login();
    }

    logout(): Observable<void> {
        localStorage.removeItem(defaults.STORAGE_KEY);
        localStorage.removeItem(defaults.STORAGE_ACCESS_TOKEN);
        localStorage.removeItem(defaults.STORAGE_USER_INFO);
        this.connection.logout();
        if (_windowConfig)
            delete _windowConfig.accessToken;

        delete this.connection;
        this.resetConnection();
        return this._cache.update('User');
    }

    setAccessToken(accessToken: string) {
        this.connection.accessToken = accessToken;
        localStorage.setItem(defaults.STORAGE_ACCESS_TOKEN, accessToken);
    }

    setUserInfo(userInfo: any) {
        this.connection.instanceUrl = userInfo.instance_url;
        localStorage.setItem(defaults.STORAGE_USER_INFO, JSON.stringify(userInfo));
    }

    isLoggedIn() {
        return (this.connection && this.connection.accessToken) ? true : false;
    }

    isGuest(): Observable<boolean> {
        return Observable.of(!this.connection.accessToken);
    }

    create(sobject: string, data: Array<any>) {
        data.forEach(d => d.attributes = { type: sobject });
        return this.post('insert', { q: JSON.stringify(data) }).map(res => {
            this._cache.updateKeys(sobject);
            return res;
        }).take(1);
    }

    remove(sobject: string, data: Array<any>) {
        data.forEach(d => d.attributes = { type: sobject });
        return this.post('remove', { q: JSON.stringify(data) }).map(res => {
            this._cache.updateKeys(sobject);
            return res;
        }).take(1);
    }

    update(sobject: string, data: Array<any>) {
        data.forEach(d => d.attributes = { type: sobject });
        return this.post('update', { q: JSON.stringify(data) }).map(res => {
            this._cache.updateKeys(sobject);
            return res;
        }).take(1);
    }

    upsert(sobject: string, data: Array<any>) {
        data.forEach(d => d.attributes = { type: sobject });
        return this.post('upsert', { q: JSON.stringify(data), type: sobject }).map(res => {
            this._cache.updateKeys(sobject);
            return res;
        }).take(1);
    }

    composite(dataList: Array<Composite>) {
        return this.post('composite', { 'q': dataList }).map(res => {
            dataList.forEach(d => this._cache.updateKeys(d.sobjectType));
            return res;
        }).take(1);
    }

    search(query: string): Observable<Array<any>> {
        if (!this.config.production && this.config.enableQueryLogs)
            // tslint:disable-next-line:no-console
            console.debug(query);
        return this.post('search', { q: query });
    }

    get(endpoint) {
        return Observable.fromPromise(this.connection.apex.get(endpoint));
    }

    post(method, data, classOverride: string = 'DataHandler', namespace: string = 'Apttus_WebStore', anonymous: boolean = false, count: number = 0): Observable<any> {
        let encrypted = JSON.stringify({
            class: classOverride,
            namespace: namespace,
            method: method,
            data: data,
            encryptedResponse: this.config.encryptResponse
        });
        if (!this.config.production && data && data['q'] && this.config.enableQueryLogs)
            // tslint:disable-next-line:no-console
            console.debug(data['q']);
        const payload = this.encryptString(encrypted);

        if (!this.config.production && this.config.enablePerformanceLogs)
            // tslint:disable-next-line:no-console
            console.debug('Payload size: ' + this.lengthInBytes(payload) + ' bytes');

        const start = new Date().getTime();
        const callout = (anonymous) ? this.anonymousConnection.apex.post('/dc/' + start, { d: payload }) : this.connection.apex.post('/dc/' + start, { d: payload });
        return Observable.fromPromise(callout)
            .map((res: string) => (this.config.encryptResponse) ? JSON.parse(this.decryptString(res)) : JSON.parse(res))
            .map((res: any) => {
                const end = new Date().getTime();
                if (!this.config.production && this.config.enablePerformanceLogs)
                    // tslint:disable-next-line:no-console
                    console.debug('Total request time: ' + (end - start) + ' milliseconds for method ' + method);

                if (res && res.success) {
                    try {
                        return JSON.parse(res.data);
                    } catch (e) {
                        return (res.data) ? res.data : res;
                    }
                } else {
                    throw (res && res.data) ? res.data : null;
                }
            }).catch(e => {
                if (ForceService.STOP_EXCEPTIONS.indexOf(e.name) >= 0 && count <= 2) {
                    count += 1;
                    this.onLogout.emit(true);
                    return this.logout().flatMap(d => this.post(method, data, classOverride, namespace, false, count));
                }
                else
                    return Observable.throw(e);
            });
    }

    query(query: string, type: string = 'SObject'): Observable<Array<any>> {
        if (this.config.disableBuffer) {
            const queryList = {};
            const guid = this._cache.guid();
            queryList[guid] = {
                query: query,
                type: type
            };
            const data = Object.assign({}, queryList);
            return this.post('query', { q: data }).map(res => res[guid]);
        } else {
            const bufferSize = (this.config.maxBufferSize) ? this.config.maxBufferSize : 10;
            // Get the last key of the buffer
            let queryMap = this.queryBuffer.slice(-1).pop();
            if (!queryMap || Object.keys(_.get(queryMap, 'list')).length >= bufferSize) {
                queryMap = { key: this._cache.guid(), list: {} };
                this.queryBuffer.push(queryMap);
            }

            const guid = this._cache.guid();
            if (!queryMap.list[guid])
                queryMap.list[guid] = {
                    query: query,
                    type: type
                };
            return this._cache.get(queryMap.key, () => Observable
                .timer(this.config.bufferTime)
                .flatMap(() => {
                    const data = Object.assign({}, queryMap.list);
                    for (let i = this.queryBuffer.length - 1; i >= 0; --i) {
                        if (this.queryBuffer[i].key === queryMap.key) {
                            this.queryBuffer.splice(i, 1);
                        }
                    }
                    this._cache.clearKey(queryMap.key);
                    return this.post('query', { q: data });
                })
            )
                .map(res => {
                    this._cache.saveKeys(res[guid], query);
                    return res[guid];
                });
        }
    }

    checkChildren(data): Observable<Array<any>> {
        let obsvArray = [];
        for (let record of data.records) {
            for (const property in record) {
                if (record.hasOwnProperty(property) && record[property].done === false)
                    obsvArray.push(this.queryMore(record[property].nextRecordsUrl, record[property], record, property));
            }
        }
        if (obsvArray && obsvArray.length > 0)
            return Observable.forkJoin(obsvArray);
        else
            return Observable.of(data);
    }

    queryMore(locator: string, data, parent, parentProperty): Observable<Array<any>> {
        return Observable.fromPromise(this.connection.queryMore(locator)).flatMap((res: any) => {
            res.records = res.records.concat(data.records);
            if (parent && parent[parentProperty])
                parent[parentProperty] = res;
            if (res.done === false)
                return this.queryMore(res.nextRecordsUrl, res, parent, parentProperty);
            else
                return Observable.of(res);
        });
    }

    describe(sobject: string): Observable<any> {
        return Observable.fromPromise(this.connection.describe(sobject))
            .catch(e => {
                if (ForceService.STOP_EXCEPTIONS.indexOf(e.name) >= 0) {
                    this.onLogout.emit(true);
                    return this.post('describe', sobject);
                } else
                    return Observable.throw(e);
            });
    }

    userId(): Observable<string> {
        if (localStorage.getItem(defaults.STORAGE_USER_INFO)) {
            const userInfo = JSON.parse(localStorage.getItem(defaults.STORAGE_USER_INFO));
            return Observable.of(userInfo.id.substring(userInfo.id.lastIndexOf('/') + 1));
        } else {
            return this._cache.get(_.get(this.connection, 'accessToken', 'guest'), () => this.post('identity', {}));
        }
    }

    organizationId() {
        return this._cache.get('organization', () => this.post('organization', {}));
    }

    _identity(): Observable<any> {
        return Observable.create(obsv => {
            if (!this.isLoggedIn()) {
                obsv.next(null);
                obsv.complete();
            } else {
                if (localStorage.getItem(defaults.STORAGE_USER_INFO)) {
                    const userInfo = JSON.parse(localStorage.getItem(defaults.STORAGE_USER_INFO));
                    userInfo.user_id = userInfo.id.substring(userInfo.id.lastIndexOf('/') + 1);
                    obsv.next(userInfo);
                    obsv.complete();
                } else {
                    this.connection.identity((res, err) => {
                        if (!err && res) {
                            obsv.next(res);
                        } else {
                            if (ForceService.STOP_EXCEPTIONS.indexOf(err.name) >= 0)
                                obsv.next(null);
                            else
                                obsv.error(err);
                            obsv.complete();
                        }
                    }).catch(e => {
                        if (ForceService.STOP_EXCEPTIONS.indexOf(e.name) >= 0)
                            obsv.next(null);
                        else
                            obsv.error(e);
                        obsv.complete();
                    });
                }
            }
        });
    }

    private resetConnection() {

        let instanceUrl = 'https://' + window.location.hostname;

        let suffix = '';
        if (this.config.instanceUrl && this.config.instanceUrl.indexOf('.com/') >= 0)
            suffix = this.config.instanceUrl.substring(this.config.instanceUrl.indexOf('.com/') + 4);

        if (localStorage.getItem(defaults.STORAGE_USER_INFO))
            instanceUrl = JSON.parse(localStorage.getItem(defaults.STORAGE_USER_INFO)).instance_url;
        else if (_windowConfig && _windowConfig.baseURL)
            instanceUrl = 'https://' + _windowConfig.baseURL;
        else if (_windowConfig && _windowConfig.salesforceEndpoint)
            instanceUrl = 'https://' + _windowConfig.salesforceEndpoint + suffix;
        else if (this.config.instanceUrl)
            instanceUrl = this.config.instanceUrl;

        this.connection = new jsforce.Connection({
            loginUrl: instanceUrl,
            instanceUrl: instanceUrl,
            serverUrl: instanceUrl
        });

        this.anonymousConnection = new jsforce.Connection({
            loginUrl: instanceUrl,
            instanceUrl: instanceUrl,
            serverUrl: instanceUrl
        });

        if (_windowConfig && _windowConfig.accessToken && _windowConfig.accessToken !== 'NULL_SESSION_ID') {
            this.connection.accessToken = _windowConfig.accessToken;
            localStorage.setItem(defaults.STORAGE_ACCESS_TOKEN, _windowConfig.accessToken);
        } else if (localStorage.getItem(defaults.STORAGE_ACCESS_TOKEN))
            this.connection.accessToken = localStorage.getItem(defaults.STORAGE_ACCESS_TOKEN);
    }

    private doLogin(username: string, password: string): Observable<any> {
        if (this.loggingIn)
            return this.loginChange;
        else {
            this.loggingIn = true;
            return Observable.fromPromise(this.connection.login(username, password)).map(userInfo => {
                localStorage.setItem(defaults.STORAGE_ACCESS_TOKEN, this.connection.accessToken);
                this.connection.instanceUrl = this.config.instanceUrl;
                this.loginChange.next(userInfo);
                this.loginChange.complete();
                this.loggingIn = false;
                return userInfo;
            }).catch((e: Error) => {
                this.loggingIn = false;
                this.loginChange.error(e);
                this.loginChange.complete();
                return Observable.throw(e);
            });
        }
    }

    private encryptString(stringToEncrypt) {
        const a = CryptoJS.enc.Base64.parse(defaults.SV);
        const b = CryptoJS.enc.Base64.parse(defaults.IV);

        const encrypted = CryptoJS.AES.encrypt(stringToEncrypt, a, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: b });
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    }

    private decryptString(stringToDecrypt) {
        const a = CryptoJS.enc.Base64.parse(defaults.SV);
        const b = CryptoJS.enc.Base64.parse(defaults.IV);

        const decrypted = CryptoJS.AES.decrypt(stringToDecrypt, a, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: b });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    private lengthInBytes(str) {
        const m = encodeURIComponent(str).match(/%[89ABab]/g);
        return str.length + (m ? m.length : 0);
    }
}


export interface Composite {
    method: 'insert' | 'update' | 'upsert' | 'delete';
    data: string;
    sobjectType: string;
}