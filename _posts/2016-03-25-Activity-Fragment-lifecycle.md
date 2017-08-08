---
layout: post
title: Android-Activity和Fragment生命周期
tags: Android
---
![Activity和Fragment生命周期对比](http://upload-images.jianshu.io/upload_images/1848363-2ab0da2020e82b29.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 一.Activity生命周期
1. onCreate():    Activity创建界面时，调用此方法.
1. onStart():     Activity界面可见时，调用此方法.
1. onResume():    界面获得焦点可以和用户可交互时，调用此方法.
1. onPause():     界面可见(变为半透明或弹出对话框)但失去焦点不可以和用户交互，调用此方法.
1. onStop():      界面完全不可见时 ，调用此方法.
1. onDestroy():   Activity被销毁时，调用此方法.
1. onRestart():   界面由不可见变为可见时，调用此方法和onStart()方法.
![Activity生命周期](http://upload-images.jianshu.io/upload_images/1848363-4cd621455e65aa22.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) 

## 二.Fragment生命周期
1. onAttach():            Fragment和Activity关联时，调用此方法.
1. onCreate():            创建Fragment时，调用此方法.
1. onCreateView()：       加载Fragment的ui布局时，调用此方法.
1. onActivityCreated():   Activity的onCreate方法完成时，调用此方法.
1. onStart():             Fragment和Activity一起启动且可见时，调用此方法.
1. onResume():            Fragment获取焦点时，调用此方法.
1. onPause():             Fragment失去焦点但可见，调用此方法.
1. onStop():              Fragment完全不可见时，调用此方法.
1. onDestroyView():       Fragment布局被移除时，调用此方法.
1. onDestroy():           Fragment被销毁时，调用此方法.
1. onDetach():            Fragment和Activity解除关联，调用此方法.
![Fragment生命周期](http://upload-images.jianshu.io/upload_images/1848363-287867f1d1a9f550.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

简书：http://www.jianshu.com/p/ec166d25501f   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/50982886   
GitHub博客: http://lioil.win/2016/03/25/Activity-Fragment-lifecycle.html   
Coding博客: http://c.lioil.win/2016/03/25/Activity-Fragment-lifecycle.html