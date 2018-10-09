import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMiniProfileComponent } from './my-mini-profile.component';

describe('MyMiniProfileComponent', () => {
  let component: MyMiniProfileComponent;
  let fixture: ComponentFixture<MyMiniProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMiniProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMiniProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
