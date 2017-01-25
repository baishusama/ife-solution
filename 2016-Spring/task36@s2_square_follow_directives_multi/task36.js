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

// 用于添加类名
function addClassName(elem, clsname) {
    var names = elem.className.split(/\s/);
    var index = names.indexOf(clsname);
    if (index === -1) {
        names.push(clsname);
        elem.className = names.join(' ');
        return true;
    }
    return false;
}
// 用于删除类名
function removeClassName(elem, clsname) {
    var names = elem.className.split(/\s/);
    var index = names.indexOf(clsname);
    if (index !== -1) {
        names.splice(index, 1);
        elem.className = names.join(' ');
        return true;
    }
    return false;
}

// 简易的深拷贝
function deepCopy(obj) {
    var newObj = {};
    for (var key in obj) {
        if (typeof obj[key] === 'object') { // array should split ???
            newObj[key] = deepCopy(obj[key]);
        } else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

// DOM
// var squareDOM = document.getElementById("square");
var boardDOM = $("#board");
var directivesDOM = $("#directives");
var runBtnDOM = $(".run")[0];
var refreshBtnDOM = $(".refresh")[0];
var randomBtnDOM = $(".buildRandomWall")[0];

var ERRORMSG = {
    "movToBoundary": {
        "name": "mov_to_boundary",
        "message": "将抵达边界，无法继续前进 XO",
        "way": "alert"
    },
    "movToWall": {
        "name": "mov_to_wall",
        "message": "此方向存在墙，无法继续前进 XO",
        "way": "alert"
    },
    "buildAtBoundary": {
        "name": "build_at_boundary",
        "message": "前方是边界处，无法修墙 XO",
        "way": "console"
    },
    "buildAtWall": {
        "name": "build_at_wall",
        "message": "前方已存在墙，无法修墙 XO",
        "way": "console"
    },
    "brushAtBoundary": {
        "name": "brush_at_boundary",
        "message": "前方是边界处，无法刷墙 XO",
        "way": "console"
    },
    "brushAtEmpty": {
        "name": "brush_at_empty",
        "message": "前方没有墙，无法刷墙 XO",
        "way": "console"
    }
};

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

    var getBluePrint = function() {
        var WALL_HORIZENAL = "------------\n";
        var str = WALL_HORIZENAL;
        for (var i = 0; i < bd.length; i++) {
            str += '|';
            for (var j = 0; j < bd[0].length; j++) {
                if (bd[i][j] === 0) {
                    str += 'O';
                } else {
                    str += 'X';
                }
            }
            str += '|\n';
        }
        str += WALL_HORIZENAL;
        return str;
    };

    var getStateAt = function(x, y) {
        return bd[x][y];
    };

    var setStateAt = function(x, y) {
        bd[x][y] = 1;
        addClassName(boardDOM.children[x * 10 + y], "hasWall");
    };

    var brushWallAt = function(x, y, color) {
        var wall = boardDOM.children[x * 10 + y];
        wall.style.backgroundColor = color;
    };

    return {
        generate: function() {
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
        },
        isClearAt: function(x, y) {
            return !getStateAt(x, y);
        },
        /*isClearLine: function(pos1, pos2) {
            var x = y = i = 0;
            if (pos1[0] === pos2[0]) {
                x = pos1[0];
                for (i = Math.min(pos1[1], pos2[1]); i <= Math.max(pos1[1], pos2[1]); i++) {
                    if (getStateAt(x, i)) {
                        return false;
                    }
                }
            } else if (pos1[1] === pos2[1]) {
                y = pos1[1];
                for (i = Math.min(pos1[0], pos2[0]); i <= Math.max(pos1[0], pos2[0]); i++) {
                    if (getStateAt(i, y)) {
                        return false;
                    }
                }
            } else {
                console.log("The two position is not in a line :(");
            }
            return true;
        },*/
        printIncludeSq: function(sqPosition) {
            var sqPos = sqPosition || square.getCurPos();
            var x = sqPos.x;
            var y = sqPos.y;

            var SQARROW = ['↑', '→', '↓', '←'];
            var sqStr = SQARROW[square.getCurDir()];

            var str = getBluePrint();
            var lines = str.split('\n');
            lines[x] = lines[x].slice(0, y) + sqStr + lines[x].slice(y + 1, 12);
            console.log(lines.join('\n'));
        },
        setWallAt: function(x, y) {
            setStateAt(x, y);
        },
        setRandomWall: function() {
            var random = Math.floor(Math.random() * 100);
            var x = Math.floor(random / 10);
            var y = random % 10;
            while (getStateAt(x, y)) {
                random = Math.floor(Math.random() * 100);
                x = Math.floor(random / 10);
                y = random % 10;
            }
            setStateAt(x, y);
        },
        brush: function(x, y, color) {
            brushWallAt(x, y, color);
        }
    };
})();

