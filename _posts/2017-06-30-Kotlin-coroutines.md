---
layout: post
title: Kotlin-协程和线程(Coroutine & Thread)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/coroutines.html
    
## 1.协程概念和作用(Coroutines)
    自Kotlin 1.1起开始有协程(coroutines),但目前还是实验性功能(experimental)!

    一些耗时操作(网络IO、文件IO、CPU/GPU密集型任务)会阻塞线程直到操作完成,
    Kotlin的协程提供一种避免阻塞且更廉价可控的操作: 协程挂起(coroutine suspension),
    协程将复杂异步操作放入底层库中,程序逻辑可顺序表达,以此简化异步编程,
    该底层库将用户代码包装为回调/订阅事件,在不同线程(甚至不同机器)调度执行!

    Kotlin的协程还能实现其它语言的异步机制(asynchronous mechanisms),
    例如源于C#和ECMAScript(js)的async/await机制,
    源于Go的channel/select机制,源于C#和Python的generators/yield机制!

## 2.线程阻塞和协程挂起的区别(Blocking VS Suspending)
    协程是通过编译技术实现(不需要虚拟机VM/操作系统OS的支持),通过插入相关代码来生效！
    与之相反,线程/进程是需要虚拟机VM/操作系统OS的支持,通过调度CPU执行生效!

    线程阻塞的代价昂贵,
    尤其在高负载时的可用线程很少,阻塞线程会导致一些重要任务缺少可用线程而被延迟!

    协程挂起几乎无代价,无需上下文切换或涉及OS,
    最重要的是,协程挂起可由用户控制:可决定挂起时发生什么,并根据需求优化/记录日志/拦截!

    另一个不同之处是,协程不能在随机指令中挂起,只能在挂起点挂起(调用标记函数)!

## 3.挂起函数(Suspending functions)
    当调用[suspend修饰的函数]时会发生协程挂起:
        suspend fun doSomething(foo: Foo): Bar {           
        }        
    该函数称为挂起函数,调用它们可能挂起协程(如果调用结果已经可用,协程库可决定不挂起)
    挂起函数能像普通函数获取参数和返回值,但只能在协程/挂起函数中被调用!

    1.启动协程,至少要有一个挂起函数,通常是匿名的(即挂起lambda表达式),
    一个简化的async函数(源自kotlinx.coroutines库)：
        //async函数是一个普通函数(不是挂起函数)
        //block参数有suspend修饰,是一个匿名的挂起函数(即挂起lambda表达式)
        fun <T> async(block: suspend () -> T)

        async {
            //doSomething在挂起函数(挂起lambda)中被调用
            doSomething(foo)
            ...
        }

        async {
            ...
            //await()是挂起函数,该函数挂起一个协程,直到执行完成返回结果
            val result = computation.await()
            ...
        }       
    更多关于kotlinx.coroutines库(诸如async/await函数等)详细说明在github:
    https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md

    2.挂起函数不能在普通函数中被调用:
        fun main(args: Array<String>) {
            doSomething() //错误: 挂起函数不能在非协程中被调用
        }

    3.挂起函数可以是虚拟的,当覆盖它们时,必须指定suspend修饰符:
        interface Base {
            suspend fun foo()
        }

        class Derived: Base {
            override suspend fun foo() {                
            }
        }

## 4.协程内部机制原理(inner workings)
    粗略地认识协程机制原理是相当重要的! 

    协程是通过编译技术实现(不需要虚拟机VM/操作系统OS的支持),通过插入相关代码来生效！
    与之相反,线程/进程是需要虚拟机VM/操作系统OS的支持,通过调度CPU执行生效!

    基本上,每个挂起函数都转换为状态机,对应于挂起调用;
    在挂起协程前,下一状态和相关局部变量等被存储在编译器生成的类字段中;
    在恢复协程时,状态机从下一状态进行并恢复局部变量！

    一个挂起的协程可作为保存挂起状态和局部变量的对象,对象类型是Continuation,
    在底层,挂起函数有一个Continuation类型的额外参数

    关于协程工作原理的更多细节可查看:
    https://github.com/Kotlin/kotlin-coroutines/blob/master/kotlin-coroutines-informal.md

