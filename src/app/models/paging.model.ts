import { Post } from "./post.model";

export interface Paging {
    page: number;
    size: number;
    totalItem: number;
    totalPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    isFirst: boolean;
    isLast: boolean;
    items: Post[];
}