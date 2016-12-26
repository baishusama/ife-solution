// 利用 JS 的 Array 类型模拟队列
var queue = [];
var ul = document.getElementsByClassName("queue")[0];
var input = document.getElementById("queue-input");
var btns = document.getElementsByClassName("btns")[0];

function drawQueue() {
    var res = "";
    for (var i = 0; i < queue.length; i++) {
        res += '<li class="index-' + i + '">' + queue[i] + "</li>";
    }
    ul.innerHTML = res;
}

function inputIsNum() {
    var regExp = /^\d+$/;
    if (regExp.test(input.value.trim())) {
        return true;
    }
    return false;
}

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

ul.addEventListener("click", function(e) {
    if (e.target.nodeName === "LI") {
        var i = parseInt(e.target.className.split("-")[1]);
        queue = queue.filter(function(elem, index) {
            if (index !== i) {
                return true;
            }
        });
        if (queue.length) {
            drawQueue();
        } else {
            ul.innerHTML = "这里现在一片荒芜 TVT";
        }
    }
}, false);