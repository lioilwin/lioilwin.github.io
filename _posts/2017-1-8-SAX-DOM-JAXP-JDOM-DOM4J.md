---
layout: post
title: 总结SAX/DOM、JAXP、JDOM和DOM4J
tags: J2eeWeb
---
## 1、DOM和SAX     
①DOM和SAX是对XML解析的两种标准方法(没有具体代码实现)！    
②DOM是W3C官方标准；而SAX是"民间"的社区标准。    
③DOM采用树形结构，完整加载到内存后才解析；耗内存，能增删改查，任意读取任何位置数据(回读),常用于频繁访问小XML文档。  
④SAX采用事件驱动，流式边读边解析；节省内存，只能查询，只能从上往下顺序读取(不能回读)，用于特别大XML文档。 
(Pull解析也基于事件驱动，Android默认解析方式，适用于移动平台)

## 2、JAXP、JDOM和DOM4J  
JAXP、JDOM和DOM4J都是封装了sax/dom两种接口的Java代码实现API，以供Java开发人员使用。

### ① JAXP
Java se的解析XML基础类库是SAX(org.xml.sax)/DOM(org.w3c.dom)，    
JAXP(javax.xml.parsers)只是定义了一套操作XML文件的统一API框架，封装了sax/dom两种解析以便开发，并不提供新解析功能。  
```java
// JAXP-SAX解析器，获取sax解析器, 注册事件处理器
SAXParserFactory.newInstance().newSAXParser().parse("xml文件", new MyContentHandler());
// 事件处理器
class MyContentHandler extends DefaultHandler{
	@Override
	public void startElement(String uri, String localName, String name, Attributes attributes){}	
	@Override
	public void characters(char[] ch, int start, int length){}	
	@Override
	public void endElement(String uri, String localName, String name){}
}

// JAXP-DOM解析，获取Dom解析器
DocumentBuilder builder= DocumentBuilderFactory.newInstance().newDocumentBuilder();  
Document document= builder.parse("xml文件");  
```

### ② Dom4j和JDOM
Dom4j是由早期开发JDOM的人分离出来而后独立开发、比JDOM性能更好、易用。  
```java
// Dom4j对Xml文档增删改查
	// 元素增删改查
	public void element() throws Exception{
		Document document = new SAXReader().read("xml文件");
		Element rootElement = document.getRootElement();
		
		// 查询元素
		rootElement.element("元素名").getText();
		
		// 增加元素	
		rootElement.element("元素名").add(DocumentHelper.createElement("元素名"));
		
		// 修改元素名和内容
		rootElement.element("元素名").setText("元素内容");
		rootElement.element("元素名").setName("元素名");
		
		// 删除元素
		Element element = rootElement.element("元素名");
		element.getParent().remove(element);
		
		// 输出到Xml文件
		XMLWriter writer = new XMLWriter(new FileOutputStream("book.xml"),OutputFormat.createPrettyPrint());
		writer.write(document);
		writer.close();		
	}

	// 属性增删改查
	public void attr() throws Exception{	
		Document document = new SAXReader().read("xml文件");
		Element rootElement = document.getRootElement();
				
		// 查询属性
		rootElement.element("元素名").attributeValue("属性名");
		
		// 增加/修改属性
		rootElement.element("元素名").addAttribute("属性名", "属性值");
		
		// 删除属性
		Attribute attr = rootElement.element("元素名").attribute("出版社");
		attr.getParent().remove(attr);
		
		// 输出到Xml文件
		XMLWriter writer = new XMLWriter(new FileOutputStream("book.xml"),OutputFormat.createPrettyPrint());
		writer.write(document);
		writer.close();
	}
```

三种Java解析综合比较，DOM4J更好针对 Java开发者的易用性和直观操作，更完整的解决方案，处理所有Java/XML 问题，很多软件都采用Dom4j，例如Hibernate，sun公司的JAXM也用了Dom4j