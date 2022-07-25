import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBanUserComponent } from './modal-ban-user.component';

describe('ModalBanUserComponent', () => {
  let component: ModalBanUserComponent;
  let fixture: ComponentFixture<ModalBanUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalBanUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBanUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
