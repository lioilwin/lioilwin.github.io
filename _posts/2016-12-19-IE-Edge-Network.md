---
layout: post
title: (转)Win10的IE和Edge无法上网
tags: Windows
---

网银不支持最新版的chrome，只好用IE！ 
可恶啊，突然发现IE和Edge浏览器不能上网了，但是其他浏览器如chrome都可以，其它软件都正常。 
使用IE修复出现的提示：远程计算机或设备将不接受连接这个问题！ 
网上相关答案都没用：启用WINS的NETBIOS、允许远程访问、取消代理，完全没效果！

最后的解决办法来源：http://blog.csdn.net/dddxxxx/article/details/52753671#reply 

1.win+r –> 输入regedit 打开注册表 

2.查找Internet Settings（在HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings） 

3.删除Internet Settings下的Connection文件夹 

4.重启IE，完美解决问题
