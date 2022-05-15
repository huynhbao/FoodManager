import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeConfirmComponent } from './code-confirm.component';

describe('CodeConfirmComponent', () => {
  let component: CodeConfirmComponent;
  let fixture: ComponentFixture<CodeConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
