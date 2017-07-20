---
layout: post
title: Kotlin-45.Java调用kotlin之三(Call Kotlin from Java)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/java-to-kotlin-interop.html

## 8.@JvmName解决java方法签名相同(Handling signature clashes)    
    最突出的例子是由于类型擦除(type erasure)引发:
        // 类型擦除: 无法区分List<String>和List<Int>
        fun List<String>.filterValid(): List<String>
        fun List<Int>.filterValid(): List<Int>
        这两个函数在java中不能同时定义,因为它们的JVM签名相同: filterValid(Ljava/util/List;)Ljava/util/List

    在Kotlin中用相同名称,需要用@JvmName标注其中的一个(或两个),并指定不同名称:
        fun List<String>.filterValid(): List<String>

        @JvmName("filterValidInt")
        fun List<Int>.filterValid(): List<Int>

        在Kotlin中,可以用相同名称filterValid()访问;
        在Java中,需要分别用filterValid()和filterValidInt()访问

    同样注解@JvmName也适用于属性x和函数getX():
        val x: Int
            @JvmName("getX_prop")
            get() = 15

        fun getX() = 10

        在Java中,需要分别用getX_prop()和getX()访问
        

## 9.Java方法重载(Overloads Generation)
    如果Kotlin函数的参数有默认值并且使用@JvmOverloads注解,
    那么在Java中多个重载方法, 示例如下:
        @JvmOverloads fun f(a: String, b: Int = 0, c: String = "abc") {
        }

        // kotlin函数的每一个有默认值的参数,都会重载生成一个额外java方法:    
        void f(String a, int b, String c) {            
        }
        void f(String a, int b) {            
        }
        void f(String a) {            
        }

    该注解也适用于构造函数和静态方法, 但不能用于抽象方法(包括接口的方法)

    对于次构造函数(Secondary Constructors), 如果所有参数都有默认值,
    那么会生成一个公有public的无参构造函数(没有@JvmOverloads注解也会生效)!

## 10.受检异常(Checked Exception)
    从前几章《kotlin-33.异常(Exception)》可知,Kotlin没有受检异常!
    所以Kotlin函数签名不会声明抛出异常(throws Exception),例如:    
        // kotlin (example.kt), 抛出异常
        package demo
        fun foo() {
            throw IOException()
        }

        // kotlin编译生成的Java方法
        public void foo() { // 错误: foo()没有声明throws IOException
            throw IOException()
        }

    因为由kotlin函数生成的Java方法foo()没有声明throws IOException, 所以Java编译器报错!
    为了解决这个问题,需要在Kotlin中使用@Throws注解(相当于在Java中声明throws IOException)
        // kotlin
        @Throws(IOException::class)
        fun foo() {
            throw IOException()
        }

        // kotlin编译生成的Java方法
        public void foo() throws IOException {
            throw IOException()
        }

## 11.型变泛型(Variant generics)
    当Kotlin类使用声明处型变(declaration-site variance)时,在Java中有两种用法!
    示例:
        // kotlin
        class Box<out T>(val value: T)
        interface Base
        class Derived : Base

        fun boxDerived(value: Derived): Box<Derived>{            
        }
        fun unboxBase(box: Box<Base>): Base {            
        }
        unboxBase(boxDerived("s")) // 正确: 在Java中Box<Base>泛型是不型变的!

        // 将上述kotlin函数转换成Java方法       
        Box<Derived> boxDerived(Derived value) {            
        }
        Base unboxBase(Box<Base> box) {            
        }
        unboxBase(boxDerived("s")) // 错误: 因为在Java中Box<Base>泛型是不型变的!

        //使用Java通配符类型<? extends Base>模拟kotlin声明处型变
        Base unboxBase(Box<? extends Base> box) {            
        }
        unboxBase(boxDerived("s")) // 正确

    此外, 对于协变定义的Box(在kotlin中Box<in T>), 在java中使用Box<? extends Super>
    注意：当参数类型是final时,通配符? extends没有意义,
            例如在Box<String>中的String类是final,没有子类(不能被继承extends)

    如果在默认没有通配符处要求java泛型通配符, 可以使用@JvmWildcard注解:
        // kotlin函数
        fun boxDerived(value: Derived): Box<@JvmWildcard Derived> {            
        }

        // 转换成java方法 
        Box<? extends Derived> boxDerived(Derived value) {        
        }

    相反,如果不需要泛型通配符,可以使用@JvmSuppressWildcards注解;
    @JvmSuppressWildcards不仅可用于单个类型参数,还可用于整个声明(如函数或类),从而抑制其中的所有通配符!
        // kotlin函数
        fun unboxBase(box: Box<@JvmSuppressWildcards Base>): Base {            
        }

        // 转换成java方法 
        Base unboxBase(Box<Base> box) {            
        }

## 12.Nothing类型翻译(Translation of type Nothing)
    类型Nothing是Kotlin特有的,在Java中没有对应类型!
    每个Java引用类型(包括java.lang.Void)都接受null, 但是kotlin的Nothing不行!
    Nothing类型不能在Java世界中准确表示,所以Nothing类型在java中会消失(原始类型raw type):
        // kotlin的Nothing类型
        fun emptyList(): List<Nothing> = listOf()
        
        // 翻译成转换成java方法, List<Nothing>变成原始类型List, Nothing类型消失了
        List emptyList() {            
        }

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/75452680   
GitHub博客：http://lioil.win/2017/07/19/Kotlin-kotlinInJava3.html   
Coding博客：http://c.lioil.win/2017/07/19/Kotlin-kotlinInJava3.html