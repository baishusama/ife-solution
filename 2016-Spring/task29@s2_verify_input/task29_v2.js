// 解决 IE 和非 IE 浏览器在事件绑定方面的兼容性
function addEventHandler(elem, event, handler) {
    if (elem.addEventHandler) {
        elem.addEventHandler(event, handler, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + event, handler);
    } else {
        elem["on" + event] = handler;
    }
}

// 用于添加类名
function addClassName(elem, newClassName) {
    if (elem.className.split(/\s/).indexOf(newClassName) === -1) {
        elem.className += (' ' + newClassName);
        return true;
    }
    return false;
}
// 用于删除类名
function removeClassName(elem, oldClassName) {
    var names = elem.className.split(/\s/);
    var index = names.indexOf(oldClassName);
    if (index !== -1) {
        names.splice(index, 1);
        elem.className = names.join(' ');
        return true;
    }
    return false;
}

/* DOM */
var verifyBtn = document.getElementById("verify");
var input = document.getElementById("name");
var info = input.nextElementSibling;

var isNotEmpty = function(rawVal) {
    var trimmedVal = rawVal.trim();
    if (trimmedVal.length === 0) {
        return false;
    } else {
        return trimmedVal;
    }
};

var notContainWhitespace = function(value) {
    if (/\s/.test(value)) {
        return false;
    }
    return true;
};

var isValidLength = function(value) {
    var enReg = /[x00-xff]/g;
    var zhReg = /[^x00-xff]/g; // [a-zA-Z0-9][\u4e00-\u9fa5]
    var length = 0;

    /* 计算长度 */
    length += value.match(enReg) && value.match(enReg).length;
    length += value.match(zhReg) && value.match(zhReg).length * 2;

    /* 控制台打印信息（测试） */
    if (value.match(enReg)) {
        console.log("英文字符长：" + value.match(enReg).length)
    }
    if (value.match(zhReg)) {
        console.log("中文字符长：" + value.match(zhReg).length * 2)
    }
    console.log("总长度为：" + length)
    console.log("----------")

    /* 判断长度是否合法 */
    if (length >= 4 && length <= 16) {
        return true;
    }
    return false;
};

var invalidStylish = function(information) {
    removeClassName(input, "valid");
    addClassName(input, "invalid");
    info.innerHTML = information;
};

var validStylish = function() {
    removeClassName(input, "invalid");
    addClassName(input, "valid");
    info.innerHTML = "用户名格式正确~";
};

var checkValue = function(rawVal) {
    var information = "";
    var val = isNotEmpty(rawVal);

    if (!val) {
        information = "用户名不能为空！";
    } else if (!notContainWhitespace(val)) {
        information = "用户名不能包含空格！";
    } else if (!isValidLength(val)) {
        information = "用户名长度要在 4 ~ 16 个字符内！";
    }

    if (information) {
        invalidStylish(information);
    } else { validStylish(); }
};

addEventHandler(verifyBtn, "click", function() {
    var rawVal = input.value;
    checkValue(rawVal);
});
