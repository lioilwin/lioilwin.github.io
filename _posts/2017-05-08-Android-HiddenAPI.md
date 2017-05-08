---
layout: post
title: 查看Android隐藏的API源码
tags: Android
---

## 介绍

在查看Android API源码时,Android.jar内部有大量@hide注解的代码,   
无论是用Eclipse还是Android Studio都会隐藏有@hide注解的代码!    
因此我们查看API源码会发现很多类找不到错误,如PhoneWindow，ActivityThread等都没有找到,我早期看API时就很恼火！   
这时只能去Android SDK源码目录搜索PhoneWindow.java来查看源码,非常不方便啊啊啊。。。   

## 解决办法两个

方法一.将SDK源码全部导入AS或Eclipse,依然麻烦,为了查看一两个API而导入上百M的代码很不划算！     

方法二.在万能的GitHub已有人去除Android.jar中@hide注解 
	地址: https://github.com/anggrayudi/android-hidden-api    
	1.下载对应API版本Android.jar   
	2.替换SDK/platforms/android-版本/Android.jar   
	3.重新打开IDE就可以查看   
	
方法二还有额外便利,就是可以直接使用隐藏API,不需要反射(浪费性能又麻烦又易写错)   
Android.jar并不会打包到APK,所以去除@hide的Android.jar,只是欺骗IDE/编译器,方便程序员查看使用！

例如,挂断电话API被隐藏了TelephonyManager.getDefault().endCall(),     
用正常Android.jar无法调用endCall(),只能通过反射调用;    
用去除@hide的Android.jar,就可直接调用endCall();  

直接调用隐藏API的缺点:   
	1.Android隐藏API是因为不能保证这些API还存在新系统版本,所以尽量少用隐藏API！  
	2.不利于团队合作,如果有人使用正常Android.jar就无法编译如endCall()之类的隐藏API！   

