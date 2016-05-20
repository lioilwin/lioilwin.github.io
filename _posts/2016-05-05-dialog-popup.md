---
layout: post
title: 自定义对话框滑出动画，消除对话框左右间隙
tags: Android
---

### 第一步：设计要弹出窗口xml布局

```xml

<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content" >
    <LinearLayout
        android:id="@+id/pop_layout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:background="#fff"
        android:orientation="vertical" >
        <View
            android:layout_width="match_parent"
            android:layout_height="1px"
            android:background="#999" />
        <TextView
            android:id="@+id/take_photo"
            android:layout_width="match_parent"
            android:layout_height="50dp"
            android:gravity="center"
            android:text="拍照"
            android:textColor="#000"
            android:textStyle="bold" />
        <View
            android:layout_width="match_parent"
            android:layout_height="1px"
            android:background="#999" />
        <TextView
            android:id="@+id/pick_photo"
            android:layout_width="match_parent"
            android:layout_height="50dp"
            android:gravity="center"
            android:text="从手机相册选择"
            android:textColor="#000"
            android:textStyle="bold" />
        <View
            android:layout_width="match_parent"
            android:layout_height="1px"
            android:background="#999" />
        <TextView
            android:id="@+id/cancel"
            android:layout_width="match_parent"
            android:layout_height="50dp"
            android:gravity="center"
            android:text="取消"
            android:textColor="#000"
            android:textStyle="bold" />
    </LinearLayout>
</RelativeLayout>

```

### 第二步：创建SelectPicPopupWindow继承Activity类

```java

public class SelectPicPopupWindow extends Activity implements OnClickListener {

	private TextView takePhoto;
	private TextView pickPhoto;
	private TextView cancel;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.approval_dialog);
		takePhoto = (TextView) this.findViewById(R.id.take_photo);
		pickPhoto = (TextView) this.findViewById(R.id.pick_photo);
		cancel = (TextView) this.findViewById(R.id.cancel);
		cancel.setOnClickListener(this);
		pickPhoto.setOnClickListener(this);
		takePhoto.setOnClickListener(this);
	}

	// 点击屏幕，销毁本对话框
	@Override
	public boolean onTouchEvent(MotionEvent event) {
		finish();
		return true;
	}

	public void onClick(View v) {
		switch (v.getId()) {

		// 拍照
		case R.id.take_photo:			
			Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
			startActivityForResult(intent, 1);
			break;

		// 选择照片
		case R.id.pick_photo:			
			Intent intent1 = new Intent();
			intent1.setType("image/*");
			intent1.setAction(Intent.ACTION_GET_CONTENT);
			startActivityForResult(intent1, 2);
			break;

		case R.id.cancel:			
			finish();
			break;
		default:
			break;
		}		
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (resultCode == RESULT_OK) {		
		// 选择或拍照后处理
		if (data.getExtras() != null)
			data.putExtras(data.getExtras());
		if (data.getData() != null)
			data.setData(data.getData());		
		setResult(1, data);
		}
		finish();

	}
}


```

### 第三步：

#### 在AndroidManifest.xml中配置SelectPicPopupWindow

```xml

<activity
      android:name=".SelectPicPopupWindow"
      android:theme="@style/MyDialogStyleBottom"/>  

```

#### 在values/styles.xml中配置android:theme属性样式

```xml

	<!-- 附件对话框动画 -->
    <style name="AnimBottom">
        <item name="android:windowEnterAnimation">@anim/push_bottom_in</item>
        <item name="android:windowExitAnimation">@anim/push_bottom_out</item>
    </style>
    
	<!-- 
	附件对话框 <style name="MyDialogStyleBottom" parent="android:Theme.Dialog">
	网上很多都用系统自带parent="android:Theme.Dialog"
	我发现布局控件无法放置在顶部(可以放置其他位置)而且左右两边有间隙(xml布局左右没有间隙)
	-->
    <style name="MyDialogStyleBottom">
                
        <!--出入动画-->
        <item name="android:windowAnimationStyle">@style/AnimBottom</item> 
        <!--无标题-->
        <item name="android:windowNoTitle">true</item>        
        <!--背景透明-->
        <item name="android:windowBackground">@android:color/transparent</item>     
        <item name="android:windowIsTranslucent">true</item>        
        <!--背景变暗-->
        <item name="android:backgroundDimEnabled">true</item>      
        
    </style>

```

#### 在anim/push_bottom_in中上下滑入式动画
```java

<?xml version="1.0" encoding="utf-8"?>  
<!-- 上下滑入式 -->  
<set xmlns:android="http://schemas.android.com/apk/res/android" >  
  
    <translate  
        android:duration="200"  
        android:fromYDelta="100%p"  
        android:toYDelta="0"          
     />        
</set>  

```

#### 在anim/push_bottom_out中上下滑出式动画
```java

<?xml version="1.0" encoding="utf-8"?>  
<!-- 上下滑出式 -->  
<set xmlns:android="http://schemas.android.com/apk/res/android" >  
  
      
    <translate  
        android:duration="200"  
        android:fromYDelta="0"  
        android:toYDelta="50%p" />  
</set>  

```

### 最后一步：启动SelectPicPopupWindow类

```java
              ······
    startActivityForResult(new Intent(this, SelectPicPopupWindow.class), 1);
              ······

```