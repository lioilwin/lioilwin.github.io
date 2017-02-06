---
layout: post
title: JSP基础-EL表达式和JSTL标签库
tags: JavaEE
---
	作用: 在JSP页面代替java代码,便于编写

# 一.JSP标签
	sun公司原生标签,属于jsp规范,不需引入第三方标签库
	
	<jsp:inclue>替代request.getRequestDispatcher().include()
	<jsp:forward>替代request.getRequestDispatcher().forward()
	<jsp:param>在url后接请求参数
	
	<jsp:useBean id="beanName" class="package.class" scope="page|request|session|application"/>
	在域中搜寻名为id的bean，没有就在该域中创建
	
	<jsp:setProperty name="bean" property="" param=""/>
	将请求参数存到bean对象, property指定请求参数/beanName对象属性名,param指定请求参数
		
	<jsp:getProperty name="bean" property="" />
	获取bean对象的属性值到输出流, property指定属性名

# 二.EL表达式${}
	作用: 替代<%= %>脚本表达式
	j2ee1.4以后版本默认支持EL,
	j2ee1.4以前版本需指定<%@ page isELIgnored="false">
	
## 1.常量和变量

### 1)常量
	直接输出${字符串/数字/布尔值}
	
### 2)变量
	在四大域搜寻,不存在则返回""(相当于调用pageContext.findAttribute())	
	${propName} 搜寻变量,然后输出
	${pageScope/requestScope/sessionScope/applicationScope.proName}在指定域搜寻
	 
	${list[0]} 搜寻数组/集合,然后输出
	${map.key} 搜寻map对象,然后输出
	${map["key-first.last"]} key名是数字或特殊符(.-)必须用[]
	
	${javaBean.propName} 搜寻javaBean对象(相当于javaBean.getPropName())
	
### 3)简单运算
	算数运算
		${1+"2"} 非数字都被转成数字,不能转就报错,空元素当作没参与
	关系运算
		> gt
		< lt
		>= ge
		<= le
		!= ne
		== eq
	
	逻辑运算 
		&& and 
		|| or 
		! not
			
	三元表达式
		${name == null ? "张三" : name}
	
	empty/not empty		
		对象是否为null
		字符串是否为空/""
		集合是否为空/长度为0
		${empty pageScope}域中有无属性
		
### 4)内置对象
	EL内置11个对象,不需定义可直接使用
	pageContext对象,获取jsp的9大隐式对象,如${pageContext.request.contextPath}
	
	pageScope 获取page域属性组成的Map
	reqeustScope 获取reqeust域属性组成的Map
	sessionScope 获取session域属性组成的Map
	applicationScope 获取application域属性组成的Map
	
	initParam 在web.xml配置的web应用参数
	
	param 请求参数Map<String,String>, 如${param.userName}
	paramValues 请求参数Map<String,String[]>, 如${paramValues.userName[1]} 
	
	header 请求头Map<String,String[]>, 如${header["Accept-Language"] }
	headerValues 请求头Map<String,String[]>
	
	cookie 获取cookie对象, 如${cookie.JSESSIONID.name} ${cookie.JSESSIONID.value}
		
### 5)调用java方法
	EL表达式可调用java静态方法
	1)编写一个类,包含静态方法
	2)编写一个tld文件,描述静态方法,和
	3)在tld文件配置静态方法
		<?xml version="1.0" encoding="UTF-8"?>
		<taglib version="2.0" xmlns="http://java.sun.com/xml/ns/j2ee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-jsptaglibrary_2_0.xsd">
		<tlib-version>1.0</tlib-version>		
		<uri>http://www.xxx.com/method</uri> 指定名称空间
		<short-name>me</short-name> 名称空间缩写		
			<function>
				<name>elMethod</name> EL调用时的静态方法名
				<function-class>com.xxx.Method</function-class> 静态方法所在类全名
				<function-signature>
					java.lang.String method(java.lang.String) 对静态方法描述
				</function-signature>
			</function>
		</taglib>
	4)在jsp用<%@ taglib uri="http://www.xxx.com/method" prefix="me"%>引入tld文件
	5)在jsp用${me:elMethod("x")}调用
		
	*对字符串进行操作,可以用EL函数库(JSTL标签库)

