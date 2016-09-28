---
layout: post
title: 广播BroadcastReceive优先级
tags: 
---

1、priority最大值不是官方文档的1000，而是Integer.MAX_VALUE(2147483647)

2、动态注册要比静态注册的优先级高