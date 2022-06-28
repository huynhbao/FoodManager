import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRecipeCategoryComponent } from './manage-recipe-category.component';

describe('ManageRecipeCategoryComponent', () => {
  let component: ManageRecipeCategoryComponent;
  let fixture: ComponentFixture<ManageRecipeCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRecipeCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRecipeCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
