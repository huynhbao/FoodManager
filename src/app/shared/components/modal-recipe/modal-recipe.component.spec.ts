import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRecipeComponent } from './modal-recipe.component';

describe('ModalRecipeComponent', () => {
  let component: ModalRecipeComponent;
  let fixture: ComponentFixture<ModalRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRecipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
