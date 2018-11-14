---
layout: post
title: Android-Studio多个项目共享同一个模块
tags: Android
---
参考: https://stackoverflow.com/questions/16588064/how-do-i-add-a-library-project-to-android-studio

提示:   
Eclipse工作空间(workspace) = Android Studio项目(Project)   
Eclipse项目(Project) = Android Studio模块(Module)   

Eclipse多个工作空间可以导入共享同一个项目(不勾选Copy projects into workspace);   
然而Android Studio提供的import moudle直接导入模块，默认会复制一个副本模块到AS当前文件夹;   
所以不能使用这个功能, 要通过配置Gradle来实现共享其它项目的模块!   

## 实例
	在ProjectB中如何使用ProjectA的模块moduleLib ?
    D:/ProjectA/
		- moduleLib/
		   - build.gradle
		- build.gradle
		- settings.gradle

    D:/ProjectB/
		- app/
			- build.gradle
		- build.gradle
		- settings.gradle

## 方法一
    1.在ProjectB/settings.gradle下,导入ProjectA的模块moduleLib
    include ':moduleLib'
    project(':moduleLib').projectDir = new File(settingsDir, '../ProjectA/moduleLib') // settingsDir是指settings.gradle文件目录
    // project(':moduleLib').projectDir = new File('D:/ProjectA/moduleLib') // 绝对路径

    2.在ProjectB/app/build.gradle下,添加依赖
    dependencies {
        compile project(':moduleLib')
    }

    注: ..代表settingsDir目录的上一级目录


## 方法二
    1.在ProjectB/settings.gradle下,导入ProjectA的所有模块
    include ':ProjectA'    
    project (':ProjectA').projectDir = new File('../ProjectA')
    include ':ProjectA:moduleLib'
    
    2.在ProjectB/app/build.gradle下,添加依赖
    dependencies {
        compile project(':moduleLib')
    }

## 方法三
    1.在ProjectB/settings.gradle下,导入ProjectA的模块moduleLib
    include ':..:ProjectA:moduleLib'

    2.在ProjectB/app/build.gradle下,添加依赖
    dependencies {        
        compile project(':..:ProjectA:moduleLib')
    }

注：仅推荐方法一，因为方法二和三混杂Project和Model同时使用容易混乱！

简书: http://www.jianshu.com/p/47156a6be8ce   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/76039327   
GitHub博客: http://lioil.win/2017/07/24/Android-AS-moudle.html   
Coding博客: http://c.lioil.win/2017/07/24/Android-AS-moudle.html