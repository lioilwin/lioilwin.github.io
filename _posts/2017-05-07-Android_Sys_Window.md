---
layout: post
title: Android-系统悬浮窗
tags: Android
---
```java

	WindowManager.LayoutParams params = new WindowManager.LayoutParams();
	params.height = WindowManager.LayoutParams.WRAP_CONTENT;
	params.width = WindowManager.LayoutParams.WRAP_CONTENT;

	params.type = WindowManager.LayoutParams.TYPE_TOAST;
	// params.type = WindowManager.LayoutParams.TYPE_SYSTEM_ALERT;
	// params.type = WindowManager.LayoutParams.TYPE_SYSTEM_OVERLAY;
	// params.type = WindowManager.LayoutParams.TYPE_SYSTEM_ERROR;
	// params.type = WindowManager.LayoutParams.TYPE_PRIORITY_PHONE;        

	params.flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
	WindowManager wm = getWindowManager(); // Activity
	// wm = (WindowManager) getSystemService(WINDOW_SERVICE); // Service
	wm.addView(View.inflate(this, R.layout.item, null), params);

```

	1.在Android6.0以后要加权限
	<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
	没加权限会出现permission denied for this window type错误崩溃

	2.当params.type = TYPE_TOAST 时
	在Android4.4(API19)以下,无法触摸点击事件,
	因为在API19以前会默认添加FLAG_NOT_TOUCHABLE,使得悬浮窗无法触摸点击！

	3.当params.type = TYPE_SYSTEM_OVERLAY 时
	悬浮窗没有触摸点击事件,应该也是默认添加FLAG_NOT_TOUCHABLE

	3.小米手机默认会关闭APP悬浮窗权限,需要用户手动设置开启APP权限！

简书: http://www.jianshu.com/p/3653181a5c66   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/71379941   
GitHub博客：http://lioil.win/2017/05/07/Android_Sys_Window.html
Coding博客：http://c.lioil.win/2017/05/07/Android_Sys_Window.html