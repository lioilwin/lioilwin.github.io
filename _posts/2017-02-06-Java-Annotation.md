---
layout: post
title: JavaSE-Java注解(Annotation)
tags: JavaSE
---
	注解(Annotation): 
		与类、接口、枚举等在同一层次;
		用于修饰包/类/字段/方法/局部变量/方法参数等;
		常用作配置信息控制程序流转,替代配置文件.
	
# 一.内置注解
	
## 1.元注解(用于修饰注解定义)
	@Retention(RetentionPolicy.xx) 指定注解的保留策略
		RetentionPolicy.SOURCE 注解会被编译器丢弃
		RetentionPolicy.CLASS(默认) 注解会保留在class文件,但JVM会忽略
		RetentionPolicy.RUNTIME 注解会保留在class文件中,JVM会读取,可通过反射获取注解
		
	@Target(ElementType.xx) 指定注解在类中位置(包/类/字段/方法/局部变量/方法参数等)
	@Documented 表明注解可被javadoc提取到文档
	@Inherited 表明注解可被继承
	
## 2.原生注解
	@Override 对覆盖父类方法标记,如果父类没有相应方法,则编译器会报错
	@Deprecated 表示类/方法/字段等已过时
	@SuppressWarnings 抑制编译器警告

# 二.自定义注解(例)

## 1.定义注解
	// 使用@interface定义注解,类似接口的定义	
	@Retention(RetentionPolicy.RUNTIME)
	@Target({ ElementType.TYPE, ElementType.METHOD, ElementType.FIELD })	
	public @interface MyAnno{
		// 支持类型:String/基本类型/枚举/Class/其它注解类型/以上类型的一维数组
		String id() default "..";
		
		String value() default "..";
	}
	
## 2.使用注解
	如果注解只有一个名为value注解变量,则可省写value=,即@MyAnno("...")
	
	// 类注解
	@MyAnno("...")
	public class AnnoTest{	
		// 字段注解
		@MyAnno(id="...")
		public String testField;
		
		// 方法注解
		@MyAnno(id="...",value="...")
		public void testMethod(){
		}
	}
		
## 3.读取注解
	通过反射读取注解,保留策略必须是@Retention(RetentionPolicy.RUNTIME)
	
	// 反射加载类
	Class<?> clazz = Class.forName("com.xxx.AnnoTest");
	
	// 1.获取类注解, 类有无MyAnno注解
	if(clazz.isAnnotationPresent(MyAnno.class)){		
		MyAnno myAnno1 = clazz.getAnnotation(MyAnno.class);
		System.out.println(myAnno1.id()+myAnno1.value());	
	} 
	
	// 2.获取字段注解
	for ( Field field :clazz.getFields()) {
		// 字段有无MyAnno注解	
		if(field.isAnnotationPresent(MyAnno.class)){
			MyAnno myAnno2 = field.getAnnotation(MyAnno.class);
			System.out.println(myAnno2.id()+myAnno2.value());
		}
	}
	
	// 3.获取方法注解
	for (Method method : clazz.getDeclaredMethods()) {
		// 方法有无MyAnno注解	
		if(method.isAnnotationPresent(MyAnno.class)){
			MyAnno myAnno3 = method.getAnnotation(MyAnno.class);
			System.out.println(myAnno3.id()+myAnno3.value());
		}
	}

简书: http://www.jianshu.com/p/ef2c43a2e8ed  
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/54892680   
GitHub博客：http://lioil.win/2017/02/06/Java-Annotation.html   
Coding博客：http://c.lioil.win/2017/02/06/Java-Annotation.html