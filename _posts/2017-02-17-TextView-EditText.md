---
layout: post
title: TextView-EditText笔记
tags: Android
---	

# 一.TextView

## 1.TextView属性XML
	<TextView
		.....	
		android:ellipsize="marquee"  文本超长时的省略(ellipsis)类型
		android:scrollbars = "vertical" 设置滚动条
		android:maxLines = "AN_INTEGER" 设置最大行数
		android:focusable="true"
		...../>

## 2.TextView显示内容
	TextView.setText(Spannable)
		Html.formHtml(..) 支持部分HTML标记转为Spannable对象
		new SpannableString(..)  支持各种文本样式/图片显示
		new SpannableBuilderString(..) 可变长的SpannableString
	
## 3.TextView移动方法
	TextView.setMoveMethod(MovementMethod)
		LinkMovementMethod	Html链接跳转
		ArrowKeyMovementMethod 光标移动选择		
		ScrollingMovementMethod	文本内容滚动(配合android:scrollbars使用)

# 二.EditText

## 


