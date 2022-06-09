export interface User {
    id: string;
    email?: string;
    name?: string;
    birthDate?: Date;
    phoneNumber?: string;
    imageUrl?: string;
    bio?: string;
    totalPost?: number;
    totalRecipe?: number;
    role?: string;
    createDate?: Date;
    status?: number;
    fullname?: string;
    avatarUrl?: string;
    isSelected?: boolean;
}