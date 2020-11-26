var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./Mediator", "./Observerable"], function (require, exports, Mediator_1, Observerable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObserMediator = (function (_super) {
        __extends(ObserMediator, _super);
        function ObserMediator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ObserMediator.prototype.Register = function (subject, fn, type) {
            _super.prototype.Register.call(this, typeof subject === "string" ? subject : subject.Id, fn, type);
        };
        ObserMediator.prototype.Change = function (subject, type, value) {
            var id = typeof subject === "string" ? subject : subject.Id, item = this.Storage.filter(function (s) { return s.Id === id; })[0];
            if (item)
                item.ForEach(function (i) {
                    if (type && i.Type != type)
                        return;
                    var p = new Observerable_1.ObserverMsg();
                    p.Type = type;
                    p.Value = value;
                    p.Sender = subject;
                    i.Data(p);
                });
        };
        ObserMediator.prototype.Unregister = function (subject, fn, type) {
            _super.prototype.Register.call(this, typeof subject === "string" ? subject : subject.Id, fn, type);
        };
        return ObserMediator;
    }(Mediator_1.Mediator));
    var mediator = new ObserMediator();
    var ObserverableWMediator = (function (_super) {
        __extends(ObserverableWMediator, _super);
        function ObserverableWMediator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ObserverableWMediator.prototype.SetState = function (type, value) {
            if (value) {
                var state = this.StateTable.filter(function (s) { return s.type == type; })[0];
                if (state) {
                    if (value !== state.value) {
                        mediator.Change(this, type, value);
                    }
                }
                else {
                    this.StateTable.push(state);
                    mediator.Change(this, type, value);
                }
            }
            else {
                mediator.Change(this, type, value);
            }
        };
        /**
         * Bind [, ownObj?: Object, ...otherData: any[]]可直接对fn进行bind
         * @param type
         * @param fn
         */
        ObserverableWMediator.prototype.Bind = function (type, fn) {
            mediator.Register(this, fn, type);
        };
        /**
         * Once [, ownObj?: Object, ...otherData: any[]]可直接对fn进行bind
         * @param type
         * @param fn
         */
        ObserverableWMediator.prototype.Once = function (type, fn) {
            mediator.Register(this, fn, type);
        };
        return ObserverableWMediator;
    }(Observerable_1.Observerable));
    exports.ObserverableWMediator = ObserverableWMediator;
});
