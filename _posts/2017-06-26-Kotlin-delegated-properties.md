---
layout: post
title: Kotlin-20.代理/委托属性(delegated properties)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/delegated-properties.html
    
## 1.委托属性
    一些常见的属性类型:
        懒加载属性(lazy properties): 只在首次访问时计算属性值;
        可观察属性(observable properties): 监听器可以收到此属性变化的通知;
        一个映射(map)存储多个属性,而不是一个属性对应一个字段!

    为涵盖这些情况,Kotlin支持委托属性(delegated properties):
        import kotlin.reflect.KProperty //导入库
        class Example {
        //by Delegate()表示: 属性p的get()和set()会被委托给Delegate的getValue()和setValue()
            var p: String by Delegate()   
        }
        class Delegate() {
            // 取代Example的属性p的get()
            operator fun getValue(t: Any?, prop: KProperty<*>): String {
                // 第一个参数t: 被代理的对象(本例中Example对象)
                // 第二参数prop: 被代理的对象的属性(本例中Example对象的属性p)
                return "$t, ${prop.name}"
            }

            // 取代Example的属性p的set()
            operator fun setValue(t: Any?, prop: KProperty<*>, value: String) {
                // 第三个参数: 被代理的对象的属性值(本例中Example对象的属性p的值)
                println("$t, ${prop.name}, $value")
            }
        }
        fun main(args: Array<String>) {
            val e = Example()
            println(e.p) //调用get方法 输出 Example@6267c3bb, p
            e.p = "MyVal"  //调用set方法 输出 Example@6267c3bb, p, MyVal
        }

## 2.懒加载属性(lazy properties)
    by lazy({ })是接受lambda并返回一个Lazy<T>对象的函数,
    返回对象可作为委托,实现了懒加载属性(lazy properties):   
        val a: String by lazy {
            //第一次调用会执行该lamda表达式,并记录结果 
            //后续调用只返回已记录的结果
            println("******")
            "Hello"
            "返回结果" //lamda表达式最后一行作为lazy函数返回值,记录结果
        }
        fun main(args: Array<String>) {
            println(a)
            println(a)
        }
        输出：
        ******
        "返回结果"
        "返回结果"

    默认情况下,lazy{}是同步锁住(synchronized): 只能有一个线程执行,其它线程必须等待!
    如果需要多个线程同时执行lazy{},那么传递参数LazyThreadSafetyMode.PUBLICATION给lazy()函数
    如果确定lazy{}总是单个线程,那么传递参数LazyThreadSafetyMode.NONE,不保证线程安全!
        val a: String by lazy(LazyThreadSafetyMode.NONE){            
            ...
        }
        val a: String by lazy(LazyThreadSafetyMode.PUBLICATION){           
            ...
        }

    自kotlin 1.1起,可将局部变量声明为委托属性,例如lazy懒加载属性:
        fun example(computeFoo: () -> Foo) {
            val memoizedFoo by lazy(computeFoo)

            if (someCondition && memoizedFoo.isValid()) {
                memoizedFoo.doSomething()
            }
        }

## 3.可观察属性(observable properties)
    Delegates.observable()有两个参数: 初始值、属性变化时的回调(handler)    
        import kotlin.properties.Delegates //导入库
        class User {
             //如果要拦截(veto否决)赋值,就用vetoable()取代observable()!
            var name: String by Delegates.observable("initName") {
             //回调有三个参数：被观察的属性、属性旧值和属性新值
                prop, old, new -> println("$old ---> $new")
            }
        }
        fun main(args: Array<String>) {
            val user = User()
            user.name = "name111"
            user.name = "name222"
        }
        输出：
        initName ---> name111
        name111 ---> name222

## 4.一个映射(map)存储多个属性(Storing Properties in a Map)
    一个映射(map)存储多个属性,这时可用映射实例对象作为委托,实现委托属性!
        class User(val map: Map<String, Any?>) {
            val name: String by map
            val age: Int     by map
        }
        //1.使用map代理多个属性
        val user = User(mapOf(
            "name" to "lioil",
            "age"  to 24
        ))
        //2.从map中读取多个属性值
        println(user.name) // 输出 lioil
        println(user.age)  // 输出 24

        //把只读Map改为可变MutableMap,也适用于var属性
        class MutableUser(val map: MutableMap<String, Any?>) {
            var name: String by map
            var age: Int     by map
        }

简书：http://www.jianshu.com/p/2464a5106f12
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/73751666   
GitHub博客：http://lioil.win/2017/06/26/Kotlin-delegated-properties.html   
Coding博客：http://c.lioil.win/2017/06/26/Kotlin-delegated-properties.html