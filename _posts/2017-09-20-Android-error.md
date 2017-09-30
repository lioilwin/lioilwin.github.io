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
	
## 2.ListView属性总结
	1.stackFromBottom
		ListView和GridView从底部开始显示数据项
		<ListView		   
			android:stackFromBottom="true"/>
			
	2.transcriptMode
		在ListView添加新项时,是否自动滑动到底部,显示最新项
		disabled: 取消transcriptMode模式，默认的 
		normal: 只有最后一个选项已经显示在屏幕时,才自动滑动到底部
		alwaysScroll: 列表总会自动滑动到底部,显示最新项
		<ListView	
			android:transcriptMode="alwaysScroll" />
	
	3.cacheColorHint
		设置ListView背景时,还应该设置cacheColorHint为"#00000000"(透明),
		否则在滑动或点击时,列表颜色可能会出现变黑等异常情况!
		<ListView	
			android:background="@color/white"
			android:cacheColorHint="#00000000"/>	 

	4.divider
		设置列表项之间设置分割线(颜色或图片)
		取消分割线: android:divider="@null"
		<ListView
			android:divider="@drawable/driver"/>  

	5.fadingEdge
		设置列表周边阴影
		取消阴影: android:fadingEdge="none"
		<ListView
			android:cacheColorHint="#000000ff"
			android:fadingEdge="vertical"    
			android:fadingEdgeLength="40dp"/>   

	6.scrollbars
		设置listView的滚动条
		android:scrollbars="none"

	7.fadeScrollbars
		设置该属性为true,实现滚动条自动隐藏和显示 
		android:fadeScrollbars="true" 

	8.fastScrollEnabled
		启用ListView快速滚动滑块,能快速滑动列表,但是在数据较小时不会显示快速滚动滑块,
		可以在ListView或GridView等子类中使用快速滚动辅助!
		android:fastScrollEnabled="true"
		setFastScrollEnabled(true);
	
	9.listSelector
		在列表中按下选中时效果
		<ListView
			android:listSelector="@drawable/xxx" />
		
	10.drawSelectorOnTop
		设置为true, 点击时,listSelector内容会在被选项之上,被选项内容被遮住;
		设置为false,点击时,listSelector内容会在被选项之下,成为背景
		<ListView
			android:drawSelectorOnTop="true" />
			
	11.choiceMode
		定义列表的选择行为
		none：默认,列表不选择
		singleChoice：列表允许选择一个 
		multipleChoice：列表允许选择多个
		<ListView
			android:choiceMode="multipleChoice" />
				
简书: http://www.jianshu.com/p/aa6bff36b12b    
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/78047091     
GitHub博客: http://lioil.win/2017/09/20/Android-error.html    
Coding博客: http://c.lioil.win/2017/09/20/Android-error.html    