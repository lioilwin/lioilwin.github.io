---
layout: post
title: Kotlin-解构声明(Destructuring Declaration)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/multi-declarations.html
    
## 1.解构声明的概念和作用(destructuring declaration)
    把一个对象成员解构(destructure)成多个变量,称为解构声明(destructuring declaration),
    component1(),component2()等函数是Kotlin约定的操作符(类似+ - * / for等操作符)
    componentN是操作符(类似加减乘除的运算符),重载操作符必需要用operator修饰以允许使用!
    解构声明componentN函数的定义如下:
        class User(val first: String, val second: String) {
            //componentN是操作符,重载它,必须添加operator修饰符
            operator fun component1(): String {
                return first
            }
            operator fun component2(): String {
                return second
            }
        }
        
        fun main(args: Array<String>) {
            //解构声明会创建多个变量,可独立使用
            val (f, s) = User("lioil", "win")
            println("$f, $s") //输出"lioil", "win"
        }

### 1.数据类(data class)
    编译器会为数据类(data class)自动声明/定义componentN()函数,可直接用解构声明!    
        data class User(val name: String, val id: Int)

        fun main(args: Array<String>) {
            val u = User("lioil.win", 1)

            //传统用法
            println("${u.name}, ${u.id}")//输出: lioil.win, 1

            //解构声明
            val (n, i) = u
            println("$n, $i")//输出: lioil.win, 1

            //直接调用componentN函数
            println("${u.component1()}, ${u.component2()}")
        }

### 2.函数返回多个变量(Return Values)
    如果需要一个函数返回多个变量,Kotlin最简洁的实现是声明一个数据类并返回其实例对象,
    数据类(data class)自动声明/定义componentN()函数,无需我们定义！
        data class Result(val result: Int, val status: Status)

        fun deFun(...): Result {
            return Result(result, status)
        }

        //函数直接返回多个变量,非常方便使用
        val (result, status) = deFun(...)

### 3.for循环-解构声明
    collection的元素类必须要声明component1()、component2()等函数
        for ((a, b) in collection) {
            print(a)  
            ...                
        }

### 4.映射Map-解构声明
    在kotlin标准库(standard library)提供以下扩展:
        //iterator()用于map迭代遍历(循环)
        operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()

        //component1、component2用于解构Map.Entr对象,获取键值对(key,value)
        operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
        operator fun <K, V> Map.Entry<K, V>.component2() = getValue()

    Map解构声明的实例:
        fun main(args: Array<String>) {
            val map = hashMapOf<String, Int>()
            map.put("one", 1)
            map.put("two", 2)

            //(key, value) in map
            for ((key, value) in map) {
                println("key = $key, value = $value")
            }
        }

## 2.自kotlin 1.1起的新特性
    1.下划线_未使用变量(Underscore unused)
        如果在解构声明中不需要使用某个变量,那么可用下划线_取代:
            val (_, status) = getResult()

    2.lambda表达式参数解构(Destructuring Lambda)    
        如果lambda表达式参数类型是Pair/Map.Entry或具有componentN函数的类型,
        那么lambda表达式参数可以使用解构声明:
            map.mapValues { entry -> "${entry.value}!" }
            map.mapValues { (key, value) -> "$value!" }
        
        多个参数和一个解构的区别:
            { a -> …… } //一个参数
            { a, b -> …… } //两个参数
            { (a, b) -> …… } //一个解构对
            { (a, b), c -> …… } //一个解构对,一个参数

        解构的参数未使用,用下划线取代,以免编造新名:
            map.mapValues { (_, value) -> "$value!" }

        可以指定解构的参数类型:
            map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }
            map.mapValues { (_, value: String) -> "$value!" }

GitHub博客：http://lioil.win/2017/07/01/Kotlin-destructure.html   
Coding博客：http://c.lioil.win/2017/07/01/Kotlin-destructure.html