/**
 * Created by keyang on 2018/1/8.
 */

//数据赋值
function appendData(data,modal,sign) {
    if (Array.isArray(data)) {
        data.forEach(function(e,i) {
            insertData(e,sign,modal,'modal_' + sign);
        })
    } else {
        insertData(data,sign,modal);
    }
    if (document.querySelector("." + sign + " " + ".ajaxLoader")) {
        document.querySelector("." + sign + " " + ".ajaxLoader").remove();
    }
}

//插入数据
function insertData(data,sign,modal,target) {
    var selector,bool;
    bool = modal;
    if (bool) {
        var example = document.querySelector("." + target).cloneNode(true);
        for (var item in data) {
            selector = example.querySelector("[data-name = '" + item + "']");
            appendToSel(selector,data[item],data);
        }
        if (typeof(sign) === "object") {
            sign.appendChild(example);
        } else {
            example.classList.remove(target);
            example.removeAttribute("hidden");
            document.querySelector("." + sign).appendChild(example);
        }
    } else {
        for (var item in data) {
            selector = document.querySelector("." + sign + " " + "[data-name = '" + item + "']");
            appendToSel(selector, data[item],data);
        }
    }
}

//根据元素种类赋值
function appendToSel(selector,data,dataAll) {
    if (selector) {
        if (selector.getAttribute("data-format")) {
            formatIt(selector,data,selector.getAttribute("data-format"),dataAll);
        } else {
            if (selector.tagName.trim() === 'INPUT') {
                selector.value = data.toString().trim();
            } else {
                var text = document.createTextNode(data.toString().trim());
                selector.appendChild(text);
            }
        }
    }
}

//格式选择
function formatIt(selector,data,sign,dataAll) {
    switch (sign) {
        case "money":
            if (selector.tagName.trim() === 'INPUT') {
                selector.value = (Number(data.toString().trim())/10000).toFixed(2);
            } else {
                var text = document.createTextNode((Number(data.toString().trim())/10000).toFixed(2));
                selector.appendChild(text);
            }
            break;
        case "image":
            selector.setAttribute("src",data);
            break;
        case "appendChildAndSetAttr":
            var text = document.createTextNode(data.toString().trim());
            var example_;
            selector.appendChild(text);
            selector.parentNode.setAttribute("href","#_" + dataAll.CateId);
            example_ = document.querySelector(".modal_secondLevel").cloneNode(true);
            example_.setAttribute("id","_" + dataAll.CateId);
            example_.classList.remove("modal_secondLevel");
            dataAll.Child.forEach(function(e,i) {
                insertData(e,example_,true,"modal_secondLevelItem");
            });
            document.querySelector(".secondLevel").appendChild(example_);
            break;
        case "dataBindToUrl":
            var text = document.createTextNode(data.toString().trim());
            var url = selector.getAttribute("data-url");
            var urlId = selector.getAttribute("data-urlId");
            selector.appendChild(text);
            selector.setAttribute("data-openWindow",'{"url":"' + url + '?id=' + dataAll.CateId + '","id":"' + urlId + '"}');
            break;
        case "dataBindToUrlParent":
            var text = document.createTextNode(data.toString().trim());
            var parent = getParent(selector);
            var url = parent.getAttribute("data-url");
            var urlId = parent.getAttribute("data-urlId");
            selector.appendChild(text);
            parent.setAttribute("data-openWindow",'{"url":"' + url + '?id=' + dataAll.Id + '","id":"' + urlId + '"}');
            break;
        case "time":
            var text = document.createTextNode(data.toString().trim().replace("T"," ").slice(0,16));
            selector.appendChild(text);
            break;
        case "newBindToUrlParent":
            var text = document.createTextNode(data.toString().trim());
            var parent = getParent(selector);
            var url = parent.getAttribute("data-url");
            var urlId = parent.getAttribute("data-urlId");
            selector.appendChild(text);
            parent.setAttribute("data-openWindow",'{"url":"' + url + '?id=' + dataAll.NewsId + '","id":"' + urlId + '"}');
            break;
        case "dataBindToParentUrl":
            var text = document.createTextNode(data.toString().trim());
            var parent = getParent(selector);
            var url = parent.getAttribute("data-url");
            var urlId = parent.getAttribute("data-urlId");
            selector.appendChild(text);
            parent.setAttribute("data-openWindow",'{"url":"' + url + '?id=' + dataAll.Id + '&storeId=' + dataAll.StoreId +  '","id":"' + urlId + '"}');
            break;
    }
}

//getParent
function getParent(item) {
    var parent = item.parentNode;
    for (var i = 0;i < 10;i++) {
        if (parent.getAttribute("data-url")) {
             return parent;
        } else {
            parent = parent.parentNode;
        }
    }
}

//hasClass
function hasClass(selector,className) {
    var bool = false;
    for (var i = 0;i < selector.classList.length;i++) {
        if (selector.classList[i].toString() === className) {
            bool = true;
            break;
        }
    }
    return bool;
}

//获取URL参数
function getUrlData(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null) return unescape(r[2]);
    return null;
}

//mui.ajax

//上拉刷新，下拉加载

//判断UserAgent
function textUserAgent() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return 'ios';
    } else if (/(Android)/i.test(navigator.userAgent)) {
        return 'adr';
    } else {
        return 'pc';
    }
}

//title转化
function titileConvert(type) {
    switch (type) {
        case 'up':
            return '好评';
            break;
        case 'middle':
            return '中评';
            break;
        case 'down':
            return '差评';
            break;
    }
}

function sorts(Arr,Id) {
    Arr.sort(function(a,b) {
        if (a.Id && b.Id) {
            return a[Id] - b[Id];
        }
    });
    return Arr;
}

var ajax = {
    getJSON: function(url,data,callback) {
        // 1.创建
        var ajax = new XMLHttpRequest();
        var token = Token.get('CouponMall@JY');
        var AllData,PageInfo,Success;
        var postData = "";
        for (var i in data) {
            postData += (i + "=" + data[i] + "&");
        }
        postData = postData.slice(0,postData.length - 1);
        // 2设置

        ajax.open('get', 'http://192.168.5.119:9000/api' + url + token + "?" + postData);

        // 3.发送
        ajax.send();

        // 4.状态事件
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200) {
                AllData = JSON.parse(ajax.response).Data;
                console.log(AllData);
                PageInfo = JSON.parse(ajax.response).PageInfo;
                Success = JSON.parse(ajax.response).Success;
                if (Success) {
                    callback(AllData,PageInfo);
                } else {
                    alert("请求失败！");
                }
            }
        }
    }
};