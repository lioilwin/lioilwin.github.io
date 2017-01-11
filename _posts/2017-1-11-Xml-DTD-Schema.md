---
layout: post
title: 总结XML、DTD和Schema
tags: HTML_XML
---

定义：XML是一种数据传输和存储格式，用标签保存数据内容，利用标签嵌套关系保存数据之间关系    
应用场景：不同平台间数据传输、程序配置文件   
存在形式：XML文件、也存在内存或网络中，不要把XML狭隘理解为XML文件   
校验：浏览器内置Html和XML解析器，可以校验xml是否正确    
 
## 一、XML语法 

```xml
  
1、声明或处理指令PI(processing instruction),指定解析器如何解析显示XML文档
	①声明前不能有任何内容(如注释)
		<?xml version="1.0" encoding="utf-8" standalone="yes"?>  
		version必须存在,当前xml所遵循规范版本1.0   	
		encoding指定xml解析编码,必须和xml文件保存编码一致,默认值iso8859-1(欧美拉丁字母符号，没有中文)   
		standalone指明xml是否独立,默认值yes表明不依赖其他文档,no表明依赖其他文档(很多解析器都会忽略此属性)  
	
	②处理指令PI
		<?xml-stylesheet type="text/css" href="xxx.css"?>为XML指定样式css显示

2、元素(xml标签)
	只能包含一个根标签	
	一个元素分为开始和结束标签<a>xxx</a>，其间有文本内容(标签体)  
	一个元素不含任何内容为自闭标签<a/>  
	区分大小写如<A>和<a>是不同标记  
	命名不能以数字、标点符号、"_"、"xml"开头,不能包含空格、冒号  

3、一个元素可以有多个属性,属性值用单引号或双引号<a size="xxx" color="xxx"/>,属性名遵循元素命名规则

4、<!-- 注释内容 -->，除了声明前外可在任意位置、不能嵌套注释  

5、转义字符/CDATA，可以使解析器将转义内容当作普通文本来处理
	①转义字符  
		&: &amp;  
		<: &lt;  
		>: &gt;  
		": &quot;  
		': &apos;
	②<![CDATA[内容]]>
		被括起来的内容，会被浏览器当作普通文本来处理
	
	区别：  
		CDATA可以成段的进行转义，而转义字符一次只能转义一个字符  
		CDATA可以保存原始数据，只通知解析器按普通文本去处理  
		转义字符改变了原始数据，用其他字符替代
		
```

## 二、XML约束

### 1、DTD是XML约束文件(.dtd)，约束xml写法，并对xml校验

```xml
	
①外部引入,在外部文件中写DTD,必须用utf-8编码保存
	<!DOCTYPE 根元素名称 SYSTEM 文件位置>
		SYSTEM表明dtd在当前文件系统中,后面文件位置是当前硬盘中的位置		
	<!DOCTYPE 根元素名称 PUBLIC "DTD名称" "DTD文件URL">
		PUBLIC表明dtd在网络公共位置中,后面指明dtd名字和所在网络URL地址
	
②内部引入,在xml中直接写<!DOCTYPE 根元素名称 [dtd约束的内容]>

③约束元素 <!ELEMENT 元素名称 元素约束>	
	元素约束:
		ANY表示包含任意子元素
		EMPTY表示不含子元素
		()表示子元素
		,表示子元素必须按顺序并列出现
		|表示子元素出现其中之一
		#PCDATA表示包含标签体
		+表示一次或多次
		*表示0次或多次
		?表示0次或一次
		组合：<!ELEMENT 元素名称 ((TITLE*, AUTHOR?, EMAIL)* | COMMENT)>
	
④约束属性 <!ATTLIST 元素名 属性名 属性类型 属性约束>	
	属性类型:
		CDATA表明普通字符串
		ENUMERATED表明取指定枚举列表值
		ID表明属性值在文档中唯一,只能以字母或下划线开头
	属性约束:
		#REQUIRED表明当前属性必须存在
		#IMPLIED表明当前属性可选
		#FIXED表明当前属性具有固定值
		'默认值'表明当前属性具有默认值

⑤实体ENTITY,对一段重复使用的内容引用、复用
	引用实体,在xml中引用的实体
		定义实体:<!ENTITY 实体名称 “实体内容” >
		使用实体:&实体名称;		
	参数实体,在dtd中引用的实体
		定义实体:<!ENTITY %实体名称 "实体内容">
		使用实体:%实体名称;
	
实例:
<?xml version = "1.0" encoding="utf-8" ?>
<!DOCTYPE 联系人列表[
	<!ELEMENT 联系人列表 ANY>
	<!ELEMENT 联系人 (姓名,EMAIL)>
	<!ELEMENT 姓名 (#PCDATA)>
	<!ELEMENT EMAIL (#PCDATA)>
	<!ATTLIST 联系人 编号 ID #REQUIRED>
]>
<联系人列表>
	<联系人 编号="a1">
		<姓名>张三</姓名>
		<EMAIL>zhang@it315.org</EMAIL>
    </联系人>
	<联系人 编号="a2">
		<姓名>李四</姓名>
		<EMAIL>li@it315.org</EMAIL>
	</联系人>
</联系人列表>

```

### 2、Schema也是xml约束文件(.xsd),目的是为了克服DTD缺陷

```xml

1)Schema本身符合xml语法,方便解析
2)对名称空间支持有非常好
3)比DTD更多数据类型,并且自定义数据类型
4)语义约束更精确,强于DTD
5)比DTD复杂多,学习成本高

Schema文档必须有一个根结点(称为Schema)	
名称空间xmlns:全世界唯一标识某个资源(通常是公司域名),仅是名称,不是真实的资源地址

实例:	
XSD文件(book.xsd)
<?xml version="1.0" encoding="UTF-8" ?> 
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
		targetNamespace="www.xxx.com"
		elementFormDefault="qualified">
	<xs:element name='书架' >
		<xs:complexType>
			<xs:sequence maxOccurs='unbounded' >
				<xs:element name='书' >
					<xs:complexType>
						<xs:sequence>
							<xs:element name='书名' type='xs:string' />
							<xs:element name='作者' type='xs:string' />
							<xs:element name='售价' type='xs:string' />
						</xs:sequence>
					</xs:complexType>
				</xs:element>
			</xs:sequence>
		</xs:complexType>
	</xs:element>
</xs:schema>

XML文件(.xml)
xmlns:w3指定名称空间(http://www.w3.org/2001/XMLSchema-instance)别名为w3
w3:schemaLocation指定名称空间(www.xxx.com)来源于book.xsd文件(可以是网络地址)
xmlns:my指定名称空间(www.xxx.com)别名为my
<my:书架 xmlns:w3="http://www.w3.org/2001/XMLSchema-instance"
		w3:schemaLocation="www.xxx.com book.xsd"
		xmlns:my="www.xxx.com">
	<my:书>
		<my:书名>JavaScript网页开发</my:书名>
		<my:作者>张孝祥</my:作者>
		<my:售价>28.00元</my:售价>
	</my:书>
</my:书架>

XML文件(.xml)
xmlns="www.xxx.com"可以忽略my 没有前缀默认使用这个空间
<书架 xmlns:w3="http://www.w3.org/2001/XMLSchema-instance"
	 w3:schemaLocation="www.xxx.com book.xsd"
	 xmlns="www.xxx.com">
	<书>
		<书名>JavaScript网页开发</书名>
		<作者>张孝祥</作者>
		<售价>28.00元</售价>
	</书>
</书架>

```