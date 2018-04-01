
//http://43nndgw.ttx158.com/cp6-1-mb/js/jscom.js
//历史统计
var hisEn = {};
hisEn.record = [];
hisEn.starttime = "";
//累计胜负金额
hisEn.tonowsum = 0
//连续失败轮数
hisEn.betArr = [1,2,3,4,5,6,7]
// hisEn.betArr = [1,2,5,6,7,8,9]
hisEn.lossRounds = 0
hisEn.tripleSame = {n:0,t:0}
//                  期数        投注时间     投注明细                 单注金额      是否开奖      开奖明细        开奖胜负金额
var tmpRecord = { roundno: "", bettime: "", betArr: "",wagers: "", singleBet: "", isdraw: "", factwagers: "", resultsum: "" };

//投注器
var betHandler = {};
betHandler.account = "yavv556";
betHandler.stype = "checkxiadan";
//bjsc
betHandler.gameno = 11;
//jssc
// betHandler.gameno = 22;
betHandler.wagerroundno = 'A';
//设置投注计划
// betHandler.ref = { "1": 2, "2": 8, "3": 28, "4": 96, "5": 322, "6": 1076, "7": 3588, "8": 11962, "9": 39876, "10": 132922 }
betHandler.ref = { "1": 2, "2": 4, "3": 8, "4": 16, "5": 32, "6": 64, "7": 128, "8": 256, "9": 512, "10": 1024}
betHandler.roundno = '';
betHandler.betArr = []
betHandler.wagers = '';
betHandler.singleBet = 0
betHandler.nowbalance = 0
betHandler.formToken = ""

betHandler.bet_order = function () {
    if(betHandler.roundno==''||betHandler.wagers ==''){
        return;
    }
    if(betHandler.nowbalance<betHandler.singleBet*betHandler.betArr.length){
        console.log("余额不足，无法下单")
        return;
    }
    try {
        $.ajax({
            type: "post",
            async: false,
            url: "../ashx/orderHandler.ashx",
            dataType: "text",
            data: { stype: betHandler.stype, gameno: betHandler.gameno, roundno: betHandler.roundno, wagerroundno: betHandler.wagerroundno, wagers: betHandler.wagers },
            success: function (data) {
                //transtring "601,,1,,9.939,2;601,,2,,9.939,2;601,,3,,9.939,2;601,,4,,9.939,2;601,,5,,9.939,2;601,,6,,9.939,2;601,,7,,9.939,2;"
                var transtring = ''
                for(var k in betHandler.betArr){
                    transtring += "601,,"+betHandler.betArr[k]+",,9.939,"+betHandler.singleBet+";"
                }

                var arrstring = ''
                for(var k in betHandler.betArr){
                    arrstring += "601:"+betHandler.betArr[k]+":"+betHandler.singleBet+";"
                }
                $.ajax({
                    type: "post",
                    async: true,
                    url: "../ch/left.aspx/GetMemberMtran",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data:JSON.stringify({wagerround:betHandler.wagerroundno,transtring:transtring,arrstring:arrstring,wagetype:0,allowcreditquota:betHandler.nowbalance,hasToken:true,playgametype:0}),
                    success: function (data) {
                        data = data.d;
                        if (data != null && data != "") {
                            var arr = String(data).split('$@');
                            // show_allowcreditquota = arr[4];
                            betHandler.formToken = arr[6];

                            //"601:1:9.939;601:2:9.939;601:3:9.939;601:4:9.939;601:5:9.939;601:6:9.939;601:7:9.939;"
                            var valstring = ''
                            for(var k in betHandler.betArr){
                                valstring += "601:"+betHandler.betArr[k]+":9.939;"
                            }
                            var arrstring = ''
                            for(var k in betHandler.betArr){
                                arrstring += "601:"+betHandler.betArr[k]+":"+betHandler.singleBet+";"
                            }
                            $.ajax({
                                type: "post",
                                async: true,
                                url: "../ch/left.aspx/ToCheckIn",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                data: JSON.stringify({memberno:betHandler.account,submemberno:"",gameno:betHandler.gameno,wagerroundno:betHandler.wagerroundno,valstring:valstring}),
                                success: function (data) {
                                    $.ajax({
                                        type: "post",
                                        async: true,
                                        url: "../ch/left.aspx/mtran_XiaDan_New",
                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",
                                        data:JSON.stringify({gameno:betHandler.gameno,wagerroundstring:betHandler.wagerroundno,arrstring:arrstring,roundno:betHandler.roundno,lianma_transtrin:"",token:betHandler.formToken}),
                                        success: function (data) {
                                            //下单成功
                                            console.log("==============="+betHandler.roundno+"投注明细:"+betHandler.wagers+"==============")
                                        },
                                        error: function(err){
                                            console.log("mtran_XiaDan_New:请求失败")
                                        }
                                    });
                                },
                                error: function(err){
                                    console.log("ToCheckIn:请求失败")
                                }
                            });
                        }
                    },
                    error: function(err){
                        console.log("GetMemberMtran:请求失败")
                    }
                });
            },
            error: function(err){
                console.log("orderHandler.ashx:请求失败")
            }
        });
    } catch (err) { 
        console.log("catch异常")
    }
}

