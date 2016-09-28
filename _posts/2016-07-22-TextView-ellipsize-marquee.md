---
layout: post
title: TextView的ellipsize失效
tags: Android
---

生效条件：
1、android:ellipsize="marquee"
2、TextView文本宽超TextView宽
3、android:focusable="true"(android:focusableInTouchMode="true")

滚动重复次数:android:marqueeRepeatLimit="marquee_forever"