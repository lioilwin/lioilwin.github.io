---
layout: post
title: JavaSE-Java泛型(Generic)
tags: JavaSE
---
	泛型本质是参数化类型,即数据类型是一个参数。
	可用在类/接口/方法中,分别称为泛型类/泛型接口/泛型方法,
	用于数据类型不确定的情况下！

# 一.定义泛型	

## 1.泛型类(作用范围是整个类)
	class Gen<T> {
		private T object;
		
		public Gen(T object) {
			this.object = object;
		}
		
		public T getObject() {
			return object;
		}
	}
 
	public class GenDemo {
		public static void main(String[] args) {
			// 定义Int版本
			Gen<Integer> intObj = new Gen<Integer>(88);
			int i = intObj.getObject();
	
			// 定义String版本
			Gen<String> strObj= new Gen<String>("Hello");
			String s = strObj.getObject();
		}
	}
	
	注意: 因为static方法无法访问[泛型类的参数T]，所以static方法使用泛型功能,必须用[泛型方法].
	
## 2.泛型方法(作用范围是整个方法)
	public class A {
		// 必须先定义<T>,其中字母可以是任意字母,通常大写字母		
		public static <T> void test(T t) {
			System.out.println(t.getClass().getName());
		}
		
		public static void main(String[] args) {		
			// 当方法被调用时,虚拟机自动判断T的具体类型
			A.test("x");
			A.test(1);
			A.test(new A());
		}
    }

	
# 二.泛型边界		
	泛型引用不确定,可使用泛型通配符?	
	Class<?> clazz = Class.forName("xxx");
	List<?> list = null;
	list = new ArrayList<String>();	
	list = new ArrayList<Integer>();
	注意：
		1.通配符?只能用于泛型引用,不能用于泛型对象！
		2.如果只指定了<?>,则默认是任意类
		3.通配符泛型限制,<? extends Collection> <? super Double>

	泛型边界
	T extends A 指定泛型上边界类(泛型T必须是A类或其子类)		
	T super B 指定泛型下边界类(泛型T必须是B类或其超类)

简书: http://www.jianshu.com/p/f214a26f4277  
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/54897872   
GitHub博客：http://lioil.win/2017/02/06/Java-Generic.html   
Coding博客：http://c.lioil.win/2017/02/06/Java-Generic.html