---
layout: post
title: Kotlin-01.入门介绍和基础语法(Basic Syntax)
tags: Kotlin
---
## 一.介绍
	JetBrains公司根据多年Java平台开发经验,认为Java有一定局限性和问题,
	由于要向后兼容,这些问题很难得到解决,因此他们开发了Kotlin语言!
	
	Kotlin是基于JVM的新编程语言,和Groovy、Scala、Clojure等语言类似,被称为JVM语言!
	因为它们都编译成.clas字节码文件,可在java虚拟机JVM上运行!
	
	Kotlin特点:		
		Kotlin兼容Java,与Java 100%互相调用,并具备诸多Java尚不支持的新特性!
		比Java更安全,更简洁,更现代化,更强大！
		既面向对象又有函数式结构,支持高阶函数、操作符重载、字符串模板和lambda等！
		Kotlin比最成熟竞争者Scala简单易学,可轻松引入到现有java项目中!
		此外,还可编译成JavaScript代码, Kotlin也可与JavaScript互操作！
		
	Kotlin历史:	
		Kotlin由JetBrains公司在2010年开发,2011年开源:http://github.com/JetBrains/kotlin
		2016年发布1.0版,2017年4月发布1.1.2版！
		Kotlin语言的开发团队,目前大约40人,Andrey Breslav还是Kotlin语言的首席设计师!
		JetBrains公司对Kotlin愿景:
			用同一种语言,接多平台的不同应用的端对端开发,
			包括全栈Web应用、Android和iOS客户端、嵌入式/物联网等!
			
		谷歌Android团队和JetBrains公司关系密切,Android Studio就是基于IntelliJ IDEA社区版开发!
		谷歌和JetBrains公司为Kotlin成立一个非盈利基金会,Kotlin语言的开发，还是JB为主导!		
		谷歌在I/O 2017大会宣布:将Kotlin语言作为Android开发的一级编程语言!
		
	Android Studio 3.0预览版已支持Kotlin！
	下载AS3.0预览版后,打开现有Java文件,在Code菜单中选择Convert Java File to Kotlin File, 
	AS会添加Kotlin依赖,然后把Java代码转成Kotlin代码!
		
## 二.Kotlin基础语法
官方文档: http://kotlinlang.org/docs/reference/basic-syntax.html

### 1.Kotlin注释
	和Java一样，Kotlin支持行注释和块注释,
	与Java不同的是，Kotlin块注释可嵌套
		// 这是行注释
		/* 这是块注释 */

### 2.定义包名
	包名位于源码文件顶部,与java相同!
	但源码文件可在任意目录,不需要匹配包名
	package com.demo
	import java.util.*

### 3.定义函数
#### ①.函数有两个Int参数,返回Int类型
	// 变量: 变量类型
	fun sum(a: Int, b: Int): Int {
		return a + b
	}
	
	// main函数,和java的main方法一样,作为程序入口
	fun main(args: Array<String>) {	
		// 调用sum函数
		println(sum(3, 5)) 
	}

#### ②.函数表达式推断返回类型
	fun sum(a: Int, b: Int) = a + b	
	
	fun main(args: Array<String>) {
		println(sum(3, 5))
	}

#### ③.函数返回类型Unit
	// Unit类似java的void, $表示取变量值
	fun printSum(a: Int, b: Int): Unit {
		println("sum of $a and $b is ${a + b}")
	}
	
	fun main(args: Array<String>) {
		printSum(3, 5)
	}

#### ④.函数可省略返回类型Unit
	fun printSum(a: Int, b: Int) {
		println("sum of $a and $b is ${a + b}")
	}
		
### 4.定义局部变量
#### ①.只读变量val(只能赋值一次,之后不可变)
	fun main(args: Array<String>) {
		val a: Int = 1 //立即初始化
		val b = 2      //Int类型可被推断出来
		val c: Int     //没有初始化,必须写类型
		c = 3          //延迟初始化
		println("a = $a, b = $b, c = $c")
	}

#### ②.可变变量var
	fun main(args: Array<String>) {
		var x = 5 //Int类型可被推断出来
		x += 1    //x变量可以改变
		println("x = $x")
	}

