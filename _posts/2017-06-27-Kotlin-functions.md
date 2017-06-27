---
layout: post
title: Kotlin-函数(Functions)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/functions.html
    
## 1.函数定义和调用
    相比java, kotlin函数定义/声明非常方便简单
    1.函数声明定义/声明(Function Declarations):
        //Unit类型表示没有返回值
        fun demo(): Unit {
            ...
            // return Unit 或 return 是可选的                     
        }

        //可以省略Unit
        fun demo() {
            ...
            // return Unit 或 return 是可选的                     
        }

    2.单表达式函数定义/声明:
        //当函数返回单个表达式时,可省略花括号{},并用等号指定函数代码体:
        fun double(x: Int): Int = x * 2
        
        //当返回类型可由编译器推断出时,可省略返回类型:
        fun double(x: Int) = x * 2

### 1.传统调用
    调用普通函数:
        demo()

    调用成员函数:
        class Sample() {
            fun foo() { print("Foo") }
        }
        Sample().foo()

### 2.中缀调用(Infix notation)
    中缀调用就是使用[中缀标记]调用函数,非常类似于加减乘除(+ - * /)
    必须满足以下条件:
        函数作为类的成员函数 或 扩展函数
        函数必须且只有一个参数
        函数前缀有 infix 标记

    // 扩展函数-中缀表示/标记
    infix fun Int.add(i: Int): Int{
        return this + i
    } 

    // 成员函数-中缀表示/标记
    class MyInt(var a: Int){    
        infix fun add(i: Int): Int{
            return a + i
        }
    }

    fun main(args: Array<String>) {          
        println(2 add 3)  //中缀调用,输出5       
        println(2.add(3)) //传统调用,输出5

        val i = MyInt(2)
        println(i add 3)  //中缀调用,输出5
        println(i.add(3)) //传统调用,输出5
    }

## 2.函数参数    
    函数参数用Pascal表示法定义(即name: type),参数用逗号分隔,参数必须要有显式类型:
        fun myFun(p1: Int, p2: Int) {
        }

### 1.默认参数(Default Arguments)
    函数参数可以有默认值,当函数调用没有参数时,就使用默认值:
        fun myFun(p1: Int = 1, p2: Int = 2) {
        }
     
    子类覆盖方法与基类(父类)方法默认参数值相同,父类有默认参数,子类不能写默认参数:
        open class A {
            open fun foo(i: Int = 10) {            
            }
        }

        class B : A() {
            // 父类已有,子类不能有默认参数值
            override fun foo(i: Int) {      
            }
        }

### 2.命名参数(Named Arguments)    
    当函数有大量参数时调用会非常不方便:
        fun myFun(a: String = "lioil", 
                  b: Boolean = true, 
                  c: Int = 1, 
                  d: Char = 'w') {        
        }
        //修改参数c,其它参数保持默认,虽然有默认参数,但是依然麻烦!!!
        myFun("lioil",true,2)        
        //此时可用命名参数(Named Arguments)简化:
        myFun(c = 2)

### 3.参数个数可变(vararg)
    函数参数用vararg标记,可使参数个数可变:
        fun <T> asList(vararg ts: T){        
            for (t in ts) //参数ts相当于数组Array <out T>
                print("$t,")
        }

        fun main(args: Array<String>) {
            asList(1,2,3) //输出1,2,3,

            //传递数组,添加伸展(spread)操作符*
            val a = arrayOf(1, 2, 3)
            asList(0, *a, 4) //输出0,1,2,3,4,
        }

    如果vararg标记的参数不是最后一个参数,需要用[命名参数]传递其之后的参数:        
        fun <T> asList(vararg ts: T, name: String){  
            for (t in ts)
                print("$t,")
            print(name)
        }

        fun main(args: Array<String>) {            
            asList(1,2,3,name="lioil.win")//输出1,2,3,lioil.win
        }

## 3.函数种类
    Kotlin函数可在文件顶层定义/声明,无需像Java、C#、Scala那样在一个类中定义一个函数,
    所以说函数是kotlin世界的第一公民!
    此外,Kotlin函数也可在局部作用域定义,作为函数内部的函数,类的成员函数或扩展函数!

    1.本地/局部函数(Local Functions)-函数内部的函数
        Kotlin支持局部函数,即一个函数在另一个函数内部:    
        fun main(args: Array<String>) {
            val name = "lioil.win"
            fun myFun() {
            //局部函数可访问外部函数(即闭包)的局部变量name
                println(name)
            } 
            myFun() //输出 lioil.win
        }

    2.成员函数(Member Functions)是在类或对象内部定义的函数
        class Sample() {
            fun foo() { print("Foo") }
        }
        //成员函数调用
        Sample().foo()

    3.泛型函数(Generic Functions),在函数名前使用尖括号<>指定泛型
        fun <T> singletonList(item: T): List<T> {
        }

    4.尾递归函数(Tail recursive functions)
        Kotlin支持尾递归(tail recursion)函数: 使用尾递归函数替循环代码,不会有堆栈溢出的风险!
        使用tailrec修饰符标记函数,编译器会把尾递归优化成高效循环代码!
        使用tailrec修饰符的条件:
            递归调用必须是函数体的最后一个操作(即保证是尾递归)
            不能用在 try/catch/finally 块中
            目前尾部递归只在 JVM 后端中支持

        //尾递归代码
        tailrec fun findFixPoint(x: Double = 1.0): Double
                = if (x == Math.cos(x)) x else findFixPoint(Math.cos(x))
        
        //最终被编译器优化成循环代码
        private fun findFixPoint(): Double {
            var x = 1.0
            while (true) {
                val y = Math.cos(x)
                if (x == y) return y
                x = y
            }
        }

    5.内联函数(Inline Functions)、扩展函数(Extension Functions)、
    高阶函数(Higher-Order Functions)和Lambda表达式等在其它章节中...

GitHub博客：http://lioil.win/2017/06/27/Kotlin-functions.html   
Coding博客：http://c.lioil.win/2017/06/27/Kotlin-functions.html