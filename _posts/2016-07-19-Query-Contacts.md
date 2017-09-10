---
layout: post
title: Android-联系人和短信数据库
tags: Android
---
# 一.联系人数据库
	1.data表: 存放各种类型数据,如name,phone,email,在mimetypes表中确定数据类型;
	2.raw_contacts表: 存放由data表多条数据关联一个联系人raw_contact_id;
	3.contacts表: 大部分情况下raw_contacts表多条数据关联一个联系人contact_id;
	4.mimetypes表: 联系人数据类型,例如name,phone,email..
	
	搜了网上的获取所有联系人姓名和手号的代码,都是要连续查询两三个表,太繁琐了!
	实际上使用android.provider.ContactsContract.CommonDataKinds.Phone.CONTENT_URI就可以了
	因为Phone.CONTENT_URI就是系统APP的ContentProvider.java联合查询几个表(raw contact, contact, data)
	无需再繁琐地去查询那几个表了,只需五行代码！
	Cursor cur = getContentResolver().query(Phone.CONTENT_URI, null, null, null, null);
	while (cur.moveToNext()) {
		String name = cur.getString(cur.getColumnIndex(Phone.DISPLAY_NAME));
		String number = cur.getString(cur.getColumnIndex(Phone.NUMBER));	
	}
	cur.close();
	
	此外,通过手机号查找联系人,使用PhoneLookup.CONTENT_FIILTER_URI

# 二.短信数据库
	在系统APP的SmsProvider.java
	短信会话content://sms/conversations对应的SQL语句
		SELECT
			sms.body AS snippet,
			sms.thread_id AS thread_id,
			groups.msg_count AS msg_count,
			sms.date AS,
			sms.address
		FROM  
			sms, (SELECT thread_id AS group_thread_id, MAX(date) AS group_date, 
			COUNT(*) AS msg_count FROM sms GROUP BY thread_id) AS groups
		WHERE
			sms.thread_id = groups.group_thread_id AND sms.date = groups.group_date
		ORDER BY date DESC
	
	查询短信常用uri
	短信详情uri: content://sms
	短信会话uri: content://sms/conversations
	Cursor cur = getContentResolver().query(uri, null, null, null, null);
	
	
简书: http://www.jianshu.com/p/b713c9efd727   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/53711162  
GitHub博客：http://lioil.win/2016/07/19/Query-Contacts.html   
Coding博客：http://c.lioil.win/2016/07/19/Query-Contacts.html