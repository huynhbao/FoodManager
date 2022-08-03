import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCreateManagerComponent } from './modal-create-manager.component';

describe('ModalCreateManagerComponent', () => {
  let component: ModalCreateManagerComponent;
  let fixture: ComponentFixture<ModalCreateManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCreateManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
