---
layout: post
title: EditText获取光标位置、插入和删除字符 
tags: Android
---

1、获取光标位置
int index = editText.getSelectionStart();

2、光标处插入字符
editText.getText().insert(index, "XXX");

3、光标处删除字符
editText.getText().delete(index-1, index);