---
layout: post
title: JavaEE-Servlet会话-Cookie和Session
tags: JavaEE
---
浏览器开始访问网站到结束期间产生的多次请求响应组合是一次会话,
可通过Cookie或Session技术保存会话产生的数据。

# 1.Cookie
	用于在浏览器保存会话数据(用户数据)
	
	Cookie 大小限制:
		浏览器一般只允许存放300个Cookie,每个站点最多存放20个Cookie,每个Cookie最大4KB
	
	Cookie 保存时长:
		会话 Cookie: 不设置过期时间,cookie只在内存中,不同浏览器进程不能共享,浏览器关闭就删除
		持久 Cookie: 设置过期时间,cookie存到硬盘,可以在不同浏览器进程间共享,浏览器关闭后依然有效,直到过期时间
	
	1.读写Cookie
		Cookie[] cookies =  request.getCookies(); //获取Http请求头 Cookie, 多个键值对
		Cookie cookie = new Cookie(key,value);
		response.addCookie(cookie);               //添加Http响应头 set-cookie,通知浏览器保存该cookie

	2.设置Cookie的过期时间(Expires)
		若不设置,Cookie默认只在浏览器内存中
		cookie.setMaxAge(24*60*60); //浏览器只保存1天(在硬盘中)
		cookie.setMaxAge(-1);       //浏览器关闭就删除(只在内存中,默认情况)
		cookie.setMaxAge(0);        //期限为0,浏览器会删除已存在的cookie
		
	3.设置Cookie归属的域名Domain/路径Path
		若不设置,默认设置为发送Cookie的域名Domain/路径Path	
		假设发送Cookie的资源路径是: http://www.lioil.win/testWeb/testJ
		cookie.setDomain("lioil.com"); //只能若设置为当前域名,或域名一部分
		cookie.setPath("/testWeb/testJ");
		cookie.setPath("/testWeb/");
		cookie.setPath("/");

	4.Cookie中文乱码
		Cookie是放在HTTP头部,而HTTP协议规定: 在HTTP头部只能用标准ACSII字符; 所以浏览器用ACSII解析中文出现乱码
		解决方法: 对中文进行URL编码转为ACSII字符(URLEncoder/URLDecoder)
		
		其实Cookie的中文乱码不需要解决, 虽然把Cookie传到浏览器显示乱码了, 但再传回来服务器解码就可以恢复中文！！！
		chrome浏览器设置界面可以查看Cookie的中文内容(估计是UTF-8解码)

# 2.Session
	1)定义
	在服务器保存会话数据(用户数据)
	生存周期:
		创建: 首次调用reqeust.getSession()创建
		销毁: 手动调用session.invalidate()销毁, 或session超时销毁, 或服务器非正常关闭销毁;
		
		session钝化: 服务器正常关闭,未超时的session会保存在硬盘(tomcat/work)
		session活化: 再启动服务器,钝化session恢复到内存
		
		默认超30分钟没有访问session对象就销毁
		在tomcat/conf/web.xml 或 web项目/web.xml 配置session的超时时长
			<session-config>
				<session-timeout>60</session-timeout>
			</session-config>
	
	session = request.getSession();
	session.getAttribute();
	session.getAttributeNames();
	session.setAttribute();
	session.removeAttribute();
	
	session.invalidate();
	session.getId();
	session.isNew();
	session.getCreationTime();
	session.getMaxInactiveInterval();

	2)原理
	调用request.getSession(),
	检查Http请求头有无cookie(sessionID),
		如果有,则找到服务器对应session,
		如果无,则检查Http请求URL有无sessionID,
			如果有,则找到服务器对应session,
			如果无,则认为浏览器无对应Session,创建Session,并在Http响应头添加cookie(sessionID)
			
	默认情况下,cookie(sessionID)没有设置MaxAge,只在内存中(不同浏览器无法公用),关闭浏览器cookie就丢失,
	可手动发送cookie(sessionID)设置MaxAge,使cookie存在硬盘中。
	
	3)URL重写
	浏览器禁用Cookie时,可将所有URL重写加上sessionID
	request.getSession() 在URL重写前一定要先创建出Session
	response.encodeURL() 一般地址重写
	response.encodeRedirectURL() 重定向地址重写
	
简书: http://www.jianshu.com/p/be23dbf46392   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/54644654   
GitHub博客：http://lioil.win/2017/01/21/Servlet-Cookie-Session.html  
Coding博客：http://c.lioil.win/2017/01/21/Servlet-Cookie-Session.html