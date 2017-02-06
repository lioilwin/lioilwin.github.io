---
layout: post
title: Java注解
tags: JavaEE
---
	注解(@xx): java1.5以后版本引入的特性,与类、接口、枚举类似,
	可在包、类、字段、方法、局部变量、方法参数等前面。
	
# 一.内置注解
	
## 1.元注解(用于修饰注解)
	@Retention(RetentionPolicy.xx) 指定注解的保留策略
		RetentionPolicy.SOURCE 注解会被编译器丢弃
		RetentionPolicy.CLASS(默认) 注解会保留在class文件,但JVM会忽略
		RetentionPolicy.RUNTIME 注解会保留在class文件中,JVM会读取,可通过反射获取注解
		
	@Target(ElementType.xx) 指定注解在类中的位置
	@Documented 表明注解可被javadoc提取
	@Inherited 表明注解可被继承
	
## 2.原生注解
	@Override 对覆盖父类方法标记,如果父类没有相应方法,则编译器会报错
	@Deprecated 表示类/方法/字段等已过时
	@SuppressWarnings 抑制编译器警告

# 二.自定义注解

## 1.声明注解
	@Retention(RetentionPolicy.RUNTIME)
	@Target({ ElementType.TYPE, ElementType.METHOD, ElementType.FIELD })
	public @interface MyAnno{
		//注解变量
		String id() default "..";
		String value() default "..";
	}
	
## 2.使用注解
	@MyAnno("...") // 只有value变量时,可忽略"value="
	public class AnnoTest{
		@MyAnno("...")
		public String testField1;
		
		@MyAnno(id="...",value="...")
		public String testField2;
		
		@MyAnno("...")
		public void test1(){
		}
		
		@MyAnno(id="...",value="...")
		public void test2(){
		}
	}
		
## 3.读取注解
	可通过反射机制读取注解(保留策略@Retention(RetentionPolicy.RUNTIME)	
	// 反射加载类
	Class<?> clazz = Class.forName("com.xxx.AnnoTest");
	
	// 1.获取类上的注解变量
	MyAnno myAnno1 = clazz.getAnnotation(MyAnno.class);
	System.out.println(myAnno1.id()+myAnno1.value());
	
	// 2.获取所有字段上的注解变量
	for ( Field field :clazz.getFields()) {
		MyAnno myAnno2 = field.getAnnotation(MyAnno.class);
		System.out.println(myAnno2.id()+myAnno2.value());
	}
	
	// 3.获取所有方法上的注解变量
	for (Method method : clazz.getDeclaredMethods()) {				
		MyAnno myAnno3 = method.getAnnotation(MyAnno.class);
		System.out.println(myAnno3.id()+myAnno3.value());
	}