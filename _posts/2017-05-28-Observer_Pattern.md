---
layout: post
title: Java-设计模式-观察者模式
tags: Java
---
# 一.介绍
	观察者模式Observer(又称为发布publish-订阅Subscribe模式、模型-视图模式、源-收听者模式或从属者模式)是软件设计模式的一种!
		
	完美将观察者和被观察对象分离,定义了对象间的一对多依赖关系,
	一个对象(被观察者)状态发生变化时, 所有对象(观察者)都得到通知并自动刷新!	
	例如UI可作为观察者, 业务数据是被观察者，数据发生变化, 通知UI更新。
	
	实现观察者模式时要注意，观察者和被观察对象之间互动关系不能体现成类之间直接调用，
	否则就将使观察者和被观察对象之间紧密的耦合起来，从根本上违反面向对象的设计原则。
	无论是观察者“观察”观察对象，还是被观察者将自己的改变“通知”观察者，都不应该直接调用！
	
	面向对象设计一个原则：一个对象(类)只做一件事情，不管其它！
	观察者模式在模块之间划定了清晰界限，提高了应用程序的可维护性和重用性。
		
# 二.使用
	java标准已经有：观察者接口Observer，被观察者抽象类Observable
	所以Java使用观察者模式很方便快捷！
	
## 1.添加观察者(注册/订阅)

```java

void 添加观察者(){
	Observable o = new 被观察者();
	o.addObserver(new 观察者A());
	o.addObserver(new 观察者B());
}

```
	
## 2.观察者
	
```java

public class 观察者A implements Observer {
	// 被观察者改变了，通知观察者A
    @Override
    public void update(Observable o, Object arg) {
    }
}

public class 观察者B implements Observer {
	// 被观察者改变了，通知观察者B
    @Override
    public void update(Observable o, Object arg) {
    }
}

```

## 3.被观察者

```java

public class 被观察者 extends Observable {
	// Observable.addObserver()添加观察者,保存了所有观察者
	
    void 被观察者改变了(){		
        setChanged();
        // 循环遍历所有观察者对象,调用update(...),通知所有观察者        
        notifyObservers();
    }
}

```

简书: http://www.jianshu.com/p/1e4bf0b7f744   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/72792614   
GitHub博客：http://lioil.win/2017/05/28/Observer_Pattern.html   
Coding博客：http://c.lioil.win/2017/02/28/Observer_Pattern.html