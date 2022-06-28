import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportRecipeComponent } from './report-recipe.component';

describe('ReportRecipeComponent', () => {
  let component: ReportRecipeComponent;
  let fixture: ComponentFixture<ReportRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportRecipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