// 小方块
var square = (function() {
    var sqPos = {
        x: 1,
        y: 1
    }; // default position // 1~10
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
    var getFurPos = function(direction, pace) {
        var dir = (typeof direction === "number") ? direction : directionMod4(sqDir); // direction can be 0
        var pac = pace || 1;
        var furPos = deepCopy(sqPos);

        if (dir === 0) { // && furPos.x >= pac + 1
            furPos.x -= pac;
        } else if (dir === 1) { // && furPos.y <= board.getColNum() - pac
            furPos.y += pac;
        } else if (dir === 2) { // && furPos.x <= board.getRowNum() - pac
            furPos.x += pac;
        } else if (dir === 3) { // && furPos.y >= pac + 1
            furPos.y -= pac;
        }
        /*
        else {
            return false;
        }
        */

        return furPos;
    };

    var isPosValid = function(position) {
        if (position.x >= 1 && position.x <= 10 && position.y >= 1 && position.y <= 10) {
            return true;
        }
        return false;
    }

    // 尝试移动小方块，当“抵达边界”或“存在墙”时报错，否则返回 true
    var tryMove = function(direction, pace) {
        var furPos = getFurPos(direction, pace);
        if (!isPosValid(furPos)) {
            throw ERRORMSG.movToBoundary;
        }

        //if (!board.isClearLine([sqPos.x - 1, sqPos.y - 1], [furPos.x - 1, furPos.y - 1])) {
        if (!board.isClearAt(furPos.x - 1, furPos.y - 1)) {
            throw ERRORMSG.movToWall;
        }

        sqPos = furPos;
        return true;
    };

    // 尝试修墙，当“抵达边界”或“存在墙”时报错，否则返回 true
    var tryBuild = function(furPos) {
        var furPos = furPos || getFurPos();

        if (!isPosValid(furPos)) {
            throw ERRORMSG.buildAtBoundary;
        }

        //if (!board.isClearLine([sqPos.x - 1, sqPos.y - 1], [furPos.x - 1, furPos.y - 1])) {
        if (!board.isClearAt(furPos.x - 1, furPos.y - 1)) {
            throw ERRORMSG.buildAtWall;
        }

        return true;
    }

    // 尝试粉刷墙，当前方无墙时报错，否则返回 true
    var tryBrush = function(furPos) {
        var furPos = furPos || getFurPos();

        if (!isPosValid(furPos)) {
            throw ERRORMSG.brushAtBoundary;
        }

        //if (!board.isClearLine([sqPos.x - 1, sqPos.y - 1], [furPos.x - 1, furPos.y - 1])) {
        if (board.isClearAt(furPos.x - 1, furPos.y - 1)) {
            throw ERRORMSG.brushAtEmpty;
        }

        return true;
    };

    // 返回转到某方向的最小角度
    var degreesTo = function(direction) {
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
                takeTurn(degreesTo(direction));
            }
            moveSqDOM();
        }
    };

    return {
        generate: function() {
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
        getCurPos: function() {
            return sqPos;
        },
        getCurDir: function() {
            return directionMod4(sqDir);
        },
        go: function(step) {
            move(undefined, step);
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
        tratop: function(step) {
            move(0, step);
        },
        trarig: function(step) {
            move(1, step);
        },
        trabot: function(step) {
            move(2, step);
        },
        tralef: function(step) {
            move(3, step);
        },
        movtop: function(step) {
            move(0, step, true);
        },
        movrig: function(step) {
            move(1, step, true);
        },
        movbot: function(step) {
            move(2, step, true);
        },
        movlef: function(step) {
            move(3, step, true);
        },
        build: function() {
            var furPos = getFurPos();
            if (tryBuild(furPos)) { // 如果能移动，那么也就能砌墙
                board.setWallAt(furPos.x - 1, furPos.y - 1);
            }
        },
        bru: function(color) {
            var furPos = getFurPos();
            if (tryBrush(furPos)) {
                board.brush(furPos.x - 1, furPos.y - 1, color);
            }
        },
        movto: function(position) {

        }
    };
})();

