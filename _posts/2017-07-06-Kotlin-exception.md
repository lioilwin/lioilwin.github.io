---
layout: post
title: Kotlin-33.异常(Exception)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/exceptions.html

## 1.异常类(Exception Classes)
    与java类似,Kotlin的所有异常类都是Throwable类的子孙类(都继承自Throwable类),
    每个异常类成员都有消息(message),堆栈跟踪(stack trace)和可选的起因(optional cause).
    
    1.与Java一样,kotlin使用throw表达式抛出异常(throw exception):
        throw MyException("Hi There!")

    2.与Java一样,kotlin使用try表达式捕获异常(catch exceptio):
        try {
            // 一些代码
        } catch (e: SomeException) {
            // 处理程序
        } finally {
            // 可选的finally块
        }
        //可以有零或多个catch块,finally块可省略,但catch和finally块至少应该存在一个!

    3.与Java不同,kotlin的try表达式有一个返回值
        try表达式返回值是try块最后一个表达式,或者是catch块最后一个表达式,
        finally块内容不会影响表达式的结果.
        fun main(args: Array<String>) {
            val a: Int? = try { 
                    1 //正常运行,返回1               
                } catch (e: NumberFormatException) {
                    2
                    null
                }  finally {
                    3 //finally块不会影响表达式结果
                }

            val b: Int? = try { 
                    1
                    throw NumberFormatException()
                } catch (e: NumberFormatException) {
                    2
                    null //捕获异常,返回null
                }  finally {
                    3 //finally块不会影响表达式结果
                }

            println(a) //输出1
            println(b) //输出null
        }
    
## 2.没有受检异常(Checked Exceptions)
    java两种异常类型: 受检异常(checked exception)和非受检异常(unchecked exception)
        1.Error和RuntimeException及其子类都是受检异常(checked exception), 
        2.其余的异常Exception都是非受检异常(unchecked exception);
    这两种异常在作用上没有差别,唯一差别在于在编译时编译器会检查受检异常,
    所以受检异常需要try catch捕获来避免编译错误,而非受检异常不需要!

    可见受检异常(Checked Exceptions)使用比较麻烦,争议非常大,可能会导致java API变得很复杂,
    程序跟异常检查代码混杂在一起,这仅仅是为了通过编译器的编译,
    许多人批评Java的受检异常,认为受检异常(Checked Exception)是软件工程中一次失败的试验!

    kotlin没有受检异常(Checked Exceptions),以下是kotlin不使用受检异常的原因描述:
        JDK的StringBuilder类实现的一个示例接口:
            Appendable append(CharSequence csq) throws IOException;
        这个append函数签名throws IOException,每次追加一个字符串(StringBuilder/某种日志log/控制台console),
        就必须捕获IOException(可能正在执行IO操作Writer也实现了Appendable),所以导致try{}代码随处可见：
            try {
                log.append(message)
            } catch (IOException e) {

            }
        java受检的异常(Checked Exception)很不好用,参见《Effective Java》第65条:不要忽略异常!
        
        Bruce Eckel在《Java是否需要受检的异常？》Does Java need Checked Exceptions?中指出:
            一些小程序测试得出的结论是:受检的异常会提高开发者的生产力和代码质量高,
            但是大型软件项目的经验有不同的结论:生产力降低,代码质量低或没有提高!

        其他相关引证:
            《Java的受检异常是一个错误》Java's checked exceptions were a mistake (Rod Waldhoff)
            《受检异常的烦恼》The Trouble with Checked Exceptions (Anders Hejlsberg)

## 3.Nothing类型(The Nothing type)
    在Kotlin中throw是表达式,所以可以作为Elvis表达式?:的一部分:
        val s = person.name ?: throw IllegalArgumentException("Name required")

    throw表达式的类型是Nothing类型,该特殊类型没有值,只用于标记代码位置永远不能到达(never be reached)
    所以当person.name为null时, s = 赋值操作永远不会发生(即throw类型Nothing,永远不可到达s = )

    可以使用 Nothing 来标记一个函数永远不会返回(never return):
        fun main(args: Array<String>) {
            fun fail(message: String): Nothing {
                throw IllegalArgumentException(message)
            }
            
            //当调用该函数fail()时,编译器会知道执行不会超出该调用(说白了就是程序不会继续执行)
            //程序中断,输出 "java.lang.IllegalArgumentException: Name参数错误,不能为null"
            val name = null  
            val s: String = name ?: fail("Name参数错误,不能为null")
            println(s)
        }

## 4.kotlin与Java互操作的异常处理(Java Interoperability)
    在Kotlin中,所有异常都是非受检的,意味着编译器不会强迫捕获任何异常(try catch)! 
    因此,在Kotlin中调用一个受检异常的Java方法,不会强迫你去捕获异常:   
        //kotlin代码,调用java方法,append(CharSequence csq) throws IOException;     
        fun render(list: List<*>, to: Appendable) {
            for (item in list) {
                //在kotlin中不要求捕获异常,但在Java中会强迫捕获异常IOException
                to.append(item.toString()) 
            }
        }

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/74617358   
GitHub博客：http://lioil.win/2017/07/06/Kotlin-exception.html   
Coding博客：http://c.lioil.win/2017/07/06/Kotlin-exception.html