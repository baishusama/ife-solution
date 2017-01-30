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
    var drawQueue = function() { // 纠结 drawQueue 的位置和写法：1. 返回的对象的内部方法可以调用；2. 外部 queue 可以调用（公共方法）
        var res = "";
        data.map(function(elem) {
            res += '<li style="height:' + elem + 'px;" title="' + elem + '"></li>';
        });
        ul.innerHTML = res;
    };

    return {
        leftIn: function(value) {
            isQueueFull();
            data.unshift(validInput(value));
            drawQueue();
            return this;
        },
        /*'drawQueue': drawQueue,*/
        /*function() {
            var res = "";
            data.map(function(elem, i) {
                res += '<li style="height:' + elem + 'px;" title="' + elem + '"></li>';
            });
            ul.innerHTML = res;
        },*/
        rightIn: function(value) {
            isQueueFull();
            data.push(validInput(value));
            drawQueue();
            return this;
        },
        leftOut: function() {
            isQueueEmpty();
            alert("你去掉了左边的" + data.shift() + "~");
            drawQueue();
            return this;
        },
        rightOut: function() {
            isQueueEmpty();
            alert("你去掉了右边的" + data.pop() + "~");
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
            alert(e.message);
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
            alert(e.message);
        }
    }
}, false);