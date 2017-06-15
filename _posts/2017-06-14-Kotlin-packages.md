---
layout: post
title: Kotlin-包-package
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/packages.html

## 1.包
    源文件通常以包声明开头:
    package com.demo
    fun myFun() { ... }
    class MyCalss { ... }

    源码文件所有内容(无论是类还是函数)都在包内,
    所以上例中 myFun() 全名是 com.demo.myFun,
    MyCalss 全名是 com.demo.MyClass

    如果没指定包，则该文件内容属于默认“default”包

## 2.默认导入
    一些包会被默认导入到每个Kotlin源码文件中：
        kotlin.*
        kotlin.annotation.*
        kotlin.collections.*
        kotlin.comparisons.* (自 Kotlin 1.1 起)
        kotlin.io.*
        kotlin.ranges.*
        kotlin.sequences.*
        kotlin.text.*

    根据平台还会导入额外包：
        JVM:
            java.lang.*
            kotlin.jvm.*

        JS:
            kotlin.js.*

## 3.导入
    除了默认导入外，每个文件可自定义导入   
        import foo.Bar
        import foo.*

    如出现名字冲突，可用 as 重命名消歧义：
        import foo.Bar // Bar 可访问
        import bar.Bar as bBar // bBar 重命名“bar.Bar”

    import 不限于导入类, 也可导入：
        顶层函数和属性
        在对象声明中声明的函数和属性
        枚举常量

    与 Java 不同的是，Kotlin 没有 import static 语法，全部都用 import 导入

## 4.顶层声明的可见性
    如果顶层声明是 private，它是该文件的私有成员！

GitHub博客：http://lioil.win/2017/06/14/Kotlin-packages.html   
Coding博客：http://c.lioil.win/2017/06/14/Kotlin-packages.html