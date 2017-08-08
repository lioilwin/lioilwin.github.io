---
layout: post
title: Kotlin-02.惯用语法/语法习惯(Idioms)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/idioms.html

习惯用法：一些在Kotlin中广泛使用的语法习惯

## 1.创建 DTOs（POJOs/POCOs）
    data class Customer(val name: String, val email: String)

    data class自动生成以下方法:
        类的所有属性变量都有getters方法
        类的var变量还有setters方法
        equals()
        hashCode()
        toString()
        copy()
        类的所有属性变量都有component1()、 component2()

## 2.函数的默认参数
    fun foo(a: Int = 0, b: String = ""){
        ...
    }

## 3.过滤 list
    val positives = list.filter { x -> x > 0 }
    或更短:
    val positives = list.filter { it > 0 }

## 4.字符串内插变量    
    println("Name $name")

## 5.类型判断
    when (x) {
        is Foo //-> ……
        is Bar //-> ……
        else   //-> ……
    }

## 6.遍历 map/pair型list
    for ((k, v) in map) {
        println("$k -> $v")
    }
    k、v 可以改成任意名字

## 7.使用区间
    for (i in 1..100) { …… }  // 闭区间：包含 100
    for (i in 1 until 100) { …… } // 半开区间：不包含 100
    for (x in 2..10 step 2) { …… } // 步长2: 2 4 6 8 10
    for (x in 10 downTo 1) { …… } // 递减: 10 9..1
    if (x in 1..10) { …… }

## 8.只读
    只读 list    
    val list = listOf("a", "b", "c")
    只读 map
    val map = mapOf("a" to 1, "b" to 2, "c" to 3)

## 9.延迟属性(懒加载)
    访问时才加载
    val p: String by lazy {
        // 计算该字符串
    }

## 10.扩展函数
    fun String.spaceToCamelCase() {
        // 不改变String类，增加了String的函数
    }
    "Convert this to camelcase".spaceToCamelCase()

## 11.创建单例类
    object Resource {
        val name = "Name"
    }
    object本身就是对象,很明显object不能像class多次创建实例对象

## 12.?和null
    If not null 缩写
        val files = File("Test").listFiles()
        println(files?.size)

    if null 执行一个语句
        val data = ……
        val email = data["email"] ?: throw IllegalStateException("Email is missing!")

    if not null 执行一个语句
        val data = ……
        data?.let {
            …… // 假如data不为null, 代码会执行到此处
        }
    
    标记Boolean可空null
        val b: Boolean? = ……
        if (b == true) {
            ……
        } else {
            // b 是 false 或者 null
        }

## 13.返回when/try/if表达式结果
    返回when结果   
        val result =  when (color) {
            "Red" -> 0
            "Green" -> 1
            "Blue" -> 2
            else -> throw IllegalArgumentException("Invalid color param value")
        }
  
    返回try/catch结果
        val result = try {
            count()
        } catch (e: ArithmeticException) {
            throw IllegalStateException(e)
        }

    返回if结果
        val result = if (param == 1) {
            "one"
        } else if (param == 2) {
            "two"
        } else {
            "three"
        }

## 14.单表达式函数
    fun theAnswer() = 42
    等价于
    fun theAnswer(): Int {
        return 42
    }

    单表达式函数与其它习惯用法一起简化代码，例如和 when 表达式一起使用：
    fun transform(color: String): Int = when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }

## 15.with语句对一个对象调用多个方法
    class Turtle {
        fun penDown()
        fun penUp()
        fun turn(degrees: Double)
        fun forward(pixels: Double)
    }

    val myTurtle = Turtle()
    with(myTurtle) { // 画一个 100 像素的正方形
        penDown()
        for(i in 1..4) {
            forward(100.0)
            turn(90.0)
        }
        penUp()
    }

## 16.泛型函数简化
    //  public final class Gson {
    //     ……
    //     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
    //     ……

    对fromJson方法参数简化
    inline fun <reified T: Any> Gson.fromJson(json): T = this.fromJson(json, T::class.java)

## 17.java流操作的写法简化
    val stream = Files.newInputStream(Paths.get("/some/file.txt"))
    stream.buffered().reader().use { reader ->
        println(reader.readText())
    }

简书: http://www.jianshu.com/p/e7b9afa47def
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/73149552   
GitHub博客: http://lioil.win/2017/06/12/Kotlin-Idioms.html   
Coding博客: http://c.lioil.win/2017/06/12/Kotlin-Idioms.html