---
layout: post
title: Android-服务跨进程通信(Binder/Messenger/AIDL)
tags: Android
---
官方文档中国版: https://developer.android.google.cn/guide/components/bound-services.html
谷歌2016年底为中国开发者提供中国版,方便访问！

# 绑定服务简介	
	Android服务与客户端相互调用(传递消息),必须创建绑定服务bindService()提供IBinder接口()！
	服务与客户端交互方式(传递消息)有三种：
	
	1.使用Binder类(客户端与服务在同一进程)
	如果服务与客户端在同一进程中运行,通过扩展Binder类并从onBind()返回它的一个实例来创建接口。
	客户端收到Binder后，可利用它直接访问Binder实现中乃至Service中可用的公共方法！

	2.使用Messenger(客户端与服务在不同进程,服务只能是单线程)
	不同进程工作,可用Messenger为服务创建接口。Message对象内含Handler。
	随后可与客户端分享一个IBinder,从而让客户端能利用 Message 对象向服务发送命令。
	此外，客户端还可定义自有 Messenger，以便服务回传消息!
	这是进程间通信(IPC)的最简单方法(AIDL的简化)，因为Messenger会在服务单一线程创建所有请求队列。

	3.使用AIDL(客户端与服务在不同进程,服务可以是多线程)
	AIDL(Android 接口定义语言)执行所有将对象分解成原语的工作，
	操作系统可以识别这些原语并将它们编组到各进程中以执行IPC。
	之前的Messenger实际是以AIDL作为其底层结构。如果服务同时处理多个请求(多线程),应该用AIDL。
	
	注：大多数应用“都不会”使用AIDL来创建绑定服务，因为它可能要求具备多线程处理能力，
		并可能导致实现的复杂性增加。因此，AIDL并不适合大多数应用！
		
	4.此外,还可用广播这个万金油组件进行传递消息,无论是不同进程,还是不同APP应用,都可用广播传递消息！
	但是需要注意的是, 广播有可能泄露数据、恶意程序发送广播等安全性问题，
	所以应该限制广播只在本应用内传播:
		1.设置permission或Intent.setPackage,不把广播发送到应用外！
		2.使用LocalBroadcastManager或设置android:exported="false"不接收应用外广播！

# 一.使用Binder类(客户端与服务在同一进程)

```java

// 1.本地服务————————————————————————————————————
public class LocalService extends Service {  
    private final IBinder mLocalBinder = new LocalBinder();
	
    public class LocalBinder extends Binder {
        LocalService getService() {           
            return LocalService.this;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mLocalBinder;
    }

    public int getRandomNumber() {
      return new Random().nextInt(100);
    }
}

// 2.客户端————————————————————————————————————
public class BindingActivity extends Activity {    
    boolean mBound = false;
	
	 @Override
    protected void onStart() {
        super.onStart();
		// 绑定本地服务(同一进程)
        bindService(new Intent(this, LocalService.class), 
					mConnection, 
					Context.BIND_AUTO_CREATE);
    }
	
	private ServiceConnection mConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName className, IBinder service) {
			mBound = true;
			// 获取本地服务的实例,并调用方法,获取随机数
            LocalService localService = ((LocalBinder) service).getService();            
			int num = localService.getRandomNumber();				
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            mBound = false;
        }
    };

    @Override
    protected void onStop() {
        super.onStop();       
        if (mBound) {
			// 解绑本地服务
            unbindService(mConnection);
            mBound = false;
        }
    }   
}

```

# 二.使用Messenger(客户端与服务在不同进程,服务只能是单线程)

```java

// 1.注册远程服务————————————————————————————————————
	<service  
		android:name=".MessengerService"  
		android:process=":remote"> (process指定服务在另一个进程,名叫remote)
	</service>

// 2.远程服务————————————————————————————————————
public class MessengerService extends Service {

    final Messenger mServiceMessenger = new Messenger(new Handler(){
        @Override
        public void handleMessage(Message msg) {
			// 接收客户端消息
            switch (msg.what) {
                case 1:					
                    Toast.makeText(getApplicationContext(), "service hello!", Toast.LENGTH_SHORT).show();					
					Thread.sleep(3000);
					// 向客户端发消息
					Messenger messenger = msg.replyTo;
					messenger.send(Message.obtain(null, 1, 0, 0))
                    break;               
            }
        }
    });

    @Override
    public IBinder onBind(Intent intent) {        
        return mServiceMessenger.getBinder();
    }
}

// 3.客户端————————————————————————————————————
public class ActivityMessenger extends Activity { 
    boolean mBound = false;
	
	private Messenger mActivityMessenger = new Messenger(new Handler(){
        @Override
        public void handleMessage(Message msg){
			// 接收远程服务消息
            switch (msg.what){
                case 1:
                    Toast.makeText(ActivityMessenger.this, "activity hello!", Toast.LENGTH_SHORT).show();
                    break;				
            }
        }
    });

    private ServiceConnection mConnection = new ServiceConnection(){
        public void onServiceConnected(ComponentName className, IBinder service) {       
            mBound = true;
			// 向远程服务发消息				
			Messenger messenger = new Messenger(service);
			Message msg = Message.obtain(null, 1, 0, 0); 
			msg.replyTo = mActivityMessenger
            messenger.send(msg);			
        }

        public void onServiceDisconnected(ComponentName className) {
            mBound = false;
        }
    };

    @Override
    protected void onStart() {
        super.onStart();  
		// 绑定远程服务(不同进程)
        bindService(new Intent(this, MessengerService.class),
				mConnection,
				Context.BIND_AUTO_CREATE);
    }

    @Override
    protected void onStop() {
        super.onStop();        
		// 解绑远程服务
        if (mBound) {
            unbindService(mConnection);           
        }
    }
}

```
	
