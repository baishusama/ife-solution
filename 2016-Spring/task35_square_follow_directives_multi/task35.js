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
var directivesDOM = document.getElementById("directives");
var runBtnDOM = document.getElementsByClassName("run")[0];
var refreshBtnDOM = document.getElementsByClassName("refresh")[0];

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
    var sqDir = 0; // default direction // ...,-3,-2,-1,0,1,2,3,...
    var squareDOM = null;
    var PROPERTY = getProperName("transform");
    console.log("当前浏览器支持的是 " + PROPERTY);

    // 真正的取模，而不是取余
    var directionMod4 = function(direction) {
        return (direction % 4 + 4) % 4;
    };

    // 对 squareDOM 进行移动（定位）
    var moveSqDOM = function() {
        squareDOM.style.top = (sqPos.x - 1) * 40 - 1 + "px";
        squareDOM.style.left = (sqPos.y - 1) * 40 - 1 + "px";
    };

    // 返回小方块将抵达的位置
    var traDir = function(direction, pace) {
        var furPos = sqPos;
        if (direction === 0 && furPos.x >= pace + 1) {
            furPos.x -= pace;
        } else if (direction === 1 && furPos.y <= board.getColNum() - pace) {
            furPos.y += pace;
        } else if (direction === 2 && furPos.x <= board.getRowNum() - pace) {
            furPos.x += pace;
        } else if (direction === 3 && furPos.y >= pace + 1) {
            furPos.y -= pace;
        } else {
            throw new Error("将抵达边界，无法继续前进 XO");
        }
        return furPos;
    };

    // 尝试移动小方块，当“抵达边界”或“存在障碍物”时报错，否则返回 true
    var tryMove = function(direction, pace) {
        var pac = pace || 1;
        var dir = (typeof direction === "number") ? direction : directionMod4(sqDir); // direction can be 0

        var furPos = traDir(dir, pac);

        if (board.getBoardState()[furPos.x - 1][furPos.y - 1] === 0) {
            sqPos = furPos;
        } else {
            throw new Error("此方向存在障碍物，无法继续前进 XO");
        }

        return true;
    };

    // 返回转到某方向的最小角度
    var turnTo = function(direction) {
        var curDir = directionMod4(sqDir); // 小方块的当前朝向
        // if(curDir === direction) return 0;

        /* 就近转向 */
        // Any better way ???
        var cwStep = 0; // 顺时针（clockwise）所需转向次数
        while (true) {
            if ((curDir + cwStep) % 4 === direction) {
                break;
            }
            cwStep++;
        }

        var deg = 0;
        if (cwStep > 2) {
            deg = (cwStep - 4) * 90;
        } else {
            deg = cwStep * 90;
        }
        return deg;
    };

    // 转向
    var takeTurn = function(degree) {
        var deg = degree;
        sqDir += deg / 90;

        /* 小方块的旋转 */
        squareDOM.style[PROPERTY] = generateInlineStyle(90 * sqDir);
    };

    // 移动小方块
    var move = function(direction, pace, isMOV) {
        if (tryMove(direction, pace)) {
            if (isMOV) { // 如果是 MOV 指令，在移动前，先转向
                takeTurn(turnTo(direction));
            }
            moveSqDOM();
        }
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
            move();
        },
        tunlef: function() {
            takeTurn(-90);
        },
        tunrig: function() {
            takeTurn(90);
        },
        tunbac: function() {
            takeTurn(180);
        },
        tratop: function() {
            move(0);
        },
        trarig: function() {
            move(1);
        },
        trabot: function() {
            move(2);
        },
        tralef: function() {
            move(3);
        },
        movtop: function() {
            move(0, 1, true);
        },
        movrig: function() {
            move(1, 1, true);
        },
        movbot: function() {
            move(2, 1, true);
        },
        movlef: function() {
            move(3, 1, true);
        },
    };
})();

// 代码编辑 textarea
var codeArea = (function() {
    var trmdVals = [];
    //--------------here to be continued!-----------------
    // var
    return {};
})();

var getValidDirective = function(rawValue) {
    var values = rawValue.split("\n"); //.trim().replace(/\s/g, '').toLowerCase();
    console.log("line's num: " + values.length)

    // 去掉空白符 & 小写
    var trimmedValues = values.map(function(elem, index) {
        return elem.trim().replace(/\s/g, '').toLowerCase();
    });

    // 数组去重
    var valueList = {};
    var uniqueTrmdValues = [];
    for (var i = 0; i < trimmedValues.length; i++) {
        if (valueList[trimmedValues[i]] === undefined) {
            valueList[trimmedValues[i]] = 1;
            uniqueTrmdValues.push(trimmedValues[i]);
        }/* else { valueList[trimmedValues[i]]++; }*/
    }

    uniqueTrmdValues.forEach(function(elem, index) {
        // return
    });
    /*if (square[value]) {
        return value;
    }
    throw new Error("非法指令，请重新尝试 :(\n合法的指令有如下：\n  GO\n  TUN LEF\n  TUN RIG\n  TUN BAC\n  TRA TOP\n  TRA RIG\n  TRA BOT\n  TRA LEF\n  MOV TOP\n  MOV RIG\n  MOV BOT\n  MOV LEF");*/
};

addEventHandler(runBtnDOM, "click", function() {
    var rawValue = directivesDOM.value;
    console.log(rawValue)
    try {
        getValidDirective(rawValue) // test
            // square[getValidDirective(rawValue)]();
    } catch (e) {
        alert(e.message);
    }
});

/*directivesDOM.onkeydown = function(event) {
    var e = event || window.event;
    switch (e.keyCode) {
        case 13:
            dirInputBtnDOM.click(); // 关于模拟点击事件触发的其他方法（better way???）
            break;
    }
};*/

window.onload = function() {
    board.generateBoard();
    square.generateSquare();
};
