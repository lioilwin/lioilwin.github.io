---
layout: post
title: Android-电池优化Doze和Standby模式-AlarmManager失效
tags: Android
---
## 一.电池省电优化(Doze和App Standby模式)
	从Android6.0开始,系统提供了两种省电功能(延长电池寿命和使用时间):Doze和App Standby
	Doze和App Standby模式会延缓CPU和网络活动实现节能;
			
### 1.Doze模式
	1.进入Doze模式
		在手机未充电,完全静止且熄屏一段时间后,Android系统会自动进入Doze模式
		
	2.Doze模式效果
		1.网络访问被挂起
		2.Wake Locks被无视		
		3.AlarmManager被推迟到下一个maintenance window窗口,
		除非使用AlarmManager新方法: setAndAllowWhileIdle(),setExactAndAllowWhileIdle(),setAlarmClock()
		4.WiFi扫描被停止
		5.SyncAdapter同步工作被停止
		6.JobScheduler定时任务被停止
		
		Doze模式的五种状态
			ACTIVE:           活动状态
			INACTIVE:         屏幕关闭进入非活动状态
			IDLE_PENDING:     每隔30分钟让App进入预备状态
			IDLE:             空闲状态
			IDLE_MAINTENANCE：处理挂起任务		
		系统进入Doze模式后,每隔一段时间(30分钟)会有一小段时间(30s)供APP处理被挂起任务,
		但随着时间推移,间隔时间会变长,以此减少电量消耗
				
	3.退出Doze模式
		1.手机充电
		2.手机移动
		3.手机屏幕打开
		
### 2.App Standby模式
	1.进入App Standby模式
		长时间未被用户使用的App,将进入App Standby状态(被标志为空闲状态)
		
	2.退出App Standby模式
		1.用户主动启动该App
		2.该App有前台进程(前台activity/前台service),被其它前台进程启动
		3.该App在锁屏或通知栏有可见的Notification
		4.Android设备充电时,会将所有Standby状态的App释放,处理挂起任务
		5.如果App空闲时间很长,系统将允许App一天一次访问网络
		
	3.App Standby和Doze区别
	App Standby不需要屏幕关闭,App进入后台一段时间,网络也会受到限制
	Doze模式需要屏幕关闭(通常晚上睡觉或长时间屏幕关闭才会进入)
	
### 3.阻止电池优化(白名单)
	Android6.0及更高版本提供电池优化白名单,App加入白名单可逃脱Doze和App Standby限制,
	处于白名单中的App也会受到一定限制: Jobs和Syncs以及常规Alarms也会被推迟;
	
	用户手动设置App进入白名单: 设置>电池>电池优化白名单
	
	App检测是否在白名单: PowerManager.isIgnoringBatteryOptimizations()
	
	App请求加入白名单:
		1.通过创建Intent ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS  引导用户前往电池优化界面,加入白名单
		2.持有权限 REQUEST_IGNORE_BATTERY_OPTIMIZATIONS  可直接触发系统Dialog来提醒用户,加入白名单(无需进入设置界面)
		3.创建Intent ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS  触发上述系统Dialog
	
## 二.AlarmManager定时闹钟失效
	1.App被Kill后,AlarmManager失效(只有App进程在运行时,才会收到系统定时AlarmManager通知)
		添加守护进程,相互监听重启; 提醒用户加入锁屏清理白名单
	2.手机重启,AlarmManager任务失效
		监听重启广播,重新设置定时闹钟
	3.从Android4.4(API19)开始,AlarmManager机制修改,set(),setRepeating()定时不再精确,甚至setRepeating只生效一次(不会重复)
		新增精确定时方法: setExact(),setWindow(),setAlarmClock(),
	4.从Android6.0(API23)开始,进入Doze模式(省电优化),AlarmManager被延缓
		新增精确定时方法: setAndAllowWhileIdle(),setExactAndAllowWhileIdle()
	
	从Android4.4(API19)开始,新增精准定时方法都是一次性闹钟,没有重复定时的方法,
	所以当需要重复周期闹钟,只能在下一次唤醒时重新设置定时,间接实现重复闹钟！

	精确定时一次Demo如下:
	void setWakeAtTime(Context cxt, int delay) {
		PendingIntent pi = PendingIntent.getService(cxt,0,new Intent(cxt, xxService.class),PendingIntent.FLAG_UPDATE_CURRENT); 
        AlarmManager alarm = (AlarmManager) cxt.getSystemService(Context.ALARM_SERVICE);
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) //Android 6，针对省电优化
			alarm.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + delay, pi);
		else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) //Android 4.4，针对set不准确
			alarm.setExact(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + delay, pi);
		else
			alarm.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + delay, pi);   
    }

简书: http://www.jianshu.com/p/585ca251b871  
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/78848386  
GitHub博客: http://lioil.win/2017/12/19/Android-Alarm_Doze_Standby.html  
Coding博客: http://c.lioil.win/2017/12/19/Android-Alarm_Doze_Standby.html