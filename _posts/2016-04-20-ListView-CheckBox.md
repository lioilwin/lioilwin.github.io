---
layout: post
title: listveiw加checkbox
tags: Android
---

适配器getview()中重复使用被移除屏幕的item<br/>
会造成checkbox选择状态不正常的现象<br/>
需要记录checkbox的状态

```xml
    <TextView   
        android:id="@+id/item_tv"  
        android:layout_width="267dip"  
        android:layout_height="40dip"  
        android:textSize="10pt"  
        android:gravity="center_vertical"  
        android:layout_marginLeft="10dip"  
        />  
    <CheckBox   
        android:id="@+id/item_cb"  
        android:layout_width="wrap_content"  
        android:layout_height="wrap_content"  
        android:focusable="false"      
        android:focusableInTouchMode="false"      
        android:clickable="false"    
        android:layout_toRightOf="@id/item_tv"     
        android:layout_alignParentTop="true"  
        android:layout_marginRight="5dip"/>  
```
android:focusable="false"<br/>
android:focusable="false"<br/>
android:focusableInTouchMode="false"<br/>
使checkbox没有获取焦点，不能点击，失去作用；<br/>
让ListView的item覆盖checkbox的事件，来改变checkbox状态


```java
public class ViewHolder {  
    public TextView tv;
    public CheckBox cb;
}  
```

```java
public class MyAdapter extends BaseAdapter {  
        public static HashMap<Integer, Boolean> isSelected;  
        private Context context = null;  
        private LayoutInflater inflater = null;  
        private List<HashMap<String, Object>> list = null;  
        private String keyString[] = null;  
        private String itemString = null; // 记录每个item中textview的值  
        private int idValue[] = null;// id值  
  
        public MyAdapter(Context context, List<HashMap<String, Object>> list,  
                int resource, String[] from, int[] to) {  
            this.context = context;  
            this.list = list;  
            keyString = new String[from.length];  
            idValue = new int[to.length];  
            System.arraycopy(from, 0, keyString, 0, from.length);  
            System.arraycopy(to, 0, idValue, 0, to.length);  
            inflater = LayoutInflater.from(context);  
            init();  
        }  
  
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
                convertView = inflater.inflate(R.layout.listviewitem, null);  
                holder.tv = (TextView) convertView.findViewById(R.id.item_tv);  
                holder.cb = (CheckBox) convertView.findViewById(R.id.item_cb);  
                convertView.setTag(holder);  
            } else {  
                holder = (ViewHolder) convertView.getTag();  
            }  
            HashMap<String, Object> map = list.get(position);  
            if (map != null) {  
                itemString = (String) map.get(keyString[0]);  
                holder.tv.setText(itemString);  
            }  
            holder.cb.setChecked(isSelected.get(position));  
            return view;  
        }  
  
    }  
```

```java
public class MainActivity extends Activity {  
    private TextView tv;  
    private ListView lv;  
    private Button btn_selectAll;  
    private Button btn_inverseSelect;  
    private Button btn_calcel;  
    private String name[] = { "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9","G10", "G11", "G12", "G13", "G14"};
    private ArrayList<String> listStr;
    private List<HashMap<String, Object>> list;
    private MyAdapter adapter;
  
    @Override  
    public void onCreate(Bundle savedInstanceState) {  
        super.onCreate(savedInstanceState);  
        setContentView(R.layout.main);  
        tv = (TextView) this.findViewById(R.id.tv);  
        lv = (ListView) this.findViewById(R.id.lv);  
        btn_selectAll = (Button) this.findViewById(R.id.selectall);  
        btn_inverseSelect = (Button) this.findViewById(R.id.inverseselect);  
        btn_calcel = (Button) this.findViewById(R.id.cancel);  
        showCheckBoxListView();  
          
        //全选  
        btn_selectAll.setOnClickListener(new OnClickListener(){  
            @Override  
            public void onClick(View arg0) {  
                listStr = new ArrayList<String>();  
                for(int i=0;i<list.size();i++){  
                    MyAdapter.isSelected.put(i,true);  
                    listStr.add(name[i]);  
                }  
                adapter.notifyDataSetChanged();//注意这一句必须加上，否则checkbox无法正常更新状态  
                tv.setText("已选中"+listStr.size()+"项");  
            }  
        });  
          
        //反选  
        btn_inverseSelect.setOnClickListener(new OnClickListener(){  
            @Override  
            public void onClick(View v) {  
                for(int i=0;i<list.size();i++){  
                    if(MyAdapter.isSelected.get(i)==false){  
                        MyAdapter.isSelected.put(i, true);  
                        listStr.add(name[i]);  
                    }  
                    else{  
                        MyAdapter.isSelected.put(i, false);  
                        listStr.remove(name[i]);  
                    }  
                }  
                adapter.notifyDataSetChanged();  
                tv.setText("已选中"+listStr.size()+"项");  
            }  
              
        });  
          
        //取消已选  
        btn_calcel.setOnClickListener(new OnClickListener(){  
            @Override  
            public void onClick(View v) {  
                for(int i=0;i<list.size();i++){  
                    if(MyAdapter.isSelected.get(i)==true){  
                        MyAdapter.isSelected.put(i, false);  
                        listStr.remove(name[i]);  
                    }  
                }  
                adapter.notifyDataSetChanged();  
                tv.setText("已选中"+listStr.size()+"项");  
            }  
              
        });  
    }  
  
    // 显示带有checkbox的listview  
    public void showCheckBoxListView() {  
        list = new ArrayList<HashMap<String, Object>>();  
        for (int i = 0; i < name.length; i++) {  
            HashMap<String, Object> map = new HashMap<String, Object>();  
            map.put("item_tv", name[i]);  
            map.put("item_cb", false);  
            list.add(map);
            }
  
		adapter = new MyAdapter(this, list, R.layout.listviewitem, new String[]{"item_tv", "item_cb" }, new int[]{R.id.item_tv, R.id.item_cb });  
		lv.setAdapter(adapter);  
		listStr = new ArrayList<String>();  
		lv.setOnItemClickListener(new OnItemClickListener() {  

			@Override  
			public void onItemClick(AdapterView<?> arg0, View view,  
					int position, long arg3) {  
				ViewHolder holder = (ViewHolder) view.getTag();  
				holder.cb.toggle();// 在每次获取点击的item时改变checkbox的状态  
				MyAdapter.isSelected.put(position, holder.cb.isChecked()); // 同时修改map的值保存状态  
				if (holder.cb.isChecked() == true) {  
					listStr.add(name[position]);  
				} else {  
					listStr.remove(name[position]);  
				}  
				tv.setText("已选中"+listStr.size()+"项");  
			}  

		}); 
    }
}
```