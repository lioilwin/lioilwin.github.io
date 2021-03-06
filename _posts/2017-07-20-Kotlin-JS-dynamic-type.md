---
layout: post
title: Kotlin-46.JavaScript动态类型(Dynamic Type)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/dynamic-type.html

## 动态类型(Dynamic Type)
    Kotlin在面向JVM平台的代码中不支持动态类型(说白了就是java不支持动态类型)

    Kotlin是一种静态类型的语言,但仍然需要与无类型或松散类型的语言互操作(例如JavaScript系统)!
    为了帮助这些场景,kotLin语言中可用dynamic类型:
        val dyn: dynamic = ...
    dynamic类型基本关闭了Kotlin类型检查系统:
        dynamic类型类型的值可以赋值给任何变量或作为参数传递到任何位置;
        任何值都可以赋值给dynamic类型变量,或者传递给一个接受dynamic作为参数的函数;
        null检查禁用;

    dynamic最特别的特性是,可以对dynamic变量调用任何属性或以任意参数调用任何函数:
        val dyn: dynamic = ...
        dyn.whatever(1, "foo", dyn) // 'whatever'没有定义
        dyn.whatever(*arrayOf(1, 2, 3))

    在JavaScript平台上,该kotlin代码按原样编译: 在生成的JavaScript代码中,Kotlin的dyn.whatever(1)变为dyn.whatever(1)    
    当在dynamic类型的值上调用,可能需要使用@JsName注解为要调用的函数分配名称!

    函数动态调用总是返回dynamic,所以可以自由地链式调用:
        dyn.foo().bar.baz()

    把lambda表达式传给一个动态调用时,它的所有参数默认都是dynamic类型:
        dyn.foo {
            x -> x.bar() // x 是 dynamic
        }

    使用dynamic类型值的表达式会按原样转换为JavaScript,并且不使用Kotlin约定的运算符,支持以下运算符:
        二元(binary):            +, -, *, /, %, >, < >=, <=, ==, !=, ===, !==, &&, ||
        一元(unary)
            前置(prefix):         -, +, !
            前置及后置(postfix):  ++, --
        赋值(assignments):        +=, -=, *=, /=, %=
        索引访问(indexed access):
            读(read):             d[a], []多于一个参数会出错
            写(write):            d[a1] = a2, []多于一个参数会出错

    注意: in, !in以及..操作符,对于dynamic类型是被禁用(在JavaScript平台被禁用)!

简书：http://www.jianshu.com/p/5f07f026edcf
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/75579094   
GitHub博客：http://lioil.win/2017/07/20/Kotlin-JS-dynamic-type.html   
Coding博客：http://c.lioil.win/2017/07/20/Kotlin-JS-dynamic-type.html