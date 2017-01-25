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
var verifyBtn = $("#verify");
var nameDOM = $("#name");
var pwdDOM = $("#pwd");
var repeatPwdDOM = $("#repeatPwd");
var emailDOM = $("#email");
var mobileDOM = $("#mobile");
// var infoDOM = nameDOM.nextElementSibling;

/* Valiables */
var cases = {
    "isEmpty": "不能为空！",
    "containWhiteSpace": "不能包含空格！",
    "invalidChar": "只能由数字、字母、特殊符号组成！",
    "invalidLength": "长度要在 4 ~ 16 个字符内！",
    "unconsistentWithPwd": "需要和第一次输入的密码一致！",
    "invalideMobileNumber": "号码非法！需为 11 位数字。",
    "invalideEmail": "格式非法！需为 example@eg.eg 格式。"
};

/* Functions */
var isNotEmpty = function() {
    console.log("In isNotEmpty, target : ")
    console.log(this)
    var trimmedVal = this.value.trim();
    if (trimmedVal.length === 0) {
        throw {
            "name": "isEmpty",
            "message": cases["isEmpty"],
            "target": this
        };
        // return false;
    } else {
        return trimmedVal;
    }
};

var notContainWhitespace = function(value) {
    var value = value || this.value;
    if (/\s/.test(value)) {
        throw {
            "name": "containWhiteSpace",
            "message": cases["containWhiteSpace"],
            "target": this
        };
        // return false;
    }
    return true;
};

var isValidLength = function(value) {
    var value = value || this.value;

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

    throw {
        "name": "invalidLength",
        "message": cases["invalidLength"],
        "target": this
    };
    // return false;
};

// 合法字符仅限于 ASCII 0~128
var isValidChar = function(value) {
    var value = value || this.value;
    for (var i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 128 || value.charCodeAt(i) < 0) {
            throw {
                "name": "invalidChar",
                "message": cases["invalidChar"],
                "target": this
            };
            break;
        }
    }
    return true;
};

// 密码确认需和密码输入一致
var isConsistentWithPwd = function() {
    if (this.value !== pwdDOM.value) {
        throw {
            "name": "unconsistentWithPwd",
            "message": cases["unconsistentWithPwd"],
            "target": this
        };
    }
    return true;
};

var invalidStylish = function(information) {
    removeClassName(this, "valid");
    addClassName(this, "invalid");
    this.nextElementSibling.innerHTML = information;
};

var validStylish = function(information) {
    removeClassName(this, "invalid");
    addClassName(this, "valid");
    this.nextElementSibling.innerHTML = information;
};

// 邮箱需为 example@eg.eg 格式
var isValidEmail = function(value) {
    var value = value || this.value;
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
        return true;
    } else {
        throw {
            "name": "invalideEmail",
            "message": cases["invalideEmail"],
            "target": this
        };
    }
};

// 手机号码需为 11 位数字
var isElevenNumbers = function(value) {
    var value = value || this.value;
    if (/^\d{11}$/.test(value)) {
        return true;
    } else {
        throw {
            "name": "invalideMobileNumber",
            "message": cases["invalideMobileNumber"],
            "target": this
        };
    }
};

var checkValue = function(checkFunc) {
    return function() {
        var information = "";
        try {
            checkFunc.call(this);
            validStylish.call(this, this.previousElementSibling.innerText + "格式正确~");
            return true;
        } catch (e) {
            information = e.target.previousElementSibling.innerText + e.message;
            invalidStylish.call(e.target, information);
        }
    };
};

/* 用户名 */

var checkName = checkValue(function() {
    var val = isNotEmpty.call(this);
    notContainWhitespace.call(this, val);
    isValidLength.call(this, val);
});

addEventHandler(nameDOM, "blur", function() {
    checkName.call(this);
});

/* 密码 */

var checkPwd = checkValue(function() {
    isNotEmpty.call(this);
    isValidChar.call(this);
    isValidLength.call(this);
});

addEventHandler(pwdDOM, "blur", function() {
    checkPwd.call(this);
});

/* 密码确认 */

var checkRepeatPwd = checkValue(function() {
    isNotEmpty.call(this);
    isConsistentWithPwd.call(this);
});

addEventHandler(repeatPwdDOM, "blur", function() {
    checkRepeatPwd.call(this);
});

/* 手机 */

var checkMobile = checkValue(function() {
    var val = isNotEmpty.call(this);
    isElevenNumbers.call(this, val);
});

addEventHandler(mobileDOM, "blur", function() {
    checkMobile.call(this);
});

/* 邮箱 */

var checkEmail = checkValue(function() {
    var val = isNotEmpty.call(this);
    isValidEmail.call(this, val);
});

addEventHandler(emailDOM, "blur", function() {
    checkEmail.call(this);
});

/* “提交”按钮 */

addEventHandler(verifyBtn, "click", function() {
    var rawVal = nameDOM.value;
    if (checkName.call(nameDOM) && checkPwd.call(pwdDOM) && checkRepeatPwd.call(repeatPwdDOM) && checkEmail.call(emailDOM) && checkMobile.call(mobileDOM)) {
        alert("提交（验证)成功！");
    } else {
        alert("请按提示输入正确的信息后，再提交。");
    }
});
