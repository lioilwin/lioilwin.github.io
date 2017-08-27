---
layout: post
title: Android-Smali-入门介绍/基础语法
tags: Android
---
# 一.介绍
	百科名词：
		Smali/Baksmali分别是Android虚拟机Dalvik的.dex文件的汇编器/反汇编器。
		Smali/Baksmali实现了.dex格式所有功能(注解,调试信息,线路信息等)
		Smali/Baksmali分别是冰岛语中编译器/反编译器名字。也许你会问为什么是冰岛语呢？因为Dalvik是一个冰岛渔村名字！
		
	作用:	
		在没有源码情况下,修改一个APK的java代码最可靠方法是直接修改.smali代码文件(apktool工具把.dex反汇编成.smali);
		如果把.dex反编译为.class,再反编译.java,修改后重新编译,一般情况都很难正常运行,因为反编译流程太长了很容易出现错误！
		就如C/C++反编译都只到汇编语言级别,强行反编译为C/C++代码,基本上都会出错！
		
		所以把.dex反编译成java,仅用于查看,要修改时直接修改smali,然后重新编译运行(apktool工具把.smali汇编成.dex)

# 二.Smali语法
## ①基本数据类型
	smali类型  java类型
	V           void
	Z           boolean
	B           byte
	S           short
	C           char
	I           int
	J           long   64位 需要2个寄存器存储
	F           float
	D           double 64位 需要2个寄存器存储

## ②对象
	smali对象                   java对象
	Lpackage/name/ObjectName;  package.name.ObjectName
	Ljava/lang/String;         java.lang.String
	
	L 表示对象类型
	package/name 表示包名
	; 表示结束

## ③数组
	smali数组            java数组
	[I                   int[]    一维数组
	[[I                  int[][]  二维数组
	[Ljava/lang/String   String[] 对象数组	
	
	注：每一维最多255个

## ④类字段/变量
	Lpackage/name/ObjectName;——>FieldName:Ljava/lang/String;
	
	smali字段                     java字段
	public f1:Z                   public boolean f1; 						
	public f2:I                   public int f2;  
	public f3:Ljava/lang/String;  public String f3; 
		
	1.赋值
	静态static
		const-string v0, "Hello Smali"
		sput-object v0, Lcom/MyActivity;->name:Ljava/lang/String;
		
		相当于java代码 MyActivity.name = "Hello Smali"
		
	非静态instance
		.local v0, act:Lcom/MyActivity;
		const/4 v1, 0x2
		iput v1, v0, Lcom/MyActivity;->name:Ljava/lang/String;
		
		相当于java代码 act.name = "Hello Smali"
		
	2.取值
	静态(static fields)		
		sget-object v0, Lcom/MyActivity;->name:Ljava/lang/String;
		
		相当于java代码 v0 = MyActivity.name;
		
	非静态(instance fields)
		.local v0, act:Lcom/MyActivity;
		iget-object v1, v0 Lcom/MyActivity;->name:Ljava/lang/String;
		
		相当于java代码 v1 = act.name;

## ⑤类方法/函数	
	smali方法           
	myMethod([I)Ljava/lang/String;
	
	java方法
	String myMethod(int[])
	
	//Java代码
	protected void onCreate(Bundle savedInstanceState) {  
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);	
	}
	
	#samli代码
	.method protected onCreate(Landroid/os/Bundle;)V  
	.locals 1  
	.parameter "savedInstanceState"  
	.prologue  
	.line 8  
	invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V  
	.line 9  
	const/high16 v0, 0x7f03  
	invoke-virtual {p0, v0}, Lcom/fusijie/helloworld/MainActivity;->setContentView(I)V  
	.line 10  
	return-void  
	.end method
		
	#是smali注释
	.method和.end method 类似Java大括号{}	
	.locals 指定方法中非参寄存器总数,出现在方法第一行
	.registers 指定方法中寄存器总数
	.prologue 表示代码开始
	.line 表示java源码行号,用于调试
	invoke-static 调用static方法/函数
	invoke-super 调用父类方法
	invoke-direct 调用private方法
	invoke-virtual 调用protected或public方法
	return-void 表示方法结束返回void	
	p0 在静态方法中表示当前对象实例
	p1 表示当前onCreate方法参数
	v0 表示本地(局部)变量,存放在locals寄存器
		
	move-result 获取方法返回基本数据类型
	move-result-object 获取方法返回对象		
		const/4 v2, 0x0  
		invoke-virtual {p0, v2}, Lcom/Activity;->getPreferences(I)Landroid/content/SharedPreferences;  
		move-result-object v1  
		v1保存的就是调用getPreferences(int)方法返回的SharedPreferences实例
		
		invoke-virtual {v2}, Ljava/lang/String;->length()I  
		move-result v2  
		v2保存的则是调用String.length()返回的整型

	注: Long和Double类型是64位,需要2个寄存器存储参数
		例如:
			myMethod(IJ)V;
			参数			
			P1     I(int)
			P2,P3  J(long)

## ⑥条件判断语句(if)
	如果p1和v0相等,则执行c1流程
	if-eq p1, v0, :c1
	:c1
	invoke-direct {p0}, Lcom/paul/test/a;->d()V
	
	表示不相等,则执行c2流程
	if-ne p1, v0, :c2
	:c2
	invoke-direct {p0}, Lcom/paul/test/a;->c()V
	
	if-gt 大于
	if-ge 大于等于
	if-lt 小于
	if-le 小于等于

简书: http://www.jianshu.com/p/e601b4433d89   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/72973025   	
GitHub博客：http://lioil.win/2017/06/09/Android_Smali.html   
Coding博客：http://c.lioil.win/2017/06/09/Android_Smali.html