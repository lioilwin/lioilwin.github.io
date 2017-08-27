---
layout: post
title: Android-设备管理器Device Administration
tags: Android
---
官方文档中国版: https://developer.android.google.cn/guide/topics/admin/device-admin.html   
这个网站是谷歌2016年底为中国开发者提供中国版,方便访问！

# 一.介绍
	Android设备管理API来为方便企业应用控制员工!
	一个APP激活了设备管理后,APP不可卸载(必须取消激活才能卸载),
	可锁屏/自动锁屏/重置锁屏密码/禁用相机/擦除SD卡数据/恢复出厂等等,权限非常高！
	
# 二.设备管理策略
	立即锁屏 Lock device immediately
	锁屏前的不活动时间 Maximum inactivity time lock	
	指定存储区域加密 Require storage encryption	
	擦拭数据(恢复出厂) Wipe the device's data	
	禁用相机 Disable camera
	
	开启手机PIN或密码 Password enabled
	密码最小长度 Minimum password length
	密码是字母数字 Alphanumeric password required
	密码必须是字母数字符号混合 Complex password required	
	密码有效期 Password expiration timeout
	密码失败次数 Maximum failed password attempts	
	
# 三.创建设备管理APP步骤
	DeviceAdminReceiver	用于接收系统发送的原始意向动作
	DevicePolicyManager 用于设备管理策略类
	DeviceAdminInfo	 用于指定设备管理员组件的元数据
	
## 1.创建广播接收receiver类
	1.1创建 MyReceiver 类,必须继承DeviceAdminReceiver类
	public class MyReceiver extends DeviceAdminReceiver {		
		@Override
		public void onEnabled(Context context, Intent intent) {
			//设备管理可用
		}

		@Override
		public void onDisabled(Context context, Intent intent) {
			//设备管理不可用
		}

		@Override
		public void onPasswordChanged(Context context, Intent intent) {		
		}
		...
	}
	
	1.2在AndroidManifest.xml
	<receiver 
			android:name=".MyReceiver"
			android:label="用户可看的权限标题"
			android:description="用户可看的权限描述"
			android:permission="android.permission.BIND_DEVICE_ADMIN"> 
			必须拥有的权限,确保只有系统可以与DeviceAdminReceiver子类交互
		<meta-data
				android:name="android.app.device_admin"
				android:resource="@xml/device_xxx" />
				
		<intent-filter>
			<action android:name="android.app.action.DEVICE_ADMIN_ENABLED" />
			当用户启用设备管理员APP时,将DeviceAdminReceiver子类设置为接收器
		</intent-filter>		
	</receiver>
	
	1.3在res/xml/device_xxx.xml
	在xml中声明APP需要的设备管理策略,如密码,锁屏,擦除数据,加密等等
	<device-admin xmlns:android="http://schemas.android.com/apk/res/android">
	  <uses-policies>
		<limit-password />
		<watch-login />
		<reset-password />
		<force-lock />
		<wipe-data />
		<expire-password />
		<encrypted-storage />
		<disable-camera />
	  </uses-policies>
	</device-admin>

## 2.激活APP设备管理		
	ComponentName myReceiverName = new ComponentName(this,MyReceiver.class);	
	Intent intent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);	
	intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, myReceiverName);
	intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION,"给用户介绍文字");
	startActivity(intent);
	
## 3.锁屏/禁用相机/擦除SD卡数据/恢复出厂
	DevicePolicyManager dpm = (DevicePolicyManager) getSystemService(DEVICE_POLICY_SERVICE);
	ComponentName myReceiverName = new ComponentName(this,MyReceiver.class);
	// 2.锁屏/擦除数据/	
	if(dpm.isAdminActive(myReceiverName)){	//是否激活APP设备管理
		// 立刻锁屏
		dpm.lockNow();			
		// 设置自动锁屏,不活动时间
		dpm.setMaximumTimeToLock(myReceiverName, timeMs);		
		// 重置锁屏密码		
		dpm.resetPassword("123456", 0);
		
		// 禁用相机
		dpm.setCameraDisabled(myReceiverName, false);
		
		// 擦除SD卡数据
		//dpm.wipeData(DevicePolicyManager.WIPE_EXTERNAL_STORAGE);
		
		// 恢复出厂
		//dpm.wipeData(0);
	}else{
		Toast.makeText(this, "还没有激活APP设备管理", 0).show();
	}
	
## 4.取消APP设备管理,卸载APP
	DevicePolicyManager dpm = (DevicePolicyManager) getSystemService(DEVICE_POLICY_SERVICE);
	ComponentName myReceiverName = new ComponentName(this,MyReceiver.class);
	// 取消设备管理
	dpm.removeActiveAdmin(myReceiverName);
	// 卸载
	Intent intent = new Intent();
	intent.setAction("android.intent.action.VIEW");
	intent.addCategory("android.intent.category.DEFAULT");
	intent.setData(Uri.parse("package:"+getPackageName()));
	startActivity(intent);

简书: http://www.jianshu.com/p/46c0fb914421   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/71270479   
GitHub博客：http://lioil.win/2017/05/06/Android-device-admin.html   
Coding博客：http://c.lioil.win/2017/05/06/Android-device-admin.html