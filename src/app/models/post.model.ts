import { Image } from "./image.model";
import { User } from "./user.model";

export interface Comment {
    id: string;
    content: string;
    createDate: Date;
    name: string;
    userId: string;
    userImageUrl: string;
}

export interface Post {
    id: string;
    user: User;
    title: string;
    content: string;
    publishedDate: Date;
    hashtag: string;
    status: number;
    totalComment: number;
    totalReact: number;
    postImages: Image[];
    postComments?: Comment[];
    reason: string;
    isSelected?: boolean;
}

export interface CreatePost {
    id?: string;
    title: string;
    content: string;
    hashtag: string;
    postImages: Image[];
}