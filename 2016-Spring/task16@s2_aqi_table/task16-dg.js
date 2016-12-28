/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = new Map();
var cityReg = /^[\u4e00-\u9fffa-zA-Z]+$/;
var $ = function(e) {
    return document.getElementById(e);
};
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var city = $('aqi-city-input').value.trim();
    var value = Number($('aqi-value-input').value.trim());
    if (!cityReg.test(city)) {
        alert('城市名包含非法字符');
        return;
    }
    if (!Number.isInteger(value)) {
        alert('数值应为整数');
        return;
    }
    aqiData.set(city, value);
    // aqiData[city] = value;
    renderAqiList();
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var table = $('aqi-table');
    var text = '';
    aqiData.forEach(function(element, index) {
        text += ('<tr><td>' + index + '</td><td>' + element + '</td><td>操作</td></tr>');
    });
    table.innerHTML = text;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
    // do sth.

    var parent = e.parentElement.parentElement;
    console.log(parent.nodeName);
    parent.removeChild(e.parentElement);
    renderAqiList();
}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    document.getElementById("add-btn").addEventListener("click", addBtnHandle);

    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    var btns = document.querySelectorAll('tr td:last-child');
    document.getElementById("aqi-table").addEventListener("click", function(event) {
        alert(event.target);
        delBtnHandle(event.target);
    })
}
window.onload = init;