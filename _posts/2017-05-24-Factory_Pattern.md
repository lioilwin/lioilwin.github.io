---
layout: post
title: 设计模式-三种工厂模式-比较区分
tags: JavaSE
---
# 介绍
	三大类：产品类——工厂类——客户类
	工厂模式的终极目标：使客户类和产品类相互独立, 互不依赖, 实现解耦！
	
	工厂模式分三类,从上到下逐步抽象化/接口化
	1.简单工厂Simple Factory : 产品类单体系,有接口/抽象类; 工厂类无接口/抽象类
	2.工厂方法Factory Method : 产品类单体系,有接口/抽象类; 工厂类有接口/抽象类
	3.抽象工厂Abstract Factory : 产品类多体系,有接口/抽象类; 工厂类有接口/抽象类
		
	工厂方法和抽象工厂的区别只是产品体系类别变多,使得工厂接口方法变多, 它们分界线很模糊	
	故而不必纠结工厂模式类型, 只要能实现代码解耦、而且工厂类简洁、可扩展即可！
		
# 一.简单工厂Simple Factory

```java

// 1.产品类单体系,有接口/抽象类————————————————————————————
public interface class 产品{  
    //接口方法接口...
} 

public class 产品A implements 产品{  
    public 产品A() {  
        ...
    }
	//接口方法实现...
}
public class 产品B implements 产品{  
    public 产品B(){  
        ...
    }	
	//接口方法实现...
}

// 2.工厂类无接口/抽象类————————————————————————————
public class 工厂{  
    public 产品 get产品(int type) {  
        switch(type) {          
			case 0:  
				return new 产品A();
			case 1:  
				return new 产品B();
        }  
        return null;  
    }  
}  

// 3.客户类——————————————————————————————————————————
public class 客户{  
    public static void main(String[] args) {  
        工厂 厂 = new 工厂();  
        产品 品A = 厂.get产品(0); 
        产品 品B = 厂.get产品(1);
    }  
}  

```

# 二.工厂方法Factory Method

```java

// 1.产品类单体系,有接口/抽象类————————————————————————————
public interface class 产品{  
    //接口方法定义...
} 

public class 产品A implements 产品{  
    public 产品A() {  
        ...
    }
	//接口方法实现...
}
public class 产品B implements 产品{  
    public 产品B(){  
        ...
    } 
	//接口方法实现...
}  


// 2.工厂类有接口/抽象类————————————————————————————
public interface 工厂 {  
    产品 get产品();  
}  
  
public class 工厂A implements 工厂{
    @Override  
    public 产品 get产品() {  
        return new 产品A();  
    }  
}  
public class 工厂B implements 工厂{  
    @Override  
    public 产品 get产品() {
        return new 产品B();  
    }  
}  

// 3.客户类————————————————————————————
public class 客户{  
    public static void main(String[] args) {  
		工厂 厂A = new 工厂A();  
        产品 品A = 厂A.get产品;
		
		工厂 厂B = new 工厂B();  
        产品 品B = 厂B.get产品;
    }  
} 

```

# 三.抽象工厂Abstract Factory 

```java

// 1.产品类多体系,有接口/抽象类————————————————————————————
public interface class 产品{  
    //接口方法定义...
}
public class 产品A implements 产品{  
    public 产品A() {  
        ...
    }
	//接口方法实现...
}
public class 产品B implements 产品{  
    public 产品B(){  
        ...
    } 
	//接口方法实现...
}  

public interface class 产物{  
    //接口方法定义...
}
public class 产物A implements 产物{  
    public 产物A() {  
        ...
    }
	//接口方法实现...
}
public class 产物B implements 产物{  
    public 产物B(){  
        ...
    } 
	//接口方法实现...
}  


// 2.工厂类有接口/抽象类————————————————————————————
public interface 工厂 {  
    产品 get产品(); 
    产物 get产物();  
}  
  
public class 工厂A implements 工厂{
    @Override  
    public 产品 get产品() {  
        return new 产品A();  
    }
	
	@Override  
    public 产物 get产物() {  
        return new 产物A();  
    }  
}  
public class 工厂B implements 工厂{  
    @Override  
    public 产品 get产品() {
        return new 产品B();  
    } 
		
	@Override  
    public 产物 get产物() {  
        return new 产物B();  
    }
}  

// 3.客户类————————————————————————————
public class 客户{  
    public static void main(String[] args) {  
		工厂 厂A = new 工厂A();  
        产品 品A = 厂A.get产品;
        产品 物A = 厂A.get产物;
		
		工厂 厂B = new 工厂B();  
        产品 品B = 厂B.get产品;
        产品 物B = 厂B.get产物;
    }  
} 

```