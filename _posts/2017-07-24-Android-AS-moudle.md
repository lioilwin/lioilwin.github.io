---
layout: post
title: Android-Studio多个项目添加依赖同一个模块
tags: Android
---
参考: https://stackoverflow.com/questions/16588064/how-do-i-add-a-library-project-to-android-studio
 
eclipse的多个工作空间可以共享/引用/引入/依赖同一个项目(不勾选Copy projects into workspace),   
同样在Android Studio也可以这样做, 但使用AS提供的import moudle直接导入模块,默认会复制一个副本模块到当前项目,   
所以不能使用这个功能, 需要自定义配置gradle共享外部项目的模块!

在Android Studio中多个项目共享/引用/引入/依赖其它项目的模块library, 有3种方法配置gradle!

## 实例:
    在ProjectA中有一个模块moduleLib, 在ProjectB的一个模块app需要依赖使用在ProjectA中的moduleLib
    - ProjectA/
          - moduleLib/
               - build.gradle
          - moduleLib2/
               - build.gradle
          - build.gradle
          - settings.gradle

    - ProjectB/
          - app/
                - build.gradle
          - build.gradle
          - settings.gradle

## 方法一
    1.在ProjectB/Settings.gradle下,导入ProjectA的模块moduleLib
    include ':moduleLib'
    project(':moduleLib').projectDir = new File(settingsDir, '../ProjectA/moduleLib')

    2.在ProjectB/app/build.gradle下,添加依赖
    dependencies {
        compile project(':moduleLib')
    }

    提示: ..代表当前目录的上一级目录


## 方法二
    1.在ProjectB/Settings.gradle下,导入ProjectA的所有模块
    include ':ProjectA'    
    project (':ProjectA').projectDir = new File('../ProjectA')
    include ':ProjectA:moduleLib'
    
    2.在ProjectB/app/build.gradle下,添加依赖
    dependencies {
        compile project(':moduleLib')
    }

## 方法三
    1.在ProjectB/Settings.gradle下,导入ProjectA的模块moduleLib
    include ':..:ProjectA:moduleLib'

    2.在ProjectB/app/build.gradle下,添加依赖
    dependencies {        
        compile project(':..:ProjectA:moduleLib')
    }
    
    此方法导入模块,在as中显示目录结构不好看! 建议使用方法一或二

简书: http://www.jianshu.com/p/47156a6be8ce   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/76039327   
GitHub博客: http://lioil.win/2017/07/24/Android-AS-moudle.html   
Coding博客: http://c.lioil.win/2017/07/24/Android-AS-moudle.html