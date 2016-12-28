/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
// var temp = "";

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    // 前后去空格: trim() & 空字符处理 ???
    var city = document.getElementById("aqi-city-input").value.trim();
    var value = document.getElementById("aqi-value-input").value.trim();
    // 用户输入的验证：城市名必须为中英文字符，空气质量指数必须为整数
    var regChar = /^[a-zA-Z\u4e00-\u9fa5]+$/;
    var regInt = /^[0-9]+$/;
    if(regChar.test(city) && regInt.test(value)){
        aqiData[city] = value;
        // temp = city;
    }
    else {
        alert("请输入正确的内容～");
    }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var otable = document.getElementById("aqi-table");
    otable.innerHTML = "";
    
    city = "城市";
    value = "空气质量";

    var otr = document.createElement("tr");
    
    var otd1 = document.createElement("td");
    otd1.innerHTML = city;
    
    var otd2 = document.createElement("td");
    otd2.innerHTML = value;
    
    var otd3 = document.createElement("td");
    var btn = null;
    otd3.innerHTML = "操作";

    otr.appendChild(otd1);
    otr.appendChild(otd2);
    otr.appendChild(otd3);

    otable.appendChild(otr);

    for(var key in aqiData){
        city = key;
        value = aqiData[key];

        otr = document.createElement("tr");
        
        otd1 = document.createElement("td");
        otd1.innerHTML = city;
        
        otd2 = document.createElement("td");
        otd2.innerHTML = value;
        
        otd3 = document.createElement("td");
        btn = document.createElement("button");
        btn.innerHTML = "删除";
        otd3.appendChild(btn);

        otr.appendChild(otd1);
        otr.appendChild(otd2);
        otr.appendChild(otd3);

        otable.appendChild(otr);
    }
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
function delBtnHandle() {
  // do sth.
  var city = this.parentNode.previousSibling.previousSibling.innerHTML;
  delete(aqiData[city]);
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  document.getElementById("add-btn").addEventListener('click', addBtnHandle);

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  document.getElementById("aqi-table").addEventListener('click', function(e){
    if(e.target 
        && e.target.nodeName === "BUTTON"
        && e.target.innerHTML === "删除"){
        console.log("do delete things");
        delBtnHandle.apply(e.target);
    }
  });
}

window.onload = function(){
    init();
};