---
layout: post
title: Kotlin-35.反射(Reflection)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/reflection.html

## 1.反射概念(Reflection)
    反射是一套语言功能库,允许在程序运行时自省/内省(introspect)程序结构!
    与java语言不同, 函数和属性是Kotlin世界的一等公民,
    对它们自省与函数式或响应式风格密切相关(functional/reactive style)!

    自省/内省(introspect): 在运行时获取类,属性,函数的名称和类型!

    提示:
        在Java平台(JVM)上使用kotlin反射功能,需要在项目中添加kotlin反射库的jar包(kotlin-reflect.jar)!        
        因为kotlin反射库JAR文件(kotlin-reflect.jar)是单独分发的,不包含在kotlin标准库中,
        这是为了减少[不使用反射功能的应用]所需运行库的大小!

## 2.类引用(Class References)
    kotlin最基本的反射功能是获取Kotlin类的运行时引用(runtime reference)!
    获取静态已知的Kotlin类引用,可用[类字面值语法](class literal syntax):
        val c = MyClass::class

    kotlin类引用是KClass类型的一个值!       
    Java类引用和Kotlin不同,获取Java类引用要在KClass实例对象上使用.java属性:
        fun main(args: Array<String>) {
            println(String::class)      //输出class kotlin.String
            println(String::class.java) //输出class java.lang.String
        }

    自kotlin 1.1起,开始有[绑定类引用](Bound Class References),
    使用对象作为接收者(::class语法)获取指定对象的类引用:
        val widget: Widget = ...
        assert(widget is GoodWidget) {
        //获取widget对象的精确类(实际类)的引用, GoodWidget 或 BadWidget
            "Bad widget: ${widget::class.qualifiedName}"
        }
        
## 3.函数引用(Function References)
    有一个命名函数声明如下:
        fun isOdd(x: Int) = x % 2 != 0

    很容易直接调用它isOdd(5),但也可以把它作为一个值传递,例如传给另一个函数,
    为此,可使用 ::操作符传递一个函数:
        fun main(args: Array<String>) {
            val numbers = listOf(1, 2, 3)
            println(numbers.filter(::isOdd)) // 输出 [1, 3]
        }
        //filter函数的参数类型是 (Int) -> Boolean,
        //而isOdd函数类型也是(Int) -> Boolean, 所以程序正常运行!

    当从上下文可知函数类型时,::可用于重载函数,例如:
        fun isOdd(x: Int) = x % 2 != 0
        fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"

        fun main(args: Array<String>) {
            val numbers = listOf(1, 2, 3)
            println(numbers.filter(::isOdd)) //引用isOdd(x: Int)

            //把方法引用存储在已知类型的变量中
            val predicate: (String) -> Boolean = ::isOdd //引用isOdd(x: String)
        }

    使用类的成员函数或扩展函数时需要限定,例如:
        String::toCharArray 为String类型提供了一个扩展函数: String.() -> CharArray
    
    组合函数(Function Composition)的示例如下:
        fun isOdd(x: Int) = x % 2 != 0
        fun length(s: String) = s.length

        fun <A, B, C> compose(f: (B) -> C, g: (A) -> B): (A) -> C {
            return { x -> f(g(x)) }
        }

        //本例功能是输出在数组/集合中长度为奇数的元素
        fun main(args: Array<String>) {
            val strings = listOf("a", "ab", "abc")
            
            //oddLength是组合函数/lambda表达式,就是x -> isOdd(length(x)) 
            val oddLength = compose(::isOdd, ::length)
            println(strings.filter(oddLength)) // 输出 "[a, abc]"
            
            //等价于
            println(strings.filter{
                x -> isOdd(length(x)) // 输出 "[a, abc]"
            })
        }

## 4.属性引用(Property References)
    在Kotlin中作为一级对象(first-class object)去访问属性,也可用::prop操作符:
        var x = 1
        fun main(args: Array<String>) {
            println(::x.get()) // 输出 "1"
            ::x.set(2)
            println(x)         // 输出 "2"
            println(::x.name)  // 输出 "x"
        }
        [表达式::x]的类型是KProperty<Int>,允许使用get()/set()读写值,或者使用name来获取属性名!
        对于可变属性var y = 1, ::y的类型是KMutableProperty<Int>,允许使用set()方法!

    属性引用可用在不需要参数的函数:
        fun main(args: Array<String>) {
            val strs = listOf("a", "bc", "def")
            println(strs.map(String::length)) // 输出 [1, 2, 3]
        }

    访问类成员的属性,可用class::prop.get/set限定它:
        class A(val p: Int)

        fun main(args: Array<String>) {
            val prop = A::p
            println(prop.get(A(1))) // 输出 "1"
            println(A::p.get(A(1))) // 输出 "1" 
        }

    访问类的扩展属性,也可用class::prop.get/set限定它:
        val String.lastChar: Char
            get() = this[length - 1]

        fun main(args: Array<String>) {
            println(String::lastChar.get("abc")) // 输出 "c"
        }

## 5.与Java反射互操作(Interoperability Java Reflection)
    在Java平台上,标准库包含反射类的扩展,提供了与Java反射对象之间映射(参见kotlin.reflect.jvm包)
    1.获取与Kotlin属性对应的Java字段和get方法:
        import kotlin.reflect.jvm.*
        class A(val p: Int)

        fun main(args: Array<String>) {
            println(A::p.javaGetter) // 输出 "public final int A.getP()"
            println(A::p.javaField)  // 输出 "private final int A.p"
        }
    2.获取与Java类对应的Kotlin类,可用.kotlin扩展属性:
        fun getKClass(o: Any): KClass<Any> = o.javaClass.kotlin

## 6.构造函数引用(Constructor References)
    构造函数也可以像方法和属性一样引用,该引用与构造函数接受相同参数并且返回相应类型, 
    使用::操作符+类名来引用构造函数:   
        class Foo
        
        //factory: () -> Foo 代表Foo类的构造函数
        fun function(factory: () -> Foo) {
            val x: Foo = factory()
        }

        //::Foo 代表类Foo的构造函数引用
        function(::Foo)

## 7.绑定函数与属性引用(Bound Function and Property Reference)
    自kotlin 1.1起,开始有[绑定函数与属性引用](Bound Function and Property Reference)
    1.绑定函数引用:
        //传统用法
        val numberRegex = "\\d+".toRegex()
        println(numberRegex.matches("29")) // 输出“true”   

        //绑定函数引用,isNumber存储/绑定函数引用
        val isNumber = numberRegex::matches
        println(isNumber("29")) // 输出“true”

        //直接调用函数引用
        val strings = listOf("abc", "124", "a70")
        println(strings.filter(numberRegex::matches)) // 输出“[124]”

        //引用的接收者的类型不再是参数
        val isNumber: (CharSequence) -> Boolean = numberRegex::matches
        val matches: (Regex, CharSequence) -> Boolean = Regex::matches
    
    2.绑定属性引用:
        val prop = "abc"::length
        println(prop.get())   // 输出“3”

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/74852344   
GitHub博客：http://lioil.win/2017/07/08/Kotlin-reflection.html   
Coding博客：http://c.lioil.win/2017/07/08/Kotlin-reflection.html