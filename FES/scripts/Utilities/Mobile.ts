/**
 * judge mobile
 * recit from https://www.abeautifulsite.net/detecting-mobile-devices-with-javascript edited by Cory LaViska
 */
export class IsMobile {
   static Android() {
        return navigator.userAgent.match(/Android/i);
    }
    static BlackBerry() {
        return navigator.userAgent.match(/BlackBerry/i);
    }
    static iOS() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    }
    static Opera() {
        return navigator.userAgent.match(/Opera Mini/i);
    }
    static Windows() {
        return navigator.userAgent.match(/IEMobile/i);
    }
    static any() {
        return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
    }
};