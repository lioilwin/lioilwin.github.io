---
layout: post
title: HttpServletResponse总结
tags: JavaEE
---
HttpServletResponse代表Http响应,写入Response缓冲区,  
被servlet引擎获取,组合HTTP响应发给浏览器。

## 1.字符编解码	
	1)字节流输出
	// 通知浏览器解码
	response.setContentTye("text/html;charset=utf-8");
	// 通知服务器编码
	response.getOutputStream().write("中文".getBytes("utf-8"));	
	
	2)字符流输出
	// 通知浏览器解码
	response.setContentType("text/html;charset=utf-8");
	// 通知服务器编码(在setContentType()内部已调用)
	response.setCharcterEncoding("utf-8");		
	response.getWriter().write(“中文”);
	
	注意: getOutputStream()和getWriter()互斥, 特别是在forward()转发前后要一致.
	
	*在HTML文档模拟http响应头
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
	
## 2.文件下载
	// 设置Http响应头以attachment下载文件，
	// Http头只传输ASCII码字符,用URLEncoder转码成十六进制字符
	response.setHeader("Content-Disposition", "attachment;filename="+URLEncoder.encode("中文.jpg", "utf-8"));
	response.setContentType("image/jpeg;);
	InputStream in = new FileInputStream(getServletContext().getRealPath("中文.jpg"));
	byte[] buffer = new byte[1024];
	int len = 0;
	while((len=in.read(buffer))!=-1){
		response.getOutputStream().write(buffer,0,len);
	}
	in.close();
	
## 3.定时刷新
	response.setContentType("text/html;charset=utf-8");
	// 设置Http响应头refresh定时刷新
	response.setHeader("refresh", "3;url=/XXX/XXX");
	response.getWriter().write("注册成功!3秒后回到主页...");
	
	*在HTML文档模拟http响应头
	<meta http-equiv="refresh" content="3;url=/XXX/XXX">
	
## 4.浏览器缓存
	1)控制浏览器是否缓存，不同浏览器用不同响应头，一般都使用三个头
	// 浏览器不要缓存
	response.setIntHeader("Expires", -1); //0或-1表示不缓存
	response.setHeader("Cache-Control", "no-cache");
	response.setHeader("Pragma", "no-cache");
	 
	// 浏览器缓存一个月, 时间超过int范围，使用long
	response.setDateHeader("Expires", System.currentTimeMillis()+1000L*3600*24*30);
	
	*在HTML文档模拟http响应头
	<meta http-equiv="expires" content="-1">
	<meta http-equiv="Cache-Control" content="no-cache">
	<meta http-equiv="Pragma" content="no-cache">
	
## 5.请求重定向
	可重定向到同一个站点其他WEB应用资源,还可用绝对URL重定向到其他站点资源
	response.setStatus(302);
	response.setHeader("Location", "url");
	或
	response.sendRedirect("url");