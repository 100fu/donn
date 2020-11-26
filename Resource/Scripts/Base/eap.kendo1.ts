/// <reference path="eap.ui1.ts" />


(function ($: any, h, c?) {
    var a = $([]), e = $.resize = $.extend($.resize, {}), i, k = "setTimeout", j = "resize", d = j + "-special-event", b = "delay", f = "throttleWindow";
    e[b] = 250; e[f] = true;
    $.event.special[j] = {
        setup: function () {
            if (!e[f] && this[k]) { return false } var l = $(this); a = a.add(l); $.data(this, d, { w: l.width(), h: l.height() });
            if (a.length === 1) { g() }
        },
        teardown: function () {
            if (!e[f] && this[k]) {
                return false
            }
            var l = $(this);
            a = a.not(l);
            l.removeData(d);
            if (!a.length) {
                clearTimeout(i)
            }
        },
        add: function (l): any {
            if (!e[f] && this[k]) {
                return false
            } var n; function m(s, o, p) {
                var q = $(this), r = $.data(this, d); r.w = o !== c ? o : q.width(); r.h = p !== c ? p : q.height(); n.apply(this, arguments)
            }
            if ($.isFunction(l)) {
                n = l; return m
            }
            else { n = l.handler; l.handler = m }
        }
    };
    function g() {
        i = h[k](function () {
            a.each(function () {
                var n = $(this), m = n.width(), l = n.height(), o = $.data(this, d);
                if (m !== o.w || l !== o.h) {
                    n.trigger(j, [o.w = m, o.h = l])
                }
            }); g()
        }, e[b])
    }
})(jQuery, this);// 在代码里面我们可以直接使用 $("#div").resize(function(){...});

//Calendar
namespace EAP.UI {
    export interface IVinciCalendarOptions extends kendo.ui.CalendarOptions {
        resultOptions?: Function
        showWeeks?: boolean
    }
    export class VinciCalendarOptions implements IVinciCalendarOptions {
        name: string = undefined
        culture: string = undefined
        dates: any = undefined
        depth: string = undefined
        disableDates: any | Function = undefined
        footer: string | Function = undefined
        format: string = undefined
        max: Date = undefined
        min: Date = undefined
        weekNumber: boolean = true
        month: kendo.ui.CalendarMonth = undefined
        start: string = undefined
        value: Date = undefined
        change(e: kendo.ui.CalendarEvent): void { }
        navigate(e: kendo.ui.CalendarEvent): void { }
        public weekCountTitle: string = System.CultureInfo.GetDisplayText('Week')
        resultOptions(): VinciCalendarOptions {
            return this;
        }
        constructor(options?: any) {
            if (options) {
                if (options instanceof VinciCalendarOptions)
                    return options;
                $.extend(true, this, options);
            }
        }

        showWeeks: boolean = true
    }
    export class VinciCalendar extends kendo.ui.Calendar {
        month; footer
        constructor(element: Element, options?: IVinciCalendarOptions) {
            super(element, new VinciCalendarOptions(options).resultOptions())//undefined
        }
        _templates() {
            var that = this, options = that.options, footer = options.footer, month = options.month, content = month.content, weekNumber = month.weekNumber, empty = month.empty, sd = System.DateEx.DateStandar().Generate('iso');
            that.month = {
                content: kendo.template('<td#=data.cssClass# role="gridcell"><a tabindex="-1" class="k-link#=data.linkClass#" href="#=data.url#" ' + kendo["attr"]('value') + '="#=data.dateString#" title="#=data.title#">' + (content || '#=data.value#') + '</a></td>', { useWithBlock: !!content }),
                empty: kendo.template('<td role="gridcell">' + (empty || '&nbsp;') + '</td>', { useWithBlock: !!empty }),
                weekNumber: (d) =>
                    '<td class="k-alt">' + sd.weekOfYear(d.currentDate) + '</td>'  // 之前使用kendo.date.weekInYear(d.currentDate) 2017r1中代码有错误
            };
            that.footer = (footer as any) !== false ? kendo.template(footer as string || '#= kendo.toString(data,"D","' + options.culture + '") #', { useWithBlock: false }) : null;
        }
    }
    VinciCalendar.fn = VinciCalendar.prototype;
    VinciCalendar.fn.options = $.extend(true, {}, kendo.ui.Calendar.fn.options);
    VinciCalendar.fn.options.name = "VinciCalendar";
    kendo.ui.plugin(VinciCalendar);
}
//VinciWeekCalendar
namespace EAP.UI {
    export interface IVinciWeekCalendarOptions {
        depth?: string
        start?: string
        value?: Date
        change(e: kendo.ui.CalendarEvent): void
        navigate(e: kendo.ui.CalendarEvent): void
        dateStandar?: string
    }
    export class VinciWeekCalendarOptions implements IVinciWeekCalendarOptions {
        depth: string = undefined
        start: string = undefined
        value: Date = undefined
        change: (e: kendo.ui.CalendarEvent) => void = undefined
        navigate: (e: kendo.ui.CalendarEvent) => void = undefined
        /**时间标准 默认iso 8601 */
        dateStandar: string = "iso"
        resultOptions(): VinciWeekCalendarOptions {
            return this;
        }
        constructor(options?: any) {
            if (options) {
                if (options instanceof VinciWeekCalendarOptions)
                    return options;
                $.extend(true, this, options);
            }
        }
    }
    let support = kendo.support,
        ui = kendo.ui,
        Widget = ui.Widget,
        keys = kendo.keys,
        parse = kendo.parseDate,
        template = kendo.template,
        cellTemplate = template('<td#=data.cssClass# role="gridcell"><a tabindex="-1" class="k-link" href="\\#" data-#=data.ns#value="#=data.dateString#">#=data.value#</a></td>', { useWithBlock: false }),
        emptyCellTemplate = template('<td role="gridcell">&nbsp;</td>', { useWithBlock: false }),
        browser = kendo.support.browser,
        ns = ".kendoCalendar",
        CLICK = "click" + ns,
        KEYDOWN_NS = "keydown" + ns,
        ID = "id",
        MIN = "min",
        LEFT = "left",
        SLIDE = "slideIn",
        MONTH = "month",
        CENTURY = "century",
        CHANGE = "change",
        NAVIGATE = "navigate",
        VALUE = "value",
        HOVER = "k-state-hover",
        DISABLED = "k-state-disabled",
        FOCUSED = "k-state-focused",
        OTHERMONTH = "k-other-month",
        OTHERMONTHCLASS = ' class="' + OTHERMONTH + '"',
        TODAY = "k-nav-today",
        CELLSELECTOR = "td:has(.k-link)",
        BLUR = "blur" + ns,
        FOCUS = "focus",
        FOCUS_WITH_NS = FOCUS + ns,
        MOUSEENTER = support.touch ? "touchstart" : "mouseenter",
        MOUSEENTER_WITH_NS = support.touch ? "touchstart" + ns : "mouseenter" + ns,
        MOUSELEAVE = support.touch ? "touchend" + ns + " touchmove" + ns : "mouseleave" + ns,
        MS_PER_MINUTE = 60000,
        MS_PER_DAY = 86400000,
        PREVARROW = "_prevArrow",
        NEXTARROW = "_nextArrow",
        ARIA_DISABLED = "aria-disabled",
        ARIA_SELECTED = "aria-selected",
        proxy = $.proxy,
        extend = $.extend,
        DATE = Date,
        views = {
            month: 0,
            year: 1,
            decade: 2,
            century: 3
        };
    function mousetoggle(e) {
        $(this).closest("tr").toggleClass(HOVER, MOUSEENTER.indexOf(e.type) > -1 || e.type == FOCUS);
    }
    function getToday() {
        var today = new DATE();
        return new DATE(today.getFullYear(), today.getMonth(), today.getDate());
    }
    export class VinciWeekCalendar extends EAP.UI.VinciCalendar {
        constructor(element: Element, options?: IVinciCalendarOptions) {
            super(element, new VinciWeekCalendarOptions(options).resultOptions())//undefined
            let that = this;
            that.element.off(MOUSEENTER_WITH_NS + " " + MOUSELEAVE)
            that.element.on(MOUSEENTER_WITH_NS + " " + MOUSELEAVE, CELLSELECTOR, mousetoggle)
            that["_addClassProxy"] = function () {
                that["_active"] = true;
                if (that["_cell"].hasClass(DISABLED)) {
                    var todayString = that["_view"].toDateString(getToday());
                    that["_cell"] = that["_cellByDate"](todayString);
                }
                that["_cell"].closest("tr").addClass(FOCUSED);
            }
            that["_removeClassProxy"] = function () {
                that["_active"] = false;
                that["_cell"].closest("tr").removeClass(FOCUSED);
            }
        }
        value(): any {
            let value: any = arguments[0], that = this, options = this.options as IVinciWeekCalendarOptions, index, ds = System.DateEx.DateStandar().Generate(options.dateStandar)
            if (value && typeof value === "string" && (index = (value as string).indexOf("-W")) != -1) {
                value = ds.dateOfWeek(parseInt(value.substr(0, 4)), parseInt(value.substr(index + 1, 3)))
            }
            let result: any = super.value(value as string) as any;
            if (result) {
                let ji
                switch (options.depth) {
                    case "month":
                        result = ds.weekFormat(result)
                        break;
                    case "year":
                        result = (result as Date).format("yyyy-MM")
                        break;
                    case "decade":
                        result = (result as Date).format("yyyy")
                        break;
                    default:
                        new Error("depth must be month,year,decade")
                }
            }
            return result;
        }
        _header() {
            var that = this,
                element = that.element,
                links;

            if (!element.find(".k-header")[0]) {
                element.html('<div class="k-header">' +
                    '<a href="#" role="button" class="k-link k-nav-prev"><span class="k-icon k-i-arrow-w"></span></a>' +
                    '<a href="#" role="button" aria-live="assertive" aria-atomic="true" class="k-link k-nav-fast"></a>' +
                    '<a href="#" role="button" class="k-link k-nav-next"><span class="k-icon k-i-arrow-e"></span></a>' +
                    '</div>');
            }

            links = element.find(".k-link")
                .on(MOUSEENTER_WITH_NS + " " + MOUSELEAVE + " " + FOCUS_WITH_NS + " " + BLUR, mousetoggle)
                .click(false);

            that["_title"] = links.eq(1).on(CLICK, function () { that["_active"] = that.options["focusOnNav"] !== false; that.navigateUp(); });
            that[PREVARROW] = links.eq(0).on(CLICK, function () { that["_active"] = that.options["focusOnNav"] !== false; that.navigateToPast(); });
            that[NEXTARROW] = links.eq(2).on(CLICK, function () { that["_active"] = that.options["focusOnNav"] !== false; that.navigateToFuture(); });
        }
        private _class(className, date) {
            let that = this,
                id = that["_cellID"],
                cell = that["_cell"] as JQuery,
                value = that["_view"].toDateString(date)

            if (cell) {
                cell.removeAttr(ARIA_SELECTED)
                    .removeAttr("aria-label")
                    .removeAttr(ID);
            }

            cell = that["_table"]
                .find("td:not(." + OTHERMONTH + ")").closest("tr")
                .removeClass(className).find("td:not(." + OTHERMONTH + ")")
                .filter(function () {
                    return $(this.firstChild).attr(kendo["attr"](VALUE)) === value;
                })
                .attr(ARIA_SELECTED, true);

            cell.closest("tr").addClass(className);

            if (cell[0]) {
                that["_cell"] = cell;
            }

            if (id) {
                cell.attr(ID, id);
                that["_table"].removeAttr("aria-activedescendant").attr("aria-activedescendant", id);
            }
        }
    }
    VinciWeekCalendar.fn = VinciWeekCalendar.prototype;
    VinciWeekCalendar.fn.options = $.extend(true, {}, EAP.UI.VinciCalendar.fn.options);
    VinciWeekCalendar.fn.options.name = "VinciWeekCalendar";
    kendo.ui.plugin(VinciWeekCalendar);
}

namespace EAP.UI {
    class VinciUIFactory extends UIAF {
        //Input()
        SearchBox(element: HTMLElement, options: IVinciSearchBoxOptions): VinciSearchBox {
            return new VinciSearchBox(element, options);
        }
        DateTimePicker(element: HTMLElement, options: IVinciDateTimePickerOptions): VinciDateTimePicker {
            return new VinciDateTimePicker(element, options);
        }
        DatePicker(element: HTMLElement, options: IVinciDatePickerOptions): VinciDatePicker {
            return new VinciDatePicker(element, options);
        }
        NumericTextBox(element: HTMLElement, options: IVinciNumericTextBoxOptions): VinciNumericTextBox {
            return new VinciNumericTextBox(element, options);
        }
        Input() { }
        //......
    }
    export interface IVinciUIOptions {
        //返回处理后的结果参数 （处理业务上默认选项等，dever 设置某些参数以设置的为准的情况）
        resultOptions?: Function
    }
    class VinciUIOptions<T extends kendo.Class> {
        public resultOptions(): any {
            return this;
        }
        protected getOptions(options?: any) {
            if (options) {
                if (options instanceof VinciUIOptions)
                    return options;
                return $.extend(this, options);
            }
        }
    }

