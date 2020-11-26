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
//CssHelper.Load("/Resource/Styles/eap.css")
var RPM;
(function (RPM) {
    var HisPatrolMonthTotal = (function (_super) {
        __extends(HisPatrolMonthTotal, _super);
        function HisPatrolMonthTotal() {
            var _this = 
            //super(LayoutW);
            _super.call(this, EAP.UI.AGrid) || this;
            _this.monthItem = [];
            _this.yearItem = [];
            _this.postData = { search: 'patrolmonthtotal', year: new Date().getFullYear(), month: new Date().getMonth() + 1, serviceId: 'Donn.RPM.Interface.IHisPatrolService', entityId: 'Donn.RPM.Entity.HisPatrol' };
            for (var i = 1; i < 13; i++) {
                _this.monthItem.push({ text: i, value: i });
            }
            for (var y = new Date().getFullYear(); y > (new Date().getFullYear() - 3); y--) {
                _this.yearItem.push({ text: y, value: y });
            }
            $(".formFilter").find("span").click();
            $(".formFilter").append(" <div id='searchHisDiv' class='wrapdiv'> </div>");
            _this.initFilter();
            $("#searchHisDiv").find("p").next().css("width", "calc(100% - 100px)");
            $("#searchHisDiv").css("margin", "0px");
            $("div[name='filterFormWrapper']").hide();
            $(document).ready(function () {
                // $(".group_bar_right").find("button:not(:first)").hide();
                $(".gAppOtherTool_div").parent().hide();
                // $(".divLattic").find(".l_divCell:last").hide();
            });
            return _this;
        }
        HisPatrolMonthTotal.prototype.configOptions = function (options) {
            var that = this;
            that.gOptions = new EAP.UI.GridOption();
            that.gOptions.gridSolutionId = 'a800a609-493c-409b-ac88-bf16f0f1e1c8'; //栏目Id
            that.gOptions.dataBound = function () {
                $(".layoutContent .k-grid-content colgroup col:first-child").width(0);
                $(".layoutContent .k-grid-header-wrap colgroup col:first-child").width(0);
            };
            //gOptions.showIndex = false;
            //gOptions.showrowcheckbox = false;
            that.gOptions.pageable = true;
            options.gridOption = that.gOptions;
            options.viewScheme = false;
            options.filter = true;
            options.toolbar = true;
            //傳入自定義參數
            options.gridDataRequest = new EAP.UI.GridDataRequest();
            options.gridDataRequest.postdata = { search: function () { return "patrolmonthtotal"; }, year: function () { return that.postData.year; }, month: function () { return that.postData.month; } };
            $("div[name='formFilter']").find("span").click(function () {
                $(".divLattic").find(".l_divCell:last").hide();
            });
            // options.importorExportor_FullName = "Donn.RPM.Web.HisPatrolExport";
            return options;
        };
        HisPatrolMonthTotal.prototype.Export_Action = function (e) {
            new EAM.Export({ exportorFullName: "Donn.RPM.Web.HisPatrolExport", postData: this.postData, url: EAP.UI.ComOptionObj.exportUrl }).export();
        };
        HisPatrolMonthTotal.prototype.initFilter = function () {
            var that = this, options = new EAP.UI.FormOption(), now = new Date();
            var ogRequestOption = new EAP.UI.GridDataRequest();
            ogRequestOption.url = { controller: "RPM", action: 'DepartmentAll' };
            var gridOptions = new EAP.UI.GridOption();
            gridOptions.columns = [{ "field": "Name", "title": "部门名称" }];
            options.selector = '#searchHisDiv';
            options.titleWidth = "30px";
            options.columnsAmount = 6;
            //options.controlUniteWidth = 180;
            options.Data = [
                {
                    name: "year", type: "dropdownlist", style: { width: "90px" }, title: "年份", Data: that.yearItem,
                    change: function (e) {
                        e.preventDefault();
                        that.filterForm.options.sourceData["year"] = this["value"]();
                        that.postData.year = this["value"]();
                    }
                },
                {
                    name: "month", type: "dropdownlist", style: { width: "60px" }, title: '月份', Data: that.monthItem,
                    change: function (e) {
                        e.preventDefault();
                        that.filterForm.options.sourceData["month"] = this["value"]();
                        that.postData.month = this["value"]();
                    }
                },
                {
                    controls: [
                        {
                            type: "button", content: '搜索', onClick: function () {
                                var year = that.filterForm.options.sourceData["year"];
                                if (year === undefined) {
                                    alert("请选择年份");
                                    return;
                                }
                                var month = that.filterForm.options.sourceData["month"];
                                if (month === undefined) {
                                    alert("请选择月份");
                                    return;
                                }
                                that.postData.year = year;
                                that.postData.month = month;
                                that.app.gridControl.remoteRefresh();
                                //new EAP.EAMController().ExecuteServerActionSync(new System.UrlObj("Business", "GetListPage"),that.postData, function (data) {
                                //        var grid = (that.app as EAP.UI.AGrid);
                                //        grid.gridControl.setDataSource(data.rows);
                                //    });
                            },
                            style: { marginRight: "80px" }, width: 60
                        }
                    ]
                }
            ];
            options.sourceData = that.postData;
            this.filterForm = new EAP.UI.FormControl(options);
        };
        return HisPatrolMonthTotal;
    }(EAP.UI.BaseController));
    ;
    new HisPatrolMonthTotal();
})(RPM || (RPM = {}));
