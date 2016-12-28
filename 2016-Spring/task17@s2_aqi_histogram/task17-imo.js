/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,// ??? 为啥设置成数字OAO
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
  var DAYCWIDTH = "10px";
  var WEEKCWIDTH = "50px";
  var MONTHCWIDTH = "300px";
  var SPACEBETWEEN = 2;//"px"
  var HEIGHTBASE = 2;

  var chart = document.getElementsByClassName("aqi-chart-wrap")[0];
  chart.innerHTML = "";
  var div = null;
  var count = 0;
  var maxHeight = 0;
  if(pageState.nowGraTime === "day"){
    console.log("render a day-based chart");
    for(var key in chartData){      
      var date = key;
      var airq = chartData[key];
      var height = (airq * HEIGHTBASE) + 'px';
      var style = "width:" + DAYCWIDTH 
        + ";height:" + height 
        + ";left:" + (parseInt(DAYCWIDTH) + SPACEBETWEEN) * count + "px;";

      div = document.createElement("div");
      div.setAttribute("style", style);
      div.setAttribute("title", date + ':' + airq);
      chart.appendChild(div);

      count++;
      maxHeight = maxHeight > airq * HEIGHTBASE ? maxHeight : airq * HEIGHTBASE;
    }
    chart.setAttribute("style", "width:"+ parseInt(DAYCWIDTH)*count + "px;height:" + maxHeight + "px;");
  }
  else if(pageState.nowGraTime === "week"){
    console.log("render a week-based chart");

  }
  else if(pageState.nowGraTime === "month"){
    console.log("render a month-based chart");
    

  }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  var thisLabel = null;
  var thisInput = null;
  if(this.nodeName === 'LABEL'){
    thisLabel = this;
    thisInput = this.childNodes[1];
  }
  else if(this.nodeName === 'INPUT'){
    thisLabel = this.parentNode;
    thisInput = this;
  }
  
  // 确定是否选项发生了变化 
  var change = (thisInput.getAttribute("checked") !== "checked");
  // = (thisInput.value !== pageState.nowGraTime);
  
  if(change){
    var oinputs = document.getElementById("form-gra-time").getElementsByTagName("input");//.forEach(function(elem, index){})
    // // 虽然是个对象、且长度为 3 ，但是有六个 key 。。。
    // for(var key in oinputs){
    //   console.log("key: "+key);
    //   oinputs[key].setAttribute("checked", "");
    // }
    // // 所以这里改为用 for 循环
    for(var i = 0; i < oinputs.length; i++){
      oinputs[i].removeAttribute("checked");
    }
    thisInput.setAttribute("checked", "checked");
    
    // 设置对应数据
    pageState.nowGraTime = thisInput.value;
    
    // 调用图表渲染函数
    initAqiChartData();
    renderChart();
  }else{}
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var change = (this.innerHTML !== pageState.nowSelectCity);

  console.log("clicked is ");
  console.log(this);
  console.log("Ready ??");
  console.log(aqiSourceData);
  console.log(chartData);
  if(change){
    // 设置对应数据
    pageState.nowSelectCity = this.innerHTML;

    // 调用图表渲染函数
    // console.log("Ready ??");
    // console.log(aqiSourceData);
    // console.log(chartData);
    initAqiChartData();
    renderChart();
  }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  document.getElementById("form-gra-time").addEventListener('click', function(e){
    if(e.target
      && (e.target.nodeName === 'LABEL'
      || (e.target.nodeName === 'INPUT'
        && e.target.getAttribute("type") === 'radio'))){
      graTimeChange.apply(e.target);
    }
  });
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置下拉列表(#city-select)中的选项
  var slt = document.getElementById("city-select");
  var opt = null;
  for(var key in aqiSourceData){
    opt = document.createElement("option");
    opt.innerHTML = key;
    slt.appendChild(opt);
  }

  pageState.nowSelectCity = "北京";//slt.childNodes[0].innerHTML;
  // slt.childNodes[0].setAttribute("selected", "selected");

  // 给select设置事件，当选项发生变化时，调用函数 citySelectChange
  slt.addEventListener('click', function(e){
    if(e.target
      && e.target.nodeName === "option"){
      console.log("felt city change!..");
      console.log(e.target);
      citySelectChange.apply(e.target);
    }
  });
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  // aqiSourceData -> chartData
  if(pageState.nowGraTime === "day"){
    chartData = aqiSourceData[pageState.nowSelectCity];
  }
  else if(pageState.nowGraTime === "week"){
    
  }
  else if(pageState.nowGraTime === "month"){
    // 局限性：暂时先只考虑同一年的十二个月……
    var orecord = {
      '01': { 'total': 0, 'num': 0, 'avg': 0 },
      '02': { 'total': 0, 'num': 0, 'avg': 0 },
      '03': { 'total': 0, 'num': 0, 'avg': 0 },
      '04': { 'total': 0, 'num': 0, 'avg': 0 },
      '05': { 'total': 0, 'num': 0, 'avg': 0 },
      '06': { 'total': 0, 'num': 0, 'avg': 0 },
      '07': { 'total': 0, 'num': 0, 'avg': 0 },
      '08': { 'total': 0, 'num': 0, 'avg': 0 },
      '09': { 'total': 0, 'num': 0, 'avg': 0 },
      '10': { 'total': 0, 'num': 0, 'avg': 0 },
      '11': { 'total': 0, 'num': 0, 'avg': 0 },
      '12': { 'total': 0, 'num': 0, 'avg': 0 }
    };
    var data = aqiSourceData[pageState.nowSelectCity];
    var key = "";
    for(key in data){
      var m = key.split('-')[1];
      orecord[m]['num']++;
      orecord[m]['total'] += data[key];
    }
    for(key in orecord){
      if(orecord[key]['num'] !== 0){
        orecord[key]['avg'] = orecord[key]['total'] / orecord[key]['num'];   
      }
    }
    chartData = orecord;// ??? 对象的。。深拷贝
    console.log('In initAqiChartData, if month: ');
    console.log(chartData);
  }
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

window.onload = function(){
  init();
};
