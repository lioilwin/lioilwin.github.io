---
layout: post
title: Properties配置文件
tags: Java
---

public class Test{
    ·····
    // 读取Properties文件
    Properties pro = new Properties();  
    InputStream is = new FileInputStream("xx/xx/xx.properties")); 
    // 默认从Test类所在目录下获取，若以/开头则从类根目录(ClassPath)下获取
    InputStream is = getClass().getResourceAsStream("xx.properties");
    // 默认从类根目录(ClassPath)下获取，不能以/开头
    InputStream is = getClass().getClassLoader().getResourceAsStream("xx/xx/xx.properties");     
    pro.load(is);
    is.close();
    Iterator<String> it = prop.stringPropertyNames().iterator();
    while(it.hasNext())     
        System.out.println(key+":"+prop.getProperty(it.next()));    
    ·····

    // 写入Properties文件
    OutputStream os= new FileOutputStream("xx/xx/xx.properties", true);//true表示追加打开
    prop.setProperty("xxx", "xxx");
    prop.store(os, null);
    os.close();
}