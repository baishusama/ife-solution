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

// 以下关于 css 前缀的处理方法借鉴自 jQuery ：jquery-3.1.0.js
function getProperName(cssPropertyName) {
    var name = cssPropertyName;
    var cssPrefixes = ["Webkit", "Moz", "ms"];
    var emptyStyle = document.createElement("div").style;
    if (name in emptyStyle) {
        return name;
    }

    var capName = name[0].toUpperCase + name.slice(1);
    var i = cssPrefixes.length;
    while (i--) {
        name = cssPrefixes[i] + capName;
        if (name in emptyStyle) {
            return name;
        }
    }
}

function generateInlineStyle(degree) {
    var deg = degree || 0;
    return 'rotate(' + deg + 'deg)';
}

// DOM
var squareDOM = document.getElementById("square");
var boardDOM = document.getElementById("board");
var dirInputDOM = document.getElementById("directives");
var dirInputBtnDOM = dirInputDOM.nextElementSibling;

// 小方块
var square = (function() {
    var sqPos = [5, 5];
    var sqDir = 0;
    // var DIRECTION = ["faceNorth", "faceEast", "faceSouth", "faceWest"];
    var PROPERTY = getProperName("transform");
    console.log("当前浏览器支持的是 " + PROPERTY);

    var directionMod4 = function() {
        /* sqDir % 4 === 0,1,2,3 */
        // 为了解决当 sqDir 为负数时，sqDir % 4 的值不在 0,1,2,3 之间的问题

        /* 法1. 能否借助 Math 的某未知方法？？？ */
        //     Q: Math 有没有方法能取模只返回正数？
        //     A: JS 当下不存在这样的函数。
        //     Q: 能否通过比如说 Math.abs 实现（特别是还要能避免使用 if）？
        //     A: 至少用 Math.abs 只会帮倒忙。。

        /* 法2. 本想借助 substr 方法支持末尾计数法和一个静态字符串来实现。。。 */
        //     A: 但是当被模数的绝对值大于模数时，存在问题。比如 >4 的时候会反回 NaN 。
        //        实质上，String 的末尾计数法（substr/slice）的计算方式并不能很好地和真正的取模运算相映射 Orz
        // var DIRECTION = ["faceNorth", "faceEast", "faceSouth", "faceWest"];
        // return parseInt(DSTRING.substr(sqDir,1));

        /* 法3. 如下，已经是我能想到的比较简单的方法了 www */
        return (sqDir % 4 + 4) % 4; // Any better way ???
    };
    var moveSqDOM = function() {
        squareDOM.style.top = sqPos[1] * 40 + "px";
        squareDOM.style.left = sqPos[0] * 40 + "px";
    };
    var tryMove = function(direction, pace) {
        var pace = pace || 1;
        console.log(direction)
        console.log(sqPos)
        if (directionMod4() === 0 && sqPos[1] > 1) {
            sqPos[1]--;
        } else if (directionMod4() === 1 && sqPos[0] < 10) {
            sqPos[0]++;
        } else if (directionMod4() === 2 && sqPos[1] < 10) {
            sqPos[1]++;
        } else if (directionMod4() === 3 && sqPos[0] > 1) {
            sqPos[0]--;
        } else {
            throw new Error("抵达边界无法前进 XO");
        }
        moveSqDOM();
    };
    var takeTurn = function(clockwise, degree) {
        var degree = degree || 90;
        if (degree === 90) {
            if (clockwise) {
                sqDir++;
            } else {
                sqDir--;
            }
        } else if (degree === 180) {
            console.log("turn 180 deg !!")
            sqDir += 2;
        }

        /* 小方块的旋转 */

        /* 法1. 一开始想用 class 实现，但是变化不连续 :( */
        // squareDOM.className = DIRECTION[directionMod4()];

        /* 法2. js + inline-css */
        squareDOM.style[PROPERTY] = generateInlineStyle(90 * sqDir);
    };

    return {
        go: function() {
            tryMove(sqDir);
        },
        tunlef: function() {
            console.log("square should turn left..")
            takeTurn(false);
        },
        tunrig: function() {
            console.log("square should turn right..")
            takeTurn(true);
        },
        tunbac: function() {
            console.log("square should turn back..")
            takeTurn(true, 180);
        }
    };
})();

var board = (function() {
    var bd = [];
    return {

    };
})();

var getValidDirective = function(rawValue) {
    var possibleValue = [];
    for (var key in square) {
        possibleValue.push(key);
    }

    var value = rawValue.trim().replace(/\s/, '').toLowerCase();
    if (possibleValue.indexOf(value) > -1) {
        return value;
    }
    throw new Error("非法指令，请重新尝试 :(");
};

addEventHandler(dirInputBtnDOM, "click", function() {
    var rawValue = dirInputDOM.value;
    try {
        square[getValidDirective(rawValue)]();
    } catch (e) {
        alert(e.message);
    }
});

window.onload = function() {};
