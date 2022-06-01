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

    static async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {
        var reader  = new FileReader();
        reader.addEventListener("load", function () {
            resolve(reader.result);
        }, false);
        reader.onerror = () => {
        return reject(this);
        };
        reader.readAsDataURL(blob);
    })
    }
}
