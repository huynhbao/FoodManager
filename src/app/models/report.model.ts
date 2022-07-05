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

export interface ReportRecipe {
    id: string,
    recipeId: string,
    userId: string,
    userName: string,
    recipeName: string,
    title: string,
    content: string,
    createDate: Date,
    status: number
    isSelected?: boolean
}

export interface ReportUser {
    id: string,
    reportedUserId: string,
    userId: string,
    userName: string,
    reportedUserName: string,
    title: string,
    content: string,
    createDate: Date,
    status: number
    isSelected?: boolean
}