// 代码编辑 textarea
var codeArea = (function() {
    // DOM: directivesDOM
    var lineNumDOM = $("#lineNum");
    var trmdVals = [];
    var rows = 1;
    // var executable = 0; // nothing to execute
    // var VALIDKEYCODE = []

    function resetHighlightLine(clsnames) {
        function removeClassNames(elem) {
            for (var i = 0; i < clsnames.length; i++) {
                removeClassName(elem, clsnames[i]);
            }
        }
        for (var i = 0; i < lineNumDOM.children.length; i++) {
            removeClassNames(lineNumDOM.children[i]);
            // removeClassName(lineNumDOM.children[i], "current");
            // removeClassName(lineNumDOM.children[i], "stop");
        }
    }

    function highlightCurLine(index) {
        resetHighlightLine(["current"]);
        addClassName(lineNumDOM.children[index], "current");
    }

    function highlightRunTimeErrorLine(index) {
        var curElem = lineNumDOM.children[index];
        removeClassName(curElem, "current");
        addClassName(curElem, "stop");
    }

    function getDirectives() {
        var values = directivesDOM.value.split("\n");

        // 去掉空白符 & 小写
        var trimmedValues = values.map(function(elem, index) {
            return elem.trim().replace(/\s/g, '').toLowerCase();
        });

        return trimmedValues;
    }

    function getNonEmptyDirectives(directives) {
        var values = directives || getDirectives();
        return values.filter(function(elem) {
            // return /^\S+$/.test(elem);
            return elem; // [!!NOTE] this VS elem
        });
    }

    function checkOneDirective(directive) {
        var res = [];
        var name = "";
        var step = 0;

        if (/^[a-z]+\d*$/.test(directive)) { // matches GO TUN TRA MOV BUILD directives 
            name = directive.match(/[a-z]+/)[0];
            if (!square[name]) {
                return false;
            }

            // [!!NOTE] 注意这里用 + 而不能是 * ：星号总能匹配到空字符串，而加号能匹配到 null 或者数字字符串
            // [!!NOTE] 注意下两行中的 && 和 || 
            var temp = directive.match(/\d+/) && directive.match(/\d+/)[0]; // e.g. null && ~ -> null | ["1"] && "1" -> "1"
            step = parseInt(temp) || 0; // 当值为 null 时，得到 NaN 。NaN || 0 -> 0
            /*
            step = parseInt(temp);
            if (isNaN(step)) {
                step = 0;
            }
            */

            res = [name, step];
            return res;
        } else if (/^[a-z]{3}#([0-9a-fA-F]{3}){1,2}$/.test(directive)) { // matches BUR #COLOR directive
            name = directive.match(/^[a-z]+/)[0];
            if (!square[name]) {
                return false;
            }

            color = directive.match(/#.+$/)[0];

            res = [name, color];
            return res;
        } else if (/^[a-z]{5}\d+,\d+$/.test(directive)) { // matches MOV TO x,y directive
            name = directive.match(/[a-z]+/)[0];
            if (!square[name]) {
                return false;
            }

            position = directive.match(/\d+/).map(function(elem) {
                return parseInt(elem);
            });

            res = [name, position];
            return res;
        } else {
            return false;
        }
    }

    function findError(directives) {
        // 默认不带参数到时候，会检查和输入等量的指令
        // 如果带了参数，可以减少重复计算；
        // 或者检查非空指令集
        var errorLine = [];
        var values = directives || getDirectives();

        for (var i = 0; i < values.length; i++) {
            if (values[i] && !checkOneDirective(values[i])) { // 非空行，且未通过 check 的
                errorLine.push(i);
            }
        }

        return errorLine;
    }

    function highlightError(errors) {
        for (var i = 0; i < lineNumDOM.children.length; i++) {
            if (errors.indexOf(i) !== -1) {
                lineNumDOM.children[i].className = "errorLine";
            } else {
                lineNumDOM.children[i].className = "";
            }
        }
    }

    function setLineNum(num) {
        var i = 0;
        while (lineNumDOM.children.length < num) {
            lineNumDOM.appendChild(document.createElement("li"));
        }
        while (lineNumDOM.children.length > num) {
            lineNumDOM.lastElementChild.remove();
        }
    }

    function autoSize() {
        var lineH = (directivesDOM.value.match(/\n/g) && (directivesDOM.value.match(/\n/g).length + 1)) || 1;
        setLineNum(lineH);
    }

    function autoSizeAndCheck(e) {
        // if (e.keyCode === 13) {
        autoSize();
        highlightError(findError());
        // }
    }

    return {
        initialize: function() {
            addEventHandler(directivesDOM, "change", autoSizeAndCheck);
            addEventHandler(directivesDOM, "keydown", autoSizeAndCheck);
            addEventHandler(directivesDOM, "keyup", autoSizeAndCheck);
            autoSize();
        },
        runDirectives: function() {
            var values = getNonEmptyDirectives();

            var time = 0;
            var TIMESPACE = 800;
            var self = this;
            var stIDs = [];
            var tempID = null;

            if (findError(values).length) {
                throw new Error("You still have some errors in your directives. Please correct them first!\n(Valid directives are presented in Cheat-Sheet top right.)")
            }
            // else
            for (var i = 0; i < values.length; i++) {
                console.log("NonEmpQueue-" + i + ": " + checkOneDirective(values[i]));

                // 闭包 Way 2(ver2) 
                tempID = (function(index) {
                    return window.setTimeout(function() {
                        var arr = checkOneDirective(values[index]);
                        var name = arr[0];
                        var step = arr[1];

                        try {
                            highlightCurLine(index);
                            square[name](step);
                        } catch (e) {
                            highlightRunTimeErrorLine(index);

                            // 取消后续所有 setTimeout
                            stIDs.slice(index + 1).forEach(function(elem) {
                                window.clearTimeout(elem);
                                console.log("clear----clear----clear")
                            });

                            if (e.way === "alert") {
                                alert(e.message);
                            } else if (e.way === "console") {
                                console.log(e.message);
                                board.printIncludeSq();
                            }
                        }
                    }, time);
                })(i);
                stIDs.push(tempID);

                time += TIMESPACE;
            }
        },
        refresh: function() {
            resetHighlightLine(["current", "stop", "errorLine"]);
            directivesDOM.value = "";
            directivesDOM.focus();
            autoSize();
        }
    };
})();

addEventHandler(runBtnDOM, "click", function() {
    // 原本的 try-catch 是写在这里的，但是由于 setTimeout 方法对线程的破坏（阻塞？无视？？）
    // 将 try-catch 移到每个单独的 setTimeout 方法内部
    try {
        codeArea.runDirectives();
    } catch (e) {
        alert(e.message);
    }
});

addEventHandler(refreshBtnDOM, "click", function() {
    codeArea.refresh();
});

addEventHandler(randomBtnDOM, "click", function() {
    board.setRandomWall();
});

addEventHandler(directivesDOM, "keydown", function(event) {
    var e = event || window.event;
    if (e.keyCode === 13 && e.ctrlKey) {
        runBtnDOM.click(); // 关于模拟点击事件触发的其他方法（better way???）
    }
});

window.onload = function() {
    board.generate();
    square.generate();
    codeArea.initialize();
    directivesDOM.focus();
};
