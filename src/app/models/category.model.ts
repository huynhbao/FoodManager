export interface Category {
    id: string;
    categoryName: string;
    imageUrl?: string;
    createDate?: Date;
    status?: number;
}

export interface RecipeCategory {
    id: string;
    recipeCategoryName: string;
    imageUrl?: string;
    status?: number;
}

export interface RecipeOrigin {
    id: string;
    originName: string;
    imageUrl?: string;
    status?: number;
    isSelected?: boolean;
}

export interface RecipeMethod {
    id: string;
    cookingMethodName: string;
    imageUrl?: string;
    status?: number;
}