import jwt_decode from 'jwt-decode';

export class Utils {
    static getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        } catch (Error) {
            return null;
        }
    }
}
