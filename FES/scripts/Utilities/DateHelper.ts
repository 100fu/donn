export interface IDateStandar {
    weekOfYear(date: Date): number
    /** 获取该周的日期  day为第几天 默认第一天=0*/
    dateOfWeek(year: number, weekOfYear: number, day?: number): Date
    /**只包含 yyyy WW 默认 yyyy-WW => 1990-W53 (W01) 不可以和时间 一起显示  */
    weekFormat(date: Date, format?: string): string
    fullYear(date: Date): number
}
class ISODateStandar implements IDateStandar {
    weekOfYear(date: Date): number {
        let target = new Date(date.valueOf()), dayNr = (date.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNr + 3);
        let thisThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() != 4) target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        return 1 + Math.ceil((thisThursday - target.valueOf()) / 604800000);
    }
    dateOfWeek(year: number, weekOfYear: number, day: number = 0): Date {
        let target = new Date(year, 0, 4 + (weekOfYear - 1) * 7)
        target.setDate(target.getDate() - (target.getDay() + 6) % 7 + day)
        return target;
    }
    weekFormat(date: Date, format?: string): string {
        return (format || "yyyy-WW").replace(/yyyy/g, this.fullYear(date).toString()).replace(/WW/g, "W" + this.weekOfYear(date).toString())
    }
    fullYear(date: Date): number {
        let target = new Date(date.valueOf());
        target.setDate(target.getDate() - ((date.getDay() + 6) % 7) + 3);
        return target.getFullYear();
    }
}
class DateStandars extends Patterns.SimplyFactory<IDateStandar> {
    private iso: IDateStandar = Patterns.Singleton(ISODateStandar, true)
}
/**时间日期标准s  { Generate(name: string):System.DateEx.IDateStandar}  name:["iso"]*/
export let DateStandar: () => {
    /**时间日期标准s  { Generate(name: string):System.DateEx.IDateStandar}  name:["iso"]*/
    Generate(name: string): System.DateEx.IDateStandar
} = Patterns.Singleton(DateStandars, true);