---
layout: post
title: Kotlin-43.Java调用kotlin之一(Call Kotlin from Java)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/java-to-kotlin-interop.html

## 1.kotlin属性(Properties)
    Kotlin属性会被编译成以下Java元素:
        1.getter方法,名称是在kotlin属性名前加get并且属性名首字母大写;
        2.setter方法(只适用于var属性),名称是在kotlin属性名前加set并且属性名首字母大写;
        3.private私有字段,名称与kotlin属性同名(只适用于具有幕后字段[backing field]的属性)

        如果kotlin属性名以is开头,则java名称映射规则不同: getter名与属性名相同,setter名是将is替换为set;
        提示: 这一规则适用于任何类型的属性,不仅限于Boolean

    示例1:
        // kotlin代码          
        var firstName: String // Kotlin属性

        // kotlin编译生成的Java代码        
        private String firstName; // java私有字段        
        public String getFirstName() { // getter方法
            return firstName;
        }        
        public void setFirstName(String firstName) { // setter方法
            this.firstName = firstName;
        }
    
    示例2:
        // kotlin代码         
        var isOpen: Boolean // Kotlin属性

        // kotlin编译生成的Java代码          
        private Boolean isOpen; // java私有字段        
        public Boolean isOpen() { // getter方法
            return firstName;
        }        
        public void setOpen(Boolean isOpen) {// setter方法
            this.isOpen = isOpen;
        }

## 2.kotlin包级函数(Package-Level Functions)
    1.在demo包内的example.kt文件中声明的所有函数和属性(包括扩展函数),
    都被编译成一个名为demo.ExampleKt的Java类的静态方法:
        // kotlin代码(example.kt文件)
        package demo

        class Foo
        fun bar() {
        }

        // Java调用kotlin
        new demo.Foo();
        demo.ExampleKt.bar(); // 把example.kt大写变成ExampleKt类

    2.可以使用@JvmName注解修改生成的Java类名:
        // kotlin代码(example.kt文件)
        @file:JvmName("DemoUtils")
        package demo

        class Foo
        fun bar() {
        }

        // Java调用kotlin
        new demo.Foo();
        demo.DemoUtils.bar();

    3.如果多个不同文件的包名相同且@JvmName注解相同,可用@JvmMultifileClass注解,编译器能够生成一个单一Java外观类
        // kotlin代码(oldutils.kt文件)
        @file:JvmName("Utils")
        @file:JvmMultifileClass
        package demo

        fun foo() {
        }

        // kotlin代码(newutils.kt文件)
        @file:JvmName("Utils")
        @file:JvmMultifileClass
        package demo

        fun bar() {
        }

        // Java调用kotlin
        demo.Utils.foo();
        demo.Utils.bar();

## 3.对象字段(Instance Field)
    如果kotlin属性有幕后字段(backing field),且没有private/open/override/const修饰符,且不是委托属性;
    可以用@JvmField注解标注kotlin属性,使对应的Java字段与kotlin属性可见性相同(默认public)!
        // kotlin
        class C(id: String) {
            @JvmField val ID = id
        }

        // Java调用kotlin
        class JavaClient {
            public String getID(C c) {
                return c.ID;
            }
        }

    延迟初始化的属性(lateinit修饰),其对应的Java字段的可见性与Kotlin属性访问器setter相同!   

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/75268938   
GitHub博客：http://lioil.win/2017/07/17/Kotlin-kotlinInJava.html   
Coding博客：http://c.lioil.win/2017/07/17/Kotlin-kotlinInJava.html