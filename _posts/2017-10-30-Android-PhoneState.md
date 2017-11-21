---
layout: post
title: Android-9种通话状态(精确)
tags: Android
---
参考文章:
http://blog.csdn.net/yaoming168/article/details/51986751   
http://blog.csdn.net/a34140974/article/details/50156193

## 一.介绍
	在应用层监听通话状态只有三种，从TelephonyManager.java中注释可知这三种状态含义如下：
		CALL_STATE_IDLE 空闲态(没有通话活动)
		CALL_STATE_RINGING 包括响铃、第三方来电等待
		CALL_STATE_OFFHOOK 包括dialing拨号中、active接通、hold挂起等
	由上可知，active接通状态没有单独给出，所以我们无法得知电话是否接通了，
	因此需要其它手段来获取更多的精确通话状态，遍查网络资料，一般有两种方法！
	
```java

public class TelephonyManager {
	/** Device call state: No activity. */
    public static final int CALL_STATE_IDLE = 0;
    /** Device call state: Ringing. A new call arrived and is
     *  ringing or waiting. In the latter case, another call is
     *  already active. */
    public static final int CALL_STATE_RINGING = 1;
    /** Device call state: Off-hook. At least one call exists
      * that is dialing, active, or on hold, and no calls are ringing
      * or waiting. */
    public static final int CALL_STATE_OFFHOOK = 2;
}

```

## 二.监听9种通话状态
### 法一.使用系统api监听
	条件: 
	1.需要权限android.permission.READ_PRECISE_PHONE_STATE、app打包时需要系统签名、安装在系统目录等	
	2.onPreciseCallStateChanged 精确通话回调api在android.jar中被hide了, 可以使用反射或没有被hide的android.jar解决

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
    public static final int PRECISE_CALL_STATE_IDLE =           0; //通话空闲
    public static final int PRECISE_CALL_STATE_ACTIVE =         1; //正在通话(活动中)
    public static final int PRECISE_CALL_STATE_HOLDING =        2; //通话挂起(例如我和多个人通话,其中一个通话在活动,而其它通话就会进入挂起状态)
    public static final int PRECISE_CALL_STATE_DIALING =        3; //拨号开始
    public static final int PRECISE_CALL_STATE_ALERTING =       4; //正在呼出(提醒对方接电话)
    public static final int PRECISE_CALL_STATE_INCOMING =       5; //对方来电
    public static final int PRECISE_CALL_STATE_WAITING =        6; //第三方来电等待(例如我正在和某人通话,而其他人打入时就会就进入等待状态)
    public static final int PRECISE_CALL_STATE_DISCONNECTED =   7; //挂断完成
    public static final int PRECISE_CALL_STATE_DISCONNECTING =  8; //正在挂断
}

```

### 法二.读取Logcat通信日志
	条件: 
	1.android 4.1以上需要root权限，android 4.1以下版本只需添加日志权限android.permission.READ_LOGS
	2.读取通信状态：在root状态下执行命令 logcat -v time -b radio
	
	logcat日志被划分为以下几个缓冲区
		-b <system, radio, events, main>
		main   — 主日志缓冲区(默认,普通app应用)
		radio  — 无线/电话相关日志缓冲区　　　
		events — 事件相关日志缓冲区
		system — 系统相关日志缓冲区

```java

//正则表达式，匹配通话状态
Pattern ptn = Pattern.compile("(\\d{2}\\-\\d{2}\\s\\d{2}\\:\\d{2}\\:\\d{2}\\.\\d{3}).*?GET_CURRENT_CALLS.*?,(\\w+),");
//Pattern ptn = Pattern.compile("(\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}\\.\\d{3}).*?qcril_qmi_voice_all_call_status_ind_hdlr:.call.state.(\\d),");

//使用Root权限，执行logcat命令
Process process = Runtime.getRuntime().exec("su");
PrintWriter pw = new PrintWriter(process.getOutputStream());
pw.println("logcat -v time -b radio"); //logcat命令, -v 详细时间; -b radio 通信相关日志缓冲区
pw.flush();

//循环读取通话日志
BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()));
String strLine;
while ((strLine = br.readLine()) != null) {		
	Matcher matcher = ptn.matcher(strLine);
	if (matcher.find()) {// 匹配结果	
		String time = matcher.group(1);  //提取通话时间
		String state = matcher.group(2); //提取通话状态
	}
}
pw.close();
br.close();
process.destroy();

```

## 三.图解9种通话状态
![PhoneStateCallState1](http://upload-images.jianshu.io/upload_images/1848363-ff711ffbca3106ec.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![PhoneStateCallState2](http://upload-images.jianshu.io/upload_images/1848363-f7bc0773e6ea2675.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
				
简书: http://www.jianshu.com/p/a362404f850f    
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/78395537     
GitHub博客: http://lioil.win/2017/10/30/Android-PhoneState.html    
Coding博客: http://c.lioil.win/2017/10/30/Android-PhoneState.html    