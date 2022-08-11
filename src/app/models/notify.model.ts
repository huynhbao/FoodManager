export interface Notify {
    dayYellowForIngredient: number;
    dayNotiForIngredient: number;
    dayNotiForPlan: number;
    timeAppSettings: TimeAppSettings[];
}

export interface TimeAppSettings {
    timeForNoti: number;
}