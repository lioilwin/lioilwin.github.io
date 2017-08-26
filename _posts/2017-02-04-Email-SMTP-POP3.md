---
layout: post
title: Internet-邮件协议SMTP/POP3/IMAP
tags: Internet
---
	SMTP(Simple Mail Transfer Protocol): 用于发送邮件,控制信件中转,找到下一目的地(默认端口25)
	POP3(Post Office Protocol-Version 3): 用于支持客户端接收服务器上的电子邮件(默认端口110)
	IMAP(Internet Mail Access Protocol): 从邮件服务器上获取邮件信,与POP3区别是可修改服务器邮件状态(默认端口143)

# 1.SMTP协议发送邮件
	telnet smtp.163.com 25

	ehlo xxyyzz
	auth login
	(Base64编码的用户名)
	(Base64编码的密码)
	mail from:<xxx@163.com>
	rcpt to:<yyy@qq.com>
	data
	from:<xxx@163.cn>
	to:<yyy@qq.com>
	subject: 标题

	正文内容。。。。

	.

# 2.POP3协议接收邮件
	telnet pop3.163.com 110
	
	user 用户名
	pass 密码
	stat (邮箱统计信息)
	list (查看收件箱列表)
	list序号 (查看某一封邮件)
	retr序号 (查看某一封邮件头及内容)；
	quit (退出)

# 3.JavaMail发送邮件(SMTP协议)
	JavaMail是一套关于邮件协议(SMTP/POP3/IMAP)的Java EE规范接口API(位于javax.mail包),
	这接口的具体实现代码由sun提供(位于com.sun包),还依赖JAF(位于javax.activation包)。
	
	JavaMail包没有加入标准JRE类库,需另外下载https://java.net/projects/javamail/pages/Home,
	Java SE 6以上版本的JRE类库已加入JAF(JavaBeans Activation Framework),不需另外下载
	
	JavaMail API:
	javax.mail.Session 环境信息(如协议名/服务器地址/端口号)
	javax.mail.Message 封装邮件信息(如发件人/收件人/邮件标题/内容)
	javax.mail.Transport 连接SMTP服务器,发送邮件  
	javax.mail.Store 连接POP3/IMAP服务器,收取邮件
	
	// 1.配置环境信息
	Properties prop = new Properties();
	prop.setProperty("mail.transport.protocol", "smtp"); // 邮件协议名
	prop.setProperty("mail.smtp.host", "smtp.163.com"); // SMTP服务器地址
	prop.setProperty("mail.smtp.auth", "true"); // 开启权限
	prop.setProperty("mail.debug", "true"); // 开启调试信息
	Session session = Session.getInstance(prop); // 加载配置

	// 2.封装邮件信息
	Message message = new MimeMessage(session);
	message.setFrom(new InternetAddress("xxx@163.com"));
	message.setRecipient(RecipientType.TO, new InternetAddress("yyy@qq.com"));
	message.setSubject("标题！");
	message.setText("正文内容。。。。。。");

	// 3.连接SMTP服务器
	Transport transport = session.getTransport();
	transport.connect("xxx", "***");

	for (int i = 0; i < 3; i++) {
		// 4.发送邮件
		transport.sendMessage(message, message.getAllRecipients());
	}
	
	// 5.关闭连接
	transport.close();

简书: http://www.jianshu.com/p/de157adf987e  
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/54859305   
GitHub博客：http://lioil.win/2017/02/04/Email-SMTP-POP3.html   
Coding博客：http://c.lioil.win/2017/02/04/Email-SMTP-POP3.html