---
layout: post
title: Android-把Android Studio改为Eclipse项目结构
tags: Android
---

```gradle

/**配置gradle android插件库, jar aar中央仓库************/
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:2.3.3'
    }
}

allprojects {
    repositories {
        jcenter()
    }
}

/**配置Android模块******************************************/
apply plugin: 'com.android.application'
android {
    compileSdkVersion 26
    buildToolsVersion '26.0.0'
	
	// 自定义源码的项目结构路径
    sourceSets {
        main {
            manifest.srcFile 'AndroidManifest.xml'
			
			// 方法一, 自定义的Eclipse项目结构,会覆盖掉Android Studio默认项目结构
            java.srcDirs = ['src']
            resources.srcDirs = ['src']
            aidl.srcDirs = ['src']
            renderscript.srcDirs = ['src']
            res.srcDirs = ['res']
            assets.srcDirs = ['assets']
            jniLibs.srcDirs = ['libs']
			
			// 方法二, 自定义的Eclipse项目结构,不会去除Android Studio默认项目结构            
            java.srcDirs += 'src'
            resources.srcDirs += 'src'
            aidl.srcDirs += 'src'
            renderscript.srcDirs += 'src'
            res.srcDirs += 'res'
            assets.srcDirs += 'assets'
            jniLibs.srcDirs += 'libs'
			
			// 方法三, 同样不会去除Android Studio默认项目结构
			java.srcDir 'src'
            resources.srcDir 'src'
            aidl.srcDir 'src'
            renderscript.srcDir 'src'
            res.srcDir 'res'
            assets.srcDir 'assets'
            jniLibs.srcDir 'libs'			
        }
    }
}
dependencies {
    compile fileTree(include: ['*.jar'], dir: 'libs')  
}

```

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/76839417   
GitHub博客: http://lioil.win/2017/08/07/Android-AS-Eclipse.html   
Coding博客: http://c.lioil.win/2017/08/07/Android-AS-Eclipse.html