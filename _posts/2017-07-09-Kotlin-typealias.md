---
layout: post
title: Kotlin-37.类型别名(typealias)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/type-aliases.html

## 类型别名(Type alias)
    自kotlin 1.1起,类型别名(Type alias)为现有类型提供替代名称,
    如果类型名称太长,可引入较短别名替代原类型名!

    1.为集合类型(collection type)提供别名:
        //缩短较长泛型类型(generic type)是很有吸引力的
        typealias NodeSet = Set<Network.Node>
        typealias FileTable<K> = MutableMap<K, MutableList<File>>

    2.为函数类型(function type)提供别名(alias):
        typealias MyHandler = (Int, String, Any) -> Unit
        typealias Predicate<T> = (T) -> Boolean

    3.为内部类(inner)和嵌套类(nested)创建别名:
        class A {
            inner class Inner
        }
        class B {
            inner class Inner
        }
        typealias AInner = A.Inner
        typealias BInner = B.Inner

    提示:
    类型别名不会引入新类型,等效于相应底层类型,编译器会把别名翻译为原有类型:
        //添加别名声明typealias Predicate<T>后,Kotlin编译器总是把它扩展为(Int) -> Boolean     
        typealias Predicate<T> = (T) -> Boolean
        fun foo(p: Predicate<Int>) = p(42) 
        
        fun main(args: Array<String>) {
            //类型别名和原有类型,可以相互替代,因为编译器会把别名翻译为原有类型
            val f: (Int) -> Boolean = { it > 0 }
            println(foo(f)) // 输出 "true"

            val p: Predicate<Int> = { it > 0 }
            println(listOf(1, -2).filter(p)) // 输出 "[1]"
        }

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/74906383   
GitHub博客：http://lioil.win/2017/07/09/Kotlin-typealias.html   
Coding博客：http://c.lioil.win/2017/07/09/Kotlin-typealias.html