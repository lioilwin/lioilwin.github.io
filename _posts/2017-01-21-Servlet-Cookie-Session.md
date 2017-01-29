---
layout: post
title: Servlet会话Cookie和Session
tags: J2eeWeb
---
浏览器开始访问网站到结束期间产生的多次请求响应组合是一次会话,
可通过Cookie或Session技术保存会话产生的数据。

# 1.Cookie
	在浏览器保存会话数据
	浏览器一般只允许存放300个Cookie,
	每个站点最多存放20个Cookie,
	每个Cookie最大4KB
	
	会话Cookie:不设置过期时间,cookie只在内存中,不同浏览器进程不能共享,关闭浏览器就消失。
	持久Cookie:设置过期时间,cookie存到硬盘,可在不同浏览器进程间共享,关闭浏览器依然有效直到过期时间。

	// 新建Cookie
	new Cookie(name,value);
	// 添加Http响应头set-cookie,通知浏览器保存该cookie
	response.addCookie();
	// 获取Http请求头Cookie
	request.getCookies();

	// 通知浏览器cookie过期时间(Expires)
	// 不设置(或负值),存到内存,正值存到硬盘,0删除Cookie
	cookie.setMaxAge();
	cookie.getMaxAge();

	//通知浏览器cookie对应的url,
	//不设置,默认是发送该cookie的servlet所在url
	cookie.setPath();
	cookie.getPath();

	// 通知浏览器cookie对应的域名,
	// 浏览器会认为该cookie是第三方cookie而拒收
	cookie.setDomain();
	cookie.getDomain();


# 2.Session
	1)定义
	在服务器保存会话数据
	作用域:当前会话范围
	生存期:
	第一次调用reqeust.getSession()时创建,超30分钟没有使用销毁(在web.xml的<session-config>配置时长),
	调用session.invalidate()销毁、服务器非正常关闭时销毁;

	session钝化: 服务器正常关闭,未超时session以文件存在服务器(tomcat)work目录下
	session活化: 再启动服务器,钝化session恢复到内存

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