---
layout: post
title: Kotlin-基本类型/数据类型
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/basic-types.html

## 1.介绍
    与java不同，Kotlin所有数据类型都是对象，因此可在任何变量上调用成员函数和属性(字段)！

## 2.数字
    Kotlin 处理数字在某种程度上接近 Java，但是并不完全相同。
    例如，对于数字没有隐式把范围变宽转换(如在 Java 中 int 可以隐式转换为long)，
    另外有些情况的字面值略有不同。

    Kotlin 内置数字类型：
        类型    位数
        Double  64
        Float   32
        Long    64
        Int     32
        Short   16
        Byte    8
    注意在 Kotlin 中字符Char不能转化为数字

## 3.数值字面常量
    数值常量字面值表示:
        十进制:   123        
        十六进制: 0x0F
        二进制:   0b00001011
        注意: 不支持八进制(而java以0开头表示八进制 07)

        Long 用大写 L 标记:    123L  
        Float 用 f 或 F 标记:  123.5f
        double：              123.5、123.5e10

    自 Kotlin 1.1 起，用下划线使数字更易读：   
        val oneMillion = 1_000_000
        val creditCardNumber = 1234_5678_9012_3456L
        val socialSecurityNumber = 999_99_9999L
        val hexBytes = 0xFF_EC_DE_5E
        val bytes = 0b11010010_01101001_10010100_10010010

## 4.数字自动装箱-表示方式
   Kotlin 数字在虚拟机中是物理存储为 JVM 的原生类型，除非我们需要一个可null引用（有?标记）或泛型。 后者情况下会把数字自动装箱（类似java包装类,如 int 自动转为 Integer）。

    数字自动装箱：
        val a: Int = 10000
        print(a === a) // 输出“true”
        val boxedA: Int? = a // 有? 自动装箱
        val anotherBoxedA: Int? = a // 有? 自动装箱
        print(boxedA === anotherBoxedA) // 输出“false”
        // ===比较的是对象地址，自动装箱会生成新对象，所以对象不同，输出“false”
        //当===比较的对象数值在 -128 和 127 之间时，自动装箱会重用同一个对象，这是java缓存机制

        print(boxedA == anotherBoxedA) // 输出“true”
        // ==比较的是数值相同，输出“true”

## 5.显式转换
    范围较小数字类型不能隐式转换为范围较大类型。
        val b: Byte = 1 // 正确, 字面值是静态检测的
        val i: Int = b // 错误: 隐式扩宽
        val i: Int = b.toInt() // 正确: 显式扩宽

    每个数字类型支持如下类型转换:
        toByte(): Byte
        toShort(): Short
        toInt(): Int
        toLong(): Long
        toFloat(): Float
        toDouble(): Double
        toChar(): Char

    缺少隐式扩宽转换是很少引人注意的，因为类型是从上下文推断出来的，而算术运算会有重载做适当扩宽转换，例如：
        val l = 1L + 3 // Long + Int => Long

## 6.位运算
    Kotlin支持数字运算的标准集，运算被定义为相应的类成员（但编译器会将函数调用优化为相应的指令）
    对于按位运算，没有特殊字符来表示，而只可用中缀方式调用函数，例如:
        val x = (1 shl 2) and 0x000FF000
    以下是完整位运算列表（只用于 Int 和 Long）：
        shl(bits) – 有符号左移 (Java 的 <<)
        shr(bits) – 有符号右移 (Java 的 >>)
        ushr(bits) – 无符号右移 (Java 的 >>>)
        and(bits) – 位与
        or(bits) – 位或
        xor(bits) – 位异或
        inv() – 位非

## 7.字符
    字符用 Char 类型表示，不能直接当作数字
        fun check(c: Char) {
            if (c == 1) { // 错误：类型不兼容
                // ……
            }
        }
    字符字面值用单引号括起来: '1' 
    特殊字符可以用反斜杠转义: \t、 \b、\n、\r、\'、\"、\\ 和 \$。 
    编码其他字符用 Unicode 转义序列语法：'\uFF00'。

    我们可以显式把字符转换为 Int 数字
    fun decimalDigitValue(c: Char): Int {
        if (c !in '0'..'9')
            throw IllegalArgumentException("Out of range")
        return c.toInt() - '0'.toInt() // 显式转换为数字
    }
    当需要可null引用时，像数字一样，字符也会被装箱。
    装箱操作不会保留同一性(同一对象)。

## 8.布尔
    布尔用 Boolean 类型表示，它有两个值：true 和 false。
    若需要可空引用布尔会被装箱。

## 9.数组
    数组在 Kotlin 中使用 Array 类来表示，它定义了 get 和 set 函数（按照运算符重载约定转变为 []）和 size 属性

    使用库函数 arrayOf() 来创建一个数组并传递元素值
        arrayOf(1, 2, 3) 创建了 array [1, 2, 3]
    或  arrayOfNulls() 创建一个指定大小的null数组

    使用接受数组大小和一个函数参数的工厂函数，用作参数的函数能够返回每个元素初始值：
        // 创建一个 Array<String> 初始化为 ["0", "1", "4", "9", "16"]
        val asc = Array(5, { i -> (i * i).toString() })

    注意: 与 Java 不同的是，Kotlin 中数组是不型变的（invariant）。
    这意味着 Kotlin 不让 Array<String> 赋值给 Array<Any>，以防止可能的运行时失败（但是可用 Array<out Any>）

    还有无装箱开销的类表示原生类型数组: ByteArray、 ShortArray、IntArray 等等，这些类和 Array 并没有继承关系，但是有同样方法属性，相应的工厂方法
        val x: IntArray = intArrayOf(1, 2, 3)
        x[0] = x[1] + x[2]

## 10.字符串   
    字符串用 String 类型表示，字符串是不可变的；
    字符串元素可通过索引操作 s[i]
    可用 for 循环迭代字符串:
        for (c in str) {
            println(c)
        }

### 1.字符串字面值
    Kotlin 有两种类型的字符串字面值: 
    一是转义字符串 可以有转义字符，二是原始字符串 可以包含换行和任意文本

    转义字符串 很像 Java 字符串:
        val s = "Hello, world!\n"
        转义采用传统的反斜杠方式

    原始字符串 使用三个引号 """ 括起来，
    内部没有转义并且可以包含换行和任何其他字符:
        val text = """
            for (c in "foo")
                print(c)
        """

    你可以通过 trimMargin() 函数去除前导空格：
    val text = """
        |Tell me and I forget.
        |Teach me and I remember.
        |Involve me and I learn.
        |(Benjamin Franklin)
        """.trimMargin()
    默认 | 用作边界前缀，可用其他字符作为参数传入 trimMargin(">")

### 2.字符串模板
    字符串可以包含模板表达式 ，即一些小段代码，会求值并把结果合并到字符串中。 
    模板表达式以美元符 $ 开头
    
    由一个简单变量构成:
        val i = 10
        val s = "i = $i" // 求值结果为 "i = 10"

    用花括号{任意表达式}:
        val s = "abc"
        val str = "$s.length is ${s.length}" // 求值结果为 "abc.length is 3"
        
    原始字符串和转义字符串内都支持模板。 
    如果你需要在原生字符串中表示字面值 $ 字符(不支持反斜杠转义)：
        val price = """
                    ${'$'}9.99
                    """

GitHub博客：http://lioil.win/2017/06/13/Kotlin-basic-types.html   
Coding博客：http://c.lioil.win/2017/06/13/Kotlin-basic-types.html