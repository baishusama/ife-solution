/*--------------------
    通用函数
--------------------*/

// 解决 IE 和非 IE 浏览器在事件绑定方面的兼容性
function addEventHandler(elem, event, handler) {
    if (elem.addEventListener) {
        elem.addEventListener(event, handler, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + event, handler);
    } else {
        elem["on" + event] = handler;
    }
}

// 用于偷懒的 $ 方法
function $(selector) {
    var elem = null;
    if (selector.indexOf('#') === 0) {
        elem = document.getElementById(selector.slice(1));
    } else if (selector.indexOf('.') === 0) {
        elem = document.getElementsByClassName(selector.slice(1));
    }
    return elem;
}

/*--------------------
    数据
--------------------*/

var SCHOOLS = {
    "beijing": {
        "bju": "北京大学",
        "thu": "清华大学",
        "rmu": "中国人民大学",
        "bjnu": "北京师范大学",
        "bjhu": "北京航空航天大学",
        "bjitu": "北京理工大学"
    },
    "shanghai": {
        "shjtu": "上海交通大学",
        "tju": "同济大学",
        "fdu": "复旦大学",
        "shu": "上海大学"
    },
    "hangzhou": {
        "zju": "浙江大学",
        "zjitu": "浙江理工大学"
    }
};

/*--------------------
    DOM
--------------------*/
var citySlt = $("#city");
var schoolSlt = $("#school");

/*--------------------
    函数
--------------------*/

// 更新 select#school 的函数
function generateSchool() {
    var schoolsInCity = SCHOOLS[citySlt.options[citySlt.selectedIndex].value];
    var html = "";
    for (var schl in schoolsInCity) {
        html += "<option value='" + schl + "'>" + schoolsInCity[schl] + "</option>";
    }
    schoolSlt.innerHTML = html;
}

/*--------------------
    事件
--------------------*/

// 当 select#city 变动的时候，更新 select#school
addEventHandler(citySlt, "change", generateSchool);

window.onload = function() {
    // 初始化 select
    generateSchool();
};
