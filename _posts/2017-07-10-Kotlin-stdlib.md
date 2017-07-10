---
layout: post
title: Kotlin-38.标准库总结(Standard Library)
tags: Kotlin
---
官方文档: http://kotlinlang.org/api/latest/jvm/stdlib/index.html

## 1.Kotlin标准库(Kotlin Standard Library)
    Kotlin标准库为kotlin日常工作提供了重要工具:
        1.高阶函数实现惯用模式(let, apply, use, synchronized等);
        2.扩展函数为集合(eager)和序列(lazy)提供查询操作;
        3.各种实用程序用于处理字符串和字符序列;
        4.作为JDK类的扩展,方便地处理文件流, IO, 线程等操作;

## 2.标准库的各个包(Packages)
    kotlin                                   核心函数和数据类型,支持所有平台(JVM,JavaScript等)
    kotlin.annotation                        为Kotlin注解facility提供支持
    kotlin.collections                       集合类型,如Iterable,Collection,List,Set,Map等
    kotlin.comparisons                       帮助函数用于创建Comparator比较器实例
    kotlin.concurrent(JVM)                   并发(concurrent)编程的实用函数
    kotlin.coroutines.experimental(1.1)             支持协程,包括支持延迟序列(lazy sequence)
    kotlin.coroutines.experimental.intrinsics(1.1)  基于协程的API库的底层构建块
    kotlin.experimental(1.1)                 实验API,将来版本可能会改变
    kotlin.io                                IO API用于处理文件和流
    kotlin.jvm(JVM)                          Java平台特有的函数和注解
    kotlin.properties                        代理/委托属性的标准实现,帮助函数实现自定义代理/委托
    kotlin.ranges                            范围/区间,数列Progressions和相关扩展功能
    kotlin.reflect                           Kotlin反射的运行时API
    kotlin.reflect.full(1.1,JVM)             Kotlin反射库的扩展Extensions 
    kotlin.reflect.jvm(JVM)                  Kotlin反射与Java反射的互操作性Runtime API
    kotlin.sequences                         序列类型表示延迟求值的集合,实例化序列和扩展函数
    kotlin.streams(1.1,JRE8)                 处理Java 8流的实用函数
    kotlin.system(JVM)                       与系统有关的实用函数
    kotlin.text                              处理文本和正则表达式的函数

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/74936890   
GitHub博客：http://lioil.win/2017/07/10/Kotlin-stdlib.html   
Coding博客：http://c.lioil.win/2017/07/10/Kotlin-stdlib.html