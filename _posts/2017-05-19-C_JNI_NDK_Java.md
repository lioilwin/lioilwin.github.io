---
layout: post
title: C_JNI_NDK_Java
tags: C
---
# 一.介绍	
	JNI(Java Native Interface)是Java提供的编程接口，
	通过JNIEnv指针,C/C++和java代码可以相互调用传递数据！
	
	NDK是Android开发C/C++工具集(代码库和编译工具),能将C/C++编程成不同平台(CUP/ABI)的so库
	
	jni.h文件位置:
	1.Android-ndk/platforms/android-版本/arch-arm/usr/include/jni.h
	2.JDK/include/jni.h

# 二.C/C++和Java数据类型映射
	在jni.h中	
	typedef为C/C++类型定义别名,和java类型建立映射
	
	1.基本数据类型映射
	typedef unsigned char   jboolean;       /* unsigned 8 bits */
	typedef signed char     jbyte;          /* signed 8 bits */
	typedef unsigned short  jchar;          /* unsigned 16 bits */
	typedef short           jshort;         /* signed 16 bits */
	typedef int             jint;           /* signed 32 bits */
	typedef long long       jlong;          /* signed 64 bits */
	typedef float           jfloat;         /* 32-bit IEEE 754 */
	typedef double          jdouble;        /* 64-bit IEEE 754 */
	
	2.类对象映射
	2.1在C++中(全都继承于_jobject类)
	class _jobject {};
	class _jclass : public _jobject {};
	class _jstring : public _jobject {};
	class _jarray : public _jobject {};
	class _jobjectArray : public _jarray {};
	class _jbooleanArray : public _jarray {};
	class _jbyteArray : public _jarray {};
	class _jcharArray : public _jarray {};
	class _jshortArray : public _jarray {};
	class _jintArray : public _jarray {};
	class _jlongArray : public _jarray {};
	class _jfloatArray : public _jarray {};
	class _jdoubleArray : public _jarray {};
	class _jthrowable : public _jobject {};
	typedef _jobject*       jobject;
	typedef _jclass*        jclass;
	typedef _jstring*       jstring;
	typedef _jarray*        jarray;
	typedef _jobjectArray*  jobjectArray;
	typedef _jbooleanArray* jbooleanArray;
	typedef _jbyteArray*    jbyteArray;
	typedef _jcharArray*    jcharArray;
	typedef _jshortArray*   jshortArray;
	typedef _jintArray*     jintArray;
	typedef _jlongArray*    jlongArray;
	typedef _jfloatArray*   jfloatArray;
	typedef _jdoubleArray*  jdoubleArray;
	typedef _jthrowable*    jthrowable;
	typedef _jobject*       jweak;
	
	2.2在C中(没有类概念,全都是void*别名)
	typedef void*           jobject;
	typedef jobject         jclass;
	typedef jobject         jstring;
	typedef jobject         jarray;
	typedef jarray          jobjectArray;
	typedef jarray          jbooleanArray;
	typedef jarray          jbyteArray;
	typedef jarray          jcharArray;
	typedef jarray          jshortArray;
	typedef jarray          jintArray;
	typedef jarray          jlongArray;
	typedef jarray          jfloatArray;
	typedef jarray          jdoubleArray;
	typedef jobject         jthrowable;
	typedef jobject         jweak;
	
# 三.在java中调用C/C++函数

## 1.在java中定义native方法(C/C++函数接口)

```java

package com.example;
public class JavaDemo {	
	public native String getHello();
}

```

## 2.实现C/C++函数接口

```c

#include <stdio.h>
#include <jni.h>

// JNIEnv*封装很多java方法，jobject obj代表调用该函数的java对象
jstring Java_com_example_JavaDemo_getHello(JNIEnv* env,jobject obj){
	return (*env)->NewStringUTF(env,"hello...");
}

```

## 3.使用NDK编译C/C++，生成libhello.so
	在Android Studio编译C/C++
	https://developer.android.google.cn/studio/projects/add-native-code.html
	Google官方文档中国版, 专为中国开发者建的网站！

## 4.加载so库,调用C/C++函数

```java

public class Main{
	
	// 加载C/C++库libhello.so, 去除前缀lib
	static{
		System.loadLibrary("hello");
	}
	
	public void onCreate() {		
		new JavaDemo().getHello(); // 调用C/C++函数
	}
}

```

# 四.在C/C++中调用java方法

```c

// 调用java方法, 把Java字符串解析为C语言字符串
char* Jstring2CStr(JNIEnv* env, jstring jstr){
	// 1.获取String类(java反射)
	jclass clsstring = (*env)->FindClass(env,"java/lang/String");
	
	// 2.获取String.getBytes方法(java反射)
	jmethodID mid = (*env)->GetMethodID(env,clsstring, "getBytes", "(Ljava/lang/String;)[B");
	
	// 3.调用getBytes方法(java反射),把java字符串变为字节数组jbyteArray
	jstring strencode = (*env)->NewStringUTF(env,"GB2312");
	jbyteArray barr= (jbyteArray)(*env)->CallObjectMethod(env,jstr,mid,strencode);
	
	// 4.让jbyte*(char*别名) ba引用Java数组jbyteArray barr
	jsize alen = (*env)->GetArrayLength(env,barr);
	jbyte* ba = (*env)->GetByteArrayElements(env,barr,JNI_FALSE);
	
	// 5.把Java端数组复制到本地内存(char*指向的)
	char* rtn = NULL;
	if(alen > 0){
		rtn = (char*)malloc(alen+1);
		memcpy(rtn,ba,alen);
		rtn[alen]=0;
	}
	
	// 6.释放jbyte* ba对数组jbyteArray barr的引用, 好让java回收jbyteArray barr占用的内存
	(*env)->ReleaseByteArrayElements(env,barr,ba,0);
	return rtn ;
}

```