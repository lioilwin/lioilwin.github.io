---
layout: post
title: Android Widget桌面应用小部件
tags: Android
---
官方文档中国版: https://developer.android.google.cn/guide/topics/appwidgets/index.html   
这个网站是谷歌2016年底为中国开发者提供中国版,方便访问！

# 一.介绍
	Android Widget是桌面应用小部件,可嵌入桌面,并可周期性更新Widget界面！     
	例如在桌面的天气,日历类小工具就是Widget部件！
	
# 二.创建Widget广播接收器

```java

public class ExampleAppWidgetProvider extends AppWidgetProvider {
	// onEnabled(Context) 		  widget可用触发
	// onDisabled(Context)  	  widget不可用触发
	// onDeleted(Context, int[])  widget被删除触发
	
	// widget更新触发
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {  
        final int N = appWidgetIds.length;  
        // Perform this loop procedure for each App Widget that belongs to this provider  
        for (int i=0; i<N; i++) {  
            int appWidgetId = appWidgetIds[i];
			
            // Create an Intent to launch ExampleActivity  
            Intent intent = new Intent(context, ExampleActivity.class);  
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, 0);
			
            // Get the layout for the App Widget and attach an on-click listener  
            // to the button  
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.appwidget_provider_layout);  
            views.setOnClickPendingIntent(R.id.button, pendingIntent);  
  
            // Tell the AppWidgetManager to perform an update on the current app widget  
            appWidgetManager.updateAppWidget(appWidgetId, views);  
        }  
    }
	
	@Override  
    public void onReceive(Context context, Intent intent) {  
        AppWidgetManager mgr = AppWidgetManager.getInstance(context);  
		if (intent.getAction().equals(TOAST_ACTION)) {  
            int appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID,  
                AppWidgetManager.INVALID_APPWIDGET_ID);  
            int viewIndex = intent.getIntExtra(EXTRA_ITEM, 0);  
            Toast.makeText(context, "Touched view " + viewIndex, Toast.LENGTH_SHORT).show();  
        }  
        super.onReceive(context, intent);		
		// Intent意图:
		// ACTION_APPWIDGET_UPDATE //处理更新
		// ACTION_APPWIDGET_DELETED // 处理删除
		// ACTION_APPWIDGET_ENABLED //可用
		// ACTION_APPWIDGET_DISABLED //不可用
		// ACTION_APPWIDGET_OPTIONS_CHANGED // 配置改变
    }
}

```
	
# 三.创建Widget基本信息(如布局等)
	1.在AndroidManifest.xml中
	<receiver android:name="ExampleAppWidgetProvider" >  
		<intent-filter>  
			<action android:name="android.appwidget.action.APPWIDGET_UPDATE" />  
		</intent-filter>  
		<meta-data android:name="android.appwidget.provider"  
				   android:resource="@xml/widget_info" /> xml定义Widget基本信息(如布局等)
	</receiver>
	
	2.在res/xml/widget_info.xml中
	<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"  
		android:minWidth="40dp"  
		android:minHeight="40dp"  
		android:updatePeriodMillis="86400000"  设置widget更新周期, 周期发广播调用AppWidgetProvider.onUpdate()
		android:previewImage="@drawable/preview"  设置widget预览图标,如不设置,默认是APP图标
		android:initialLayout="@layout/example_appwidget"  设置Widget布局界面
		android:configure="com.example.android.ExampleAppWidgetConfigure"   
		android:resizeMode="horizontal|vertical"  设置一个部件resizeable水平方向和垂直方向
		android:widgetCategory="home_screen|keyguard"  决定widget是否可以显示在主屏幕,锁屏
		android:initialKeyguardLayout="@layout/example_keyguard">  定义锁屏应用小部件的布局
	</appwidget-provider>

	3.widget布局xml
	<FrameLayout
	  android:layout_width="match_parent"
	  android:layout_height="match_parent"
	  android:padding="@dimen/widget_margin">
		.........
	  <LinearLayout
		android:layout_width="match_parent"
		android:layout_height="match_parent"
		android:orientation="horizontal"
		android:background="@drawable/my_widget_background">
		........
	  </LinearLayout>
	</FrameLayout>