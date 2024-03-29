export interface Ingredient {
    id: string;
    categoryId: string;
    ingredientName: string;
    createDate: Date;
    imageUrl: string;
    status: number;
    categoryName: string;
    unit: string;
    freeze: Date;
    cool: Date;
    normal: Date;
    isSelected?: boolean;
}