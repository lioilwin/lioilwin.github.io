---
layout: post
title: Kotlin-42.kotlin调用Java之四(Call Java from Kotlin)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/java-interop.html

继续上一章

## 10.Object类方法(Object Methods)
    在Kotlin中导入(import)Java类型时,java.lang.Object类都(映射)转成kotlin.Any!
    但时Any不是平台指定,kotlin.Any成员只有toString(),hashCode(),equals(),
    所以为了使用java.lang.Object的其它成员,Kotlin.Any需要添加扩展函数,如下所示:  

    1.wait()/notify()
    在《Effective Java》第69条建议优先使用并发工具(concurrency utilities),不建议使用wait()和notify()!
    因此在kotlin中Any类型不提供wait()和notify()方法!
    如果需要在Kotlin调用它们,可将kotlin类转换为java.lang.Object,例如:
        //foo是kotlin类,所有kotlin类都继承Any类
        (foo as java.lang.Object).wait()

    2.getClass()
    在Kotlin中获取对象的Java class类,可在类引用(对象)上使用java扩展属性:
        //foo是kotlin对象,fooClass是java class
        //1.使用自Kotlin 1.1起支持的绑定类引用(bound class reference)
        val fooClass = foo::class.java
       
        //2.也可以使用javaClass扩展属性:
        val fooClass = foo.javaClass

    3.clone()
    在kotlin中重写/覆盖clone()方法,需要继承kotlin.Cloneable,例如:
        class Example : Cloneable {
            override fun clone(): Any {
            }
        }
    别忘了《Effective Java》第11条: 谨慎(Override)覆盖clone()方法!

    4.finalize()
    在kotLin中覆盖finalize(),只需简单地声明它,而不需要override关键字(无需继承/实现):
        class C {
            //根据Java规则,finalize()不能为private 
            protected fun finalize() {                
                // 结束逻辑                           
            }
        }

## 11.Java类(Java class)
    1.访问java类的静态成员(static members)
    在kotlin中Java类的静态成员会形成该类的伴生对象(companion object),无法将伴生对象作为值来传递,
    但可以显式访问其成员,例如:
        //Character是java类,isLetter()是静态成员,但在kotlin是伴生对象的成员
        if (Character.isLetter(a)) {       
        }

    2.Java反射(Java Reflection)
    在Kotlin中可以使用Java反射,可以通过instance::class.java, instance.javaClass, 
    ClassName::class.java (其中instance是实例对象,ClassName是类)    
    获取java.lang.Class类,从而使用Java反射相关的方法类库!

    其它情况支持包括:
        为Kotlin属性获取Java字段的getter/setter方法或者幕后字段,
        为Java字段获取Kotlin属性(KProperty)
        为Kotlin函数(KFunction)获取Java方法或者构造函数,反之亦然!

## 12.SAM转换(SAM Conversions)
    像Java 8一样,Kotlin支持SAM转换(Single Abstract Method),
    意味着Kotlin函数字面值可被自动转换成只有一个非默认方法的Java接口实现!
    SAM转换只适用于接口,而不适用于抽象类,即使抽象类只有一个抽象方法!
    SAM转换只适用于kotlin与Java互操作,因为Kotlin不需要将函数自动转换为Kotlin接口实现!

    总结: 说白了就是为了在kotlin对Java方法使用lambda表达式,SAM转换例子:
        val runnable = Runnable {
            println("This runs in a runnable")
        }

        val executor = ThreadPoolExecutor()

        //Java类execute方法只有一个参数(接口)
        executor.execute {
             println("This runs in a thread pool")
        }

        //Java类execute方法有多个参数(接口)
        executor.execute(Runnable { println("This runs in a thread pool") })

## 13.在Kotlin中使用JNI
    声明一个在本地(C或C++)代码中实现的函数,需要使用external修饰符标记:
        external fun foo(x: Int): Double
    其余过程与Java的JNI工作方式完全相同

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/75208980   
GitHub博客：http://lioil.win/2017/07/16/Kotlin-javaInKotlin4.html   
Coding博客：http://c.lioil.win/2017/07/16/Kotlin-javaInKotlin4.html