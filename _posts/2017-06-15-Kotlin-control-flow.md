---
layout: post
title: Kotlin-控制流程-control-flow
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/control-flow.html

## 1.if语句/if表达式
    在 Kotlin 中，if可作为表达式，即可返回一个值！
    因此 Kotlin 没有三元运算符( a>b ? a : b )，因为if表达式就能胜任( if (a > b) a else b )

    // 1.传统用法,作为if语句
        var max: Int
        if (a > b) {
            max = a
        } else {
            max = b
        }
    
    // 2.作为if表达式
        注意：如果if作为表达式，显然必需要有else分支，因为表达式在任何情况下都应有返回值！
        val max = if (a > b) a else b

        if分支还可以是代码块，最后一行的表达式作为代码块的返回值：
        val max = if (a > b) {
                        print("Choose a")
                        a
                    } else {
                        print("Choose b")
                        b
                    }

        

## 2.when语句/when表达式
    when将参数和分支条件进行顺序比较，直到某个分支满足条件！
    像if一样, when即可作为语句，也可作为表达式！
    如果when作为表达式, 则符合条件的分支值就是整个表达式值, 如果都不满足则会求值else分支;    
    如果when作为表达式，显然必需要有else分支, 除非编译器检测出已覆盖所有可能分支!

    when语句取代了类C语言/java的switch语句:
        when (x) {
            1 -> print("x == 1")
            2 -> print("x == 2")
            else -> { // 注意这个块
                print("x is neither 1 nor 2")
            }
        }

    1.多个分支代码相同,可放在一起,用逗号分隔:
        when (x) {
            0, 1 -> print("x == 0 or x == 1")
            else -> print("otherwise")
        }

    2.可用任意表达式(不只是常量)作为分支条件:
        when (x) {
            parseInt(s) -> print("s encodes x")
            else -> print("s does not encode x")
        }

    3.可检测一个值在(in)或者不在(!in)一个区间或集合：
        when (x) {
            in 1..10 -> print("x is in the range")
            in validNumbers -> print("x is valid")
            !in 10..20 -> print("x is outside the range")
            else -> print("none of the above")
        }

    4.可检测一个值是(is)或不是(!is)某种类型:
        fun hasPrefix(x: Any) = when(x) {
            is String -> x.startsWith("prefix")
            else -> false
        }


    5.取代 if-else if 链 
    如果没有参数，则分支条件结果是 Boolean 类型
        when {
            x.isOdd() -> print("x is odd")
            x.isEven() -> print("x is even")
            else -> print("x is funny")
        }

## 3.循环
在循环中 Kotlin 支持传统的 break 和 continue

### 1.for循环
    for 可循环遍历提供了迭代器的对象:
        有一个成员函数或者扩展函数 iterator()，
        它的返回类型:
            有一个成员函数或者扩展函数 next(),
            并且有一个成员函数或者扩展函数 hasNext(), 返回 Boolean
        这三个函数都需要标记为 operator

        for (item in collection) {
            print(item)
        }

    也可以通过索引遍历数组或者list:
        for (i in array.indices) {
            print(array[i])
        }

    还可以用库函数 withIndex:
        for ((index, value) in array.withIndex()) {
            println("the element at $index is $value")
        }

### 2.while循环
    while 和 do..while 和java一样:
        while (x > 0) {
            x--
        }

        do {
            val y = retrieveData()
        } while (y != null) // y 在此处可见

GitHub博客：http://lioil.win/2017/06/14/Kotlin-control-flow.html   
Coding博客：http://c.lioil.win/2017/06/14/Kotlin-control-flow.html