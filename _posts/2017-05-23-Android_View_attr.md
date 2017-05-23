---
layout: post
title: Android控件(View)自定义属性_简化写法
tags: Android
---

## 一.声明属性类型(res/values/attrs.xml)


```xml

1.自定义属性正式写法,必须有此步骤,属性类型多样(int,float,boolean,enum....)
2.自定义属性简化写法,可忽略此步骤,但属性类型只有字符串

<resources> 
    <declare-styleable name="decAttrs">
        <attr name="name" format="string" />
        <attr name="state" format="boolean" />        
    </declare-styleable>
</resources>

```

## 二.使用属性(res/layout/layoutxxx.xml)

```xml

<RelativeLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
	
名字空间在Android Studio可用res-auto,而在Eclipse中用http://schemas.android.com/res/apk/包名
    xmlns:myAttr="http://schemas.android.com/apk/res-auto" 
	
    android:layout_width="match_parent"
    android:layout_height="match_parent">
	
	<com.xxx.MyView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
		
	1.自定义属性正式写法,属性类型多样(int,float,boolean,enum....)
        myAttr:name="abcde"
        myAttr:state="true"
		
	2.自定义属性简化写法,可忽略步骤一,但属性类型只有字符串
		simpleName="abcde"/>
		
</RelativeLayout>

```

## 三.在java中获取xml属性

```java

public class MyView extends View{
	
	public MyView(Context context, AttributeSet attrs) {
		super(context, attrs);
		
		// 1.自定义属性正式写法, 属性类型多样(int,float,boolean,enum....)
		TypedArray ta = context.obtainStyledAttributes(attrs, R.styleable.MyToggleBtn);		
		int count = ta.getIndexCount();
		for (int i = 0; i < count; i++) {			
			int itemId = ta.getIndex(i);
			switch (itemId) {
			case R.styleable.name:
				name = ta.getString(itemId);					
				break;
			case R.styleable.state:
				state = ta.getBoolean(itemId, false);				
				break;
			}			
		}
		
		// 2.自定义属性简化写法, 可忽略步骤一, 属性类型只有字符串
		String testAttrs = attrs.getAttributeValue(null, "simpleName");

	}
}

```