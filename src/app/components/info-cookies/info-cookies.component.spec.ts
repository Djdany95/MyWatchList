import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCookiesComponent } from './info-cookies.component';

describe('InfoCookiesComponent', () => {
  let component: InfoCookiesComponent;
  let fixture: ComponentFixture<InfoCookiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoCookiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCookiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
