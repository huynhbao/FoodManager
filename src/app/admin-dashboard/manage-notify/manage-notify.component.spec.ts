import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNotifyComponent } from './manage-notify.component';

describe('ManageNotifyComponent', () => {
  let component: ManageNotifyComponent;
  let fixture: ComponentFixture<ManageNotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageNotifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
