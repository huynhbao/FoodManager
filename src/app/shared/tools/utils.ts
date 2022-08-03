import { FormControl } from "@angular/forms";
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
        var res = await fetch(imageUrl, {mode: 'no-cors'});
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

    static isURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(str);
    }

    static noWhitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }

    static capitalize(s)
    {
      return s && s[0].toUpperCase() + s.slice(1);
    }
}
