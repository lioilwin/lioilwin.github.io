---
layout: post
title: Windows记事本UTF-8编码异常
tags: Windows
---

简书：http://www.jianshu.com/p/34b261d23998   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/77017377   
GitHub博客: http://lioil.win/2016/04/10/Windows-Notepad.html   
Coding博客: http://c.lioil.win/2016/04/10/Windows-Notepad.html

2016/04/10
今天真是气煞我也，这个Windows10的破记事本编辑器浪费我太多时间，亏我还是Win10脑残粉……

原本只想快速修改jekyll博客首页的Html文档，就用记事本打开，随便改改，改完不忘以UTF-8编码保存。
去预览博客首页，准备吃饭……

结果首页侧边栏布局全不见了了了……只留下极其丑陋的纯文本，中英文显示完全正常，就是网站识别出错……
改了半天还是没变，最后只好删除所有中文，以ANSI编码保存，预览博客完全正常……

以UTF-8编码保存博客就是显示异常，折腾一个多小时……
只好安装Notepad++，UTF-8编码的首页侧边栏终于恢复正常了……
对这破记事本的最后残恋终于破灭了……

2017/1/25追加:
UTF-8编码分为UTF-8和UTF-8-BOM两种, 
UTF-8-BOM只是在文件开头增加了0xef 0xbb 0xbf三个字节标识符号, 
Windows记事本编码UTF-8默认添加了BOM标识符, 
有些软件无法识别BOM标识符而出现乱码, 我估计jekyll博客也不能识别BOM！

