---
layout: post
title: Android-Listveiw的checkbox,Button焦点问题
tags: Android
---

```xml
	
CheckBox抢占Item焦点，导致Item点击无效!
方法一：CheckBox设置android:clickable="false" 
方法二：在Item根布局或ListView布局设置android:descendantFocusability="blocksDescendants"

在ListView的Item中的Button,CheckBox等子控件会抢占焦点,使得点击item本身没有响应！
常用android:descendantFocusability=”blocksDescendants”覆盖子类控件焦点
	descendantFocusability属性定义viewGroup和其子控件之间关系：
	beforeDescendants：viewgroup会优先其子类控件而获取到焦点
	afterDescendants：viewgroup只有当其子类控件不需要获取焦点时才获取焦点
	blocksDescendants：viewgroup会覆盖子类控件而直接获得焦点

<LinearLayout
	android:descendantFocusability="blocksDescendants">
		
	<CheckBox
		android:clickable="false"/>	
</LinearLayout>

<ListView
	android:descendantFocusability="blocksDescendants"/>
		
```

适配器在getview()中重复使用[被移除屏幕的item,即不可见的项]    
会造成被选中的checkbox重新出现，显示异常，故需要记录checkbox的状态！

```java

public class MyAdapter extends BaseAdapter implements OnItemClickListener {	
	private HashMap<Integer, Boolean> isSelected; // 记录checkbox状态

	public MyAdapter() {		
		// 初始化所有checkbox为未选择  
		isSelected = new HashMap<Integer, Boolean>();  
		for (int i = 0; i < list.size(); i++)
			isSelected.put(i, false);
	}
	
	@Override  
	public View getView(int position, View convertView, ViewGroup arg2) {              
		ViewHolder holder;
		...
		holder.cb.setChecked(isSelected.get(position)); // 更新checkbox状态
		return view;
	}  

	@Override  
	public void onItemClick(AdapterView<?> arg0, View view,  
			int position, long arg3) {
		// 切换checkbox状态
		isSelected.put(position, !isSelected.get(position));
		notifyDataSetChanged();
	}  

}  

public class MainActivity extends Activity {
	...
	MyAdapter adp = new MyAdapter();
	listview.setAdapter(adp);
	listview.setOnItemClickListener(adp);
	...
}

```

简书：http://www.jianshu.com/p/b2aa0485f7b8   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/53710915   
GitHub博客: http://lioil.win/2016/04/20/ListView-CheckBox.html   
Coding博客: http://c.lioil.win/2016/04/20/ListView-CheckBox.html