    export let BaseContol = System.Object.Extends({
        events: [
        ],
        bind: function (eventName, fn) {
            this[eventName] = fn;
        },
    })
    ///规则 迭代获取所有勾选  迭代设置勾选但并不将子项勾选
    export let TreeControl = EAP.UI.ITreeControl.Extends({
        options: {},
        ctor: function (treeOption) {
            this.options = $.extend({}, treeOption);
            this.base(treeOption);
            this.initTree();
        },
        tree: null,
        initTree: function () {
            var that = this;
            var option = this.options;
            var op = {};

            if (option.showCheckBox == true) {
                op["checkboxes"] = {};
                op["checkboxes"].checkChildren = option.checkChildren;


                op["check"] = function (e) {
                    if (option.check) {
                        option.check(e);
                    }
                };

            }
            op["dataTextField"] = ["text"];
            //op.loadOnDemand = option.loadOnDemand;
            op["loadOnDemand"] = false;
            op["autoScroll"] = true;
            op["dragAndDrop"] = option.dragable;
            if (option.dragable) {
                op["dragend"] = option.dragend;
                op["drop"] = option.ondraging;
            }

            if (option.nodeClick) {
                op["select"] = option.nodeClick;
            }

            if (!option.showCheckBox && option.showIcon) {

                op["dataBound"] = function (e) {

                    if (!e.node) {
                        //$sprite.addClass('k-font-icon k-icon k-i-files');
                        //e.sender.element.find('.k-item:first > div span.k-in').prepend($sprite);
                        return;
                    }
                    var $sprite = $('<span class="k-sprite"></span>');
                    e.node.find('>div span.k-in').prepend($sprite);
                    if (e.sender.dataItem(e.node).children._data.length > 0) {
                        $sprite.addClass('tree-folder');
                        //$sprite.addClass('k-font-icon k-icon k-i-files');
                    }
                    else {
                        $sprite.addClass('tree-file');
                        //$sprite.addClass('k-font-icon k-icon k-i-file');
                    }

                    if (option.dataBound)
                        option.dataBound(e);
                }
            }
            jQuery(option.selector).kendoTreeView(op);
            this.tree = jQuery(option.selector).data('kendoTreeView');
            this.extendContent();
            if (option.requestOptions) {
                new EAP.EAMController().ExecuteServerAction(option.requestOptions.url, (option.requestOptions.postData || {}), function (data) {
                    if (data)
                        that.setTreeData(data);
                })
            }
        },

        extendContent: function () {
            let that = this;
            if (that.options.dblclick)
                that.tree.element.on("dblclick", ".k-in", (e: JQueryEventObject) => {
                    that.options.dblclick(that.tree.dataItem($(e.target).closest(".k-item")), e)
                })
        },
        expand: function () {
            this.tree.expand(this.tree.select());
        },
        expandall: function () {
            this.tree.expand(".k-item");
        },
        collapseall: function () {
            this.tree.collapse(".k-item");
        },
        collapse: function () {
            this.tree.collapse(this.tree.select());
        },
        setTreeData: function (treeData) {
            var treeSource = new kendo.data.HierarchicalDataSource({
                data: treeData,
                schema: {
                    model: {
                        children: "items"
                    }
                }
            });

            this.tree.setDataSource(treeSource);
        },

        getCheckedItems: function () {
            var checkedNodes = { ids: [], texts: [], items: [], dataSource: [] },
                treeView = this.tree
            this.enumNotes(treeView.dataSource.view(), checkedNodes, true);
            return checkedNodes;
        },
        /**枚举notes checked===undefined 取所有 依据leafOnly*/
        enumNotes: function (nodes, checkedNodes, checked) {
            checkedNodes = $.extend({ ids: [], texts: [], items: [], dataSource: [] }, checkedNodes)
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].hasChildren) {
                    this.enumNotes(nodes[i].children.view(), checkedNodes, checked);
                }
                //若仅使用叶子节点的同时，有存在孩子节点则该节点跳过
                if (this.options.leafOnly && nodes[i].children._data.length > 0)
                    continue;
                if (checked === nodes[i].checked || checked === undefined) {
                    checkedNodes.ids.push(nodes[i].id);
                    checkedNodes.texts.push(nodes[i].text);
                    checkedNodes.items.push({ id: nodes[i].id, text: nodes[i].text })
                    checkedNodes.dataSource.push(nodes[i])
                }
            }
        },
        //默认清理掉原先的 若noClearAll==true则不清理，默认勾选的逐层展开，noExpand==true则不展开
        _treeSelect: function (values, isCheckbox, noClearAll, noExpand) {
            var vArray;
            if (values instanceof Array) {
                vArray = values;
            } else if (typeof values === "string") {
                if (values.indexOf(',') > 0) {
                    vArray = values.split(',');
                }
                else {
                    vArray = [];
                    vArray.push(values);
                }
            } else {
                return;
            }
            //清空原有的
            if (!noClearAll && isCheckbox) {
                var all = this.tree.wrapper.find("input:checked");
                all.prop("checked", false);
                all.trigger('change');
            }
            for (var i = 0; i < vArray.length; i++) {
                var item = this.tree.dataSource.get(vArray[i]);
                if (!item) continue;
                var node = this.tree.findByUid(item.uid);
                if (isCheckbox) {
                    var dataItem = this.tree.dataItem(node);
                    dataItem.set('checked', true);
                    //var cb = node.find("input:checkbox");
                    //if (!cb.is(":checked")) {
                    //    cb.prop("checked", true);
                    //    cb.trigger("change");
                    //}
                }
                else {
                    this.tree.options.select({ sender: this.tree, node: node[0] });
                    this.tree.select(node);
                }
            }
            if (!noExpand) {
                var allP = this.tree.wrapper.find("input:checked").parents('.k-item');
                this.tree.expand(allP);
            }
        },
        getIdsByTexts: function (texts: Array<string>) {
            let result = [];
            this.viewNodesIteration(this.tree.dataSource.view(), (node) => {
                texts.forEach(t => {
                    if (t == node.text)
                        result.push(node.id);
                });
            });
            return result;
        },
        viewNodesIteration: function (nodes, fn: Function) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].hasChildren) {
                    this.viewNodesIteration(nodes[i].children.view(), fn);
                }
                fn(nodes[i]);
            }
        },

        //向下选择 nodes,filterNode 必填 filterNode筛选节点
        checkItemsDownward: function (nodes, filterNode) {
            if (!nodes) return
            if (!(nodes instanceof Array) && !nodes.length) nodes = [nodes];
            if (nodes.length <= 0) return;
            var that = this;
            var callerArgs = arguments;
            $.each(nodes, function myfunction(index, node) {
                var dataItem, checked;

                dataItem = that.tree.dataItem(node);

                if (callerArgs.length > 2) {
                    checked = callerArgs[2];
                    ///筛选节点
                    if (typeof filterNode === "function" && filterNode(node) === false) return;
                    dataItem.set('checked', checked);
                }
                else {
                    checked = dataItem.checked;
                }
                var cUl = $(node).children('ul');
                if (cUl.length <= 0) return;
                var children = cUl[0].children;
                if (children && children.length > 0) {
                    that.checkItemsDownward(children, filterNode, checked);
                }
            });
        },
        //向上选择 nodes,filterNode 必填 filterNode筛选节点
        checkItemsUpward: function (nodes, filterNode) {
            if (!nodes) return
            if (!(nodes instanceof Array) && !nodes.length) nodes = [nodes];
            if (nodes.length <= 0) return;
            var that = this;
            var callerArgs = arguments;
            $.each(nodes, function myfunction(index, node) {
                var dataItem, checked;

                dataItem = that.tree.dataItem(node);
                checked = dataItem.checked;

                var all = true;
                var sibs = $(node).siblings('li');
                for (var i = 0; i < sibs.length; i++) {
                    if (that.tree.dataItem(sibs[i]).checked !== checked) {
                        all = false;
                        return;
                    }
                }
                if (all) {
                    var pLi = $(node).parents('li[role="treeitem"]:first'); //div[data-role="treeview"] >
                    if (pLi.length <= 0)
                        return;
                    if (typeof filterNode === "function" && filterNode(pLi) === false)
                        return;
                    that.tree.dataItem(pLi).set('checked', checked);
                    that.checkItemsUpward(pLi, filterNode);
                }
            });
        },

        _expandNode: function (node) {
            if (!node) {
                this.expandall();
                return;
            }
            this.tree.expand(this.tree.findByText(node.text));
        },
        _collapseNode: function (node) {
            if (!node) {
                this.collapseall();
                return;
            }
            this.tree.collapse(this.tree.findByText(node.text));
        },
        //展开根目录
        expandFirst: function () {
            this.tree.expand('.k-item:first');
        },
        selecteItem: function () {

            return this.tree.dataItem(this.tree.select());
        }
    })
    /**older 弃用 请使用VinciToolBar*/
    export class ToolbarControl {
        toolbar: VinciToolBar
        /**older 弃用 请使用VinciToolBar*/
        constructor(public option: any) {
            this.toolbar = jQuery(option.selector).kendoVinciToolBar(this.option).data("kendoVinciToolBar")
        }
    }
    export class VinciToolBarItem implements kendo.ui.ToolBarItem {
        attributes?: any = undefined;
        buttons?: kendo.ui.ToolBarItemButton[] = undefined;
        click?: Function = undefined;
        enable?: boolean = undefined;
        group?: string = undefined;
        hidden?: boolean = undefined;
        icon?: string = undefined;
        id?: string = undefined;
        imageUrl?: string = undefined;
        menuButtons?: kendo.ui.ToolBarItemMenuButton[] = undefined;
        /** @type {boolean} 是否是结构与menuButtons 一起使用 若true 则menuButtons,buttons仅是模板 items中存在对应的项那么将会移除，替代的menuButtons,buttons的项将会显示，若没有相应的项则该menuButtons,buttons将不显示*/
        isStructure?: boolean = undefined
        overflow?: string = undefined;
        overflowTemplate?: string | Function = undefined;
        primary?: boolean = undefined;
        selected?: boolean = undefined;
        showIcon?: string = undefined;
        showText?: string = undefined;
        spriteCssClass?: string = undefined;
        template?: string | Function = undefined;
        text?: string = undefined;
        togglable?: boolean = undefined;
        toggle?: Function = undefined;
        type?: string = undefined;
        url?: string = undefined;
    }
    export interface IVinciToolBarOptions extends kendo.ui.ToolBarOptions {
        code?: string
        readUrl?: System.UrlObj
        pull: boolean
        owner: any
    }
    export class VinciToolBarOptions extends VinciUIOptions<VinciToolBarOptions> implements IVinciToolBarOptions {
        resizable: boolean = undefined;
        items: VinciToolBarItem[] = [];
        /** @description   任何item被点击都会触发，使用e.id 来进行区分
         * @param {kendo.ui.ToolBarClickEvent} e - 事件对象详细
        * @return {void} */
        click: (e: kendo.ui.ToolBarClickEvent) => void = undefined;
        close: (e: kendo.ui.ToolBarCloseEvent) => void = undefined;
        open: (e: kendo.ui.ToolBarOpenEvent) => void = undefined;
        toggle: (e: kendo.ui.ToolBarToggleEvent) => void = undefined;
        overflowClose: (e: kendo.ui.ToolBarOverflowCloseEvent) => void = undefined;
        overflowOpen: (e: kendo.ui.ToolBarOverflowOpenEvent) => void = undefined;
        /** @type {any} 不建议使用，若click已经定义则owner无用 */
        owner: any
        /** @type {string}  页面权限code 可不填*/
        code: string = undefined
        /** @typedef {System.UrlObj} 若有特殊url值 可自行设置 默认无需填写 */
        readUrl: System.UrlObj = undefined
        /** @type {boolean} 默认false 是否从服务端拉取*/
        pull: boolean = undefined
        constructor(options?: any) {
            super()
            if (options) {
                if (options instanceof VinciToolBarOptions)
                    return options;
                return $.extend(this, options);
            }
        }
        resultOptions(): VinciToolBarOptions {
            if (this.pull) {
                if (this.code && this.readUrl) {
                    this.readUrl.parameters = { code: this.code };
                }
                let items = this._getItems(this.readUrl);
                if ($.isArray(items) && $.isArray(this.items)) {
                    this.items.forEach(item => {
                        if (item.menuButtons) item.type = "splitButton";
                        if (!item.isStructure) return;//不是模版 则正常使用
                        let temperary = items.concat(item.buttons || item.menuButtons), o = {}, ea = [], e, i, a = []
                        for (i = 0; e = temperary[i]; i++) {
                            if (i < items.length) o[e.id] = e
                            else if (o[e.id]) {
                                ea.push(e);
                                delete o[e.id]
                            }
                        }
                        for (i in o) { if (o.hasOwnProperty(i)) a.push(o[i]) }
                        items = a;
                        if (item.buttons) item.buttons = ea;
                        else if (item.menuButtons) item.menuButtons = ea;
                    })
                }
                this.items = (items || []).concat(this.items || []).distinct(
                    i =>
                        i.id)
            }
            // 具有buttons的情况未实现 先不实现
            this.items.forEach(item => {
                //icon  spriteCssClass也存在问题，要自定义样式同时需要按钮图标则需手动加上 EAM.ButtonsIcon.getIconClass(item["id"] || "")
                if (!item.spriteCssClass)
                    item.spriteCssClass = EAM.ButtonsIcon.getIconClass(item["id"] || "")

                if (item.menuButtons) return;
                //tooltip --title ,没有title 用text
                if (!item.attributes)
                    item.attributes = { 'title': item["title"] || item["text"] };
                else if (!item.attributes.title) {
                    item.attributes.title = item["title"] || item["text"];
                }
            })
            let that = this, cb = that.owner;
            this.click = this.click || (cb ? function (e) {
                if (that.owner[e.id]) that.owner[e.id]();
            } : undefined)
            return this;
        }
        _getItems(url) {
            let items = [], result;
            if (url)
                result = new EAP.EAMController().ExecuteServerActionSync(url, {});
            else
                result = System.Permission.getPermissions(this.code)
            if (result && $.isArray(result))
                result.forEach(item => {
                    items.push({ type: 'button', text: System.CultureInfo.GetDisplayText(item), id: item });
                })
            return items;
        }
    }
    export class VinciToolBar extends kendo.ui.ToolBar {
        constructor(element: Element, options: IVinciToolBarOptions) {
            super(element, new VinciToolBarOptions(options).resultOptions());
            this.menuButtonProcess();
        }
        private menuButtonProcess() {
            let that = this, options = this.options as VinciToolBarOptions, items = options.items;
            if (!items) return;
            items.forEach(item => {
                if (item.menuButtons) {
                    let b = $(that.element).find("#" + item.id + "_wrapper").data("splitButton");
                    (b.arrowButton as JQuery).hide();
                    (b.element as JQuery).hover(() => {
                        b.popup.open()
                    }, () => { })
                }
            })
        }
    }
    VinciToolBar.fn = VinciToolBar.prototype;
    VinciToolBar.fn.options = $.extend(true, {}, kendo.ui.ToolBar.fn.options);
    VinciToolBar.fn.options.name = "VinciToolBar";
    kendo.ui.plugin(VinciToolBar);

    export let TreeListControl = EAP.UI.ITreeListControl.Extends({
        kTreeList: {},
        option: {},
        originCols: [],
        ctor: function (option) {
            this.option = {};
            $.extend(this.option, option);
            this.originCols = [];
            $.extend(this.customCols, option.columns);
            this._init();
        },
        _init: function () {
            var that = this;
            var option = this.option;

            if (option.gridSolutionId) {
                option.columns = EAP.UI.GetGridColumns(option.gridSolutionId, option.columns);
            }

            var subHeadRow
            if (option.columns && option.columns.subColumns && option.columns.subColumns.columns)
                subHeadRow = this.getHeadElement(option.columns.subColumns.columns);
            option.columns = this.convertColumns(option.columns);

            var kTreeListOption = { columns: null, height: null, editable: null };
            kTreeListOption.columns = option.columns;
            kTreeListOption.height = option.height;
            kTreeListOption.editable = option.editable;
            //e.container jQuery  e.model kendo.data.TreeListModel  e.sender kendo.ui.TreeList
            //kTreeListOption.eidt = option.edit || function (e) {
            //    if (e.model.iAmChild) {

            //    }
            //};
            this.kTreeList = $(option.selector).kendoTreeList(kTreeListOption).data("kendoTreeList");

            if (subHeadRow) {
                $(subHeadRow).insertAfter(this.kTreeList.element.find('tr[role="row"]'));
            }
            var index;
            this.kTreeList.element.find('tbody').on("click", "tr", function (e) {
                var $tr = $(e.target).closest('tr');
                if (index === $tr.index()) {
                    //e.stopPropagation();
                    return;
                }
                index = $tr.index();
                that.kTreeList.saveRow();
                that.kTreeList.editRow($(e.target));
                e.stopPropagation();
            });
            $(document).on("click", function (e) {
                //that.kTreeList.saveRow();
            });
            //if (this.option.editable) {
            //    //result.push({ command: ["edit","cancel"] });
            //}
        },
        //element 生成表头
        getHeadElement: function (columns) {
            var tr = document.createElement("tr");
            var result = undefined;
            columns.forEach(function (data) {
                var th = document.createElement("th");
                //th.setAttribute("data-field", data.field);
                //th.setAttribute("data-title", data.title);
                th.classList.add("k-header");
                th.innerText = data.title;
                tr.appendChild(th)
            });
            result = tr;
            return result;
        },
        convertColumns: function (columns) {
            var index = 0;
            function getNewMaster(master, child) {
                var cObj = {};
                if (!master) {
                    master = { field: "index_" + index, title: "", template: function () { return ""; }, editable: false }
                    index++;
                }
                if (!child) {
                    child = { field: "index_" + index, title: "", template: function () { return ""; }, editable: false }
                    index++;
                }

                if (child.editable === false) {
                    child.editor = function (container, option) {
                        container.append(child.template(option.model));
                    };
                } else if (!child.editor) {
                    child.editor = function (container, option) {
                        var input = document.createElement("input");
                        input.name = child.field;
                        input.classList.add("k-input");
                        input.classList.add("k-textbox");
                        input.classList.add("k-valid");
                        container.append(input);
                    }
                }
                if (master.editable === false) {
                    master.editor = function (container, option) {
                        container.append(master.template(option.model));
                    };
                } else if (!master.editor) {
                    master.editor = function (container, option) {
                        var input = document.createElement("input");
                        input.name = master.field;
                        input.classList.add("k-input");//k-input k-textbox k-valid
                        input.classList.add("k-textbox");
                        input.classList.add("k-valid");
                        container.append(input);
                    }
                }

                $.extend(cObj, master);
                cObj["template"] = function (item) {
                    if (item.iAmChild && child && child.template) {
                        return child.template(item);
                    }
                    return master.template(item);
                };

                cObj["editor"] = function (container, options) {
                    if (options.model.iAmChild && child && child.editor) {
                        return child.editor(container, options);
                    }
                    return master.editor(container, options);
                };
                return cObj;
            };
            var result = columns;
            if (!(columns instanceof Array)) {
                result = [];
                if (!columns.subColumns) { result = columns.columns; }
                else {

                    var length = Math.max(columns.columns.length, columns.subColumns.columns.length);

                    for (var i = 0; i < length; i++) {
                        result.push(getNewMaster(columns.columns[i], columns.subColumns.columns[i]));
                    }
                }
            };



            result.forEach(function (o) {
                //o.width = 'auto';

                if (!o.template) {
                    o.template = function (rowvalue) {

                        var value = System.Reference(rowvalue, o.field) || "";

                        return value;
                    }
                }

                //设置列不可编辑 只有在option.editable=true 时有效



                //    if (o.filterable != false) {

                //        if (!o.filterable) {
                //            o.filterable = {};
                //        }

                //    }

                //    if (o.filterable.cell) {
                //        o.filterable.cell.showOperators = false;
                //    }
                //    else {
                //        o.filterable.cell = {
                //            showOperators: false
                //        }
                //    }

            });

            //var option = this.option;

            //if (option.showrowcheckbox) {
            //    var checkboxColumn = {
            //        headerTemplate: '<input class="checkbox" data-role="rowheadercheckbox" type="checkbox" />',
            //        template: '<input class="checkbox" data-role="rowcheckbox" type="checkbox" />',
            //        width: 35
            //    }


            //    columns.splice(0, 0, checkboxColumn);
            //}
            //return columns;


            return result;
        },
        setData: function (requestOption) {
            var option = this.option;
            var data = [];
            new EAP.EAMController().ExecuteServerActionSync(requestOption.url, requestOption.postdata, function (reponseData) {
                if (reponseData) {
                    data = requestOption.responseData(reponseData);
                }
            });
            this.loadData(data, requestOption.subGridField);
        },
        loadData: function (data, subGridField) {
            var option = this.option;
            var result = [];
            if (subGridField) {
                data.forEach(function (d) {
                    if (!d[option.id]) d[option.id] = Guid.NewId();
                    if (!d[option.parentId]) d[option.parentId] = null;
                    result.push(d);
                    var subitem = System.Reference(d, subGridField);
                    if (!subitem) return;
                    for (var i = 0; i < subitem.length; i++) {
                        if (!subitem[option.id]) subitem[i][option.id] = Guid.NewId();
                        if (!subitem[i][option.parentId]) subitem[i][option.parentId] = d[option.id];
                        subitem[i].iAmChild = true;
                    }
                    result = result.concat(subitem);
                });
            } else {
                result = data;
            }
            var dataSouce = new kendo.data.TreeListDataSource({
                data: result,
                schema: {
                    model: {
                        id: option.id,
                        parentId: "parentId",
                        fields: {
                            parentId: { field: option.parentId, nullable: true },
                        },
                        expanded: true
                    }
                }
            });

            this.kTreeList.setDataSource(dataSouce);
        },
        setOption: function (option) {

        },
        getDataSource: function () {

        },
        //更新td 对应原数据值
        updateValue: function (td, value, unique) {
            var $td = $(td);
            var $tr = $td.closest('tr');
            var index = $td.index();
            var head = this.kTreeList.wrapper.find(".k-grid-header-wrap th")[index];
            if (!head) return;
            var datafield = $(head).attr('data-field');
            if (!datafield) return;
            var item;
            if (unique) {
                var items = this.grid.dataItems();
                for (var i = 0; i < items.length; i++) {
                    item = items[i];
                    if (datafield.indexOf('.') != -1) {
                        var array = datafield.split('.');
                        for (var i = 0; i < array.length - 1; i++) {

                            item = item[array[i]];
                        }
                        item[array[array.length - 1]] = false;
                    } else {
                        item[datafield] = false;
                    }
                }
            }

            item = this.grid.dataItem($tr);

            if (datafield.indexOf('.') != -1) {
                var array = datafield.split('.');
                for (var i = 0; i < array.length; i++) {

                    item = item[array[i]];
                }

                item = value;
            } else {
                item[datafield] = value;
            }
        },
    })


    export let InputControl = System.Object.Extends({
        option: {},
        ctor: function (option) {
            this.option = option;
            this._init();
        },
        _init: function () {
            var option = this.option;
            var $obj = $(option.selector);
            $obj.addClass("k-textbox");
            if (option.readonly) {
                $obj.attr('readonly', '');
                $obj.addClass("formDisabled")
            }
            if (option.maxLength) {
                $obj.attr("maxlength", option.maxLength);
            }
            if (option.style)
                $obj.css(option.style);
        }
    })
    export let ColorPickerControl = System.Object.Extends({
        option: {},
        kColorPicker: {},
        ctor: function (option) {
            jQuery.extend(this.option, option);
            this._init(option);
        },
        _init: function (option) {
            var obj = $(option.selector)[0];
            if (option.palette && option.palette instanceof Array && option.palette.length > 0) {
                obj.setAttribute("kendo-ColorPicker", "");
                obj.setAttribute("k-options", "{columns: 4,tileSize: {width: 34,height: 19},palette:" + JSON.stringify(option.palette) + "}")
            }
            else {
                obj.setAttribute("kendo-ColorPicker", "");
            }
            if (option.style)
                $(obj).css(option.style);
        }
    })
    export let EditorControl = System.Object.Extends({
        option: {},
        kEditor: {},
        ctor: function (option) {
            jQuery.extend(this.option, option);
            this._init(option);
        },
        _init: function (option) {
            var obj = $(option.selector)[0];
            obj.setAttribute("kendo-Editor", "");
            if (option.style)
                $(obj).css(option.style);
        }
    })

    export interface IVinciDropDownListOptions extends kendo.ui.DropDownListOptions {
        subType?
        Data?
        readurl?
        postData?
        dataProcess?
        treeOptions?
        gridOptions?
        dataRequestOptions?
        subPopupWidth?: number
        multiple?: boolean
    }
    export class VinciDropDownListOptions implements IVinciDropDownListOptions, IVinciUIOptions {
        name: string
        animation: kendo.ui.DropDownListAnimation;
        autoBind: boolean = true
        cascadeFrom: string;
        cascadeFromField: string;
        dataSource: any | any | kendo.data.DataSource;
        dataTextField: string = "text"
        dataValueField: string = "value"
        delay: number;
        enable: boolean;
        filter: string;
        fixedGroupTemplate: string | Function;
        groupTemplate: string | Function;
        height: number;
        ignoreCase: boolean;
        index: number;
        minLength: number;
        //一般模式才使用
        popup: kendo.ui.DropDownListPopup;
        optionLabel: string | any;
        optionLabelTemplate: string | Function;
        headerTemplate: string | Function;
        template: string | Function;
        valueTemplate: string | Function;
        text: string;
        value: string;
        valuePrimitive: boolean;
        virtual: kendo.ui.DropDownListVirtual;
        change: (e: kendo.ui.DropDownListChangeEvent) => void;
        close: (e: kendo.ui.DropDownListCloseEvent) => void;
        dataBound: (e: kendo.ui.DropDownListDataBoundEvent) => void;
        filtering: (e: kendo.ui.DropDownListFilteringEvent) => void;
        open: (e: kendo.ui.DropDownListOpenEvent) => void;
        select: (e: kendo.ui.DropDownListSelectEvent) => void;
        cascade: (e: kendo.ui.DropDownListCascadeEvent) => void;

        set Data(array: Array<any> | kendo.data.ObservableArray) {
            this.dataSource = array
        }
        get Data(): Array<any> | kendo.data.ObservableArray {
            if (this.dataSource instanceof kendo.data.DataSource)
                return (this.dataSource as kendo.data.DataSource).data();
            return this.dataSource;
        }
        get data() {
            return this.Data
        }
        subType: string = 'general'
        readurl: System.UrlObj | string
        postData: any | EAP.UI.DataRequest
        dataProcess: (data: Array<any> | kendo.data.ObservableArray) => Array<any>
        treeOptions
        gridOptions
        dataRequestOptions
        subPopupWidth: number
        multiple: boolean = true //默认多选 只在grid tree 中有效 不建议在grid tree 中单选
        //readonly  style 看其他控件怎么写的
        constructor(options?: any) {
            if (options) {
                if (options instanceof VinciDropDownListOptions)
                    return options;
                $.extend(this, options);
            }
        }
        resultOptions(element?: Element): Object {
            if (this.gridOptions) this.subType == 'grid'
            if (this.treeOptions) this.subType == 'tree'
            if (this.subType == 'grid' || this.subType == 'tree') {
                if (element) element.setAttribute("readonly", "true")
            }
            else if (this.readurl) {
                this.dataSource = new kendo.data.DataSource({
                    transport: {
                        read: (p) => {
                            new EAP.EAMController().ExecuteServerActionSync(this.readurl, EAP.UI.DataRequest.convertPostdata(this.postData), (resData) => {
                                if (this.dataProcess) {
                                    resData = this.dataProcess(resData || []);
                                }
                                p.success(resData || [])
                            });
                        }
                    }
                })
            } else {
                if (this.dataProcess) {
                    this.Data = this.dataProcess(this.Data || []);
                }
            }
            return this;
        }
    }
    export class VinciDropDownList extends kendo.ui.DropDownList {
        subType: string = 'general'
        private otherPopup: kendo.ui.Popup //popup 与自身popup冲突
        public popupGrid: GridControl
        constructor(element: Element, options?: IVinciDropDownListOptions) {
            super(element, new VinciDropDownListOptions(options).resultOptions(element));
            if (options.subType == 'tree' || options.treeOptions) this._initTree();
            else if (options.subType == 'grid' || options.gridOptions) this._initGrid();

            this._configSetSource();
        }
        //设置setSource 回调
        private _configSetSource() {
            let that = this;
            this.bind("change", (e: kendo.ui.DropDownListChangeEvent) => {
                that.trigger("setSource");
            })
        }
        /**只有在长控件下使用该控件才适合*/
        private _initTree() {
            ////下拉树
            //var dropContainer = document.createElement('span');
            //dropContainer.setAttribute("flag", "container");
            //container.appendChild(dropContainer);
            ////dropdownlist
            //obj = window.document.createElement("select");
            //obj.setAttribute("controlName", oData.name);
            //if (oData.style)
            //    $(obj).css(oData.style);
            //dropContainer.appendChild(obj);
            //var kDropDownList = $(obj).kendoDropDownList().data("kendoDropDownList");
            //this.kendoControls[oData.name + "KDropDownList"] = kDropDownList;

            //var $dropdownRootElem = kDropDownList.element.closest("span.k-dropdown");
            //$dropdownRootElem.after("<span class='k-invalid-msg'  data-for='" + oData.name + "'></span>")
            //$dropdownRootElem.on("click", function (event) {
            //    var name = jQuery(event.target).closest('span[flag="container"]').find('select').attr("controlName");
            //    that.kendoControls[name + "KPopup"].open();
            //});

            ////bind inputElement
            //var bindInput = window.document.createElement("input");
            //bindInput.style.display = "none";
            //bindInput.name = oData.name;
            //bindInput.setAttribute("ng-model", 'data.' + bindInput.name);
            //dropContainer.appendChild(bindInput);
            ////tree
            //var treeDiv = window.document.createElement("div");
            ////识别Tree
            //treeDiv.setAttribute("appendixId", oData.name + "tree");
            //treeDiv.setAttribute("controlName", oData.name);
            //treeDiv.style.borderWidth = "1px";
            //treeDiv.style.width = $dropdownRootElem.outerWidth() + "px";
            //dropContainer.appendChild(treeDiv);
            //oData.treeOptions.selector = option.selector + " div[appendixId='" + oData.name + "tree']";

            //oData.treeOptions.nodeClick = function (e) {
            //    var selectedNode = e.sender.dataItem(e.node);
            //    var name = e.sender.element[0].getAttribute("controlName");
            //    var dropContainer = that.kendoControls[name + "KDropDownList"].wrapper.closest("span[flag='container']");

            //    var inputHidden = dropContainer.find("input[name='" + name + "']");
            //    inputHidden.val(selectedNode.id);
            //    inputHidden.trigger("change");
            //    that.kendoControls[name + "KDropDownList"].wrapper.find("span.k-input").text($(e.node).children("div").text());
            //    that.kendoControls[name + "KPopup"].close();
            //    if (e.sender.customChange)
            //        e.sender.customChange(e);
            //}

            //var treeControl = new EAP.UI.TreeControl(oData.treeOptions);
            //if (oData.onChange) {
            //    treeControl.tree.customChange = oData.onChange;
            //}

            ////KPopup
            //let kPopup = treeControl.tree.wrapper.kendoPopup({
            //    anchor: kDropDownList.wrapper
            //}).data("kendoPopup");
            //this.kendoControls[oData.name + "KPopup"] = kPopup;
            ////

            //this.kendoControls[oData.name + "KTree"] = treeControl.tree;
            //var data = [];
            //if (oData.treeOptions.readurl) {
            //    var client = new System.Net.HttpClient();
            //    client.post(oData.treeOptions.readurl, [], function (resourceArray) {
            //        if (typeof resourceArray === "string")
            //            data = JSON.parse(resourceArray);
            //        else
            //            data = resourceArray;
            //    }, false)
            //} else if (oData.treeOptions.Data) {
            //    data = oData.treeOptions.Data;
            //}
        }

        private _initGrid() {
            let that = this, first = false;
            that.subType = 'grid'
            that.bind("close", (e) => { e.preventDefault(); })
            that.wrapper.on("click", (event) => {
                that.otherPopup.element.outerWidth(options.subPopupWidth || that.element.outerWidth()) //options.subPopupWidth || that.element.outerWidth()
                that.otherPopup.open();
            });

            let gridDiv = document.createElement("div");
            document.getElementsByTagName('body')[0].appendChild(gridDiv);

            let options = that.options as IVinciDropDownListOptions;
            if (!options.gridOptions) {
                options.gridOptions = new EAP.UI.GridOption();
                options.gridOptions.columns = [{ field: options.dataTextField, title: System.CultureInfo.GetDisplayText("Name") }]
                //默认多选
                options.gridOptions.showrowcheckbox = options.multiple;
                if (!options.multiple) options.gridOptions.selectable = "row";
                //gridDiv.style.width = (options.subPopupWidth || that.element.outerWidth()) + "px";
            }
            options.gridOptions.pageable = false;
            options.gridOptions.selector = gridDiv;
            //options.gridOptions.selectable = "row";
            if (options.dataProcess)
                options.gridOptions.dataBinding = (e) => { options.dataProcess(e.items) }
            //自定义select方法
            options.gridOptions.change = function (e: kendo.ui.GridChangeEvent) {
                //赋值ddl 让ddl触发chang事件 依然使用ddl的
                let values = [], texts = [], selecteds = that.popupGrid.getSelectedRows() as Array<any>

                selecteds.forEach(obj => {
                    values.push(System.getValue(obj, options.dataValueField));
                    texts.push(System.getValue(obj, options.dataTextField));  //此处可以实现_format
                })
                let value = System.SetValue(System.SetValue({}, options.dataValueField, values), options.dataTextField, texts.join(","))
                that.setDataSource(new kendo.data.DataSource({ data: [value] }));
                that.select(0)
                that.trigger('change')
            };

            that.popupGrid = new EAP.UI.GridControl(options.gridOptions);
            let grid = that.popupGrid.grid as kendo.ui.Grid;
            grid.element.find(".k-grid-content").css({ maxHeight: "17em" })
            if (grid.columns.length == (options.multiple ? 2 : 1)) grid.element.find('.k-grid-header').hide();
            //KPopup
            that.otherPopup = that.popupGrid.grid.wrapper.kendoPopup({
                anchor: that.wrapper,
                activate: () => {
                }
            }).data("kendoPopup");
            if (options.Data && options.Data.length > 0) {
                that.popupGrid.setDataSource(options.Data);
                that.setDataSource(new kendo.data.DataSource({ data: [] }))
            } else {
                //loadData
                if (!options.dataRequestOptions) {
                    options.dataRequestOptions = new DataRequest(); options.dataRequestOptions.url = options.readurl;
                }
                options.dataRequestOptions.sync = true;
                that.popupGrid.setData(options.dataRequestOptions);
            }
        }
        public destroy() {
            if (this.popupGrid) { this.popupGrid.destroy(); delete this.popupGrid; }
            if (this.otherPopup) { this.otherPopup.destroy(); delete this.otherPopup; }
            super.destroy();
        }
    }
    VinciDropDownList.fn = VinciDropDownList.prototype;
    VinciDropDownList.fn.options = $.extend(true, {}, kendo.ui.DropDownList.fn.options);
    VinciDropDownList.fn.options.name = "VinciDropDownList";
    kendo.ui.plugin(VinciDropDownList);

    export let DropDownListControl = EAP.UI.BaseContol.Extends({
        option: {},
        defaultOption: {
            dataTextField: "text",
            dataValueField: "value"
        },
        kDropDownList: {},
        data: [],
        type: '',
        events: [
            "change",
            "setSource"
        ],
        _initEvent: function () {
            this.bind("change", this.option.onChange);
            this.bind("setSource", this.option.setSource);
        },
        ctor: function (option) {
            this.option = {};
            jQuery.extend(this.option, this.defaultOption, option);
            this._initEvent();
            if (option.Data || option.readurl || option.entityId) {
                this._initGeneral();
            }

            //TODO
        },
        _initGeneral: function () {
            var that = this;
            var option = this.option;
            this.type = 'general';
            let $obj = $(option.selector);
            if (option.readonly)
                $obj.attr('readonly', "true");
            if (option.style)
                $obj.css(option.style);
            var data;
            if (option.readurl) {
                //远程数据
                var client = new EAP.EAMController();
                client.ExecuteServerActionSync(option.readurl, EAP.UI.DataRequest.convertPostdata(option.postData), function (resData) {
                    if (!resData) data = [];
                    if (typeof resData === "string") {
                        resData = JSON.parse(resData);
                    }
                    if (option.bound)
                        data = option.bound(resData);
                    else
                        data = resData;

                });
            }
            else {
                data = option.Data;
            }
            if (option.dataProcess) {
                data = option.dataProcess(data);
            }
            this.data = data;
            //for (var s = 0; s < data.length; s++) {
            //    var selectOption = window.document.createElement("option");
            //    selectOption.value = data[s][option.dataValueField];
            //    selectOption.innerHTML = data[s][option.dataTextField];
            //    $obj[0].appendChild(selectOption);
            //}
            //if (option.onChange) {
            //    $obj.on("change", function (e) {
            //        var kDropdown = $(e.target).data("kendoDropDownList");
            //        option.onChange({ sender: kDropdown, target: e.target });
            //    });
            //}
            this.kDropDownList = $obj.kendoDropDownList({
                dataSource: { data: data },
                dataTextField: option.dataTextField,
                dataValueField: option.dataValueField,
                change: function (e) {
                    var item = e.sender.dataItem(); //e.sender.select()
                    if (!item) return;
                    var value = System.getValue(item, option.dataValueField);//this.value()  未使用这项的原因是有问题 $ undefined $
                    var text = System.getValue(item, option.dataTextField);
                    var d = { dataSource: item, sender: that, value: value, text: text, type: "general" }
                    if (that.setSource) that.setSource(d);
                    if (that.change) that.change(d);

                    // Use the value of the widget
                }
            }).data("kendoDropDownList");
        },
        setData: function (data) {
            var that = this;
            var option = this.option;
            var client = new EAP.EAMController();
            switch (this.type) {
                case 'general':
                    that.kDropDownList.setDataSource(new kendo.data.DataSource({ data: data }));
                    that.kDropDownList.trigger('change');
                    //if (option.onChange)
                    //    option.onChange({ sender: that.kDropDownList, target: null });
                    break;
                default:

            }
        },
        //设置readurl的使用
        reRead: function (isSync?) {
            var that = this;
            var option = this.option;
            var client = new EAP.EAMController();
            switch (this.type) {
                case 'general':
                    client[isSync ? "ExecuteServerActionSync" : "ExecuteServerAction"](option.readurl, option.postData, function (resData) {
                        let data = [];
                        if (resData) {
                            if (typeof resData === "string") {
                                resData = JSON.parse(resData);
                            }
                            if (option.bound)
                                data = option.bound(resData);
                            else
                                data = resData;
                            if (option.dataProcess) {
                                data = option.dataProcess(data);
                            }
                            that.data = data;

                            //set ddl
                            //对旧值进行处理 获取的值中不存在旧值得取第一个
                            if (that.kDropDownList._old != undefined && that.kDropDownList._old != null) {
                                var hasOldValue = false;
                                if ($.isArray(data)) {
                                    data.forEach(function (d) {
                                        var value = System.getValue(d, option.dataValueField);
                                        if (value === that.kDropDownList._old)
                                            hasOldValue = true;
                                    })
                                    if (!hasOldValue && data.length > 0) {
                                        that.kDropDownList.value(System.getValue(data[0], option.dataValueField))
                                    }
                                }
                            }

                            that.kDropDownList.setDataSource(new kendo.data.DataSource({ data: data }));
                            // that.kDropDownList.refresh();
                            that.kDropDownList.trigger('change');
                            //if (option.onChange)
                            //    option.onChange({ sender: that.kDropDownList, target: null });
                        }
                    });
                    break;
                default:

            }

        }
    })
    export let SearchBoxControl = EAP.UI.BaseContol.Extends({
        sizes: {
            mini: [260, 300],
            small: [280, 370],
            medium: [420, 300],
            big: [540, 320]
        },
        gridControl: {},
        option: {},
        type: "",
        selectItems: [],
        element: undefined,
        multValues: [],//用于多选存值
        events: [
            "change",
            "setSource"
        ],
        ctor: function (option) {
            this.option = { mathField: "Id" };
            $.extend(true, this.option, option);
            this._initEvent();
            this._init();
        },
        _initEvent: function () {
            //this.event = {};
            this.bind("change", this.option.onChange);
            this.bind("setSource", this.option.setSource);
        },
        _init: function () {
            var option = this.option;

            var input = <HTMLInputElement>$(option.selector)[0];
            var $input = $(input);
            this.element = input;

            var div = window.document.createElement("div");
            var size = this.sizes[option.windowSize ? option.windowSize : "small"];
            div.style.width = size[0] + "px";
            div.style.height = size[1] + "px";
            div.style.display = "none";
            $(div).insertAfter($input);
            var subDiv = document.createElement("div");
            subDiv.setAttribute("appendixId", option.name + "SubDiv");
            subDiv.setAttribute("controlName", option.name);
            div.appendChild(subDiv);
            var $div = $(div);
            var $subDiv = $(subDiv);
            var that = this;
            var sbOptions = {
                click: $.proxy(this.open, this),
                icon: null
            }

            var editable = option.editable;

            //tree
            if (option["treeOptions"]) {
                this.type = "tree";
                option.treeOptions.selector = $subDiv;
                if (option.treeOptions.style) {
                    $subDiv.css(option.treeOptions.style)
                }

                if (option.multiselect) {
                    option.treeOptions.showCheckBox = true;
                    option.treeOptions.check = function (e) {
                        let checkedNodes = that.treeControl.getCheckedItems();
                        that.selectItems = checkedNodes;
                        input.value = checkedNodes.texts.join(",");
                        if (that.setSource) that.setSource({ dataSource: checkedNodes, sender: that, value: input.value, type: "tree", text: input.value });
                        if (that.change) that.change({ dataSource: checkedNodes, sender: that, value: input.value, type: "tree", text: input.value });
                    };
                    sbOptions.icon = " k-i-rows";
                    option.treeOptions.leafOnly = true;
                }
                else {
                    var customNodeClick = option.treeOptions.nodeClick;
                    //使用select
                    option.treeOptions.nodeClick = function (e) {
                        var selectedNode = e.sender.dataItem(e.node);
                        that.selectItems = [selectedNode];
                        //var name = e.sender.element[0].getAttribute("controlName");
                        //that.sourceData[name] = selectedNode.id;
                        input.value = $(e.node).children("div").text();
                        e.type = "tree";
                        e.value = input.value;
                        e.dataSource = [selectedNode];
                        e.sender = that;
                        e.text = input.value;
                        $input.trigger("change");
                        if (!editable) {
                            if (that.setSource) that.setSource(e);
                            if (that.change) that.change(e);
                        }
                        that.window.close();
                        //if (customNodeClick)
                        //    customNodeClick(e);
                    }
                }


                this.treeControl = new EAP.UI.TreeControl(option.treeOptions);


            }
            //grid
            else if (option["gridOptions"]) {
                this.type = "grid";
                if (option.multiselect) {
                    option.gridOptions.showrowcheckbox = true;
                    option.gridOptions.change = function (e) {
                        //只赋值
                        that.gridControl.getSelectedRows()
                        let $target = $(e.target);
                        let checked = $target.prop('checked');
                        let dataItem = that.gridControl.grid.dataItem($target.closest('tr'));
                        that.setValue(dataItem, checked);
                    }
                    sbOptions.icon = " k-i-rows";
                } else {
                    //单选
                    option.gridOptions.selectable = "row";
                    option.gridOptions.change = function (e) {
                        var selectedObj = e.sender.dataItem(e.sender.select());
                        that.selectItems = [{ [option.mathField || "Id"]: System.getValue(selectedObj, option.mathField || "Id") }];
                        $input.val(that._format(selectedObj, option.format));
                        //为grid设置被选择的item 以后有需求可以进行拷贝复制
                        that.gridControl.checkedItems = that.selectItems;

                        if (that.setSource)
                            that.setSource({ dataSource: selectedObj, sender: that, value: input.value, type: "grid", text: input.value });
                        if (that.change)
                            that.change({ dataSource: selectedObj, sender: that, value: input.value, type: "grid", text: input.value });
                        that.window.close();
                    };
                }
                option.gridOptions.selector = subDiv;
                option.gridOptions.selectable = option.multiselect ? "multiple, row" : "row";
                option.gridOptions.filterable = { mode: "row" };
                var cloneCols = [];

                if (option.gridOptions.gridSolutionId) {
                    $.extend(true, cloneCols, option.gridOptions.columns);
                    this._getViewColumns(option.gridOptions);
                    option.gridOptions.columns = option.gridOptions.columns.concat(cloneCols || []);
                }
                //var gridHeight = (parseFloat(div.style.height) - 20);
                if (option.pageable) {
                    option.gridOptions.pageable = new EAP.UI.MiniPager().pagerOption;
                } else {
                    option.gridOptions.pageable = false;
                }
                //option.gridOptions.height = gridHeight;
                option.gridOptions.height = "98%";
                this.gridControl = new EAP.UI.GridControl(option.gridOptions);
                this.gridControl.grid.refresh();

                //this.gridControl.grid.setOptions({ resizable: true });
                //this.gridControl.grid.element.find("div.k-grid-content").height(gridHeight - 30);
            }


            this.searchBox = $input["kendoSearchBox"](sbOptions).data("kendoSearchBox");
            if (option.style.width) {
                input.parentElement.parentElement.style.width = option.style.width;
                option.style.width = parseFloat(option.style.width) - 26;
            }
            if (option.readonly) {
                $input.attr('readonly', '');
                $input.addClass("formDisabled")
            }
            if (option.maxLength) {
                $input.attr("maxlength", option.maxLength);
            }
            if (option.style)
                $input.css(option.style);
            if (option.name)
                input.setAttribute("name", option.name + "searchBox");
            if (!option.editable)
                input.onkeydown = function (e) {
                    e.preventDefault();
                }
            else
                $input.on("change", function (e) {
                    //根据input值勾选grid
                    that.setInputValue(input.value);

                    if (that.setSource) that.setSource({ dataSource: that.selectItems, sender: that, value: input.value, type: that.type, text: input.value });
                    if (that.change) that.change({ dataSource: that.selectItems, sender: that, value: input.value, type: that.type, text: input.value });
                });

            //window
            this.window = $div.kendoWindow({
                title: option.title,
                resizable: false,
                actions: [
                    "Close"
                ],
                modal: true,
                close: function () { }
            }).data("kendoWindow");

            this.initAutoComplete();
        },
        initAutoComplete: function () {
            if (typeof this.option.autoComplete == "boolean" && !this.option.autoComplete) return;
            if (this.option.gridOptions && this.option.editable && !this.option.multiselect) {
                let that = this;
                let schema = {
                    data: function (d) {
                        if (that.options.dateRequestOptions.responseData) {
                            return that.options.dateRequestOptions.responseData(d);
                        }
                        else {
                            return d.rows || d.Collection;
                        }
                    }
                };
                let opitons = new EAP.UI.VinciAutoCompleteOptions();
                opitons.dataTextField = this.option.gridOptions.columns[0].field;
                opitons.dataSource = new kendo.data.DataSource({
                    serverFiltering: true,
                    transport: {
                        read: function (p) {
                            let val = $(that.option.selector).val();
                            let postdate: any = $.extend({}, that.options.dateRequestOptions.postdata);
                            postdate.filter = { filters: [{ field: opitons.dataTextField, value: val, itemOperator: "contains" }], logic: "and" }
                            new EAP.EAMController().ExecuteServerAction(that.options.dateRequestOptions.url as string, postdate, function (data) {
                                p.success(data);
                            });
                        }
                    },
                    schema: schema
                });
                opitons.change = function (e) {
                    e.sender.element.trigger("change")
                }
                this.autoComplete = $(this.option.selector).kendoVinciAutoComplete(opitons).data("kendoVinciAutoComplete");
                (this.autoComplete as EAP.UI.VinciAutoComplete).wrapper.css({ lineHeight: "1.7em" })
            }
        },
        //只负责多选的 修改selectItems
        setValue: function (dataItem: any, checked: boolean) {
            let that = this;
            //判断是否可编辑
            let oldValue: string = $(this.option.selector).val();
            let vItems = that.multValues;
            let exited = false;
            let index: number;
            let value = that._format(dataItem, that.option.format);

            vItems.forEach((vitem, i) => {
                if (vitem == value) {
                    exited = true;
                    index = i;
                }
            });
            //勾选，item不存在添加，不勾选存在删除
            if (checked && !exited) vItems.push(value);
            if (exited && !checked) vItems.splice(index, 1);
            $(this.option.selector).val(vItems.join(',').replace(/(^\,)|(\,$)/g, '')).trigger('change');
        },
        //可编辑的 修改selectItems
        setInputValue: function (value: string) {
            value = value || ""
            let that = this;
            $(this.option.selector).val(value);
            let arrayValues = value.split(',');
            if (this.type == "tree") {
                //解析value get对象数组 获取ID
                let ids = this.treeControl.getIdsByTexts(arrayValues);
                this.treeControl._treeSelect(ids, this.option.multiselect);
                this.selectItems = { ids: ids, texts: arrayValues };
                return;
            }

            let values: Array<Object> = [];
            //这里先不适用format做解析 以后可加上
            arrayValues.forEach(ivalue => {
                let obj = {};
                obj[that.option.mathField || "Id"] = ivalue;
                values.push(obj);
            })
            this.selectItems = values;
            this.gridControl.checkItems(values);
        },
        //不可编辑的 设置selectItems 可以是"id,id2,id3" ["id","id2","id3"] [{id:"id"},{id:"id2"},{id:"id3"}]
        setUneditableValue: function (dataitems: Array<any> | string, showText) {
            if (!dataitems)
                return;
            let that = this;
            let valueArray = [];
            this.selectItems = [];
            //"Id,id2"
            if (typeof dataitems === "string") {
                let idArray = dataitems.split(',');
                idArray.forEach(id => {
                    let obj = {};
                    obj[that.option.mathField || "Id"] = id;
                    that.selectItems.push(obj);
                })
            } else if (($.isArray(dataitems))) {
                //[""]
                if (typeof dataitems[0] === "string") {
                    (dataitems as Array<string>).forEach(id => {
                        let obj = {};
                        obj[that.option.mathField || "Id"] = id;
                        that.selectItems.push(obj);
                    })
                } else
                    that.selectItems = dataitems
            }
            $(this.option.selector).val(showText);
            this.gridControl.checkItems(that.selectItems);
        },
        clearAll: function () {
            if (this.gridControl) {
                this["selectItems"] = [];
                (this.gridControl as GridControl).clearAll();

                if (this.setSource) this.setSource({ dataSource: this.selectItems, sender: this, value: undefined, type: "grid", text: "" });
            }

            $(this.option.selector).val("");
        },

        ///gridDateRequestOptions==空  取原始 this.option.gridDateRequestOptions
        loadGridData: function (gridDateRequestOptions: GridDataRequest) {
            if (!gridDateRequestOptions)
                gridDateRequestOptions = this.option.gridDateRequestOptions
            else
                this.option.gridDateRequestOptions = gridDateRequestOptions

            //手动添加grid.refresh() 分页显示问题
            if (!gridDateRequestOptions.onLoaded)
                gridDateRequestOptions.onLoaded = () => { this.gridControl.localRefresh(); }
            this.gridControl.setData(gridDateRequestOptions);
        },
        refresh: function () {
            if (this.type === "grid") {
                this.loadGridData();
            }
        },
        loadTreeData: function () {
            let that = this;
            var option = this.option;
            var data = [];
            if (option.treeOptions.readurl) {
                new EAP.EAMController().ExecuteServerAction(option.treeOptions.readurl, [], function (resourceArray) {
                    if (typeof resourceArray === "string")
                        data = JSON.parse(resourceArray);
                    else
                        data = resourceArray;
                    that.treeControl.setTreeData(data);

                    if (that.selectItems) {
                        let ids = that.treeControl.getIdsByTexts(that.selectItems.texts);
                        that.treeControl._treeSelect(ids, that.option.multiselect);
                        that.selectItems.ids = ids;
                    }
                    that.progress(that.window.element, false);
                });
            } else if (option.treeOptions.Data) {
                data = option.treeOptions.Data;
                that.treeControl.setTreeData(data);

                if (that.selectItems) {
                    let ids = that.treeControl.getIdsByTexts(that.selectItems.texts);
                    that.treeControl._treeSelect(ids, that.option.multiselect);
                    that.selectItems.ids = ids;
                }
            }
        },
        //返回格式话后的字符串 从obj中寻找值
        _format: function (obj, fStr) {
            if (fStr) {
                var matharray = fStr.match(/{[^}]*}/g);
                for (var i = 0; i < matharray.length; i++) {
                    var item = matharray[i];
                    var propertyName = item.replace(/(^{)|(}$)/g, "");
                    var value = System.Reference(obj, propertyName);
                    if (!value)
                        fStr = System.CultureInfo.GetDisplayText("未知");
                    fStr = fStr.replace(item, value);
                }
            } else {
                fStr = obj.Name || ""
            }
            return fStr;
        },
        open: function () {
            this.window.center().open();
            this.multValues = [];
            if (this.type == "tree") {
                this.progress(this.window.element, true);
                this.loadTreeData();
            }
            if (this.type == "grid") {
                this.loadGridData();
            }
        },
        //grid 设置选中项 可以之string和array string可以用，号隔开
        _gridSelect: function (kGrid, values, isCheckbox, mathField) {

            var vArray;
            if (values instanceof Array) {
                vArray = values;
            } else if (typeof values === "string") {
                if (values.indexOf(',') > 0) {
                    vArray = values.split(',');
                }
                else {
                    vArray = [];
                    vArray.push(values);
                }
            } else {
                return;
            }

            var items = kGrid.dataSource.data();
            var trItems = kGrid.items();
            for (var i = 0; i < items.length; i++) {
                if (vArray.length <= 0)
                    break;
                for (var v = 0; v < vArray.length; v++) {
                    if (vArray[v] == "")
                        vArray.splice(v, 1);
                    var mathValue = System.Reference(items[i], mathField || "Id");
                    if (vArray[v] == mathValue) {
                        if (isCheckbox) {
                            var cb = $(trItems[i]).find("input:checkbox");
                            cb.prop("checked", true);
                            cb.trigger("change");
                        }
                        else {
                            kGrid.select(trItems[i]);
                        }
                        vArray.splice(v, 1);
                    }
                }
            }


        },
        //获取视图列 访问服务器并未gridoption.viewData赋值，转化数据设置gridoption.columns
        _getViewColumns: function (gridoption) {

            var controller = new EAP.EAMController();
            var that = this;
            var postData = { id: gridoption.gridSolutionId };
            controller.ExecuteServerActionSync(gridoption.viewColsReadUrl, postData, function (data) {
                gridoption.viewData = data;
                gridoption.columns = that._convertColumn(data);
            });
        },
        //重新设置grid参数 这里只有columns设置
        setGridOption: function (gridoption) {
            if (gridoption.gridSolutionId) {
                this._getViewColumns(gridoption);
            } else if (gridoption.viewData && gridoption.viewData.length > 0) {

                gridoption.columns = this._convertColumn(gridoption.viewData);
            } else if (gridoption.columns && gridoption.columns.length > 0) {
            }
            else {
                return;
                //throw new Error('未能加载栏目方案');
            }
            this.option.gridControl.setOption({
                columns: gridoption.columns
            });
        },
        //转化方法，将columns数组转化为grid使用的columns值
        _convertColumn: function (items) {
            var that = this;
            var result = [];
            var index = 0;

            var length = items.length;
            var remainLength = length;

            var cloneCols = [];

            var array = [];
            for (let i = 0; i < length; i++) {
                var data = items[i];
                var isCustom = false;
                for (var c = 0; c < cloneCols.length; c++) {
                    if (cloneCols[c].field == data.Code) {
                        result = result.concat(cloneCols.splice(c, 1));
                        isCustom = true;
                        remainLength--;
                        break;
                    }
                }

                if (isCustom) continue;
                array.push(i);

                var option = {
                    field: data.Code,
                    title: data.CustomHeader || System.CultureInfo.GetDisplayText(data.Header),
                    hidden: !data.IsVisible,
                    template: function (value, option) {
                        if (value) {
                            index = (index % remainLength);
                            var colitem = items[array[index++]]
                            var result = System.Reference(value, colitem.Code);
                            if (!result) {
                                return result;
                            }
                            switch (colitem.DataType) {
                                case "select":
                                    return System.CultureInfo.GetDisplayText(result);
                                case "DateTime":
                                    return System.CultureInfo.FormatDateTime(result); //new Date(result).format('yyyy/MM/dd HH:mm');
                                case "Time":
                                    return new Date(result).format('HH:mm');
                                case "Date":
                                    return System.CultureInfo.FormatDate(result); //new Date(result).format('yyyy/MM/dd');
                                case "EAP.Core.EnumItem":
                                    if (result)
                                        return System.CultureInfo.GetDisplayText(result.Code);
                                    return "";
                                default:
                                    return result;
                            }
                        }
                    }
                };

                if (data.Width) {
                    option["Width"] = data.Width;
                }

                result.push(option);

            }
            return result;

        },

        //不完善
        select: function (index) {
            if (!index)
                return this.selectItems;
        },
        value: function () {
            return this.element.value;
        },
        setText: function (text) {
            $(this.element).val(text);
        },
        progress: function (element, toggle: boolean) {
            kendo.ui.progress(element, toggle);
        }
    })

    export interface IVinciSearchBoxOptions {
        windowSize?: [number, number] | string
        multiselect?: boolean
        change?: (e) => void
        open?: (e) => void
        icon?: string
        editable?: boolean
        readonly?: boolean
        width?: number
        maxLength?: number
        title?: string
        matchField?: string
        treeOptions?
        gridOptions?: EAP.UI.GridOption
        pageable?: boolean
        autoComplete?: boolean
        format?: string
        dateRequestOptions?: EAP.UI.DataRequest
        /**若dateRequestOptions空且entityId有值 则调用统一的查询接口  当前只适合grid*/
        entityId?: string
        /** 弹出窗自动宽高 当前适用grid 取决于columns.width(默认80) iframe.width 和iframe.height*/
        autoWinSize?: boolean
        defaultValue?: string
    }
    export class VinciSearchBoxOptions implements IVinciSearchBoxOptions, IVinciUIOptions {
        /**弹出窗尺寸 mini，small，medium，big 默认small 可自定义 例如：[100，100]*/
        windowSize: [number, number] | string = "small"
        /**是否可多选 默认false*/
        multiselect: boolean = false
        /**change事件 e: { dataSource: selectItems, sender: this, value: value, type: "grid"|"tree", text: input.val() }*/
        change: (e) => void
        /** e:{ sender: this }*/
        open: (e) => void
        /** 图标 可不填（默认使用模块名图标） 位于Resource/Scripts/Buttons下*/
        icon: string
        /** 是否可手动修改只适合于 string类型 默认false*/
        editable: boolean = false
        /** 是否只读 默认false*/
        readonly: boolean = false
        /** width*/
        width: number
        /** maxLength*/
        maxLength: number
        /** title*/
        title: string
        /** 匹配字段默认"Id" 用于editable：false时的绑定的值和编辑时获取对应item的匹配字段 */
        matchField: string = "Id"
        set mathField(mathField: string) {
            if (mathField) this.matchField = mathField
        }
        /** treeOptions:若存在 则默认是tree类型*/
        treeOptions = undefined
        /** gridOptions:若存在 则默认是grid类型*/
        gridOptions: EAP.UI.GridOption = undefined
        /** 针对grid类型 默认false*/
        pageable: boolean = false
        /** 只在editable：true时有用 默认true*/
        autoComplete: boolean = true
        /** input中显示的内容，默认{Name} 括号中包含字段路径 例如：T_T{Asset.Name}+_+*/
        format: string = "{Name}"
        /** 数据请求对象*/
        dateRequestOptions: EAP.UI.DataRequest = undefined
        /**若dateRequestOptions空且entityId有值 则调用统一的查询接口 当前只适合grid*/
        entityId: string = undefined
        /** 弹出窗自动宽高 当前适用grid 取决于columns.width(默认80) iframe.width 和iframe.height*/
        autoWinSize: boolean = false
        /** {string} default "00000000-0000-0000-0000-000000000000" this opt relate only to that eidtable==false*/
        defaultValue: string = "00000000-0000-0000-0000-000000000000"
        constructor(options?: Object) {
            if (options) {
                if (options instanceof VinciSearchBoxOptions)
                    return options;
                $.extend(this, options);
                this.dateRequestOptions = this.dateRequestOptions || (options as any).gridDateRequestOptions
            }
        }
        resultOptions() {
            this.icon = this.multiselect ? "k-i-rows" : "k-i-search";
            if (this.entityId && !this.dateRequestOptions) this.dateRequestOptions = new EAP.UI.GridDataRequest({ url: EAP.UI.ComOptionObj.query4SBUrl, postdata: { entityId: this.entityId } })
            return this;
        }
    }


    /**
     * {VinciSearchBox} tree type extend the first node automatically
     */
    export class VinciSearchBox extends kendo.ui.Widget {
        SETSOURCE = "setSource"
        CHANGE = "change"
        OPEN = "open"
        SPAN = "<span />"
        SEPARATOR = "; "
        public sizes = {
            mini: [260, 300],
            small: [280, 370],
            medium: [420, 300],
            big: [540, 320]
        }
        public events: Array<string>
        public wrapper: JQuery
        private _selectItems: Array<any> = []
        public set selectItems(array: Array<any>) {
            if (!array) return;
            this.oldSelectItems = this._selectItems;
            this._selectItems = array;
        }
        public get selectItems(): Array<any> {
            return this._selectItems || [];
        }
        private oldSelectItems: Array<any> = []
        public settedValue: Array<any> | any //为联动而设置的值 当编辑带联动的页面时 该值是用户手动设置的值或formcontrol自动设置的值，手动触发第一个change事件setValue(settedValue)，然后bind("setSource",fn) 来加载下一个 同上
        public window: kendo.ui.Window
        public type: string
        public gridControl: EAP.UI.GridControl
        public treeControl
        private autoComplete: EAP.UI.VinciAutoComplete
        constructor(element: HTMLElement, options?: IVinciSearchBoxOptions) {
            super(element, new VinciSearchBoxOptions(options).resultOptions())
            //MVVM OPTIONS
            if (element.dataset && element.dataset["bind"]) { // TODO 限定grid
                let source = EAP.UI.parseBindings(element.dataset["bind"])["source"]
                    , grid = (this.element.closest(".k-grid").data("kendoVinciGrid") as VinciGrid)
                    , dataItem = grid.dataItem(this.element.closest("tr"))
                    , op = System.getValue(dataItem, source)
                if (!op) { op = System.getValue(grid["sundries"], source); }
                $.extend(this.options, new VinciSearchBoxOptions(op).resultOptions())
            }
            this._wapper()
            this._init()
        }
        private _reopen: boolean = true
        private _wapper() {
            let that = this, element = that.element, DOMelement = element[0], options = this.options as IVinciSearchBoxOptions, wrapper = element.parents("span.k-combobox");
            if (!wrapper[0]) {
                wrapper = element.wrap(that.SPAN).parent().addClass("k-dropdown-wrap k-state-default").append('<span tabindex="-1" unselectable="on" class="k-select"><span unselectable="on" class="k-font-icon k-icon ' + options.icon + '">select</span></span>');
                wrapper = wrapper.wrap(that.SPAN).parent();
            }
            wrapper[0].style.cssText = element[0].style.cssText;
            that.wrapper = wrapper.addClass("k-widget k-combobox k-header").addClass(element[0].className);
            element.css({
                width: "100%",
                height: element[0].style.height
            }).addClass("k-input");
        }
        private _init() {
            let that = this, options = that.options as IVinciSearchBoxOptions, div = window.document.createElement("div")
                , size = (typeof options.windowSize === "string") ? that.sizes[options.windowSize as string] : options.windowSize;
            div.style.display = "none";
            $(div).insertAfter(that.wrapper);
            let subDiv = document.createElement("div"), sumColWidth: number = options.gridOptions ? options.gridOptions.columns.map(c => c).sum(c => parseFloat(c.width) || 80) : 0;
            div.style.width = (options.autoWinSize ? Math.min(sumColWidth + 34, $(document.body).innerWidth() - 34) : size[0]) + "px";
            div.style.height = (options.autoWinSize ? Math.min(size[1], $(document.body).innerHeight() - 34) : size[1]) + "px";
            div.appendChild(subDiv);
            that.wrapper.find('.k-icon').bind("click", () => that._open());

            if (options.treeOptions) that._initTree(subDiv);
            else if (options.gridOptions) that._initGrid(subDiv);

            if (options.width) that.wrapper.outerWidth(options.width);
            if (options.readonly) that.element.attr('readonly', '').addClass("formDisabled");
            if (options.maxLength) that.element.attr("maxlength", options.maxLength);
            if (options.editable) {
                that.element.bind(that.CHANGE, function (e) {
                    that.trigger(that.CHANGE, { dataSource: that.selectItems, sender: that, value: that.element.val(), type: that.type, text: that.element.val() })
                    that.trigger(that.SETSOURCE, { dataSource: that.selectItems, sender: that, value: that.element.val(), type: that.type, text: that.element.val() })
                });
            } else {
                that.element.bind(that.CHANGE, function (e) {
                    if (that.element.val() === "")
                        that.clearAll();
                });
            }
            //window
            that.window = new VinciWindowForSearchbox(div, {
                title: options.title, resizable: false, actions: ["Empty", "Close"], modal: true, empty: () => {
                    that.clearAll();
                    that.window.close();
                }
            })
        }
        private despatch() {
            let that = this, options = that.options as IVinciSearchBoxOptions;
            if (options.multiselect) {
                if (!options.editable) {
                    let value = that.selectItems.map(i => System.getValue(i, options.matchField))
                    that.trigger(that.SETSOURCE, { dataSource: that.selectItems, sender: that, value: value, type: that.type, text: that.element.val() })
                    that.trigger(that.CHANGE, { dataSource: that.selectItems, sender: that, value: value, type: that.type, text: that.element.val() })
                } else that.element.trigger(that.CHANGE)
            } else {
                if (!options.editable) {
                    let selectedObj = that.selectItems[0], value = selectedObj ? System.getValue(selectedObj, options.matchField) : options.defaultValue
                    that.trigger(that.SETSOURCE, { dataSource: selectedObj, sender: that, value: value, type: that.type, text: that.element.val() })
                    that.trigger(that.CHANGE, { dataSource: selectedObj, sender: that, value: value, type: that.type, text: that.element.val() })
                } else that.element.trigger(that.CHANGE)
            }
        }
        private _initGrid(selector: HTMLElement) {
            let that = this, options = that.options as IVinciSearchBoxOptions;
            that.type = "grid";
            if (options.multiselect) {
                options.gridOptions.showrowcheckbox = true;
                options.gridOptions.change = function (e) {
                    let $target = $(e.target), checked = $target.prop('checked'), dataItem = that.gridControl.grid.dataItem($target.closest('tr'));
                    that._setMultSelectValue(dataItem, checked);
                    let text = that.selectItems.map(i => that._format(i, options.format) + that.SEPARATOR).join("");
                    that.element.val(text)
                    that.despatch();
                    //if (!options.editable) {
                    //    let value = that.selectItems.map(i => System.getValue(i, options.matchField))
                    //    that.trigger(that.SETSOURCE, { dataSource: that.selectItems, sender: that, value: value, type: that.type, text: that.element.val() })
                    //    that.trigger(that.CHANGE, { dataSource: that.selectItems, sender: that, value: value, type: that.type, text: that.element.val() })
                    //} else that.element.trigger(that.CHANGE)
                }
            } else {
                //单选
                options.gridOptions.selectable = "row";
                options.gridOptions.dblClick = function (item, e) {
                    let selectedObj = item//e.sender.dataItem(e.sender.select());
                    if (!selectedObj) return;
                    that.element.val(that._format(selectedObj, options.format));
                    that.selectItems = [selectedObj]
                    that.despatch();
                    //if (!options.editable) {
                    //    that.trigger(that.SETSOURCE, { dataSource: selectedObj, sender: that, value: System.getValue(selectedObj, options.matchField), type: that.type, text: that.element.val() })
                    //    that.trigger(that.CHANGE, { dataSource: selectedObj, sender: that, value: System.getValue(selectedObj, options.matchField), type: that.type, text: that.element.val() })
                    //} else that.element.trigger(that.CHANGE)
                    that.window.close();
                };
            }
            options.gridOptions.selector = selector;
            if (!options.gridOptions.columns || options.gridOptions.columns.length < 1)
                options.gridOptions.columns = [{ field: "Name", title: "Name" }]
            options.gridOptions.selectable = options.multiselect ? "multiple, row" : "row";
            options.gridOptions.filterable = { mode: "row" };
            options.gridOptions.height = "98%"
            options.gridOptions.pageable = options.pageable ? new EAP.UI.MiniPager().pagerOption : false;
            that.gridControl = new EAP.UI.GridControl(options.gridOptions);
            that.gridControl.grid.refresh();

            if ((!options.editable) && options.multiselect) {
                that.element[0].onkeydown = function (e) {
                    e.preventDefault();
                }
            }
            else that.initAutoComplete();
        }
        private _initTree(selector: Element) {
            let that = this, options = that.options as IVinciSearchBoxOptions;
            that.type = "tree";
            options.treeOptions.selector = selector;
            options.matchField = "id";

            if (options.multiselect) {
                options.treeOptions.showCheckBox = true;
                options.treeOptions.check = function (e) {
                    let checkedNodes = that.treeControl.getCheckedItems();
                    that.selectItems = checkedNodes.dataSource;
                    that.element.val(checkedNodes.texts.map(i => i + that.SEPARATOR).join(""));
                    that.despatch();
                    //if (!options.editable) {
                    //    that.trigger(that.SETSOURCE, { dataSource: that.selectItems, sender: that, value: checkedNodes.ids, type: that.type, text: that.element.val() })
                    //    that.trigger(that.CHANGE, { dataSource: that.selectItems, sender: that, value: checkedNodes.ids, type: that.type, text: that.element.val() })
                    //} else that.element.trigger(that.CHANGE)
                };
                options.treeOptions.leafOnly = options.treeOptions.leafOnly !== false; //multiple selection only choose the leaves by default except "leafOnly" is false
            }
            else {
                let customNodeClick = options.treeOptions.nodeClick;
                //使用select
                options.treeOptions.dblclick = function (item, e) {
                    let selectedNode = item// e.sender.dataItem(e.node);
                    that.selectItems = [selectedNode];
                    that.element.val(selectedNode.text);
                    that.despatch();
                    //if (!options.editable) {
                    //    that.trigger(that.SETSOURCE, { dataSource: that.selectItems[0], sender: that, value: selectedNode.id, type: that.type, text: that.element.val() })
                    //    that.trigger(that.CHANGE, { dataSource: that.selectItems[0], sender: that, value: selectedNode.id, type: that.type, text: that.element.val() })
                    //} else that.element.trigger(that.CHANGE)
                    that.window.close();
                }
            }
            this.treeControl = new EAP.UI.TreeControl(options.treeOptions);

            if (!options.editable) {
                that.element[0].onkeydown = function (e) {
                    e.preventDefault();
                }
            }
        }
        //只负责多选的 修改selectItems
        private _setMultSelectValue(dataItem: any, checked: boolean) {
            let that = this, options = that.options as IVinciSearchBoxOptions;
            if (that._reopen) {
                that.selectItems = [];
                that._reopen = false;
            }
            let exited = false;
            let index: number;
            that.selectItems.forEach((vitem, i) => {
                if (vitem == dataItem) {
                    exited = true;
                    index = i;
                }
            });
            //勾选不存在添加，不勾选存在删除
            if (checked && !exited) that.selectItems.push(dataItem);
            if (exited && !checked) that.selectItems.splice(index, 1);
        }
        initAutoComplete() {
            let that = this, options = that.options as IVinciSearchBoxOptions;
            if (options.autoComplete === false) return;
            //if (options.gridOptions && options.editable && !options.multiselect) {
            let request = options.dateRequestOptions as GridDataRequest;
            let schema = {
                data: function (d) {
                    if (options.dateRequestOptions && options.dateRequestOptions.responseData) {
                        return options.dateRequestOptions.responseData(d);
                    }
                    else {
                        if ($.isArray(d)) return d
                        if (d.rows || d.Collection) return d.rows || d.Collection;
                        for (let name in d) if ($.isArray(d[name])) return d[name];
                    }
                }
            };
            let aco = new EAP.UI.VinciAutoCompleteOptions();
            aco.dataTextField = options.gridOptions.columns[0].field;
            aco.dataSource = new kendo.data.DataSource({
                serverFiltering: true,
                transport: {
                    read: function (p) {
                        if (!options.dateRequestOptions) { p.success([]); return; }
                        // let val = that.element.val();
                        let postdate: any = $.extend(true, {}, p.data, options.dateRequestOptions.postdata);
                        that.gridControl._fiterRebuild(postdate.filter)
                        //postdate.filter = { filters: [{ field: aco.dataTextField, value: val, itemOperator: "contains" }], logic: "and" }
                        new EAP.EAMController().ExecuteServerAction(options.dateRequestOptions.url as string, postdate, function (data) {
                            p.success(data);
                        });
                    }
                },
                schema: schema
            });
            aco.filter = "contains";
            if (options.multiselect) aco.separator = that.SEPARATOR
            aco.change = function (e) {
                e.sender.element.trigger("change")
            }
            if (!options.editable)//当前只有不可编辑 会进到这里        不可编辑多选当前不允许Auto complete
            {
                aco.select = function (e) {
                    that.selectItems = [e.dataItem];
                    that.trigger(that.SETSOURCE, { dataSource: e.dataItem, sender: that, value: System.getValue(e.dataItem, options.matchField), type: that.type, text: that.element.val() })
                    that.trigger(that.CHANGE, { dataSource: e.dataItem, sender: that, value: System.getValue(e.dataItem, options.matchField), type: that.type, text: that.element.val() })
                }
                that._blur();
            }
            that.autoComplete = that.element.kendoVinciAutoComplete(aco).data("kendoVinciAutoComplete");
            that.autoComplete.wrapper.css({ lineHeight: "1.7em" })
            //  }
        }

        private _blur() {
            let that = this, options = that.options as IVinciSearchBoxOptions;
            that.element.blur(() => {
                let d = (that.selectItems || [])[0];
                that.element.val(d ? that._format(d, options.format) : "")
            })
        }

        private _setValue(values: Array<any> | any) {
            let that = this, options = that.options as IVinciSearchBoxOptions, valueArray = []
            if (options.editable) { that.element.val(values || "" as string); return; }
            //"Id,id2"
            if (typeof values === "string") {
                let idArray = values.split(',');
                idArray.forEach(id => {
                    if (id == Guid.Empty) return;
                    let obj = {};
                    obj[options.matchField] = id
                    valueArray.push(obj);
                })
            } else if ($.isArray(values)) {
                //[""]
                if (typeof values[0] === "string") {
                    (values as Array<string>).forEach(id => {
                        if (id == Guid.Empty) return;
                        let obj = {};
                        obj[options.matchField] = id;
                        valueArray.push(obj);
                    })
                } else
                    valueArray = values
            }
            if (!values || valueArray.length == 0) {
                that.selectItems = [];
                that.element.val("");
                that.trigger(that.SETSOURCE, { dataSource: options.multiselect ? that.selectItems : that.selectItems[0], sender: that, value: options.multiselect ? [] : undefined, type: that.type, text: that.element.val() })
                return;
            }
            let value: Array<any> = valueArray.map(o => System.getValue(o, options.matchField))
                , vds = that.selectItems.map(o => System.getValue(o, options.matchField)).concat(value)
            if (that.selectItems.length === value.length && vds.distinct().length === value.length) {//若selectItems 与设置的值一致 我们就不再进行验证了
                that.element.val(options.multiselect ? that.selectItems.map(i => that._format(i, options.format) + that.SEPARATOR).join("") : that._format(that.selectItems[0], options.format))
                value = that.selectItems.map(i => System.getValue(i, options.matchField))
                that.trigger(that.SETSOURCE, { dataSource: options.multiselect ? that.selectItems : that.selectItems[0], sender: that, value: options.multiselect ? value : value[0], type: that.type, text: that.element.val() });
                return;
            }
            if (that.type === "grid" && valueArray.length > 0) {
                let result: Array<any> = []
                if (options.dateRequestOptions) {
                    let op: any = $.extend(true, {}, options.dateRequestOptions.postdata);
                    let filters = [{ field: options.matchField, value: value.join(","), itemOperator: 'in' }];
                    if (op.filter) (op.filters as Array<any>).concat(filters)
                    else op.filter = { logic: 'and', filters: filters }
                    op.rows = 5000
                    result = new EAP.EAMController().ExecuteServerActionSync(options.dateRequestOptions.url as System.UrlObj, op) || []
                } else {
                    //that.gridControl.grid.
                }
                if (!$.isArray(result)) result = that.gridControl.schema.data(result)
                that.selectItems = result.where(i => {
                    let v = System.getValue(i, options.matchField)
                    if (v === undefined) return false
                    return value.indexOf(v) >= 0
                });
                that.element.val(options.multiselect ? that.selectItems.map(i => that._format(i, options.format) + that.SEPARATOR).join("") : that._format(that.selectItems[0], options.format))
                //that.element.val(that.selectItems.map(i => that._format(i, options.format)).join(","))
                value = that.selectItems.map(i => System.getValue(i, options.matchField))
                that.trigger(that.SETSOURCE, { dataSource: options.multiselect ? that.selectItems : that.selectItems[0], sender: that, value: options.multiselect ? value : value[0], type: that.type, text: that.element.val() })
            } else if (that.type === "tree") {
                let all = { ids: [], texts: [], items: [], dataSource: [] };
                that.loadTreeData(undefined, () => {
                    that.treeControl.enumNotes(that.treeControl.tree.dataSource.view(), all)
                    that.selectItems = all.items.where((i) => {
                        let v = i.id
                        if (v === undefined) return false
                        return value.indexOf(v) >= 0
                    });
                    that.element.val(options.multiselect ? that.selectItems.map(i => i.text + that.SEPARATOR).join("") : that.selectItems[0].text)
                    //that.element.val(that.selectItems.map(i => i.text).join(","))
                    value = that.selectItems.map(i => i.id)
                    that.trigger(that.SETSOURCE, { dataSource: options.multiselect ? that.selectItems : that.selectItems[0], sender: that, value: options.multiselect ? value : value[0], type: that.type, text: that.element.val() })
                });
            }
        }
        setValue(values: Array<any> | any) {
            this.settedValue = values
            this._setValue(values)
        }
        clearAll() {
            let that = this, options = that.options as IVinciSearchBoxOptions;
            that.selectItems = [];
            that.element.val("");
            that.despatch();
        }
        ///gridDateRequestOptions==空  取原始 this.option.gridDateRequestOptions
        loadGridData(gridDateRequestOptions?: GridDataRequest) {
            let that = this, options = that.options as IVinciSearchBoxOptions;
            if (!gridDateRequestOptions)
                gridDateRequestOptions = options.dateRequestOptions as GridDataRequest
            else
                options.dateRequestOptions = gridDateRequestOptions
            if (!gridDateRequestOptions) return;
            //  手动添加grid.refresh() 分页显示问题
            if (!gridDateRequestOptions.onLoaded)
                gridDateRequestOptions.onLoaded = () => { this.gridControl.localRefresh(); }
            this.gridControl.setData(gridDateRequestOptions);
        }
        refresh() {
            switch (this.type) {
                case "grid":
                    this.loadGridData();
                    break;
                case "tree":
                    this.loadTreeData();
                    break;
            }
        }
        //TODO treeRequestOptions
        loadTreeData(treeRequestOptions?: DataRequest, onLoaded?: Function) {
            let that = this, options = that.options as IVinciSearchBoxOptions;
            var data = [];
            //if (!treeRequestOptions)
            //    treeRequestOptions = options.dateRequestOptions as DataRequest
            //else
            //    options.dateRequestOptions = treeRequestOptions
            if (options.treeOptions.readurl) {
                that.progress(that.window.element, true);
                new EAP.EAMController().ExecuteServerAction(options.treeOptions.readurl, [], function (resourceArray) {
                    if (typeof resourceArray === "string")
                        data = JSON.parse(resourceArray);
                    else
                        data = resourceArray;
                    that.treeControl.setTreeData(data);
                    that.treeControl.expandFirst();
                    that.progress(that.window.element, false);
                    if (onLoaded) onLoaded();
                });
            } else if (options.treeOptions.Data) {
                data = options.treeOptions.Data;
                that.treeControl.setTreeData(data);
                if (onLoaded) onLoaded();
            }
        }
        //返回格式话后的字符串 从obj中寻找值
        _format(obj, fStr) {
            if (fStr) {
                var matharray = fStr.match(/{[^}]*}/g);
                for (var i = 0; i < matharray.length; i++) {
                    var item = matharray[i];
                    var propertyName = item.replace(/(^{)|(}$)/g, "");
                    var value = System.Reference(obj, propertyName);
                    if (!value)
                        fStr = System.CultureInfo.GetDisplayText("未知");
                    fStr = fStr.replace(item, value);
                }
            } else {
                fStr = obj.Name || ""
            }
            return fStr;
        }
        _open() {
            let that = this;
            that.window.center().open();
            that._reopen = true;
            that.refresh();
            that.trigger(that.OPEN, { sender: that })
        }
        open() {
            this._open()
        }
        ////不完善
        //select(index) {
        //    if (!index)
        //        return this.selectItems;
        //}
        value(values?: Array<any> | any): string | Array<any> | VinciSearchBox {
            let that = this, options = that.options as IVinciSearchBoxOptions;
            if (values) {
                that.setValue(values)
                return that;
            }
            if (!options.editable) {
                let r = that.selectItems ? that.selectItems.map(i => System.getValue(i, options.matchField)) : [];
                return options.multiselect ? r : r[0]
            }
            else
                return that.element.val();
        }
        /**
         * 只设置input的值 不再使用 这边为兼容shijie 代码
         * @param text
         */
        setText(text) {
            $(this.element).val(text);
        }
        progress(element, toggle: boolean) {
            kendo.ui.progress(element, toggle);
        }
        destroy() {
            delete this._selectItems;

            if (this.gridControl) { this.gridControl.destroy(); delete this.gridControl; }
            if (this.treeControl) { this.treeControl; delete this.treeControl; }
            if (this.window) { this.window.destroy(); delete this.window; }

            if (this.autoComplete) { this.autoComplete.destroy(); delete this.autoComplete; }
            super.destroy();
            if (this.wrapper) this.wrapper.remove();
        }
    }
    VinciSearchBox.fn = VinciSearchBox.prototype;
    VinciSearchBox.fn.events = ['change', 'open', 'setSource']
    VinciSearchBox.fn.options = $.extend(true, {}, kendo.ui.Widget.fn.options);
    VinciSearchBox.fn.options["name"] = "VinciSearchBox";
    kendo.ui.plugin(VinciSearchBox);

    export interface IVinciDatePickerOptions extends kendo.ui.DatePickerOptions, IVinciUIOptions {
        readonly?: boolean
        showWeeks?: boolean
        hideButton?: boolean
    }
    export class VinciDatePickerOptions implements IVinciDatePickerOptions {
        public name: string = undefined;
        public animation: boolean | kendo.ui.DatePickerAnimation = undefined
        public ARIATemplate: string = undefined
        public culture: string = undefined
        public dates: any = undefined
        public depth: string = undefined
        public disableDates: any | Function = undefined
        public footer: string | Function = undefined
        public format: string = System.CultureInfo.GetDateFormatStr()
        public max: Date = undefined
        public min: Date = undefined
        public month: kendo.ui.DatePickerMonth = undefined
        public parseFormats: any = undefined
        public start: string = undefined
        public value: Date = undefined
        public change(e: kendo.ui.DatePickerChangeEvent): void { }
        public close(e: kendo.ui.DatePickerCloseEvent): void { }
        public open(e: kendo.ui.DatePickerOpenEvent): void { }
        public weekCountTitle: string = System.CultureInfo.GetDisplayText('Week')
        constructor(options?: any) {
            if (options) {
                if (options instanceof VinciDatePickerOptions)
                    return options;
                $.extend(true, this, options);
            }
        }


        //
        public readonly: boolean = undefined
        public showWeeks: boolean = true
        public hideButton: boolean = true
    }
    export class VinciDatePicker extends kendo.ui.DatePicker {
        constructor(element: HTMLElement, options?: IVinciDatePickerOptions) {
            super(element, new VinciDatePickerOptions(options))
            let that = this, op = that.options as IVinciDatePickerOptions
            if (op.readonly) {
                element.setAttribute("readonly", "");
                element.classList.add("formDisabled");
            }
            element.setAttribute("data-type", "date")
            element.setAttribute("data-format", op.format || System.CultureInfo.GetDateFormatStr())
            element.setAttribute("data-date-msg", System.CultureInfo.GetDisplayText('FormatError') + ":" + op.format || System.CultureInfo.GetDateFormatStr())
            that._initCalendar()
            that._configSetSource()
            if (op.hideButton)
                that._hideButton()
        }
        //不会影响kendo原生控件
        _initCalendar() {
            let ui = kendo.ui,
                DIV = "<div />",
                ns = ".kendoVinciDatePicker",
                CLICK = "click" + ns,
                OPEN = "open",
                MOUSEDOWN = "mousedown" + ns,
                ID = "id"
            this["dateView"]._calendar = function () {
                var that = this;
                var calendar = that.calendar;
                var options = that.options;
                var div;

                if (!calendar) {
                    div = $(DIV).attr(ID, kendo.guid())
                        .appendTo(that.popup.element)
                        .on(MOUSEDOWN, function (e) {
                            e.preventDefault();
                        })
                        .on(CLICK, "td:has(.k-link)", $.proxy(that._click, that));

                    that.calendar = calendar = new EAP.UI.VinciCalendar(div, that.options);
                    that._setOptions(options);

                    kendo["calendar"].makeUnselectable(calendar.element);

                    calendar.navigate(that._value || that._current, options.start);

                    that.value(that._value);
                }
            }
        }
        //设置setSource 回调
        _configSetSource() {
            let that = this;
            this.bind("change", (e: kendo.ui.DatePickerChangeEvent) => {
                that.trigger("setSource");
            })
        }
        _hideButton() {
            this.wrapper.find('.k-picker-wrap').css({ padding: 0 }).find('.k-select').hide();
            let that = this;
            this.element.attr('placeholder', System.CultureInfo.GetDisplayText('DataFormat')).css({ borderRadius: "3px" }).click(() => {
                if (!(that.options as IVinciDatePickerOptions).readonly)
                    that.open();
            });
        }
    }
    VinciDatePicker.fn = VinciDatePicker.prototype;
    VinciDatePicker.fn.options = $.extend(true, { hideButton: true }, kendo.ui.DatePicker.fn.options);
    VinciDatePicker.fn.options.name = "VinciDatePicker";
    kendo.ui.plugin(VinciDatePicker);

    export interface IVinciDateTimePickerOptions extends kendo.ui.DateTimePickerOptions, IVinciUIOptions {
        readonly?: boolean
        hideButton?: boolean
    }
    export class VinciDateTimePickerOptions implements IVinciDateTimePickerOptions {
        public name: string = undefined;
        public animation: boolean | kendo.ui.DatePickerAnimation = undefined
        public ARIATemplate: string = undefined
        public culture: string = undefined
        public dates: any = undefined
        public depth: string = undefined
        public disableDates: any | Function = undefined
        public footer: string = undefined
        public format: string = System.CultureInfo.GetDateTimeFormatStr()
        public max: Date = undefined
        public min: Date = undefined
        public month: kendo.ui.DatePickerMonth = undefined
        public parseFormats: any = undefined
        public start: string = undefined
        public value: Date = undefined
        public change(e: kendo.ui.DateTimePickerChangeEvent): void { }
        public close(e: kendo.ui.DateTimePickerCloseEvent): void { }
        public open(e: kendo.ui.DateTimePickerOpenEvent): void { }
        public weekCountTitle: string = System.CultureInfo.GetDisplayText('Week')
        resultOptions(): VinciDateTimePickerOptions {
            return this;
        }
        constructor(options?: any) {
            if (options) {
                if (options instanceof VinciDateTimePickerOptions)
                    return options;
                $.extend(true, this, options);
            }
        }


        //
        public readonly: boolean = undefined
        public hideButton: boolean = true
    }
    export class VinciDateTimePicker extends kendo.ui.DateTimePicker {
        constructor(element: Element, options?: IVinciDateTimePickerOptions) {
            element.setAttribute("data-type", "date")
            element.setAttribute("data-date-msg", System.CultureInfo.GetDisplayText('FormatError') + ":" + System.CultureInfo.GetDateTimeFormatStr())

            if (options.readonly) {
                element.setAttribute("readonly", "");
                element.classList.add("formDisabled");
            }
            super(element, new VinciDateTimePickerOptions(options).resultOptions())//undefined
            this._initCalendar();
            this._configSetSource()
            if ((this.options as IVinciDateTimePickerOptions).hideButton)
                this._hideButton()
        }
        //设置setSource 回调
        private _configSetSource() {
            let that = this;
            this.bind("change", (e: kendo.ui.DateTimePickerChangeEvent) => {
                that.trigger("setSource");
            })
        }
        private _hideButton() {
            this.wrapper.find('.k-picker-wrap').css({ padding: 0 }).find('.k-select').hide();
            let that = this;
            this.element.attr('placeholder', System.CultureInfo.GetDisplayText('DateTimeFormat')).css({ borderRadius: "3px" }).click(() => {
                if (!(that.options as IVinciDateTimePickerOptions).readonly)
                    that.open('date');
            });
        }

        //不会影响kendo原生控件
        private _initCalendar() {
            let ui = kendo.ui,
                DIV = "<div />",
                ns = ".kendoVinciDatePicker",
                CLICK = "click" + ns,
                OPEN = "open",
                MOUSEDOWN = "mousedown" + ns,
                ID = "id"
            this["dateView"]._calendar = function () {
                var that = this;
                var calendar = that.calendar;
                var options = that.options;
                var div;

                if (!calendar) {
                    div = $(DIV).attr(ID, kendo.guid())
                        .appendTo(that.popup.element)
                        .on(MOUSEDOWN, function (e) {
                            e.preventDefault();
                        })
                        .on(CLICK, "td:has(.k-link)", $.proxy(that._click, that));

                    that.calendar = calendar = new EAP.UI.VinciCalendar(div, that.options);
                    that._setOptions(options);

                    kendo["calendar"].makeUnselectable(calendar.element);

                    calendar.navigate(that._value || that._current, options.start);

                    that.value(that._value);
                }
            }
        }
    }
    VinciDateTimePicker.fn = VinciDateTimePicker.prototype;
    VinciDateTimePicker.fn.options = $.extend(true, { hideButton: true }, kendo.ui.DateTimePicker.fn.options);
    VinciDateTimePicker.fn.options.name = "VinciDateTimePicker";
    kendo.ui.plugin(VinciDateTimePicker);

    export interface IVinciWeekPickerOptions extends IVinciWeekCalendarOptions {
        readonly?: boolean
        hideButton?: boolean
    }
    export class VinciWeekPickerOptions extends VinciWeekCalendarOptions implements IVinciWeekPickerOptions, IVinciUIOptions {
        resultOptions(): VinciWeekPickerOptions {
            return this;
        }
        constructor(options?: any) {
            super()
            if (options) {
                if (options instanceof VinciWeekPickerOptions)
                    return options;
                $.extend(this, options);
            }
        }
        //
        public readonly: boolean = undefined
        public hideButton: boolean = true
    }
    export class VinciWeekPicker extends kendo.ui.Widget { //可以直接使用 input control
        private SPAN = "<span />"
        private CHANGE = "change"
        private ARIA_HIDDEN = "aria-hidden"
        private ARIA_EXPANDED = 'aria-expanded'
        private DIV = "<div />"
        private SELECTED = "k-state-selected"
        private CLOSE = "close"
        private _typing: boolean
        private _old: string
        private _current: Date = new Date()
        private _value: string | Date
        private calendar: EAP.UI.VinciWeekCalendar
        public wrapper: JQuery
        private popup: EAP.UI.VinciPopup
        constructor(element: Element, options?: IVinciWeekPickerOptions) {
            super(element, new VinciWeekPickerOptions(options).resultOptions())//undefined
            let that = this;
            if (that.options.readonly) {
                element.setAttribute("readonly", "");
                element.classList.add("formDisabled");
            }
            that._wapper()
            let div = $(this.DIV).attr(this.ARIA_HIDDEN, "true")
                .addClass("k-calendar-container")
                .appendTo(document.body);
            that.popup = new EAP.UI.VinciPopup(div[0], { anchor: this.element, triggeringName: "" }); //
            //that.element.on('click', $.proxy(that._click, that))
            that._configSetSource()
        }
        private _wapper() {
            let that = this, element = that.element, DOMelement = element[0], options = this.options as IVinciWeekPickerOptions, wrapper = element.parents("span.k-datepicker");
            if (!wrapper[0]) {
                wrapper = element.wrap(that.SPAN).parent().addClass("k-picker-wrap k-state-default");
                wrapper = wrapper.wrap(that.SPAN).parent();
            }
            wrapper[0].style.cssText = element[0].style.cssText;
            that.wrapper = wrapper.addClass("k-widget k-datepicker k-header").addClass(element[0].className);
            element.css({
                width: "100%",
                height: element[0].style.height
            }).addClass("k-input");
            if (options.hideButton)
                this._hideButton()
        }
        //设置setSource 回调
        private _configSetSource() {
            let that = this;
            this.bind("change", (e: kendo.ui.DateTimePickerChangeEvent) => {
                that.trigger("setSource");
            })
        }
        private _initCalendar() {
            let ui = kendo.ui,
                DIV = "<div />",
                ns = ".kendoVinciDatePicker",
                CLICK = "click" + ns,
                OPEN = "open",
                MOUSEDOWN = "mousedown" + ns,
                ID = "id";
            let that = this, calendar = that.calendar, options = that.options, div;

            if (!calendar) {
                div = $(DIV).attr(ID, kendo.guid())
                    .appendTo(that.popup.element)
                    .on(MOUSEDOWN, function (e) {
                        e.preventDefault();
                    })
                    .on(CLICK, "td:has(.k-link)", (e) => {
                        if ($(e.currentTarget).closest("tr").hasClass(that.SELECTED)) {
                            that.close();
                        }
                    });
                let cop = $.extend({}, that.options, {
                    id: that.element.attr(ID),
                    change: function () {
                        that._change(this.value());
                        that.close();
                    }//,
                    //close: function (e) {
                    //    if (that.trigger("close")) {
                    //        e.preventDefault();
                    //    } else {
                    //        that.element.attr(that.ARIA_EXPANDED, "false");
                    //        div.attr(that.ARIA_HIDDEN, true);
                    //    }
                    //},
                    //open: function (e) {
                    //    var options = that.options, date;
                    //    if (that.trigger(OPEN)) {
                    //        e.preventDefault();
                    //    } else {
                    //        if (that.element.val() !== that._old) {
                    //            //date = parse(that.element.val(), options.parseFormats, options.culture);
                    //            //that.dateView[date ? 'current' : 'value'](date);
                    //        }
                    //        that.element.attr(that.ARIA_EXPANDED, "true");
                    //        div.attr(that.ARIA_HIDDEN, false);
                    //       // that._updateARIA(date);
                    //    }
                    //}
                })
                that.calendar = calendar = new EAP.UI.VinciWeekCalendar(div, cop);
                //that._setOptions(options);

                calendar.navigate((that._value as Date) || that._current, options.start);

                that.value(that._value);
            }
        }
        private _click() {
            var that = this,
                element = that.element;

            that[that.popup.visible() ? "close" : "open"]();

            if (!kendo.support.touch && element[0] !== kendo["_activeElement"]()) {
                element.focus();
            }
        }
        private _change(value) {
            let that = this;
            value = that._update(value)
            if (that._old != value) {
                that._old = value;
                if (!that._typing) {
                    // trigger the DOM change event so any subscriber gets notified
                    that.element.trigger(that.CHANGE);
                }

                that.trigger(that.CHANGE);
            }

            that._typing = false;
        }
        private _update(value) {
            let oldValue = this.element.val()
            this.element.val(value)
            return oldValue;
        }
        private _keydown(e) {
            let that = this,
                value = that.element.val(),
                handled = false;

            if (!that.popup.visible() && e.keyCode == kendo.keys.ENTER && value !== that._old) {
                that._change(value);
            } else {
                handled = that.move(e);

                if (!handled) {
                    that._typing = true;
                }
            }
        }
        private move(e) {
            var that = this,
                key = e.keyCode,
                calendar = that.calendar,
                selectIsClicked = e.ctrlKey && key == kendo.keys.DOWN || key == kendo.keys.ENTER,
                handled = false;

            if (e.altKey) {
                if (key == kendo.keys.DOWN) {
                    that.open();
                    e.preventDefault();
                    handled = true;
                } else if (key == kendo.keys.UP) {
                    that.close();
                    e.preventDefault();
                    handled = true;
                }

            } else if (that.popup.visible()) {

                if (key == kendo.keys.ESC || (selectIsClicked && calendar["_cell"].closest("tr").hasClass(that.SELECTED))) {
                    that.close();
                    e.preventDefault();
                    return true;
                }

                that._current = calendar["_move"](e);
                handled = true;
            }

            return handled;
        }
        destroy() {
            if (this.calendar) { this.calendar.destroy(); delete this.calendar; }
            if (this.popup) { this.popup.destroy(); delete this.popup; }
            super.destroy();
            if (this.wrapper) this.wrapper.remove();
        }

        open() {
            let that = this;
            that._initCalendar();
            that.popup.open();
        }

        close() {
            this.popup.close();
        }

        value(value?) {
            let that = this;
            if (!that.calendar) that._initCalendar();
            if (value === undefined) {
                return that.calendar.value();
            }
            that.calendar.value.call(that.calendar, value)
            that.element.val(that.calendar.value())
        }

        private _hideButton() {
            this.wrapper.find('.k-picker-wrap').css({ padding: 0 }).find('.k-select').hide();
            let that = this;
            this.element.attr('placeholder', System.CultureInfo.GetDisplayText('DataFormat')).css({ borderRadius: "3px" }).click(() => {
                if (!(that.options as IVinciDatePickerOptions).readonly)
                    that.open();
            });
        }
    }
    VinciWeekPicker.fn = VinciWeekPicker.prototype;
    VinciWeekPicker.fn.events = ['change', 'open', 'setSource']
    VinciWeekPicker.fn.options = $.extend(true, {}, kendo.ui.Widget.fn.options);
    VinciWeekPicker.fn.options.name = "VinciWeekPicker";
    kendo.ui.plugin(VinciWeekPicker);

    export interface IVinciPopupOptions extends kendo.ui.PopupOptions, IVinciUIOptions {
        //
        triggeringName?: string;
        //
        customSize?: [number, number];

        autoDestory?: boolean;

        anchorTriggerCallback?: (e: JQueryEventObject) => void
    }
    //
    export class VinciPopupOptions implements IVinciPopupOptions {
        /** marginSize {number,number} */
        adjustSize: { width: number, height: number } = undefined
        /** 效果*/
        animation: boolean | kendo.ui.PopupAnimation = undefined
        /** 对应元素 {string|JQuery} */
        anchor: string | JQuery = undefined
        appendTo: string | JQuery = undefined
        collision: string = undefined
        /** anchor的边缘 {string} 默认"bottom top"*/
        origin: string = "bottom top"
        /** pop的边缘应对origin {string} 默认"top bottom"*/
        position: string = "top bottom"
        activate: (e: kendo.ui.PopupActivateEvent) => void = undefined
        close: (e: kendo.ui.PopupCloseEvent) => void = undefined
        deactivate: (e: kendo.ui.PopupDeactivateEvent) => void = undefined
        open: (e: kendo.ui.PopupOpenEvent) => void = undefined

        constructor(options?: Object) {
            if (options) {
                if (options instanceof VinciPopupOptions)
                    return options;
                $.extend(this, options);
            }
        }

        /** 自定义popup尺寸 {[number,number]} 默认自适应*/
        public customSize: [number, number] = undefined;
        /** 触发的事件名称 {string} 默认"click" */
        public triggeringName: string = "click";
        public autoDestory: boolean = true;
    }

    //
    export class VinciPopup extends kendo.ui.Popup {
        private ns = ".VinciPopup"
        constructor(element: Element, options?: IVinciPopupOptions) {
            super(element, new VinciPopupOptions(options))
            this.setSize()
            this.setTriggeringEvents()
        }

        /**
         * 设置popup 的大小
         */
        private setSize(): void {
            let that = this, options = that.options as IVinciPopupOptions
            if (!options.customSize) return;
            that.element.outerWidth(options.customSize[0] || that.element.outerWidth())
            that.element.outerHeight(options.customSize[1] || that.element.outerHeight())
        }

        /**
         * 设置触发open的事件
         */
        private setTriggeringEvents(): void {
            let that = this, options = that.options as IVinciPopupOptions, fn = (e) => {
                if (options.anchorTriggerCallback) options.anchorTriggerCallback(e)
                that.setOptions({ anchor: $(e.target) })
                that.open()
            }
            if (!options.triggeringName) return;
            if (typeof options.anchor === "string") {
                $(document.body).off(options.triggeringName + that.ns, options.anchor)
                $(document.body).on(options.triggeringName + that.ns, options.anchor, fn)
            } else {
                $(options.anchor).off(options.triggeringName + that.ns)
                $(options.anchor).on(options.triggeringName + that.ns, fn)
            }

        }
    }
    VinciPopup.fn = VinciPopup.prototype;
    VinciPopup.fn.options = $.extend(true, {}, kendo.ui.Popup.fn.options);
    VinciPopup.fn.options.name = "VinciPopup";
    kendo.ui.plugin(VinciPopup);

    ///对应KendoGrid中Range<T> 对象
    export class Range {
        Minimum: number | Date
        Maximum: number | Date
        _color: string
        set Color(c: string | number) {
            if (typeof c === "string") this._color = c;
            if (typeof c === "number") this._color = this._colorList[c];
        }
        _colorList = { 0: "black", 7: "gray", 9: "blue", 10: "green", 11: "cyan", 12: "red", 13: "magenta", 14: "yellow", 15: "white", 16: "orange", 25: "#FFCC33", 500: "#43B620" }
        get Color(): string | number {
            return this._color;
        }
        constructor(obj?: Range) {
            if (obj) {
                if (obj instanceof Range)
                    return obj;
                $.extend(this, obj);
                if (typeof this.Minimum === "string") this.Minimum = new Date(this.Minimum as any)
                if (typeof this.Maximum === "string") this.Maximum = new Date(this.Maximum as any)
            }
            return this;
        }
    }

    ///对应KendoGrid中ColorCell<T> 对象
    export class ColorCell {
        Type: string
        Field: string
        Items: Array<Range> = new Array<Range>()
        constructor(obj?: ColorCell) {
            if (obj) {
                if (obj instanceof ColorCell)
                    return obj;
                $.extend(this, obj);
                this.Items = new Array<Range>()
                if (obj["Items"] && obj["Items"].length > 0)
                    obj["Items"].forEach(i => {
                        this.Items.push(new Range(i))
                    })
            }
            return this;
        }
        setColor(td: HTMLTableCellElement, value: any) {
            if (this.Items && this.Items.length > 0) {
                this.Items.forEach(item => {
                    if (!td.innerText) return;
                    let number = this.getValue(this.Type, value, td);
                    if (number >= item.Minimum && number < item.Maximum) {
                        td.style.backgroundColor = item.Color as string;
                        if (item.Color == "black") td.style.color = "white"
                    }
                })
            }
        }
        getValue(type: string, source: any, td: HTMLTableCellElement) {
            switch (type) {
                case "DateTime":
                    return new Date(source);
                default:
                    // return parseFloat(td.innerText)
                    return parseFloat(source)
            }
        }
    }

    export interface IVinciGridOptions extends kendo.ui.GridOptions, IVinciUIOptions {
        cellColor?: boolean
        cellColorField?: string
        gridSolutionId?: string
        showrowcheckbox?: boolean
        dblClick?: Function
        toolTip?: boolean
        showIndex?: boolean
        toolbar?: any
        gridDateRequestOptions?: EAP.UI.GridDataRequest
        viewData?: Array<any>
    }
    export class VinciGridOptions implements IVinciGridOptions {
        name: string = undefined
        allowCopy: kendo.ui.GridAllowCopy = undefined
        altRowTemplate: string | Function = undefined
        autoBind: boolean = true
        columnResizeHandleWidth: number = undefined
        columns: kendo.ui.GridColumn[] = undefined
        columnMenu: kendo.ui.GridColumnMenu = undefined
        dataSource: any | any | kendo.data.DataSource = []
        detailTemplate: string | Function = undefined
        editable: kendo.ui.GridEditable = "inline"
        excel: kendo.ui.GridExcel = undefined
        filterable: kendo.ui.GridFilterable = undefined
        groupable: kendo.ui.GridGroupable = undefined
        height: number | string = undefined
        messages: kendo.ui.GridMessages = undefined
        mobile: boolean | string = undefined
        navigatable: boolean = undefined
        noRecords: kendo.ui.GridNoRecords = undefined
        pageable: kendo.ui.GridPageable = undefined
        pdf: kendo.ui.GridPdf = undefined
        reorderable: boolean = undefined
        resizable: boolean = undefined
        rowTemplate: string | Function = undefined
        scrollable: kendo.ui.GridScrollable = undefined
        selectable: boolean | string = undefined
        sortable: kendo.ui.GridSortable = { allowUnsort: false, mode: "single" }
        toolbar: kendo.ui.GridToolbarItem[] = undefined
        cancel: (e: kendo.ui.GridCancelEvent) => void = undefined
        change: (e: kendo.ui.GridChangeEvent) => void = undefined
        columnHide: (e: kendo.ui.GridColumnHideEvent) => void = undefined
        columnMenuInit: (e: kendo.ui.GridColumnMenuInitEvent) => void = undefined
        columnReorder: (e: kendo.ui.GridColumnReorderEvent) => void = undefined
        columnResize: (e: kendo.ui.GridColumnResizeEvent) => void = undefined
        columnShow: (e: kendo.ui.GridColumnShowEvent) => void = undefined
        dataBinding: (e: kendo.ui.GridDataBindingEvent) => void = undefined
        dataBound: (e: kendo.ui.GridDataBoundEvent) => void = undefined
        detailCollapse: (e: kendo.ui.GridDetailCollapseEvent) => void = undefined
        detailExpand: (e: kendo.ui.GridDetailExpandEvent) => void = undefined
        detailInit: (e: kendo.ui.GridDetailInitEvent) => void = undefined
        edit: (e: kendo.ui.GridEditEvent) => void = undefined
        excelExport: (e: kendo.ui.GridExcelExportEvent) => void = undefined
        pdfExport: (e: kendo.ui.GridPdfExportEvent) => void = undefined
        filterMenuInit: (e: kendo.ui.GridFilterMenuInitEvent) => void = undefined
        remove: (e: kendo.ui.GridRemoveEvent) => void = undefined
        save: (e: kendo.ui.GridSaveEvent) => void = undefined
        saveChanges: (e: kendo.ui.GridSaveChangesEvent) => void = undefined
        columnLock: (e: kendo.ui.GridColumnLockEvent) => void = undefined
        columnUnlock: (e: kendo.ui.GridColumnUnlockEvent) => void = undefined
        navigate: (e: kendo.ui.GridNavigateEvent) => void = undefined

        constructor(options?: any) {
            if (options) {
                if (options instanceof VinciGridOptions)
                    return options;
                $.extend(true, this, options);
            }
        }
        cellColor: boolean = false
        cellColorField: string = "ColorCells"
        gridSolutionId: string = undefined
        showrowcheckbox: boolean = false
        dblClick: Function = undefined
        toolTip: boolean = false
        showIndex: boolean = false
        gridDateRequestOptions: EAP.UI.GridDataRequest = undefined
        viewData: Array<any>
    }
    export class VinciGrid extends kendo.ui.Grid {
        originCols: kendo.ui.GridColumn[] = []
        /**不包含从视图中获取的部分*/
        customCols: kendo.ui.GridColumn[] = []
        rowIndex: number = 0
        gridDataRequest: GridDataRequest
        currentPostData: any = {}
        customFilter
        kTooltip: kendo.ui.Tooltip
        checkedItems: Array<any>
        schema = {
            data: function (d) {
                if ($.isArray(d)) return d
                if (d.rows || d.Collection) return d.rows || d.Collection;
                for (let name in d) if ($.isArray(d[name])) return d[name];
            },
            total: (d) => { return d.total || d.TotalCount; },//总条数
            model: null
        }
        /// <field name='getColumnWidth' type='Function'>(field:string) => float</field>
        constructor(element: Element, options?: IVinciGridOptions) {
            super(element, { columns: [] })//undefined
            let that = this, originDataBinding = options.dataBinding;
            options = new VinciGridOptions(options)
            this.customCols = options.columns || [];
            ///mvvm 修改之后不会有刷新动作 
            options.dataBinding = (e: kendo.ui.GridDataBindingEvent) => {
                if (options.showIndex === true) {
                    that.rowIndex = options.pageable ? ((e.sender.dataSource.page() - 1) * e.sender.dataSource.pageSize()) : 0;
                    let width = String(that.rowIndex + (options.pageable ? that.dataSource.pageSize() || 100 : that.dataSource.total())).length * parseFloat(window.getComputedStyle(document.body, null).getPropertyValue("font-size"))
                    let indexcol = that.wrapper.find(".k-grid-header-locked col:first")[0]
                    if (indexcol) indexcol.style.width = width + "px";
                }
                if (originDataBinding) originDataBinding(e)
                switch (e.action) {
                    case 'itemchange':
                        //为解决编辑grid刷新问题
                        e.preventDefault();
                        break;
                }
                //var rows = this.tbody.children();
                //for (var i = 0; i < rows.length; i++) {
                //    kendo.unbind(rows[i]);
                //}
            }

            this.init(element, options)
            let ops = that.options as IVinciGridOptions

            if (ops.dblClick) {
                that.element.on('dblclick', 'tbody tr', function (e) {
                    if ($(e.target).is(":checkbox[data-role=rowcheckbox]")) return;
                    let $target = $(e.target).closest("tr");
                    if (ops.showrowcheckbox) {
                        that.clearAll();
                        let $rowCheckbox = $target.find(':checkbox[data-role="rowcheckbox"]');
                        $rowCheckbox.prop("checked", true);
                        $rowCheckbox.trigger("change");
                    }
                    var item = that.dataItem($target);//that.grid.select()
                    ops.dblClick(item, e);
                });
            }

            if (ops.gridDateRequestOptions)
                that.setData(ops.gridDateRequestOptions);
        }
        init(element: any, options?: IVinciGridOptions) {
            let that = this, viewData = [], ops: IVinciGridOptions = $.extend({}, options || {}), customCols = $.extend(true, [], that.customCols), originCols = that.originCols = customCols
            if (ops.gridSolutionId) {
                let result = EAP.UI.GetGridColumns(ops.gridSolutionId, customCols);
                that.originCols = originCols = result.columns;
                viewData = result.items;
            }
            ops.columns = this.convertColumns($.extend(true, [], originCols), ops);
            if (typeof ops.selectable !== "boolean")
                ops.selectable = ops.selectable || "multiple, row"
            if (ops.pageable !== false && (!ops.pageable || ops.pageable === true))
                ops.pageable = {
                    refresh: true,
                    pageSizes: [10, 20, 30, 50, 100],
                    buttonCount: 5
                }
            if (ops.showrowcheckbox) ops.selectable = false;
            //ops.editable = ops.editable || "inline"
            //ops.sortable = ops.sortable === undefined ? { allowUnsort: false, mode: "single" } : ops.sortable
            ops.viewData = (ops.viewData && ops.viewData.length > 0) ? ops.viewData : viewData
            ops.dataSource = ops.dataSource || []
            ops.resizable = true

            super.init(element, ops)
        }
        refresh() {
            super.refresh.call(this, arguments[0])
            //(super.refresh as any)(arguments[0])
            let that = this, ops = that.options as IVinciGridOptions, checkboxheader = that.element.find(" [data-role=rowheadercheckbox]");
            checkboxheader.unbind('change');
            checkboxheader.prop('checked', false);
            checkboxheader.bind('change', function (e: JQueryEventObject) {
                if (e.isDefaultPrevented()) {
                    return;
                }
                (that.element.find(' [data-role=rowcheckbox]') as JQuery).prop("checked", $(e.target).prop("checked")).trigger("change");
            });

            that.element.find("input[data-role=rowcheckbox]").bind("change", function (e) {
                let checked = (e.target as HTMLInputElement).checked, $target = $(e.target);
                $target.closest("tr").toggleClass("state-gridChecked", checked);
                that.dataItem($target.closest("tr"))["grid_selected"] = checked;
                if (that["_events"].change && that["_events"].change[0]) //TODO 应该循环调用或直接trigger
                    that["_events"].change[0]({ sender: that, target: this })
            });

            //翻页也会勾选以选中的 仅限checkItems 如果普通check也需要的话可以在change事件中将item加入到checkedItems
            if (that.checkedItems && that.checkedItems.length > 0) {
                that.checkItems(that.checkedItems);
            }

            let rows = this.tbody.children(), dataItems = this.dataSource.view();
            for (let i = 0; i < dataItems.length; i++) {
                kendo.bind(rows[i], dataItems[i]);
            }

            ///toolTip
            if (ops.toolTip) {
                let toolTipFilter = [], cols = this.options.columns.where(c => c.locked !== true); //hidden col alway gerate a td
                for (let i = 0; i < cols.length; i++) {
                    let tt = cols[i]["toolTipContent"];
                    if (typeof tt === 'boolean' && !tt)
                        toolTipFilter.push(":nth-child(" + (i + 1) + ")");
                }
                if (that.kTooltip)
                    that.kTooltip.destroy();
                that.kTooltip = that.element.find(".k-grid-content").kendoTooltip({
                    filter: "td:not(" + toolTipFilter.join(',') + ")",
                    show: function (e) {
                        if (this.content.text()) {
                            this.content.parent().css("visibility", "visible");
                            e.sender["popup"].wrapper.find('.k-tooltip').addClass('gridTooltip')
                        }
                        else {
                            this.content.parent().css("visibility", "hidden");
                        }
                    },
                    content: e => {
                        let index = e.target.index()
                            , curCol: any = cols[index]
                            , item = that.dataItem(e.target.closest("tr")), content: any = "";
                        if (curCol.toolTipContent)
                            content = curCol.toolTipContent(e, item) || '';
                        else if (curCol.template && Object.prototype.toString.call(curCol.template) === '[object Function]') {
                            content = curCol.template(item)
                            try {
                                if ($(content)[0] instanceof Element)
                                    content = $(content)[0].textContent
                            } catch (e) { }
                        }
                        if (!content) {
                            e.sender["popup"].wrapper.find('.k-tooltip').css("visibility", "hidden")
                            return ''
                        }
                        content = content + '';
                        let mWidth = 12;
                        var totalWidth = 0;
                        for (let ind in content) {
                            let code = content.charCodeAt(ind);
                            if (code >= 0x4E00 && code <= 0x9FA5) {
                                totalWidth += .6
                            } else {
                                totalWidth += .5
                            }
                        }
                        let width = Math.min(totalWidth, mWidth);
                        return '<div style="width: ' + width + 'em; max-width: ' + mWidth + 'em;white-space:normal;word-wrap:break-word;">' + content + '</div>' //overflow-wrap: break-word;
                    }
                }).data("kendoTooltip");
                //that.kTooltip["popup"].wrapper.find('.k-tooltip').addClass('gridTooltip');
            }

            ///color
            this.setCellColor()
        }
        setOption(options: IVinciGridOptions): void {
            this.setOptions(options)
        }
        setOptions(options: IVinciGridOptions): void {
            this.customCols = options.columns || this.customCols || [];
            super.setOptions(options)
        }
        /**
         * remote refresh
         * @param pageindex {number} 
         */
        remoteRefresh(pageindex?: number) {
            let that = this, ops = that.options as IVinciGridOptions
            if (that.pager)
                that.pager.page(pageindex || that.pager.page());
            else that.dataSource.read()
        }
        convertColumns(columns, options?: IVinciGridOptions): Array<any> {
            let that = this, ops = options || that.options as IVinciGridOptions, resultColumns: Array<any> = $.extend([], columns) || [], exitAutoWidth = false;
            resultColumns.forEach(function (o) {
                if (!(o.title instanceof EAP.UI.NoTranslate)) {
                    o.title = System.CultureInfo.GetDisplayText(o.title);
                } else o.title = (o.title as EAP.UI.NoTranslate).title
                if (!o.template) {
                    o.template = function (rowvalue) {
                        let value = System.Reference(rowvalue, o.field);
                        if (value == undefined || value == null) return "";
                        return value;
                    }
                }
                //设置列不可编辑 只有在option.editable=true 时有效
                if (o.editable === false) {
                    o.editable = () => false;
                    //o.editor = function (container, option) {
                    //    container.append(o.template(option.model));
                    //};
                }
                if (o.filterable !== false) { //cell筛选
                    if (!o.filterable) {
                        o.filterable = {};
                    }
                    if (o.filterable.cell) {
                        o.filterable.cell.showOperators = false;
                        o.filterable.cell.operator = "contains";
                        o.filterable.cell.suggestionOperator = "contains"; //filter autoComplete option
                    }
                    else {
                        o.filterable.cell = {
                            showOperators: false,
                            operator: "contains",
                            suggestionOperator: "contains"
                        }
                    }
                }
                if (o.width === void 0 || o.width == "auto") exitAutoWidth = true
                o.sortable = !!o.sortable
            });

            if (ops.showrowcheckbox && !resultColumns.firstOrDefault(c => c.mark_special == "ffCheckbox")) {
                let style = 'style="margin:1px;height:16px;width:16px"'
                    , checkboxColumn = {
                        headerTemplate: '<input class="checkbox" data-role="rowheadercheckbox" ' + style + ' type="checkbox" />',
                        template: '<input class="checkbox" data-role="rowcheckbox" ' + style + ' type="checkbox" />',
                        width: 35,
                        mark_special: "ffCheckbox",
                        //locked: true,
                        toolTipContent: false
                    }
                resultColumns.splice(0, 0, checkboxColumn);
            }
            //显示序号
            if (ops.showIndex === true && resultColumns.findIndex(c => c.mark_special == "fffIndex") === -1) {
                resultColumns.splice(0, 0, {
                    title: "&nbsp;",
                    template: function () {
                        return ++that.rowIndex;
                    },
                    width: 30,
                    mark_special: "fffIndex",
                    locked: true,
                    toolTipContent: false, sortable: false
                });
            }
            if (!exitAutoWidth)
                resultColumns.push({
                    title: "&nbsp;",
                    template: function () {
                        return "";
                    },
                    width: "auto",
                    toolTipContent: false, sortable: false
                })

            return resultColumns;
        }
        setData(griddataRequest: GridDataRequest, schema?) {
            if (!griddataRequest) return;
            let that = this, originSchema = that.schema
            that.gridDataRequest = griddataRequest;
            if (griddataRequest.responseData) originSchema.data = (d) => griddataRequest.responseData(d)
            if (schema) {
                $.extend(originSchema, schema);
            }
            originSchema.model = originSchema.model || {};
            originSchema.model["id"] = 'Id';
            let dataSource = new kendo.data.DataSource({
                transport: {
                    read: function (p) {
                        if ($.isArray(griddataRequest.postdata)) {
                            that.currentPostData = new Array();
                            for (let i = 0; i < (griddataRequest.postdata as Array<Object>).length; i++) {
                                if (typeof griddataRequest.postdata[i] === "object")
                                    that.currentPostData.push($.extend({}, griddataRequest.postdata[i]));
                                else
                                    that.currentPostData.push(griddataRequest.postdata[i]);
                            };
                        }
                        else {
                            that.currentPostData = $.extend({}, griddataRequest.postdata);
                            that.currentPostData.page = p.data.page;
                            that.currentPostData.rows = p.data.page ? p.data.pageSize : -1; //无分页则取所有
                            //现在Filter和自定义filter 不共存
                            if (that.customFilter) {
                                that.currentPostData.filter = that.customFilter;
                            } else if (p.data.filter) {
                                that._fiterRebuild(p.data.filter);
                                that.currentPostData.filter = p.data.filter;
                            }
                            if (p.data.sort) that.currentPostData.sort = p.data.sort;
                        }
                        //保存postdata
                        let executeFnName = griddataRequest.sync ? "ExecuteServerActionSync" : "ExecuteServerAction"
                        new EAP.EAMController()[executeFnName](griddataRequest.url as string, that.currentPostData, function (data) {
                            p.success(data);
                            if (griddataRequest.onLoaded) {
                                griddataRequest.onLoaded({ sender: that });
                            }
                        }, (() => {
                            if (griddataRequest.onError)
                                return function (msg) {
                                    griddataRequest.onError({ sender: that, msg: msg });
                                }
                            else return undefined
                        })());
                    },
                    destroy: function () {
                        alert('destory');
                    },
                    parameterMap: function (options, operation) {
                        if (operation == "read") {
                            var parameter = {
                                page: options.page,    //当前页
                                pageSize: options.pageSize//每页显示个数

                            };
                            return kendo.stringify(options);
                        }
                    }
                },
                batch: true,
                pageSize: parseInt(System.Cookies.get("PageSize") || "30"),
                schema: originSchema,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true

            });

            that.setDataSource(dataSource);
        }
        setDataSource(data) {
            if (data instanceof kendo.data.DataSource) super.setDataSource(data)
            else super.setDataSource(new kendo.data.DataSource({ data: data }));
        }
        //获取已勾选的数据源 ATT
        getSelectedRows() {
            let that = this, ops = that.options as IVinciGridOptions, rows = [];
            if (!ops.showrowcheckbox) {
                let selecteds = that.select();
                selecteds.each((index, element) => {
                    rows.push(that.dataItem(element));
                })
                return rows;
            }
            //showrowcheckbox
            let items = that.dataSource.data(), len = items.length, i;
            for (i = 0; i < len; i++)
                if (items[i].grid_selected === true) rows.push(items[i]);
            return rows;
        }
        /**获取已勾选的数据源ids  太局限，不推荐使用*/
        getSelectedId() {
            let items = this.dataSource.data(), len = items.length, ids = [];
            for (let i = 0; i < len; i++)
                if (items[i].grid_selected === true) ids.push(items[i].id)
            return ids;
        }
        //删除已勾选项，grid中也会改变 ATT
        removeSelected() {
            this.removeItems(this.getSelectedRows());
        }
        //删除已勾选项，grid中也会改变 ATT 包含在removeSelected中
        removeItems(items) {
            let totalItems = this["dataItems"]();
            for (let i = 0; i < items.length; i++) {
                items[i].grid_selected = false;
                totalItems.splice($.inArray(items[i], totalItems), 1);
            }
            this.setDataSource(new kendo.data.DataSource({ data: totalItems }));
        }
        //添加项，grid中也会改变 ATT
        appendItems(items) {
            let totalItems = this.dataSource.data().map(d => d);
            totalItems = totalItems.concat(items);
            this.setDataSource(new kendo.data.DataSource({ data: totalItems }));
        }

        //kendo filter 参数重铸
        _fiterRebuild(filter) {
            for (let i = 0; i < filter.filters.length; i++) {
                if (filter.filters[i].filters) this._fiterRebuild(filter.filters[i]);
                else filter.filters[i].itemOperator = filter.filters[i].operator;
            }

        }
        ///更新td 对应原数据值  ATT  ***前提该列有field属性
        ///unique：在checkbox时使用 若唯一则将列上所有checkbox置为false ATT
        updateValue(td, value, unique?) {
            let $td = $(td), $tr = $td.closest('tr'), index = $td.index(), head = this.wrapper.find(".k-grid-header-wrap th")[index];
            if (!head) return;
            let datafield = $(head).attr('data-field');
            if (!datafield) return;
            let item;
            if (unique) {
                let items = this.dataSource.data()//.dataItems();
                for (let i = 0; i < items.length; i++) {
                    item = items[i];
                    System.SetValue(item, datafield, false)
                }
            }

            item = this.dataItem($tr);
            System.SetValue(item, datafield, value)
        }
        //勾选对象 不管原有是否勾选 ATT
        //翻页也会勾选以选中的 仅限checkItems 如果普通check也需要的话可以在change事件中将item加入到checkedItems
        checkItems(items: Array<any>, forever: boolean = false) {
            let that = this, ops = that.options as IVinciGridOptions
            if (forever === true) that.checkedItems = items;
            let data = that.dataSource.data();
            for (let s = 0; s < data.length; s++) {
                for (let i = 0; i < items.length; i++) {
                    let item = items[i], exitent = true;

                    for (let name in items[i]) {
                        if (data[s][name] != item[name]) {
                            exitent = false;
                            break;
                        }
                    }

                    if (exitent) {
                        if (ops.showrowcheckbox) {
                            data[s].grid_selected = true;
                            $(that.items()[s]).find('input[data-role=rowcheckbox]').prop("checked", true);
                        } else {
                            //单选
                            (that.items()[s] as Element).classList.add('k-state-selected');
                        }

                        break;
                    }

                }
            }
        }
        //清空所有勾选 ATT
        clearAll() {
            this.checkedItems = [];
            var sourceData = this.dataSource.data();
            for (var i = 0; i < sourceData.length; i++) {
                sourceData[i].grid_selected = false;
            }
            this.items().removeClass('state-gridChecked').find(':checkbox[data-role=rowcheckbox]').removeAttr("checked");
        }
        getColumnWidth(field: string) {
            let fieldHeader = this.element.find("th[data-field='" + field + "']");
            //let index = fieldHeader.index();
            //let cssWidth = this.element.find(".k-grid-header-wrap colgroup col:eq(" + index + ")").css("width");
            //let result = parseFloat(cssWidth);
            //if (!result)
            let result = fieldHeader.outerWidth();
            return result;
        }
        //init(element: Element, options?: IVinciGridOptions)
        setCellColor() {
            try {
                let that = this, options = this.options as VinciGridOptions;
                if (!options.cellColor) return;
                let trs = that.wrapper.find(".k-grid-content tr"); //that.items() as JQuery;
                if (trs && trs.length > 0) {
                    trs.each((index, tr) => {
                        let dataItem = that.dataItem(tr)
                        let cellColors = System.getValue(dataItem, options.cellColorField) as Array<ColorCell>
                        if (!cellColors) return;
                        cellColors.forEach(cellColor => {
                            cellColor = new ColorCell(cellColor);
                            let td = that.getTd(tr, cellColor.Field), value = System.getValue(dataItem, cellColor.Field)
                            if (td) cellColor.setColor(td, value)
                        })
                    })
                }
            }
            catch (e) {
                console.error(e)
            }

        }
        getTd(tr: Element, field: string) {
            if (!this.columns) return;
            let idx: number
                , visableCos = this.wrapper.find(".k-grid-header-wrap tr:last th"); //[data-field='" + field + "']
            for (let index = 0; index < visableCos.length; index++) {
                if (visableCos[index].dataset["field"] == field) {
                    idx = index;
                    break;
                }
            }
            if (idx == undefined) return
            return tr.getElementsByTagName("td")[idx]
        }
    }
    VinciGrid.fn = VinciGrid.prototype;
    VinciGrid.fn.options = $.extend(true, { hideButton: true }, kendo.ui.Grid.fn.options);
    VinciGrid.fn.options.name = "VinciGrid";
    kendo.ui.plugin(VinciGrid);

    export class GridControl extends EAP.UI.VinciGrid {
        grid: EAP.UI.VinciGrid
        constructor(options: any) {
            super($(options.selector)[0], options)
            this.grid = this;
        }
        localRefresh() {
            this.refresh()
        }
    }

    export interface IVinciNumericTextBoxOptions extends kendo.ui.NumericTextBoxOptions, IVinciUIOptions {
    }
    export class VinciNumericTextBoxOptions implements IVinciNumericTextBoxOptions {
        name: string = undefined
        culture: string = undefined
        decimals: number = 1
        downArrowText: string = undefined
        format: string = undefined
        max: number = undefined
        min: number = undefined
        placeholder: string = undefined
        spinners: boolean = false
        step: number = undefined
        upArrowText: string = undefined
        value: number = undefined
        change(e: kendo.ui.NumericTextBoxChangeEvent): void { }
        spin(e: kendo.ui.NumericTextBoxSpinEvent): void { }
        constructor(options?: any) {
            if (options) {
                if (options instanceof VinciNumericTextBoxOptions)
                    return options;
                $.extend(this, options);
            }
        }
        resultOptions(): Object {
            if (typeof this.spinners === 'boolean' && this.spinners == false)
                this.placeholder = System.CultureInfo.GetDisplayText('Number')
            this.format = "n" + this.decimals;
            return this;
        }
    }
    export class VinciNumericTextBox extends kendo.ui.NumericTextBox {
        constructor(element?: HTMLElement, options?: IVinciNumericTextBoxOptions) {
            super(element, new VinciNumericTextBoxOptions(options).resultOptions())
            this._configSetSource();
        }
        //设置setSource 回调
        _configSetSource() {
            let that = this;
            this.bind("change", (e: kendo.ui.DatePickerChangeEvent) => {
                that.trigger("setSource", e);
            })
        }
        public setValue(val) {
            this.value(val)
            this.trigger('change')
        }
    }
    VinciNumericTextBox.fn = VinciNumericTextBox.prototype;
    VinciNumericTextBox.fn.options = $.extend(true, {}, kendo.ui.NumericTextBox.fn.options);
    VinciNumericTextBox.fn.options.name = "VinciNumericTextBox";
    kendo.ui.plugin(VinciNumericTextBox);

    //export class FormControlOptions {
    //    //title: string
    //    //name:string
    //}
    interface IFormControl {
    }
    export interface IFormItem {
        name: string
        title?: string | Object
        /**控件宽度*/
        width?: number | string
        style?: CSS
        readonly?: boolean
        maxLength?: number
        validateOptions?: { required: boolean }
        /**控件容器宽度*/
        spectialWidth?: number
    }
    export interface IFormItemFactory {
        Input(options: IFormItem)
        DatePicker(options: IFormItem & IVinciDatePickerOptions)
        DateTimePicker(options: IFormItem & IVinciDateTimePickerOptions)
        SearchBox(options: IFormItem & IVinciSearchBoxOptions)
        DropdownList(options: IFormItem & IVinciDropDownListOptions)
        NumbericTextBox(options: IFormItem & IVinciNumericTextBoxOptions)
        Button(options: IFormItem & { content: string, id?: string, onClick?: (e: JQueryEventObject) => void })
        TextArea(options: IFormItem)
        Element(options: IFormItem & { selector: string | HTMLElement })
        Checkbox(options: IFormItem & { items?: Array<{ value, title: string }>, onChange?: (e: JQueryEventObject) => void })
        Radio(options: IFormItem & { items: Array<{ value, title: string }>, onChange?: (e: JQueryEventObject) => void })
    }
    class FormItemFactory implements IFormItemFactory {
        Input(options: IFormItem): IFormItem {
            options["type"] = "input"
            return options;
        }
        DatePicker(options: IFormItem & IVinciDatePickerOptions): IFormItem {
            options["type"] = "datepicker"
            return options;
        }
        DateTimePicker(options: IFormItem & IVinciDateTimePickerOptions): IFormItem {
            options["type"] = "datetimepicker"
            return options;
        }
        SearchBox(options: IFormItem & IVinciSearchBoxOptions): IFormItem {
            options["type"] = "searchbox"
            return options;
        }
        DropdownList(options: IFormItem & IVinciDropDownListOptions): IFormItem {
            options["type"] = "dropdownlist"
            return options;
        }
        NumbericTextBox(options: IFormItem & IVinciNumericTextBoxOptions): IFormItem {
            options["type"] = "numberic"
            return options;
        }
        Element(options: IFormItem & { selector: string | HTMLElement }): IFormItem {
            options["type"] = "element"
            return options;
        }
        Button(options: IFormItem & { content: string, id?: string, onClick?: (e: JQueryEventObject) => void }): IFormItem {
            options["type"] = "button"
            return options;
        }
        TextArea(options: IFormItem): IFormItem {
            options["type"] = "textarea"
            return options;
        }
        Checkbox(options: IFormItem & { items?: Array<{ value, title: string }>, onChange?: (e: JQueryEventObject) => void }): IFormItem {
            options["type"] = "checkbox"
            return options;
        }
        Radio(options: IFormItem & { items: Array<{ value, title: string }>, onChange?: (e: JQueryEventObject) => void }): IFormItem {
            options["type"] = "radio"
            return options;
        }
    }
    /**FormControlOptions.Data 的 item项*/
    export let FormItem: () => IFormItemFactory = Patterns.Singleton(FormItemFactory, true)

    System.AngularApp.APP_DEPENDENCYS = System.AngularApp.APP_DEPENDENCYS.concat(["kendo.directives", "ngSanitize", "EAMDirecives"])
    export class FormControl implements IFormControl {
        container: HTMLElement
        options: FormOption
        angularApp = ""
        angularController: System.AngularController// = ""
        kendoValidator = undefined
        ngWatch = undefined
        private DEFAULTCOLSPAN = 1
        //sourceData = {}
        public get sourceData(): any {
            var appElement = jQuery(this.options.selector)[0];//获得绑定controllerdom节点
            var $scope = angular.element(appElement).scope(); //获得$scope对象
            return $scope['data']
        }
        public set sourceData(sd: any) {
            var appElement = jQuery(this.options.selector)[0];//获得绑定controllerdom节点
            var $scope = angular.element(appElement).scope(); //获得$scope对象
            $scope['data'] = sd;
        }
        controls = {}
        private afterLoadProcess = []
        kendoControls = {}
        hidedArae: HTMLDivElement
        kendoVinciButtonGroup: VinciButtonGroup
        ngController: any
        constructor(options: FormOption) {
            this.options = new FormOption();
            //this.kendoControls = {};
            //this.controls = {};
            //this.afterLoadProcess = [];
            jQuery.extend(this.options, options);
            this.initForm();
            this.initloadData();
            //this.initForm(option);
            //this.loadData(option);
        }
        initForm() {
            let that = this, option = this.options as any;
            if (!option.selector) {
                throw new Error("selector is null");
            }
            //容器创建
            //if (!option.selector) that.container = document.createElement('div');
            //else that.container = $(option.selector)[0];
            that.container = $(option.selector)[0];
            that.container.style.margin = "14px";
            let $container = $(that.container);

            if (!document.getElementById(name + 'formHidedArea')) {
                that.hidedArae = document.createElement('div');
                that.hidedArae.id = name + "formHidedArea";
                $(that.hidedArae).hide().appendTo($('body'));
            } else {
                that.hidedArae = document.getElementById(name + 'formHidedArea') as HTMLDivElement;
            }

            //if (typeof option.autoPerform === 'boolen' && !option.autoPerform) return;
            //that.afterLoadProcess = [];
            that.initTable(that.container, option.Data)

            that.initFoot(that.container);
            //初始化子区域表单
            that._initSubForms(that.container, option.subForms);

        }
        //初始化子区域表单
        _initSubForms(container, subForms?) {
            if (subForms && subForms.length > 0) {
                for (var i = 0; i < subForms.length; i++) {
                    var form = subForms[i];
                    if (!subForms[i].selector) {
                        throw new Error("selector is null");
                    }
                    this._initSubForms(subForms[i].selector, subForms[i].subForms);
                    this.initTable(subForms[i].selector, subForms[i].Data);
                    $(container).append($(subForms[i].selector));
                }
            }
            $(this.hidedArae).empty();
        }
        initTable(formContainer, Data = [], columnsAmount?, latticWidth?) {
            if (Data.length <= 0) return;
            columnsAmount = this.options.columnsAmount && (columnsAmount || this.options.columnsAmount)
            let that = this, options = that.options as FormOption, titleWidth = parseInt(options.titleWidth) + 8
                , minColSpan = Data.map(d => d.colspan || that.DEFAULTCOLSPAN).sort().shift(), intWidth = parseInt(options.controlUniteWidth as string || "0")
                , divArray = new Array<System.DivCell | System.DivRow>(), contains = [], control_title: number = intWidth + titleWidth
                , cellWidth = columnsAmount ? (100 / columnsAmount) : control_title
            Data.forEach(function (dItem) {
                let oData = jQuery.extend(true, {}, dItem);
                if (!oData["colspan"]) oData["colspan"] = that.DEFAULTCOLSPAN;
                let cell = $("<div/>", { "colspan": oData["colspan"], "class": "formTd" + " " + (oData["wraperClass"] || "") }).DivCell({ width: oData.spectialWidth || (cellWidth * oData["colspan"] + (columnsAmount ? "%" : "px")), align: oData.cellAlign }, oData.name);
                divArray.push(cell);
                //设置宽度
                if (!oData.style) oData.style = {};
                if (oData.style.width == undefined) {
                    if (oData.width != undefined && oData.width != null) oData.style.width = parseInt(oData.width) + "px"///有width也可以使用
                    else oData.style.width = "100%";
                }
                let cTuple: [Element, any] = [cell.element, oData];
                contains.push(cTuple)
            });
            let $formContainer = $(formContainer), hidenarea = $(this.hidedArae);
            $formContainer.children().appendTo(hidenarea);
            //#region 构建控件
            let lattic = $("<div/>").appendTo($formContainer).DivLattic({ width: latticWidth || ((options.autoWidth && columnsAmount) ? control_title / minColSpan * columnsAmount + "px" : "100%") }, divArray) //"calc(100% - 28px)"

            contains.forEach(contain => {
                if (contain[1].controls && contain[1].controls.length > 0) {
                    this.initTable(contain[0], contain[1].controls, (contain[1].controls as Array<any>).sum(c => c.colspan || that.DEFAULTCOLSPAN), "100%");
                    return;
                }
                if (contain[1] && contain[1].type)
                    that._widgetFactory(contain[0], contain[1])
            });
            //tableCreated 回调
            if (options.tableCreated) options.tableCreated(lattic.element);
        }
        initFoot(container) {
            var option = this.options as any;
            $(container).find("[name='Foot']").remove();
            //$("#" + this.angularController.CONTROLLERNAME + "Foot").remove();
            if (option.success || option.cancle) {
                let footDiv = window.document.createElement("div");
                footDiv.setAttribute("name", "Foot")
                //footDiv.id = this.angularController.CONTROLLERNAME + "Foot";
                footDiv.classList.add("formFoot");
                let button;
                if (option.success) {
                    button = window.document.createElement("button");
                    button.type = "button";
                    button.classList.add("k-primary");
                    button.classList.add("formCommit");
                    button.innerHTML = option.success.text;
                    button.setAttribute("ng-click", "sumit()");

                    footDiv.appendChild(button);
                    $(button).kendoButton();
                }
                if (option.cancle) {
                    button = window.document.createElement("button");
                    button.innerHTML = option.cancle.text;
                    button.classList.add("formCancel");
                    button.type = "button";

                    if (option.cancle.fn)
                        button.onclick = option.cancle.fn;
                    footDiv.appendChild(button);
                    $(button).kendoButton();
                }
                $(container).append(footDiv);
            }

            if (this.kendoVinciButtonGroup) {
                this.kendoVinciButtonGroup.destroy()
                this.kendoVinciButtonGroup = undefined;
            }
            if (option.buttonGroupOptions) {
                let footDiv = window.document.createElement("div");
                footDiv.setAttribute("name", "Foot_ButtonGroup")
                //footDiv.id = this.angularController.CONTROLLERNAME + "Foot_ButtonGroup";
                footDiv.classList.add("formFoot");
                $(container).append(footDiv);
                this.kendoVinciButtonGroup = $(footDiv).kendoVinciButtonGroup(option.buttonGroupOptions).data("kendoVinciButtonGroup");
            }
        }
        initloadData() {
            var that = this;
            this.angularController = $(this.container).AngularController(function ($scope) {
                $scope.sumit = function () {
                    that.submit();
                };

                if (that.options.url) {
                    new EAP.EAMController().ExecuteServerAction(that.options.url, {}, function (response) {
                        //that.sourceData = response;
                        $scope.data = response;
                        that._afterLoad();
                    });
                }
                else {
                    that.options.sourceData = that.options.sourceData || {};
                    //that.sourceData = that.options.sourceData;
                    $scope.data = that.options.sourceData;
                    that._afterLoad();
                }
                if (that.options.ngOther)
                    $scope.other = that.options.ngOther;
                that._validateInit();

                //that.kendoValidator = $(that.options.selector).kendoValidator().data("kendoValidator");
            })
        }
        reCompile(module: boolean = false, registed: boolean = true) {
            this.angularController.recompile(module, registed);
            //var injector = angular.injector(['ng', this.angularApp]),
            //    controller = injector.get('$controller'),
            //    rootScope = injector.get('$rootScope'),
            //    newScope = rootScope.$new();
            //// 调用控制器
            //controller(this.angularController, { $scope: newScope });

            //var $compile = angular.injector(['ng',this.angularApp]).get("$compile")
            //$compile(this.container)
            //angular.bootstrap(document, [this.angularApp]);
        }
        rebindScope() {
            this.angularController.rebindScope();
        }
        reloadData(data) {
            if (!data) return;
            var appElement = jQuery(this.options.selector)[0];//获得绑定controllerdom节点
            var $scope = angular.element(appElement).scope(); //获得$scope对象
            $scope["data"] = data;
            this.sourceData = data;
            $scope.$apply();//刷新数据

            this._afterLoad();
        }
        setSourceValue(fieldStr, value) {
            var appElement = jQuery(this.options.selector)[0];//获得绑定controllerdom节点
            var $scope = angular.element(appElement).scope(); //获得$scope对象
            System.SetValue($scope, fieldStr, value);
            System.SetValue(this.sourceData, fieldStr, value);
            $scope.$apply();//刷新数据
        }
        getScope() {
            var appElement = jQuery(this.options.selector)[0];//获得绑定controllerdom节点
            var $scope = angular.element(appElement).scope(); //获得$scope对象
            return $scope;
        }
        validate() {
            if (!this.kendoValidator.validate()) {
                if (this.options.processErrorMessages) {
                    this.kendoValidator.hideMessages();
                    this.options.processErrorMessages(this.kendoValidator.errors());
                }
                return false;
            }
            var requestData = {};
            $.extend(true, requestData, this.sourceData);
            if (this.options.customValidate && !this.options.customValidate(requestData)) {
                return false;
            }
            return true;
        }
        submit() {
            if (!this.validate()) return;
            var requestData = {};
            $.extend(true, requestData, this.sourceData);
            var prompt = System.CultureInfo.GetDisplayText('Prompt')
            if (!this.options.postUrl) {
                EAP.UI.MessageBox.alert(prompt, "postUrl required")
            }
            var that = this;

            if (this.options.prePostProcess) {
                requestData = this.options.prePostProcess(requestData);
            }
            new EAP.EAMController().ExecuteServerActionSync(this.options.postUrl, requestData, function (data) {
                EAP.UI.MessageBox.alert(prompt, System.CultureInfo.GetDisplayText("saveSuccess"));
                if (that.options.success.onSuccess)
                    that.options.success.onSuccess(data);
            }, function (msg) {
                EAP.UI.MessageBox.alert(prompt, System.CultureInfo.GetDisplayText(msg));
                if (that.options.success.onError)
                    that.options.success.onError(msg);
            });
        }

        setOption(option) {
            $.extend(this.options, option);
            let appElement = jQuery(this.options.selector)[0], angularControl = angular.element(appElement);
            this.afterLoadProcess = [];
            this.initTable(angularControl, this.options.Data);
            this.initFoot(angularControl);
            this._initSubForms(this.options.subForms);
            try {
                this.reCompile()
            } catch (e) {
                this.reCompile(false, false);
            }
            //var that = this;
            //angularControl.injector().invoke(function ($compile, $timeout) {
            //    var scope = angularControl.scope();
            //    $compile(appElement)(scope);
            //    //if (that.options.Data && that.options.Data.length > 0) {
            //    //    $compile(appElement)(scope);
            //    //    //scope.$digest();
            //    //    //$timeout(function () {

            //    //    //});
            //    //} else {
            //    //    var foot = $(appElement).find("#" + that.angularController + "Foot");
            //    //    if (foot.length > 0) $compile(foot)(scope);
            //    //}

            //});

            //this.reloadData(option.sourceData);
        }

        //隐藏验证消息
        hideMessages() {
            if (this.kendoValidator)
                this.kendoValidator.hideMessages();
        }

        _afterLoad() {
            for (var i = 0; i < this.afterLoadProcess.length; i++) {
                let process = this.afterLoadProcess[i];
                let control = process.processControl;
                switch (process.controlType) {
                    case "tree":
                        switch (process.behaviour) {
                            case "select":
                                let value = System.Reference(this.sourceData, process.valueFieldName);
                                control._treeSelect(value, process.isCheckbox);
                                control.tree.trigger('change');
                                // this._treeSelect(control, value, process.isCheckbox)
                                break;
                            default:

                        }
                        break;
                    case "grid":
                        switch (process.behaviour) {
                            case "change":
                                let value = System.Reference(this.sourceData, process.valueFieldName);
                                this._gridSelect(control, value, process.isCheckbox, process.mathField);
                                break;
                            default:
                        }
                        break;
                    case "searchbox":
                        switch (process.behaviour) {
                            case "change":
                                let value = System.Reference(this.sourceData, process.valueFieldName);
                                (control as VinciSearchBox).setValue(value)
                                //if (control.option.editable) {
                                //    control.setInputValue(value);
                                //}
                                //else {
                                //    let text = System.Reference(this.sourceData, process.showField);
                                //    control.setUneditableValue(value, text);
                                //}
                                break;
                            default:
                        }
                        break;
                    case "checkbox":
                        switch (process.behaviour) {
                            case "check":
                                let value = System.Reference(this.sourceData, process.valueFieldName);
                                $(control).find(":checkbox").removeProp("checked");
                                if (!value || typeof value !== "string" || value == "") {
                                    break;
                                }
                                let array = value.split(",");
                                for (let i = 0; i < array.length; i++) {
                                    if (array[i] == "")
                                        continue;
                                    $(control).find("input:checkbox[value='" + array[i] + "']").prop("checked", "checked");
                                }
                                $(control).find(":checkbox").trigger("change");
                                break;
                            default:
                        }
                        break;
                    case "datetimepicker":
                        switch (process.behaviour) {
                            case "change":
                                let value = System.Reference(this.sourceData, process.valueFieldName);
                                if (value) {
                                    let date = value
                                    if (typeof value === 'string') date = System.CultureInfo.StrToDate(value);
                                    let fStr = control.options.customFormat;
                                    control.value(date);
                                    control.trigger("change");
                                }
                                else {
                                    control.value("");
                                    control.trigger("change");
                                }
                                break;
                            default:
                        }
                        break;
                    case "datepicker":
                        switch (process.behaviour) {
                            case "change":
                                let value = System.Reference(this.sourceData, process.valueFieldName);
                                if (value) {
                                    let date = value
                                    if (typeof value === 'string') date = System.CultureInfo.StrToDate(value);
                                    date.setHours(0, 0, 0);
                                    let fStr = control.options.customFormat;
                                    control.value(date);
                                    control.trigger("change");
                                }
                                else {
                                    control.value("");
                                    control.trigger("change");
                                }
                                break;
                            default:
                        }
                        break;
                    case "numericinput":
                        switch (process.behaviour) {
                            case "change":
                                let value = System.Reference(this.sourceData, process.valueFieldName);
                                if (value != null && value != undefined) {
                                    control.value(value);
                                } else {
                                    control.value("")
                                }
                                break;
                            default:
                        }
                        break;
                    case 'dropdownlist':
                        let ddlControl = process.processControl as VinciDropDownList;
                        switch (process.behaviour) {
                            case "change":
                                let value = System.Reference(this.sourceData, process.valueFieldName);
                                let autoFirst = true;
                                if (typeof process.autoFirst === 'boolean') autoFirst = process.autoFirst
                                if (!autoFirst || (value != null && value != undefined && value != Guid.Empty)) {//不自动首个 或者有值（）
                                    if (ddlControl.subType == 'grid') {
                                        if (typeof value === 'string')
                                            value = (value as String).split(',')
                                        let array = [];
                                        if ($.isArray(value)) (value as Array<any>).forEach(v => { let ob = {}; ob[process.dataValueField] = v; array.push(ob) })
                                        ddlControl.popupGrid.checkItems(array)
                                        ddlControl.popupGrid.grid.element.find("input[data-role=rowcheckbox]").trigger("change")
                                    } else {
                                        ddlControl.select(function (dataitem) {
                                            let dValue = System.Reference(dataitem, process.dataValueField || "value")
                                            return dValue === value;
                                        });
                                    }
                                    ddlControl.trigger('change');
                                } else {
                                    if (ddlControl.subType == 'grid') {
                                        ddlControl.popupGrid.clearAll();
                                        ddlControl.popupGrid.grid.element.find("input[data-role=rowcheckbox]").trigger("change")
                                    }
                                    else {
                                        ddlControl.select(0);
                                    }
                                    ddlControl.trigger('change');
                                }
                                break;
                            default:
                        }
                        break;
                    default:

                }
            }
            if (this.options.onDataBound) this.options.onDataBound()
        }

        //生成控件
        _widgetFactory(container, oData) {
            let that = this, option = this.options, title = "";

            //加入标题
            if (oData.title) {
                let p = window.document.createElement("p");
                if (typeof oData.title === "string") {
                    var reg = new RegExp('^<([^>\s]+)[^>]*>(.*?<\/\\1>)?$');
                    if (reg.test(oData.title)) {//html标签字符串
                        container.innerHTML += oData.title;
                        title = $(oData.title).text();
                    }
                    else {//只包含内容
                        var objTitle = window.document.createElement("span");
                        objTitle.innerHTML = oData.title;
                        title = oData.title;
                        objTitle.classList.add('formLabel');
                        objTitle.style.width = parseInt(that.options.titleWidth) + "px"// option.titleWidth;
                        p.classList.add("mulit_line");
                        p.appendChild(objTitle);
                        var iElement = window.document.createElement("i");
                        iElement.innerHTML = "&nbsp;";
                        p.appendChild(iElement);
                        container.appendChild(p);
                    }
                } else {//对象{style:{},text:""}
                    var objTitle = window.document.createElement("span");
                    objTitle.innerHTML = oData.title.text;
                    title = oData.title.text;
                    if (oData.title.style) {
                        $(objTitle).css(oData.title.style);
                        if (!oData.title.style.width)
                            objTitle.style.width = option.titleWidth;
                    }
                    else {
                        objTitle.classList.add('formLabel');
                        objTitle.style.width = parseInt(that.options.titleWidth) + "px"// option.titleWidth;
                    }
                    p.classList.add("mulit_line");
                    p.appendChild(objTitle);
                    var iElement = window.document.createElement("i");
                    iElement.innerHTML = "&nbsp;";
                    p.appendChild(iElement);
                    container.appendChild(p);
                }
                container = $("<div style='display: inline-block;width:calc(100% - " + (($(p).outerWidth() || parseInt(that.options.titleWidth)) + 8) + "px)'/>").appendTo(container)[0]
            }
            //readonly
            if (option.readonly) {
                oData.readonly = true;
            }

            let obj, type = oData.type.toLowerCase();
            switch (type) {

                //#region element  控件选择器或控件字符串
                case "element":
                    jQuery(oData.selector).appendTo(jQuery(container));
                    break;
                //#endregion

                //#region text
                case "text":
                    jQuery(oData.content).appendTo(jQuery(container));
                    break;
                //#endregion

                //#region input
                case "input":
                    obj = window.document.createElement("input");
                    obj.name = oData.name;
                    obj.type = "text";
                    obj.setAttribute("controlName", obj.name);
                    obj.setAttribute('ng-model', 'data.' + (oData.fieldCode || oData.name));
                    obj.classList.add("k-input");
                    container.appendChild(obj);
                    let $inputObj = $(obj);
                    if (oData.style) $inputObj.css(oData.style)
                    if (oData.readonly) {
                        $inputObj.attr('readonly', '');
                        $inputObj.addClass("formDisabled")
                    }
                    if (oData.maxLength) $inputObj.attr("maxlength", oData.maxLength);
                    that.kendoControls[oData.name] = obj;// new EAP.UI.InputControl(oData);
                    break;
                //#endregion

                //#region numeric

                case "numericinput":
                    obj = window.document.createElement("input");
                    obj.name = oData.name;
                    obj.setAttribute("controlName", oData.name);
                    //为解决空间点击变色问题，归根揭底 因为前后两个控件，创建控件时样式复制了，添加validate是在之后统一进行的
                    if (oData.validateOptions && oData.validateOptions.required) {
                        obj.classList.add("formRequired");
                    }

                    var $obj = $(obj);
                    if (oData.style) $obj.css(oData.style)
                    container.appendChild(obj);
                    let numbericOptions = new EAP.UI.VinciNumericTextBoxOptions(oData)
                    delete numbericOptions.name;

                    this.kendoControls[oData.name] = $obj.kendoVinciNumericTextBox(numbericOptions).data('kendoVinciNumericTextBox')
                    this.kendoControls[oData.name].bind("setSource", e => {
                        let value = e.sender.value();
                        //var appElement = jQuery(that.options.selector)[0];
                        //var $scope = angular.element(appElement).scope();
                        //System.SetValue($scope["data"], name, value);
                        System.SetValue(that.sourceData, (oData.fieldCode || oData.name), value);
                    })

                    this.afterLoadProcess.push({ controlType: "numericinput", behaviour: "change", valueFieldName: (oData.fieldCode || oData.name), processControl: that.kendoControls[oData.name] });

                    break;
                //#endregion

                //#region button
                case "button":
                    obj = document.createElement("button");
                    obj.innerHTML = oData.content;
                    obj.type = "button";
                    obj.style.lineHeight = "1.3em";
                    obj.classList.add("k-button");
                    if (oData.id)
                        obj.id = oData.id;
                    if (oData.style)
                        $(obj).css(oData.style);
                    if (typeof oData.onClick === "function") {
                        //使用jQuery Event
                        jQuery(obj).on("click", oData.onClick);
                    }
                    container.appendChild(obj);
                    break;
                //#endregion

                //#region searchbox
                case "searchbox":
                    obj = window.document.createElement("input");
                    obj.type = "text";
                    obj.name = oData.name
                    obj.setAttribute("controlName", oData.name);
                    container.appendChild(obj);
                    var $obj = $(obj)
                    if (oData.style) $obj.css(oData.style)
                    let searchboxoptions = new EAP.UI.VinciSearchBoxOptions(oData);
                    delete searchboxoptions["name"];
                    if (searchboxoptions.editable) obj.setAttribute('ng-model', 'data.' + (oData.fieldCode || oData.name));//可编辑时使用angular自身双向绑定功能
                    let vinciSearch = $obj.kendoVinciSearchBox(searchboxoptions).data("kendoVinciSearchBox") as VinciSearchBox
                    that.kendoControls[oData.name] = vinciSearch
                    vinciSearch.bind("setSource", function (e) {  //oData.treeOptions.check
                        let name = obj.name;
                        if (oData.editable) {
                            System.SetValue(that.sourceData, (oData.fieldCode || oData.name), e.text); return;
                        }
                        System.SetValue(that.sourceData, (oData.fieldCode || oData.name), e.value); return;
                    });
                    if (oData["treeOptions"]) {
                        //    //数据加载之后的行为
                        this.afterLoadProcess.push({ controlType: "searchbox", behaviour: "change", valueFieldName: (oData.fieldCode || oData.name), processControl: that.kendoControls[oData.name], showField: oData.showField });
                    }
                    else if (oData["gridOptions"]) {
                        //数据加载之后的行为
                        this.afterLoadProcess.push({ controlType: "searchbox", behaviour: "change", valueFieldName: (oData.fieldCode || oData.name), processControl: that.kendoControls[oData.name], showField: oData.showField });

                    }
                    break;
                //#endregion

                //#region checkbox
                case "checkbox":
                    if (oData.items && oData.items instanceof Array && oData.items.length > 0) {
                        if (oData.name) {
                            //一个字段多选 ，号分割
                            var items = oData.items;
                            obj = document.createElement("input");
                            obj.style.display = "none";
                            obj.name = oData.name;
                            obj.setAttribute('ng-model', 'data.' + (oData.fieldCode || oData.name));
                            container.appendChild(obj);
                            let div = document.createElement("span");
                            div.style.display = "inline-block";
                            for (var t = 0; t < items.length; t++) {
                                var checkObj = window.document.createElement("input");
                                checkObj.type = "checkbox";
                                checkObj.value = items[t].value;
                                $(checkObj).on("change", function (e) {
                                    var checks = $(e.target.parentElement.parentElement).find("input:checked");
                                    var checkIds = "";
                                    for (var i = 0; i < checks.length; i++) {
                                        checkIds += (checks[i] as HTMLInputElement).value + ",";
                                    }
                                    var hiddenInput = e.target.parentElement.parentElement.previousSibling;
                                    that.setSourceValue((oData.fieldCode || oData.name), checkIds.replace(/,$/g, ""));
                                    //$(hiddenInput).val(checkIds.replace(/,$/g, ""));
                                    ////hiddenInput.value = checkIds.replace(/,$/g, "");
                                    //$(hiddenInput).trigger("change");
                                    //出发自定义事件
                                    if (oData.onChange)
                                    { oData.onChange(e); }
                                });
                                var titleObj = window.document.createElement("label");
                                titleObj.appendChild(checkObj);
                                titleObj.appendChild(window.document.createTextNode(items[t].title))
                                div.appendChild(titleObj);

                            }
                            $(div).append("<span style=''><span class='k-invalid-msg'  data-for='" + oData.name + "'></span></span>")
                            container.appendChild(div);
                            //数据加载之后的行为
                            this.afterLoadProcess.push({ controlType: "checkbox", behaviour: "check", valueFieldName: (oData.fieldCode || oData.name), processControl: div });
                        } else {
                            //多字段多选
                            var items = oData.items;
                            let div = document.createElement("span");
                            div.style.display = "inline-block";
                            for (var t = 0; t < items.length; t++) {
                                obj = window.document.createElement("input");
                                var titleObj = window.document.createElement("label");
                                titleObj.appendChild(obj);
                                titleObj.appendChild(window.document.createTextNode(items[t].title))
                                obj.name = items[t].name;
                                obj.type = "checkbox";
                                obj.setAttribute('ng-model', 'data.' + (oData.fieldCode || oData.name));
                                //自定义事件
                                if (oData.onChange) {
                                    $(obj).on("change", oData.onChange);
                                }
                                if (items[t].validateOptions) {
                                    this._validateAttach(obj, items[t].validateOptions);
                                    $(titleObj).append("<span style=''><span class='k-invalid-msg'  data-for='" + items[t].name + "'></span></span>")
                                }
                                div.appendChild(titleObj);
                            }
                            container.appendChild(div);
                        }
                    }
                    else {
                        //单个checkbox
                        obj = window.document.createElement("input");
                        obj.name = oData.name;
                        obj.type = "checkbox";
                        obj.setAttribute('ng-model', 'data.' + (oData.fieldCode || oData.name));
                        obj.setAttribute("controlName", oData.name);

                        //自定义事件
                        if (typeof oData.onChange === "function") {
                            $(obj).on("change", oData.onChange);
                        }
                        var titleObj = window.document.createElement("label");
                        titleObj.appendChild(obj);
                        titleObj.appendChild(window.document.createTextNode(oData.title))
                        $(titleObj).append("<span style=''><span class='k-invalid-msg'  data-for='" + oData.name + "'></span></span>")
                        container.appendChild(titleObj);
                    }
                    break;
                //#endregion

                //#region radio
                case "radio":
                    if (oData.items && oData.items instanceof Array && oData.items.length > 0) {
                        var items = oData.items;
                        let div = document.createElement("span");
                        div.style.display = "inline-block";
                        for (var t = 0; t < items.length; t++) {
                            obj = window.document.createElement("input");
                            obj.name = oData.name;
                            obj.type = "radio";
                            obj.value = items[t].value;
                            obj.setAttribute('ng-model', 'data.' + (oData.fieldCode || oData.name));
                            //自定义事件
                            if (oData.onChange) {
                                $(obj).on("change", oData.onChange);
                            }
                            var titleObj = window.document.createElement("label");
                            titleObj.appendChild(obj);
                            titleObj.appendChild(window.document.createTextNode(items[t].title))
                            div.appendChild(titleObj);
                        }
                        container.appendChild(div);

                    }
                    obj = null;
                    break;
                //#endregion

                //#region datepicker
                case "datepicker":
                    obj = window.document.createElement("input");
                    obj.name = oData.name;
                    obj.setAttribute("controlName", oData.name);

                    var $obj = $(obj);
                    if (oData.style) $obj.css(oData.style)
                    container.appendChild(obj);
                    let dateOptions = new EAP.UI.VinciDatePickerOptions(oData)
                    delete dateOptions.name;
                    this.kendoControls[oData.name] = $obj.kendoVinciDatePicker(dateOptions).data('kendoVinciDatePicker')
                    this.kendoControls[oData.name].bind("setSource", e => {
                        let value = e.sender.value();
                        //var appElement = jQuery(that.options.selector)[0];
                        //var $scope = angular.element(appElement).scope();
                        //System.SetValue($scope, name, value);
                        System.SetValue(that.sourceData, (oData.fieldCode || oData.name), value);
                    })

                    var afterProcessObj = new EAP.UI.FormAfterProcessObj();
                    afterProcessObj.valueFieldName = (oData.fieldCode || oData.name);
                    afterProcessObj.behaviour = "change";
                    afterProcessObj.controlType = "datepicker";
                    afterProcessObj.processControl = this.kendoControls[oData.name];
                    this.afterLoadProcess.push(afterProcessObj);
                    break;
                //#endregion

                //#region timepicker
                case "timepicker":
                    obj = window.document.createElement("input");
                    obj.name = oData.name;
                    obj.setAttribute('ng-model', 'data.' + (oData.fieldCode || oData.name));
                    obj.setAttribute("kendo-Time-Picker", "");
                    obj.setAttribute("controlName", oData.name);
                    container.appendChild(obj);
                    if (oData.style)
                        $(obj).css(oData.style);
                    $(obj.parentElement).append("<span class='k-invalid-msg'  data-for='" + oData.name + "'></span>");
                    break;
                //#endregion

                //#region datetimepicker
                case "datetimepicker":
                    obj = window.document.createElement("input");
                    obj.name = oData.name;
                    obj.setAttribute("controlName", oData.name);
                    var $obj = $(obj);
                    if (oData.style) $obj.css(oData.style)
                    container.appendChild(obj);
                    let dateTimeOptions = new EAP.UI.VinciDateTimePickerOptions(oData)
                    delete dateTimeOptions.name;
                    this.kendoControls[oData.name] = $obj.kendoVinciDateTimePicker(dateTimeOptions).data('kendoVinciDateTimePicker')
                    this.kendoControls[oData.name].bind("setSource", e => {
                        let value = e.sender.value();
                        //var appElement = jQuery(that.options.selector)[0];
                        //var $scope = angular.element(appElement).scope();
                        //System.SetValue($scope, name, value);
                        System.SetValue(that.sourceData, (oData.fieldCode || oData.name), value);
                    })

                    //数据加载之后的行为
                    this.afterLoadProcess.push({ controlType: "datetimepicker", behaviour: "change", valueFieldName: (oData.fieldCode || oData.name), processControl: that.kendoControls[oData.name] });
                    break;
                //#endregion

                //#region editor
                case "editor":
                    obj = window.document.createElement("textarea");
                    obj.name = oData.name;
                    obj.setAttribute('k-ng-model', 'data.' + (oData.fieldCode || oData.name));
                    obj.setAttribute("kendo-Editor", "");
                    obj.setAttribute("controlName", oData.name);
                    if (oData.style) $(obj).css(oData.style)
                    container.appendChild(obj);
                    that.kendoControls[oData.name] = new EAP.UI.EditorControl(oData);
                    break;
                //#endregion

                //#region textarea
                case "textarea":
                    obj = window.document.createElement("textarea");
                    obj.name = oData.name;
                    obj.setAttribute('ng-model', 'data.' + (oData.fieldCode || oData.name));
                    obj.setAttribute("controlName", oData.name);
                    obj.classList.add("k-textbox");
                    let $textareaObj = $(obj);
                    if (oData.style) $textareaObj.css(oData.style)
                    container.appendChild(obj);
                    if (oData.readonly) {
                        $textareaObj.attr('readonly', '');
                        $textareaObj.addClass("formDisabled")
                    }
                    if (oData.maxLength) $textareaObj.attr("maxlength", oData.maxLength);
                    that.kendoControls[oData.name] = obj;// new EAP.UI.InputControl(oData);
                    break;
                //#endregion

                //#region dropdownlist
                case "dropdownlist":
                    //普通dropdownlist
                    obj = window.document.createElement("input");
                    obj.name = oData.name;
                    obj.setAttribute("controlName", oData.name);
                    var $obj = $(obj);
                    if (oData.style) $obj.css(oData.style)
                    container.appendChild(obj);
                    let dropDownListOptions = new EAP.UI.VinciDropDownListOptions(oData)
                    delete dropDownListOptions.name;
                    this.kendoControls[oData.name] = $obj.kendoVinciDropDownList(dropDownListOptions).data('kendoVinciDropDownList')
                    this.kendoControls[oData.name].bind("setSource", e => {
                        let item = e.sender.dataItem(); //e.sender.select()
                        if (!item) {
                            System.SetValue(that.sourceData, (oData.fieldCode || oData.name), undefined);
                        }
                        let value = System.getValue(item, dropDownListOptions.dataValueField);//this.value()  未使用这项的原因是有问题 $ undefined $
                        System.SetValue(that.sourceData, (oData.fieldCode || oData.name), value);
                    })

                    if (oData.validateOptions && oData.validateOptions.required) {
                        that.kendoControls[oData.name].wrapper.find('.k-dropdown-wrap').addClass("formRequired");
                    }
                    //数据加载之后的行为
                    this.afterLoadProcess.push({ controlType: "dropdownlist", behaviour: "change", valueFieldName: (oData.fieldCode || oData.name), processControl: that.kendoControls[oData.name], dataValueField: dropDownListOptions.dataValueField, autoFirst: oData.autoFirst });
                    $(obj.parentElement).append("<span class='k-invalid-msg'  data-for='" + oData.name + "'></span>");
                    break;
                //#endregion

                //#region colorpicker
                case "colorpicker":
                    obj = window.document.createElement("input");
                    obj.name = oData.name;
                    obj.setAttribute('k-ng-model', 'data.' + (oData.fieldCode || oData.name));
                    obj.setAttribute("controlName", oData.name);
                    container.appendChild(obj);
                    if (oData.style) $(obj).css(oData.style)
                    that.kendoControls[oData.name] = new EAP.UI.ColorPickerControl(oData);
                    break;
                //#endregion

                //#region grid
                case "grid":
                    obj = window.document.createElement("div");
                    obj.setAttribute("controlName", oData.name);
                    container.appendChild(obj);
                    var $obj = $(obj);
                    $obj.attr("name", oData.name);
                    oData.selector = $obj;
                    var gOptions = new EAP.UI.GridOption();
                    $.extend(gOptions, oData);
                    that.kendoControls[oData.name] = new EAP.UI.GridControl(gOptions);
                    if (oData.gridDateRequestOptions) {
                        oData.gridDateRequestOptions.sync = true;
                        that.kendoControls[oData.name].setData(oData.gridDateRequestOptions);
                    }
                    break;
                //#endregion
                default:

            }
            if (oData.validateOptions) {
                if (obj)
                    this._validateAttach(obj, oData.validateOptions, title);
            }

            this.controls[oData.name] = obj;


            //description
            if (oData.description) {
                var objScription = window.document.createElement("h4");
                objScription.style.color = 'red';
                objScription.setAttribute('flag', 'description');
                objScription.innerHTML = oData.description;
                container.appendChild(objScription);
            }

            //control callback
            if (this.options.widgetCreated) this.options.widgetCreated(that.kendoControls[oData.name], type, oData.name);

        }

        _searchClick(event) {
            var that = this;
            var name = event.sender.element.attr('controlName');
            if (!name) throw new Error("event.target.name");

            var kWindow = that.kendoControls[name + "KWindow"];
            kWindow.center();
            kWindow.open();
        }

        //返回格式话后的字符串 从obj中寻找值
        _format(obj, fStr) {
            var matharray = fStr.match(/{[^}]*}/g);
            for (var i = 0; i < matharray.length; i++) {
                var item = matharray[i];
                var propertyName = item.replace(/(^{)|(}$)/g, "");
                if (obj[propertyName])
                    fStr = fStr.replace(item, obj[propertyName]);
            }
            return fStr;
        }

        _validateInit() {
            var validateOptions = new EAP.UI.VinciValidatorOptions();
            var option = this.options;
            this.kendoValidator = $(option.selector).kendoVinciValidator(option.validatorOptions).data("kendoVinciValidator");
        }
        //附加验证属性
        _validateAttach(element: HTMLElement, valiObj, title?) {
            if (this.options.processErrorMessages) {
                title = title + ":";
            } else {
                title = "";
            }
            for (var property in valiObj) {
                if (!valiObj[property]) continue;
                switch (property) {
                    case "required":
                        element.setAttribute(property, "")
                        element.setAttribute("data-required-msg", title + System.CultureInfo.GetDisplayText("Required"))
                        element.classList.add("formRequired");
                        break;
                    case "max":
                        element.setAttribute(property, valiObj[property])
                        element.setAttribute("data-max-msg", title + "键入值必须小于等于" + valiObj[property])
                        break;
                    case "min":
                        element.setAttribute(property, valiObj[property])
                        element.setAttribute("data-min-msg", title + "键入值必须大于等于" + valiObj[property])
                        break;
                    case "email":
                        (element as HTMLInputElement).type = "email";
                        element.setAttribute("data-email-msg", title + "邮箱格式不正确")
                        break;
                    default:

                }
            }
        }

        //grid 设置选中项 可以之string和array string可以用，号隔开 return boolen//是否改变了
        _gridSelect(kGrid, values, isCheckbox, mathField) {

            var vArray;
            if (values instanceof Array) {
                vArray = values;
            } else if (typeof values === "string") {
                if (values.indexOf(',') > 0) {
                    vArray = values.split(',');
                }
                else {
                    vArray = [];
                    vArray.push(values);
                }
            } else {
                return;
            }

            var items = kGrid.dataSource.data();
            var dataItem = kGrid.dataItems();
            var trItems = kGrid.items();
            var changed = false;
            for (var i = 0; i < items.length; i++) {
                if (vArray.length <= 0)
                    break;
                for (var v = 0; v < vArray.length; v++) {
                    if (vArray[v] == "")
                        vArray.splice(v, 1);
                    var mathValue = System.Reference(items[i], mathField || "Id");
                    if (vArray[v] == mathValue) {
                        if (isCheckbox) {
                            var cb = $(trItems[i]).find(":checkbox[data-role='rowcheckbox']");
                            cb.prop("checked", true);
                            cb.trigger("change");
                            changed = true;
                        }
                        else {
                            kGrid.select(trItems[i]);
                            changed = true;
                        }
                        vArray.splice(v, 1);
                    }
                }
            }
            return changed;
        }

        //同上  待去除
        _treeSelect(kTree, values, isCheckbox) {
            var vArray;
            if (values instanceof Array) {
                vArray = values;
            } else if (typeof values === "string") {
                if (values.indexOf(',') > 0) {
                    vArray = values.split(',');
                }
                else {
                    vArray = [];
                    vArray.push(values);
                }
            } else {
                return;
            }
            for (var i = 0; i < vArray.length; i++) {
                var item = kTree.dataSource.get(vArray[i]);
                var node = kTree.findByUid(item.uid);
                if (isCheckbox) {
                    var cb = node.find("input:checkbox");
                    if (!cb.is(":checked"))
                        cb.prop("checked", true);
                    cb.trigger("change");
                }
                else {
                    kTree.options.select({ sender: kTree, node: node[0] });
                    kTree.select(node);
                }
            }
        }

        //不考虑对象
        _enumArray(dataArray: Array<any>, mathName, value, iterationSubName) {
            var correctArray = [];
            for (var i = 0; i < dataArray.length; i++) {
                if (dataArray[i][mathName] == value) {
                    correctArray.push(dataArray[i]);
                }
                if (dataArray[i][iterationSubName] && dataArray[i][iterationSubName] instanceof Array) {
                    var subArray = this._enumArray(dataArray[i][iterationSubName], mathName, value, iterationSubName);
                    correctArray = correctArray.concat(subArray);
                }
            }
            return correctArray;
        }

        private _destroy() {
            for (let n in this.kendoControls) {
                let prop = this.kendoControls[n];
                if (prop.destroy) prop.destroy();
            }
            $(this.container).remove();
            this.angularController = undefined;
            this.kendoValidator = undefined;
            this.angularApp = undefined;
            this.controls = [];
            $(this.hidedArae).remove();
            this.kendoVinciButtonGroup = undefined;
            this.ngController = undefined;
        }

        public destroy() {
            this._destroy()
        }
    }
    export class TabScripControl {
        tabDiv: Element
        tabUl: HTMLUListElement
        kTabStrip: kendo.ui.TabStrip
        tabs = {}
        contentHeight = 0
        iframes: Array<EAP.UI.IframeItem> = []
        constructor(public options) {
            this.initTab();
        }
        initTab() {
            var option = this.options;
            var that = this;
            this.tabDiv = jQuery(option.selector)[0];
            this.tabUl = document.createElement("ul");
            this.tabDiv.appendChild(this.tabUl);
            jQuery(option.selector).parent().resize(function () {
                $parent[0].style.height = "98%";
                this.contentHeight = $element.innerHeight() - ulHeight - 16;
                $element.children(".k-content").height(this.contentHeight);
            });
            if (option.Data instanceof Array) {
                for (var i = 0; i < option.Data.length; i++) {
                    var oData = option.Data[i];
                    this._generateElement(oData);
                }
            } else if (option.Data) {
                this._generateElement(option.Data);
            }
            var tabStripOption = {
                animation: {
                    open: {
                        effects: "fade"
                    }
                }
            };
            if (option.onShow)
                tabStripOption["show"] = option.onShow;
            tabStripOption["activate"] = option.onActivate || function (e) {
                that._defaultActivate(e);
            };
            //tabStripOption.select = function (e) {
            //    that._defaultActivate(e);
            //};
            //if (option.select)
            //    tabStripOption.select = option.select;
            tabStripOption["tabPosition"] = option.tabPosition;
            this.kTabStrip = $(this.tabDiv).kendoTabStrip(tabStripOption).data("kendoTabStrip");
            var $element = this.kTabStrip.element;
            var $parent = $element.parent();
            $element.height("100%");

            var ulHeight = 0;
            if (!$(this.tabDiv).hasClass("k-tabstrip-left") && !$(this.tabDiv).hasClass("k-tabstrip-right")) {
                ulHeight = $(this.tabUl).outerHeight();
            }

            $parent[0].style.height = "98%";
            this.contentHeight = $element.innerHeight() - ulHeight - 16;
            $element.children(".k-content").height(this.contentHeight);

            $(this.tabUl).delegate("button[data-type='remove']", "click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                var item = $(e.target).closest(".k-item");

                //没有onRemove 或 有onRemove并返回true
                if (!item[0]["onRemove"] || (item[0]["onRemove"] && item[0]["onRemove"](e))) {
                    delete that.tabs[item.index()];
                    that.kTabStrip.remove(item.index());
                }

            });

            //this.activateTab(0);
            this.kTabStrip.select(0);
        }
        _appendTab(taboption) {
            //判断是否存在
            for (let pN in this.tabs) {
                if (this.tabs[pN].title == taboption.title) {
                    //open
                    this.kTabStrip.select($(this.tabs[pN].element).index());
                    return;
                }
            }

            //text
            var text = "";
            if (taboption.removeable) {
                text = taboption.title + "<button style='padding:0;line-height: 1;vertical-align: top;margin-bottom: -2px;' data-type='remove' class='k-button k-button-icon'><span style='margin: 0;' class='k-icon k-i-close'></span></button>";
            } else {
                text = taboption.title
            }

            //content
            var itemSubDiv = document.createElement("div");
            itemSubDiv.style.width = "100%";
            itemSubDiv.style.height = "100%";
            itemSubDiv.style.overflow = "auto";
            if (taboption.item) {
                if (taboption.item.sign) {
                    itemSubDiv.setAttribute("sign", taboption.item.sign);
                }
                if (taboption.item.url) {
                    //url
                    var iframe = document.createElement("iframe");
                    iframe.src = taboption.item.url;
                    iframe.style.overflow = "auto";
                    $(iframe).outerWidth("99%");
                    $(iframe).outerHeight("96%");
                    itemSubDiv.appendChild(iframe);
                } else if (taboption.item.content) {
                    itemSubDiv.innerHTML = taboption.item.content;
                }
            }
            var contenthtml = itemSubDiv.outerHTML;

            //set
            this.kTabStrip.append({
                text: text,
                encoded: false,
                content: contenthtml
            });

            //height
            this.kTabStrip.element.children('div:last').height(this.contentHeight);

            var $li = $(this.tabUl).find("li:last");
            //
            this.tabs[$li.index()] = { element: $(this.tabUl).find("li:last")[0], title: taboption.title };

            //bind onRemove
            if (taboption.removeable) {
                if (taboption.onRemove) {
                    $li[0]["onRemove"] = taboption.onRemove;
                }
            }
        }
        _generateElement(oData) {
            var that = this;
            var li = document.createElement("li");
            if (oData.flag) {
                li.setAttribute("flag", oData.flag);
            }
            var titleSpan = document.createElement("span");
            li.appendChild(titleSpan);

            //是否可移除
            if (oData.removeable) {
                titleSpan.innerHTML += oData.title + "<button style='padding:0;line-height: 1;vertical-align: top;margin-bottom: -2px;' data-type='remove' class='k-button k-button-icon'><span style='margin: 0;' class='k-icon k-i-close'></span></button>";
                if (oData.onRemove)
                    li["onRemove"] = oData.onRemove
            } else {
                titleSpan.innerHTML += oData.title
            }

            this.tabUl.appendChild(li);
            this.tabs[$(li).index()] = { element: li, title: oData.title };

            var itemDiv = document.createElement("div");
            var guid = Guid.NewId();
            itemDiv.setAttribute("tabId", guid);
            if (oData.item) {
                var itemSubDiv = document.createElement("div");
                itemDiv.appendChild(itemSubDiv);
                if (oData.item.sign) {
                    itemSubDiv.setAttribute("sign", oData.item.sign);
                }
                if (oData.item.url) {
                    //url
                    let iframe = document.createElement("iframe");
                    //iframe.src = oData.item.url;
                    iframe.style.overflow = "auto";
                    iframe.frameBorder = "";
                    iframe.scrolling = "no";
                    iframe.style.width = "calc(100% - 1px)";
                    iframe.style.height = "calc(100% - 1px)";
                    //$(iframe).outerHeight($(iframe).parent().innerHeight());
                    itemSubDiv.appendChild(iframe);

                    //create iframeObj
                    var iframeObj = new EAP.UI.IframeItem(oData.item.url, oData.flag, guid, iframe);
                    this.iframes.push(iframeObj);
                } else if (oData.item.content) {
                    itemSubDiv.innerHTML = oData.item.content;
                }
                itemSubDiv.style.width = "100%";
                itemSubDiv.style.height = "100%";
                //itemSubDiv.style.overflow = "auto";

            }
            if (oData.selector) {
                $(oData.selector).appendTo($(itemDiv));
            }
            this.tabDiv.appendChild(itemDiv);
        }
        activateTab(index) {
            this.kTabStrip.activateTab(this.tabs[index].element);
        }
        _defaultActivate(e) {
            var guid = e.contentElement.getAttribute("tabId");
            for (var i = 0; i < this.iframes.length; i++) {
                var iframe = this.iframes[i];
                if (iframe.guid === guid) {
                    iframe.load();
                }
            }
        }
    }

    //vinciValidator
    export interface IVinciValidatorOptions extends kendo.ui.ValidatorOptions, IVinciUIOptions {
        templateIndex: number

    }
    export class VinciValidatorOptions implements IVinciValidatorOptions {
        public templates = ['<div class="k-widget  k-tooltip-validation k-tooltip " style="padding:1px 6px;font-size: 13px;">' +
            '#=message#<div class="k-callout k-callout-n"></div></div>'];
        public requirdMsg = System.CultureInfo.GetDisplayText("Required")
        ///今后可添加index 来控制template
        resultOptions(): Object {
            if (!this.errorTemplate)
                this.errorTemplate = this.templates[this.templateIndex];
            ///required
            if (this.messages) {
                if (!this.messages.required) this.messages.required = this.requirdMsg
            } else {
                this.messages = { required: this.requirdMsg }
            }
            return this;
        }

        public name: string = undefined;
        public errorTemplate: string = undefined;
        public messages: any = undefined;
        public rules: any = undefined;
        public validateOnBlur: boolean = false;
        public validate(e: kendo.ui.ValidatorValidateEvent): void { };

        constructor(options?: any) {
            if (options) {
                if (options instanceof VinciValidatorOptions)
                    return options;
                $.extend(this, options);
            }
        }
        public templateIndex: number = 0;
    }
    export class VinciValidator extends kendo.ui.Validator {
        constructor(element: Element, options?: IVinciValidatorOptions) {
            $(element).closest('form').attr("novalidate", null);
            super(element, new VinciValidatorOptions(options).resultOptions());
        }
        validate() {
            if (super.validate()) return true;
            let list = this.element.find('[aria-invalid="true"]');
            if (this.options.validateOnBlur === false)
                list.one('change', () => this.hideMessages())
            //grid locate error column
            let invalidEle = list.first();
            this.locateColumn(invalidEle)
            return false;
        }
        //grid locate error column
        locateColumn($element: JQuery) {
            let grid = $element.closest('.k-grid');
            let td = $element.closest('td');
            if (grid.length > 0) {
                let kGridContent = (grid.data('kendoGrid') || grid.data('kendoVinciGrid')).wrapper.find('.k-grid-content')
                kGridContent.scrollLeft(kGridContent.scrollLeft() + td.position().left - 60)
            }
        }
    }
    VinciValidator.fn = VinciValidator.prototype;
    VinciValidator.fn.options = $.extend(true, {}, kendo.ui.Validator.fn.options);
    VinciValidator.fn.options.name = "VinciValidator";
    kendo.ui.plugin(VinciValidator);

    //VinciWindow
    export interface IVinciWindowOptions extends kendo.ui.WindowOptions, IVinciUIOptions {
        autoDestory?: boolean
        urlWithoutIframe?: System.UrlObj | string
    }
    export class VinciWindowOptions implements IVinciWindowOptions {
        /// <field name='close' type='Function'>(e: kendo.ui.WindowCloseEvent) => void</field>
        /// <field name='activate' type='Function'>(e: kendo.ui.WindowEvent) => void</field>
        /// <field name='deactivate' type='Function'>(e: kendo.ui.WindowEvent) => void</field>
        /// <field name='dragend' type='Function'>(e: kendo.ui.WindowEvent) => void</field>
        /// <field name='dragstart' type='Function'>(e: kendo.ui.WindowEvent) => void</field>
        /// <field name='error' type='Function'>(e: kendo.ui.WindowEvent) => void</field>
        /// <field name='maximize' type='Function'>(e: kendo.ui.WindowEvent) => void</field>
        /// <field name='minimize' type='Function'>(e: kendo.ui.WindowEvent) => void</field>
        /// <field name='open' type='Function'>(e: kendo.ui.WindowEvent) => void</field>
        /// <field name='refresh' type='Function'>(e: kendo.ui.WindowEvent) => void</field>
        /// <field name='resize' type='Function'>(e: kendo.ui.WindowEvent) => void</field>
        /// <field name='autoDestory' type='Boolean'>前提close == undefined ,若close已定义那么需要手动Destory</field>
        /// <field name='urlWithoutIframe' type='System.UrlObj | string'>System.UrlObj | string</field>
        TRANSPORTSIGN = 'TransportSign'
        public name: string = undefined
        public actions: any = undefined
        public animation: boolean | kendo.ui.WindowAnimation = undefined
        public appendTo: any | string = undefined
        public autoFocus: boolean = true
        public content: kendo.ui.WindowContent = ''
        public draggable: boolean = true
        public iframe: boolean = false
        public height: number | string = undefined
        public maxHeight: number = undefined
        public maxWidth: number = undefined
        public minHeight: number = undefined
        public minWidth: number = undefined
        public modal: boolean = true
        public pinned: boolean = undefined
        public position: kendo.ui.WindowPosition = undefined
        public resizable: boolean = false
        public scrollable: boolean
        public title: string | boolean = System.CultureInfo.GetDisplayText("prompt")
        public visible: boolean = undefined
        public width: number | string = undefined
        public activate: (e: kendo.ui.WindowEvent) => void = undefined
        public close: (e: kendo.ui.WindowCloseEvent) => void = undefined
        public deactivate: (e: kendo.ui.WindowEvent) => void = undefined
        public dragend: (e: kendo.ui.WindowEvent) => void = undefined
        public dragstart: (e: kendo.ui.WindowEvent) => void = undefined
        public error: (e: kendo.ui.WindowEvent) => void = undefined
        public maximize: (e: kendo.ui.WindowEvent) => void = undefined
        public minimize: (e: kendo.ui.WindowEvent) => void = undefined
        public open: (e: kendo.ui.WindowEvent) => void = undefined
        public refresh: (e: kendo.ui.WindowEvent) => void = undefined
        public resize: (e: kendo.ui.WindowEvent) => void = undefined
        resultOptions(): VinciWindowOptions {
            if (this.iframe && this.content && (this.content as string).indexOf(this.TRANSPORTSIGN) < 0) {
                this.content = System.Transportation.setSignForUrl(this.content as string)
            }
            if (this.urlWithoutIframe) this.content = undefined
            return this;
        }
        public autoDestory: boolean = false
        public urlWithoutIframe: System.UrlObj | string = undefined
    }
    export class VinciWindow extends kendo.ui.Window {
        /// <field name='open' type='Function'>(center: boolean = true)=>VinciWindow
        constructor(element: Element, options?: IVinciWindowOptions) {//TODO
            if (!options)
                options = new VinciWindowOptions();
            if (!(options instanceof VinciWindowOptions)) {
                options = $.extend(true, new VinciWindowOptions(), options);
            }
            if (!options.width) {
                options.width = (element as HTMLDivElement).style.width;
            }
            super(element, options.resultOptions());

            ///未设高度 取自动高度
            if (!options.height && options.iframe) {
                let that = this;
                ///auto height
                let windowElement = $(element);
                let iframeDomElement = windowElement.children("iframe")[0] as HTMLIFrameElement;
                let iframeWindowObject = iframeDomElement.contentWindow;

                let iframeDocumentObject = iframeDomElement.contentDocument;
                iframeDomElement.onload = function () {
                    options.height = iframeWindowObject["$"](iframeWindowObject.document).outerHeight();
                    that.setOptions({ height: options.height });
                }
            }
        }
        open(center: boolean = true): VinciWindow {
            let options = this.options as IVinciWindowOptions
            if (options.urlWithoutIframe) {
                let url
                if (options.urlWithoutIframe instanceof System.UrlObj) url = (options.urlWithoutIframe as System.UrlObj).toString()
                else
                    url = options.urlWithoutIframe as string
                let that = this;
                $.ajax({
                    async: false,
                    url: url, success: function (data) {
                        that.element.html(data);
                    }
                })
            }
            if (center) this.center();
            super.open();
            return this;
        }
        _close(systemTriggered) {
            super["_close"](systemTriggered)
        }
        _deactivate() {
            super["_deactivate"]()
            //autoDestory
            let options = this.options as IVinciWindowOptions
            if (options.autoDestory) {
                this.destroy()
            }
        }
    }
    VinciWindow.fn = VinciWindow.prototype;
    VinciWindow.fn.options = $.extend(true, {}, kendo.ui.Window.fn.options);
    VinciWindow.fn.options.name = "VinciWindow";
    kendo.ui.plugin(VinciWindow);

    interface IVinciWindowForSearchboxOptions extends IVinciWindowOptions {
        empty?: (e: kendo.ui.ButtonClickEvent) => void
    }
    class VinciWindowForSearchboxOptions extends VinciWindowOptions implements IVinciWindowForSearchboxOptions {
        empty?: (e: kendo.ui.ButtonClickEvent) => void
    }
    /**
     * {vinciWindowForSearchbox} be specialed just for VinciSearchBox
     */
    class VinciWindowForSearchbox extends VinciWindow {
        constructor(element: Element, options?: IVinciWindowForSearchboxOptions) {
            options = options || new VinciWindowForSearchboxOptions();
            super(element, options);
            this.CustomInit();
        }
        private CustomInit(): void {
            var that = this, options = this.options as VinciWindowForSearchboxOptions;
            that.wrapper.find(".k-window-actions .k-i-empty").addClass("k-i-delete").closest("a").on("click", () => that.trigger("empty"))
        }
    }
    VinciWindowForSearchbox.fn = VinciWindowForSearchbox.prototype;
    VinciWindowForSearchbox.fn.options = $.extend(true, {}, kendo.ui.Window.fn.options);
    VinciWindowForSearchbox.fn.events = ["open", "activate", "deactivate", "close", "refresh", "resize", "resizeEnd", "dragstart", "dragend", "error", "empty"]
    VinciWindowForSearchbox.fn.options.name = "VinciWindow";
    kendo.ui.plugin(VinciWindow);

    export interface IVinciButtonOptions extends kendo.ui.ButtonOptions {
        /** @field content {string} 按钮内容显示 只有VinciButtonGroup中有使用到 */
        content?: string
        /** Element.Id*/
        id?: string
    }
    export class VinciButtonOptions implements EAP.UI.IVinciButtonOptions {
        /** @field content {string} 按钮内容显示 只有VinciButtonGroup中有使用到 */
        content: string = undefined;
        /** Element.Id*/
        id: string = undefined;
        /** @field enable {boolean} 是否启用 默认是 */
        enable: boolean = true;
        /** @field icon {string} 按钮图标 */
        icon: string = undefined;
        /** @field imageUrl {string} 图片url */
        imageUrl: string = undefined;
        /** @field spriteCssClass {string} 自定义css类 */
        spriteCssClass: string = undefined;
        /**
        *   @method click {string} 单击事件
        *   @param e {kendo.ui.ButtonClickEvent}
        */
        click: (e: kendo.ui.ButtonClickEvent) => void = undefined;
        constructor(options?: IVinciButtonOptions) {
            if (options) {
                if (options instanceof VinciButtonOptions)
                    return options;
                return $.extend(this, options);
            }
        }
    }
    export interface IVinciButtonGroupOptions extends IVinciUIOptions {
        items: Array<VinciButtonOptions | string>
        push(item: VinciButtonOptions | string | Function)
        align: string
    }
    export class VinciButtonGroupOptions implements IVinciButtonGroupOptions {
        /** @field align {string} 对齐参数 left center right, default is "center"*/
        public align: string = "center"
        /** @field items {Array<EAP.UI.VinciButtonOptions|string>} */
        public items: Array<VinciButtonOptions | string> = new Array<VinciButtonOptions | string>()
        /**
         * append to items,如果param 是function 则将执行完后结果插入
         * @param item {EAP.UI.VinciButtonOptions|string|Function}
         */
        public push(item: VinciButtonOptions | string | Function) {
            if (typeof item === "function") {
                let r = <VinciButtonOptions | string>(item as Function)();
                if (r) this.items.push(r);
            } else
                this.items.push(<VinciButtonOptions | string>item)
        }
        public resultOptions() {
            return this;
        }
    }
    export class VinciButtonGroup extends kendo.ui.Widget {
        /** @field kButtons {Array<kendo.ui.Button>}  It stored all of button instances */
        kButtons: Array<kendo.ui.Button>
        constructor(element: Element, options?: IVinciButtonGroupOptions) {
            if (!options)
                return;
            super(element)
            this.kButtons = new Array()
            this._renderElements(element, options)
        }
        private _renderElements(element: Element, options: IVinciButtonGroupOptions) {
            element.classList.add("group_bar_" + options.align);
            if (options.items && options.items.length > 0) {
                options.items.forEach(i => {
                    if (i instanceof VinciButtonOptions) {
                        this.kButtons.push($("<button class='group_btn' id='" + i.id + "'>" + i.content + "</button>").appendTo(element).kendoButton(i).data("kendoButton"));
                    } else {
                        $(i).appendTo(element);
                    }
                })
            }
        }
        /**
         * destory VinciButtonGroup
         */
        destroy(): void {
            this.kButtons.forEach(kb => {
                kb.destroy();
            })
            this.kButtons = undefined;
            this.element.remove();
            super.destroy()
        }
    }
    VinciButtonGroup.fn = VinciButtonGroup.prototype;
    VinciButtonGroup.fn.options = $.extend(true, {}, kendo.ui.Widget.fn.options);
    VinciButtonGroup.fn.options["name"] = "VinciButtonGroup";
    kendo.ui.plugin(VinciButtonGroup);

    export interface IVinciAutoCompleteOptions extends kendo.ui.AutoCompleteOptions, IVinciUIOptions {
    }
    export class VinciAutoCompleteOptions extends VinciUIOptions<VinciAutoCompleteOptions> implements IVinciAutoCompleteOptions {
        name: string = undefined
        animation: kendo.ui.AutoCompleteAnimation = undefined
        dataSource: any | kendo.data.DataSource = undefined
        dataTextField: string = undefined
        delay: number = undefined
        enable: boolean = undefined
        filter: string = undefined
        fixedGroupTemplate: string | Function = undefined
        groupTemplate: string | Function = undefined
        height: number = undefined
        highlightFirst: boolean = undefined
        ignoreCase: boolean = undefined
        minLength: number = undefined
        placeholder: string = undefined
        popup: any = undefined
        separator: string = undefined
        suggest: boolean = undefined
        headerTemplate: string | Function = undefined
        template: string | Function = undefined
        valuePrimitive: boolean = undefined
        virtual: kendo.ui.AutoCompleteVirtual = undefined
        change: (e: kendo.ui.AutoCompleteChangeEvent) => void = undefined
        close: (e: kendo.ui.AutoCompleteCloseEvent) => void = undefined
        dataBound: (e: kendo.ui.AutoCompleteDataBoundEvent) => void = undefined
        filtering: (e: kendo.ui.AutoCompleteFilteringEvent) => void = undefined
        open: (e: kendo.ui.AutoCompleteOpenEvent) => void = undefined
        select: (e: kendo.ui.AutoCompleteSelectEvent) => void = undefined
        constructor(options?: any) {
            super();
            return super.getOptions(options);
        }
    }
    export class VinciAutoComplete extends kendo.ui.AutoComplete {
        constructor(element?: Element, options?: IVinciAutoCompleteOptions) {
            super(element, new VinciAutoCompleteOptions(options).resultOptions())
        }
    }
    VinciAutoComplete.fn = VinciAutoComplete.prototype;
    VinciAutoComplete.fn.options = $.extend(true, {}, kendo.ui.AutoComplete.fn.options);
    VinciAutoComplete.fn.options["name"] = "VinciAutoComplete";
    kendo.ui.plugin(VinciAutoComplete);


    export interface IOtherParameters {
        enumId: string
        dataTextField: string
        dataValueField: string
        type: string
        multiple: boolean
    }

    /**QuerySolutionItem 是实体类 TODO move to UI.ts*/
    export class QuerySolutionItem {
        constructor(item: Object) {
            if (item instanceof QuerySolutionItem) return item;
            $.extend(this, item);
        }
        public ControlIndex: number = 0;
        public CustomTitle: string = "";
        public Value: string = "";
        public ControlType: string = "";
        public Header: string = "";
        public IsVisible: boolean = false;
        public DataField: string = "";
        public DataType: string = "";
        public OtherParameters: string = "";
        public Code: string = "";
        public Name: string = "";

        public comOptions: ComOption = null;
        public enums: Array<Object> = [];
        public rangLeftOper: string;
        public rangRightOper: string;

        private _otherParametersObj: Object;
        get OtherParametersGetter(): IOtherParameters {
            if (!this._otherParametersObj && this.OtherParameters && typeof this.OtherParameters === "string")
                this._otherParametersObj = JSON.parse(this.OtherParameters);
            return $.extend(true, {}, this._otherParametersObj);
        }
        ///获取筛选表单Data
        public _filterFormData: Object;
        get FilterFormData(): { title, type: string, name: string, style: {}, colspan, controls: Array<any> } {
            if (!this._filterFormData) {
                let title = this.CustomTitle || System.CultureInfo.GetDisplayText(this.Header);
                let item = {};
                switch (this.ControlType) {
                    case "input":
                        item = { title: title, type: 'input', name: this.Code, wraperClass: "filterTd" };
                        break;
                    case "datetimepicker":
                        item = {
                            name: this.Code,
                            controls: [
                                { title: title, type: 'datetimepicker', name: this.Code + '__' + this.rangLeftOper, wraperClass: "formCGroupL filterTd" },
                                { title: { text: System.CultureInfo.GetDisplayText("to"), style: { color: "rgb(0, 109, 204)", textAlign: "center" } }, type: 'datetimepicker', name: this.Code + '__' + this.rangRightOper, wraperClass: "formCGroupR filterTd" }
                            ],
                            colspan: 2
                        };
                        break;
                    case "datepicker":
                        item = {
                            name: this.Code,
                            controls: [
                                { title: title, type: 'datepicker', name: this.Code + '__' + this.rangLeftOper, wraperClass: "formCGroupL filterTd" },
                                { title: { text: System.CultureInfo.GetDisplayText("to"), style: { color: "rgb(0, 109, 204)", textAlign: "center" } }, type: 'datepicker', name: this.Code + '__' + this.rangRightOper, wraperClass: "formCGroupR filterTd" }
                            ],
                            colspan: 2
                        };
                        break;
                    case "dropdownlist":
                        let that = this;
                        item = {
                            title: title, type: 'dropdownlist', name: this.Code
                            , dataProcess: (data): any => {
                                let item = new Object();

                                //if (that.DataType == 'bool')
                                //    return [{ value: '', text: '' }].concat(data);
                                if (that.OtherParametersGetter.enumId) {
                                    item["Id"] = '';
                                    item["Code"] = '';
                                    if ($.isArray(data) || (data as Array<any>).length) {
                                        data.forEach(function (data) {
                                            data.Code = System.CultureInfo.GetDisplayText(data.Code);
                                        })
                                    }
                                } else
                                    if (that.OtherParametersGetter.dataTextField && that.OtherParametersGetter.dataValueField) {
                                        item[that.OtherParametersGetter.dataTextField] = '';
                                        item[that.OtherParametersGetter.dataValueField] = '';
                                    } else {
                                        item["value"] = '';
                                        item["text"] = '';
                                    }
                                if ((that.OtherParametersGetter.type == 'grid' || that.OtherParametersGetter.type == 'tree') && that.OtherParametersGetter.multiple !== false)//多选不加
                                    return data;
                                return [item].concat(data);
                            },
                            wraperClass: "filterTd"
                        };

                        EAP.UI.DropDownListOptionsConvert(item, this, this.comOptions, this.enums, this.OtherParametersGetter);

                        break;
                    case "numericinput":
                        item = {
                            name: this.Code,
                            controls: [
                                { title: title, type: 'numericinput', name: this.Code + '__' + this.rangLeftOper, wraperClass: "formCGroupL filterTd" },
                                { title: { text: System.CultureInfo.GetDisplayText("to"), style: { color: "rgb(0, 109, 204)", textAlign: "center" } }, type: 'numericinput', name: this.Code + '__' + this.rangRightOper, wraperClass: "formCGroupR filterTd" }
                            ],
                            colspan: 2
                        };
                        break;
                    case "searchbox":
                        item = { title: title, type: 'searchbox', name: this.Code, wraperClass: "filterTd" };
                        EAP.UI.SearchBoxOptionsConvert(item, this, this.comOptions, this.OtherParametersGetter);
                        if (this.OtherParametersGetter["type"] == "tree") {
                            item["treeOptions"]["checkChildren"] = true;
                        }
                        break;
                    default:
                }

                this._filterFormData = item;
            }
            return $.extend(true, {}, this._filterFormData);
        }
    }
    export interface IFilterFormOptions {
        ddlSelector: string | Element
        containSelector: string | Element | JQuery
        items: Array<Object>  //==formControl.Data
        isWindow: boolean
        gridControl: any // EAP.UI.GridControl;
        comOptions: EAP.UI.ComOption
        enums: Array<Object>
        slideToggle: Function
        saveSolCallback: Function
        solutionCode: string
        //formoptions
        columnsAmount: number
        titleWidth: string
        /*
        * filterSolutionId {string}
        */
        filterSolutionId: string
    }
    export class FilterFormOptions implements IFilterFormOptions {
        /** 解决方案ID {string} 若存在下拉框将不显示，伸缩按钮不再存在*/
        filterSolutionId: string;

        ddlSelector: string | Element = undefined;
        containSelector: string | Element | JQuery = undefined;
        items: Array<Object> = [];  //==formControl.Data
        isWindow: boolean = false;
        gridControl: any = null;  //EAP.UI.GridControl
        enums: Array<Object> = null;
        comOptions = new EAP.UI.ComOption();
        slideToggle: Function = null;
        saveSolCallback: Function = null;
        solutionCode: string = "";

        columnsAmount: number = 6;
        titleWidth: string = '120px';
    }
    export class FilterForm {
        public formControl: EAP.UI.FormControl; // EAP.UI.FormControl;
        public filterDDLControl;
        public editApplication;
        public customShowApplication;
        private Element: HTMLDivElement
        private _rangLeftOper = 'gte';
        private _rangRightOper = 'lte';
        private systemFormStruct: Array<QuerySolutionItem>;
        constructor(public options: IFilterFormOptions) {
            let that = this;
            that._initPanel();
            if (!options.filterSolutionId)
                that._initDdl();
            else {
                that._setFormOptions();
                $(that.options.containSelector).find("div:first").hide();
                $(() => that.expandPanel())
            }
        }
        ///查询方案下拉框
        private _initDdl(): void {
            var that = this;
            //ddl
            var ddlOption = new EAP.UI.DropdownListOption();
            ddlOption.readurl = this.options.comOptions.filterGetAllSolutions;
            ddlOption.postData = { code: this.options.solutionCode }
            ddlOption.selector = this.options.ddlSelector;
            ddlOption.onChange = function (e) {
                that.FormStructure = undefined;
                that._setFormOptions();
                //if (that.options.slideToggle)
                //    that.options.slideToggle();
                //filter form process
                that.setFilterFormValue();
                that.search();
            }
            ddlOption.bound = function (data) {
                return data;
            };
            ddlOption.dataTextField = 'Name';
            ddlOption.dataValueField = 'Id';
            this.filterDDLControl = new EAP.UI.DropDownListControl(ddlOption);
            $(function () {
                that.filterDDLControl.kDropDownList.trigger('change');
                //that._initQueryEditor(); //不需要在此初始化 在_initCustomShow中有实现
            })
        }
        private _setFormOptions(): void {
            let options = this.formControl.options;
            options.Data = this._convertData();
            this.formControl.setOption(options);
        }
        /**
         * 查询面板初始化
         */
        private _initPanel(): void {
            let that = this;
            //contianer
            let $select = $(that.options.containSelector).addClass("formFilter");
            let div = document.createElement("div");
            let span = document.createElement("span");
            span.style.display = "block";
            span.style.width = "100%";
            span.style.textAlign = "center";
            span.classList.add("k-icon");
            span.classList.add("k-i-arrow-chevron-down")
            span.onclick = function (e) {
                that.togglePanel()
            };
            span.style.cursor = "pointer";
            div.appendChild(span);
            $select.append(div);
            let formdiv = that.Element = document.createElement("div"), $wrapper = $("<div/>", { name: "filterFormWrapper" })
            formdiv.style.padding = "0 4px";
            $(formdiv).attr("name", 'gridFilter');
            $select.append($wrapper.append(formdiv).hide());
            let formOpiton = new EAP.UI.FormOption();
            formOpiton.selector = formdiv;
            formOpiton.Data = new Array();
            formOpiton.columnsAmount = 0;// this.options.columnsAmount;
            formOpiton.titleWidth = this.options.titleWidth;
            formOpiton.trStyle = null;
            formOpiton.controlUniteWidth = 140;
            this.formControl = new EAP.UI.FormControl(formOpiton);
            $(formdiv).css({ margin: "0px" });
            //查询面板按回车键查询
            $(that.Element).keypress((e) => { if (e.which == 13) { $(e.target).closest(".formFilter").find("#search").click() } })

            this._initButtons();
        }
        ///展开
        public expandPanel(): void {
            this.togglePanel(true)
        }
        //收起
        public hidePanel(): void {
            this.togglePanel(false)
        }
        /**
         * togglePanel {Function}
         * @param direction {boolean} direction==true?展开：收起 ; 无参数=》toggle
         */
        public togglePanel(direction?: boolean): void {
            let $select = $(this.options.containSelector);
            let that = this;
            if (!(typeof direction === "boolean")) {
                var cd = $select.find('div:last').is(":visible");
                direction = !cd;
            }
            if (direction) {
                $select.find('div:first span').removeClass("k-i-arrow-chevron-down").addClass("k-i-arrow-chevron-up");
                $select.find('div:last-child').show();
                //$select.find('div:last-child').slideDown(() => {
                //    if (that.options.slideToggle) {
                //        that.options.slideToggle(direction)
                //    }
                //})
            }
            else {
                $select.find('div:first span').removeClass("k-i-arrow-chevron-up").addClass("k-i-arrow-chevron-down");
                $select.find('div:last-child').hide();
                //$select.find('div:last-child').slideUp(() => {
                //    if (that.options.slideToggle) {
                //        that.options.slideToggle(direction)
                //    }
                //})
            }
            if (that.options.slideToggle) that.options.slideToggle(direction)
        }
        ///获取表单结构  不进行拷贝
        private get FormStructure(): Array<QuerySolutionItem> {
            if (!this.systemFormStruct) {
                let that = this, options = that.options as IFilterFormOptions
                    , sol = options.filterSolutionId ? { Id: options.filterSolutionId } : this.filterDDLControl.kDropDownList.dataItem(this.filterDDLControl.kDropDownList.select());
                if (sol)
                    new EAP.EAMController().ExecuteServerActionSync(this.options.comOptions.filterGetItemsBySolutionId, { id: sol.Id, code: that.options.solutionCode }, (data) => {
                        if (data) {
                            let items: Array<QuerySolutionItem> = new Array<QuerySolutionItem>();
                            (<Array<Object>>data).forEach((obj) => {
                                let item = new EAP.UI.QuerySolutionItem(obj);
                                item.comOptions = this.options.comOptions;
                                item.enums = this.options.enums;
                                item.rangLeftOper = this._rangLeftOper;
                                item.rangRightOper = this._rangRightOper;
                                items.push(item);
                            });
                            if (items.length > 0)
                                that.systemFormStruct = items;
                        }
                    });
            }
            return this.systemFormStruct
        }

        private set FormStructure(items: Array<QuerySolutionItem>) {
            if (items instanceof Array) {
                for (let i = 0; i < items.length; i++) {
                    items[i] = new QuerySolutionItem(items[i])
                    items[i]._filterFormData = undefined
                }
            }
            this.systemFormStruct = items;
        }
        /**
         * 获取方案内容 当前未被使用 不使用
         */
        private _getQuerySolValue(): Array<QuerySolutionItem> {
            let result: Array<QuerySolutionItem>;
            let sol = this.filterDDLControl.kDropDownList.dataItem(this.filterDDLControl.kDropDownList.select());
            if (sol)
                new EAP.EAMController().ExecuteServerActionSync(this.options.comOptions.filterGetItemsBySolutionId, { id: sol.Id }, (data) => {
                    result = data;
                });
            return result;
        }
        /**
         * 设置筛选表单数据源
         */
        private setFilterFormValue() {
            let querySolItems = this.FormStructure;// this._getQuerySolValue();
            let data = new Object();
            //IsVisible==true && filter控件存在 才设置值
            querySolItems.forEach((qsi) => {
                if (!qsi.IsVisible)
                    return;
                if (qsi.DataType == "bool") {
                    qsi.Value = qsi.Value || "";
                    if (qsi.Value.toLowerCase() == "true")
                        System.SetValue(data, qsi.Code, true);
                    else if (qsi.Value.toLowerCase() == "false")
                        System.SetValue(data, qsi.Code, false);
                    else
                        System.SetValue(data, qsi.Code, '');
                    return;
                }
                try {
                    var obj = JSON.parse(qsi.Value);
                    if (typeof obj === "object")
                        for (let n in obj) {
                            let name = n;
                            if (n.indexOf('__' + this._rangLeftOper) != -1) name = qsi.Code + '__' + this._rangLeftOper
                            if (n.indexOf('__' + this._rangRightOper) != -1) name = qsi.Code + '__' + this._rangRightOper
                            System.SetValue(data, name, obj[n]);
                        }
                    else
                        System.SetValue(data, qsi.Code, qsi.Value);
                }
                catch (e) {
                    System.SetValue(data, qsi.Code, qsi.Value);
                }
            });
            this.formControl.reloadData(data);
        }

        private setEditData() {
            let that = this;
            new EAP.EAMController().ExecuteServerAction(that.options.comOptions.filterGetPersonalSolutions, { code: this.options.solutionCode }, (data) => {
                if (data)
                    that.editApplication.setData(data);
            })
        }

        /**
         * 初始化快速查询编辑窗口
         */
        private _initQueryEditor(): void {
            var that = this;
            var appOption = new EAP.UI.EditApplicationOpion();
            appOption.isWindow = true;
            appOption.title = System.CultureInfo.GetDisplayText('QueryMgt');
            appOption.postUrl = this.options.comOptions.filterEditUrl;
            appOption.setOrd = false;
            appOption.columns = [{
                field: 'Name',
                title: System.CultureInfo.GetDisplayText('Name'),
                template: function (value) {
                    if (value) {
                        return System.CultureInfo.GetDisplayText(value.Name);
                    }
                }
            },
            {
                field: 'IsDefault',
                title: System.CultureInfo.GetDisplayText('Default'),
                template: function (value) {
                    if (value && value.IsDefault) {
                        return '<input type="checkbox" name="IsDefault" checked="true"/>';
                    }
                    return '<input type="checkbox" name="IsDefault"/>';
                }
            }
            ];
            appOption.editable = true;
            appOption.onChange = function () {
                //ddl reload
                if (that.filterDDLControl) {
                    that.filterDDLControl.reRead(true);
                    that.filterDDLControl.kDropDownList.trigger('change');
                }
                that.setEditData()
            };
            appOption.deleteUrl = this.options.comOptions.filterDeleteUrl;
            appOption.autoClose = false;
            this.editApplication = new EAP.UI.EditApplication(appOption);

            //checkbox change
            let grid = this.editApplication.gridControl.grid;
            grid.element.on("change", ':checkbox[name="IsDefault"]', e => {
                let checked = $(e.target).prop('checked');
                let tr = $(e.target).closest('tr');
                if (checked) {
                    grid.dataSource.data().forEach(data => {
                        data["IsDefault"] = false;
                    });
                    grid.dataItem(tr)["IsDefault"] = true;
                }
                (grid as kendo.ui.Grid).refresh();
            })
        };

        private _initCustomShow(): void {
            var that = this;
            var appOption = new EAP.UI.EditApplicationOpion();
            appOption.postUrl = undefined
            appOption.isWindow = true;
            appOption.title = System.CultureInfo.GetDisplayText('QueryMgt');
            appOption.setOrd = true;
            appOption.toolbarItems = [{
                type: "button", text: System.CultureInfo.GetDisplayText('QueryMgt'), click: () => {
                    if (!that.editApplication) {
                        that._initQueryEditor();
                    }
                    that.editApplication.open();
                    this.setEditData()
                    new EAP.EAMController().ExecuteServerAction(that.options.comOptions.filterGetPersonalSolutions, { code: this.options.solutionCode }, (data) => {
                        if (data)
                            that.editApplication.setData(data);
                    })
                }
            }]
            appOption.columns = [{
                field: 'Header',
                title: System.CultureInfo.GetDisplayText('Name'),
                template: function (value) {
                    if (value) {
                        return System.CultureInfo.GetDisplayText(value.Header);
                    }
                },
                editor: function (container, options) {
                    container.append(System.CultureInfo.GetDisplayText(options.model.Header));
                }
            }, {
                field: 'CustomTitle',
                title: System.CultureInfo.GetDisplayText('CustomShow'),
                template: function (value) {
                    if (value) {
                        return value.CustomTitle || '';
                    }
                }
            }, {
                field: 'IsVisible',
                title: System.CultureInfo.GetDisplayText('Show'),
                template: function (value) {
                    if (value && value.IsVisible) {
                        return '<input type="checkbox" checked="true"/>';
                    }
                    return '<input type="checkbox" />';
                }
            }
            ];
            appOption.editable = true;
            appOption.onChange = function (result) {
                //construct
                that.FormStructure = (result as Array<any>).map(r => new QuerySolutionItem(r));
                let options = that.formControl.options;
                options.Data = that._convertData();
                that.formControl.setOption(options);
                if (that.options.slideToggle)
                    that.options.slideToggle();
                //setValue
                that.setFilterFormValue();
                //research
                that.search();
            };
            this.customShowApplication = new EAP.UI.EditApplication(appOption);
        }

        ///转化为formControl可用的Data
        private _convertData(): Array<Object> {
            let option = new Array<Object>();
            if (!this.FormStructure)
                return option;
            let formStructure = this.FormStructure || []
            option = formStructure.where(f => f.IsVisible).map(f => f.FilterFormData).extends(this.options.items || [], f => f.name)
            return option;
        }
        private _initButtons(): void {
            let that = this, options = that.options as IFilterFormOptions, btnOptions = new EAP.UI.VinciButtonGroupOptions();
            btnOptions.push(new EAP.UI.VinciButtonOptions({
                content: System.CultureInfo.GetDisplayText('search'), id: "search", click: (e, ...extraPs) => {
                    that.search()
                    //that.options.gridControl.customFilter = that._convertToFilterParameters();
                    //that.options.gridControl.remoteRefresh(extraPs[1] ? undefined : 1);
                }
            }))
            if (!options.filterSolutionId) {
                btnOptions.push(new EAP.UI.VinciButtonOptions({ content: System.CultureInfo.GetDisplayText('Retrieve'), click: () => { that.filterDDLControl.kDropDownList.trigger('change'); } }))
                btnOptions.push(new EAP.UI.VinciButtonOptions({
                    content: System.CultureInfo.GetDisplayText('QueryMgt'), id: "QueryMgt", click: () => {
                        if (!that.customShowApplication) {
                            that._initCustomShow();
                        }
                        that.customShowApplication.open();
                        that.customShowApplication.setData($.extend(true, [], that.FormStructure));
                    }
                }))
            }
            btnOptions.push(new EAP.UI.VinciButtonOptions({
                content: System.CultureInfo.GetDisplayText('Empty'), id: "Empty", click: () => {
                    that.setData({});
                    that.search();
                }
            }))

            if (this.options.comOptions.filterCreateQuerySolution && !options.filterSolutionId)
                btnOptions.push(new EAP.UI.VinciButtonOptions({ content: System.CultureInfo.GetDisplayText('save'), click: () => { that.saveQuerySol(); } }))
            btnOptions.align = "right";
            $("<div/>").appendTo($(this.options.containSelector).find('div:last-child')).kendoVinciButtonGroup(btnOptions)
        }
        /**获取自定义查询方案*/
        public getCustomQuerySol(): Array<QuerySolutionItem> {
            if (this.FormStructure.length <= 0) return new Array<QuerySolutionItem>();
            //数组深拷贝
            let sysStructureClone = new Array<QuerySolutionItem>();
            this.FormStructure.forEach((formS) => {
                sysStructureClone.push($.extend(true, {}, formS));
            });

            let filterParameters = this._convertToFilterParameters();
            if (!filterParameters) return sysStructureClone;
            let filters = filterParameters.filters;
            sysStructureClone.forEach((ssi) => {
                let itemFilters = new Array();
                filters.forEach((filter) => {
                    if (filter.field == ssi.Code)
                        itemFilters.push(filter);
                });
                let array = {};

                if (itemFilters.length > 0) {
                    switch (ssi.ControlType) {
                        case "datetimepicker":
                            itemFilters.forEach((iFilter) => {
                                array[iFilter.field + "__" + iFilter.itemOperator] = System.CultureInfo.FormatDateTime(iFilter.value);
                            });
                            ssi.Value = JSON.stringify(array);
                            break;
                        case "datepicker":
                            itemFilters.forEach((iFilter) => {
                                array[iFilter.field + "__" + iFilter.itemOperator] = System.CultureInfo.FormatDate(iFilter.value);
                            });
                            ssi.Value = JSON.stringify(array);
                            break;
                        case "numericinput":
                            itemFilters.forEach((iFilter) => {
                                array[iFilter.field + "__" + iFilter.itemOperator] = iFilter.value;
                            });
                            ssi.Value = JSON.stringify(array);
                            break;
                        case "searchbox":
                        case "dropdownlist":
                        case "input":
                            ssi.Value = itemFilters[0].value;
                            break;
                    }
                } else ssi.Value = ""
            });
            return sysStructureClone;
        }

        /**返回用于筛选的参数*/
        _convertToFilterParameters() {
            //sysSolutionItems
            let sourceData = this.formControl.sourceData, filters = [], value
            for (let i = 0; i < this.FormStructure.length; i++) {
                let colItem = this.FormStructure[i];
                switch (colItem.ControlType) {
                    case "datetimepicker":
                    case "datepicker":
                    case "numericinput":
                        let valuegt = System.Reference(sourceData, colItem.Code + '__' + this._rangLeftOper);
                        let valuelt = System.Reference(sourceData, colItem.Code + '__' + this._rangRightOper);
                        if (valuelt) {
                            var filterItem = { field: colItem.Code, value: valuelt, itemOperator: this._rangRightOper };
                            filters.push(filterItem);
                        }
                        if (valuegt) {
                            var filterItem = { field: colItem.Code, value: valuegt, itemOperator: this._rangLeftOper };
                            filters.push(filterItem);
                        }
                        break;
                    case "input":
                        value = System.Reference(sourceData, colItem.Code);
                        if (value) {
                            var filterItem = { field: colItem.Code, value: value, itemOperator: 'contains' };
                            filters.push(filterItem);
                        }
                        break;
                    case "dropdownlist":
                        value = System.Reference(sourceData, colItem.Code);
                        if (value !== '' && value !== undefined && value !== null) {  //可能有true false
                            let filterItem = {}
                            if (typeof value === 'string' && value.indexOf(',') > 0)
                                value = (value as String).split(',')
                            if ($.isArray(value) || value.join) {
                                if (value.length == 0 || !value.join) break;
                                value = value.join(',')
                                filterItem = { field: colItem.Code, value: value, itemOperator: 'in' };
                            } else
                                filterItem = { field: colItem.Code, value: value, itemOperator: 'eq' };
                            filters.push(filterItem);
                        }
                        break;
                    case "searchbox":
                        value = System.Reference(sourceData, colItem.Code);
                        if (value) {
                            if (typeof value === "string") {
                                value = value.replace(/; /g, ";").split(";");
                            }
                            if (value instanceof Array) {
                                let item
                                if (item = value.pop())
                                    value.push(item);
                                value = value.join(',').trim()
                            }
                            if ((value as string).slice(-1) == ",") (value as string).slice(0, -1);
                            var filterItem = { field: colItem.Code, value: value, itemOperator: 'in' };
                            filters.push(filterItem);
                        }
                        break;
                    default:

                }
            }
            if (filters.length <= 0)
                return null;
            var filterObj = { logic: 'and', filters: filters };
            return filterObj;
        };
        setData(data) {
            this.formControl.reloadData(data);
        };
        //触发查询事件
        search(reservePaging?: true): void {
            let that = this;
            that.options.gridControl.customFilter = that._convertToFilterParameters();
            that.options.gridControl.remoteRefresh(reservePaging ? undefined : 1);
            //$(this.options.containSelector).find('button#search').trigger('click');
        }
        saveQuerySol(): void {
            let that = this;
            let inputoptions = new EAP.UI.InputDialogOption();
            inputoptions.title = System.CultureInfo.GetDisplayText('save') + System.CultureInfo.GetDisplayText('QueryName');
            inputoptions.content = System.CultureInfo.GetDisplayText('Name');
            inputoptions.inputRequired = true;
            inputoptions.OK = function (data) {
                let queryItems = that.getCustomQuerySol();
                let customQuerySol = { querySolutionItems: queryItems.where(i => i.IsVisible).map(i => { return { Code: i.Code, Value: i.Value } }), name: data, code: that.options.solutionCode };
                new EAP.EAMController().ExecuteServerAction(that.options.comOptions.filterCreateQuerySolution, customQuerySol, (data) => {
                    EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('saveSuccess'));
                    that.filterDDLControl.reRead(true);
                    that.filterDDLControl.kDropDownList.trigger('change');
                    if (that.options.saveSolCallback) {
                        that.options.saveSolCallback(that.formControl.sourceData, customQuerySol, data);
                    }
                });
            }
            let inputWin = new EAP.UI.MessageBox.showInput(inputoptions);
        }
        editQuerySol(): void {

        }
    }


    //视图方案

    export interface IViewSchemeOptions {
        ddlSelector: string | Element
        items: Array<Object> //==formControl.Data
        gridControl: EAP.UI.GridControl // EAP.UI.GridControl;
        comOptions: EAP.UI.ComOption
        saveSolCallback: Function
        viewCode: string
    }
    export class ViewSchemeOptions implements IViewSchemeOptions {
        ddlSelector: string | Element = ''
        items: Array<Object> = []  //==formControl.Data
        gridControl: EAP.UI.GridControl = undefined  //
        comOptions: EAP.UI.ComOption = new EAP.UI.ComOption()
        saveSolCallback: Function = null
        viewCode: string = ""
    }
    export class ViewScheme {
        public viewDDLControl
        public customShowApplication
        public editApplication
        public customCols = new Array()
        public gridoption = new Object()
        public sysView: any = {}
        constructor(public options: IViewSchemeOptions) {
            $.extend(true, this.customCols, this.options.gridControl.customCols);
            this._init();
        }
        _init() {
            var option = this.options;

            var ddlOption = new EAP.UI.DropdownListOption();
            ddlOption.readurl = option.comOptions.viewsReadUrl;
            ddlOption.postData = { code: option.viewCode };
            ddlOption.selector = option.ddlSelector;
            var that = this;
            ddlOption.onChange = function (e) {
                var kddl = e.sender.kDropDownList;
                var obj = kddl.dataItem(kddl.select())
                var gridoption = that.gridoption;
                gridoption["gridSolutionId"] = obj.value;
                that.setGridOption(gridoption);
            }
            ddlOption.bound = function (data) {
                if (data) {
                    data.rows.forEach(d => {
                        if (d.IsSystem) that.sysView.Id = d.value;
                    })
                    return data.rows;
                }
                return [];
            }
            this.viewDDLControl = new EAP.UI.DropDownListControl(ddlOption);
            this.selectDefault();
        }
        selectDefault() {
            var kddl = this.viewDDLControl.kDropDownList;
            var data = this.viewDDLControl.data;
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].IsDefault) {
                        kddl.select(i);
                        this.gridoption["gridSolutionId"] = data[i].value;
                        break;
                    }
                }
                if (!this.gridoption["gridSolutionId"]) {
                    this.gridoption["gridSolutionId"] = kddl.dataItem(kddl.select()).value;
                }
            }

            this.setGridOption(this.gridoption);
        }
        get _getSystemViewCols() { //获取系统视图columns
            let that = this;
            if (!this.sysView.Columns) {
                if (!this.sysView.Id) return [];
                let postData = { id: this.sysView.Id, code: this.options.viewCode };
                new EAP.EAMController().ExecuteServerActionSync(this.options.comOptions.viewColsReadUrl, postData, function (data) {
                    that.sysView.Columns = data;
                });
            }
            return this.sysView.Columns;
        }
        _validateColumns(cols) { //保证系统视图修改，个人试图也跟着修改
            let result = [];
            this._getSystemViewCols.forEach(sc => {
                cols.forEach(c => {
                    if (c.Code == sc.Code) {
                        c.Header = sc.Header;
                        c.IsExport = sc.IsExport;
                        c.SortType = sc.SortType;
                        c.DataType = sc.DataType;
                        c.IsFilterable = sc.IsFilterable;
                        result.push(c);
                        return
                    }
                })
            })
            return result.sort((l, r) => l.ColumnIndex - r.ColumnIndex);
        }
        //获取视图列 访问服务器并未gridoption.viewData赋值，转化数据设置gridoption.columns
        _getViewColumns(gridoption) {
            let controller = new EAP.EAMController(), that = this, data
            if (gridoption.gridSolutionId == that.sysView.Id) data = this._getSystemViewCols;
            else {
                let postData = { id: gridoption.gridSolutionId, code: this.options.viewCode };
                data = controller.ExecuteServerActionSync(this.options.comOptions.viewColsReadUrl, postData);
            }
            gridoption.viewData = that._validateColumns(data);
            gridoption.columns = EAP.UI.GridViewColumnConvert(gridoption.viewData, that.customCols);
        }
        public get currentCols() {
            return this.gridoption["viewData"];
        }
        saveView() {
            var inputOption = new EAP.UI.InputDialogOption();
            inputOption.title = System.CultureInfo.GetDisplayText("Prompt");
            inputOption.content = System.CultureInfo.GetDisplayText("Views") + System.CultureInfo.GetDisplayText("Name");
            inputOption.inputRequired = true;

            var that = this;
            inputOption.OK = function (data) {
                let postData = that.gridoption["viewData"] as Array<any>;
                if (!that.options.viewCode) {
                    throw new Error("viewCode is null");
                }
                postData.forEach(d => {
                    d.Width = that.options.gridControl.getColumnWidth(d.Code);
                })
                var pd = { columns: postData, name: data, viewCode: that.options.viewCode };
                new EAP.EAMController().ExecuteServerAction(that.options.comOptions.saveViewUrl, pd, function (data) {
                    EAP.UI.MessageBox.alert(System.CultureInfo.GetDisplayText('Prompt'), System.CultureInfo.GetDisplayText('saveSuccess'));
                    that.viewDDLControl.reRead(true);
                });
            }
            EAP.UI.MessageBox.showInput(inputOption)
        }
        //初始化自定义显示
        private _initCustomShow(): void {
            let that = this, option = {
                onChange: function (data) {
                    that.gridoption["viewData"] = data;
                    that.gridoption["gridSolutionId"] = null;
                    that.setGridOption(that.gridoption);
                },
                setOrd: true,
                isWindow: true,
                editable: true,
                columns: [],
                toolbarItems: []
            };
            option.toolbarItems = [{
                type: "button", text: System.CultureInfo.GetDisplayText('ViewMgt'), click: () => {
                    if (!that.editApplication) {
                        that._initQueryEditor();
                    }
                    that.editApplication.open();
                    that.setEditData();
                }
            }]
            let data = that.gridoption["viewData"];
            option.columns = [{
                field: 'Header',
                title: System.CultureInfo.GetDisplayText('Name'),
                template: function (value) {
                    if (value) {
                        return System.CultureInfo.GetDisplayText(value.Header);
                    }
                },
                editor: function (container, options) {
                    container.append(System.CultureInfo.GetDisplayText(options.model.Header));
                }
            }, {
                field: 'CustomHeader',
                title: System.CultureInfo.GetDisplayText('CustomShow'),
                template: function (value) {
                    if (value) {
                        return value.CustomHeader || '';
                    }
                }
            }, {
                field: 'IsVisible',
                title: System.CultureInfo.GetDisplayText('Show'),
                template: function (value) {
                    if (value && value.IsVisible) {
                        return '<input type="checkbox" checked="true"/>';
                    }
                    return '<input type="checkbox" />';
                }
            }
            ];

            that.customShowApplication = new EAP.UI.EditApplication(option);
        }
        private setEditData() {
            let that = this;
            new EAP.EAMController().ExecuteServerAction(that.options.comOptions.viewGetPersonalSolutions, { code: this.options.viewCode }, (data) => {
                if (data)
                    that.editApplication.setData(data);
            })
        }
        //初始化编辑窗口
        private _initQueryEditor(): void {
            var that = this;
            var appOption = new EAP.UI.EditApplicationOpion();
            appOption.isWindow = true;
            appOption.title = System.CultureInfo.GetDisplayText('ViewMgt');
            appOption.postUrl = this.options.comOptions.viewEditUrl;
            appOption.prePost = (pd, result) => { if (!result || result.length == 0) return false }
            appOption.setOrd = false;
            appOption.columns = [{
                field: 'Name',
                title: System.CultureInfo.GetDisplayText('Name'),
                template: function (value) {
                    if (value) {
                        return System.CultureInfo.GetDisplayText(value.Name);
                    }
                }
            },
            {
                field: 'IsDefault',
                title: System.CultureInfo.GetDisplayText('Default'),
                template: function (value) {
                    if (value && value.IsDefault) {
                        return '<input type="checkbox" name="IsDefault" checked="true"/>';
                    }
                    return '<input type="checkbox" name="IsDefault"/>';
                }
            }
            ];
            appOption.editable = false;
            appOption.onChange = function () {
                //ddl reload
                if (that.viewDDLControl) {
                    that.viewDDLControl.reRead(true);
                    that.selectDefault()
                    //that.viewDDLControl.kDropDownList.trigger('change');
                }
                that.setEditData();
            };
            appOption.deleteUrl = this.options.comOptions.viewDeleteUrl;
            appOption.autoClose = false;
            this.editApplication = new EAP.UI.EditApplication(appOption);

            //checkbox change
            let grid = this.editApplication.gridControl.grid as kendo.ui.Grid;
            grid.element.on("change", ':checkbox[name="IsDefault"]', e => {
                let checked = $(e.target).prop('checked');
                let tr = $(e.target).closest('tr');
                if (checked) {
                    //只能有一个勾选
                    grid.dataSource.data().forEach(data => {
                        data["IsDefault"] = false;
                    });
                    grid.dataItem(tr)["IsDefault"] = true;
                }
                grid.refresh();
            })
        };
        _setCustomOption() {
            var that = this;
            this.customShowApplication.setData($.extend(true, [], this.gridoption["viewData"]));
        }
        //重新设置grid参数 这里只有columns设置
        setGridOption(gridoption) {
            if (gridoption.gridSolutionId) {
                this._getViewColumns(gridoption);
            } else if (gridoption.viewData && gridoption.viewData.length > 0) {
                gridoption.columns = EAP.UI.GridViewColumnConvert(gridoption.viewData, this.customCols);
            } else if (gridoption.columns && gridoption.columns.length > 0) {
            }
            else {
                return;
                //throw new Error('未能加载栏目方案');
            }
            this.options.gridControl.setOption({
                columns: gridoption.columns,
                viewData: gridoption.viewData
            });
        }
        open() {
            if (!this.customShowApplication) {
                this._initCustomShow();
            }
            this._setCustomOption();
            this.customShowApplication.open();
        }
    }

    //kendoMvvm
    export class KendoMVVM {
        static _index: number = 0
        ///useing to generate all kinds of controls as options
        public static controlOptions = class {
            constructor(public field: string, public width: string = '100%', public required: boolean = false, public maxlength: number = 100, public source?: any, public events?: string) {

            }
            ///generateNumberic使用其他没用
            public decimals: number = 1 //5
        }
        static _getParameters(options): Array<any> {
            let args = new Array();
            for (let name in options) {
                if (options[name] == undefined || options[name] == null) args.push("");
                else {
                    switch (name) {
                        case 'required':
                            args.push(options[name] ? 'required' : '');
                            break;
                        default:
                            args.push(options[name]);
                            break;
                    }
                }
            }
            if (options.required) {
                args[100] = "formRequired";
            } else args[100] = "";

            args[99] = options.decimals;
            return args;
        }
        public static generateInput(options): string {
            let str = '<input name="{0}_' + (++this._index) + '" col_field="{0}" data-bind="value: {0},events:{5}"  style="width:{1}" {2} maxlength="{3}"   class="k-input k-textbox {100}">';
            let args = EAP.UI.KendoMVVM._getParameters(options);
            return <string>str.format.apply(str, args);
        }
        public static generateNumberic(options): string {
            let str = "<span class='formInputSpan'><input data-bind='value: {0},events:{5}' col_field='{0}' name='{0}_" + (++this._index) + "'  style='width:{1}' {2}   class='{100}' maxlength='{3}'  data-role='vincinumerictextbox' data-restrict-decimals='true' data-decimals='{99}' data-format='n{99}'>" +
                "<span class='k-invalid-msg' style='padding:24px'  data-for='{0}_" + this._index + "'></span></span>";
            let args = EAP.UI.KendoMVVM._getParameters(options);
            return <string>str.format.apply(str, args);
        }
        public static generateDatePicker(options): string {
            let str = '<span class="formInputSpan"><input name="{0}_' + (++this._index) + '"  col_field="{0}" {2} data-role="vincidatepicker" class="{100}" data-bind="value: {0},events:{5}"  data-format="' + System.CultureInfo.GetDateFormatStr() + '"  style="width:{1}" maxlength="{3}" data-hide-Button="false">' +
                "<span class='k-invalid-msg' style='padding:24px'  data-for='{0}_" + this._index + "'></span></span>";//yyyy/MM/dd MVVM绑定使用string绑定;
            let args = EAP.UI.KendoMVVM._getParameters(options);
            return <string>str.format.apply(str, args);
        }
        public static generateDateTimePicker(options): string {
            let str = '<span class="formInputSpan"><input name="{0}_' + (++this._index) + '"  col_field="{0}" {2} data-role="vincidatepicker" class="{100}" data-bind="value: {0},events:{5}"  data-format="' + System.CultureInfo.GetDateTimeFormatStr() + '"  style="width:{1}" maxlength="{3}" data-hide-Button="false">' +
                "<span class='k-invalid-msg' style='padding:24px'  data-for='{0}_" + this._index + "'></span></span>";//yyyy/MM/dd MVVM绑定使用string绑定;
            let args = EAP.UI.KendoMVVM._getParameters(options);
            return <string>str.format.apply(str, args);
        }
        ///目前只使用 value/text
        public static generateDropDownList(options): string {
            let str = '<span class="formInputSpan"><input name="{0}_' + (++this._index) + '" col_field="{0}" {2} data-text-field="text" \
            data-value-field="value" data-role="dropdownlist" class="{100}" data-bind="value: {0},source: {4},events:{5}"  style="width:{1}"/>' +
                "<span class='k-invalid-msg' style='padding:24px'  data-for='{0}_" + this._index + "'></span></span>";
            let args = EAP.UI.KendoMVVM._getParameters(options);
            return <string>str.format.apply(str, args);
        }
        public static generateSearchBox(options): string {
            let str = '<span class="formInputSpan"><input name="{0}_' + (++this._index) + '" col_field="{0}" {2}  \
             data-role="vincisearchbox" class="{100}" data-bind="value: {0},source:{4},events:{5}"   style="width:{1}"/>' +
                "<span class='k-invalid-msg' style='padding:24px'  data-for='{0}_" + this._index + "'></span></span>";
            let args = EAP.UI.KendoMVVM._getParameters(options);
            return <string>str.format.apply(str, args);
        }
        public static generateCheckBox(options): string {
            let str = '<input name="{0}_' + (++this._index) + '" type="checkbox" col_field="{0}" data-bind="checked: {0},events:{5}"  style="width:{1};heigh:{1}" {2}  class="{100}">';
            let args = EAP.UI.KendoMVVM._getParameters(options);
            return <string>str.format.apply(str, args);
        }
    }
}

