---
layout: post
title: Kotlin-数据类(data class)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/data-classes.html
 
## 1.数据类(data class)
    在Kotlin中一些只保存数据的类,称为数据类(data class),
    为了确保自动生成的代码一致性和有意义,数据类(data class)必须满足以下要求:
        主构造函数至少有一个参数;
        主构造函数的所有参数需标记为val 或 var;
        数据类不能是抽象、开放、密封或者内部的;
        自kotlin 1.1起,数据类可以扩展其他类;在1.1之前,数据类只能实现接口

    数据类语法: 
        data class User(val name: String, val age: Int)
        编译器会为属性自动生成以下函数:
            equals()/hashCode()
            toString() 默认输出"User(name=John, age=42)"
            componentN() 按声明顺序对应于所有属性
            copy()

        如果数据类需要无参构造函数,则所有属性必须有默认值:
        data class User(val name: String = "", val age: Int = 0)

## 2.copy()函数
    当要复制一个对象,只改变一些属性,但其余不变,copy()就是为此而生:
    //数据类User自动生成copy函数,具体实现如下:
    //fun copy(name: String=this.name, age: Int=this.age)=User(name, age)
        data class User(val name: String, val age: Int)  
        fun main(args: Array<String>) {	
            val u = User(name = "u", age = 1)
            val u1 = u.copy("u1")
            val u2 = u.copy("u2",2)
            val u3 = u.copy(age = 3)
            println("$u1,$u2,$u3")
        }   

## 3.component()函数-解构声明(Destructuring Declarations)
    数据类生成的component()函数,可在解构声明中使用:
        data class User(val name: String, val age: Int)
        fun main(args: Array<String>) {	
            val u = User("u", 35)
            val (name, age) = u
            println("name: $name, age: $age") // 输出"name: u, age: 35"
        }

GitHub博客：http://lioil.win/2017/06/22/Kotlin-data-class.html   
Coding博客：http://c.lioil.win/2017/06/22/Kotlin-data-class.html