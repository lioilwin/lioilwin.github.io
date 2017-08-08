---
layout: post
title: Kotlin-44.Java调用kotlin之二(Call Kotlin from Java)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/java-to-kotlin-interop.html

## 4.静态字段(Static Fields)
    在对象(object)或伴生对象(companion object)中声明的Kotlin属性,有静态的幕后字段(backing fields)!
    这些静态字段是私有private,但可通过以下方式暴露(公开public):
        @JvmField 注解
        lateinit 修饰符
        const 修饰符

    1.用@JvmField注解属性,使对应的java静态字段与kotlin属性可见性相同(默认public)
        // kotlin
        class Key(val value: Int) {
            companion object {
                @JvmField
                val COMPARATOR: Comparator<Key> = compareBy<Key> { it.value }
            }
        }

        // Java
        Key.COMPARATOR; // COMPARATOR字段是 public static final

    2.用lateinit修饰属性,使对应的静态字段与属性访问器setter可见性相同(默认public)
        // kotlin
        object Singleton {            
            lateinit var provider: Provider // lateinit 延迟初始化
        }

        // Java
        Singleton.provider = new Provider(); // provider字段是 public static 非final

    3.用const修饰的(在类中以及在顶层)属性,在Java中会成为public静态字段
        // kotlin代码(example.kt文件)
        object Obj {
            const val CONST = 1
        }
        class C {
            companion object {
                const val VERSION = 9
            }
        }
        const val MAX = 239

        // Java代码
        int c = Obj.CONST;
        int v = C.VERSION;
        int d = ExampleKt.MAX;

## 5.静态方法(Static Methods)
    如果在对象(object)或伴生对象(companion object)中的函数被@JvmStatic注解,
    那么编译器既会在该对象的类中生成静态方法,也会在对象自身中生成实例方法!
    此外,@JvmStatic注解也可用于对象或伴生对象的属性,使其getter和setter方法是静态成员!
    示例1:
        // kotlin
        class C {
            companion object {
                @JvmStatic fun foo() {}
                fun bar() {}
            }
        }

        // Java
        C.foo(); // OK,静态方法
        C.bar(); // 错误,不是静态方法
        C.Companion.foo(); // OK,实例方法
        C.Companion.bar(); // OK,实例方法

    示例2:
        // kotlin     
        object Obj {
            @JvmStatic fun foo() {}
            fun bar() {}
        }

        // Java
        Obj.foo(); // OK,静态方法
        Obj.bar(); // 错误,不是静态方法
        Obj.INSTANCE.bar(); // OK,单例方法
        Obj.INSTANCE.foo(); // OK,单例方法


## 6.可见性(Visibility)
    Kotlin可见性与Java的映射关系:
        private成员编译成Java的private成员;
        private顶层声明编译成Java的包级局部声明(package-local)；
        protected编译成Java的protected(Java允许访问同包中其它类的protected成员,所以Java类会访问权限更广);
        internal声明编译成Java的public;
        public编译成Java的public;

## 7.KClass
    有时在java中调用Kotlin函数(有KClass类型参数),但无法把Java的Class自动转换成kotlin的KClass,
    所以必须通过调用Class<T>.kotlin扩展属性来手动转换:
        kotlin.jvm.JvmClassMappingKt.getKotlinClass(MainView.class)

简书：http://www.jianshu.com/p/042ea2c9062c
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/75332128   
GitHub博客：http://lioil.win/2017/07/18/Kotlin-kotlinInJava2.html   
Coding博客：http://c.lioil.win/2017/07/18/Kotlin-kotlinInJava2.html