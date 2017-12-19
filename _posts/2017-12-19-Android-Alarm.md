---
layout: post
title: Android-闹钟-AlarmManager-后台服务
tags: Android
---
Standby Doze

API19开始AlarmManager机制修改
应用程序被Kill掉后,设置的闹钟不响
6.0以上进入Doze模式会使JobScheduler停止工作
手机设置重启后，闹钟失效问题

PendingIntent pi = PendingIntent.getxxx;
AlarmManager alarm = (AlarmManager) cxt.getSystemService(Context.ALARM_SERVICE);
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) //Android 6，针对省电优化Doze模式
	alarm.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + delay, pi);
else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) //Android 4.4，针对set不准确
	alarm.setExact(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + delay, pi);
else
	alarm.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + delay, pi);
	

http://www.jianshu.com/p/1f919c6eeff6
	http://blog.csdn.net/qq284565035/article/details/51705341

简书: http://www.jianshu.com/p/585ca251b871  
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/78848386  
GitHub博客: http://lioil.win/2017/12/19/Android-Alarm.html  
Coding博客: http://c.lioil.win/2017/12/19/Android-Alarm.html