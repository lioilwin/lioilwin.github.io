---
layout: post
title: drawableLeft等属性
tags: Android
---

### Android控件Button，TextView等可在其四周设置图片

1.XML静态设置属性drawableLeft，drawableTop，drawableRight，drawableBottom

```xml
<TextView
                ······
    android:drawableLeft="@drawable/icon"
    android:drawableTop="@drawable/icon"
    android:drawableRight="@drawable/icon"
    android:drawableBottom="@drawable/icon"/>
```

2.Java动态设置属性drawableLeft，drawableTop，drawableRight，drawableBottom

```java
//方法一：drawable宽高是按drawable.setBound()设置的宽高;
Drawable drawable= getResources().getDrawable(R.drawable.drawable);
drawable.setBounds(0, 0, drawable.getMinimumWidth(), drawable.getMinimumHeight());
textView.setCompoundDrawables(drawable,null,null,null);
//方法二：drawable宽高是按drawable固定宽高
Drawable drawable= getResources().getDrawable(R.drawable.drawable);
textView.setCompoundDrawablesWithIntrinsicBounds(drawable,null,null,null)
```
