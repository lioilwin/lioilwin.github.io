---
layout: post
title: TextView滚动
tags: Android
---

xml的TextView：
android:maxLines = "5"
android:scrollbars = "vertical"

Java代码：
yourTextView.setMovementMethod(new ScrollingMovementMethod())

