import { User } from "./user.model";

export interface Post {
    id: number;
    user: User;
    title: string;
    content: string;
    img: string[];
    postDate: Date;
    status: number;
}