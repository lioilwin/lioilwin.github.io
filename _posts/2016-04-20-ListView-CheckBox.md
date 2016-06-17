---
layout: post
title: listveiw加checkbox
tags: Android
---

适配器在getview()中重复使用【被移除屏幕的item】

会造成被选中的checkbox重新出现，显示异常

故需要记录checkbox的状态

```xml
	
	<!--CheckBox抢占Item焦点，导致Item点击无效。
	方法一：CheckBox设置android:clickable="false" 
	方法二：Item根布局设置android:descendantFocusability="blocksDescendants"-->
	<LinearLayout
			·······
		android:descendantFocusability="blocksDescendants"
			·······>
			
		<CheckBox
			·······            
			android:clickable="false" 
			·······/>
			
	</LinearLayout>
		
```

```java

public class MyAdapter extends BaseAdapter {
	
	public MyAdapter(···,HashMap<Integer, Boolean> isSelected){
		······
	}
	
	@Override  
	public View getView(int position, View convertView, ViewGroup arg2) {              
		if (convertView == null) {  
			ViewHolder holder = new ViewHolder();  
			convertView = inflater.inflate(R.layout.listview, null);
			holder.cb = (CheckBox) convertView.findViewById(R.id.item_cb);  
			convertView.setTag(holder);  
		} else {  
			holder = (ViewHolder) convertView.getTag();  
		}
		
		// 显示checkbox的状态
		holder.cb.setChecked(isSelected.get(position));
		return view;  
	}  

}  
	
```

```java

public class MainActivity extends Activity {
	······
	// 记录checkbox状态
	private HashMap<Integer, Boolean> isSelected
	······
	// 初始化所有checkbox为未选择  
	isSelected = new HashMap<Integer, Boolean>();  
	for (int i = 0; i < list.size(); i++) {  
		isSelected.put(i, false);  
	}
	······	
	// 设置带checkbox的listview    
	listview.setAdapter(new MyAdapter(·····, isSelected));
	listview.setOnItemClickListener(new OnItemClickListener() { 
		@Override  
		public void onItemClick(AdapterView<?> arg0, View view,  
				int position, long arg3) {			
			// 获取checkbox控件
			ViewHolder holder = (ViewHolder) view.getTag();		
			// 点击item切换checkbox状态
			holder.cb.toggle();	
			// 记录checkbox状态
			isSelected.put(position, holder.cb.isChecked());						 
		}  

	});
	
    //全选  
	xxx.setOnClickListener(new OnClickListener(){  
		@Override  
		public void onClick(View arg0) {
			for(int i=0;i<list.size();i++){  
				isSelected.put(i,true);
			}
			// 通知适配器checkbox状态改变
			adapter.notifyDataSetChanged();			 
		}  
	});  
	  
	//反选  
	xxx.setOnClickListener(new OnClickListener(){  
		@Override  
		public void onClick(View v) {  
			for(int i=0;i<list.size();i++){  
				if(isSelected.get(i)==false){  
					isSelected.put(i, true);
				}  
				else{  
					isSelected.put(i, false);
				}  
			}  
			adapter.notifyDataSetChanged();
		}  
		  
	});  
          
	//取消已选  
	xxx.setOnClickListener(new OnClickListener(){  
		@Override  
		public void onClick(View v) {  
			for(int i=0;i<list.size();i++){  
				if(isSelected.get(i)==true){  
					isSelected.put(i, false);
				} 
			}  
			adapter.notifyDataSetChanged();
		}  
		  
	});
}

```