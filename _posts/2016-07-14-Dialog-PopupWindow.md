---
layout: post
title: 对话框自定义的3个方法
tags: Android
---

### 1、使用Activity实现

		在AndroidManifest.xml中修改Actity的主题android:theme="@style/MyDialogStyleBottom"
		<style name="MyDialogStyleBottom"> (注意不要继承系统Dialog主题，
											否则对话框match_parent无效以致对话框与屏幕边缘有缝隙)
			<!--无标题-->
			<item name="android:windowNoTitle">true</item>        
			<!--背景透明-->
			<item name="android:windowBackground">@android:color/transparent</item>     
			<item name="android:windowIsTranslucent">true</item>        
			<!--背景变暗-->
			<item name="android:backgroundDimEnabled">true</item>        
		</style>

### 2、使用Dialog实现

		View view = View.inflate(···自定义对话框布局···);
		Dialog dialog = new Dialog(···R.style.MyDialogStyleBottom···); (MyDialogStyleBottom不要继承系统Dialog主题)
		dialog.setContentView(view);		
		dialog.show();
		
### 3、使用PopupWindow实现

		View view = View.inflate(···自定义对话框布局···);
		PopupWindow p = new PopupWindow(view,···);
		p.set背景···		
		p.setLoaction···或p.setDropdown···(设置显示位置)；
		
