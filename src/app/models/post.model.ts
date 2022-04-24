import { User } from "./user.model";

export interface Post {
    id: string;
    user: User;
    title: string;
    content: string;
    img: string[];
    postDate: Date;
    status: number;
    isSelected?: boolean;
}