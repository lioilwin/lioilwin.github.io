---
layout: post
title: 区分SAX/DOM、JAXP、JDOM和DOM4J
tags: J2EE_Web
---

### 1、DOM和SAX     
①DOM和SAX是对XML解析的两种标准方法(没有具体代码实现)！    
②DOM是W3C官方标准；而SAX是"民间"的社区标准。    
③DOM采用树形结构，加载完文档才解析；耗内存，能增删改查，任意读取任何位置数据(回读),常用于频繁访问小XML文档。  
④SAX采用事件驱动，流式边读边解析；节省内存，只能读取，只能从上往下顺序读取(不能回读)，用于特别大XML文档。 


### 2、JAXP、JDOM和DOM4J  
①JAXP、JDOM、DOM4J都是封装了sax/dom两种接口的Java代码实现API，以供Java开发人员使用。    
②JDK解析XML核心类库是SAX(org.xml.sax)/DOM(org.w3c.dom)，自JDK1.5开始JDK实现为   
com.sun.org.apache.xerces.internal.parsers；  	
JAXP(javax.xml.parsers)没有提供新功能，只是封装了sax/dom，更加方便开发；  	

```java

// JAXP获取SAX解析器
SAXParser parser=SAXParserFactory.newInstance().newSAXParser(); 
parser.parse("xml文件", new MyHandler());  
// JAXP获取DOM解析器
DocumentBuilder builder= DocumentBuilderFactory.newInstance().newDocumentBuilder();  
Document document= builder.parse("xml文件");  

```

JDOM和DOM4J是第三方开源项目，DOM4J最初是JDOM的一种分支。      
③三种解析综合比较，DOM4J更好针对 Java开发者的易用性和直观操作，更完整的解决方案，处理所有Java/XML 问题，Java项目大都使用DOM4J来读写XML。