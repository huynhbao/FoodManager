import { User } from "./user.model";

export interface RecipeCategory {
  recipeCategoryId: string;
  recipeCategoryName: string;
}

export interface RecipeIngredient {
    ingredientDbid: string;
    ingredientName: string;
    quantity: number;
    isMain: boolean;
    status: number;
  }

export interface Recipe {
  id: string;
  user: User;
  originId: string;
  originName: string;
  cookingMethodId: string;
  cookingMethodName: string;
  recipeName: string;
  createDate: Date;
  description: string;
  thumbnail: string;
  preparationTime: number;
  cookingTime: number;
  serves: number;
  calories: number;
  hashtag: string;
  status: number;
  isSelected?: boolean;
  manyToManyRecipeCategories: RecipeCategory[];
  recipeIngredients: RecipeIngredient[];
}
