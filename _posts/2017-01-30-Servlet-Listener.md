---
layout: post
title: Servlet-Filter和Listener
tags: J2eeWeb
---
# 一.过滤器Filter
	对指定的web资源进行拦截,实现一些特殊功能,如实现URL权限访问、过滤敏感词等等

## 1).注册过滤器
	方式一
		在WEB-INF/web.xml注册
		<filter>
			<filter-name>filter</filter-name>
			<filter-class>com.xxx.xxFilter</filter-class>
			<init-param>
				<param-name>name1</param-name>
				<param-value>value1</param-value>
			</init-param>
		</filter>
		<filter-mapping>
			<filter-name>filter</filter-name>		
			<url-pattern>/*</url-pattern> 指定要拦截的url
			<servlet-name>xxxServlet</servlet-name> 指定要拦截的Servlet
			<dispatcher>REQUEST</dispatcher> 指定要拦截资源的访问方式是REQUEST/FORWARD/INCLUDE/ERROR,默认REQUEST
		</filter-mapping>
	
	方式二
		在com.xxx.xxFilter类添加注解
		@WebFilter(filterName="filter",urlPatterns={"/*"},servletNames={"Demo1Servlet"})
	
## 2).实现接口	
	创建: web应用加载时,创建所有过滤器对象,调用init()初始化,一直驻留内存;
	销毁: web应用移除时,销毁所有过滤器对象,销毁前调用destroy()善后	
	public class xxFilter implements Filter {
		public void destroy() {		
		}

		// 每次拦截资源后调用
		public void doFilter(ServletRequest request, ServletResponse response,
				FilterChain chain) throws IOException, ServletException {
			FilterChain过滤器链对象,一个资源可能被多个过滤器所拦截,拦截顺序是web.xml中filter-mapping配置顺序
			FilterChain.doFilter()一旦被调用,就执行过滤器链的下一个节点,若当前是最后过滤器,则执行目标资源
		}

		public void init(FilterConfig filterConfig) throws ServletException {
			filterConfig.getInitParameter(String name) 获取web.xml过滤器配置信息
			filterConfig.getServletContext() 获取ServletContext对象
		}
	}

# 二.监听器Listener
	Servlet监听器: 监听ServletContext、Session和Request域的变化。

## 1.监听三大作用域的创建和销毁
	1)注册监听器
		方式一
		在WEB-INF/web.xml注册
		<listener>
			<listener-class>com.xxx.xxx</listener-class>
		</listener>
		
		方式二
		在com.xxx.xxx类添加注解@WebListener
	
	2)实现监听器接口
		public class xxx implements ServletContextListener {			
			// ServletContext创建: web应用被加载时创建
			public void contextDestroyed(ServletContextEvent sce) {			
			}
			
			// ServletContext销毁: web应用被移除时销毁
			public void contextInitialized(ServletContextEvent sce) {			
			}			
		}
		应用场景: 保存全局对象,如:创建数据库连接池; 加载框架配置文件;实现任务调度定时器

		public class xxx implements HttpSessionListener {
			// Session创建:首次调用request.getSession()时创建
			public void sessionCreated(HttpSessionEvent se) {
			}
			
			// Session销毁:超30分钟没用时销毁 /调用invalidate()销毁 
			// 服务器非正常关闭时销毁(正常关闭则被钝化,再次开启则被活化)
			public void sessionDestroyed(HttpSessionEvent se) {
			}
		}
		
		public class xxx implements ServletRequestListener {
			// Request创建:浏览器请求开始时创建		
			public void requestDestroyed(ServletRequestEvent sre) {			
			}
			
			// Request销毁:浏览器请求结束时销毁
			public void requestInitialized(ServletRequestEvent sre) {		
			}
		}
	
## 2.监听三大作用域属性的增删改	
	public class xxx implements ServletContextAttributeListener {
		public void attributeAdded(ServletContextAttributeEvent scab) {
			System.out.println("属性加入"+scab.getName()+":"+scab.getValue());
		}

		public void attributeRemoved(ServletContextAttributeEvent scab) {
			System.out.println("属性移除"+scab.getName()+":"+scab.getValue());
		}

		public void attributeReplaced(ServletContextAttributeEvent scab) {
			System.out.println("属性替换"+scab.getName()+":"+scab.getValue()+
			":"+scab.getServletContext().getAttribute(scab.getName()));
		}
	}
	
	public class xxx implements HttpSessionAttributeListener {
		public void attributeAdded(HttpSessionBindingEvent se) {
		}

		public void attributeRemoved(HttpSessionBindingEvent se) {
		}

		public void attributeReplaced(HttpSessionBindingEvent se) {
		}
	}
	
	public class xxx implements ServletRequestAttributeListener {
		public void attributeAdded(ServletRequestAttributeEvent srae) {
		}
		public void attributeRemoved(ServletRequestAttributeEvent srae) {
		}
		public void attributeReplaced(ServletRequestAttributeEvent srae) {
		}
	}


## 3.监听JavaBean对象在Session域中的变化
	public class JavaBean类 implements HttpSessionBindingListener ,HttpSessionActivationListener{
		...
		// javabean对象被绑到session
		public void valueBound(HttpSessionBindingEvent event) {			
		}
		
		// javabean对象被移出session
		public void valueUnbound(HttpSessionBindingEvent event) {			
		}
		
		// javabean对象随session活化
		public void sessionDidActivate(HttpSessionEvent se) {
		}

		// javabean对象随session钝化
		public void sessionWillPassivate(HttpSessionEvent se) {
		}
	}