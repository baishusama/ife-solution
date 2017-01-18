[About IFE-2016-SP-task35]().

## textarea 避开监听滚动事件来实现同步滚动行号

### 思路

在一个设置了 `overflow-y: scroll;` 的父级 `div` 中，正常情况下，两个同级的并排的 div 能够在父元素中，同步地上下滚动。

所以我们需使 `textarea` 具有和 `div` 一样的特性——能够根据所包含的文字内容的高度，自动地变化自己的高度。

#### textarea 高度自适应的问题 - 法一

> **参考**
> [Autosizing textarea using Prototype @SO](http://stackoverflow.com/questions/7477/autosizing-textarea-using-prototype) 提问中 Jan Miksovsky 的回答，以及回答下面的评论提出的一些修改意见。

可以查看 [`jsfiddle` 上的在线 demo]()。

这个解决方法 **棒** 在更多地依赖 HTML 和 CSS，而不是 JS 。

但是也存在 **缺点** ：在最后一行进行回车的时候，高度会有波动，而不是直接一步到位。

**原因** 在于，本例中，`textarea` 的高度是 `height: 100%;` 依赖于父元素的高度，而父元素的高度依赖于 `div#textCopy` 的高度。

在最后一行进行回车的时候，`textarea` 的文字内容的最下方会增高一行，此时父元素高度不变，即 `textarea` 的高度不变，默认地 `textarea` 内容高度大于元素本身高度、第一行的内容将上移并被遮挡。而回车触发了 `keydown/keyup` 事件，回车被 JS 中定义的 `autoSize()` 转换成了 `<br/>` 并传给了 `div#textCopy` ，`div#textCopy` 的高度由此变高，父元素和 `textarea` 的高度也相应变高。第一行的内容也就由此能够避免被遮挡的命运了。

#### textarea 高度自适应的问题 - 其它方法

> 其它待读的相关资料：
> [Creating a textarea with auto-resize](https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize)
> 
> 可以适当参考其它成熟实现：
> [babeljs.io](https://babeljs.io/repl/)

### 小结

由于目前需要实现的并不是多么完备成熟的文本编辑器（需求详见 task35 任务说明），本次实现的文本编辑器还存在有待改进之处。

比如：
1. 没有考虑到，当输入一行很长的代码，且不换行的情况下，行号间应该存在空隔。
2. 当输入行数很多的情况下，数字很大的行号的样式问题。
3. 除了键盘输入外的其他输入方式（鼠标右键复制等）。