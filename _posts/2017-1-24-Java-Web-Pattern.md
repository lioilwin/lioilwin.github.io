---
layout: post
title: Java Web开发模式的变迁
tags: J2eeWeb
---
参考:  
	http://www.cnblogs.com/hellokitty1/p/4954376.html
	http://blog.csdn.net/yue7603835/article/details/7479855
	http://blog.csdn.net/sunpeng19960715/article/details/50890705
		
# 1.只用Servlet
	最初Java Web开发, 只用Servlet就可开发一个Web应用程序, 但是输出Html文档相当麻烦！
	
# 2.只用JSP
	为解决用Servlet输出Html文档麻烦的问题,sun公司推出JSP技术,
	但当时的开发人员走向了另一个极端:【完全放弃Servlet,只用JSP】
	
	在JSP页面混合使用HTML标记和java代码来开发Web应用,只适合于业务流程简单的应用,
	如果系统复杂，JSP代码严重缺乏可读性,页面显示和业务逻辑混杂,维护及其艰难！   

# 3.JSP+JavaBean
	为解决程序可读性和可维护性,SUN公司使用JSP+JavaBean开发Web应用。	
	
	特点: JSP负责页面显示、JavaBean负责业务逻辑
	
    缺点: JSP将显示与控制集于一身
	
	结论: 适合小型项目的快速构建与运行
	
# 4.JSP＋Servlet＋JavaBean
	SUN公司引入了MVC模式,使用JSP＋Servlet＋JavaBean开发Web应用。
	
	特点：JSP负责页面显示、Servlet负责流程控制、JavaBean负责业务逻辑
	
    缺点：没有统一的开发框架导致开发周期长

# 5.Struts开发方案：
    特点：成熟的MVC开发框架。
	
    控制器C: ActionServlet组件: Struts框架的中央控制器。
            RequestProcessor组件: 每个子模块都具有的请求处理器。
            Action组件: 业务代理,它将调用模型进行一项具体的业务逻辑处理。
			
	视图V: 主要由JSP页面构成,还包括HTML文档、标准标签库(JSTL)和Struts标签库、
		  JavaScript脚本和CSS样式、多媒体文件、消息资源文件、ActionForm类。
		  
	模型M: 通常在Structs中使用其他模型组建来实现业务逻辑,
		  如：JavaBean技术、EJB技术、Hibernates设计模式。
		  
	结论: 对于一些大型的项目，Struts框架会提高开发效率，并对后期的维护有很大好处。

# 6.Spring开发方案：
    特点：拥有IOC和AOP两种先进的技术为基础,完美的简化了企业级开发的复杂度,是一个理想的Web程序框架。
    
	核心模块：实现了IOC模式, 包含BeanFactory类负责对JavaBean的配置与管理。
	
	上下文模块：继承BeanFactory类，添加了事件处理、国际化、资源装载、透明装载以及数据校验等功能，
	提供了框架式的Bean访问方式和很多企业级功能,如：JNDI访问、支持EJB、远程调用、继承模板框架、E-mail和定时任务调度等。
			  
	AOP模块：提供了用标准Java语言编写的AOP框架，使应用程序抛开EJB的复杂性，但拥有传统EJB的关键功能。
	
	DAO模块：提供了JDBC的抽象层，并且提供了对声明式事物和编程式事务的支持。
	
	Web模块：建立在上下文模块基础之上，提供了Servlet监听器的Context和Web应用的上下文,
	对现有的Web框架如：JSF、Tapestry、Struts等提供了集成。
	
	O/R映射模块：提供了对现有ORM框架的支持如Hibernate。
	建立在核心模块之上，嫩够适应于多种多视图、模板技术、国际化和验证服务，实现控制逻辑和业务逻辑清晰的分离。

# 7.Struts＋HIbernate开发方案
    利用Struts的MVC设计模式，与Hibernate持久化对象组成开发方案。

# 8.Struts＋Spring＋Hibernate开发方案
    Struts负责表示层、Spring负责逻辑层业务、Hibernate持久层中数据库的操作

# 9.Java Web经典三层架构
	三层框架是由Java Web提出的，这是JavaWeb独有的！ 
	WEB层+业务逻辑层(Service)+数据访问层(Data Access)
	
	·WEB层：包含JSP和Servlet等与WEB相关的内容； 
	·业务层：业务层中不包含JavaWeb API，它只关心业务逻辑； 
	·数据层：封装了对数据库的访问细节；
	
	注意:
		在Service层中不能出现JavaWeb API，例如request、response等。
		即Service层代码是可重用的(独立的)，可应用到非Web环境！
		
		Web层依赖Service层, 但Service层不依赖Web层;
		Service层依赖DAO层, 但DAO层不依赖Service层!
	
	
![](http://img.blog.csdn.net/20160316002015045)