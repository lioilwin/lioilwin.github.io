---
layout: post
title: Kotlin-16.嵌套类/内部类(Nested Classes/Inner classes)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/nested-classes.html
 
## 1.嵌套类(Nested Classes)
    类可以嵌套在其他类中,不能访问外部类成员:
        class Outer {
            private val bar: Int = 1
            class Nest {
                //嵌套类不能访问外部类成员,相当于java的static 静态内部类
                fun foo() = 2
            }
        }
        fun main(args: Array<String>) {
            //创建嵌套类Nest对象,不需要外部类Outer对象
            println(Outer.Nest().foo()) //输出2
        }

## 2.内部类(Inner classes)
    类标记为inner,可以访问外部类成员:
        class Outer {
            private val bar: Int = 1
            inner class Inner {
                //内部类可以访问外部类成员,可看作外部类对象的一个成员
                fun foo() = bar
            }
        }
        fun main(args: Array<String>) {
            //创建内部类Inner对象,需要外部类Outer对象
            val outer = Outer()
            println(outer.Inner().foo()) //输出1
        }

## 3.匿名内部类(Anonymous inner classes)
    用对象表达式,创建匿名内部类的实例:
        window.addMouseListener(
            object: MouseAdapter() {
                override fun mouseClicked(e: MouseEvent) {
                    ...
                }

                override fun mouseEntered(e: MouseEvent){
                    ...
                }
            }
        )

    当接口仅有一个接口方法/函数,可用lambda表达式省略接口方法/函数:       
        val listener = ActionListener{
            println("clicked") //lambda表达式-简化的匿名内部类
        }

简书：http://www.jianshu.com/p/7f8c7c535cc0
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/73692072   
GitHub博客：http://lioil.win/2017/06/24/Kotlin-nested-classes.html   
Coding博客：http://c.lioil.win/2017/06/24/Kotlin-nested-classes.html