# 三.使用AIDL(客户端与服务在不同进程,服务可以是多线程)

## 1.创建AIDL接口
	默认情况下AIDL支持下列数据类型
	int、long、char、boolean、String、CharSequence、List、Map
	List中元素都必须是以上类型、其他AIDL接口、可打包类型(即实现Parcelable接口).
	Map中元素都必须是以上类型、其他AIDL接口、可打包类型(即实现了Parcelable接口)
	不支持通用Map(如Map<String,Integer>形式的Map）

	// IRemoteService.aidl文件
	interface IRemoteService {
		// 注册回调
		void registerCallback(IRemoteServiceCallBack cb);     
		void unregisterCallback(IRemoteServiceCallBack cb);  
	}
	
	// IRemoteServiceCallBack.aidl文件
	interface IRemoteServiceCallBack{
		void valueChanged(int value);
	}
	
## 2.在远程服务中实现AIDL接口

```java

public class RemoteService extends Service {
	// 一个服务会绑定多个客户端, 需要集合来存放客户端的回调接口
	private RemoteCallbackList<IRemoteServiceCallBack> mCallbackList 
				= new RemoteCallbackList<IRemoteServiceCallBack>();
				
	// 实现IRemoteService.AIDL接口
    private IRemoteService.Stub mBinder = new IRemoteService.Stub() {
        @Override
        public void registerCallback(IRemoteServiceCallBack cb)throws RemoteException {
            if (cb != null) {
                mCallbackList.register(cb);
            }
        }
		
        @Override
        public void unRegisterCallback(IRemoteServiceCallBack cb)throws RemoteException {
            if (cb != null) {
                mCallbackList.unregister(cb);
            }
        }
    };
	
	// 通知所有客户端的回调接口
	public void sendMsg(){		
		int N = mCallbackList.beginBroadcast();
		for(int i=0;i<N;i++){
			try {
				// 回调通知客户端
				mCallbackList.getBroadcastItem(i).valueChanged(mValue);
			} catch (RemoteException e) {
				e.printStackTrace();
			}
		}		
		mCallbackList.finishBroadcast(); // 通知完成
	}

		
    @Override
    public IBinder onBind(Intent intent) {       
        return mBinder;
    }
}

```
## 3.客户端

```java

public class BindActivity extends Activity {
    IRemoteService mService = null;
    private boolean mIsBound = false;	
	
	// 实现IRemoteServiceCallback.AIDL接口
	private IRemoteServiceCallback mCallback = new IRemoteServiceCallback.Stub() {     
		/**
		* 来自远程服务的回调通知,
		* 此方法不在UI线程中, 更新UI需小心！
		*/
        public void valueChanged(int value) {
			...
        }
    };
	
	private ServiceConnection mConnection = new ServiceConnection() {
        public void onServiceConnected(ComponentName className,IBinder service){
			mIsBound = true;
            mService = IRemoteService.Stub.asInterface(service);			
			// 注册回调接口
            mService.registerCallback(mCallback);		
        }

        public void onServiceDisconnected(ComponentName className) {           
			mIsBound = false;
            mService = null;
        }
    };
	
    @Override
    protected void onStart() {
        super.onStart();
		// 绑定远程服务
		bindService(new Intent(BindActivity.this, RemoteService.class),
					mConnection,
					Context.BIND_AUTO_CREATE);	
    }

	@Override
    protected void onStop() {
        super.onStop();  
		if (mIsBound){
			// 取消回调接口
			mService.unregisterCallback(mCallback);
			// 解绑远程服务
			unbindService(mConnection);
        }
	}
}

```

# 总结：
	综上比较, AIDL实现客户端与远程服务通信太繁琐, 相互通知调用至少需要两个AIDL接口文件
	在远程服务中通知客户端, 需要循环通知, 相当繁琐!
	除非迫不得以(如服务可以是多线程运行), 实在不建议使用AIDL！
	
	客户端与服务在不同进程时, 建议服务单线程运行,
	使用Messenger通信, 这也是Android官方推荐的！

简书: http://www.jianshu.com/p/aec29a98bc1e   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/72760479   
GitHub博客：http://lioil.win/2017/05/25/Android_bindService.html   
Coding博客：http://c.lioil.win/2017/05/25/Android_bindService.html