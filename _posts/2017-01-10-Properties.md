---
layout: post
title: Properties配置文件
tags: Java
---

1、读取Properties文件

```java

// 方法一、从工程目录下获取(Properties文件地址不灵活)
InputStream is = new FileInputStream("xx/xx/xx.properties")); 

// 方法二、默认从类(.class文件)所在目录下获取，若以/开头则从类根目录下获取
InputStream is = getClass().getResourceAsStream("xx.properties");

// 方法三、默认从类根目录下获取，不能以/开头
InputStream is = getClass().getClassLoader().getResourceAsStream("xx/xx/xx.properties");

Properties pro = new Properties(); 
pro.load(is);
is.close();

// 循环读取键值对
Iterator<String> it = pro.stringPropertyNames().iterator();
while(it.hasNext()) System.out.println(key+":"+pro.getProperty(it.next()));
			
```

2、写入Properties文件

```java

//true表示追加打开
OutputStream os= new FileOutputStream("xx/xx/xx.properties", true);
Properties pro = new Properties();

// 写入键值对
pro.setProperty("key", "value");

// 写入文件，参数二为文件开头的注释
pro.store(os, "xxx");
os.close();
	
```