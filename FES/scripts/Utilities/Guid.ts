export class Guid {
    private static s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    public static NewId(): string {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }
    public static Validate(str: string): boolean {
        return new RegExp(/^{?[\da-f]{8}(-[\da-f]{4}){4}[\da-f]{8}\}?$/i).test(str);
    }
}