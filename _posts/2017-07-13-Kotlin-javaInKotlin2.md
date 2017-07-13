---
layout: post
title: Kotlin-40.kotlin调用Java之二(Call Java from Kotlin)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/java-interop.html

继续上一章

## 5.Java空安全和平台类型(Null-Safety and Platform Type)
    在Java中任何引用都可能是null,这使Kotlin要求Java对象严格空安全是不现实的!
    Java声明的类型在Kotlin中会被特别对待,称为平台类型(platform types)!
    kotlin对平台类型的空检查(Null-checks)会放宽,因此它们在kotlin中的安全性与在Java中一样!
    示例:
        val list = ArrayList<String>() // 非空(构造函数结果)
        list.add("Item")
        val size = list.size() // 非空(原生 int)
        val item = list[0] // 推断为平台类型(普通Java对象)

    当调用平台类型的方法时,Kotlin不会在编译时检查可空性null错误, 
    但在运行时调用可能报错,出现空指针异常NullPointerException或者Kotlin断言阻止null传播!
        item.substring(1) // 允许,如果item == null,可能会抛出异常

    平台类型(platform types)是不可标示(non-denotable),意味着不能在kotlin语言中明确地写下指定!
    当把平台类型值赋值给Kotlin变量时,可以依赖类型推断,或者选择期望的类型(可空null或非空null类型均可):
        val nullable: String? = item // 允许可空(null)
        val notNull: String = item // 允许非空(notNull),运行时可能失败(null)

    如果选择非空类型(kotlin),编译器在赋值时会触发断言assertion,防止Kotlin的非空变量保存空值(null)!
    当把平台值传递给期待非空的Kotlin函数时,也会触发断言!
    总而言之,编译器尽力阻止空值(null)通过程序传播(鉴于泛型原因,有时不能完全消除)

    1.平台类型表示法(Notation for Platform Type)
        如上所述,平台类型不能在程序中显式表示,因此在kotlin语言中没有相应语法! 
        但是有时编译器或IDE要在错误/参数信息中显示平台类型,所以可用助记符标记:
            T!                       表示T 或者 T?
            (Mutable)Collection<T>!  表示T的Java集合 可变或不可变, 可空或不可空
            Array<(out) T>!          表示T(或T子类)的Java数组 可空或者不可空

    2.可空性注解(Nullability annotation)
        具有可空性注解的Java类型并不表示为平台类型,而表示为实际可空或非空的Kotlin类型,
        编译器支持多种可空性注解:
            JetBrains (@Nullable and @NotNull from the org.jetbrains.annotations package)
            Android (com.android.annotations and android.support.annotations)
            JSR-305 (javax.annotation)
            FindBugs (edu.umd.cs.findbugs.annotations)
            Eclipse (org.eclipse.jdt.annotation)
            Lombok (lombok.NonNull).

## 6.Java类型映射(Mapped type)
    Kotlin会特殊处理部分的Java类型,映射到相应的Kotlin类型,映射只发生在编译期间,运行时表示保持不变!

    1.Java基本类型映射到相应Kotlin类型:
        Java类型      Kotlin类型
        byte         kotlin.Byte
        short        kotlin.Short
        int          kotlin.Int
        long         kotlin.Long
        char         kotlin.Char
        float        kotlin.Float
        double       kotlin.Double
        boolean      kotlin.Boolean

    2.Java包装类(基本类型)映射成可空Kotlin类:
          Java类型                  Kotlin类型
        java.lang.Byte             kotlin.Byte?
        java.lang.Short            kotlin.Short?
        java.lang.Integer	       kotlin.Int?
        java.lang.Long             kotlin.Long?
        java.lang.Character	       kotlin.Char?
        java.lang.Float            kotlin.Float?
        java.lang.Double	       kotlin.Double?
        java.lang.Boolean	       kotlin.Boolean?
    注意: 当java包装类作为类型参数,会被映射成平台类型,例如,List<java.lang.Integer>在Kotlin中会变成List<kotlin.Int!>

    3.Java一些非基本类型也会映射:
          Java类型                  Kotlin类型
        java.lang.Object	       kotlin.Any!
        java.lang.Cloneable	       kotlin.Cloneable!
        java.lang.Comparable       kotlin.Comparable!
        java.lang.Enum             kotlin.Enum!
        java.lang.Annotation       kotlin.Annotation!
        java.lang.Deprecated       kotlin.Deprecated!
        java.lang.CharSequence     kotlin.CharSequence!
        java.lang.String	       kotlin.String!
        java.lang.Number	       kotlin.Number!
        java.lang.Throwable	       kotlin.Throwable!

    4.Java集合类型在Kotlin中既能只读,也能可变,因此有以下映射(Kotlin集合在kotlin.collections包)    
        Java类型          Kotlin只读类型     Kotlin可变类型               平台类型(platform type)
        Iterator<T>       Iterator<T>       MutableIterator<T>           (Mutable)Iterator<T>!
        Iterable<T>       Iterable<T>       MutableIterable<T>           (Mutable)Iterable<T>!
        Collection<T>     Collection<T>     MutableCollection<T>         (Mutable)Collection<T>!
        Set<T>            Set<T>            MutableSet<T>                (Mutable)Set<T>!
        List<T>           List<T>           MutableList<T>               (Mutable)List<T>!
        ListIterator<T>   ListIterator<T>   MutableListIterator<T>       (Mutable)ListIterator<T>!
        Map<K, V>         Map<K, V>         MutableMap<K, V>             (Mutable)Map<K, V>!
        Map.Entry<K, V>   Map.Entry<K, V>   MutableMap.MutableEntry<K,V> (Mutable)Map.(Mutable)Entry<K, V>!

    5.Java数组在Kotlin中映射:
        Java类型    Kotlin类型
        int[]       kotlin.IntArray!
        String[]    kotlin.Array<(out) String>!
    
## 7.在Kotlin中的Java泛型(Java generics in Kotlin)
    Kotlin泛型与Java有些不同,当在Kotlin中使用Java泛型时,会执行一些转换:
        1.Java通配符(wildcard)转换成类型投影(type projection)
            Foo<? extends Bar> 转换成 Foo<out Bar!>!
            Foo<? super Bar> 转换成 Foo<in Bar!>!

        2.Java原始类型转换成星投影(star projection)
            List 转换成 List<*>! 即List<out Any?>!

    和Java一样,Kotlin在运行时不保留泛型,即对象不会把类型参数传递到构造器!
    即不能区分ArrayList<Integer>()和ArrayList<Character>() 
    这使得is操作符不能检测泛型,Kotlin只允许is检测星投影的泛型类型:
        if (a is List<Int>) // 错误: 无法检查a是否为Int列表       
        if (a is List<*>) // OK: 不保证列表内容

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/75093931   
GitHub博客：http://lioil.win/2017/07/13/Kotlin-javaInKotlin2.html   
Coding博客：http://c.lioil.win/2017/07/13/Kotlin-javaInKotlin2.html