interface JQuery {
    kendoVinciValidator(options?: EAP.UI.IVinciValidatorOptions): JQuery;
    kendoVinciWindow(options?: EAP.UI.IVinciWindowOptions): JQuery;
    kendoVinciButtonGroup(options?: EAP.UI.IVinciButtonGroupOptions): JQuery;
    kendoVinciDatePicker(options?: EAP.UI.IVinciDatePickerOptions): JQuery;
    kendoVinciDateTimePicker(options?: EAP.UI.IVinciDateTimePickerOptions): JQuery;
    kendoVinciCalendar(options?: EAP.UI.IVinciCalendarOptions): JQuery;
    kendoVinciNumericTextBox(options?: EAP.UI.IVinciNumericTextBoxOptions): JQuery;
    kendoVinciAutoComplete(options?: EAP.UI.IVinciAutoCompleteOptions): JQuery;
    kendoVinciGrid(options?: EAP.UI.IVinciGridOptions): JQuery;
    kendoVinciDropDownList(options?: EAP.UI.IVinciDropDownListOptions): JQuery;
    kendoVinciSearchBox(options?: EAP.UI.IVinciSearchBoxOptions): JQuery;
    kendoVinciToolBar(options?: EAP.UI.IVinciToolBarOptions): JQuery;
    kendoVinciPopup(options?: EAP.UI.IVinciPopupOptions): JQuery;
    kendoVinciWeekPicker(options?: EAP.UI.VinciWeekPickerOptions): JQuery;
}
//set monday for first weekday  2016_01版方法 过时 改用在culture文件中直接修改
kendo.culture().calendars.standard["firstDay"] = 1
kendo.culture().calendars.standard.days.firstDay = 1


namespace EAP.UI {
    /**kendo mvvm bind parse tool  data-bind="value:***,source:***" => {value:"",source:""}*/
    export function parseBindings(bind) {
        var result = {},
            idx,
            length,
            token,
            colonIndex,
            key,
            value,
            tokens,
            keyValueRegExp = /[A-Za-z0-9_\-]+:(\{([^}]*)\}|[^,}]+)/g,
            whiteSpaceRegExp = /\s/g;
        bind = bind.replace(whiteSpaceRegExp, "");
        tokens = bind.match(keyValueRegExp);

        for (idx = 0, length = tokens.length; idx < length; idx++) {
            token = tokens[idx];
            colonIndex = token.indexOf(":");

            key = token.substring(0, colonIndex);
            value = token.substring(colonIndex + 1);

            if (value.charAt(0) == "{") {
                value = parseBindings(value);
            }

            result[key] = value;
        }

        return result;
    }
}