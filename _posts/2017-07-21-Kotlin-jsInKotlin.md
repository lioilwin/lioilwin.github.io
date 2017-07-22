---
layout: post
title: Kotlin-47.Kotlin调用JavaScript(Call JavaScript from Kotlin)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/js-interop.html

## 1.Kotlin调用JavaScript(Calling JavaScript from Kotlin)
    Kotlin被设计能够与Java平台轻松互操作,kotlin可将Java类转为Kotlin类,Java也将Kotlin类转为Java类!
    但JavaScript是一种动态类型语言,意味着不会在编译期检查类型,可以在Kotlin中与JavaScript自由交流,
    但如果想用Kotlin类型系统全部功能,需要在JavaScript库创建Kotlin头文件!

## 2.内联JavaScript(Inline JavaScript)
    可用js("JavaScript代码")函数将JavaScript代码嵌入到Kotlin代码中:
        fun jsTypeOf(o: Any): String {
            return js("typeof o")
        }

    js("...")函数参数必须是字符串常量,因此以下代码错误:
        fun jsTypeOf(o: Any): String {
            return js(getTypeof() + " o") // 此处报错
        }
        fun getTypeof() = "typeof"

## 3.external修饰符(external modifier)
    用external修饰符来标记,通知Kotlin某个声明是用纯JavaScript编写!
    编译器会认为被修饰的类/函数/属性的具体实现由开发人员提供,不会在声明中生成任何JavaScript代码,
    因此external声明应该没有代码体内容,例如:
        // 以下声明都没有代码体,具体代码由JavaScript提供
        external fun alert(message: Any?): Unit
        external val window: Window
        external class Node {
            //external修饰符会被继承,即Node类的成员函数和属性前不需要添加external
            val firstChild: Node

            fun append(child: Node): Node

            fun removeChild(child: Node): Node
        }
    提示: external修饰符只允许在包级声明中使用(package-level)

## 4.声明类的静态成员(Declaring static members)
    在JavaScript中可以在原型(prototype)或者类(class)本身上定义成员:
        function MyClass() {
        }

        MyClass.sharedMember = function() {            
        };

        MyClass.prototype.ownMember = function() {            
        };

    Kotlin没有这样的语法,但Kotlin有伴生对象(companion object),假定伴生对象的成员就是该类自身的成员:
        external class MyClass {
            companion object {
                fun sharedMember()
            }

            fun ownMember()
        }

## 5.声明可选参数(Declaring optional parameters)
    一个外部(external)函数有可选参数,但Kotlin无法知道JavaScript是如何计算这些参数的默认值,
    因此在Kotlin中不能使用常用语法声明这些默认参数,应该使用以下语法:
        external fun myFunWithOptionalArgs(x: Int,
            y: String = definedExternally,
            z: Long = definedExternally)
        // y, z 参数默认值由JavaScript代码算出(definedExternally在外部定义)

## 6.扩展JavaScript类(Extending JavaScript class)
    扩展JavaScript类很容易,因为它们都是Kotlin类,只需定义一个external类,并用非external类扩展,例如:
        external open class HTMLElement : Element() {
            
        }

        class CustomElement : HTMLElement() {
            fun foo() {
                alert("bar")
            }
        }

    一些限制:
        1.当一个外部(external)基类的函数被签名重载时,不能在派生类(子类)中覆盖它;
        2.不能覆盖一个使用默认参数的函数;
        注意: 不能用external类扩展非external类!

## 7.external接口(external interface)
    JavaScript没有接口的概念,当函数期望其参数支持方法时,只能传递含有这些方法的对象;
    对于静态类型的Kotlin,可以使用外部(external)接口,例如:
        external interface HasFooAndBar {
            fun foo()

            fun bar()
        }

        // 传递含有foo和bar方法的HasFooAndBar
        external fun myFunction(p: HasFooAndBar)

    外部(external)接口的另一个使用场景是描述设置对象(settings objects),例如:
        external interface JQueryAjaxSettings {
            var async: Boolean
            var cache: Boolean
            var complete: (JQueryXHR, String) -> Unit
        }

        fun JQueryAjaxSettings(): JQueryAjaxSettings = js("{}")

        external class JQuery {
            companion object {
                fun get(settings: JQueryAjaxSettings): JQueryXHR
            }
        }

        fun sendQuery() {
            JQuery.get(JQueryAjaxSettings().apply {
                complete = { (xhr, data) ->
                    window.alert("Request complete")
                }
            })
        }

    外部(external)接口的一些限制:
        1.它们不能在is检查操作符的右侧使用;
        2.as转换为external接口总是成功(在编译时产生警告);
        3.它们不能作为具体化类型参数(reified type)传递;
        4.它们不能用在类的字面值(literal)表达式(例如 I::class)中;

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/75675844   
GitHub博客: http://lioil.win/2017/07/21/Kotlin-jsInKotlin.html   
Coding博客: http://c.lioil.win/2017/07/21/Kotlin-jsInKotlin.html