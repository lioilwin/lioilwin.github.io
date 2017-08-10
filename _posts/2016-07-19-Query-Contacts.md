---
layout: post
title: Android-读取所有联系人的简洁方法
tags: Android
---
搜了网上的获取所有联系人的代码，都是要连续查询两三个表才可以得到姓名和手机号信息，
太繁琐了，实际上使用android.provider.ContactsContract.CommonDataKinds.Phone
这个类可以直接获取姓名和手机号等等一系列常用数据。
Phone.CONTENT_URI已经将常用的几个表(raw contact contact data)合并在一起了，
无需再繁琐地去查询那几个表了，只需五行代码！

Cursor cur = getContentResolver().query(Phone.CONTENT_URI, null, null, null, null);
while (cur.moveToNext()) {
	String name = cur.getString(cur.getColumnIndex(Phone.DISPLAY_NAME));
	String number = cur.getString(cur.getColumnIndex(Phone.NUMBER));	
}
cur.close();

如果需要通过电话号码查找一个联系人，用PhoneLookup.CONTENT_FIILTER_URI。

1、Data表：每一行代表1种独立数据类型，在mimetypes中确定数据类型中，例如name,phone,email..
2、RawContracts表：由Data层的多条数据聚合成一个联系人。
3、Contracts表：大部分情况下这两层的数据时指同一个联系人的信息。

简书: http://www.jianshu.com/p/b713c9efd727   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/53711162  
GitHub博客：http://lioil.win/2016/07/19/Query-Contacts.html   
Coding博客：http://c.lioil.win/2016/07/19/Query-Contacts.html