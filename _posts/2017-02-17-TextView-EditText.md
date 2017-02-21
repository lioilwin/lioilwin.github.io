---
layout: post
title: TextView-EditText笔记
tags: Android
---	

# 一.TextView

## 1.属性XML
	<TextView
		...	
		android:ellipsize="marquee"  文本超长时的省略(ellipsis)类型
		android:scrollbars = "vertical" 设置滚动条
		android:maxLines = "AN_INTEGER" 设置最大行数
		android:focusable="true"
		.../>

## 2.显示内容
	TextView.setText(Spannable)
		Html.formHtml(..) 支持部分HTML标记转为Spannable对象
		new SpannableString(..)  支持各种文本样式/图片显示
		new SpannableBuilderString(..) 可变长的SpannableString
	
## 3.移动方法
	TextView.setMoveMethod(MovementMethod)
		LinkMovementMethod	Html链接跳转
		ArrowKeyMovementMethod 光标移动选择		
		ScrollingMovementMethod	文本内容滚动(配合android:scrollbars使用)

# 二.EditText 继承自TextView

## 1.输入表情
	SpannableString ss = new SpannableString("表情");
    ss.setSpan(new ImageSpan(this,BitmapFactory.decodeResource(getResources(),R.mipmap.ic_launcher)),
                    0,2, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
	editText.append(ss);

## 2.输入类型
	<EditText
        ...
        android:inputType="textMultiLine|number"
		.../>
		
	// 输入错误提示以及图标
	editText.setError("错误提示",getResources().getDrawable(R.mipmap.ic_launcher));
	
## 3.自动提示输入	
	<AutoCompleteTextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:id="@+id/autoCompleteTextView"/>

    <MultiAutoCompleteTextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:id="@+id/multiAutoCompleteTextView" />
	
	// 单个输入自动提示
	AutoCompleteTextView auto = (AutoCompleteTextView) findViewById(R.id.autoCompleteTextView);
	auto.setAdapter(new ArrayAdapter<String>(this,android.R.layout.simple_list_item_1,
                new String[]{"Belgium", "France", "Italy", "Germany", "Spain"}));
    
	// 多个输入自动提示
	MultiAutoCompleteTextView mulAuto = (MultiAutoCompleteTextView) findViewById(R.id.multiAutoCompleteTextView);
	mulAuto.setAdapter(new ArrayAdapter<String>(this,android.R.layout.simple_list_item_1,
			new String[]{"Belgium", "France", "Italy", "Germany", "Spain"}));
	mulAuto.setTokenizer(new MultiAutoCompleteTextView.CommaTokenizer()); // 逗号分隔多个输入