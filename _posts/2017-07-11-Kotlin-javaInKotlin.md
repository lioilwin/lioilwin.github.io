---
layout: post
title: Kotlin-39.kotlin调用Java之一(Call Java from Kotlin)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/java-interop.html

## 1.在Kotlin中调用Java代码(Calling Java code from Kotlin)
    Kotlin在设计时就考虑了与Java的互操作性,
    所以可以轻松在Kotlin中调用现有Java代码,也能顺利在Java中调用Kotlin代码!
    在Kotlin使用Java的集合类的示例如下:
        import java.util.* //导入java类库util
        fun demo(source: List<Int>) {
            val list = ArrayList<Int>()
            // kotlin的for循环对Java集合类同样有效
            for (item in source) {
                list.add(item)
            }
            // kotlin操作符对java同样有效
            for (i in 0..source.size() - 1) {
                list[i] = source[i] //get和set访问器被调用(见下文)
            }
        }

## 2.Getter和Setter方法
    如果java字段成员的getter和setter方法遵循Java惯例(即名称以get开头的无参数方法和以set开头的单参数方法),
    它们在Kotlin中都被表示为kotlin属性,可以直接调用,例如:
        import java.util.Calendar //导入java日历类库
        fun calendarDemo() {
            val calendar = Calendar.getInstance()

            //相当于调用calendar.getFirstDayOfWeek()
            if (calendar.firstDayOfWeek == Calendar.SUNDAY) {

                //相当于调用calendar.setFirstDayOfWeek(Calendar.MONDAY)
                calendar.firstDayOfWeek = Calendar.MONDAY
            }
        }

    注意:
        如果Java类某字段只有一个setter,在Kotlin中不会作为kotlin属性!
        因为Kotlin目前不支持只写(set-only)属性!

## 3.返回void的方法
    如果一个Java方法返回void,那么从Kotlin调用时中返回Unit,
    如果使用该方法的返回值,它将被Kotlin编译器在调用处赋值,因为该值本身是预先知道(即Unit)
        //kotlin代码
        fun main(args: Array<String>) {
            val v = VoidDemo.vid()
            println(v) // 输出kotlin.Unit
        }

        //java代码
        public class VoidDemo{
          public static void vid(){

            }
        }
        

## 4.Kotlin关键字的Java标识符进行转义
    一些Kotlin关键字在Java中是有效标识符(如in,object,is等),
    如果Java类库使用了Kotlin关键字作为方法名,可用反引号(`)转义java方法名,然后在kotlin调用该方法
    示例:
        //is()是java方法名/函数名,但is是kotlin关键字,所以在kotlin中需要添加反引号`转义
        foo.`is`(bar)


CSDN博客: http://blog.csdn.net/qq_32115439/article/details/75000034   
GitHub博客：http://lioil.win/2017/07/11/Kotlin-javaInKotlin.html   
Coding博客：http://c.lioil.win/2017/07/11/Kotlin-javaInKotlin.html