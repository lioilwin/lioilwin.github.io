---
layout: post
title: 认识onActivityResult方法
tags: Android
---
今天，使用startActivityForResult，发现无论有无调用setResult方法，都会执行onActivityResult方法
所以需要使用resultCode(默认值为0，不要用0)判断是否调用了setResult方法。

```java
//ActivityA:
·······
Intent intent = new Intent(ActivityA.this, ActivityB.class);
startActivityForResult(intent, requestCode);

protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		//ActivityB结束, 有调用setResult方法(resultCode不为0)，才会会执行
		if (resultCode == 1) {
			Toast.makeText(this, "有resultCode", Toast.LENGTH_SHORT).show();
		}
		
		//ActivityB结束, 无论有无调用setResult方法，都会执行
		Toast.makeText(this, "没有resultCode", Toast.LENGTH_SHORT).show();
}
·······
```

```java
//ActivityB:
······
setResult(1, new Intent());
finish();
······
```
