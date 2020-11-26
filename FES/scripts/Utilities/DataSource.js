define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataSource = (function () {
        function DataSource(options) {
            this.options = options;
            var that = this, op = that.options;
            if (op.Data && !op.Read) {
                that._data = op.Data;
                op.Read = function (p) { p.Success(op.Data); };
            }
        }
        DataSource.prototype.Read = function () {
            var that = this, options = that.options;
            options.Read({ Success: function (data) { that._data = data; that.Success({ Sender: that, Data: that.Data() }); } });
        };
        DataSource.prototype.Data = function () {
            return this._data || [];
        };
        return DataSource;
    }());
    exports.DataSource = DataSource;
});
