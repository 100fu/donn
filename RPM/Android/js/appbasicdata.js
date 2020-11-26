appbasic = {
    //appbasic.loadhisinfo()
    loadhisinfo: function () {
        //人员名称，时间，最后一行显示电子围栏名称。
        //operValues += "<tr role='row' ><td style='text-align:left;width:50px;' role='gridcell' >" + (i + 1) + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.TagCode + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.Name + "</td><td style='text- align:left;width:100px;' role='gridcell'>" + n.DeptName + "</td><td style='text- align:left;width:150px;' role='gridcell'>" + hisAlarmFun.setAlarmType(n.AlarmType) + "</td><td style='text- align:left;width:200px;' role='gridcell'>" + n.StartTime.replace('T', ' ') + "</td><td style='text- align:left;width:200px;' role='gridcell'>" + n.EndTime.replace('T', ' ') + "</a></td><td style='text- align:left;width:200px;' role='gridcell'>" + "已处理" + "</td><td style='text- align:left;width:auto;' role='gridcell'>" + hisAlarmFun.isnullmsg(n.Proresults) +"</td><td style='text- align:left;width:200px;' role='gridcell'>" + n.AreaName + "</td></tr>"
        //
        var data = [
            { Name: '张学三', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '锅炉1-5左' },
            { Name: '张小三', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '锅炉1-7' },
            { Name: '张米三', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '汽车房1层' },
            { Name: '张二三', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '电子间2' },
            { Name: '张一三', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '输煤2' },
            { Name: '张小妹', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '锅炉1-5左' },
            { Name: '张小心', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '锅炉1-7' },
            { Name: '张米来', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '汽车房1层' },
            { Name: '张二蛋', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '电子间2' },
            { Name: '张学三', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '锅炉1-5左' },
            { Name: '张小三', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '锅炉1-7' },
            { Name: '张米三', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '汽车房1层' },
            { Name: '张二三', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '电子间2' },
            { Name: '张一三', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '输煤2' },
            { Name: '张小妹', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '锅炉1-5左' },
            { Name: '张小心', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '锅炉1-7' },
            { Name: '张米来', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '汽车房1层' },
            { Name: '张二蛋', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '电子间2' },
            { Name: '张一丹', StartTime: '2018-11-11 10:15:00', EndTime: '2018-11-11 10:25:00', AreaName: '输煤2' }
        ];

        //<div class='wthree-list-grid d-flex flex-wrap'><div class='wthree-list-icon'><span class='num-list' data-blast='color'>02</span></div><div class='wthree-list-desc'><span>长恨歌</span><h5>张振宇</h5><p> 2018-11-11 10:15:00--2018-11-11 10:25:00 </p></div></div>
        let operValues = "";
        $.each(data, function (i, n) {
            // operValues += "<div class='ui- bar ui- bar - a music_list'><a href='' data-ajax='false'><span>" + n.Name +" " + n.AreaName+" " + n.StartTime + "--" + n.EndTime+" </span></a></div>";
            operValues += "<div class='wthree-list-grid d-flex flex-wrap'><div class='wthree-list-icon'><span class='num-list' data-blast='color'>" + (i + 1) + "</span></div><div class='wthree-list-desc'><span>" + n.AreaName + "</span><h5>" + n.Name + "</h5><p> " + n.StartTime + "--" + n.EndTime + " </p></div></div>";

        });
        let tbody = document.getElementById('hismsg');
        tbody.innerHTML = operValues;
    },


    loadrtempinfo: function ()
    {
        let urlPath = "/ThreeModel/GetEmpInfo";
        //let strJson = { strKey: key, strRegName: regName };
        let operValues = "";
        clientMode.post(urlPath, null,(mes)=> {
            mes.forEach((n,i) => {
                operValues += "<div class='wthree-list-grid d-flex flex-wrap'><div class='wthree-list-icon'><span class='num-list' data-blast='color'>" + (i + 1) + "</span></div><div class='wthree-list-desc'><span>" + n.DeptName + "</span><h5>" + n.EmpName + "</h5><p> " + n.TagNo + "--" + n.DutyName + " </p></div></div>";

            });
            let tbody = document.getElementById('hismsg');
            tbody.innerHTML = operValues;
        });
    },
}