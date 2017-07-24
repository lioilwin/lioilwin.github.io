---
layout: post
title: Kotlin-50.JavaScript反射(JavaScript Reflection)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/js-reflection.html

## JavaScript反射(JavaScript Reflection)
    目前,在JavaScript平台,Kotlin不支持完整的反射API!

    仅支持::class语法,是一个精简的KClass(仅支持simpleName和isInstance成员),
    通过它可以获取一个实例对象的类引用 或者 与给定类型的相应类引用!

    此外, 还可通过KClass.js获取JsClass类实例对象,
    该JsClass实例本身就是对构造函数的引用,常用于与JS函数(期望构造函数的引用)交互

    示例:
        class A
        class B
        class C

        inline fun <reified T> foo() {
            println(T::class.simpleName)
        }

        val a = A()
        println(a::class.simpleName)  // 输出"A" 一个实例的类
        println(B::class.simpleName)  // 输出"B" 给定类型的相应类
        println(B::class.js.name)     // 输出"B"
        foo<C>()                      // 输出"C"

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/76038731   
GitHub博客: http://lioil.win/2017/07/24/Kotlin-js-reflection.html   
Coding博客: http://c.lioil.win/2017/07/24/Kotlin-js-reflection.html