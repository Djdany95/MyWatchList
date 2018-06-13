import { RememberDialog } from './remember.dialog';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('RememberDialog', () => {
  let component: RememberDialog;
  let fixture: ComponentFixture<RememberDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RememberDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RememberDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
