export enum ErrorMessage {
  WRONG_CODE = 'wrong-code',
  USER_NOT_FOUND = 'user not found'
}

export enum PostStatus {
  DISABLE = 0,
  ACTIVE = 1,
  PENDING = 2,
  DENIED = 3
}

export class AppConst {
  public static ADMIN_STR = 'ADMIN';
  public static MANAGER_STR = 'MANAGER';
  public static API_CLOUDINARY = "486887632837147"
  public static UPLOAD_PRESET_CLOUDINARY = "fooma_media"
  public static FOLDER_CLOUDINARY = "fooma"
}
