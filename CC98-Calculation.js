// ==UserScript==
// @name         风评计算
// @namespace    https://note.jiepeng.tech
// @version      2024-04-14
// @description  计算CC98的风评并在展开按钮点击时进行统计
// @author       ColdInk杰
// @match        https://www.cc98.org/*
// @match        www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @icon         https://www.cc98.org/static/images/心灵头像.gif
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("风评计算中...")

    // 插入可视化信息
    function insertVisualizedInfo(reply, positiveCreditsCount, negativeCreditsCount, positiveCreditsReasons, negativeCreditsReasons) {
        let visualizationDiv = document.createElement('div');
        visualizationDiv.style.border = '1px solid #ddd';
        visualizationDiv.style.padding = '10px';
        visualizationDiv.style.margin = '10px 0';
        visualizationDiv.style.backgroundColor = '#f9f9f9';

        // 风评值加的个数
        visualizationDiv.innerHTML += "<b>风评值加的个数:</b> " + positiveCreditsCount + "<br>";

        // 风评值加的理由
        visualizationDiv.innerHTML += "<b>对应的风评值加的理由:</b><br>";
        Object.keys(positiveCreditsReasons).forEach(function (reason, index) {
            visualizationDiv.innerHTML += (index + 1) + ". " + reason + " 出现 " + positiveCreditsReasons[reason] + " 次<br>";
        });

        // 风评值减的个数
        visualizationDiv.innerHTML += "<br><b>风评值减的个数:</b> " + negativeCreditsCount + "<br>";

        // 风评值减的理由
        visualizationDiv.innerHTML += "<b>对应的风评值减的理由:</b><br>";
        Object.keys(negativeCreditsReasons).forEach(function (reason, index) {
            visualizationDiv.innerHTML += (index + 1) + ". " + reason + " 出现 " + negativeCreditsReasons[reason] + " 次<br>";
        });

        // 找到对应的awardInfo类并插入可视化信息
        let awardInfoElement = reply.querySelector('.awardInfo');
        if (awardInfoElement) {
            awardInfoElement.parentNode.insertBefore(visualizationDiv, awardInfoElement.nextSibling);
        }
    }


    let flag = 0;

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

    // 点击展开按钮时进行风评统计
    function performCreditCalculation() {
        let replies = document.querySelectorAll('.reply');

        replies.forEach(function (reply) {

            for (let i = 0; i < reply.children.length; i++) {
                console.log(reply.id);
            }

            let creditElements = reply.querySelectorAll('.grades');
            console.log(creditElements);
            // 统计每个回复中风评值加和风评值减的个数以及对应的理由
            let positiveCreditsCount = 0;
            let negativeCreditsCount = 0;
            let positiveCreditsReasons = {};
            let negativeCreditsReasons = {};

            creditElements.forEach(function (element) {
                let creditChange = element.innerText;
                let creditReason = element.nextElementSibling.innerText;

                if (creditChange.includes('+')) {
                    positiveCreditsCount++;
                    if (positiveCreditsReasons[creditReason]) {
                        positiveCreditsReasons[creditReason]++;
                    } else {
                        positiveCreditsReasons[creditReason] = 1;
                    }
                } else if (creditChange.includes('-')) {
                    negativeCreditsCount++;
                    if (negativeCreditsReasons[creditReason]) {
                        negativeCreditsReasons[creditReason]++;
                    } else {
                        negativeCreditsReasons[creditReason] = 1;
                    }
                }
            });

            if (positiveCreditsCount > 0 || negativeCreditsCount > 0) {

                // 输出统计结果
                //console.log("用户: " + userName);
                console.log("风评值加的个数: " + positiveCreditsCount);
                console.log("对应的风评值加的理由:");
                Object.keys(positiveCreditsReasons).forEach(function (reason, index) {
                    console.log((index + 1) + ". " + reason + " 出现 " + positiveCreditsReasons[reason] + " 次");
                });
                console.log("风评值减的个数: " + negativeCreditsCount);
                console.log("对应的风评值减的理由:");
                Object.keys(negativeCreditsReasons).forEach(function (reason, index) {
                    console.log((index + 1) + ". " + reason + " 出现 " + negativeCreditsReasons[reason] + " 次");
                });
                console.log("\n");

                insertVisualizedInfo(reply, positiveCreditsCount, negativeCreditsCount, positiveCreditsReasons, negativeCreditsReasons);
                flag = 1;
            }
        });
    }


    // 如果页面包含hash跳转，也需要执行风评统计
    window.addEventListener('hashchange', function () {
        // 这里可以再次调用 performCreditCalculation 函数
        flag = 0;
        performCreditCalculation();
    });

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

})();