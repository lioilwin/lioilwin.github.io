---
layout: post
title: Kotlin-对象(object expressions/declarations)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/object-declarations.html
 
    有时要修改某类,但不改变原类并且不显式声明子类.
    对于这种情况,Java使用匿名内部类,
    而Kotlin使用对象表达式(object expressions),
    对象声明(object declarations),
    伴生对象(companion object)

## 1.对象表达式(Object expressions)
    1.定义
    创建继承自某类的匿名类对象(对象表达式),
    超类(父类)有构造函数,必须传递参数给它,多个超类可用逗号分隔:
        open class A(x: Int) {
            public open val y: Int = x
        }

        interface B {            
        }

        fun main(args: Array<String>) {
            // A(1) 子类必须传递参数给父类的构造函数
            val ab: A = object : A(1), B {
                override val y = 15
            }
            print(ab.y)
        }

    2.如果没有超类(父类),可简写:
        fun main(args: Array<String>) {       
            val obj = object {
                var x: Int = 1
                var y: Int = 2
            }
            print(obj.x + obj.y)
        }

    3.作用域(访问权限)
    3.1.外部访问内部
        如果匿名对象作为本地/局部类型 或 私有类型,可正常使用!
        如果匿名对象作为公有函数返回类型 或 公有属性类型,
        那么实际类型是超类(没有超类,就是Any),无法访问匿名对象的成员!
            class C {
                // 私有函数,返回类型是匿名对象类型
                private fun foo() = object {
                    val x: String = "x"
                }

                // 默认公有函数,返回类型是Any
                fun pFoo() = object {
                    val x: String = "x"
                }

                fun bar() {
                    val x1 = foo().x   // 正确: 类型是object{..},可以访问x
                    val x2 = pFoo().x  // 错误: 类型是Any,无法访问x
                }
            }

    3.2.内部访问外部
        像Java匿名内部类一样,对象表达式可访问<包含它的作用域>
        (kotlin不需要像Java一样定义final常量,
        个人猜想(不一定正确): 因为kotlin所有类型都是对象,不像java基本类型存储在栈内存,
        java函数/方法结束后栈内存被回收,基本类型值也就不在了,因此java要定义final)   
            fun countClicks(window: JComponent) {
                //kotlin不需要像Java一样定义final常量
                var clickCount = 0
                var enterCount = 0

                window.addMouseListener(object : MouseAdapter() {
                    override fun mouseClicked(e: MouseEvent) {                         
                        clickCount++
                    }

                    override fun mouseEntered(e: MouseEvent) {
                        enterCount++
                    }
                })           
            }

## 2.对象声明/单例模式(Object declarations/Singleton)
    Kotlin(继Scala之后)使单例模式(Singleton)变得很容易,称为对象声明(Object declarations):
        //定义单例对象(对象声明)
        object DataProviderManager {            
            val allDataProviders: Collection<DataProvider>               

            fun registerDataProvider(provider: DataProvider) {
                ...             
            }
        }

        //使用单例对象
        DataProviderManager.allDataProviders
        DataProviderManager.registerDataProvider(...)

        //单例对象继承超类(父类)
        object DefaultListener : MouseAdapter() {
            override fun mouseClicked(e: MouseEvent) {                
            }

            override fun mouseEntered(e: MouseEvent) {
            }
        }

## 3.伴生对象(companion object)
    伴生对象(companion object),类似于Java类的static静态成员：
        //定义,可以省略伴生对象名Obj
        class MyClass {     
            companion object Obj{
                val a = 1
                fun crt(): MyClass = MyClass()
            }            
            val b = 2
        }
       
        //直接类名调用伴生对象(类似于Java的静态成员)    
        fun main(args: Array<String>) {  
            println(MyClass.a)       //输出1
            println(MyClass.crt().b) //输出2
            println(MyClass.().b)    //输出2
        }

    尽管伴生对象看起来像java类的static静态成员,但它们在运行时仍然是对象成员,    
    例如可以实现接口:
        interface Factory<T> {
            fun create(): T
        }

        class MyClass {
            companion object : Factory<MyClass> {
                override fun create(): MyClass = MyClass()
            }
        }
    在JVM平台,使用@JvmStatic注解,使伴生对象成员成为真正的静态方法和字段！        

GitHub博客：http://lioil.win/2017/06/25/Kotlin-object.html   
Coding博客：http://c.lioil.win/2017/06/25/Kotlin-object.html