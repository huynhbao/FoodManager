export interface ReportPost {
    id: string,
    postId: string,
    userId: string,
    userName: string,
    postTitle: string,
    title: string,
    content: string,
    createDate: Date,
    status: number
    isSelected?: boolean
}