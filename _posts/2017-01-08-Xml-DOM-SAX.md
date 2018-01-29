---
layout: post
title: Xml解析总结-DOM-SAX-Pull
tags: Html_Xml
---
## 1.Xml解析方式-DOM,SAX,Pull
	1.DOM解析(Document Object Model)
		起源: W3C组织(world wide web)
		原理: 将整个XML文档加载到内存中,以树形结构形式存在(封装成DOM对象树);
		特点: 耗内存,但能对xml增删改查,能读取任意位置数据(回读),用于小XML文件
		
		DOM对象
			Document  整个文档(HTML,XML)
			Element   标签元素
			Attribute 标签属性
			Text      标签内的文本
			Common    注释
			
		浏览器解析Html,也是采取DOM解析!
	
	2.SAX解析(Simple API for XML)
		起源: 社区论坛
		原理: 基于事件驱动的流式解析(XML数据流,边读边解),读到一个文档事件就通知处理,处理完就释放内存,继续下一个事件
		特点: 省内存, 但只能顺序读取xml(不能回读),无法修改,用于大XML文件
		
		XML事件		
			startDocument (START_DOCUMENT) 文档开始事件
			endDocument (END_DOCUMENT)     文档结束事件
			startElement (START_TAG)       元素/标签开始事件
			endElement (END_TAG)           元素/标签结束事件
			character (TEXT)               文本事件
	
	3.Pull解析
		类似SAX,也是基于事件驱动,适用于移动平台,Android默认采用该解析方式(XmlPullParser)
		SAX解析: 自动触发事件,不解析完整个文档就不会结束解析
			(说白了就是框架自动读取触发事件,通过回调通知程序员,没有主动权,只能被迫解析完整个文档)
			
		Pull解析: 手动触发事件,可以中途结束解析
			(说白了就是程序员主动触发文档事件自己处理,把主动权交给我们自己,更灵活,可中途结束解析)

## 2.XML解析库-Java框架
### 1.JAXP
	JAXP是JDK自带的XML解析库,同时支持SAX/DOM两种解析方式
	常用类库包名:
		SAX:   org.xml.sax
		DOM:   org.w3c.dom
		JAXP:  javax.xml.parsers
		
```java

// SAX解析, 创建SAX解析器, 注册文档事件==================================================================================
SAXParserFactory.newInstance().newSAXParser().parse("XML文件", new MyContentHandler());
class MyContentHandler extends DefaultHandler{ // 事件处理器，被动触发，回调通知
	@Override
	public void startElement(String uri, String localName, String name, Attributes attributes){
		// 元素开始事件
	}
	
	@Override
	public void characters(char[] ch, int start, int length){
		// 文本事件
	}
	
	@Override
	public void endElement(String uri, String localName, String name){
		// 元素结束事件
	}
}

// DOM解析, 创建DOM解析器, 获取Document对象=================================================================================================
Document document = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse("xml文件");
// 利用Document Element Attribute等类, 对XML增删改查
  
```

### 2.Dom4j
	Dom4j是由早期开发JDOM的人分离出来而后独立开发,比JDOM性能更好
	Dom4j对Xml文档增删改查更方便, 很多商用软件都采用Dom4j, 例如Hibernate, JAXM 

```java

// 元素增删改查
public void element() throws Exception{
	Document document = new SAXReader().read("xml文件");
	Element rootElement = document.getRootElement();
	
	// 查询元素
	rootElement.element("元素名").getText();
	
	// 增加元素	
	rootElement.element("元素名").add(DocumentHelper.createElement("元素名"));
	rootElement.element("元素名").addElement("元素名");
	
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

### 3.XmlPullParser(Android自带的Pull解析类库)	

```java

// XmlPullParser常用方法
public void setInput (InputStream inputStream, String inputEncoding); // 设置XML文件输入流
public int getEventType (); // 获取当前事件类型
public int next ();         // 手动触发下一个事件
public String getName();    // 获取标签名
public String getAttributeValue (int index);// 获取属性值
public String nextText ();  // 当前是开始标签, 若下个元素为文本,则返回文本; 若是结束标签,则返回空字符串; 其它情况将抛出异常

// 创建XML解析器
XmlPullParser parser = XmlPullParserFactory.newInstance().newPullParser();
parser.setInput(new FileInputStream("xml文件"), encode);

// 手动循环触发事件,解析XML
int eventType = parser.getEventType();
while (eventType != XmlPullParser.END_DOCUMENT) { // 文档结束事件
	switch (eventType) {
	case XmlPullParser.START_DOCUMENT: // 文档开始事件		
		break;
	case XmlPullParser.START_TAG:      // 标签开始事件
		String tagName = parser.getName().trim();    // 标签名
		String attr = parser.getAttributeValue(...); // 属性值	
		String name = parser.nextText().trim();      // 标签内部文本		
		break;
	case XmlPullParser.END_TAG:        // 标签结束事件	
		break;
	}
	eventType = parser.next(); // 手动触发下一个事件
}

```

简书: http://www.jianshu.com/p/dfe369dce44d   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/54236641  
GitHub博客：http://lioil.win/2017/01/08/Xml-DOM-SAX.html  
Coding博客：http://c.lioil.win/2017/01/08/Xml-DOM-SAX.html