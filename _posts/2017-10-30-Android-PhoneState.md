---
layout: post
title: Android-精确的9种通话状态
tags: Android
---
参考文章:
http://blog.csdn.net/yaoming168/article/details/51986751   
http://blog.csdn.net/a34140974/article/details/50156193

## 1.监听9种通话状态

```java

TelephonyManager telM = (TelephonyManager) getSystemService(TELEPHONY_SERVICE);
telM.listen(new PhoneStateListener(){
		/**
		 * 当有精确通话状态时回调
		 * Callback invoked when precise device call state changes
		 * @hide 隐藏api,给系统app使用的
		 */
		@Override
		public void onPreciseCallStateChanged(PreciseCallState callState) {
			//当有精确通话状态时回调
		}
	}, PhoneStateListener.LISTEN_PRECISE_CALL_STATE); //需要权限android.permission.READ_PRECISE_PHONE_STATE

// 精确的九大通话状态
public class PreciseCallState implements Parcelable {
    public static final int PRECISE_CALL_STATE_IDLE =           0;
    public static final int PRECISE_CALL_STATE_ACTIVE =         1;
    public static final int PRECISE_CALL_STATE_HOLDING =        2;
    public static final int PRECISE_CALL_STATE_DIALING =        3;
    public static final int PRECISE_CALL_STATE_ALERTING =       4;
    public static final int PRECISE_CALL_STATE_INCOMING =       5;
    public static final int PRECISE_CALL_STATE_WAITING =        6;
    public static final int PRECISE_CALL_STATE_DISCONNECTED =   7;
    public static final int PRECISE_CALL_STATE_DISCONNECTING =  8;
}

```

## 2.图解9种通话状态
![PhoneStateCallState1](http://upload-images.jianshu.io/upload_images/1848363-ff711ffbca3106ec.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![PhoneStateCallState2](http://upload-images.jianshu.io/upload_images/1848363-f7bc0773e6ea2675.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
				
简书: http://www.jianshu.com/p/a362404f850f    
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/78395537     
GitHub博客: http://lioil.win/2017/10/30/Android-PhoneState.html    
Coding博客: http://c.lioil.win/2017/10/30/Android-PhoneState.html    