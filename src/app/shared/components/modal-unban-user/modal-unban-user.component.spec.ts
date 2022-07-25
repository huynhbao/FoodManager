import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUnbanUserComponent } from './modal-unban-user.component';

describe('ModalUnbanUserComponent', () => {
  let component: ModalUnbanUserComponent;
  let fixture: ComponentFixture<ModalUnbanUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUnbanUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUnbanUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
