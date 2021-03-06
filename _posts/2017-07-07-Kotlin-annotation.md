---
layout: post
title: Kotlin-34.注解(Annotation)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/annotations.html

## 1.声明注解(Annotation Declaration)
	和java类似,kotlin注解就是在代码中附加元数据(metadata),
	声明注解(在class前面添加annotation修饰符):
		annotation class Fancy

	和java注解类似,kotlin注解的附加属性可以通过元注解(meta-annotation)来声明指定,
	kotlin元注解(meta-annotation)有以下几种:
		@Target 注解目标: 指定该注解用于什么类型的元素(类,函数,属性,表达式等);
		@Retention 注解保留: 指定该注解是否存在编译后的class文件,以及在运行时能否通过反射可见(默认都是true);
		@Repeatable 允许该注解在单个元素上多次使用;        
		@MustBeDocumented 指定该注解是公有API的一部分,且应该包含在生成的API文档中(类或方法的文档注释)

	注解声明(包括元注解)的示例:
		@Target(AnnotationTarget.CLASS, //用于类
				AnnotationTarget.FUNCTION, //用于函数
				AnnotationTarget.VALUE_PARAMETER, //用于函数参数
				AnnotationTarget.EXPRESSION) //用于表达式
		@Retention(AnnotationRetention.SOURCE) //表示注解只存在源码,不在编译后的class文件
		@MustBeDocumented //包含在API文档中
		annotation class Fancy

## 2.使用注解(Usage)
	@Fancy class Foo {
		@Fancy fun baz(@Fancy foo: Int): Int {
			return (@Fancy 1)
		}
	}

	1.对类的主构造函数进行注解,需要在构造函数前面添加constructor关键字,注解添加到它的前面:
		class Foo @Inject constructor(dependency: MyDependency) {
			//...
		}
		
	2.对属性访问器(get/set)进行注解:
		class Foo {
			var x: MyDependency? = null
				@Inject set
		}

	3.对Lambda表达式进行注解:    
		annotation class Suspendable

		val f = @Suspendable { Fiber.sleep(10) }

## 3.声明注解的构造函数(Constructors)
	注解可以有构造函数(用于接受参数):
		//声明注解
		@Target(AnnotationTarget.CLASS)        
		annotation class Special(val why: String)

		//使用注解
		@Special("example") class Foo {}

	1.kotlin注解的参数类型:
		和Java原生类型对应的kotlin类型(Int,Long等);
		字符串string;
		kotlin类class(Foo::class);
		枚举enum;
		其它注解;
		以上类型构成的数组; 

		提示: 注解参数不能有可空(null)类型，因为JVM不支持存储null作为注解属性值!

	2.注解作为另一个注解的参数,不需要添加@前缀:
		annotation class ReplaceWith(val expression: String)

		//ReplaceWith作为注解参数时,不需要加@前缀
		annotation class Deprecated(
				val message: String,
				val replaceWith: ReplaceWith = ReplaceWith(""))

		@Deprecated("This function is deprecated, use === instead", 
			ReplaceWith("this === other"))

	3.kotlin类作为注解的参数
	如果需要将一个类指定为注解的参数,请用Kotlin类(KClass),
	Kotlin编译器会自动将Kotlin类转换为Java类,以便Java代码能正常使用该注解和参数!
		import kotlin.reflect.KClass
		annotation class Ann(val arg1: KClass<*>, val arg2: KClass<out Any?>)

		@Ann(String::class, Int::class) class MyClass
		
## 4.在使用处精确注解(Annotation Use-site Targets)  
	当对属性或主构造函数参数进行注解时,一个Kotlin属性元素会生成多个Java元素,
	说白了就是,主构造函数参数(有val/var)就是kotlin类属性,
	而[kotlin类属性] = [Java类字段+get方法+set方法],
	因此在kotlin源码编译成Java字节码时,该注解可能同时在多个元素上!
	
	注解的完整列表:  
		@file      注解整个文件, 放在文件顶部(package指令之前)		
		 property  具有此目标的注解对Java不可见		
		 field     字段,Java字段注解		
		 get       属性的getter方法,对Java get方法注解		
		 set       属性的setter方法,对Java set方法注解		
		 receiver  扩展函数或属性的接收者参数		
		 param     构造函数参数		
		 setparam  属性的setter方法参数		
		 delegate  为委托属性存储其委托实例对象的字段		

	1.对属性元素(set/get/field/param)进行精确注解:
		//Ann是注解,@xx:是固定语法
		class Example(@field:Ann val foo,   //对Java字段注解
					  @get:Ann val bar,     //对Java get方法注解
					  @param:Ann val quux)  //对Java构造函数参数注解

	2.同一目标元素有多个注解,可在方括号[]添加多个注解,空格分隔：
		class Example {
			//collaborator的set方法有两个注解Inject和VisibleForTesting
			@set:[Inject VisibleForTesting] 
			var collaborator: Collaborator
		}

	3.使用相同语法注解整个文件,把@file注解放在文件顶部(package指令之前):
		@file:JvmName("Foo")
		package org.jetbrains.demo

	4.对扩展函数的接收者参数进行注解,语法如下:
			fun @receiver:Fancy String.myExtension() { }

	如果不指定使用处目标,则根据注解的@Target来选择目标,如果有多个目标就依次用: param property field
			
## 5.在Kotlin中使用Java注解(Java Annotation)
	Java注解 与Kotlin 100%兼容,示例如下:
		// 导入Java注解
		import org.junit.Test
		import org.junit.Assert.*
		import org.junit.Rule
		import org.junit.rules.*

		// kotlin代码,使用java注解
		class Tests {
			// @Rule注解用于tempFolder属性的getter方法/函数
			@get:Rule val tempFolder = TemporaryFolder()

			// @Test注解用于simple方法/函数
			@Test fun simple() {
				val f = tempFolder.newFile()
				assertEquals(42, getTheAnswer())
			}
		}

	1.因为Java声明的注解没有定义参数顺序,所以kotlin需要使用命名参数来传递注解参数:
		// Java代码,声明注解Ann
		public @interface Ann {
			int intValue();
			String stringValue();
		}

		// Kotlin代码,命名参数传递注解参数
		@Ann(intValue = 1, stringValue = "abc") class C

	2.在Java注解中,有一个特殊的value参数无需显式指定参数名:
		// Java
		public @interface AnnWithValue {
			String value();
		}

		// Kotlin
		@AnnWithValue("abc") class C

	3.如果Java注解的value参数类型是数组,那么在Kotlin中该参数类型就是vararg(参数个数可变)：
		// Java
		public @interface AnnWithArrayValue {
			String[] value();
		}
		// Kotlin,参数类型是vararg(参数个数可变),相当于数组
		@AnnWithArrayValue("abc", "foo", "bar") class C

	4.如果Java注解的其它参数类型是数组,那么在Kotlin中该参数需要显式使用arrayOf:
		// Java
		public @interface AnnWithArrayMethod {
			String[] names();
		}
		
		// Kotlin
		@AnnWithArrayMethod(names = arrayOf("abc", "foo", "bar")) class C

	5.Java注解实例对象值会作为Kotlin属性,暴露给Kotlin代码:
		// Java
		public @interface Ann {
			int value();
		}

		// Kotlin
		fun foo(ann: Ann) {
			val i = ann.value
		}		
		
简书：http://www.jianshu.com/p/7ec60cc61c7b   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/74781883   
GitHub博客：http://lioil.win/2017/07/07/Kotlin-annotation.html   
Coding博客：http://c.lioil.win/2017/07/07/Kotlin-annotation.html