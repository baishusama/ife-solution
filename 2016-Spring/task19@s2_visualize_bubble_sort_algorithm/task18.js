// 利用 JS 的 Array 类型模拟队列
var queue = [];
var ul = document.getElementsByClassName("queue")[0];
var input = document.getElementById("queue-input");
var btns = document.getElementsByClassName("btns")[0];

function drawQueue() {
    var res = "";
    for (var i = 0; i < queue.length; i++) {
        res += '<li style="height: ' + queue[i] + 'px" title="' + queue[i] + '"></li>';
    }
    ul.innerHTML = res;
}

function inputIsNum(inputVal) {
    var value = inputVal || input.value.trim();
    var regExp = /^\d+$/;
    if (regExp.test(value)) {
        return true;
    }
    throw new Error("请输入纯数字~");
    //return false;
}

function inputInRange(inputVal) {
    var value = inputVal || parseInt(input.value.trim());
    if (value >= 10 && value <= 100) {
        return true;
    }
    throw new Error("请输入 10 - 100 之间的数字~");
}

function inputReachLimit() {
    if (queue.length === 60) {
        return true;
    }
    throw new Error("队列元素已达到上限 60 个，请在添加新元素之前先进行删除操作~");
}

/* 利用事件委托，避开循环绑定事件 */

// 编写 html 时为 input[button] 添加的 id 包含按钮将触发事件的方向（direction）和增删（operate）信息，
// 以此结合数组的 push/pop/unshift/shift 方法来模拟队列的操作
btns.addEventListener("click", function(e) {
    if (e.target.nodeName === "INPUT") {
        var btnId = e.target.id;
        var direction = btnId.split("-")[0];
        var operate = btnId.split("-")[1];
        if (operate === "in") {
            if (inputIsNum()) {
                var value = input.value.trim();
                if (direction === "left") {
                    queue.unshift(value);
                } else if (direction === "right") {
                    queue.push(value);
                }
                drawQueue();
            } else {
                alert("非法输入 :(");
            }
            input.value = "";
        } else if (operate === "out") {
            if (queue.length) {
                var elemRemoved = null;
                if (direction === "left") {
                    elemRemoved = queue.shift();
                } else if (direction === "right") {
                    elemRemoved = queue.pop();
                }
                drawQueue();
                alert("你去掉了" + (direction === "left" ? "左边的" : "右边的") + elemRemoved + "~");
            } else {
                ul.innerHTML = "这里现在一片荒芜 TVT";
                alert("这里什么也没有~");
            }
        }
    }
}, false);

// 生成 li 时添加的类名 index-$ 包含在 queue （数组类型）中的位置信息，
// 以此结合数组的 filter 方法来更新 queue
ul.addEventListener("click", function(e) {
    if (e.target.nodeName === "LI") {
        var index = [].indexOf.call(e.target.parentNode.children, e.target); // [!!] 注意 .children 和 .childNodes 的区别
        queue.splice(index, 1);
        if (queue.length) {
            drawQueue();
        } else {
            ul.innerHTML = "这里现在一片荒芜 TVT";
        }
    }
}, false);