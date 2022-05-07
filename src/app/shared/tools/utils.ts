import { JwtHelperService } from "@auth0/angular-jwt";

export class Utils {
    
    static getDecodedAccessToken(token: string): any {
        const helper = new JwtHelperService();
        try {
            return helper.decodeToken(token);
        } catch (Error) {
            return null;
        }
    }
}
