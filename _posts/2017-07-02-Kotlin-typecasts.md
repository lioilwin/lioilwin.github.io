---
layout: post
title: Kotlin-类型检查和转换(Type Cast)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/typecasts.html

## 1.is和!is操作符(Operators)
    在运行时,可用is或!is操作符来检查对象类型是否符合要求:
        if (obj is String) {
            print(obj.length)
        }

        if (obj !is String) { //等价于 !(obj is String)
            print("Not a String")
        }else {
            print(obj.length)
        }

## 2.智能转换(Smart Casts)
    与java不同,Kotlin一般不需要显式转换对象类型,
    因为对于不可变的值,编译器能跟踪is检查类型,在需要时会自动插入类型转换代码(安全):
        fun demo(x: Any) {
            if (x is String) {
                print(x.length) //编译器自动把x转换为String类型
            }
        }

    1.智能转换的例子
    kotlin编译器足够聪明,能识别反向检查类型!is操作符,会自动插入类型转换代码：
        if (x !is String) return
        print(x.length) //编译器自动把x转换为String类型：
        
        // ||右侧, x自动转换为String类型
        if (x !is String || x.length == 0) return

        // &&右侧, x自动转换为String类型
        if (x is String && x.length > 0) {
            print(x.length) // x 自动转换为字符串
        }

        //智能转换(smart casts)也用于when表达式和while循环
        when (x) {
            is Int -> print(x + 1)
            is String -> print(x.length + 1)
            is IntArray -> print(x.sum())
        }

    2.智能转换的适用条件
    如果不能保证变量在类型检查is/!is操作符和变量使用之间不可改变时,智能转换不能用!
    智能转换的适用条件/规则:
        val局部变量-总是适用!
        val属性-适用于private或internal,或者类型检查is/!is在声明属性的同一模块中执行;
                不适用于open的属性,或者具有自定义getter的属性!
        var局部变量—适用于变量在类型检查和使用之间没有修改,且不在修改它的lambda中捕获!
        var属性-不适用(因为该变量可随时被修改)

## 3.不安全转换-操作符as
    如果类型不可能转换,转换操作符会抛出异常,称为不安全转换！
    Kotlin不安全转换就是中缀操作符as,例如:
        val y = null
        //kotlin类型默认不能为空(null),as会抛出异常TypeCastException
        val x: String = y as String

        //必须在转换右边添加?,表示可空(null)类型:
        val x: String? = y as String?

## 4.安全(可空)转换-操作符as?
    为避免抛出异常,可用安全转换操作符as?,在失败时返回null
        val x: String? = y as? String

    尽管as?右边是一个非空类型String,但是as?转换失败时返回可空(null)
    说白了就是,as?函数参数String不能为null,但是as?函数的返回值可以是null
        
GitHub博客：http://lioil.win/2017/07/02/Kotlin-typecasts.html   
Coding博客：http://c.lioil.win/2017/07/02/Kotlin-typecasts.html