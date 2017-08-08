---
layout: post
title: Kotlin-08.类和继承(class/Inheritance)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/classes.html
 
## 1.定义类
    和java一样，Kotlin 中使用关键字 class 声明/定义类
        class MyClass(param: type) {
        }
    类声明由类名、类头(主构造函数参数)和类体构成, 类头和类体都是可选的    
    如果没有类体，可以省略花括号:
        class MyClass

## 2.构造函数
### 1.主构造函数
    在 Kotlin 中的一个类可以有一个主构造函数、多个次构造函数！
    主构造函数是类头的一部分，由类名(可选参数)构成
        class Person constructor(name: String) {
        }

    1.省略 constructor 关键字
        如果主构造函数没有注解或者可见性修饰符(public/private等)，可以省略 constructor 关键字
        class Person(name: String) {
        }
        如果构造函数有注解或可见性修饰符，必需要 constructor 关键字:
        class Person public @Inject constructor(name: String) {
        }

    2.主构造函数的初始化代码可放到 init 初始化块中：
        class Person(name: String) {
            init {
                // 主构造函数参数可以在初始化块中使用
                logger.info("value: ${name}")
            }
            // 主构造函数参数也可以在属性初始化器中使用
            val key = name.toUpperCase()
        }

    3.在主构造函数中声明类属性(类成员变量/字段)以及初始化属性：
        class Person(val firstName: String, val lastName: String, var age: Int) {
        }
        与普通变量一样，主构造函数中声明的类属性可以是可变(var)或只读(val)

### 2.次构造函数
    在类体中也可以声明前缀有 constructor 的次构造函数:
        class Person {
            constructor(parent: Person) {
                parent.children.add(this)
            }
        }
        
    1.如果类有一个主构造函数，每个次构造函数需要委托给主构造函数，可以直接委托或者通过别的次构造函数间接委托
    委托到同一个类的另一个构造函数用 this 关键字即可:
        class Person(val name: String) {
            constructor(name: String, parent: Person) : this(name) {
                parent.children.add(this)
            }
        }

    2.如果非抽象类没有声明任何构造函数, 会自动生成无参数的主构造函数, 可见性是public
    如果不想构造函数是public，需添加 private constructor：
        class DontCreateMe private constructor () {
        }

### 3.创建类的实例对象
    和java不同，Kotlin没有new关键字, 创建一个类的实例对象：
        val person = Person("lioil")    

## 3.继承
### 1.定义
    和java类似，在 Kotlin 中所有类都有一个共同的超类(基类/父类) Any
        class Example // 从 Any 隐式继承
        Any 不是 java.lang.Objec, Any除了equals()、hashCode()和toString()外没有其它任何成员!

    1.声明一个显式超类(基类/父类):
    open表示允许其它类继承, 和Java中final相反, 默认情况下，Kotlin所有类都是final
        open class Base(p: Int)
        class Derived(p: Int) : Base(p)

    2.初始化超类(基类/父类)的构造函数
    如果类具有主构造函数，则用主构造函数的参数(并且必须)初始化基类构造函数
    如果类没有主构造函数，则每个次构造函数必须使用super关键字初始化基类型，或委托给另一构造函数
        class MyView : View {
            constructor(ctx: Context) : super(ctx)
            constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
        }

### 2.覆盖父类方法
    与Java不同，Kotlin需显式标注可覆盖的成员(open)和覆盖后的成员(override)
        open class Base {
            open fun v() {} // 如果没标注open, 则子类不允许定义相同名函数
            fun nv() {}
        }

        class Derived() : Base() {
            // 如果没标注override, 则编译器将会报错            
            override fun v() {}  
        }
        
    标记 override 相当于open，可在子类中覆盖, 如果要禁止再次覆盖，要final 关键字：
        open class AnotherDerived() : Base() {
            final override fun v() {}
        }

### 3.覆盖父类属性
    覆盖属性与覆盖方法类似,
    在父类的属性必须以 override 开头，并且父子类必须具有兼容的类型
    每个声明的属性可由具有初始化器的属性或者具有getter方法的属性覆盖
        open class Foo {
            open val x: Int get { …… }
        }

        class Bar1 : Foo() {
            override val x: Int = ……
        }

    可用var属性覆盖val属性，但反之则不行,
    因为val属性本质是只声明一个getter方法,而将其覆盖为var,只是在子类中添加一个setter方法

    可在主构造函数中使用 override 关键字覆盖父类的属性:
        interface Foo {
            val count: Int
        }

        class Bar1(override var count: Int) : Foo

### 4.覆盖规则
    在 Kotlin 中，实现继承由下述规则规定：
    如果类从直接超类继承相同成员的多个实现,它必须覆盖这个成员并提供其自己的实现:
        open class A {
            open fun f() { print("A") }
        }

        interface B {
            fun f() { print("B") } // 接口默认是open
        }

        class C() : A(), B {       
            override fun f() {
                super<A>.f() // 调用 A.f()
                super<B>.f() // 调用 B.f()
            }
        }

简书: http://www.jianshu.com/p/2f9554932f74
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/73442373   
GitHub博客：http://lioil.win/2017/06/18/Kotlin-classes.html   
Coding博客：http://c.lioil.win/2017/06/18/Kotlin-classes.html