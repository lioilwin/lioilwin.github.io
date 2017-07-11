---
layout: post
title: Kotlin-38.标准库API总结(Standard Library)
tags: Kotlin
---
官方文档: http://kotlinlang.org/api/latest/jvm/stdlib/index.html

## 1.Kotlin标准库(Kotlin Standard Library)
    Kotlin标准类库为kotlin日常工作提供了重要工具:
        1.高阶函数实现惯用模式(let, apply, use, synchronized等);
        2.扩展函数为集合(eager)和序列(lazy)提供查询操作;
        3.各种实用程序用于处理字符串和字符序列;
        4.作为JDK类的扩展,方便地处理文件流, IO, 线程等操作;

## 2.kotlin包的介绍说明(Packages)
### 1.kotlin公共库(Java和JS共用)
    kotlin                     核心函数和数据类型,支持所有平台(JVM,JavaScript等)

    kotlin.annotation          为Kotlin注解facility提供支持

    kotlin.collections         集合类型,如Iterable,Collection,List,Set,Map等

    kotlin.comparisons         帮助函数用于创建Comparator比较器实例

    kotlin.coroutines.experimental(1.1)   支持协程,包括支持延迟序列(lazy sequence)

    kotlin.coroutines.experimental.intrinsics(1.1)   基于协程的API库的底层构建块

    kotlin.experimental(1.1)   实验API,将来版本可能会改变

    kotlin.io                  IO API用于处理文件和流

    kotlin.properties          代理/委托属性的标准实现,帮助函数实现自定义代理/委托

    kotlin.ranges              范围/区间,数列Progressions和相关扩展功能

    kotlin.reflect             Kotlin反射的运行时API

    kotlin.sequences           序列类型表示延迟求值的集合,实例化序列和扩展函数
    
    kotlin.text                处理文本和正则表达式的函数

### 2.Java平台的kotlin库(JVM)    
    kotlin.concurrent          并发(concurrent)编程的实用kotlin函数
    
    kotlin.jvm                 Java平台特有的函数和注解
    
    kotlin.reflect.full(1.1)   Kotlin反射库的扩展Extensions 
    
    kotlin.reflect.jvm         Kotlin反射与Java反射的互操作性Runtime API
    
    kotlin.streams(1.1,JRE8)   处理Java 8流的实用kotlin函数
    
    kotlin.system              与系统有关的实用kotlin函数

### 3.JavaScript平台的kotlin库(JS)
    kotlin.browser             在浏览器环境下访问顶层属性(如document,window等)
    
    kotlin.dom                 处理浏览器DOM的实用kotlin函数
    
    kotlin.js                  JavaScript平台特有的一些函数和API
    
    org.khronos.webgl          JavaScript平台的WebGL API的kotlin包装器(wrappers)
    
    org.w3c.dom                JavaScript平台的DOM API的kotlin包装器(wrappers)
    
    org.w3c.dom.css            JavaScript平台的DOM CSS API的kotlin包装器(wrappers)
    
    org.w3c.dom.events         JavaScript平台的DOM events API的kotlin包装器(wrappers)
    
    org.w3c.dom.parsing        JavaScript平台的DOM parsing API的kotlin包装器(wrappers)
    
    org.w3c.dom.svg            JavaScript平台的DOM SVG API的kotlin包装器(wrappers)
    
    org.w3c.dom.url            JavaScript平台的DOM URL API的kotlin包装器(wrappers)
    
    org.w3c.fetch              JavaScript平台的W3C fetch API的kotlin包装器(wrappers)
    
    org.w3c.files              JavaScript平台的W3C file API的kotlin包装器(wrappers)
    
    org.w3c.notifications      JavaScript平台的Web Notifications API的kotlin包装器(wrappers)
    
    org.w3c.performance        JavaScript平台的Navigation Timing API的kotlin包装器(wrappers)
    
    org.w3c.workers            JavaScript平台的Web Workers API的kotlin包装器(wrappers)
    
    org.w3c.xhr                JavaScript平台的XMLHttpRequest API的kotlin包装器(wrappers)

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/74936890   
GitHub博客：http://lioil.win/2017/07/10/Kotlin-stdlib.html   
Coding博客：http://c.lioil.win/2017/07/10/Kotlin-stdlib.html