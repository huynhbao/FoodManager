import { User } from "./user.model";

export interface RecipeImage {
  imageUrl: string;
  orderNumber: number;
  status: number;
  isThumbnail: boolean;
}

export interface RecipeCategory {
  recipeCategoryId: string;
  recipeCategoryName: string;
}

export interface RecipeIngredient {
  ingredientDbid: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  isMain: boolean;
  status: number;
}

export interface RecipeMethod {
  content: string;
  recipeMethodImages: RecipeImage[];
  step: number;
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
  reason: string;
  status: number;
  isSelected?: boolean;
  manyToManyRecipeCategories: RecipeCategory[];
  recipeIngredients: RecipeIngredient[];
  recipeMethods: RecipeMethod[];
  recipeImages: RecipeImage[];
  totalRatingPoint: number;
}

export interface CreateRecipe {
  originId: string;
  cookingMethodId: string;
  recipeName: string;
  description: string;
  preparationTime: number;
  cookingTime: number;
  serves: number;
  calories: number;
  hashtag: string;
  manyToManyRecipeCategories: RecipeCategory[];
  recipeImages: RecipeImage[];
  recipeIngredients: RecipeIngredient[];
  recipeMethods: RecipeMethod[];
  manyToManyRecipeNutritions: [];
}