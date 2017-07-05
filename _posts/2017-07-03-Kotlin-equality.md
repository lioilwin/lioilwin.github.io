---
layout: post
title: Kotlin-30.相等性(Equality)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/equality.html

## 1.相等性(Equality)
    与java不同, Kotlin有两种相等性equality(即两种等号):
        1.引用Referential相等(两个引用是否指向同一对象)
            操作符: ===(!==)
            三个等号===的比较,是比较对象引用(地址),即判断是否同一个对象!

        2.结构Structural相等(用equals()检查比较内容是否相等)
            操作符: ==(!=)
            两个等号==的比较,实际是通过equals()函数进行比较判断!

## 2.引用相等(Referential equality)
    引用相等的操作符: ===(否定形式!==)
    三个等号===的比较,是比较对象引用(地址),即判断是否同一个对象!
        a === b //当且仅当a和b指向同一个对象时,才为true

## 3.结构相等(Structural equality)
    结构相等的操作符: ==(否定形式!=)
    两个等号==的比较,实际是通过equals()函数进行比较判断!
    按照惯例,像a == b表达式会被翻译成:
        //如果a不为null,则调用equals(Any?)函数,
        //否则检查b是否与null引用相等!
        a?.equals(b) ?: (b === null)
    
    提示: 当a == null比较时不必显示优化代码, a == null会被自动转换为a === null

## 4.数据类的例子
    数据类已自动生成equals(),所以两个等号==(结构相等)比较的是对象数据,例如:
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

    而如果User类没有data关键字:
        class User(val name: String, val age: Int)
        fun main(args: Array<String>) {
            val u1 = User("lioil", 1)
            val u2 = User("lioil", 1)

            //虽然两个对象的数据内容相同,
            //但是两个等号==(结构相等)是通过equals()进行判断,
            //而普通类class没有根据属性成员定义equals(),需要我们自己定义
            println(u1 == u2)  //输出false           
        }

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/74276269   
GitHub博客：http://lioil.win/2017/07/03/Kotlin-equality.html   
Coding博客：http://c.lioil.win/2017/07/03/Kotlin-equality.html