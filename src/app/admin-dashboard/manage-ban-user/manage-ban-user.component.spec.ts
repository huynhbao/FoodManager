import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBanUserComponent } from './manage-ban-user.component';

describe('ManageBanUserComponent', () => {
  let component: ManageBanUserComponent;
  let fixture: ComponentFixture<ManageBanUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageBanUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBanUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
