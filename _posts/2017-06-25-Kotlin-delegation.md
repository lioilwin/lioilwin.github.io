---
layout: post
title: Kotlin-代理/委托类(Delegation)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/delegation.html
 
## 类代理/委托(Class Delegation)
    代理/委托模式(Delegation pattern)已被证明是替代继承的一个很好方式,
    而Kotlin原生支持它:    
        interface Base {
            fun p1()
            fun p2()
        }

        class Impl() : Base {
            override fun p1() {
                println("p1_Impl")
            }
            override fun p2() {
                println("p2_Impl")
            }
        }

        //by base表示 Deg会存储base,代理Base所有方法/函数
        class Deg(base: Base) : Base by base{
            override fun p2() {
                println("p2_Deg")
            }
        }

        fun main(args: Array<String>) {
            val deg = Deg(Impl())
            deg.p1() //输出p1_Impl
            deg.p2() //输出p2_Deg
        }

GitHub博客：http://lioil.win/2017/06/25/Kotlin-delegation.html   
Coding博客：http://c.lioil.win/2017/06/25/Kotlin-delegation.html