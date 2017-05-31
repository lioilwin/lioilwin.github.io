---
layout: post
title: Android系统启动过程
tags: Android
---
参考：http://blog.jobbole.com/67931/

# 介绍
	Android是基于Linux的开源系统，Android前期启动过程与Linux相似, 后期不同！
	
	大致流程：加载引导——>引导系统——>启动内核——>init进程
	          ——>Zygote(虚拟机VM)———>系统服务——>启动完成,发送开机广播

# 一.加载引导
	当电源按下，引导程序开始从预定义位置(固化在ROM)开始执行;
	加载引导程序到RAM内存，然后执行。

# 二.引导系统
	引导程序是在Android系统运行前的一个小程序, 不是Android系统的一部分!
	与主板芯片有关，是手机厂商加锁限制的地方！

	引导程序分两个阶段执行：
		第一阶段，检测外部RAM以及加载对第二阶段有用的程序;
		第二阶段，引导程序设置网络、内存等等
		
	init.s初始化堆栈，清零BBS段，调用main.c的_main()函数；
	main.c初始化硬件(闹钟、主板、键盘、控制台)，创建linux标签

# 三.启动内核	
	Android内核与Linux内核启动差不多,
	内核启动时，设置缓存、被保护存储器、计划列表，加载驱动。
	当内核启动完成，加载init文件，启动root进程或系统第一个进程。

# 四.init进程
	init是Linux系统内核启动的第一个用户级进程
	init进程两作用:
		一.挂载目录,比如/sys、/dev、/proc
		二.运行init.rc脚本

	init.c在/system/core/init
	init.rc在/system/core/rootdir/init.rc
	对init.rc文件，Android有特定格式规则,叫做Android初始化语言
		Android初始化语言四大类: Actions动作 Commands命令 Services服务 Options选项	
		Action动作：动作是以命令流程命名的，有一个触发器决定动作是否发生
		Service服务：服务是init进程启动的程序、当服务退出时init进程会视情况重启服务。
		Options选项: 对服务的描述, 影响init进程如何以及何时启动服务。
		
		Action/Service	描述
		on early-init	设置init进程以及它创建的子进程的优先级，设置init进程的安全环境
		on init	        设置全局环境，为cpu accounting创建cgroup(资源控制)挂载点
		on fs           挂载mtd分区
		on post-fs      改变系统目录的访问权限
		on post-fs-data	改变/data目录以及它的子目录的访问权限
		on boot          基本网络的初始化，内存管理等等
		service servicemanager	启动系统管理器管理所有的本地服务，比如位置、音频、Shared preference等等…
		service zygote	启动zygote作为应用进程
	
	在这个阶段可看到系统图标！
	
	以下按顺序启动:
		init.c
		运行init.rc脚本文件
		/system/bin/app_process/
		App_main.cpp{
			main(){
			// 启动ZygoteInit
			AndroidRuntime.start("com.android.internal.os.ZygoteInit",..);
			}
		}
		ZygoteInit.java{
			startSystemServer(){
				// 启动com.android.server.SystemServer			
			}
		}
		SystemServer.java{
			// 启动native(C/C++库)世界
			init1();
			
			// 启动java(framework框架层)世界 
			// PackageManager ActivityManager等等
			init2();
		}	

# 五.Zygote
	Android系统为每一个应用启动不同Dalvik虚拟机实例,会消耗大量内存及时间
	为了克服这个问题，Android系统创造了”Zygote”, 让虚拟机共享代码、低内存及启动时间少
	
	Zygote本身是一个虚拟机进程,同时也是一个虚拟机实例的孵化器！
	Zygote进程在系统启动时产生,完成虚拟机初始化;
	在系统需要新虚拟机实例时,Zygote通过复制(fork)自身,以最快速度提供一个虚拟机实例！
	
	Zygote预加载核心类库		
	ZygoteInit.java 源码 /frameworks/base/core/java/com/android/internal/os/ZygoteInit.java
		registerZygoteSocket() 为zygote命令连接注册一个服务器套接字。
		preloadClassed()预先加载java类 /frameworks/base/preloaded-classes包含一系列需要预加载的Java类		
		preloadResources()预先加载资源 预加载本地主题、布局以及android.R文件包含的所有东西
	
	在这个阶段可看到启动动画!

# 六.系统服务
	Zygote创建新进程去启动系统服务,系统服务同时使用native(C/C++)以及java编写!	
	源码:SystemServer.java{			
			// 启动java(framework框架层)世界 
			// PackageManager ActivityManager等等
			init2();
		}

	核心服务：
		启动电源管理器；
		创建Activity管理器；
		启动电话注册；
		启动包管理器；
		设置Activity管理服务为系统进程；
		启动上下文管理器；
		启动系统Context Providers；
		启动电池服务；
		启动定时管理器；
		启动传感服务；
		启动窗口管理器；
		启动蓝牙服务；
		启动挂载服务。
	
	其他服务：
		启动状态栏服务；
		启动硬件服务；
		启动网络状态服务；
		启动网络连接服务；
		启动通知管理器；
		启动设备存储监视服务；
		启动定位管理器；
		启动搜索服务；
		启动剪切板服务；
		启动登记服务；
		启动壁纸服务；
		启动音频服务；
		启动耳机监听；
		启动AdbSettingsObserver 处理adb命令

# 七.启动完成
	一旦系统服务在内存中运行了，Android就完成启动过程，
	这时“ACTION_BOOT_COMPLETED”开机广播就会发出
		
GitHub博客：http://lioil.win/2017/05/31/Android_Startup.html  
Coding博客：http://c.lioil.win/2017/05/31/Android_Startup.html