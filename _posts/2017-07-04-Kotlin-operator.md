---
layout: post
title: Kotlin-31.操作符/运算符重载(operator overload)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/operator-overloading.html

## 1.操作符重载(Operator overloading)
    Kotlin允许为预定义操作符提供自定义的实现!
    这些操作符具有固定符号表示(如+ - * /),固定的优先级precedence
    有相应的成员函数member function或扩展函数extension function
    重载操作符的函数必需要用operator修饰符标记

## 2.一元操作符(Unary operations)
    1.前缀操作符(Unary prefix operators)
        操作符	     对应的函数
        +a          a.unaryPlus()
        -a          a.unaryMinus()
        !a          a.not()

        对+a表达式,编译器处理执行步骤:
            确定a的类型,令其为T;
            为接收者T查找有operator修饰的无参函数unaryPlus(),即T的成员函数或扩展函数;
            如果函数不存在或不明确,则编译错误;
            如果函数存在且其返回类型为R,则表达式+a结果类型为R

        提示:这些操作都优化基本类型(Basic types),不会带来函数调用的开销!
    
        重载操作符"-"的示例:
            data class Point(val x: Int, val y: Int)
            operator fun Point.unaryMinus() = Point(-x, -y)

            val point = Point(10, 20)
            println(-point)  //输出“(-10, -20)”

    2.递增和递减操作符(Increments and decrements)
        表达式      对应的函数
        a++         a.inc()
        a--         a.dec()

        a++ 或++a表达式, 编译器执行步骤：
            确定a的类型,令其为T;
            为接收者T查找有operator修饰的无参函数inc();
            检查函数返回类型是T子类;

        a++表达式的计算步骤:
            把a初始值存储到临时变量a0中,
            把a.inc()结果赋值给a,
            把a0作为表达式结果返回.

        ++a表达式的计算步骤:
            把a.inc()结果赋值给a，
            把a新值作为表达式结果返回.

## 3.二元操作符(Binary operations)
    1.算术运算符/操作符(Arithmetic operators)
        表达式      对应的函数
        a + b	    a.plus(b)
        a - b	    a.minus(b)
        a * b	    a.times(b)
        a / b	    a.div(b)
        a % b	    a.rem(b), a.mod(b)(已弃用)
        a..b	    a.rangeTo(b)

        自Kotlin 1.1起使用rem运算符,而mod运算符(Kotlin 1.0)被弃用

        示例如下:
        // Counter类重载"+"运算符
        data class Counter(val dayIndex: Int) {
            operator fun plus(increment: Int): Counter {
                return Counter(dayIndex + increment)
            }
        }
    
    2.in操作符('In' operator)
        表达式   对应的函数
        a in b	  b.contains(a)
        a !in b	 !b.contains(a)

    3.索引访问操作符(Indexed access operator)
        表达式                  对应的函数
        a[i]	                a.get(i)
        a[i, j]	                a.get(i, j)
        a[i_1, ..., i_n]	    a.get(i_1, ..., i_n)
        a[i] = b	            a.set(i, b)
        a[i, j] = b	            a.set(i, j, b)
        a[i_1, ..., i_n] = b	a.set(i_1, ..., i_n, b)
    
    4.调用操作符(Invoke operator)
        表达式              对应的函数
        a()	                a.invoke()
        a(i)	            a.invoke(i)
        a(i, j)	            a.invoke(i, j)
        a(i_1, ..., i_n)	a.invoke(i_1, ..., i_n)

    5.增量赋值(Augmented assignment)
        表达式       对应的函数
        a += b	     a.plusAssign(b)
        a -= b	     a.minusAssign(b)
        a *= b	     a.timesAssign(b)
        a /= b	     a.divAssign(b)
        a %= b	     a.modAssign(b)

        对于a += b, 编译器执行以下步骤:
            如果右列的函数可用
                如果相应的二元函数plus()也可用,那么报错(模糊);
                确保其返回类型是Unit,否则报错;
                生成a.plusAssign(b)的代码
            否则尝试生成a = a + b 的代码(类型检查a + b必须是a的子类型)        
        提示: 在Kotlin中赋值不是表达式!

    6.相等与不等操作符(Equality and inequality operators)
        表达式       对应的函数
        a == b	    a?.equals(b) ?: (b === null)
        a != b	    !(a?.equals(b) ?: (b === null))

        提示: ===和!==(引用相等/同一性检查)不能重载, 因为没有约定!
        null == null 总是true; 对于非空x, x == null 总是false

    7.比较操作符(Comparison operators)
        表达式       对应的函数(返回Int)
        a > b	    a.compareTo(b) > 0
        a < b	    a.compareTo(b) < 0
        a >= b	    a.compareTo(b) >= 0
        a <= b	    a.compareTo(b) <= 0

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/74364679   
GitHub博客：http://lioil.win/2017/07/04/Kotlin-operator.html   
Coding博客：http://c.lioil.win/2017/07/04/Kotlin-operator.html