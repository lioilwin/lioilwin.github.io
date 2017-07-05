---
layout: post
title: Kotlin-22.高阶函数和lambda表达式/匿名函数
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/lambdas.html
    
## 1.高阶函数(Higher-Order Functions)
    高阶函数说白了就是它的参数类型是一个函数 或 返回类型是一个函数,
    它的作用和java回调很类似!

    1.实例一
        fun <T> lock(lock: Lock, body: () -> T): T {
            // body参数类型是一个函数,该函数的无参数,返回类型是T
            lock.lock()
            try {
                return body()
            }
            finally {
                lock.unlock()
            }
        }

        //1.把一个函数作为参数传递
        fun toBeSynchronized() = sharedResource.operation()
        val result = lock(lock, ::toBeSynchronized)

        //2.把lambda表达式作为参数传递
        val result = lock(lock, {sharedResource.operation()})

        //3.如果最后一个参数是一个函数,且传递lambda表达式,可在圆括号外简写:
        val result = lock(lock) {sharedResource.operation()}

    2.实例二
        fun <T, R> List<T>.map(transform: (T) -> R): List<R> {
            //transform参数类型是一个函数,该函数的参数类型是T,返回类型是R
            val result = arrayListOf<R>()
            for (item in this)
                result.add(transform(item))
            return result
        } 

        //1.如果只有一个参数(lambda),则圆括号可省略:
        ints.map { value -> value * 2 }

        //2.如果lambda表达式只有一个参数,可省略->,用隐式参数it代替参数:
        ints.map { it * 2 }
    
        //3.自kotlin 1.1起,如果lambda表达式的参数未使用,可用下划线代替：
        map.forEach { _, value -> println("$value!") }

## 2.Lambda表达式/匿名函数/带接收者的函数
    Lambda表达式的作用,说白了就是为了简化函数写法:
        fun <T> max(collection: Collection<T>, less: (T, T) -> Boolean): T? {
            //less参数类型是一个函数,该函数有两个参数类型是T,返回类型是Boolean
            var max: T? = null
            for (it in collection)
                if (max == null || less(max, it))
                    max = it
            return max
        }
        fun main(args: Array<String>) {
            val list = listOf(1,2)

            println(max(list,{ a,b -> a<b })) //输出2

            //等价于:
            val compareVal = {a: Int, b: Int -> a<b}
            println(max(list, compareVal)) //输出2

            //等价于:
            fun compareFun(a: Int, b: Int): Boolean = a < b
            println(max(list, ::compareFun)) //输出2
        }

### 1.Lambda表达式语法(Lambda Expression Syntax)
        Lambda表达式的完整语法如下:       
            val sum: (Int, Int) -> Int = { x, y -> x + y }
            //简化:
            val sum = { x: Int, y: Int -> x + y }
        

        如果只有一个参数(lambda),则圆括号可省略:
            ints.map { value -> value * 2 }

        如果lambda表达式只有一个参数,可忽略参数->,用隐式参数it代替参数:
            ints.filter { it > 0 }

        如果函数的最后一个参数是一个函数,且传递lambda表达式,可在圆括号外简写:
            val result = lock(lock) {sharedResource.operation()}

        默认情况,lambda表达式的最后一个表达式值作为返回值!
        可用限定返回(qualified return)从lambda表达式中显式返回一个值:        
            ints.filter {
                val shouldFilter = it > 0 
                return@filter shouldFilter
            }

            //等价于
            ints.filter {
                val shouldFilter = it > 0 
                shouldFilter
            }

### 2.匿名函数(Anonymous Functions)
        lambda表达式无法指定返回类型,返回类型可以自动推断出,大多数情况是不必要!
        如果确实需要显式指定返回类型,可用匿名函数代替:
            fun(x: Int, y: Int): Int = x + y

            fun(x: Int, y: Int): Int {
                return x + y
            }
          
            ints.filter(fun(item) = item > 0)

        除省略名称(匿名)外,匿名函数和正常函数没什么不同!

### 3.闭包(Closures)
        Lambda表达式或者匿名函数(局部函数local function和对象表达式object expression),
        可访问其闭包closure(即在外部作用域中声明的变量)
        与Java不同,在闭包(closure)中被捕获(captured)的变量可以被修改:
            var sum = 0
            ints.filter { it > 0 }.forEach {
                sum += it
            }
            print(sum)

### 4.带接收者的字面函数(Function Literals with Receiver)
        Kotlin提供了带接收者的字面函数(function literal),可使用接收者的成员,而无需任何额外限定符!
        相当于给接收者添加一个临时扩展函数,可在函数体内访问接收者对象的成员!
            实例一:
                fun main(args: Array<String>) {
                    //声明[sum函数]的[接收者]是[Int类对象]
                    val sum = fun Int.(other: Int): Int = this + other

                    //把[接收者Int类对象2]传给[sum函数],调用[sum函数]
                    println(2.sum(1)) //输出3
                }
            
            实例二:            
                class HTML {
                    fun body() {                        
                    }             
                }

                //HTML.() -> Unit 声明[init函数]的[接收者]是[HTML类对象]
                fun html(init: HTML.() -> Unit): HTML {
                    val html = HTML() //创建接收者对象

                    //把[接收者对象html]传给[init函数/lambda表达式],并调用init函数
                    html.init() 
                    return html
                }

                html { body() } //body() 带接收者的函数/lambda表达式

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/73865425   
GitHub博客：http://lioil.win/2017/06/28/Kotlin-fun-lambda.html   
Coding博客：http://c.lioil.win/2017/06/28/Kotlin-fun-lambda.html