var ul = document.getElementsByClassName("queue")[0];
var input = document.getElementById("queue-input");
var btns = document.getElementsByClassName("btns")[0];

function isInputNum(rawInput) {
    var trimmedInput = rawInput.trim() || input.value.trim(); // ???
    if (/^\d+$/.test(trimmedInput)) {
        return trimmedInput;
    }
    throw new Error("请输入纯数字~");
    //return false;
}

function isInputInRange(numStr) {
    var num = parseInt(numStr) || parseInt(input.value.trim()); // ???
    // case1. parseInt(null) => NaN 会导致选择上式右侧
    if (num >= 10 && num <= 100) {
        return num;
    }
    throw new Error("请输入 10 - 100 之间的数字~");
}

function validInput(rawInput) {
    return isInputInRange(isInputNum(rawInput));
}

var queue = (function() {
    // 利用 JS 的 Array 类型模拟队列
    var data = [];
    var status = [];
    var STATUS = ["", "current", "ordered"]

    // ！？以下两个函数如果也返回的话，无法被返回的公有函数调用OAO
    // 不过，这两个函数目前仅被公有函数使用，令成私有似乎合情合理。。
    var isQueueEmpty = function() {
        if (data.length > 0) {
            return true;
        }
        throw new Error("队列已经空了~");
    };
    var isQueueFull = function() {
        if (data.length < 60) {
            return true;
        }
        throw new Error("队列已达到 60 上限，请在添加元素之前删除元素~");
    };
    var setStatus = function(i, s) {
        status[i] = s;
    };
    var initDisorderedStatus = function() {
        status = status.map(function(elem) {
            return (elem < 2) ? 0 : elem;
        });
    };
    var setOrderedStatusBefore = function(index) {
        status = status.map(function(elem, i) {
            if (i < index) {
                return 2;
            }
            return elem;
        });
    };
    var setOrderedStatusAfter = function(index) {
        status = status.map(function(elem, i) {
            // console.log("index: " + index);
            if (i > index) {
                // console.log("\tthis time i >= index: " + i)
                return 2;
            }
            return elem;
        });
    };
    var swopTwoElem = function(index1, index2) {
        var temp = data[index1];
        data[index1] = data[index2];
        data[index2] = temp;
    };
    var findMinElemAfter = function(index) {
        var mIndex = 0; // 注意这里的 minIndex 是相对于 index 的！
        var min = data[index];
        data.slice(index).map(function(elem, i) {
            if (elem < min) {
                min = elem;
                mIndex = i;
            }
        });
        return index + mIndex;
    };
    var insertAt = function(curPos, insertPos) {
        var curElem = null;
        if (curPos !== insertPos) {
            curElem = data.splice(curPos, 1)[0];
            data.splice(insertPos, 0, curElem);
        }
    };
    var drawQueue = function() {
        var res = "";
        data.map(function(elem, i) {
            var clsName = STATUS[status[i]];
            res += '<li style="height:' + elem + 'px;" title="' + elem + '" class="' + clsName + '"></li>';
        });
        ul.innerHTML = res;
    }
    return {
        toArray: function() {
            return data;
        }, // for test
        /*'drawQueue': drawQueue,*/
        /*function() {
                    var res = "";
                    data.map(function(elem, i) {
                        res += '<li style="height:' + elem + 'px;" title="' + elem + '"></li>';
                    });
                    ul.innerHTML = res;
                },*/
        leftIn: function(value) {
            isQueueFull();
            data.unshift(validInput(value));
            drawQueue();
            return this;
        },
        rightIn: function(value) {
            isQueueFull();
            data.push(validInput(value));
            drawQueue();
            return this;
        },
        leftOut: function() {
            isQueueEmpty();
            console.log("你去掉了左边的" + data.shift() + "~");
            drawQueue();
            return this;
        },
        rightOut: function() {
            isQueueEmpty();
            console.log("你去掉了右边的" + data.pop() + "~");
            drawQueue();
            return this;
        },
        deleteElemAt: function(index) {
            isQueueEmpty();
            data.splice(index, 1);
            drawQueue();
            return this; // 可以来一波 链式写法 里么 www ！
        },
        generateRandomQueue: function(length) {
            for (var i = 0; i < length; i++) {
                data.push(Math.floor(Math.random() * (100 - 10 + 1) + 10));
                status.push(0);
            }
            drawQueue();
            return this;
        },
        disruptQueue: function() {
            // 这里用啥算法比较好捏。。？哈希表？
        },
        bubbleSort: function() {
            // var round = 1;
            var time = 0;
            var TIMESPACE = 30;
            var self = this;

            for (var round = 1; round < data.length; round++) {
                for (var i = 0; i < data.length - round; i++) {
                    // [!!NOTE] 闭包
                    (function(index, r) {
                        setTimeout(function() {
                            // console.log("( "+index+" , "+(index+1)+" )");                    
                            setOrderedStatusAfter(data.length - r); // argu's min: 2
                            initDisorderedStatus();
                            setStatus(index, 1);
                            setStatus(index + 1, 1);
                            if (data[index] > data[index + 1]) {
                                swopTwoElem(index, index + 1);
                            }
                            drawQueue();
                            // initDisorderedStatus();
                        }, time);
                    })(i, round);
                    time += TIMESPACE;
                }
            }
            // Finally, 
            setTimeout(function() {
                setOrderedStatusAfter(-1);
                drawQueue();
            }, time);
            return this;
        },
        selectionSort: function() {
            var time = 0;
            var TIMESPACE = 100;
            var minIndex = null;

            for (var position = 0; position < data.length; position++) {
                (function(pos) {
                    setTimeout(function() {
                        // console.log("want to set POS " + pos)
                        minIndex = findMinElemAfter(pos);
                        // console.log("\tthis time MIN is at: " + minIndex)
                        setOrderedStatusBefore(pos);
                        initDisorderedStatus();
                        setStatus(pos, 1);
                        setStatus(minIndex, 1);
                        swopTwoElem(pos, minIndex);
                        drawQueue();
                    }, time);
                })(position);
                time += TIMESPACE;
            }
            // Finally, 
            setTimeout(function() {
                setOrderedStatusBefore(data.length);
                drawQueue();
            }, time);
        },
        insertionSort: function() {
            var time = 0;
            var TIMESPACE = 100;

            for (var ordered = 1; ordered < data.length; ordered++) {
                var insertPos = ordered;
                for (; insertPos >= 0; insertPos--) { // 从后往前查找
                    if (data[ordered] >= data[insertPos - 1] || insertPos === 0) {
                        /*(function(curPos, insPos) {
                            setTimeout(function() {
                                console.log("ordered: " + curPos)
                                console.log("\tshould insert at: " + insPos)
                                    // debugger;
                                setOrderedStatusBefore(curPos);
                                initDisorderedStatus();
                                setStatus(curPos, 1);
                                // setStatus(minIndex, 1);
                                insertAt(curPos, insPos);
                                drawQueue();
                            }, time);
                        })(ordered, insertPos);*/
                        insertAt(ordered, insertPos);
                        drawQueue();
                        break;
                    }
                }
                console.log("ordered: " + ordered);
                console.log("\tshould insert at: " + (insertPos + 1));
                /*(function(curPos, insPos) {
                    setTimeout(function() {
                        console.log("ordered: "+curPos)
                        console.log("\tshould insert at: "+(insPos+1))
                        debugger;
                        setOrderedStatusBefore(curPos);
                        initDisorderedStatus();
                        setStatus(curPos, 1);
                        // setStatus(minIndex, 1);
                        insertAt(curPos, insPos + 1);
                        drawQueue();
                    }, time);
                })(ordered, insertPos);*/
                /*insertAt(ordered, insertPos + 1);
                drawQueue();*/

                time += TIMESPACE;
            }
        }
    };
})();

