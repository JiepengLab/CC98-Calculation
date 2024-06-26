# CC98风评汇总

因为最近 98 风评大战整整齐齐的，lz想做个脚本方便看看双方风评的理由和总数。然后头脑一热就做了这个脚本。这也是我人生第一次写脚本，希望各位批评指正。

## 效果

风评汇总将显示在所有的风评下方

## 下载地址

脚本发布于
[Greasy Fork](https://greasyfork.org/zh-CN/scripts/492534-%E9%A3%8E%E8%AF%84%E8%AE%A1%E7%AE%97) | [Github](https://github.com/JiepengLab/CC98-Calculation)

## 其他

### 下载油猴插件

如果没有下载过油猴插件，可以参考98里的[【学习天地】下载学在浙大课件的一种方法（油猴教程）]( https://www.cc98.org/topic/5410676) 进行下载

### 我没整好的地方

由于本人没搞懂98什么时候算加载完成页面，所以内部采用的都是延时。这个延时可根据实际情况修改。

```javascript
  // 监听页面加载完成事件
    window.addEventListener('load', function () {
        // 使用定时器等待页面加载，确保所有的元素都已经渲染完成
        flag = 0;
        var intervalId = setInterval(function () {
            let showAllButtons = document.querySelectorAll('button');
            showAllButtons.forEach(function (button) {
                if (button.textContent === '显示全部') {
                    button.click(); // 点击展开按钮
                }
            });
            let isAllExpanded = Array.from(showAllButtons).every(button => button.textContent !== '显示全部');
            if (isAllExpanded) {
                clearInterval(intervalId); // 停止定时器
                performCreditCalculation(); // 进行风评统计
            }
            if (flag) {
                let AllButtons = document.querySelectorAll('button');
                AllButtons.forEach(function (button) {
                    if (button.textContent === '收起') {
                        button.click(); // 恢复按钮原样
                    }
                });
            }
        }, 4000); // 增加定时器来等待页面加载
    });
```

最后这个就是表示我们等待页面加载好四秒后，进行风评的获取

> 为什么是页面加载好？因为发现98加载热评是慢于正常回帖的。一开始设置这个参数，设置小了，只能得到回帖的数据。

这里的4000以及最后的

```js
    // 监听点击事件，包括超链接的点击
    window.addEventListener('click', function (event) {
        // 检查点击的元素是否是超链接
        flag = 0;
        if (event.target && event.target.matches && event.target.matches('a.page-link')) {
            // 监听页面加载完成事件
            // 使用定时器等待页面加载，确保所有的元素都已经渲染完成
            var intervalId = setInterval(function () {
                let showAllButtons = document.querySelectorAll('button');
                showAllButtons.forEach(function (button) {
                    if (button.textContent === '显示全部') {
                        button.click(); // 点击展开按钮
                    }
                });
                let isAllExpanded = Array.from(showAllButtons).every(button => button.textContent !== '显示全部');
                if (isAllExpanded) {
                    clearInterval(intervalId); // 停止定时器
                    performCreditCalculation(); // 进行风评统计
                }
                if (flag) {
                    let AllButtons = document.querySelectorAll('button');
                    AllButtons.forEach(function (button) {
                        if (button.textContent === '收起') {
                            button.click(); // 恢复按钮原样
                        }
                    });
                }
            }, 1500); // 增加定时器来等待页面加载
        }
    });
```

1500（表示切换到下一页进行计算的事件为1.5s）都是可以根据实际情况进行修改的。

不过如果能监测到 98 完成加载那最好啦！

欢迎 pr！
