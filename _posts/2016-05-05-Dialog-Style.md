---
layout: post
title: 对话框自定义的4种方法
tags: Android
---

## 1.使用AlertDialog实现
	new AlertDialog.Builder(this)
                .setView(R.layout.dialog)
                .show();
	// 不要使用setMessage,setPositive等等方法，最好用自定义布局控件
				
## 2.使用Dialog实现
	在values/styles.xml
	<style name="MyDialogStyleBottom">
		<!--出入动画-->
        <item name="android:windowAnimationStyle">@style/AnimBottom</item> 
		<!--悬浮-->
		<item name="android:windowIsFloating">true</item>
		<!--无标题-->
		<item name="android:windowNoTitle">true</item>
		<!--背景透明变暗-->
		<item name="android:windowBackground">@android:color/transparent</item>     
		<item name="android:windowIsTranslucent">true</item>
		<item name="android:backgroundDimEnabled">true</item>        
	</style>
	
	Dialog dialog = new Dialog(布局样式MyDialogStyleBottom);
	dialog.setContentView(布局);		
	dialog.show();
		
## 3.使用PopupWindow实现
	View v = View.inflate(布局);
	PopupWindow p = new PopupWindow(v);
	p.setBackground···	
	p.setLoaction···
	或p.setDropdown···(设置显示位置)；
				
## 4.使用Activity实现
	在AndroidManifest.xml中
	修改Actity主题android:theme="@style/MyDialogStyleBottom"
	
	
## 5.滑出滑入动画
	在values/styles.xml
		<style name="AnimBottom">
			<item name="android:windowEnterAnimation">@anim/push_bottom_in</item>
			<item name="android:windowExitAnimation">@anim/push_bottom_out</item>
		</style>

	在anim/push_bottom_in.xml
	滑入式动画
	<set>  
		<translate  
			android:duration="200"  
			android:fromYDelta="100%p"  
			android:toYDelta="0"/>        
	</set>  

	在anim/push_bottom_out.xml
	滑出式动画
	<set> 
		<translate  
			android:duration="200"  
			android:fromYDelta="0"  
			android:toYDelta="50%p" />  
	</set>  