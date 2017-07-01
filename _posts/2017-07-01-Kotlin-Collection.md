---
layout: post
title: Kotlin-集合(Collection)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/collections.html
    
## 1.可变和不可变集合(mutable and immutable collection)
    和大多数语言不同,Kotlin区分可变集合和不可变集合(list,set,map等)
    因为精确控制集合何时可变,有助于消除bug,设计出良好的API框架!

    了解可变集合的只读视图(read-only view)和不可变集合的区别是很重要的,
    它们都容易创建,但类型系统不能表现它们区别,所以需要由我们跟踪!

    和Java类似,Kotlin的List<out T>类型继承自Collection<T>,进而继承自Iterable<T>,
    List<out T>提供只读操作,如size,get等接口;而MutableList<T>提供可变操作,即改变list的方法,
    这一模式也适用于:
        Set<out T>/ MutableSet<T>, 
        Map<K, out V>/ MutableMap<K, V>

    
## 2.List和Set的基本用法
    Kotlin没有专门语法结构创建list和set,需要用kotlin标准库(standard library)的方法,
    例如 listOf(),mutableListOf(), setOf(),mutableSetOf()

    1.可变集合的只读视图(read-only view)和不可变集合的区别
    类型系统不能表现它们区别:
        //arrayListOf也是可变的
        val arrayList = arrayListOf(1,2,3)
        val muList: MutableList<Int> = mutableListOf(1, 2, 3)
        val readOnlyView: List<Int> = muList //只读视图(read-only view)

        //readOnlyView本身不可变,但指向的muList却是可变
        muList.add(4)
        println(readOnlyView) //输出"[1, 2, 3, 4]"

        //readOnlyView是不可变,arrayListOf和mutableListOf都是可变的
        arrayList.clear()
        readOnlyView.clear()  //readOnlyView不可变,编译错误

        //使用listOf集合才是真正的完全不可变！
        val list = listOf(1, 2, 3)

        //setOf不可变,hashSetOf和mutableSetOf都是可变的
        val rSet = setOf("a", "b", "c", "c")
        val hSet = hashSetOf("a", "b", "c", "c")
        val wSet = mutableSetOf("a", "b", "c", "c")    

    2.List<out T>和Set<out T>类型都是协变(covariant),
        如果Rectangle继承自Shape,可把List<Rectangle>类型赋值给List<Shape>类型,
        但是对于可变集合(mutable collection)是不允许的,因为将导致运行时失败!

    3.给调用者返回一个永远不变的集合(在某个特定时间的一个快照snapshot)
        class Controller {            
            private val _items = mutableListOf<String>()

            //items本身不可变,toList方法复制_items项,因此返回的list永远不会改变
            val items: List<String> get() = _items.toList()
        }

    4.List和set有用的扩展方法
        val items = listOf(1, 2, 3, 4)
        items.first() == 1
        items.last() == 4
        items.filter { it % 2 == 0 }   //返回 [2, 4]

        val rwList = mutableListOf(1, 2, 3)
        rwList.requireNoNulls()        //返回 [1, 2, 3]
        if (rwList.none { it > 6 }) println("No items above 6")  // 输出“No items above 6”
        val item = rwList.firstOrNull()

## 3.Map的基本用法
    kotlin的Map同样遵循List和Set的模式,很容易实例化和访问!
    在非性能关键代码中创建map,可用简单惯用语法(idiom):mapOf(a to b, c to d)
    map使用实例如下:
        //hashMapOf和mutableMapOf都是可变的
        val readWriteMap = hashMapOf("foo" to 1, "bar" to 2)
        val readWriteMap = mutableMapOf("foo" to 1, "bar" to 2)
        println(readWriteMap["foo"])  //输出“1”
        readWriteMap["foo"]=0 //改变值

        //snapshot: Map<String, Int>不可变
        val snapshot: Map<String, Int> = HashMap(readWriteMap)

        //mapOf不可变
        val map = mapOf("foo" to 1, "bar" to 2)

## 4.List,Set和Map的新建对象
    kotlin也可以像Java一样,直接使用list/set/map的子类实例化-新建对象,
    新建对象变量默认都是可变的,但如果变量类型声明为List<out T>/Set<out T>/Map<K, out V>,
    那么新建对象变量就不可变!
        fun main(args: Array<String>) {
            val l = ArrayList<String>()
            //如果声明为val l: List<String>,那么list不可变
            l.add("a")
            l.add("b")
            l.add("b")
            
            val s = HashSet<String>()
            //如果声明为val s: Set<String>,那么set不可变
            s.add("a")
            s.add("b")
            s.add("b")
            
            val m = HashMap<Int,String>()
            //如果声明为val m: Map<Int,String>,那么map不可变
            m.put(1,"a")
            m.put(2,"b")
            
            println("$l, $s, $m")//输出:[a, b, b, b], [a, b], {1=a, 2=b}
        }

GitHub博客：http://lioil.win/2017/07/01/Kotlin-Collection.html   
Coding博客：http://c.lioil.win/2017/07/01/Kotlin-Collection.html