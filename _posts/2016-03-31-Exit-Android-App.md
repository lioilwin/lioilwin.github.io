---
layout: post
title: Activity所有都结束
tags: Android
---
1、创建基类，注册广播Receiver，发送广播，注销广播Receiver，退出应用

```java
public class BaseActivity extends Activity {  
    @Override  
	protected void onCreate(Bundle savedInstanceState) { 
        super.onCreate(savedInstanceState);  
       //注册广播
        IntentFilter filter = new IntentFilter();  
        filter.addAction("close");  
        registerReceiver(new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            //注销广播
            unregisterReceiver(this); 
            ((Activity) context).finish();
          }
       }, filter);  
    }  
  
    public void close() {
        //发送广播
       Intent intent = new Intent();
       intent.setAction("close");
       sendBroadcast(intent);
       finish();
       }

} 
```

2、所有Activity都继承BaseActivity

```java
Public class MyActivity extends BaseActivity {
    @Override  
    protected void onCreate(Bundle savedInstanceState) { 
        super.onCreate(savedInstanceState);  
        setContentView(R.layout.a1);
    } 
    private long exitTime = 0;    
    @Override  
    public boolean onKeyDown(int keyCode, KeyEvent event) {  
        if(keyCode == KeyEvent.KEYCODE_BACK)
	        //时间间隔大于2秒不退出
            if((System.currentTimeMillis()-exitTime) > 2000){  
                Toast.makeText(getApplicationContext(), "再按一次退出程序", Toast.LENGTH_SHORT).show();  
                exitTime = System.currentTimeMillis();  
            } else {
            //使用基类BaseActivity的方法,发送广播给所有Activity，退出应用
                close();  
            }  
            return true;  
        }  
        return super.onKeyDown(keyCode, event);  
    } 
```

