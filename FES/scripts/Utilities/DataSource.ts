export class DataSource {
    public Success: (e: { Sender: DataSource, Data: Array<any> }) => void
    constructor(public options: { Data?: Array<any>, Read?: (p: { Success: (data) => void }) => void }) {
        let that = this, op = that.options;
        if (op.Data && !op.Read){that._data=op.Data; op.Read = (p) => { p.Success(op.Data) };}
    }
    private _data: Array<any>
    public Read() {
        let that = this, options = that.options;
        options.Read({ Success: (data) => { that._data = data; that.Success({ Sender: that, Data: that.Data() }); } })
    }
    public Data(): Array<any> {
        return this._data || []
    }
}