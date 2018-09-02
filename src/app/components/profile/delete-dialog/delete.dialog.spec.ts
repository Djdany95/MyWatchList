import { DeleteDialog } from './delete.dialog';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

describe('LoginDialog', () => {
  let component: DeleteDialog;
  let fixture: ComponentFixture<DeleteDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteDialog]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