# 三.JSTL标签库
	全称Java Standard Tag Library,由JCP(Java Community Process)指定标准,		
	和EL配合取代JSP的Java代码,以便开发。
	
## 1.引入标签库
	一般使用JSTL1.1以上版本,JSTL1.0默认不支持EL表达式,
	现在最新JSTL1.2.5版,可在Tomcat官网下载JSTL标签库(Taglibs),
	下载地址http://tomcat.apache.org/download-taglibs.cgi,
	有4个jar包,从README得知,只需taglibs-standard-impl和taglibs-standard-spec两个包,
	不使用JSTL1.0标签,可以忽略taglibs-standard-jstlel包,
	README没有介绍taglibs-standard-compat包,估计应该是兼容以前版本标签库,

	如果使用Maven, 可用如下配置添加JSTL标签库
		<dependency>
		  <groupId>org.apache.taglibs</groupId>
		  <artifactId>taglibs-standard-spec</artifactId>
		  <version>1.2.5</version>
		</dependency>
		<dependency>
		  <groupId>org.apache.taglibs</groupId>
		  <artifactId>taglibs-standard-impl</artifactId>
		  <version>1.2.5</version>
		</dependency>
	
	下载后,把jar添加到/WEB-INF/lib目录, 在jsp用<%@ taglib %>引入标签库即可使用。
	
## 2.核心标签库
	分类
		核心标签库 core
		国际化标签 fmt
		数据库标签 sql
		XML标签 xml
		JSTL函数 EL函数
	
	<c:out>输出
		输出常量<c:out value="常量"/>
		输出变量<c:out value="${name}"/>
		输出默认值<c:out value="${name}" default="value"/>
		转义输出<c:out value="<h1>xxx</h1>"/>，EL转义输出${fn:escapeXml("<h1>xxx</h1>")
		
	<c:set>设置/修改域中属性
		设置/修改域中属性变量
		<c:set var="attr" value="value"></c:set>
		设置/修改域中属性Map类型
		<c:set target="${map1}" property="name1" value="value1"></c:set>
		设置/修改域中属性的JavaBean对象
		<c:set target="${bean}" property="name2" value="value2">

	<c:remove>删除域中属性
		<c:remove var="attr" />
		
	<c:catch>捕获异常
		<c:catch var="e">
		  <% int i = 1/0; %>
		</c:catch>   
		${e.message }
		
	<c:if test="">条件表达式
		<c:if test="${2>1}">
			对
		</c:if>
		<c:if test="${2<=1}">
			错
		</c:if>
		
	<c:choose>类似"if elseif else"条件判断
		<c:choose>
			<c:when test="${day == 1}">
				星期一
			</c:when>
			<c:when test="${day == 2}">
				星期二
			</c:when>
			<c:when test="${day == 3}">
				星期三
			</c:when>
			<c:when test="${day == 4}">
				星期四
			</c:when>
			<c:when test="${day == 5}">
				星期五
			</c:when>
			<c:otherwise>
				休息日
			</c:otherwise>
		</c:choose>
		
	<c:forEach>循环迭代操作,或按指定次数重复迭代
		遍历Map
		<c:forEach items="${map}" var="entry" >
			${entry.key }:${entry.value }<br>
		</c:forEach>
		
		遍历集合
		<c:forEach items="${list}" var="item">
			${item}
		</c:forEach>
		
	<c:forTokens>分隔字符串
		<c:forTokens items="sdfa,fsad,fds" delims="," var="str">
			${str}<br>
		</c:forTokens>
		
	<c:param>在URL后加参数
		嵌套在<c:import>、<c:url>、<c:redirect>,为这些标签所用URL附加参数
		
		
	<c:import>实现include功能	
		<c:import url="/index.jsp" var="p1" scope=""></c:import>
		scope指定域
		var指定/index.jsp页面存储在p1变量, 利用${p1}输出
		
	<c:url>实现URL重写
		<c:url value="/index.jsp" context="${pageContext.request.contextPath}" var="eurl" scope="page"></c:url>		
		<a href="${eurl}">xxx</a>
		
	<c:redirect>请求重定向
		<c:redirect url="/index.jsp" context="${pageContext.request.contextPath}"></c:redirect>