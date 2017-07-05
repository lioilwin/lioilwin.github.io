---
layout: post
title: Kotlin-09.类属性和字段(Properties/Fields)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/properties.html
 
## 1.声明类属性
    类属性可用关键字var声明为可变的, val声明为只读:
        class Address {
            var name: String = ...
            var street: String = ...
            var city: String =  ...         
        }

    使用类属性,和使用Java类字段(成员变量)差不多:
        fun copyAddress(address: Address): Address {
            val result = Address() // Kotlin没有new关键字
            result.name = address.name
            result.street = address.street       
            return result
        }

## 2.属性访问器Getters和Setters
    声明属性的完整语法:
        var <propertyName>[: <PropertyType>] [= <initializer>]
            [<getter>]
            [<setter>]
    其中初始器<initializer>、<getter>和<setter>都是可选的!
    如果属性类型:<PropertyType>可从初始器(或者从getter返回值)推断出,也可省略!

    1.默认访问器get和set方法   
        var i = 1 // 推断类型Int、默认getter和setter
        val c = 1 // 推断类型Int 、默认getter

    2.自定义访问器get和set方法
        val isEmpty: Boolean
            get() = this.size == 0   

        var stringRepresentation: String
            get() = this.toString()
            set(value) {
                calxx(value) //按惯例,setter参数名是value,但也可自定义！
            }

        val isEmpty get() = this.size == 0  // 如能推断出属性类型,则可省略

    3.改变访问器get和set可见性或者对其注解,但不改变默认实现:
        var setterVisibility: String = "abc"
            private set //私有,不改变默认实现

        var setterWithAnnotation: Any? = null
            @Inject set //注解,不改变默认实现

## 3.幕后字段和属性
    1.隐式幕后字段
    Kotlin类不能有字段,但有时在自定义的访问器中需要字段,
    为此自动提供隐式幕后字段(backing field),可field标识符访问,
    field只能用在属性的访问器中.
        var counter = 0 //初始值直接写入到幕后字段
            set(value) {
                if (value >= 0)
                field = value
            }

    2.显式幕后属性
    如果隐式幕后字段不符合需求,可用显式幕后属性(backing property)
        private var _table: Map<String, Int>? = null //幕后属性
        public val table: Map<String, Int>
            get() {
                if (_table == null) {
                    _table = HashMap() //类型参数已推断出
                }
                return _table ?: throw AssertionError("Set to null by another thread")
            }
   通过默认getter和setter访问私有属性会被优化,不会引入函数调用开销!

## 4.属性的初始化
    1.编译期常量
    属性用const修饰符标记,称为编译期常量Compile-Time Constants,需满足以下要求:
        位于顶层或者是object的成员
        用 String 或原生类型初始化
        没有自定义getter
    
    const val DE: String = "This subsystem is deprecated"
    //编译期常量属性可用在注解中
    @Deprecated(DE) fun foo(){        
    }

    2.延迟初始化属性
    一般情况,属性声明为非空类型,必须在构造函数中初始化。
    然而这不方便,为此可用lateinit修饰符非空属性:
        public class MyTest {
            lateinit var subject: TestSubject

            @SetUp fun setup() {
                subject = TestSubject()
            }

            @Test fun test() {
                subject.method()  // 直接解引用
            }
        }
    lateinit只能用在类体中的var属性,
    该属性不能自定义getter和setter方法,
    该属性必须是非空类型,不能是原生类型

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/73478111   
GitHub博客：http://lioil.win/2017/06/19/Kotlin-properties.html   
Coding博客：http://c.lioil.win/2017/06/19/Kotlin-properties.html