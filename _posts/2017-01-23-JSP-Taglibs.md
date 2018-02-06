---
layout: post
title: JavaEE-JSP基础-EL表达式和JSTL标签库(Taglibs)
tags: JavaEE
---
EL表达式和JSTL标签库: 在JSP页面代替java代码,便于编写

# 一.EL表达式
	作用: ${} 简化脚本表达式 <%= %>
	j2ee1.4以前版本需指定<%@ page isELIgnored="false">
	j2ee1.4以后版本默认支持EL表达式
	
### 1.EL内置对象
	EL内置11个对象,不需定义可直接使用	
	pageScope        获取page域属性组成的Map
	requestScope     获取reqeust域属性组成的Map
	sessionScope     获取session域属性组成的Map
	applicationScope 获取application域属性组成的Map

	pageContext      获取jsp的9大隐式对象, 如 ${pageContext.request}		
	initParam        获取在web.xml配置的WEB应用参数

	param           请求参数Map<String,String>,   如: ${param.userName}
	paramValues     请求参数Map<String,String[]>, 如: ${paramValues.userName[1]} 
	header          请求头Map<String,String[]>,   如: ${header["Accept-Language"] }
	headerValues    请求头Map<String,String[]>	

	cookie       获取cookie对象, 如 ${cookie.JSESSIONID.name} ${cookie.JSESSIONID.value}
	
### 2.EL语法
	1.常量(直接输出到HTML)
		${"字符串"}	 ${123}  ${true}  
		
	2.变量(在四大域搜寻)
		${userName} 在四大域搜寻变量名的值,不存在则返回"" (相当于 <%= pageContext.findAttribute("userName") %>)
		${pageScope.userName}
		${requestScope.userName}
		${sessionScope.userName}
		${applicationScope.userName}
		
		搜寻数组/集合对象
			${myList[0]}
			
		搜寻map对象
			${myMap.key}  
			${myMap["key-first.last"]}  key名是数字或特殊符(.-),必须用[]
			
		搜寻javaBean对象
			${user.getName()}  相当于 <%=user.getName()%>
	
	3.简单运算
		算数运算 
			${1+"2"} 非数字都被转成数字,不能转就报错,空元素当作没参与
			
		关系运算 > gt  < lt  >= ge  <= le  != ne  == eq
			${a>2}
		
		逻辑运算 && and  || or  ! not
			${a>2 && b>2}
				
		三元表达式 
			${name == null ? "张三" : name}
		
		域中指定的属性是否空 empty/not empty
			${not empty name}

### 3.调用java方法
	EL表达式可调用java静态方法,步骤如下:
	1)编写一个包含静态方法的类	
	2)编写一个tld文件,配置静态方法
		<?xml version="1.0" encoding="UTF-8"?>
		<taglib version="2.0" 
			xmlns="http://java.sun.com/xml/ns/j2ee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
			xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee http://java.sun.com/xml/ns/j2ee/web-jsptaglibrary_2_0.xsd">			
			<tlib-version>1.0</tlib-version>		
			<uri>http://www.lioil.win/method</uri>
			<short-name>my</short-name>
				<function>
					<name>elMethod</name>
					<function-class>win.lioil.Method</function-class>
					<function-signature>java.lang.String method(java.lang.String)</function-signature>
				</function>				
		</taglib>		
	3)在jsp中引入tld文件: <%@ taglib uri="http://www.lioil.win/method" prefix="my"%>		
	4)在jsp中调用java静态方法: ${my:elMethod("x")}
		
	* 对字符串进行操作,可以用EL函数库(JSTL标签库)

# 二.JSP原生标签(很少用)
	sun公司推出的原生标签,属于jsp规范,不需引入第三方标签库
	
	<jsp:inclue>  替代request.getRequestDispatcher().include()
	<jsp:forward> 替代request.getRequestDispatcher().forward()
	<jsp:param>   在url后接请求参数
	
	在域中搜寻名为id的bean，没有就在该域中创建
	<jsp:useBean id="beanName" class="package.class" scope="page|request|session|application"/>
	
	将请求参数存到bean对象, property指定请求参数/beanName对象属性名,param指定请求参数
	<jsp:setProperty name="bean" property="" param=""/>
		
	获取bean对象的属性值到输出流, property指定属性名
	<jsp:getProperty name="bean" property="" />
	
# 三.JSTL标签库(常用)
	全称Java Standard Tag Library,由JCP(Java Community Process)指定标准, 和EL配合取代JSP的Java代码,以便开发
	
