# IFE-2016-SP-task18

## My Solution

My solution to task18 is available on jsfiddle:
<script async src="//jsfiddle.net/baishusama/L81pe3r6/embed/"></script>

## Compared with others'

### [任务得分第一的团队的 solution](http://ife.baidu.com/review/detail?workId=2673)

##### AGAIN：事件绑定函数的兼容性 

```javascript
function addEvent(element, event, handler) {
    if (element.addEventListener) {
        element.addEventListener(event, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + event, handler);
    } else {
        element["on" + event] = handler;
    }
}
```

##### 将数据 queue 和与之相关的方法封装成了一个对象

> :/ 要挑刺的话，我觉得最好不要把 `queue` 对象内部的数据命名为 `str` 。  
> `str` 让人马上想到字符串而不是数组，而且 `paint` 方法内部的局部变量也名为 `str` 难免让人产生混淆（比如我读 `paint` 方法的相关代码的时候确实弄混了Orz）。

```javascript
//遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递，后面用
function each(arr, fn) {
    for (var cur = 0; cur < arr.length; cur++) {
        fn(arr[cur], cur);
    }
}
window.onload = function() {
    ...
    var queue = {
        queue: [],
        ...
        paint: function() {
            var str = "";
            each(this.queue, function(item){str += ("<div>" + parseInt(item) + "</div>")});
            queueWrapper.innerHTML = str;
            addDivDelEvent();
        },
        ...
    };
}
``` 

##### [`Array.prototype.splice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)

语法：`array.splice(start, deleteCount, item1ToAdd, item2ToAdd, ...)`

可以使用 `arr.splice(index, 1)` 来删除 `index` 位置上的数组元素（而不用像我那样使用 `filter` 方法）。

##### 循环绑定事件 & 闭包

```javascript
function addDivDelEvent() {
    for (var cur = 0; cur < queueWrapper.childNodes.length; cur++) {
        //这里要使用闭包，否则永远绑定到指定 div 上的 delete 函数的参数永远等于跳出时的 cur 值(length);
        addEvent(queueWrapper.childNodes[cur], "click", function(cur) {
            return function() {
                return queue.deleteID(cur)
            };
        }(cur));
    }
}
```

### [任务得分第二的团队的 solution](http://ife.baidu.com/review/detail?workId=2592)

##### `nodeName` VS `tagName`

[nodeName 和 tagName 的区别](http://blog.csdn.net/borishuai/article/details/5719227)

##### 定义简单的 `$` 函数来减少 `document.getElementXXX` 的输入（以偷懒 :P）

```javascript
var $ = function (id) {
    return document.getElementById(id);
};
```

##### 面向对象的封装（辑略复杂，加入 To Do 豪华午餐）

### [任务得分第三的团队的 solution](http://ife.baidu.com/review/detail?workId=2753)

##### AGAIN：定义简单的 `$` 函数来减少 `document.getElementXXX` 的输入（以偷懒 :P）

```javascript
$ = function (el) { return document.querySelector(el); };
```

##### 利用了数组的 `map` 和 `join` 方法，避开了不必要的循环

```javascript
function render() {
  $('#result').innerHTML =
    data.map(function(d) { return "<div>" + d + "</div>"; })
      .join('');
}
```

另外注意上面代码中的类似于 jQuery 中的**“链式”写法**的写法！

##### 通过 `[].slice` 和 `.call/.apply` 来使类数组也可以使用数组的方法 & 将 `[].方法名` 作为参数传入函数增强了代码复用

e.g. Line 36:`var args = [].slice.call(arguments, 2);`，其中 `arguments` 是函数 `deal` 的参数（类数组）。

##### 将四个按钮和队列中元素的五种点击事件抽象为了 `deal` 函数

##### `try/catch` 的合理使用

##### `parseInt()` 使得 `007` 这样的输入（变为 `7` ）

##### 通过 `[].indexOf` 和 `.call` 来得出当前节点是父元素的第几个子节点

```javascript
function getClickIndex(e) {
  var node = e.target;
  return [].indexOf.call(node.parentNode.children, node);
}
```

##### 小疏忽

> 1. 移除的逻辑没有队列为空的检验：最后弹窗为空时，点击“左侧出/右侧出”会弹出 `undefined` 。  
> 2. 从用户体验的角度考虑，对输入的字符串 `.trim()` 一下会比较好。
> 
> P.S. 内心 OS：看到这么简洁的代码真的忍不住想跪舔一下。打分的某位因为“缺注释、看不懂”等理由给了 5 分，而位列第三实在可惜。以及“五个非洲人”（一本正经的 Five-African）的队名，够我笑一个星期了XD。

## To Do

[ ] 理清[任务得分第二的团队的 solution](http://ife.baidu.com/review/detail?workId=2592)的逻辑（[JS代码](https://github.com/zp1996/ife-2016/blob/master/task_2_18/task_2_18.js)）

> P.S. 出于易读性的考虑，以上代码的命名和缩进可能有所修改。