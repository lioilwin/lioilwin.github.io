---
layout: post
title: listveiw加checkbox
tags: Android
---

适配器在getview()中重复使用【被移除屏幕的item】<br/>
会造成被选中的checkbox重新出现，显示异常<br/>
故需要记录checkbox的状态

```xml
   
    <CheckBox
				·······
        android:focusable="false"      
        android:focusableInTouchMode="false"      
        android:clickable="false" 
				·······
	/>
	
```
android:focusable="false"<br/>
android:focusable="false"<br/>
android:focusableInTouchMode="false"<br/>
使checkbox没有获取焦点，不能点击，失去作用；<br/>
让ListView的item覆盖checkbox的事件，来改变checkbox状态

```java

public class MyAdapter extends BaseAdapter {  
        
		// 记录每个item的checkbox状态
		public static HashMap<Integer, Boolean> isSelected;  
          
        // 初始化 设置所有checkbox都为未选择  
        public void init() {  
            isSelected = new HashMap<Integer, Boolean>();  
            for (int i = 0; i < list.size(); i++) {  
                isSelected.put(i, false);  
            }  
        }  
  
        @Override  
        public int getCount() {  
            return list.size();  
        }  
  
        @Override  
        public Object getItem(int arg0) {  
            return list.get(arg0);  
        }  
  
        @Override  
        public long getItemId(int arg0) {  
            return 0;  
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
    private MyAdapter adapter;
  
    @Override  
    public void onCreate(Bundle savedInstanceState) {  
        super.onCreate(savedInstanceState);  
        setContentView(R.layout.main);
          
        //全选  
        xxx.setOnClickListener(new OnClickListener(){  
            @Override  
            public void onClick(View arg0) {
                for(int i=0;i<list.size();i++){  
                    MyAdapter.isSelected.put(i,true);
                }
                adapter.notifyDataSetChanged(); // 注意通知适配器数据改变 
                 
            }  
        });  
          
        //反选  
        xxx.setOnClickListener(new OnClickListener(){  
            @Override  
            public void onClick(View v) {  
                for(int i=0;i<list.size();i++){  
                    if(MyAdapter.isSelected.get(i)==false){  
                        MyAdapter.isSelected.put(i, true);
                    }  
                    else{  
                        MyAdapter.isSelected.put(i, false);
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
                    if(MyAdapter.isSelected.get(i)==true){  
                        MyAdapter.isSelected.put(i, false);
                    } 
                }  
                adapter.notifyDataSetChanged();
            }  
              
        });  
    }  
  
    // 带有checkbox的listview  
    public void showCheckBoxListView() {
		xxx.setAdapter(new MyAdapter(·····));
		xxx.setOnItemClickListener(new OnItemClickListener() { 
			@Override  
			public void onItemClick(AdapterView<?> arg0, View view,  
					int position, long arg3) {
				
				// 获取checkbox控件
				ViewHolder holder = (ViewHolder) view.getTag();
				
				// 点击item切换checkbox状态
				holder.cb.toggle();		
				MyAdapter.isSelected.put(position, holder.cb.isChecked());
				 
			}  

		}); 
    }
}
```