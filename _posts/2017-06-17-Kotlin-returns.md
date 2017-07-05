---
layout: post
title: Kotlin-07.返回和跳转(return/break/continue)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/returns.html

## 1.返回和跳转
    Kotlin 和java一样，有三种结构化跳转表达式:
        return   从包围它的函数或匿名函数返回
        break    终止循环
        continue 跳出本次循环，继续下一次循环

    和Java不同的是，这些表达式都可作为更大表达式的一部分:
            val s = person.name ?: return

## 2.break和continue @标签
    和Java不同的是，在 Kotlin 中任何表达式都可以用 标签@ 来标记:
        loop@ for (i in 1..100) {
            for (j in 1..100) {
                if (……) break@loop // 终止loop标记的循环
                if (……) continue@loop // 跳出loop标记的循环，继续下一次loop标记的循环
            }
        }

## 3.return @标签
    Kotlin 有局部函数，因此Kotlin函数可被嵌套

    1.从外层函数返回：
        fun foo() {
            ints.forEach {
                if (it == 0) return // 默认从foo(){}返回
                print(it)
            }
        }
        
    2.用显式标签从lambda表达式中返回:
        fun foo() {
            ints.forEach lit@ {
                if (it == 0) return@lit // 标记从forEach{}返回
                print(it)
            }
        }
    
    3.用隐式标签(与接收lambda的函数同名)从lambda表达式中返回:
        fun foo() {
            ints.forEach {
                if (it == 0) return@forEach // 隐式标签forEach，从forEach{}返回
                print(it)
            }
        }

    4.用匿名函数替代lambda表达式:
        fun foo() {
            ints.forEach(fun(value: Int) {
                if (value == 0) return // 从该匿名函数fun返回
                print(value)
            })
        }

    当return返回值时:
        return@a 1 // 从@a标记的函数返回1，不是返回标记的表达式(@a 1)”。

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/73381825  
GitHub博客：http://lioil.win/2017/06/17/Kotlin-returns.html   
Coding博客：http://c.lioil.win/2017/06/17/Kotlin-returns.html