---
layout: post
title: descendantFocusability属性
tags: Android
---

* 在ListView的Item中存在如ImageButton，Button，CheckBox子控件
* 子控件获取焦点，点击item本身没有响应
* 常用android:descendantFocusability=”blocksDescendants”覆盖子类控件
* descendantFocusability定义viewGroup和其子控件之间关系：
	* beforeDescendants：viewgroup会优先其子类控件而获取到焦点
	* afterDescendants：viewgroup只有当其子类控件不需要获取焦点时才获取焦点
	* blocksDescendants：viewgroup会覆盖子类控件而直接获得焦点