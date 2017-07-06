---
layout: post
title: Kotlin-32.空指针安全/null安全(Null Safety)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/null-safety.html

## 1.可空与非空类型(Nullable types and Non-Null Types)
    很多编程语言(包括Java)最常见的陷阱就是访问null引用,
    在java中会导致空指针异常NullPointerException,简称NPE;
    因此东尼·霍尔(Tony Hoare),图灵奖得主把Null引用称为十亿美元的错误!
    
    Kotlin类型系统旨在消除null引用的危险,
    所以在Kotlin中只有以下情况,才会导致空指针异常NullPointerException:  
        1.显式调用 throw NullPointerException();
        2.使用 !! 操作符;
        3.外部Java代码导致的;
        4.对于初始化,有些数据不一致(如构造函数中未初始化的this用于某个地方);
    
    Kotlin类型系统能区分一个引用可null(可空引用)还是不可null(非空引用)
    例如,String类型的常规变量不能为空null：
        var a: String = "abc"
        a = null //编译错误,a不能为null

        //如果要允许变量为空null,需要在类型后添加问号?标记可null:
        var b: String? = "abc"
        b = null //编译OK

        //a不能为null,所以a方法或属性,不会导致NPE(NullPointerException)
        val l = a.length

        //b可以为null,所以访问b属性是不安全的,kotlin编译器会报错
        val l = b.length //kotlin编译器会报: 变量“b”可能为null
        //要想可以访问b,在下文中有几种方法: if检查null, ?.操作符, !!操作符

## 2.在条件中检查null(Checking for null in conditions)
    第一个选择,是显式检查b是否为null,编译器会跟踪所执行检查null:
        val l = if (b != null) b.length else -1 //编译OK
        val l = b.length //编译报错

        if (b != null && b.length > 0) {
            print("String of length ${b.length}")
        } else {
            print("Empty string")
        }

    提示: 在条件中检查null,只适用于b是不可变量的情况
        (即局部变量在检查null和使用之间没有改变,
        或者成员变量val有幕后字段backing field且不可覆盖overridable),
        否则可能发生在检查之后b又变为null的情况!

## 3.安全调用(Safe Calls)-操作符?.
    第二个选择,是使用安全调用操作符?.
    如果b非空,则返回b.length,否则返回null(表达式返回类型是Int?)
        val l = b?.length //编译OK
        val l = b.length //编译报错
        
    安全调用?.在链式调用中很有用,
    例如,一个员工Bob可能分配给一个部门,该部门可能有一个负责人(名字):
        //以下任意变量为null空,该链式调用结果就返回null
        bob?.department?.head?.name
    
    如果只对非空值执行操作(即忽略null),安全调用操作符?.可与let一起使用:
        val listWithNulls: List<String?> = listOf("A", null)
        for (item in listWithNulls)
            item?.let { println(it) } //输出A,(忽略null)

## 4.?:操作符(Elvis Operator)
    除了用完整if表达式检查null,还可用Elvis操作符?:简化if表达式,
    如果?:左侧表达式非空,就返回其左侧表达式,否则返回其右侧表达式
        val l = b?.length ?: -1 //当且仅当?:左侧为null时,才对右侧表达式求值
        //等价于
        val l: Int = if (b != null) b.length else -1

    因为在Kotlin中throw,return都是表达式,所以也可在?:右侧,例如检查函数参数:
        fun foo(node: Node): String? {
            val parent = node.getParent() ?: return null
            val name = node.getName() ?: throw IllegalArgumentException("name expected")
            //...
        }

## 5.!!操作符(!! Operator)
    第三个选择,是使用操作符!!,为NPE空指针异常的爱好者准备的, 让编译器不检查null
    如果b变量为null,就会抛出空指针异常NullPointerException(NPE)!
    例如:
        val l = b!!.length //如果b为null,会抛出空指针异常NullPointerException

## 6.过滤集合的可空元素-filterNotNull()
    如果集合有可空类型元素的,要过滤非空元素,可用filterNotNull实现:
        val nullableList: List<Int?> = listOf(1, 2, null, 4)
        val intList: List<Int> = nullableList.filterNotNull()

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/74509791   
GitHub博客：http://lioil.win/2017/07/05/Kotlin-null.html   
Coding博客：http://c.lioil.win/2017/07/05/Kotlin-null.html