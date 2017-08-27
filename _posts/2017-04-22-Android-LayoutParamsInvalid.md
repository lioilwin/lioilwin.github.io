---
layout: post
title: Android-xml根布局-参数失效原因
tags: Android
---

# 1.item.xml根布局参数没有添加到父布局
	
	1).在item.xml中
	<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
		android:layout_width="100dp"
		android:layout_height="100dp"
		android:layout_margin="32dp"
		android:background="#00f"
		android:orientation="vertical">
		<TextView
			android:layout_width="wrap_content"
			android:layout_height="wrap_content"
			android:layout_weight="1"
			android:text="Text"
			android:textColor="#fff" />
	</LinearLayout>
		
	2).在Adapter中
	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		convertView = View.inflate(context, R.layout.item, null);
	// convertView = LayoutInflater.from(context).inflate(R.layout.item, null, false);
	// convertView = LayoutInflater.from(context).inflate(R.layout.item, parent, false);
		return convertView;
	}
	
	3).在Dialog中
	Dialog d= new Dialog(this);	
	d.setContentView(View.inflate(context, R.layout.item, null));
	// d.setContentView(R.layout.item);
	d.show();
	
	4).在Activity中
	 @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);        
		setContentView(View.inflate(context, R.layout.item, null));
		// setContentView(R.layout.item);
    }
			
	1.现象:在Adapter, Dialog, Activity中的item.xml根布局参数全部失效!  
	
	2.原因:
	通过xxx.inflate(R.layout.item, null, false)返回的view没保存item.xml根布局参数,
	item.xml根布局参数是与父布局相关,如果没有父布局就不会存item.xml根布局参数！
	
	3.解决办法:
	1).在Adapter中推荐使用LayoutInflater.from(context).inflate(R.layout.item, parent, false);
	把item.xml根布局参数存到parent,false表明不把xml加到parent,只保存xml布局参数！
	2).在Adapter, Dialog中无法获取item.xml的父布局,
	推荐使用setContentView(R.layout.activity_main),
	在setContentView内部会用xxx.inflate(R.layout.item, parent,..)保存item.xml根布局参数！
	
# 2.在Adapter中的item.xml根布局layout_margin失效
	
	原因: 
	在Adapter中的item.xml的父布局是ListView，而ListView继承于AbsListView的布局参数没有layout_margin	
	LayoutParams继承体系:
		ViewGroup.LayoutParams
				AbsListView.LayoutParams 没继承ViewGroup.MarginLayoutParams,所以layout_margin不可用
				ViewPager.LayoutParams
				AbsoluteLayout.LayoutParams		
				WindowManager.LayoutParams
				Gallery.LayoutParams
				ViewGroup.MarginLayoutParams 定义layout_margin等参数
						ActionBar.LayoutParams
						GridLayout.LayoutParams
						FrameLayout.LayoutParams
						LinearLayout.LayoutParams		
						RelativeLayout.LayoutParams						
	总结:
		特别注意以下几个布局容器
		AbsListView.LayoutParams
		ViewPager.LayoutParams
		AbsoluteLayout.LayoutParams	
		WindowManager.LayoutParams
		Gallery.LayoutParams
		只继承了ViewGroup.LayoutParams，以layout_xxx开头参数只有layout_width,layout_height被定义了，
		其它layout_xxx参数分别定义在FrameLayout，LinearLayout，RelativeLayout。

简书: http://www.jianshu.com/p/b2b845f3a836   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/70462232   
GitHub博客：http://lioil.win/2017/04/22/Android-LayoutParamsInvalid.html   
Coding博客：http://c.lioil.win/2017/04/22/Android-LayoutParamsInvalid.html