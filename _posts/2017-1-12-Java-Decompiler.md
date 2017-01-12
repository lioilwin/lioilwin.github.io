---
layout: post
title: Java反编译工具
tags: Java
---

# 一、旧Java反编译工具
	以前流行的反编译工具JAD和JD-GUI(JD-Core)对于Java 5以后的版本新特性支持都不行了。

## JAD
	官网不在了，不再更新，不支持java 5及以后版本！

## JD
	官网http://jd.benow.ca、JD-Core更新于2014年、JD-GUI更新于2015年，不支持Java 5以后的一些新特性如syntactic sugar、Lambda、Default methods等！

# 二、新Java反编译工具
	近年来，市场上出现了一些新java反编译工具，较好支持了Java 5到8新特性，如Fernflower、Procyon、CFR等等。

## Fernflower
	开源项目https://github.com/fesh0r/fernflower  
	作者: Egor Ushakov  
	正在更新，是一个非常有前途的Java反编译器, 是IntelliJ IDEA默认Java反编译器，也是Android Studio的默认Java反编译器。

## Procyon
	开源项目https://bitbucket.org/mstrobel/procyon/wiki/Java%20Decompiler
	作者: Mike Strobel
	正在更新，支持Java 5 到 Java 8的新特性，特别擅长以下反编译:
	* 枚举Enum
	* switch字符串
	* 本地类(匿名和命名)
	* 注解 Annotations
	* Lambdas and 方法引用 (如the :: operator)

## CFR
	免费，但没有开源, http://www.benf.org/other/cfr  
	Author: Lee Benfield  
	正在更新，能反编译Java新特性(如Java 8 lambdas、Java 7 switch字符串)。