import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRecipeAdministratorComponent } from './manage-recipe-administrator.component';

describe('ManageRecipeAdministratorComponent', () => {
  let component: ManageRecipeAdministratorComponent;
  let fixture: ComponentFixture<ManageRecipeAdministratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRecipeAdministratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRecipeAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
