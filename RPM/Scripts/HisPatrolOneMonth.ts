﻿//CssHelper.Load("/Resource/Styles/eap.css")
namespace RPM {
    class HisPatrolOneMonth extends EAP.UI.BaseController {
        filterForm: any;
        monthItem: Array<any> = [];
        yearItem: Array<any> = [];
        postData: any = { search: 'patrolonemonth', year: new Date().getFullYear(), month: new Date().getMonth() + 1, empid: '', serviceId: 'Donn.RPM.Interface.IHisPatrolService', entityId: 'Donn.RPM.Entity.HisPatrol' };
        constructor() {
            //super(LayoutW);
            super(EAP.UI.AGrid);
            // this.addCSS('./hispatroltemp.css');

            for (var i = 1; i < 13; i++) {
                this.monthItem.push({ text: i, value: i });
            }
            for (var y = new Date().getFullYear(); y > (new Date().getFullYear() - 3); y--) {
                this.yearItem.push({ text: y, value: y });
            }

            $(".formFilter").find("span").click();
            //$(".formFilter").append(" <div id='searchHisDiv' class='wrapdiv' style='width:100%'><div class='wrapdiv' style='width:100%'> <div id='searchYearMonth'></div> <div>Hello</div> </div></div><div class='wrapright'> <div><button>确定 </button></div > </div>");
            $(".formFilter").append(" <div id='searchHisDiv' class='wrapdiv'> </div>");
            this.initFilter();
            $("#searchHisDiv").find("p").next().css("width", "calc(100% - 100px)");
            $("#searchHisDiv").css("margin", "0px");
            $("div[name='filterFormWrapper']").hide();
            $(document).ready(function () {
                $(".gAppOtherTool_div").parent().hide();
            });


        }

        protected configOptions(options: EAP.UI.AGridOptions) {
       
            let that = this;
            let gOptions = new EAP.UI.GridOption();
            gOptions.gridSolutionId = '0ec36f2b-3d4e-4197-ad0d-35f5b3ee12fe';  //栏目Id
            gOptions.dataBound = () => {
                $(".layoutContent .k-grid-content colgroup col:first-child").width(0);
                $(".layoutContent .k-grid-header-wrap colgroup col:first-child").width(0);

            }
            //gOptions.showIndex = false;
            //gOptions.showrowcheckbox = false;
            gOptions.pageable = true;

            options.gridOption = gOptions;
            options.viewScheme = false;
            options.filter = true;
            options.toolbar = true;


            //傳入自定義參數
            options.gridDataRequest = new EAP.UI.GridDataRequest();
            options.gridDataRequest.postdata = { search: function () { return "patrolonemonth"; }, year: function () { return that.postData.year; }, month: function () { return that.postData.month; }, empid: function () { return that.postData.empid; }   };

            $("div[name='formFilter']").find("span").click(function () {
                $(".divLattic").find(".l_divCell:last").hide();
            });

            // options.importorExportor_FullName = "Donn.RPM.Web.HisPatrolExport";

            return options;
        }
        Export_Action(e: EAP.UI.ApplicationEventArgu) {
            new EAM.Export({ exportorFullName: "Donn.RPM.Web.HisPatrolExport", postData: this.postData, url: EAP.UI.ComOptionObj.exportUrl }).export();
        }

        initFilter() {
            let that = this, options = new EAP.UI.FormOption(), now = new Date();
            var ogRequestOption = new EAP.UI.GridDataRequest();
            ogRequestOption.url = { controller: "RPM", action: 'DepartmentAll' };
            var gridOptions = new EAP.UI.GridOption();
            gridOptions.columns = [{ "field": "Name", "title": "部门名称" }];

            var ogRequestOptionEmp = new EAP.UI.GridDataRequest();
            ogRequestOptionEmp.url = { controller: "Graphic", action: 'GetEmpByDeptid' };
            var gridOptionsEmp = new EAP.UI.GridOption();
            gridOptionsEmp.columns = [{ "field": "Name", "title": "人员名称" }];


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
                    name: "deptid", type: "searchbox", style: { width: "150px" }, title: "部门", format: "{Name}", pageable: false, gridOptions: gridOptions, gridDateRequestOptions: ogRequestOption,
                    change: function (e) {
                        let item = e.dataSource;

                        let control = that.filterForm.kendoControls["empid"];
                        let requestOption = new EAP.UI.GridDataRequest(); //请求
                        requestOption.url = { action: "GetEmpByDeptid", controller: "Graphic" };
                        requestOption.postdata = { deptid: item.Id };
                        control.loadGridData(requestOption);


                    }
                },
                {
                    name: "empid", type: "searchbox", style: { width: "120px" },title: "人员", format: "{Name}", pageable: false, gridOptions: gridOptionsEmp, gridDateRequestOptions: ogRequestOptionEmp,
                    change: function (e) {
                        let item = e.dataSource;
                        that.postData.empid = item.Id;
                    }
                }, {
                    controls: [
                        {
                            type: "button", content: '搜索', onClick: function () {
                                let year = that.filterForm.options.sourceData["year"]
                                if (year === undefined) {
                                    alert("请选择年份");
                                    return;
                                }
                                let month = that.filterForm.options.sourceData["month"]
                                if (month === undefined) {
                                    alert("请选择月份");
                                    return;
                                }
                                let empid = that.filterForm.options.sourceData["empid"]
                                if (empid === undefined) {
                                    alert("请选择人员");
                                    return;
                                }

                                that.postData.year = year;
                                that.postData.month = month;
                                that.postData.empid = empid;

                                (that.app as EAP.UI.AGrid).gridControl.remoteRefresh();

                                //new EAP.EAMController().ExecuteServerActionSync(new System.UrlObj("Business", "GetListPage"), that.postData, function (data) {
                                //    var grid = (that.app as EAP.UI.AGrid);
                                //        //.setDataSource(data.rows);
                                //});

                            },
                            style: { marginRight: "80px" }, width: 60
                        }]
                }

            ];

            options.sourceData = that.postData;
            this.filterForm = new EAP.UI.FormControl(options);
        }
    };

    new HisPatrolOneMonth();
}