---
layout: post
title: Kotlin-23.内联函数(Inline Functions)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/inline-functions.html
    
## 1.内联函数的概念和作用
    使用高阶函数(higher-order functions)会导致一些性能的损耗:
        每个函数都是对象,且会捕获闭包closure(即变量会在函数体内被访问),
        函数对象/类会增加内存分配,而且虚拟调用栈也会增加额外内存开销！

    可用内联函数(inline function)消除这些额外内存开销,
    说白了就是在调用处插入函数体代码,以此减少新建函数栈和对象的内存开销!   
    被inline修饰的函数或lambda表达式,在调用时都会被内联(在调用处插入函数体代码)
        inline fun lock<T>(lock: Lock, body: () -> T): T {
            lock.lock()
            try {
                return body()
            }
            finally {
                lock.unlock()
            }        
        }

        print("开始************")
        lock(l) { foo() }
        print("结束************")

        //编译器实际生成以下代码(就是直接把代码插入到调用处):     
        print("开始************")
        l.lock()
        try {
            foo()
        }
        finally {
            l.unlock()
        }
        print("结束************")

    很明显,内联可能导致编译器生成的代码增加,但如果使用得当(不内联大函数),在性能上有很大提升,
    尤其是在循环的megamorphic处调用!
    
    禁用内联(noinline)
    如果内联函数的有些(作为参数)lambda表达式不是内联,可用noinline修饰符函数参数!
        inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) {
            // ……
        }

## 2.非局部返回(Non-local returns)
    在内联的lambda表达式中退出包含它的函数称为非局部返回(Non-local returns)!
    在Kotlin中,正常return(没有限定符@)表示退出一个命名或匿名函数
    所以要退出lambda表达式,return需要加限定符@标签,
    在非内联的lambda表达式中禁用正常return(没有限定符@):
        fun f1(p: ()->Unit) {
            p()
        }

        inline fun f2(p: ()->Unit){
            p()
        }

        fun main(args: Array<String>) {
            f1{
                //f2和lambda表达式都不是内联
                println("Hello, world!")
                return //编译错误,此处不允许return
            }
            
            f2{
                //f2是内联函数,lambda表达式也是内联
                println("Hello, world!")
                return //编译正确,可以return
            }
            
            listOf(1,2,3).forEach {
                //forEach是内联
                if(it==2) return //编译正确,可以return
                print(it)     
            }
        }

    此外,一些内联函数参数不是直接来自函数体,而是来自另一个上下文的lambda表达式参数,
    例如来自局部对象或嵌套函数,lambda表达式也不允许非局部返回!
    为了标识这种情况,该lambda表达式参数需要用crossinline修饰符:
        inline fun f(crossinline body: () -> Unit) {
            val f = object: Runnable {
                override fun run() = body()
            }           
        }

    目前,break和continue在内联的lambda表达式中还不可用,未来kotlin计划支持!

## 3.类型参数的具体化(Reified type parameters)
    实例(类型参数-泛型)：
        fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
            var p = parent
            while (p != null && !clazz.isInstance(p)) {
                p = p.parent
            }
            @Suppress("UNCHECKED_CAST")
            return p as T?
        }

        //该函数调用很烦,很难看,很不优雅
        treeNode.findParentOfType(MyTreeNode::class.java)

    1.为简化函数调用,内联函数支持类型参数具体化:
        inline fun <reified T> TreeNode.findParentOfType(): T? {
            //用reified修饰符类型参数T,可在函数内访问T,像访问普通类,
            //由于函数是内联的,无需反射,正常操作符如!is和as都能用,
            var p = parent
            while (p != null && p !is T) {
                p = p.parent
            }
            return p as T?
        }
        //该函数调用简洁优雅
        treeNode.findParentOfType<MyTreeNode>()

    2.虽然多数情况不需要反射,但仍然可对具体化的类型参数使用:
        inline fun <reified T> membersOf() = T::class.members
        fun main(s: Array<String>) {
            println(membersOf<StringBuilder>().joinToString("\n"))
        }

    3.泛型的具体化条件
        普通函数(未标记为内联函数)不能具体化参数!
        在运行时无法表示的类型(类似Nothing虚构类型)不能作为具体化参数的实参!

## 4.内联属性(Inline properties)
    自kotlin 1.1起, inline可修饰[没有幕后字段]属性访问器get/set函数(方法)
    在调用处,内联访问器get/set函数,和内联函数一样内联,没什么区别!
    1.修饰单个属性访问器:
        val foo: Foo
            inline get() = Foo()

        var bar: Bar
            get() = ……
            inline set(v) { …… }

    2.修饰整个属性,将两个访问器都标记为内联:
        inline var bar: Bar
            get() = ……
            set(v) { …… }

简书：http://www.jianshu.com/p/79396a5056d7
CSDN博客: http://blog.csdn.net/qq_32115439/article/d  etails/73929039   
GitHub博客：http://lioil.win/2017/06/29/Kotlin-inline-fun.html   
Coding博客：http://c.lioil.win/2017/06/29/Kotlin-inline-fun.html