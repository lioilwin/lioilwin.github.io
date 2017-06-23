---
layout: post
title: Kotlin-泛型(generics)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/generics.html
 
## 1.泛型(generics)
    与Java类似，Kotlin的类也有类型参数(泛型):        
        class Box<T>(t: T) {
            var value = t
        }
        
    一般情况,使用泛型实例,需要类型参数:
        val box: Box<Int> = Box<Int>(1)

    如果类型参数可推断出来,可省略类型参数:
        val box = Box(1) // 1是Int,编译器可推断出Box<Int>

## 2.型变(Variance)
    Java泛型中最棘手部分就是通配符类型(初学实在头晕),但kotlin没有!
    所以Kotlin通过型变(Variance)弥补:
        声明处型变(declaration-site variance)
        类型投影(type projections)

    为什么Java泛型需要通配符类型？
        在Effective Java解释了该问题—第28条:利用有限制通配符来提升API的灵活性。 
        Java泛型是不型变的,意味着List<String>不是List<Object>子类型! 
        如果List是型变的,如下代码编译正常,但运行时出现异常:
            // Java
            List<String> strs = new ArrayList<String>();
            List<Object> objs = strs; //错误,Java禁止型变!
            objs.add(1);
            String s = strs.get(0); //运行出现异常ClassCastException:无法将整数转为字符串！

        因此，Java禁止型变以保证运行时的安全,但这样会有一些影响,
        例如,假设Collection.addAll()参数如下:
            // Java
            interface Collection<E> …… {
                void addAll(Collection<E> items);
            } 
            void copyAll(Collection<Object> to, Collection<String> from) {
                //addAll不能编译,Collection<String>不是Collection<Object>子类型
                to.addAll(from);      
            }
        这就是为什么Collection.addAll()实际参数如下:
            // Java
            interface Collection<E> …… {
                //通配符<? extends E>表示包括E在内的所有子类,称为协变(covariant)
                //通配符<? super E>表示包括E在内的所有父类,称为逆变(contravariance)
                void addAll(Collection<? extends E> items);
            }
            void copyAll(Collection<Object> to, Collection<String> from) {
                //<? extends E>可以让Collection<String>是Collection<? extends Object>子类型
                to.addAll(from);
            }

        <? extends E>协变(covariant): 表示包括E在内的所有子类,泛型对象只能读取,称为生产者
        <? super E>逆变(contravariance): 表示包括E在内的所有父类,泛型对象只能写入,称为消费者
        助记符：Producer-extends, Consumer-super


## 3.声明处型变(Declaration-site variance)
    Java泛型的一个例子:
        interface Source<T> {
            //只有生产者方法,没有消费者方法
            T nextT();
        }
        void demo(Source<String> strs) {
            //Source<T>没有消费者方法,型变是安全的,但是Java并不知道,所以仍然禁止!
            //需要声明类型为Source<? extends Object>,这是毫无意义的,更复杂类型并没有带来价值!            
            Source<Object> objects = strs; //错误:在Java中不允许型变
        }

    1.out修饰符
    在Kotlin中,可用out修饰类型参数T,确保T只能输出(生产),不被消费!
    out修饰符称为型变注解(variance annotation),使类型参数协变(covariant)!    
        abstract class Source<out T> {
            abstract fun nextT(): T
        }
        fun demo(strs: Source<String>) {
            val objects: Source<Any> = strs //可以型变,因为T是out      
        }
  
    2.in修饰符
    用in修饰类型参数T,确保T只能被消费,不能输出(生产),使类型参数逆变(contravariance)!
        abstract class Comparable<in T> {
            abstract fun compareTo(other: T): Int
        }
        fun demo(x: Comparable<Number>) {
            //1.0拥有Double类,是Number的子类
            x.compareTo(1.0)    

            //Double是Number的子类,父类Number可以被Double消费
            val y: Comparable<Double> = x
        }
    
    助记符：消费者-输入in, 生产者-输出out
    由于in/out在类型参数声明处,所以称为声明处型变(Declaration-site variance)

## 4.使用处型变(Use-site variance)/类型投影(Type projections)
    类型参数T既不是协变,也不是逆变(T既生产out,又消费in):
        class Array<T>(val size: Int) {
            fun get(index: Int): T {...} //生产out
            fun set(index: Int, value: T) {...} //消费in
        }     
        fun copy(from: Array<Any>, to: Array<Any>) {
            assert(from.size == to.size)
            for (i in from.indices)
                to[i] = from[i]
        }
        val ints: Array<Int> = arrayOf(1, 2, 3)
        val anys = Array<Any>(3) { "" } 
        copy(ints, anys) //错误:期望(Array<Any>, Array<Any>)

    1.out,确保from中的Any只生产输出,不被消费,对应于Java的Array<? extends Object>：
        fun copy(from: Array<out Any>, to: Array<Any>) {
            ...
        }

    2.in,确保dest中的String只能被消费,不生产输出,对应于Java的Array<? super String>
        fun fill(dest: Array<in String>, value: String) {
            ...
        }    

## 5.星投影<*>(Star-projections)
    如果对类型参数一无所知,可用星投影:
        1.对于Foo<out T>,T是一个具有上界TUpper的协变类型参数,Foo<*>等价于Foo<out TUpper>, 
        当T未知时,可以安全地从Foo<*>读取TUpper的值

        2.对于Foo<in T>,T是一个逆变类型参数,Foo<*>等价于Foo<in Nothing>,
        当T未知时,没有什么方式可以安全写入Foo<*>

        3.对于Foo<T>,T是一个具有上界TUpper的不型变类型参数,
        Foo<*>在读取值时等价于Foo<out TUpper>,在写入值时等价于Foo<in Nothing>

    如果有多个类型参数,则每个类型参数都可单独投影:
        interface Function <in T, out U>
        Function<*, String>   表示Function<in Nothing, String>
        Function<Int, *>      表示Function<Int, out Any?>
        Function<*, *>        表示Function<in Nothing, out Any?>
    注意:星投影非常像Java的原始类型,但是安全!

## 6.泛型函数
    和java类似, kotling不仅类有泛型,函数也有泛型:
        //普通函数
        fun <T> singletonList(item: T): List<T> {
            // ……
        }

        //扩展函数
        fun <T> T.basicToString() : String {  
            // ……
        }

        //调用泛型函数,在函数名后指定类型参数
        val l = singletonList<Int>(1)

## 7.泛型约束    
    最常见的约束类型是,与Java的<? extends T>对应的上界:
        //<T : Comparable<T>>冒号之后指定类型上界,只有Comparable<T>子类型可以替代T
        fun <T : Comparable<T>> sort(list: List<T>) {
        }
        sort(listOf(1, 2, 3)) //Int是Comparable<Int>子类型
        sort(listOf(HashMap<Int, String>())) //错误: HashMap<Int, String>不是Comparable<HashMap<Int, String>>子类型

    默认上界是Any?,<:上界>中只能指定一个上界,如果同一类型参数需要多个上界,需要一个单独的where子句:
        fun <T> cloneWhenGreater(list: List<T>, threshold: T): List<T>
            where T : Comparable, T : Cloneable {
            return list.filter { it > threshold }.map { it.clone() }
        }   

GitHub博客：http://lioil.win/2017/06/23/Kotlin-generics.html   
Coding博客：http://c.lioil.win/2017/06/23/Kotlin-generics.html