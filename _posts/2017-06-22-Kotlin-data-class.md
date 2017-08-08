---
layout: post
title: Kotlin-13.数据类(data class)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/data-classes.html
 
## 1.数据类的概念(data class)
    在Kotlin中一些只保存数据的类,称为数据类(data class),
    为了确保自动生成的代码一致性和有意义,数据类(data class)必须满足以下要求:
        主构造函数至少有一个参数;
        主构造函数的所有参数需标记为val 或 var;
        数据类不能是抽象、开放、密封或者内部的;
        自kotlin 1.1起,数据类可以扩展其他类;在1.1之前,数据类只能实现接口

    数据类(data class)的语法实例: 
        data class User(val name: String, val age: Int)

        编译器会为数据类(data class)自动生成以下函数:
            equals()/hashCode()
            toString() 默认输出"User(name=John, age=42)"
            componentN() 按声明顺序对应于所有属性
            copy()

        如果数据类需要无参构造函数,则所有属性必须有默认值:
        data class User(val name: String = "", val age: Int = 0)

## 2.copy函数
    当要复制一个对象,只改变一些属性,但其余不变,copy()就是为此而生:
        data class User(val name: String, val age: Int)

        fun main(args: Array<String>) {	
            val u = User(name = "lioil", age = 1)
            val u1 = u.copy("win")   //传递第一参数,第二参数默认
            val u2 = u.copy("win",2) //传递所有参数
            val u3 = u.copy(age = 3) //命名参数,传递指定参数
            println("$u1,$u2,$u3")
        }   

## 3.componentN函数-解构声明(Destructuring Declarations)
    编译器为数据类(data class)自动声明componentN()函数,可直接用解构声明!
        data class User(val name: String, val age: Int)

        fun main(args: Array<String>) {	
            val u = User("lioil", 2017)
            val (n, a) = u
            println("$n, $a") //输出"lioil, 2017"
        }

## 4.两个等号==和三个等号===
    Kotlin有两种相等性(equality):
        1.Referential/引用相等(两个引用指向同一对象): ===(否定形式!==)
        三个等号===比较,是对象引用(地址),即判断是否同一个对象!

        2.Structural/结构相等(用equals()检查): ==(否定形式!=)
        两个等号==比较,是通过equals()函数进行比较!

    数据类已自动生成equals(),所以两个等号==比较的是对象数据,实例如下:
        data class User(val name: String, val age: Int)
        
        fun main(args: Array<String>) {
            val u1 = User("lioil", 1)
            val u2 = User("lioil", 1)
            val u3 = User("lioil", 2)

            println(u1 == u2)  //输出true,  对象数据相同
            println(u1 == u3)  //输出false, 对象数据不同

            // u1,u2,u3都是不同对象,即对象引用(地址)不同
            println(u1 === u2) //输出false, 对象引用(地址)不同
            println(u1 === u3) //输出false, 对象引用(地址)不同
        }

简书：http://www.jianshu.com/p/cb807bf83e44
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/73611829   
GitHub博客：http://lioil.win/2017/06/22/Kotlin-data-class.html   
Coding博客：http://c.lioil.win/2017/06/22/Kotlin-data-class.html