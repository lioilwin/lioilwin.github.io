---
layout: post
title: Kotlin-扩展函数和属性(extensions)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/extensions.html
 
## 1.扩展(extensions)
    在不修改原类的情况下,
    Kotlin能给一个类扩展新功能,无需继承该类,也不用任何设计模式(如装饰模式等),
    Kotlin支持扩展函数和扩展属性!

    为什么要使用扩展(动机):
        在Java中,有很多工具类如java.util.Collections,使用很繁琐：
            // Java
            Collections.swap(list, Collections.binarySearch(list, 
                    Collections.max(otherList)), Collections.max(list))

        静态导入Collections类,简化写法:
            // Java
            swap(list, binarySearch(list, max(otherList)), max(list))

        静态导入使用依然很麻烦,如果能给list类添加扩展函数就好了:      
            list.swap(list.binarySearch(otherList.max()), list.max())

## 2.类-扩展函数
### 1.定义
    为MutableList类扩展一个swap函数:
        fun MutableList<Int>.swap(index1: Int, index2: Int) {
            val tmp = this[index1]  //this: 当前MutableList对象 
            this[index1] = this[index2]
            this[index2] = tmp
        }    
    对MutableList对象调用swap函数:
        val list = mutableListOf(1, 2, 3)
        list.swap(0, 2)

    MutableList泛化类型:
        //为在表达式中使用泛型,要在函数名前添加泛型参数!
        fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
            val tmp = this[index1]
            this[index1] = this[index2]
            this[index2] = tmp
        }

### 2.静态解析(没有多态)
    扩展不能真正修改类,即没有在一个类中插入新成员!
    扩展函数是静态解析分发的,不是虚函数(即没有多态),调用只取决于对象的声明类型!
    1.调用是由对象声明类型决定,而不是由对象实际类型决定!
        open class C
        class D: C()
        fun C.foo() = "c"
        fun D.foo() = "d"
        fun printFoo(c: C) {
            println(c.foo()) //扩展函数是静态解析的,不是虚函数(即没有多态)
        }
        fun main(args: Array<String>) {
            printFoo(D()) //输出"c",扩展函数调用只取决于参数c的声明类型 
        }

    2.类的成员函数和扩展函数-同名同参数:
        class C {
            fun foo() { println("member") }
        }
        fun C.foo() {
            println("extension") 
        }
        fun main(args: Array<String>) {
            val c = C()
            println(c.foo()) //输出“member”
        }

    3.类的成员函数和扩展函数-同名不同参数:
        class C {
            fun foo() { println("member") }
        }
        fun C.foo(i: Int) {
            println("extension")
        }
        fun main(args: Array<String>) {
            val c = C()
            println(c.foo(2)) //输出"extension"
        }

### 3.可空接收者
    可null的类型定义扩展,即使对象为null,也可在对象上调用!
        fun Any?.toString(): String {
            if (this == null) return "null"
            return toString()
        }

## 2.类-扩展属性
    和扩展函数类似,Kotlin也支持扩展属性:
        val <T> List<T>.lastIndex: Int // 不能初始化
            get() = size - 1 // 只能由getters/setters显式提供

        val Foo.bar = 1 // 错误：扩展属性不能有初始化器
            get() = 1

    由于扩展没有在类中插入新成员,因此扩展属性无法使用幕后字段,
    这就是为什么扩展属性不能有初始化器,只能由getters/setters显式提供!

## 3.伴生对象-扩展函数和属性
    可为伴生对象定义扩展函数和属性:
        class MyClass {
            companion object { }  //伴生对象
        }

        fun MyClass.Companion.foo() {
            // ……
        }

        MyClass.foo() //用类名调用

## 4.作用域
### 1.扩展直接在包中
    在顶层定义扩展(即直接在包中):
        package foo.bar
        fun Baz.goo() {
            ...            
        }

    在其它包调用:
        package com.example.usage
        import foo.bar.goo //导入所有名为“goo”的扩展
        // 或者 import foo.bar.*
        fun usage(baz: Baz) {
            baz.goo()
        }

### 2.扩展作为类成员
    在一个类内部可为另一个类声明扩展,   
    扩展声明所在的类称为分发接收者(dispatch receiver),
    扩展函数调用所在类称为扩展接收者(extension receiver)

    1.定义
        class D { //扩展接收者(extension receiver)
            fun f() { …… }
        }

        class C { //分发接收者(dispatch receiver)
            fun f() { …… }

            fun D.foo() {
               this@C.f() //分发接收者 C.f()
               f()        //扩展接收者 D.f()
            }

            fun call(d: D) {
                d.foo()   //调用扩展函数
            }
        }

    2.继承-覆盖
    成员扩展可声明为open,并在子类中被覆盖,
    对分发接收者是虚拟的(多态),但对扩展接收者是静态的!
        open class D {
        }
        class D1 : D() {
        }

        open class C {
            open fun D.foo() {
                println("D.foo in C")
            }
            open fun D1.foo() {
                println("D1.foo in C")
            }
            fun call(d: D) {
                d.foo()   // 调用扩展函数
            }
        }
        class C1 : C() {
            override fun D.foo() {
                println("D.foo in C1")
            }
            override fun D1.foo() {
                println("D1.foo in C1")
            }
        }
        C().call(D())   // 输出 "D.foo in C"
        C().call(D1())  // 输出 "D.foo in C", 扩展接收者静态解析(非多态)
        C1().call(D())  // 输出 "D.foo in C1",分发接收者虚拟解析(多态)

GitHub博客：http://lioil.win/2017/06/21/Kotlin-extensions.html   
Coding博客：http://c.lioil.win/2017/06/21/Kotlin-extensions.html