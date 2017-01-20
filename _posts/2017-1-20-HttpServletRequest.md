---
layout: post
title: HttpServletRequest总结
tags: J2eeWeb
---
代表Http请求对象，可获取Http请求内容(请求行、请求头、请求体)
	
## 1.获取浏览器信息
	request.getRequestURL 获取浏览器完整URL
	request.getRequestURI 获取Http请求行URL
	request.getQueryString 获取Http请求行参数
	request.getRemoteAddr 获取浏览器IP地址
	request.getMethod 获取浏览器请求方法
	request.getContextPath 获取当前web应用的访问目录
	
## 2.获取请求参数
	getParameter(name) 通过name获取一个值
	getParameterValues(name）通过name获取多值
	getParameterNames 获得所有请求参数名
	getParameterMap 获取所有请求参数Map<String,String[]>	
		
	服务器获取请求参数时，默认使用ISO8859-1解码，中文一定乱码
	
	// 通知服务器以utf-8解码请求体内容(只能POST提交)
	request.setCharacterEncoding("utf-8");
	
	// GET提交只能手动解决请求参数乱码
	String username = request.getParameter("username");
	username = new String(username.getBytes("iso8859-1"),"utf-8");
	System.out.println(username);
	
	在tomcat的server.xml配置<Connector URIEncoding指定GET请求参数的默认编码，		
	或<Connector useBodyEncodingForURI使请求体和请求行URI参数编码一致，
	但不推荐使用，因为Web发布环境通常不允许修改.

## 3.获取请求头
	request.getHeader(name) 获取指定名称的请求头的值
	request.getHeaders(String name) 获取指定名称的请求头值集合(请求头可重复)
	request.getHeaderNames 获取所有请求头名称组成的集合
	request.getIntHeader(name) 获取int类型的请求头的值
	request.getDateHeader(name) 获取日期对应毫秒(long类型)
	
	// Referer请求头防盗链
	String ref = request.getHeader("Referer");
	if (ref == null || !ref.startsWith("http://localhost")) {
		// 请求重定向
		response.sendRedirect(request.getContextPath() + "/index.html");
	} else {
		// 请求转发
		getServletContext().getRequestDispatcher("/index.html").forward(request, response);
	}		
		
## 4.请求域传递数据
	request.setAttribute("name", "value");
	request.getRequestDispatcher("/xx.jsp").forward(request, response);
	生存期：在servlet.service()调用前由服务器创建，随整个请求链结束而结束
	作用域：在整个请求链共享数据，在Servlet处理的数据存入request，请求转发到jsp展示
	
	
## 5.请求转发和包含
	只能在同一个WEB应用下, url以“/”开头，相对于当前WEB应用目录
	1).forward()
	不能将多个servlet输出合并一个输出,
	转发前写入response,但没发到浏览器,转发可以执行,但请求体将清空,请求头还在,
	转发前写入response,且已发到浏览器,转发会失败抛异常,
	一个Servlet不能多次转发, 因为一次转发后数据已发到浏览器，不能再发数据。
	
	response.getWriter().write("xxx");
	response.getWriter().flush(); 刷新缓冲区,发到浏览器
	request.getRequestDispatcher("url").forward(request, response);	
	
	2).include()
	可将多个Servlet输出合并一个输出，
	被包含的Servlet不能改变Http响应的状态码和响应头(存在这样的语句将被忽略)
	request.getRequestDispatcher("url").include(request,response);