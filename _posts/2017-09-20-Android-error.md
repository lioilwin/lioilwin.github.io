---
layout: post
title: Android-易错点归纳
tags: Android
---
## 1.在Service中启动Activity/Dialog的问题
	在Service中启动startActivity会出现异常: 
	android.util.AndroidRuntimeException: Calling startActivity() from outside of an Activity
	context requires the FLAG_ACTIVITY_NEW_TASK flag
	
	// 1.在Service中启动Activity，必须新建ACTIVITY的任务栈TASK，用以区分其它APP的任务栈
	Intent intent = new Intent(getApplicationContext(), XXActivity.class);   
	intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);   
	startActivity(intent);
	
	// 2.在Service中使用Dialog等弹窗/对话框，必须使用系统窗体SYSTEM-Window，悬浮在桌面或其它APP之上
	添加权限: <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
	// 系统弹窗一
	WindowManager.LayoutParams params = new WindowManager.LayoutParams();
	params.height = WindowManager.LayoutParams.WRAP_CONTENT;
	params.width = WindowManager.LayoutParams.WRAP_CONTENT;
	params.type = WindowManager.LayoutParams.TYPE_SYSTEM_ALERT; // 设置系统弹窗
	params.flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE;
	wm = (WindowManager) getSystemService(WINDOW_SERVICE);
	wm.addView(View.inflate(this, R.layout.item, null), params);
	
	// 系统弹窗二
	AlertDialog.Builder builder = new AlertDialog.Builder(this);
	AlertDialog dialog = builder.create();
	// Dialog dialog = new Dialog(this);
	dialog.getWindow().setType(WindowManager.LayoutParams.TYPE_SYSTEM_ALERT); // 设置系统弹窗
	
	为什么在Service中限制Activity/Dialog启动？
	因为当一个APP只有Service在运行(此时该APP没有任何UI显示),
	如果这个Service启动UI(Activity/Dialog),而用户在使用其它APP的UI,这会严重影响用户体验！

	
简书: http://www.jianshu.com/p/aa6bff36b12b    
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/78047091     
GitHub博客: http://lioil.win/2017/09/20/Android-error.html    
Coding博客: http://c.lioil.win/2017/09/20/Android-error.html    