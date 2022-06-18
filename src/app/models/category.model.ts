export interface Category {
    id: string;
    categoryName: string;
    createDate?: Date;
    status?: number;
}

export interface RecipeCategory {
    id: string;
    recipeCategoryName: string;
    status?: number;
}

export interface RecipeOrigin {
    id: string;
    originName: string;
    status?: number;
    isSelected?: boolean;
}

export interface RecipeMethod {
    id: string;
    cookingMethodName: string;
    status?: number;
}