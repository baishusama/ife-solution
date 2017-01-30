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

    var directionMod4 = function(direction) {
        return (direction % 4 + 4) % 4;
    };
    var moveSqDOM = function() {
        squareDOM.style.top = (sqPos.x - 1) * 40 - 1 + "px";
        squareDOM.style.left = (sqPos.y - 1) * 40 - 1 + "px";
    };
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
    var tryMove = function(direction, pace) {
        var pac = pace || 1;
        var dir = (typeof direction === "number") ? direction : directionMod4(sqDir); // direction can be 0

        var furPos = traDir(dir, pac);

        if (board.getBoardState()[furPos.x - 1][furPos.y - 1] === 0) {
            sqPos = furPos;
        } else {
            throw new Error("此方向存在障碍物，无法继续前进 XO");
        }

        moveSqDOM();
    };
    var turnTo = function(direction) {
        var curDir = directionMod4(sqDir);
        // if(curDir === direction) return 0;

        /* 就近转向 */
        // Any better way ???
        var cwStep = 0,
            anticwStep = 0;
        while (true) {
            if ((curDir + cwStep) % 4 === direction) {
                break;
            }
            cwStep++;
        }
        while (true) {
            if ((curDir - anticwStep + 4) % 4 === direction) {
                break;
            }
            anticwStep++;
        }

        var deg = 0;
        if (cwStep > anticwStep) {
            deg = -anticwStep * 90;
        } else {
            deg = cwStep * 90;
        }
        return deg;
    };
    var takeTurn = function(degree) {
        var deg = degree;
        sqDir += deg / 90;

        /* 小方块的旋转 */
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
            tryMove();
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
            tryMove(0);
        },
        trarig: function() {
            tryMove(1);
        },
        trabot: function() {
            tryMove(2);
        },
        tralef: function() {
            tryMove(3);
        },
        movtop: function() {
            takeTurn(turnTo(0));
            tryMove();
        },
        movrig: function() {
            takeTurn(turnTo(1));
            tryMove();
        },
        movbot: function() {
            takeTurn(turnTo(2));
            tryMove();
        },
        movlef: function() {
            takeTurn(turnTo(3));
            tryMove();
        },
    };
})();

var getValidDirective = function(rawValue) {
    var value = rawValue.trim().replace(/\s/g, '').toLowerCase();
    if (square[value]) {
        return value;
    }
    throw new Error("非法指令，请重新尝试 :(\n合法的指令有如下：\n  GO\n  TUN LEF\n  TUN RIG\n  TUN BAC\n  TRA TOP\n  TRA RIG\n  TRA BOT\n  TRA LEF\n  MOV TOP\n  MOV RIG\n  MOV BOT\n  MOV LEF");
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
