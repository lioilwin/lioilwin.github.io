---
layout: post
title: Kotlin-this表达式(this Expression)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/this-expressions.html

## 1.this表达式
    在kotlin中,可用this表达式表示当前接收者(receiver)对象
        1.在类成员函数中,this代指该类的当前对象;
        2.在扩展函数(extension function)
            或者带接收者的字面函数(function literal with receiver)中,
            this代指该函数的接收者对象参数(receiver parameter);

    如果this没有限定符(qualifiers),代指包含它的最内层作用域的对象;
    如果要使用外部作用域的this,就要添加this标签限定符(label qualifiers)

## 2.this限定符(Qualifier)-this@label
    访问来自外部作用域的this(类,扩展函数,带接收者的字面函数）
    我们使用this@label，其中 @label 是一个代指 this 来源的标签：
    fun main(args: Array<String>) {
        A().B().p()
    }

    class A { //隐式标签 @A
        inner class B { //隐式标签 @B        
            fun p(){
                666.foo()
                println(this)//输出A$B@279f2327,this代指[B类对象]
            }
            
            fun Int.foo() { //隐式标签 @foo

                //输出A@2ff4acd0, this代指[A类对象]
                println(this@A)

                //输出A$B@279f2327, this代指[B类对象]
                println(this@B)

                //输出666, this代指[foo函数接收者Int类对象]
                println(this)

                //输出666, this@foo代指[foo函数接收者Int类对象]
                println(this@foo)
               
                val funLit = fun String.() {
                    //this代指[funLit函数接收者String类对象]
                    println(this) //输出lit
                }
                "lit".funLit()
                
                val funLit2 = { s: String ->
                    //该函数没有接收者,故this代指[foo函数接收者Int类对象]
                    println(this) //输出666
                }
                funLit2("lit2")
            }
        }
    }

GitHub博客：http://lioil.win/2017/07/03/Kotlin-this.html   
Coding博客：http://c.lioil.win/2017/07/03/Kotlin-this.html