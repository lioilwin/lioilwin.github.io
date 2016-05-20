---
layout: post
title: 系统状态栏背景
tags: Android
---

```xml

<LinearLayout 
    ······
	<!--系统状态栏背景-->
    android:background="@drawable/comon_title_bg"
	<!--系统状态栏适应自定义布局背景-->
    android:fitsSystemWindows="true"
	······
>
	
```

```java
	
// android4.4以上系统设置顶部撑到通知栏顶部
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
	// 透明状态栏
	getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
	// 透明导航栏
	getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
}

```