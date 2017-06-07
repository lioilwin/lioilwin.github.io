---
layout: post
title: Android应用APP的启动过程
tags: Android
---

# 一.在桌面或抽屉显示应用图标
	桌面或抽屉就是一个普通APP应用，用于显示所有应用图标
	含有以下intent意图的Activity会显示在桌面或抽屉
	<intent-filter>
		<action android:name="android.intent.action.MAIN" />
		<category android:name="android.intent.category.LAUNCHER" />
	</intent-filter>

# 二.点击桌面或抽屉的应用图标

```java

Launcher.java{
	...
	public void onClick(View v)
		...			
		// 新建任务栈Stack,用于存放目标应用的Activity
		intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		startActivity(intent)
	}	
}

```
	
# 三.startActivity(...)过程
## 1.启功目标应用的任务栈Stack
## 2.通知源应用的主线程ActivityThread-调用Activity的onPause方法
## 3.调用Process_start创建新进程,加入目标应用主线程ActivityThread,执行main方法

```java

ActivityThread.java{

	// java程序入口
	public static void main(String[] args) {
		...
		Looper.prepareMainLooper();
		ActivityThread thread = new ActivityThread();
		thread.attach(false);
		// handle处理消息分发
		if (sMainThreadHandler == null) {
			sMainThreadHandler = thread.getHandler();
		}
		// End of event ActivityThreadMain.
		Trace.traceEnd(Trace.TRACE_TAG_ACTIVITY_MANAGER);
		Looper.loop();
		throw new RuntimeException("Main thread loop unexpectedly exited");
	}
}

```

## 4.在目标应用主线程中loadClass加载Activity类

```java

Instrumentation.java{ // 监控应用与系统的交互
	// 创建Activity实例对象
	newActivity(...)
	
	// 调用Activity生命周期的各种方法
	callActivityOnCreate(...)
	callActivityOnStart(...)
	callActivityOnReStart(...)
	callActivityOnResume(...)
	callActivityOnPause(...)
	callActivityOnStop(...)
	callActivityOnDestroy(...)
	callActivityOnSaveInstanceState(...)
	callActivityOnRestoreInstanceState(...)
	...
}
	
```
	
## 5.在Activity类setContentView加载布局

```java

Activity.java{
	attach(...) {
		...
		// 创建PhoneWindow extends Window类
        mWindow = new PhoneWindow(this, window);
		...
	}
	
	onCreate(...){
		setContentView(...) 
	}
	
	setContentView(...) {
        getWindow().setContentView(...);
	}
	
	getWindow(){
		return mWindow;
	}
}

PhoneWindow.java{	
	public void setContentView(int layoutResID) {       
		if (mContentParent == null) {
            installDecor();// 初始化父布局mContentParent
        } else if (!hasFeature(FEATURE_CONTENT_TRANSITIONS)) {
            mContentParent.removeAllViews();
        }
        if (hasFeature(FEATURE_CONTENT_TRANSITIONS)) {
            final Scene newScene = Scene.getSceneForLayout(mContentParent, layoutResID,
                    getContext());
            transitionTo(newScene);
        } else {
            mLayoutInflater.inflate(layoutResID, mContentParent);
        }
		...       
	}
	
    public void setContentView(View view) {
        setContentView(view, new ViewGroup.LayoutParams(MATCH_PARENT, MATCH_PARENT));
    }
	
	public void setContentView(View view, ViewGroup.LayoutParams params) {
        if (mContentParent == null) {
            installDecor(); // 初始化父布局mContentParent
        } else if (!hasFeature(FEATURE_CONTENT_TRANSITIONS)) {
            mContentParent.removeAllViews();
        }
		if (hasFeature(FEATURE_CONTENT_TRANSITIONS)) {
            view.setLayoutParams(params);
            final Scene newScene = new Scene(mContentParent, view);
            transitionTo(newScene);
        } else {
            mContentParent.addView(view, params);
        }
        ...
    }

	// 初始化父布局mContentParent
	private void installDecor() {
        mForceDecorInstall = false;
        if (mDecor == null) {
            mDecor = generateDecor(-1);
            mDecor.setDescendantFocusability(ViewGroup.FOCUS_AFTER_DESCENDANTS);
            mDecor.setIsRootNamespace(true);
            if (!mInvalidatePanelMenuPosted && mInvalidatePanelMenuFeatures != 0) {
                mDecor.postOnAnimation(mInvalidatePanelMenuRunnable);
            }
        } else {
            mDecor.setWindow(this);
        }
        if (mContentParent == null) {
            mContentParent = generateLayout(mDecor);
			...
		}		
	}
	
	protected ViewGroup generateLayout(DecorView decor) {
		...
		ViewGroup contentParent = (ViewGroup)findViewById(ID_ANDROID_CONTENT);
		...
		return contentParent;
	}
}

```
		
GitHub博客：http://lioil.win/2017/06/07/Android_Launcher.html   
Coding博客：http://c.lioil.win/2017/06/07/Android_Launcher.html