// http://43nndgw.ttx158.com/cp6-1-mb/app/ws_game.asmx/LoadDrawsInfo
function bet_loadDrawsInfo(gameno, success, err) {
    //gno==11 表示bjsc 
    $.ajax({
        type: "POST",
        async: true,
        url: "../app/ws_game.asmx/LoadDrawsInfo",
        data: "{gameno:" + gameno + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: success,
        error: err
    });
    //返回数据 {"d":"{\"code\":1,\"message\":{\"sd\":\"672941\",\"soTs\":-1,\"seTs\":-1,\"swTs\":-1,\"cd\":\"672942\",\"coTs\":-81,\"ceTs\":189,\"cwTs\":220,\"nd\":\"672943\",\"noTs\":30,\"neTs\":270,\"nwTs\":31,\"jgTs\":1,\"kjTs\":300,\"ld\":\"672941\",\"lr\":[\"01\",\"08\",\"05\",\"04\",\"03\",\"02\",\"10\",\"06\",\"07\",\"09\"]}}"}
    //返回数据 {"d":"{\"code\":1,\"message\":{\"sd\":\"672947\",\"soTs\":-1,\"seTs\":-1,\"swTs\":-1,\"cd\":\"672948\",\"coTs\":-13,\"ceTs\":257,\"cwTs\":288,\"nd\":\"672949\",\"noTs\":30,\"neTs\":270,\"nwTs\":31,\"jgTs\":1,\"kjTs\":300,\"ld\":\"672946\",\"lr\":[\"05\",\"06\",\"02\",\"03\",\"01\",\"04\",\"08\",\"07\",\"10\",\"09\"]}}"}
    //     "cd":"672953",
    // 　　　　"coTs":-270, 距开盘 负数表示已开盘
    // 　　　　"ceTs":0,    距封盘 整数表示还未封盘(coTs<0&&ceTs>0)
    // 　　　　"cwTs":31,   距开奖  

    //54/55(54已开奖,55距封盘3分半)   
    //{"code":1,"message":{"sd":"672954","soTs":-1,"seTs":-1,"swTs":-1,"cd":"672955","coTs":-38,"ceTs":232,"cwTs":263,"nd":"672956","noTs":30,"neTs":270,"nwTs":31,"jgTs":1,"kjTs":300,"ld":"672954","lr":["03","08","07","02","09","04","05","01","06","10"]}}
    //54/55((54已开奖,55距封盘30s)  
    //{"code":1,"message":{"sd":"672954","soTs":-1,"seTs":-1,"swTs":-1,"cd":"672955","coTs":-112,"ceTs":158,"cwTs":189,"nd":"672956","noTs":30,"neTs":270,"nwTs":31,"jgTs":1,"kjTs":300,"ld":"672954","lr":["03","08","07","02","09","04","05","01","06","10"]}} 
    //54/55(55已封盘)  
    //{"code":1,"message":{"sd":"672955","soTs":-1,"seTs":-1,"swTs":-1,"cd":"672955","coTs":-270,"ceTs":0,"cwTs":31,"nd":"672956","noTs":30,"neTs":270,"nwTs":31,"jgTs":1,"kjTs":300,"ld":"672954","lr":["03","08","07","02","09","04","05","01","06","10"]}}
    //54/55/56(55等待开奖)  
    ///{"d":"{\"code\":1,\"message\":{\"sd\":\"672954\",\"soTs\":-1,\"seTs\":-1,\"swTs\":-1,\"cd\":\"672956\",\"coTs\":-1,\"ceTs\":269,\"cwTs\":300,\"nd\":\"672957\",\"noTs\":30,\"neTs\":270,\"nwTs\":31,\"jgTs\":1,\"kjTs\":300,\"ld\":\"672954\",\"lr\":[\"03\",\"08\",\"07\",\"02\",\"09\",\"04\",\"05\",\"01\",\"06\",\"10\"]}}"}
    //55/56(55已开奖,56距封盘3分半) 
    //{"d":"{\"code\":1,\"message\":{\"sd\":\"672955\",\"soTs\":-1,\"seTs\":-1,\"swTs\":-1,\"cd\":\"672956\",\"coTs\":-3,\"ceTs\":267,\"cwTs\":298,\"nd\":\"672957\",\"noTs\":30,\"neTs\":270,\"nwTs\":31,\"jgTs\":1,\"kjTs\":300,\"ld\":\"672954\",\"lr\":[\"03\",\"08\",\"07\",\"02\",\"09\",\"04\",\"05\",\"01\",\"06\",\"10\"]}}"}
}

