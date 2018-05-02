---
layout: post
title: Android-WakeLock(唤醒锁与CPU休眠/屏幕常亮)
tags: Android
---
参考：
https://blog.csdn.net/wh_19910525/article/details/8287202
http://landerlyoung.github.io/blog/2014/10/31/androidzhong-de-wakelockshi-yong/

## 一.使用
	PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
	PowerManager.WakeLock wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "MyTAG");
	wakeLock.acquire();
	
	在Manifest中添加如下权限
	<uses-permission android:name="android.permission.WAKE_LOCK" />

	WakeLock级别：
		PARTIAL_WAKE_LOCK       保持CPU运转，屏幕和键盘背光可能关闭
		SCREEN_DIM_WAKE_LOCK    保持CPU运转，保持屏幕常亮(亮度低)，键盘背光可能关闭
		SCREEN_BRIGHT_WAKE_LOCK 保持CPU运转，保持屏幕和键盘背光高亮
		FULL_WAKE_LOCK          保持CPU运转，保持屏幕和键盘背光高亮(亮度最高)
		
		ACQUIRE_CAUSES_WAKEUP            强制亮屏，针对一些必须通知用户的操作
		ON_AFTER_RELEASE                 当锁被释放时，保持亮屏一段时间(如果释放时屏幕没亮，则不会亮屏)
		PROXIMITY_SCREEN_OFF_WAKE_LOCK   和接近传感器配合,当用户接近屏幕时黑屏,离开时亮屏(例如打电话),该API在API21后开放,以前被hide
		
		保持屏幕长亮的WakeLock被建议弃用，系统推荐如下方法(当Activity或view可见时,屏幕才保持常亮)：
			在Activity.onCreate()中:  getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
			或在xml布局中: android:keepScreenOn="true"
			或对View设置:  view.setKeepScreenOn(true);
			
			FLAG_KEEP_SCREEN_ON实际就是一个SCREEN_BRIGHT_WAKE_LOCK级别的WakeLock
			创建和释放锁都由系统自动管理，更加方便和安全，在后面通过adb命令验证			
			
			屏幕相关的其它FLAG:
			WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD    解锁屏幕
			WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON      点亮屏幕
			WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED    屏幕锁定时也能显示
			WindowManager.LayoutParams.FLAG_ALLOW_LOCK_WHILE_SCREEN_ON   屏幕打开时允许锁屏
			
			屏幕锁屏和解锁(需要权限"android.permission.DISABLE_KEYGUARD")
			KeyguardManager keyguardManager = (KeyguardManager) context.getSystemService(KEYGUARD_SERVICE);
			KeyguardManager.KeyguardLock keyguardLock = keyguardManager.newKeyguardLock("unLock");			
			keyguardLock.reenableKeyguard(); // 锁屏
			//keyguardLock.disableKeyguard();// 解锁			

	!注意：
		如果申请partial wakelock,那么即使用户按Power键,系统也不会Sleep
		如果申请其它wakelocks,用户按Power键,系统还是会Sleep
		
	PowerManager方法
		boolean isScreenOn()       判断屏幕是否亮着,在API20被弃用,推荐isInteractive()
		void goToSleep(long time)  强制休眠(系统APP权限"android.permission.DEVICE_POWER",按下电源键锁屏时调用该方法)
		void wakeUp(long time)     强制唤醒(权限同上,按下电源键时调用该方法)
		void reboot(String reason) 重启手机(系统APP权限"android.permission.REBOOT"),参数:"recovery","fastboot"
		
	WakeLock方法:
		void acquire()              获得WakeLock，除非显式释放，否则不会解锁（经测试,APP进程被杀死后,锁会失效）
		void acquire(long timeOut)  当超过timeOut之后系统自动释放WakeLock
		void release()              释放WakeLock
		boolean isHeld()            是否已经获取WakeLock	
		void setReferenceCounted(boolean value) 是否使用引用计数(默认ture): 一个WakeLock调用acquire()多次,也必须release()多次才能释放,
		如果释放次数比acquire()多,则抛出异常: java.lang.RuntimeException: WakeLock under-locked MyTAG

## 二.原理
	通过adb命令查看WakeLock锁的个数:
	adb shell dumpsys power

	Wake Locks: size=4
		mLock:346803 PARTIAL_WAKE_LOCK         'MyTAG' ACQ=-1s175ms (uid=10201 pid=3862)
		mLock:141928 SCREEN_DIM_WAKE_LOCK      'MyTAG' ACQ=-1s174ms (uid=10201 pid=3862)
		mLock:402427 SCREEN_BRIGHT_WAKE_LOCK   'MyTAG' ACQ=-1s173ms (uid=10201 pid=3862)
		mLock:124789 SCREEN_BRIGHT_WAKE_LOCK   'WindowManager' ON_AFTER_RELEASE ACQ=-1s70ms (uid=1000 pid=1196 ws=WorkSource{10201})
	注：最后一个Lock是由FLAG_KEEP_SCREEN_ON创建的，由系统用户进程管理(uid=1000是系统用户)	 
	  
	在创建了 PowerManager.WakeLock 后，有两种机制，第一种是不计数锁机制，另一种是计数锁机制。
	可以通过 setReferenceCounted(boolean value) 来指定，一般默认为计数机制。
	这两种机制的区别在于，前者无论 acquire() 了多少次，只要通过一次 release()即可解锁。
	而后者正真解锁是在（ --count == 0 ）的时候，同样当 (count == 0) 的时候才会去申请加锁。
	所以 PowerManager.WakeLock 的计数机制并不是正真意义上的对每次请求进行申请／释放每一把锁，
	它只是对同一把锁被申请／释放的次数进行了统计，然后再去操作。
	
	Wakelock框架的大致流程：
		1).应用层  /frameworks/base/core/java/android/os/PowerManager.java
		WakeLock.acquire() -> PowerManagerService.acquireWakeLock()
		
		2).frameworks层  /frameworks/base/services/java/com/android/server/PowerManagerService.java
		管理所有APP申请的wakelock,比如音视、频播放器、camera等		
		static final String PARTIAL_NAME ="PowerManagerService";
		public static native void nativeAcquireWakeLock(int lock, String id);		
		nativeAcquireWakeLock(PARTIAL_WAKE_LOCK_ID, PARTIAL_NAME);
		
		3).JNI层 /frameworks/base/core/jni/android_os_Power.cpp
		static void acquireWakeLock(JNIEnv *env, jobject clazz,  jint lock, jstring idObj){
			...
			const char *id = env->GetStringUTFChars(idObj, NULL);
			acquire_wake_lock(lock, id);
			env->ReleaseStringUTFChars(idObj, id);
		}
	 
		4).kernel层 /hardware/libhardware_legacy/power/power.c		
		int acquire_wake_lock(int lock, const char* id){
			...
			return write(fd, id, strlen(id));
		}
		fd是文件描述符: "/sys/power/wake_lock"
		id是从frameworks层传来的参数: "PowerManagerService"  
			
简书: https://www.jianshu.com/p/2cfd179ef8dc   
CSDN: https://blog.csdn.net/qq_32115439/article/details/80169222   
GitHub博客: http://lioil.win/2018/05/02/Android-WakeLock.html   
Coding博客: http://c.lioil.win/2018/05/02/Android-WakeLock.html