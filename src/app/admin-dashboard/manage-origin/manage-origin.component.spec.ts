import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOriginComponent } from './manage-origin.component';

describe('ManageOriginComponent', () => {
  let component: ManageOriginComponent;
  let fixture: ComponentFixture<ManageOriginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageOriginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOriginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
