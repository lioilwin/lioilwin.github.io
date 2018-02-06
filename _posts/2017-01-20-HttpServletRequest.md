---
layout: post
title: JavaEE-HttpServletRequest总结
tags: JavaEE
---
HttpServletRequest: 封装了Http请求内容(请求行, 请求头, 请求体)
	
## 1.HTTP请求行和请求头
	1.HTTP请求行
	GET /lifeWeb/lifeServlet?name=life HTTP/1.1

	request.getMethod()       获取Http请求行的方法     GET
	request.getRequestURI()   获取Http请求行的URL      /lifeWeb/lifeServlet
	request.getQueryString()  获取Http请求行的参数     name=life	
	request.getScheme()       获取Http请求行的协议     http
		
	request.getRequestURL()   获取Http请求完整URL      http://lioil.win/lifeWeb/lifeServlet
	
	request.getContextPath()  获取WEB应用的访问路径    /lifeWeb
	request.getServletPath()  获取Servlet的访问路径    /lifeServlet
	
	2.HTTP请求头
	request.getHeader(name)          获取指定名称的请求头的值
	request.getHeaders(String name)  获取指定名称的请求头值集合(请求头可重复)
	request.getHeaderNames()         获取所有请求头名称
	request.getIntHeader(name)       获取int类型的请求头的值
	request.getDateHeader(name)      获取日期对应毫秒(long类型)
	
	request.getContentLength()  获取请求正文长度 <=> request.getHeader("Content-Length")
	request.getContentType()    获取请求正文类型 <=> request.getHeader("Content-Type")
	
	request.getHeader("Host") 获取服务器域名(IP) + 端口
	request.getServerName()   获取服务器域名(IP)
	request.getServerPort()   获取服务器端口
	
	request.getRemoteHost()   获取客户端主机名(域名),获取失败,就返回IP
	request.getRemoteAddr()   获取客户端IP
	request.getRemotePort()   获取客户端端口
		
	// Referer请求头 防盗链
	String ref = request.getHeader("Referer");
	if (ref == null || !ref.startsWith("http://lioil.win"))
		response.sendRedirect(request.getContextPath() + "/index.html"); // 请求重定向	
	else
		getServletContext().getRequestDispatcher("/index.html").forward(request, response); // 请求转发
		
## 2.HTTP请求参数(GET/POST)和请求体(POST)
	1.HTTP请求参数(GET/POST)
	request.getParameter(name)       通过name获取单个值
	request.getParameterValues(name）通过name获取多个值(数组), checkbox
	request.getParameterNames        获得所有请求参数名
	request.getParameterMap          获取所有请求参数Map<String,String[]>

	* HTTP请求参数乱码
	在Tomcat8.0以下: 默认以"ISO8859-1"解码HTTP请求,该编码不包含有中文,有中文参数必定出现乱码
	从Tomcat8.0开始: 默认以"UTF-8"解码HTTP请求,该编码包含有中文,可以解码中文字符(客户端也是"UTF-8")
	
	参数乱码-解决方法:		
		1.GET/POST请求: 先将字符串按"ISO8859-1"获取字节,再将字节转码为"UTF-8"
		// 从Tomcat8开始默认编码是"UTF-8",所以不需要用该方法
		String par = request.getParameter("par");
		par = new String(par.getBytes("ISO8859-1"),"UTF-8");
		
		2.仅限POST请求: 指定服务器以"UTF-8"解码HTTP请求体
		request.setCharacterEncoding("UTF-8");
		
		3.在tomcat的server.xml中配置默认编码
			<Connector URIEncoding="UTF-8" /> 指定HTTP请求行URI的编码		
			或
			<Connector useBodyEncodingForURI="true" /> 指定HTTP请求行URI使用HTTP请求体的编码
	
	2.HTTP请求体(POST)
	request.getReader()      获取字符流
	request.getInputStream() 获取字节流
	
## 3.请求转发/包含(forward/include)
	请求转发/包含: 在同一个WEB应用下, 一个Servlet/JSP把HTTP请求和响应传给下一个Servlet/JSP处理

### 1.forward()
	原Servlet将request和response转发给其它Servlet后, 原Servlet不能再操作request和response(也不能再次转发)
	
	在转发前把数据写入HTTP响应体, 但没发出去, 转发可以执行,但响应体被清空(响应头不清空);
	在转发前把数据写入HTTP响应体, 发到浏览器, 转发失败抛异常(IllegalStateException: Cannot forward after response has been committed)
	response.getWriter().write("hello");
	response.getWriter().flush(); //刷新缓冲区,发到浏览器
	request.getRequestDispatcher("/s2").forward(request, response);	// 失败抛异常
		
### 2.include()
	原Servlet将request和response发给其它Servlet后, 原Servlet还能继续操作request和response(可以再次转发), 
	其它Servlet只能操作response响应体,不能改变response状态码和响应头(存在这样的语句也会被忽略),
	所以原Servlet和其它Servlet可以合并输出响应体
	response.getWriter().write("头部");
	request.getRequestDispatcher("/s2").include(request,response);
	response.getWriter().write("中间");
	request.getRequestDispatcher("/s3").include(request,response);
	response.getWriter().write("结尾");
	
	多个页面有重复内容,可以把重复内容封装到一个Servlet/jsp, 
	当需要显示这段重复内容时,只需要把封装的Servlet/jsp包含include即可.
		
### 3.请求域(request)
	请求域: 封装在request对象中的Map变量(键值对)
	生存期: HTTP请求到达时创建, HTTP响应发送完后销毁
	作用域: 只有一个request对象, 在整个请求链共享数据
		request.setAttribute(key, value);
		request.getAttribute(key);
		request.removeAttribute(key);
		request.getAttributeNames();
			
		// 在Servlet中把数据存入request对象, request请求转发到life.jsp展现数据
		request.setAttribute("name", "value");
		request.getRequestDispatcher("/life.jsp").forward(request, response);

简书: http://www.jianshu.com/p/7cedab4b09ef    
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/54628764   
GitHub博客：http://lioil.win/2017/01/20/HttpServletRequest.html   
Coding博客：http://c.lioil.win/2017/01/20/HttpServletRequest.html