### 5.字符串模板
	fun main(args: Array<String>) {
		var a = 1		
		val s1 = "a is $a" // 简单变量模板
		val s2 = "replace: ${s1.replace("is", "was")}" // 表达式模板
		println(s1)
		println(s2)
	}

### 6.条件表达式
#### ①.条件if
	fun maxOf(a: Int, b: Int): Int {
		if (a > b) {
			return a
		} else {
			return b
		}
	}

	fun main(args: Array<String>) {
		println(maxOf(3, 5))
	}

	简写if表达式
	fun maxOf(a: Int, b: Int) = if (a > b) a else b

	fun main(args: Array<String>) {
		println(maxOf(3, 5))
	}

#### ②.条件when
	fun describe(obj: Any): String =
	when (obj) {
		1          -> "One"
		"Hello"    -> "Greeting"
		is Long    -> "Long"
		!is String -> "Not a string"
		else       -> "Unknown"
	}

	fun main(args: Array<String>) {
		println(describe(1))
		println(describe("Hello"))
		println(describe(1000L))
		println(describe(2))
		println(describe("other"))
	}

### 7.可能空值时,检查null
	当可能为null值时,引用变量必须添加?标记	
	fun parseInt(str: String): Int? {
		return str.toIntOrNull()
	}

### 8.类型检查和自动转换
	is运算符可检查一个变量是否为某类型的实例
	如果一个不可变的局部变量或属性是指定类型，则不需要显式转换：
	fun getStringLength(obj: Any): Int? {
		if (obj is String) {
			// Any类型自动转换为String类型
			return obj.length
		}		
		return null
	}

	上面代码，也可写成下面
	fun getStringLength(obj: Any): Int? {
		if (obj !is String) return null
		return obj.length
	}

### 9.循环
#### ①.循环for
	fun main(args: Array<String>) {
		val items = listOf("apple", "banana", "kiwi")
		for (item in items) {
			// 直接变量每一项
			println(item)
		}
	}

	上面代码，也可写成下面
	fun main(args: Array<String>) {
		val items = listOf("apple", "banana", "kiwi")
		for (index in items.indices) {
			// 遍历下标，输出相应项
			println("item at $index is ${items[index]}")
		}
	}

#### ②.循环while
	fun main(args: Array<String>) {
		val items = listOf("apple", "banana", "kiwi")
		var index = 0
		while (index < items.size) {
			println("item at $index is ${items[index]}")
			index++
		}
	}

### 10.范围in运算符
	检查数字是否在指定范围内
	fun main(args: Array<String>) {
		val x = 3
		val y = 5
		if (x in 1..y+1) {
			println("$x在指定范围内")
		}
		if (0 !in 1..y+1) {
			println("0超出范围")
		}
	}

	用于迭代/循环
	fun main(args: Array<String>) {
		for (x in 1..3) {
			print(x)
		}
		println("***")
		for (x in 1..5 step 2) {
			println(x)
		}
		println("***")
		for (x in 5 downTo 1 step 2) {
			println(x)
		}
	}
	
	执行结果如下：
		1
		2
		3		
		***
		1
		3
		5		
		***		
		5
		3
		1

### 11.集合
	迭代集合(循环遍历)
	fun main(args: Array<String>) {
		val items = listOf("apple", "banana", "kiwi")
		for (item in items) {
			println(item)
		}
	}

	检查集合是否包含一个对象
	fun main(args: Array<String>) {
		val items = setOf("apple", "banana", "kiwi")
		when {
			"orange" in items -> println("juicy")
			"apple" in items -> println("apple is fine too")
		}
	}

	集合函数lambda表达式(过滤,排序,循环遍历)
	fun main(args: Array<String>) {
		val fruits = listOf("banana", "avocado", "apple", "kiwi")
		fruits
		.filter { it.startsWith("a") }
		.sortedBy { it }
		.map { it.toUpperCase() }
		.forEach { println(it) }
	}

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/73062916   
GitHub博客：http://lioil.win/2017/06/11/Kotlin-Introduction.html   
Coding博客：http://c.lioil.win/2017/06/11/Kotlin-Introduction.html