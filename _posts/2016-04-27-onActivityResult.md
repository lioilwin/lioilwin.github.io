---
layout: post
title: onActivityResult方法
tags: Android
---
今天，使用startActivityForResult，发现无论有无调用setResult方法，都会执行onActivityResult方法
所以需要使用resultCode(默认值失败值为0，不要用0)判断是否调用了setResult方法。

```java
//ActivityA:
·······
Intent intent = new Intent(ActivityA.this, ActivityB.class);
startActivityForResult(intent, requestCode);

protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		//ActivityB结束, 无论有无调用setResult方法，都会执行
		Toast.makeText(this, "setResult", Toast.LENGTH_SHORT).show();
}
·······
```

```java
//ActivityB:
······
setResult(RESULT_OK, new Intent());
finish();
······
```
