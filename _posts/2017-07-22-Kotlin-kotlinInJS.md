---
layout: post
title: Kotlin-48.JavaScript调用Kotlin(Call Kotlin from JavaScript)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/js-to-kotlin-interop.html

在JS平台上, kotlin代码会被Kotlin编译器转换成JavaScript类/函数/属性;   
因此在JavaScript代码中可以自由地调用kotlin代码, 然而还有一些细节需要注意!

## 1.独立JavaScript对象隔离声明(Isolating declarations in a separate JavaScript object)
    为了防止损坏全局对象,Kotlin创建一个模块(module)对象,它包含当前模块中所有Kotlin声明;
    如果kotlin模块名是myModule,那么在JavaScript中可通过myModule对象使用kotlin声明:
        // kotlin模块名是myModule
        fun foo() = "Hello"

        // 在JavaScript中调用, myModule是kotlin模块
        alert(myModule.foo());

    当Kotlin模块(module)编译为JavaScript模块(module)时,不适用于上述情况!
    在此情况下,Kotlin不会创建的模块对象,而是将kotlin声明作为相应类型的JavaScript模块,对外暴露:
        // myModule是kotlin模块,被编译为JavaScript模块
        alert(require('myModule').foo());

## 2.包结构(Package structure)
    Kotlin将其包结构暴露给JavaScript,
    因此除非在根包中定义声明, 否则必须在JavaScript中使用完整限定名,例如:
        // kotlin
        package my.qualified.packagename
        fun foo() = "Hello"

        // 在JavaScript中调用
        alert(myModule.my.qualified.packagename.foo());

## 3.@JsName注解(@JsName annotation)
    在某些情况下(如为了支持重载),Kotlin编译器会修改生成的JavaScript的函数名/属性名,
    使用@JsName注解,控制生成JavaScript的函数名/属性名,:
        // kotlin模块"kjs"
        class Person(val name: String) {
            fun hello() {
                println("Hello $name!")
            }

            @JsName("helloWithGreeting")
            fun hello(greeting: String) {
                println("$greeting $name!")
            }
        }

        // 在JavaScript中
        var person = new kjs.Person("Dmitry");  // 引用模块"kjs"
        person.hello();                         // 输出"Hello Dmitry!"
        person.helloWithGreeting("Servus");     // 输出"Servus Dmitry!"
        //如果没有指定@JsName注解,相应函数名会添加从函数签名计算而来的后缀,例如hello_61zpoe$

    注意: 1.Kotlin编译器不会对external声明使用@JsName注解修饰
          2.继承自external类的非external类,被覆盖的函数也不会被@JsName修饰!

    @JsName参数是一个字符串字面值常量(有效标识符),如果将非标识符字符串传递给@JsName,编译器会报错:
        @JsName("new C()")  // 报错, new C()不是字符串字面值常量
        external fun newC()

## 4.在JavaScript中表示Kotlin类型(Representing Kotlin types in JavaScript)
    1.Kotlin数字类型(kotlin.Long除外)都映射到JavaScript Number
    2.kotlin.Char映射到JavaScript Number,表示字符码
    3.Kotlin在运行时无法区分数字类型(kotlin.Long除外),即以下代码能工作:
        fun f() {
            val x: Int = 23
            val y: Any = x
            println(y as Float)
        }
    4.Kotlin保留了kotlin.Int, kotlin.Byte, kotlin.Short, kotlin.Char, kotlin.Long的溢出语义
    5.JavaScript没有64位整型数, 所以kotlin.Long没有映射到任何JavaScript类型对象, 它由Kotlin类模拟
    6.kotlin.String 映射到 JavaScript String
    7.kotlin.Any 映射到 JavaScript Object (即new Object(), {}等)
    8.kotlin.Array 映射到 JavaScript Array
    9.Kotlin 集合(即List, Set, Map等)没有映射到任何JavaScript类型
    10.kotlin.Throwable 映射到 JavaScript Error
    11.Kotlin 在JavaScript中保留了惰性对象初始化
    12.Kotlin 在JavaScript中没有实现顶层属性的惰性初始化

简书：http://www.jianshu.com/p/a377d6284f1c
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/75808450   
GitHub博客: http://lioil.win/2017/07/22/Kotlin-kotlinInJS.html   
Coding博客: http://c.lioil.win/2017/07/22/Kotlin-kotlinInJS.html