## 5.协程的实验状态(Experimental status)
    目前kotlin协程的设计是实验性,意味着将来的语法规则可能会改变！
    在Kotlin 1.1中编译协程时,默认会出现一个警告:The feature "coroutines" is experimental.
    要移出该警告,需要指定opt-in flag,详情查看:
    http://kotlinlang.org/docs/diagnostics/experimental-coroutines.html

    目前是实验状态,标准库中的协程API位于kotlin.coroutines.experimental包下;
    当实验状态解除时,最终API会移动到kotlin.coroutines,而experimental包会被保留以向后兼容!
    
    使用协程库应遵循的规范:
        基于协程API的包添加“experimental”后缀(如com.example.experimental)
        当协程的最终API发布时,请按以下步骤操作:
            将所有协程API复制到com.example(没有experimental后缀);
            保留experimental包向后兼容性.

## 6.协程的标准API(Standard APIs)
    协程有三个主要组成部分:
        语言支持(如上述的挂起函数);
        Kotlin标准库中的底层核心协程API(low-level API);
        在用户代码中直接使用的高级API(high-level API)

    1.底层API(Low-level API): kotlin.coroutines
        底层API相对较小,除了创建高级库外,不应该使用它!
        由两个主要包组成:
            //带有主要类型和原语
            kotlin.coroutines.experimental 
                createCoroutine()
                startCoroutine()
                suspendCoroutine()
            
            //带有更底层内在函数 如suspendCoroutineOrReturn
            kotlin.coroutines.experimental.intrinsics

        关于这些API的更多用法查看:
        https://github.com/Kotlin/kotlin-coroutines/blob/master/kotlin-coroutines-informal.md
    
    2.生成器API(Generators API)
        该库中仅有的“应用程序级”函数:
            buildSequence()
            buildIterator()
        这些函数实现了生成器,即提供一种廉价方法,构建惰性序列(lazy sequence):

        yield()函数,构建惰性序列:
            import kotlin.coroutines.experimental.*
            fun main(args: Array<String>) {
                val fibonacciSeq = buildSequence {
                    var a = 0
                    var b = 1
                    yield(1) //惰性生产1
                    while (true) {
                        yield(a + b)//惰性生产斐波那契数列
                        val tmp = a + b
                        a = b
                        b = tmp
                    }
                }
                //输出斐波纳契数列(Fibonacci) [1, 1, 2, 3, 5, 8, 13, 21]
                println(fibonacciSeq.take(8).toList())
            }

        一次惰性生产一个集合(或序列),可用yieldAll()函数:
            import kotlin.coroutines.experimental.*
            fun main(args: Array<String>) {
                val lazySeq = buildSequence {
                    yield(0)
                    yieldAll(1..5) 
                }
                //输出: 0 1 2 3 4 5
                lazySeq.forEach { print("$it ") }
            }

        给SequenceBuilder类添加挂起扩展,为buildSequence()添加自定义yield函数:
            import kotlin.coroutines.experimental.*            
            //添加自定义yield函数
            suspend fun SequenceBuilder<Int>.yieldIfOdd(x: Int) {
                if (x % 2 != 0) yield(x)
            }
            val lazySeq = buildSequence {
                for (i in 1..10) yieldIfOdd(i)
            }
            fun main(args: Array<String>) {
                //输出：1 3 5 7 9
                lazySeq.forEach { print("$it ") }
            }

    3.其它高级API(Other high-level APIs)
        kotlinx.coroutines库覆盖:
            平台无关异步编程库: kotlinx-coroutines-core
                包括支持select和类似Go的管道channel
            JDK 8的CompletableFuture API：kotlinx-coroutines-jdk8
            JDK 7及以上的非阻塞IO(NIO) API：kotlinx-coroutines-nio
            支持Swing(kotlinx-coroutines-swing)和JavaFx(kotlinx-coroutines-javafx)
            支持RxJava: kotlinx-coroutines-rx

        关于kotlinx.coroutines库的更多说明查看:
        https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md
       
GitHub博客：http://lioil.win/2017/06/30/Kotlin-coroutines.html   
Coding博客：http://c.lioil.win/2017/06/30/Kotlin-coroutines.html