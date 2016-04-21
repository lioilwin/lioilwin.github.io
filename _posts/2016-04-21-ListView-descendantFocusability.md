---
layout: post
title: android:descendantFocusability
tags: Android
---

在ListView的Item中存在如ImageButton，Button，CheckBox子控件；<br/>
点击Item没有反应，无法获取焦点；<br/>
此时子控件将获取焦点，故点击item本身没有响应。<br/>

通常用android:descendantFocusability=”blocksDescendants”覆盖子类控件

定义viewGroup和其子控件两者之间的关系：

* beforeDescendants：viewgroup会优先其子类控件而获取到焦点
* afterDescendants：viewgroup只有当其子类控件不需要获取焦点时才获取焦点
* blocksDescendants：viewgroup会覆盖子类控件而直接获得焦点