function nowScaleSeconds() {
    var today = new Date()
    var month = today.getMonth() + 1
    if (month > 0 && month < 10) {
        month = "0" + month
    }
    var day = today.getDate()
    if (day > 0 && day < 10) {
        day = "0" + day
    }
    var hour = today.getHours()
    if (hour > -1 && hour < 10) {
        hour = "0" + hour
    }
    var minute = today.getMinutes()
    if (minute > -1 && minute < 10) {
        minute = "0" + minute
    }
    var second = today.getSeconds()
    if (second > -1 && second < 10) {
        second = "0" + second
    }
    var ms = today.getMilliseconds()
    if (ms > -1 && ms < 10) {
        ms = "00" + ms
    } else if (ms > 9 && ms < 100) {
        ms = "0" + ms
    }
    return "" + today.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
}


var interval = self.setInterval("clock()", 60 * 1000)
// interval = window.clearInterval(interval)
function clock(){
    setTimeout(() => {
        work()
        bet_data_table()
    }, Math.floor(Math.random()*10000));
}
function bet_data_table(){
    var title_arr = ['期数','投注时间','投注明细','单注金额','是否开奖','开奖明细','开奖胜负金额']
    var bet_table='<table style=\"position:fixed;z-index:10000;background-color:white;font-size:10px;left:20px;bottom:10px;width:800px;height:300px;overflow-y:scroll;overflow-x:scroll;text-align: center;border-top:solid 1px #333333;border-left:solid 1px #333333;border-right:0;border-bottom:0;\" border=\"1\" cellspacing=\"0\" cellpadding=\"0\" class=\"info_table\"><tbody><tr>'
    for(var k in title_arr){
        bet_table += '<th nowrap=\"nowrap\"><span>'+title_arr[k]+'</span></th>'
    }
    bet_table += '</tr>'
    for(var k in hisEn.record){
        bet_table += '<tr><td ><span>'+hisEn.record[k].roundno+'</span></td>'
        bet_table += '<td ><span>'+hisEn.record[k].bettime+'</span></td>'
        bet_table += '<td ><span>'+hisEn.record[k].betArr+'</span></td>'
        bet_table += '<td ><span>'+hisEn.record[k].singleBet+'</span></td>'
        if(hisEn.record[k].isdraw){
            bet_table += '<td ><span>'+'已开'+'</span></td>'
        }else{
            bet_table += '<td ><span>'+'未开'+'</span></td>'
        }
        bet_table += '<td ><span>'+hisEn.record[k].factwagers+'</span></td>'
        bet_table += '<td ><span>'+hisEn.record[k].resultsum+'</span></td></tr>'
    }
    bet_table += '</tbody></table>'

    var bet_div=document.getElementById("bet_data_table")
    if(!bet_div){
        bet_div = document.createElement('div');
        bet_div.setAttribute("id","bet_data_table");
        bet_div.style.overflowY="scroll"
        bet_div.style.overflowX="scroll"
        bet_div.innerHTML = 'test';
        document.documentElement.appendChild(bet_div);
    }
    bet_div.innerHTML= bet_table
}
function work() {
    if (hisEn.starttime = "") {
        hisEn.starttime = nowScaleSeconds();
    }
    bet_loadDrawsInfo(betHandler.gameno, function (data) {
        //查看当前轮数信息及开奖信息
        var info = parseJSON(data.d);
        console.log("=============="+info.message.cd+"每分钟1次，尝试本轮下单，本轮已下单后，不重复下单=================")
        console.log("hisEn.record:"+JSON.stringify(hisEn.record))
        //开奖计算
        if(info.message.lr&&info.message.lr.length>0){
            if(hisEn.record.length>0){
                for(var k=0;k<hisEn.record.length;k++){
                    //更新开奖信息
                    if(hisEn.record[k].roundno == info.message.ld&&hisEn.record[k].isdraw==false){
                        var tmpSum = 0
                        var WorL = false
                        for(var i in betHandler.betArr){
                            if(betHandler.betArr[i]==parseInt(info.message.lr[0],10)){
                                WorL = true
                                break
                            }
                        }

                        if(WorL){
                            var tmpSingleBet = parseInt(hisEn.record[k].singleBet, 10)
                            tmpSum = tmpSingleBet*(10 - betHandler.betArr.length)
                            hisEn.lossRounds = 0
                        }else{
                            var tmpSingleBet = parseInt(hisEn.record[k].singleBet, 10)
                            tmpSum = 0-tmpSingleBet*betHandler.betArr.length
                            hisEn.lossRounds++
                        }
                        hisEn.record[k].isdraw=true
                        hisEn.record[k].factwagers=info.message.lr
                        hisEn.record[k].resultsum=tmpSum

                        hisEn.tonowsum = hisEn.tonowsum+tmpSum

                        if(hisEn.tripleSame.n!=0){
                            if(hisEn.tripleSame.n==parseInt(info.message.lr[0],10)){
                                hisEn.tripleSame.t++
                            }else{
                                hisEn.tripleSame.n=parseInt(info.message.lr[0],10)
                                hisEn.tripleSame.t=1
                            }
                        }else{
                            hisEn.tripleSame.n=parseInt(info.message.lr[0],10)
                            hisEn.tripleSame.t=1
                        }
                        console.log("==============="+info.message.ld+"开奖明细:"+info.message.lr+" 胜负:"+tmpSum)
                        break;
                    }
                }
            }
        }


        if (info.code == 1) {
            if (info.message.coTs < 0 && info.message.ceTs > 0) {
                var flag=true;
                //查看当前轮是否已投注
                if(hisEn.record.length>0){
                    for(var k=hisEn.record.length-1;k>=0;k--){
                        if(hisEn.record[k].roundno == info.message.cd){
                            console.log("==============="+info.message.cd+"已投注")
                            flag=false;
                            break;
                        }
                    }
                }
                //可投注时，查看上一轮是否已开奖
                if(flag){
                    if(hisEn.record.length>0){
                        for(var k=hisEn.record.length-1;k>=0;k--){
                            if(parseInt(hisEn.record[k].roundno, 10) == (parseInt(info.message.cd, 10) - 1)){
                                if(hisEn.record.length>1 && !hisEn.record[k-1].isdraw){
                                    console.log("==============="+info.message.cd+"上一轮未开奖")
                                    flag=false;
                                }
                                break;
                            }
                        }
                    }
                }
                if(flag){
                    //查询余额
                    $.ajax({
                        type: "post",
                        async: true,
                        url: "../ch/main.aspx/GetMembersMbinfo",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        data:"",
                        success: function (data) {
                            //重置投注对象数据
                            betHandler.roundno = '';
                            betHandler.betArr = [];
                            betHandler.wagers = '';
                            betHandler.singleBet = 0
                            betHandler.nowbalance = 0
                            betHandler.formToken = ""

                            var arr = parseJSON(data.d);
                            var list = arr[0];
                            if (list != null && list.Rows.length > 0) {
                                var drow = list.Rows[0];
                                betHandler.nowbalance = Math.round(drow.allowcreditquota);
                                console.log("下单前余额:"+betHandler.nowbalance)
                            }
                            
                            //本轮投注操作
                            betHandler.roundno = info.message.cd;
                            betHandler.singleBet = betHandler.ref["" + (hisEn.lossRounds + 1)]
                            betHandler.betArr = JSON.parse(JSON.stringify(hisEn.betArr))
                            if(hisEn.lossRounds>=2&&hisEn.tripleSame.t>=2){
                                var nSmall = 0
                                var nEqual = 0
                                var nBig = 0
                                for(var n in betHandler.betArr){
                                    if(betHandler.betArr[n]<hisEn.tripleSame.n){
                                        nSmall++
                                    }else if(betHandler.betArr[n]==hisEn.tripleSame.n){
                                        nEqual++
                                    }else if(betHandler.betArr[n]>hisEn.tripleSame.n){
                                        nBig++
                                    }
                                }
                                if(nEqual==0){
                                    if(nSmall==betHandler.betArr.length){
                                        betHandler.betArr.push(hisEn.tripleSame.n)
                                    }else if(nBig==betHandler.betArr.length){
                                        betHandler.betArr.splice(0, 0, hisEn.tripleSame.n);
                                    }else{
                                        betHandler.betArr.splice(nSmall, 0, hisEn.tripleSame.n);
                                    }
                                }
                            }
                            for(var k in betHandler.betArr){
                                betHandler.wagers += "601:"+betHandler.betArr[k]+":"+betHandler.singleBet+";"
                            }
                            //betHandler.wagers 601:1:2;601:2:2;601:3:2;601:4:2;601:5:2;601:6:2;601:7:2
                            var tmpRecord = {
                                roundno: betHandler.roundno, 
                                bettime: nowScaleSeconds(), 
                                betArr: betHandler.betArr,
                                wagers: betHandler.wagers, 
                                singleBet: betHandler.singleBet, 
                                isdraw: false, 
                                factwagers: "", 
                                resultsum: 0 
                            };
                            hisEn.record.push(tmpRecord)
                            betHandler.bet_order()
                        },
                        error: function(err){
                            console.log("----------GetMembersMbinfo错误:"+JSON.stringify(err)+"-----------")
                        }
                    });
                }
            }
        }
        
    }, function (err) {
        console.log("----------bet_loadDrawsInfo错误:"+JSON.stringify(err)+"-----------")
    })
}
// interval=window.clearInterval(interval)
