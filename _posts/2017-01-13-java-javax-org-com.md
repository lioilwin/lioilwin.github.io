---
layout: post
title: java、javax、org和com.sun包的区别
tags: JavaSE
---

来源：http://blog.csdn.net/ooppookid/article/details/51704792
Java、javax、org、sun包都是jdk提供的类包，且都是在rt.jar中。rt.jar是JAVA基础类库（java核心框架中很重要的包），包含lang在内的大部分功能，而且rt.jar默认就在根classloader的加载路径里面，所以放在classpath是多此一举 。他们之间的区别具体如下：

## 1. java.* 
Java SE的标准库，是java标准的一部分，是对外承诺的java开发接口，通常要保持向后兼容，一般不会轻易修改。包括其他厂家(IBMJDK/HPJDK/OpenJDK)在内，所有jdk的实现，在java.*上都是一样的。

## 2. javax.* 
也是java标准的一部分，但是没有包含在标准库中，一般属于标准库的扩展。通常属于某个特定领域，不是一般性的api。 
所以以扩展的方式提供api，以避免jdk的标准库过大。当然某些早期的javax，后来被并入到标准库中，所有也应该属于新版本JDK的标准库。比如jmx，Java 5以前是以扩展方式提供，但是jdk5以后就做为标准库的一部分了，所有javax.management也是jdk5的标准库的一部分。

## 3. com.sun.* 
是sun的hotspot虚拟机中java.* 和javax.*的实现类。因为包含在rt中，所以我们也可以调用。但是因为不是sun对外公开承诺的接口，所以根据根据实现的需要随时增减，因此在不同版本的hotspot中可能是不同的，而且在其他的jdk实现中是没有的，调用这些类，可能不会向后兼容，所以一般不推荐使用。

## 4. org.* 
是由企业或者组织提供的java类库，大部分不是sun公司提供的，同com.sun.*，不具备向后兼容性，会根据需要随时增减。其中比较常用的是w3c提供的对XML、网页、服务器的类和接口。