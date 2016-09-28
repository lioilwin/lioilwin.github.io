---
layout: post
title: 对话框自定义(一)，解决输入法无法弹出，实现输入法自动弹出
tags: Android
---

```java

		// 创建alertDiglog
		alertDiglog = new AlertDialog.Builder(this).create();
		alertDiglog.show();
		
		// 设置输入法可以弹出
		alertDiglog.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_ALT_FOCUSABLE_IM);
		
		// 设置自定义布局
		View view = LayoutInflater.from(this).inflate(R.layout.approval_dialog_approve, null);
		alertDiglog.getWindow().setContentView(view);

		// 查找控件对话框控件
		final EditText editText = (EditText) alertDiglog.findViewById(R.id.comment);

		// 延时自动弹出输入法
		(new Handler()).postDelayed(new Runnable() {
			public void run() {
				InputMethodManager inputManager = (InputMethodManager) editText.getContext()
						.getSystemService(Context.INPUT_METHOD_SERVICE);
				inputManager.showSoftInput(editText, 0);
			}
		}, 100);

		String str = editText.getText().toString();
		
```