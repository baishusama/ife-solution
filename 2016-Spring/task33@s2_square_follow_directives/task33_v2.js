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
// var squareDOM = document.getElementById("square");
var boardDOM = document.getElementById("board");
var dirInputDOM = document.getElementById("directives");
var dirInputBtnDOM = dirInputDOM.nextElementSibling;

// 区域
var board = (function() {
    var ROW = 10;
    var COLUMN = 10;
    var bd = [];

    var generateBoard = function() {
        var cell = null;
        for (var i = 0; i < ROW; i++) {
            var rowTmp = [];
            for (var j = 0; j < COLUMN; j++) {
                cell = document.createElement("div");
                cell.className = "grid";
                if (j === 0) {
                    cell.className += " clearfix";
                } else if (j === 9) {
                    cell.className += " rightmost";
                }
                if (i === 9) {
                    cell.className += " downmost";
                }
                boardDOM.appendChild(cell);
                rowTmp.push(0);
            }
            bd.push(rowTmp);
        }
    };
    return {
        generateBoard: function() {
            generateBoard();
        },
        getRowNum: function() {
            return ROW;
        },
        getColNum: function() {
            return COLUMN;
        },
        getBoardState: function() {
            return bd;
        }
    };
})();

// 小方块
var square = (function() {
    var sqPos = { x: 1, y: 1 }; // default position // 1~10
    var sqDir = 0; // default direction // 0,1,2,3
    var squareDOM = null;
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
        squareDOM.style.top = (sqPos.x - 1) * 40 - 1 + "px";
        squareDOM.style.left = (sqPos.y - 1) * 40 - 1 + "px";
    };
    var tryMove = function(direction, pace) {
        var pace = pace || 1;

        var furPos = sqPos;
        if (directionMod4() === 0 && furPos.x > 1) {
            furPos.x--;
        } else if (directionMod4() === 1 && furPos.y < board.getColNum()) {
            furPos.y++;
        } else if (directionMod4() === 2 && furPos.x < board.getRowNum()) {
            furPos.x++;
        } else if (directionMod4() === 3 && furPos.y > 1) {
            furPos.y--;
        } else {
            throw new Error("抵达边界，无法前进 XO");
        }

        if (board.getBoardState()[furPos.x - 1][furPos.y - 1] === 0) {
            sqPos = furPos;
        } else {
            throw new Error("此方向存在障碍物，无法前进 XO");
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
            sqDir += 2;
        }

        /* 小方块的旋转 */

        /* 法1. 一开始想用 class 实现，但是变化不连续 :( */
        // squareDOM.className = DIRECTION[directionMod4()];

        /* 法2. js + inline-css */
        squareDOM.style[PROPERTY] = generateInlineStyle(90 * sqDir);
    };

    return {
        generateSquare: function() {
            // get square random position and direction
            sqPos.x = Math.ceil(Math.random() * 10);
            sqPos.y = Math.ceil(Math.random() * 10);
            sqDir = Math.floor(Math.random() * 4);

            // generate dom
            squareDOM = document.createElement("div");
            squareDOM.id = "square";
            moveSqDOM();
            squareDOM.style[PROPERTY] = generateInlineStyle(90 * sqDir);
            boardDOM.appendChild(squareDOM);
        },
        go: function() {
            tryMove(sqDir);
        },
        tunlef: function() {
            takeTurn(false);
        },
        tunrig: function() {
            takeTurn(true);
        },
        tunbac: function() {
            takeTurn(true, 180);
        }
    };
})();

var getValidDirective = function(rawValue) {
    var possibleValue = [];
    for (var key in square) {
        possibleValue.push(key);
    }

    var value = rawValue.trim().replace(/\s/g, '').toLowerCase();
    if (possibleValue.indexOf(value) > -1) {
        return value;
    }
    throw new Error("非法指令，请重新尝试 :(\n合法的指令有如下：\n  GO\n  TUN LEF\n  TUN RIG\n  TUN BAC");
};

addEventHandler(dirInputBtnDOM, "click", function() {
    var rawValue = dirInputDOM.value;
    try {
        square[getValidDirective(rawValue)]();
    } catch (e) {
        alert(e.message);
    }
});

dirInputDOM.onkeydown = function(event) {
    var e = event || window.event;
    switch (e.keyCode) {
        case 13:
            dirInputBtnDOM.click(); /* 关于模拟点击事件触发的其他方法（better way???） */
            break;
    }
};

window.onload = function() {
    board.generateBoard();
    square.generateSquare();
};
