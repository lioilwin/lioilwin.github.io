---
layout: post
title: Kotlin-17.枚举类(enum class)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/enum-classes.html
 
## 1.枚举类(enum class)    
    枚举类(enum class)基本用法,特性,和java差不多:
        enum class Direction {
            //每个枚举常量(Enum Constants)都是一个对象,用逗号分隔
            NORTH, SOUTH, WEST, EAST
        }

## 2.初始化(Initialization)
    因为每个枚举常量都是一个对象,所以都有初始化:
        enum class Color(val rgb: Int) {
                RED(0xFF0000),
                GREEN(0x00FF00),
                BLUE(0x0000FF)
        }

## 3.匿名类(Anonymous Classes)
    每个枚举常量都能声明匿名类:
        enum class ProtocolState {            
            WAITING {
                override fun signal() = TALKING
            },
            TALKING {
                override fun signal() = WAITING                
            }; //注意:像Java一样,Kotlin枚举常量也需要分号;分隔!

            abstract fun signal(): ProtocolState
        }

## 4.使用枚举常量(Enum Constants)
    像Java一样,Kotlin枚举类也有合成方法,允许访问枚举常量:
        enum class RGB { 
            RED, GREEN, BLUE 
        }
        //通过名字获取枚举常量
        RGB.valueOf(value: String): EnumClass
        //获取枚举常量列表
        RGB.values(): Array<EnumClass>        

    自Kotlin 1.1起,可用enumValues<T>()和enumValueOf<T>() 以泛型方式访问枚举常量:
        enum class RGB { 
            RED, GREEN, BLUE 
        }
        inline fun <reified T : Enum<T>> printAllValues() {
            print(enumValues<T>().joinToString { it.name })
        }
        printAllValues<RGB>() //输出 RED, GREEN, BLUE

    像Java一样,每个枚举常量都有两个属性-声明名字和声明位置:
        val name: String
        val ordinal: Int

    枚举常量也实现了Comparable接口, 其中自然顺序(natural order)是在枚举类中的定义顺序!

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/73692421   
GitHub博客：http://lioil.win/2017/06/24/Kotlin-enum-classes.html   
Coding博客：http://c.lioil.win/2017/06/24/Kotlin-enum-classes.html