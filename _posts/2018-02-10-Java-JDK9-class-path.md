---
layout: post
title: Java-JDK9-Djava.ext.dirs is not supported
tags: Java
---
## 1.JDK9出现的问题
	去年JDK9发布了, 最近我把JDK8更新为JDK9后, 当我使用 Android apksigner dx 命令工具出现如下问题	
		D:\Dev\AndroidSDK\build-tools\27.0.3>apksigner
		-Djava.ext.dirs=D:\Dev\AndroidSDK\build-tools\27.0.3\lib is not supported.  Use -classpath instead.
		Error: Could not create the Java Virtual Machine.
		Error: A fatal exception has occurred. Program will exit.			
						  
		D:\Dev\AndroidSDK\build-tools\27.0.3>dx
		-Djava.ext.dirs=D:\Dev\AndroidSDK\build-tools\27.0.3\lib is not supported.  Use -classpath instead.
		Error: Could not create the Java Virtual Machine.
		Error: A fatal exception has occurred. Program will exit.
		
	-Djava.ext.dirs 和 -classpath 都是指定需要加载的jar/class文件目录路径，	
	按错误提示猜测应该是JDK9不再支持-Djava.ext.dirs参数，之前的JDK8可以正常支持。
	于是按错误提示尝试把 -Djava.ext.dirs 替换为 -classpath
	在 D:\Dev\AndroidSDK\build-tools\27.0.3\apksigner.bat 批处理文件中修改如下:
		REM call "%java_exe%" %javaOpts% -Djava.ext.dirs="%frameworkdir%" -jar "%jarpath%" %params%
		call "%java_exe%" %javaOpts% -classpath="%frameworkdir%" -jar "%jarpath%" %params%
	
	结果我还是太天真了,JDK9花式给了一个同样的错误
		D:\Dev\AndroidSDK\build-tools\27.0.3>apksigner
		Unrecognized option: -classpath=D:\Dev\AndroidSDK\build-tools\27.0.3\lib
		Error: Could not create the Java Virtual Machine.
		Error: A fatal exception has occurred. Program will exit.

## 2.解决方法
	Unrecognized option: -classpath
	既然JDK9装做不认识-classpath, 那我只好尝试看看java命令有什么新option	
		D:\>java
		用法: java [options] <主类> [args...]
				   (执行类)
		   或  java [options] -jar <jar 文件> [args...]
				   (执行 jar 文件)
		   或  java [options] -m <模块>[/<主类>] [args...]
			   java [options] --module <模块>[/<主类>] [args...]
				   (执行模块中的主类)

		 其中, 选项包括:
			-d32          已过时, 在以后的发行版中将被删除
			-d64          已过时, 在以后的发行版中将被删除
			-cp <目录和 zip/jar 文件的类搜索路径>
			-classpath <目录和 zip/jar 文件的类搜索路径>
			--class-path <目录和 zip/jar 文件的类搜索路径>
						  使用 ; 分隔的, 用于搜索类文件的目录, JAR 档案
						  和 ZIP 档案列表。

	果然JDK9新增命令选项 --class-path, 也是用来指定class/jar文件目录路径
	在 D:\Dev\AndroidSDK\build-tools\27.0.3\apksigner.bat 批处理文件中修改如下:
		REM call "%java_exe%" %javaOpts% -Djava.ext.dirs="%frameworkdir%" -jar "%jarpath%" %params%
		call "%java_exe%" %javaOpts% --class-path="%frameworkdir%" -jar "%jarpath%" %params%
	
	终于成功了
		D:\Dev\AndroidSDK\build-tools\27.0.3>apksigner
		USAGE: apksigner <command> [options]
			   apksigner --version
			   apksigner --help

		EXAMPLE:
			   apksigner sign --ks release.jks app.apk
			   apksigner verify --verbose app.apk

		apksigner is a tool for signing Android APK files and for checking whether
		signatures of APK files will verify on Android devices.
			
刚开始出现问题时,因为畏惧这种系统问题而粗暴滚回JDK8,还好后来强迫症犯了,误打误撞终于找到原因...  
"提出问题比解决问题更重要",我对这句话越来越有感触了...   
出现了问题,应该感到庆幸而不是畏惧,因为这个新问题会带来新知识,因畏惧而逃避的人将永远无知！
		
简书: http://www.jianshu.com/p/77db2ea8098f   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/79307325   
GitHub博客: http://lioil.win/2018/02/10/Java-JDK9-class-path.html   
Coding博客: http://c.lioil.win/2018/02/10/Java-JDK9-class-path.html   