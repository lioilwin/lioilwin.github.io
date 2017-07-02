---
layout: post
title: Kotlin-区间/范围(Ranges)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/ranges.html

## 1.区间/范围(Ranges)
    区间/范围(Ranges)表达式: 由操作符..(rangeTo函数), in 和 !in 构成!
    任何可比较的类型(comparable type)都定义了区间,但整型原生类型的区间实现有优化!    
    1.区间的使用示例:
        fun main(args: Array<String>) {
            val i = 3
            val array = listOf("a","b","c")

            //等价于 if(1 <= i && i <= 10)
            if (i in 1..10) 
                println("$i,位于[1,10]区间")
            
            //区间操作符..的底层实现就是rangeTo()函数
            if (i in 1.rangeTo(10))
                println("$i,位于[1,10]区间")
            
            //检查数组的下标索引是否越界
            if (i !in 0..array.size - 1)
                println("数组越界Out: array has only ${array.size}")
            
            //检查数组是否包含某元素
            if ("b" in array) //相当于 collection.contains(obj)
                println("Yes")
        }

    2.整型区间-迭代(循环遍历)
    整型区间(IntRange,LongRange,CharRange)还有额外特性:可迭代(循环遍历)
    kotlin编译器会将整型区间转换为类似Java基于索引的for循环,没有额外开销!
        fun main(args: Array<String>) {
            for (i in 1..4) print(i) //输出“1234”
            for (i in 4..1) print(i) //什么都不输出

            //倒序迭代(循环遍历)数字区间,可用标准库中downTo函数
            for (i in 4 downTo 1) print(i) //输出“4321”

            //不以1的步长迭代(循环遍历)数字区间,可用step函数
            for (i in 1..4 step 2) print(i)       //输出“13”
            for (i in 4 downTo 1 step 2) print(i) //输出“42”
            
            //不包括结束元素的数字区间,可用until函数:
            for (i in 1 until 10) //i in [1, 10)排除10
                print(i)            
        }

## 2.区间的工作原理(How work)
    区间实现了一个公共接口:ClosedRange<T>,表示一个数学意义上的闭区间,
    有两个端点start和endInclusive都包含在区间内,
    主要操作是contains,通常以in/!in操作符形式使用!

    区间操作符..创建同时实现ClosedRange<T>和xxProgression的xxRange对象, 
    例如, 区间IntRange对象实现了ClosedRange<Int>,并继承了IntProgression,
        downTo()和step()函数的结果总是IntProgression

    整型数列(IntProgression,LongProgression,CharProgression)代表等差数列,
    数列Progression由first元素,last元素和非零step元素构成,
    首元素是first,下一元素是上一元素加上step,如果数列非空,那么last元素总会被迭代命中
    数列Progression由其伴生对象的fromClosedRange函数构造初始化:
        IntProgression.fromClosedRange(start, end, step)

    数列Progression是Iterable<N>的子类(泛型N分别为Int,Long,Char),
    可用于for循环,map,filter等函数,数列迭代相当于Java的基于索引的for循环:
        for (int i = first; i != last; i += step) {
        }

## 3.区间的常用函数(Utility functions)
### 1.rangeTo()函数
    整型类型(Int,Long,Byte,Char)都定义rangeTo()操作符(..),就是调用xxRange类的构造函数:
        class Int {            
            operator fun rangeTo(other: Long): LongRange = LongRange(this, other)           
            operator fun rangeTo(other: Int): IntRange = IntRange(this, other)
        }

    浮点类型(Double,Float)未定义rangeTo()操作符(..),
    但是可用标准库提供的Comparable泛型的rangeTo()函数:
        //该函数返回的区间ClosedRange不能用于迭代(循环遍历)
        public operator fun <T: Comparable<T>> T.rangeTo(that: T): ClosedRange<T>

### 2.downTo()函数
    整型类型(Int,Long,Byte,Char)都定义扩展函数downTo(),例如:
        fun Long.downTo(other: Int): LongProgression {
            return LongProgression.fromClosedRange(this, other.toLong(), -1L)
        }

        fun Byte.downTo(other: Int): IntProgression {
            return IntProgression.fromClosedRange(this.toInt(), other, -1)
        }

### 3.reversed()函数
    数列xxProgression类定义了扩展函数reversed(),用于反转(逆序)数列:
        fun IntProgression.reversed(): IntProgression {
            return IntProgression.fromClosedRange(last, first, -step)
        }

### 4.step()函数
    数列xxProgression类定义了扩展函数step(),用于修改数列的step值, 
    步长step值始终为正,因此不会更改迭代方向:
        fun IntProgression.step(step: Int): IntProgression {
            if (step <= 0) throw IllegalArgumentException("Step must be positive, was: $step")
            return IntProgression.fromClosedRange(first, last, if (this.step > 0) step else -step)
        }

        fun CharProgression.step(step: Int): CharProgression {
            if (step <= 0) throw IllegalArgumentException("Step must be positive, was: $step")
            return CharProgression.fromClosedRange(first, last, if (this.step > 0) step else -step)
        }

    注意,step函数返回的数列last值可能与原始数列的last值不同,例如：
        (1..12 step 2).last == 11  //数列为[1, 3, 5, 7, 9, 11]
        (1..12 step 3).last == 10  //数列为[1, 4, 7, 10]
        (1..12 step 4).last == 9   //数列为[1, 5, 9]

GitHub博客：http://lioil.win/2017/07/02/Kotlin-ranges.html   
Coding博客：http://c.lioil.win/2017/07/02/Kotlin-ranges.html