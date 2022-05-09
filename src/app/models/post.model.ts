import { Image } from "./image.model";
import { User } from "./user.model";

export interface Comment {
    id: string;
    content: string;
    createDate: Date;
    name: string;
    userId: string;
}

export interface Post {
    id: string;
    user: User;
    title: string;
    content: string;
    publishedDate: Date;
    status: number;
    totalComment: number;
    totalReact: number;
    postImages: Image[];
    postComments?: Comment[];
    isSelected?: boolean;
}