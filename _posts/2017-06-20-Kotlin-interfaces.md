---
layout: post
title: Kotlin-接口(interface)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/interfaces.html
 
## 1.定义接口
    Kotlin接口非常类似于Java 8，既可包含方法声明,也包含方法实现！
    可以有属性,但只能声明为抽象或提供访问器实现!
    与Java一样,使用关键字interface定义接口:
        interface MyInterface {
            fun bar() // 方法声明，抽象方法
            fun foo() {
                // 方法实现，非抽象方法
            }
        }

## 2.实现接口
    类或者对象可以实现一个或多个接口:
        class Child : MyInterface {
            override fun bar() {
                // 方法体
            }
        }

## 3.接口属性
    在接口中的属性既可以是抽象的,也可以有访问器的实现,
    但不能有幕后字段(backing field),因此访问器不能引用它们。
        interface MyInterface {
            val prop: Int // 抽象abstract,不能初始化

            val property: String
                get() = "foo" // 有访问器的实现，非抽象

            fun foo() {
                print(prop)
            }
        }

        class Child : MyInterface {
            override val prop: Int = 29
        }

## 4.多接口覆盖冲突
    实现多个接口时,可能会遇到[覆盖多个接口中同名方法]的问题:
        interface A {
            fun foo() { print("A") }
            fun bar()
        }

        interface B {
            fun foo() { print("B") }
            fun bar() { print("bar") }
        }        

        class C : A, B {
            override fun foo() {
                // 多覆盖
                super<A>.foo()
                super<B>.foo()
            }

            override fun bar() {
                // 单覆盖
                super<B>.bar()
            }
        }
        
GitHub博客：http://lioil.win/2017/06/20/Kotlin-interfaces.html   
Coding博客：http://c.lioil.win/2017/06/20/Kotlin-interfaces.html