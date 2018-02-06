---
layout: post
title: JavaEE-HttpServletResponse总结
tags: JavaEE
---
## HttpServletResponse
	设置状态码和响应头
		void setStatus(int st)
		void sendError(int sc)
		void setHeader(String name, String value)	
		void addHeader(String name, String value)
	
	请求重定向(302 + Location)
		response.setStatus(302); //设置状态码 302				
		response.setHeader("Location", "http://lioil.win"); //设置响应头 Location
		
		//重定向简化版
		response.sendRedirect("http://lioil.win");

### 1.字符编码
	1)字节流输出		
		response.setContentType("text/html;charset=utf-8");         //设置浏览器字符解码
		response.getOutputStream().write("中文".getBytes("utf-8")); //设置服务器字符编码
	
	2)字符流输出	
		response.setContentType("text/html;charset=utf-8"); //设置浏览器字符解码
		response.setCharcterEncoding("utf-8");              //设置服务器字符编码(在setContentType中已实现,可省略)
		response.getWriter().write("中文");
		
	注: 
		setContentType("text/html;charset=utf-8") = setHeader("content-type", "utf-8") + setCharcterEncoding("utf-8")
		getOutputStream()和getWriter()互斥,尤其在forward()转发前后要一致
	
	* 在HTML文档模拟HTTP响应头
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
	
### 2.文件下载
	// 设置Http响应头 Content-Disposition, Http头部只传输ASCII码字符, 用URLEncoder转码成十六进制字符
	response.setContentType("image/jpeg;);
	response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode("中文.jpg", "utf-8"));
	InputStream in = getServletContext().getResourceAsStream("中文.jpg"));
	byte[] buffer = new byte[1024];
	int len = 0;
	while((len=in.read(buffer))!=-1)
		response.getOutputStream().write(buffer,0,len);
	response.getOutputStream().flush();
	in.close();
	
### 3.定时刷新
	response.setContentType("text/html;charset=utf-8");
	response.setHeader("refresh", "3;url=http://lioil.win"); //设置Http响应头refresh定时刷新
	response.getWriter().write("注册成功!3秒后回到主页...");
	
	* 在HTML文档模拟HTTP响应头
		<meta http-equiv="refresh" content="3;url=http://lioil.win">
	
### 4.浏览器缓存
	A.浏览器缓存的有效期
		// 控制浏览器不使用缓存,一般都使用以下三个头,兼容不同浏览器
		response.setIntHeader("Expires", -1); //0或-1表示不缓存
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Pragma", "no-cache");
		 
		// 浏览器缓存1小时, Expires是绝对时间,要求客户端与服务器时间一致(无法保证,不建议使用,建议用Cache-Control)
		response.setDateHeader("Expires", System.currentTimeMillis()+3600*1000L);
		response.setHeader("Cache-Control", "max-age = 3600");
		
		* 在HTML文档模拟HTTP响应头
			<meta http-equiv="expires" content="-1">
			<meta http-equiv="Cache-Control" content="no-cache">
			<meta http-equiv="Pragma" content="no-cache">
		
	B.浏览器缓存是否最新(需要浏览器再次请求确认)
		// 服务器在HTTP响应头中 Last-Modified 或 ETag 传给浏览器保存
		// 浏览器在HTTP请求头中 If-Modified-Since 或 If-None-Match 传给服务器, 若时间或标记一致, 则服务器返回状态码: 304 Not Modified   
		response.setDateHeader("Last-Modified", System.currentTimeMillis()); // 数据的修改时间(配合HTTP请求头 If-Modified-Since) 
		response.setHeader("ETag", "1");                                     // 数据的修改标记(配合HTTP请求头 If-None-Match)
		
		缓存优先级: ETag > Last-Modified (通过修改时间来确认是否最新,Last-Modified有一定的局限性)
		
简书: http://www.jianshu.com/p/c77022355847   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/54628760   
GitHub博客：http://lioil.win/2017/01/20/HttpServletResponse.html  
Coding博客：http://c.lioil.win/2017/01/20/HttpServletResponse.html   