/* 利用事件委托，避开循环绑定事件 */

// 编写 html 时为 input[button] 添加的 id 包含按钮将触发事件的方向（direction）和增删（operate）信息，
// 以此结合数组的 push/pop/unshift/shift 方法来模拟队列的操作
btns.addEventListener("click", function(e) {
    if (e.target.nodeName === "INPUT" && e.target.id !== "") {
        var funcName = e.target.id
            //.replace("-i",'I').replace("-o",'O');// 这里有更好的解决方法么？？？
            .replace(/\-[a-z]/, function(str) {
                return str[1].toUpperCase();
            });
        var value = input.value;
        try {
            queue[funcName](value);
        } catch (e) {
            console.log(e.message);
        }
        input.value = "";
    } /* else { console.log("Whoops.."); }*/
}, false);

// 生成 li 时添加的类名 index-$ 包含在 queue （数组类型）中的位置信息，
// 以此结合数组的 filter 方法来更新 queue
ul.addEventListener("click", function(e) {
    if (e.target.nodeName === "LI") {
        var index = parseInt([].indexOf.call(e.target.parentNode.children, e.target)); // [!!NOTE] .children 和 .childNodes 的区别
        try {
            queue.deleteElemAt(index);
        } catch (e) {
            console.log(e.message);
        }
    }
}, false);



window.onload = function() {
    queue.generateRandomQueue(20);
};