## 1.下载JSTL标签库(Taglibs)
	一般使用JSTL1.1以上版本,现在最新版是JSTL1.2.5
	在Apache Tomcat官网下载JSTL标签库(Taglibs)
	下载地址: http://tomcat.apache.org/download-taglibs.cgi
	
	下载页面有4个jar包:
		Impl: 	taglibs-standard-impl-1.2.5.jar    JSTL实现类库
		Spec: 	taglibs-standard-spec-1.2.5.jar    JSTL标准接口
		EL: 	taglibs-standard-jstlel-1.2.5.jar  JSTL1.0标签-EL相关
		Compat:	taglibs-standard-compat-1.2.5.jar  兼容版本
			
	从README得知: 
		如果不使用JSTL1.0标签,可以忽略taglibs-standard-jstlel包,
		README没有介绍taglibs-standard-compat包,估计应该是兼容以前版本标签库,
		所以一般只需要 taglibs-standard-impl 和 taglibs-standard-spec 两个jar包

		Maven依赖配置如下:
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
	
	把上述两个jar包加到项目,或者复制到Tomcat/lib(所有项目都可以共用,一劳永逸)
	
## 2.核心标签库
		core 核心标签库 
		fmt  国际化标签 
		sql  数据库标签(废弃) 
		xml  XML标签(废弃)
	
	在jsp中引入 core fmt 标签库: 
		<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
		<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="f"%>
		
### 1.core标签库	
	输出默认转义
		 <c:out value="<h1>header</h1>" default="value"/>
		 <c:out value="${name}"/>
		
	操作域
		变量      <c:set var="name" value="value" scope="page"/>
		Map对象   <c:set target="${myMap}" property="name1" value="value1" scope="request"/>
		Bean对象  <c:set target="${myBean}" property="name2" value="value2" scope="request"/>
		删除属性  <c:remove var="name" scope="request"/>
		
	捕获异常	
		<c:catch var="e">
		  <%= 1/0 %>
		</c:catch>   
		${e.message }
		
	条件判断
		<c:if test="${i>1}" var="result" scope="page">
			大于1
		</c:if>
		<c:if test="${i<1}" var="result" scope="page">
			小于1
		</c:if>

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
		
	循环
		1.遍历集合List		
		<table border="1">
			<tr>
				<th>名称</th>
				<th>是否是集合中第一个元素</th>
				<th>是否是集合中最后一个元素</th>
				<th>显示当前遍历的索引</th>
				<th>显示当前遍历的计数</th>
			</tr>
			<c:forEach items="${myList}" var="it" varStatus="st" >
				<tr>
					<td>${pageScope.it}</td>
					<td>${pageScope.st.first}</td>
					<td>${pageScope.st.last}</td>
					<td>${pageScope.st.index}</td>
					<td>${pageScope.st.count}</td>
				</tr> 	  	
			</c:forEach>
		</table>
				 
		2.遍历Map
		<c:forEach items="${myMap}" var="entry" >
			${entry.key }:${entry.value }<br>
		</c:forEach>	
		
		3.循环计数(for i)
		<c:forEach begin="1" end="100" step="1" var="num" >
			${num}
		</c:forEach> 
		
	分隔字符串
		<c:forTokens items="sdfa,fsad,fds" delims="," var="result">
			${result}<br>
		</c:forTokens>
		
	在URL后加参数
		<c:param> 嵌套在<c:import>、<c:url>、<c:redirect>,为这些标签所用URL附加参数
	
	实现include功能
		<c:import url="/index.jsp" var="p" scope="page"></c:import>
		输出: ${p}
				
	URL重写
		<c:url value="/index.jsp" context="${pageContext.request.contextPath}" var="eurl" scope="page"></c:url>		
		<a href="${eurl}">xxx</a>
		
	请求重定向
		<c:redirect url="/index.jsp" context="${pageContext.request.contextPath}"></c:redirect>
				
### 2.fmt标签库
	格式化日期		
    	<fmt:formatDate 
			value="<%=new Date()%>"  
    		pattern="yyyy/MM/dd hh:mm:ss" var="date" scope="request" />
    		
    	${requestScope.date}
		
	格式化数字		
    	<fmt:formatNumber  value="3.1415926" pattern="0000.00000000000" var="num1" scope="request" />
    	<fmt:formatNumber  value="3.1415926" pattern="####.###########" var="num2" scope="request" />
    	${requestScope.num1}<br>
    	${requestScope.num2}<br>

简书: http://www.jianshu.com/p/bbe7d7a2207e   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/54685786   
GitHub博客：http://lioil.win/2017/01/23/JSP-Taglibs.html   
Coding博客：http://c.lioil.win/2017/01/23/JSP-Taglibs.html