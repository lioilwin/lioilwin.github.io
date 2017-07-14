---
layout: post
title: Kotlin-41.kotlin调用Java之三(Call Java from Kotlin)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/java-interop.html

继续上一章

## 8.Java数组(Java Arrays)
    与Java数组不同,Kotlin数组是不型变的,
    意味着Kotlin不允许把Array<String>赋值给Array<Any>,从而避免了运行时出错!
    Kotlin也禁止把子类数组作为超类/父类数组传给Kotlin函数/方法,
    但是对于Java方法是允许的(通过Array<(out) String>!平台类型)!

    在Java平台上,数组会用原生/基本类型以避免装箱/拆箱操作开销,但是Kotlin隐藏了这些实现细节,
    因此需要变通方法来与Java代码交互,每种原生/基本类型数组都有对应的kotlin类(IntArray,DoubleArray,CharArray等)!
    这些类与Array类无关,并且会编译成Java原生/基本类型数组以获得最佳性能!

    示例:
        //Java代码
        public class JavaArrayExample {
            public void removeIndices(int[] indices) {
                //...
            }
        }

        //Kotlin代码
        val javaObj = JavaArrayExample()
        val array = intArrayOf(0, 1, 2, 3)
        javaObj.removeIndices(array)  //将int[]传给java方法

    1.kotlin编译成JVM字节码,编译器会优化对数组的访问,不会引入任何额外开销:
        val array = arrayOf(1, 2, 3, 4)
        array[x] = array[x] * 2 // 实际上不会生成和调用array.get()和set()
        for (x in array) { // 不会创建迭代器iterator
            print(x)
        }

    2.即使用索引遍历定位,也不会引入任何额外开销:
        for (i in array.indices) {// 不会创建迭代器iterator 
            print(array[i])
        }

    3.in检测也没有额外开销:
        if (i in array.indices) { // 等价于(i >= 0 && i < array.size)
            print(array[i])
        }

## 9.Java参数个数可变(Java Varargs)
    Java类有时声明参数个数可变(varargs)的方法来使用索引:
        //java代码
        public class JavaArrayExample {
            public void removeIndices(int... indices) {
                //...
            }
        }

        //kotlin代码,用展开运算符*传递IntArray到java方法:
        val javaObj = JavaArrayExample()
        val array = intArrayOf(0, 1, 2, 3)
        javaObj.removeIndicesVarArg(*array)

    提示: 目前无法传递null给参数个数可变的方法!

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/75138487   
GitHub博客：http://lioil.win/2017/07/14/Kotlin-javaInKotlin3.html   
Coding博客：http://c.lioil.win/2017/07/14/Kotlin-javaInKotlin3.html