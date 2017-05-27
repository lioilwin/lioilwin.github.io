---
layout: post
title: Android SDK默认混淆配置文件
tags: Android
---	
# 一.介绍	
	通常情况下编译后的字节码包含了大量调试信息(如源类名/行号等)
	混淆代码就能删除这些调试信息，并用无意义字符替换所有名字，增加反编译难度！
	
	ProGuard是一个混淆代码的开源项目，主要作用如下：
		混淆Obfuscate 用无意义字符替换类名/字段名/属性名/方法名等
		压缩Shrink 移除无用类/字段/属性/方法
		优化Optimize 移除无用字节码指令
		预检preverify 预检字节码,确保可执行
	
# 二.混淆配置
	在Android studio/build.gradle中
	android {
		...
		buildTypes {
			release {
				//开启混淆/压缩
				minifyEnabled true

				//proguard-android.txt是Android SDK默认混淆配置文件，
				//proguard-rules.pro是我们自定义混淆配置文件
				proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
			}
		}
	}	
		
## 1.自定义混淆文件proguard-rules.pro

```java

#基本指令----------------------------------
-printmapping proguardMapping.txt #输出混淆前后代码映射关系
-keepattributes Signature #保留泛型
-keepattributes SourceFile, LineNumberTable #抛出异常时保留代码行号
 
#移除log代码
#确保没有开启--dontoptimize选项
#默认混淆文件不要用proguard-android.txt,应该用proguard-android-optimize.txt
#assume no side effects假定无效, 标识无效代码
-assumenosideeffects class android.util.Log {
	public static int v(...);
	public static int d(...);
	public static int i(...);
}

```

## 2.Android SDK默认混淆文件proguard-android.txt
	AndroidSDK\tools\proguard\proguard-android.txt
	                         \proguard-android-optimize.txt							 
	其中proguard-android是不开启优化的配置文件
	    proguard-android-optimize.tx是开启优化的配置文件
		
```java

#1.在proguard-android-optimize.txt中——————————————————————————————
#开启优化
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification

......剩下部分同proguard-android.txt

```

```java

#2.在proguard-android.txt中———————————————————————————————————————
#不开启优化, 会导致-assumenosideeffects无法去除log代码
#如果要用-assumenosideeffects去除log代码,默认混淆文件应该选proguard-android-optimize.txt
-dontoptimize 

-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-verbose
-dontpreverify
-keepattributes *Annotation*

-keep public class com.google.vending.licensing.ILicensingService
-keep public class com.android.vending.licensing.ILicensingService

-keepclasseswithmembernames class * {
	native <methods>;
}

-keepclassmembers public class * extends android.view.View {
   void set*(***);
   *** get*();
}

-keepclassmembers class * extends android.app.Activity {
   public void *(android.view.View);
}

-keepclassmembers enum * {
	public static **[] values();
	public static ** valueOf(java.lang.String);
}

-keepclassmembers class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator CREATOR;
}

-keepclassmembers class **.R$* {
	public static <fields>;
}

-dontwarn android.support.**

-keep class android.support.annotation.Keep

-keep @android.support.annotation.Keep class * {*;}

-keepclasseswithmembers class * {
	@android.support.annotation.Keep <methods>;
}

-keepclasseswithmembers class * {
	@android.support.annotation.Keep <fields>;
}

-keepclasseswithmembers class * {
	@android.support.annotation.Keep <init>(...);
}

```