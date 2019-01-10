/**
 * Created by keyang on 2017/5/23.
 */
// 手机号正则验证
function checkTel(num) {
    var IsTel = false;
    if (num && (/^1(3|4|5|7|8)\d{9}/.test(num))) {
        IsTel = true;
    }
    return IsTel;
}

// 生成随机数,i-I，o-O 不好分辨去掉，字母+数字一共58个
function createCode() {
    // var selectChar = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    var selectChar = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 0);
    var code = '';
    for (var i = 0; i < 4; i++) {
        // floor() 方法可对一个数进行下舍入，random()可返回介于0 ~ 1 之间的一个随机数
        var charIndex = Math.floor(Math.random() * 10);
        code += selectChar[charIndex];
    }
    return code;
}

//获取系统时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
    return currentdate;
}
//设置cookies
function setCookie(name,value) {
    var Days = 7;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
//读取cookies
function getCookie(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
//删除cookies
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
$("#nav_ li a").click(function () {
    var self = $(this);
    $("#nav_ li a").removeClass("selected");
    self.addClass("selected");
});

function addOverlay() {
    var myOverlay = document.createElement('div');
    myOverlay.id = 'overlay';
    document.body.appendChild(myOverlay);
    myOverlay.style.position = 'absolute';
    myOverlay.style.opacity = 0.8;
    myOverlay.style.width = window.innerWidth + 'px';
    myOverlay.style.height = window.innerHeight + 'px';
    myOverlay.style.top = window.pageYOffset + 'px';
    myOverlay.style.left = window.pageXOffset + 'px';
    myOverlay.style.zIndex = 1200;
    myOverlay.style.backgroundColor = '#000';
}
//
// function addbgimg(value) {
//     document.body.style.overflow = "hidden";
//     var bgimg = document.createElement('img');
//     bgimg.id = "bgImg";
//     document.body.appendChild(bgimg);
//     bgimg.style.width = window.innerWidth - 20;
//     bgimg.style.zIndex = 1250;
//     document.getElementById("bgImg").setAttribute("src",value);
//     document.getElementById("bgImg").style.top = (window.pageYOffset + window.innerHeight/2 - document.getElementById('bgImg').clientHeight/2) + "px";
//     $("#bgImg").click(function () {
//         var self = $(this);
//         self.remove();
//         $("#overlay").remove();
//         document.body.style.overflow = "auto";
//     })
// }

function sortData(data) {
    var newData = data.sort(function (a,b) {
        var reg = /-|:|T|\+/; //The regex on which matches the string should be split (any used delimiter) -> could also be written like /[.:T\+]/
        a = a.shangkesj;
        b = b.shangkesj;
        var parsed = [ //an array which holds the date parts for a and b
            (a + '').split(reg), //Split the datestring by the regex to get an array like [Year,Month,Day,Hour,...]
            (b + '').split(reg)
        ];
        console.log(parsed);
        var dates = [ //Create an array of dates for a and b
            (parsed[0][0] + parsed[0][1] + parsed[0][2] + parsed[0][3] + parsed[0][4]),//Constructs an date of the above parsed parts (Year,Month...
            (parsed[1][0] + parsed[1][1] + parsed[1][2] + parsed[1][3] + parsed[1][4])
        ];
        dates[0] = dates[0].replace(/\s/g, '');
        dates[1] = dates[1].replace(/\s/g, '');
        console.log(dates[0],dates[1]);
        return dates[0] - dates[1]; //Returns the difference between the date (if b > a then a - b < 0)
    });
    return newData;
}

//设置body最小高度
$('body').css({
   "min-height": window.innerHeight
});

function safariTimeConvert(data) {
    var result = new Date(data.replace(/-/g, '/'));
    return result;
}

function appendCardItem(value1,value2,value3,value4) {
    return '<tr data-cardId="' + value4 + '" style="text-align: center;"><td class="card_type">' + value1 + '</td><td class="card_name" colspan="2">' + value2 + '</td><td class="card_status">' + value3 + '</td><td class="card_choose"><input style="display: inline; width:auto; height:auto;margin-bottom: 10px;" type="radio" name="card_choose"></td></tr>';
}

function classPreserve(self,className,memberId,address,name,teacher,shangkesj,xiakesj,cardId) {
    var filter = {
        "Conditions": [
            {
                "AttributeName": "shangkeapid",
                "Operator": 0,
                "Values": [className]
            }
        ]
    };
    var queryObj = {
        EntityName: 'shangkeap',
        Criteria: filter,
        ColumnSet: {
            //						allcolumns: true
            Columns: ['yuyuers','jihuars','kechenglx']
        }
    };
    var data = JSON.stringify({
        "query": queryObj,
        "isAll": true
    });
    purecms.getjson('/admin/dataservice/RetrieveMultiple', data, function (response) {
        if (response.content.length > 0) {
            var already = response.content[0].yuyuers;
            var type = response.content[0].kechenglx;
            if (already == null) {
                already = 0;
            }
        }
        if (already >= response.content[0].jihuars) {
            sweetAlert("很遗憾...", "预约人数已满!", "error");
            return;
        }
        console.log(memberId,className,name,address,teacher,shangkesj,xiakesj,type,cardId);
        var datas = {
            customer: memberId,
            shangkeap: className,
            name: name,
            yuyuezt: 1,
            yuyuemd: address,
            teacher: teacher,
            shangkesj: shangkesj,
            xiakesj: xiakesj,
            kechenglx: type,
            shiyongkx: cardId
        };
        purecms.post('/admin/dataservice/createrecord', {
            entityname: 'yuyuesk',
            data: JSON.stringify(datas)
        }, false, function (response) {
            if (response.StatusName == 'success') {
                var filter = {
                    "Conditions": [
                        {
                            "AttributeName": "shangkeapid",
                            "Operator": 0,
                            "Values": [className]
                        }
                    ]
                };
                var queryObj = {
                    EntityName: 'shangkeap',
                    Criteria: filter,
                    ColumnSet: {
                        //						allcolumns: true
                        Columns: ['yuyuers','jihuars']
                    }
                };
                var data = JSON.stringify({
                    "query": queryObj,
                    "isAll": true
                });
                purecms.getjson('/admin/dataservice/RetrieveMultiple', data, function (response) {
                    if (response) {
                        var backcontent = response.content;
                        self.parents(".btn_con").siblings(".preserve").children(".already").text(backcontent[0].yuyuers);
                        var parent = self.parents(".btn_con").siblings(".preserve");
                        var yuyue = self.parents(".btn_con").siblings(".preserve").children(".already").text();
                        var jihua = self.parents(".btn_con").siblings(".preserve").children(".total").text();
                        if (parseInt(yuyue) >= parseInt(jihua)) {
                            parent.css("color","red");
                        }
                        self.text("已预约");
                        self.prop("disabled", true);
                    } else {
                        sweetAlert("Oh no...", "预约失败，请重试!", "error");
                        self.prop("disabled", false);
                    }
                },null,null,"post");
            } else {
                sweetAlert("Oh no...", "预约失败，请重试!", "error");
                self.prop("disabled", false);
            }
        })
    },null,null,"post");
}