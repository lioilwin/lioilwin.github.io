---
layout: post
title: Kotlin-可见性修饰符(Visibility Modifiers)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/visibility-modifiers.html
 
## 1.可见性修饰符
    在Kotlin中有四种可见性修饰符: private, protected, internal, public
    如果没有指定,则默认是public
    类/对象/接口/构造函数/方法/属性和setter都有可见性修饰符(getter与属性可见性相同) 
  
## 2.在包中
    函数/属性/类/对象/接口都可在顶层声明(即直接在包内):
        默认public: 随处可见
        private: 只在声明的文件内可见
        internal: 在相同模块内随处可见
        protected: 不适用于顶层声明

        // 文件名：example.kt
        package foo

        private fun foo() {}    // 只在example.kt内可见

        public var bar: Int = 5 // 随处可见
            private set         // set只在example.kt内可见

        internal val baz = 6    // 在相同模块内可见

    

## 3.在类/接口中
    类/接口的成员:
        private: 只在本类中可见
        protected: 在本类中和其子类中可见
        internal: 本模块内都可见
        public: 随处可见
        注意: Kotlin外部类不能访问内部类的private成员

        open class Outer {
            private val a = 1
            protected open val b = 2
            internal val c = 3
            val d = 4  // 默认 public
            
            protected class Nested {
                public val e: Int = 5
            }
        }

        class Subclass : Outer() {
            // a 不可见
            // b、c、d 可见
            // Nested 和 e 可见

            override val b = 5   // 继承为protected
        }

        class Unrelated(o: Outer) {
            // o.a o.b 不可见
            // o.c o.d 可见
            // Outer.Nested Nested::e 不可见
        }

## 4.构造函数
    默认情况下,所有构造函数都是public,就等于类可见,它就可见!
    指定类主构造函数的可见性(需要添加constructor):
        class C private constructor(a: Int) {          
        }

## 5.模块
    可见性修饰符internal: 只在相同模块内可见
    一个模块是一起编译的一套Kotlin文件:
        一个IntelliJ IDEA模块
        一个Maven或者Gradle项目
        通过一次调用Ant任务编译的一套Kotlin文件
      
GitHub博客：http://lioil.win/2017/06/20/Kotlin-visibility.html   
Coding博客：http://c.lioil.win/2017/06/20/Kotlin-visibility.html