---
layout: post
title: Android-Classic Bluetooth(经典蓝牙-长连接-传输短消息/文件)
tags: Android
---
参考: https://developer.android.com/guide/topics/connectivity/bluetooth

## 一.蓝牙版本介绍
	蓝牙有两种模块: 经典蓝牙(Classic Bluetooth, 简称BT)、低功耗蓝牙(Bluetooth Low Energy, 简称BLE)
	经典蓝牙: 蓝牙4.0以下都是"经典蓝牙", 功耗高/传输数据量大/传输距离只有10米。
	低功耗蓝牙: 蓝牙4.0及以上含有"低功耗蓝牙", 低功耗/数据量小/距离50米左右。	
	现在Android手机的蓝牙4.x都是双模蓝牙(既有经典蓝牙也有低功耗蓝牙)，而某些新蓝牙设备是单模，只支持低功耗蓝牙
	
	如何抉择,经典蓝牙,还是BLE?(以下来源: http://baijiahao.baidu.com/s?id=1594727739470471520&wfr=spider&for=pc )
		1.传声音的，用经典蓝牙：
		如蓝牙耳机、蓝牙音箱。蓝牙设计的时候就是为了传声音的，所以是近距离的音频传输的不二选择。
		现在也有基于WIFI的音频传输方案，例如Airplay等，但是WIFI功耗比蓝牙大很多，设备无法做到便携。
		因此固定的音响有WIFI的，移动的如耳机、便携音箱清一色都是基于经典蓝牙协议的。
		
		2.电池供电、连手机APP的，用BLE：
		如共享单车锁、蓝牙智能锁、蓝牙防丢器、蓝牙室内定位，是目前手机和智能硬件通信的性价比最高的手段。
		直线距离约50米，一节5号电池能用一年，传输模组成本10块钱，远比WIFI、4G等大数据量的通信协议更实用。
		虽然蓝牙距离近了点，但胜在直连手机，价格超便宜。以室内定位为例，商场每家门店挂个蓝牙beacon，
		就可以对手机做到精度10米级的室内定位，一个beacon的价格也就几十块钱而已。
		（WIFI距离和BLE类似，但功耗高速度快；4G距离远，但功耗更高价格很贵。）
		
		3.又要声音又要数据的，用双模蓝牙：
		双模蓝牙，就是同时支持经典蓝牙音频和低功耗蓝牙。
		如智能电视遥控器、降噪耳机等。很多智能电视配的遥控器带有语音识别，需要用经典蓝牙才能传输声音。
		而如果做复杂的按键，例如原本键盘表上没有的功能，经典蓝牙的HID按键协议就不行了，得用BLE做私有协议。
		包括很多降噪耳机上通过APP来调节降噪效果，也是通过BLE来实现的私有通信协议。
		
		4.传大数据量的，用经典蓝牙：
		例如某些工控场景，使用Android或Linux主控，外挂蓝牙遥控设备的，
		可以使用经典蓝牙里的SPP协议，当作一个无线串口使用。速度比BLE传输快多了。
		这里要注意的是，iPhone没有开放
		
		5.远距离的，不用蓝牙。
		固定供电的、不考虑功耗的、要传超过几十米距离的、要传高速数据的，这些都不适合蓝牙。
		远距离的可以用2G、4G、NB-IOT，大数据量的可以用WIFI。
		
## 二.Android Classic Bluetooth(经典蓝牙)介绍
	本文介绍经典蓝牙，经典蓝牙适用于电池使用强度较大的操作，例如Android之间流式传输和通信等(音频/文件等大数据)。 
	Android 4.3(API 18)才有API支持低功耗蓝牙(BLE)，更多功能下篇再介绍。
	Android经典蓝牙API的开发步骤如下:
		1.扫描其他蓝牙设备
		2.查询本地蓝牙适配器的配对蓝牙设备
		3.建立 RFCOMM 通道 (传输通道 SPP协议)
		4.通过服务发现连接到其他设备
		5.与其他设备进行双向数据传输
		6.管理多个连接

	android.bluetooth 提供了所有经典蓝牙API
	.BluetoothA2dp 音频分发配置文件,高质量音频通过蓝牙连接和流式传输
	.BluetoothAdapter 本地蓝牙适配器,是所有蓝牙交互的入口,发现设备,查询配对设备,创建BluetoothServerSocket侦听其他设备
	.BluetoothAssignedNumbers
	.BluetoothClass 描述蓝牙设备的一般特征和功能,这是一组只读属性,设备类型提示
	.BluetoothDevice 远程蓝牙设备,与某个远程设备建立连接,查询设备信息,名称,地址,类和配对状态
	.BluetoothHeadset 提供蓝牙耳机支持,以便与手机配合使用,蓝牙耳机和免提配置文件
	.BluetoothHealth  控制蓝牙服务的健康设备配置文件代理
	.BluetoothHealthAppConfiguration 第三方蓝牙健康应用注册的应用配置，以便与远程蓝牙健康设备通信
	.BluetoothHealthCallback 实现 BluetoothHealth 回调的抽象类
	.BluetoothManager 
	.BluetoothProfile 蓝牙配置文件,蓝牙通信的无线接口规范
	.BluetoothServerSocket 侦听请求的服务器Socket(类似TCP ServerSocket)
	.BluetoothSocket 蓝牙Socket接口(类似TCP Socket),通过InputStream和OutputStream与其他设备传输数据
	
## 三.经典蓝牙-长连接-传输短消息/文件
完整源码：https://github.com/lifegh/Bluetooth
	
### 1.蓝牙权限/开关蓝牙
	在manifest添加
	<uses-permission android:name="android.permission.BLUETOOTH" />        请求连接、接受连接和传输数据
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />  启动设备发现或操作蓝牙设置
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />  发现设备还需要定位权限
	
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
	<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
	
	//在Activity添加动态请求权限
	if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
		String[] permissions = {Manifest.permission.WRITE_EXTERNAL_STORAGE
				, Manifest.permission.READ_EXTERNAL_STORAGE
				, Manifest.permission.ACCESS_COARSE_LOCATION};
		for (String str : permissions) {
			if (checkSelfPermission(str) != PackageManager.PERMISSION_GRANTED) {
				requestPermissions(permissions, 111);
				return;
			}
		}
	}
	
	//打开蓝牙
	BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
	if (adapter == null) {
		Util.toast(this, "本机没有找到蓝牙硬件或驱动");
		finish();
	} else {
		if (!adapter.isEnabled())
			adapter.enable();
		//跳转到设置界面
		//startActivityForResult(new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE), 112);
	}
	
### 2.查找远端设备
	// 1.获取已配对设备
	Set<BluetoothDevice> pairedDevices = mBluetoothAdapter.getBondedDevices();
	List<BluetoothDevice> devices = new ArrayList<>();
	devices.addAll(pairedDevices);
	
	// 2.获取未配对设备
	BluetoothAdapter.getDefaultAdapter().startDiscovery(); //开始扫描发现设备
	BroadcastReceiver mReceiver = new BroadcastReceiver() {
		public void onReceive(Context context, Intent intent) {
			String action = intent.getAction();			
			if (BluetoothDevice.ACTION_FOUND.equals(action)) {//获取未配对设备
				BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
				devices.add(device);
			}
		}
	};
	registerReceiver(mReceiver, new IntentFilter(BluetoothDevice.ACTION_FOUND));

### 3.客户端
	通用唯一标识符(UUID)是用于唯一标识信息的字符串ID的128位标准化格式,UUID足够庞大,不会发生冲突。	
	蓝牙MAC相当于TCP的IP，蓝牙UUID相当于TCP的端口，用于标识服务端蓝牙进程，
	所以客户端和服务端两个UUID必须一致！
	
	/**
	 * 客户端，与服务端建立长连接
	 */
	public class BtClient extends BtBase {
		public BtClient(Listener listener) {
			super(listener);
		}

		/**
		 * 与远端设备建立长连接
		 * @param dev 远端设备
		 */
		public void connect(BluetoothDevice dev) {
			close();
			try {
            // final BluetoothSocket socket = dev.createRfcommSocketToServiceRecord(SPP_UUID); //加密传输，会自动执行配对(系统UI弹出配对码)
				final BluetoothSocket socket = dev.createInsecureRfcommSocketToServiceRecord(SPP_UUID); //明文传输，无需配对
				// 开启子线程
				Util.EXECUTOR.execute(new Runnable() {
					@Override
					public void run() {
						loopRead(socket); //循环读取
					}
				});
			} catch (Throwable e) {
				close();
			}
		}
	}
	
### 4.服务端
	/**
	 * 服务端监听和连接线程，只连接一个设备
	 */
	public class BtServer extends BtBase {
		private static final String TAG = BtServer.class.getSimpleName();
		private BluetoothServerSocket mSSocket;

		public BtServer(Listener listener) {
			super(listener);
			listen();
		}

		/**
		 * 监听客户端发起的连接
		 */
		public void listen() {
			try {
				BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
	//            mSSocket = adapter.listenUsingRfcommWithServiceRecord(TAG, SPP_UUID); //加密传输，会自动执行配对
				mSSocket = adapter.listenUsingInsecureRfcommWithServiceRecord(TAG, SPP_UUID); //明文传输，无需配对
				// 开启子线程
				Util.EXECUTOR.execute(new Runnable() {
					@Override
					public void run() {
						try {
							BluetoothSocket socket = mSSocket.accept(); // 监听连接
							mSSocket.close(); // 关闭监听，只连接一个设备
							loopRead(socket); // 循环读取
						} catch (Throwable e) {
							close();
						}
					}
				});
			} catch (Throwable e) {
				close();
			}
		}

		@Override
		public void close() {
			super.close();
			try {
				mSSocket.close();
			} catch (Throwable e) {
				e.printStackTrace();
			}
		}
	}
	
### 5.客户端和服务端的基类,用于管理socket长连接,读写短消息/文件
	public class BtBase {
		static final UUID SPP_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
		private static final String FILE_PATH = Environment.getExternalStorageDirectory().getAbsolutePath() + "/bluetooth/";
		private static final int FLAG_MSG = 0;  //消息标记
		private static final int FLAG_FILE = 1; //文件标记

		private BluetoothSocket mSocket;
		private DataOutputStream mOut;
		private Listener mListener;
		private boolean isRead;
		private boolean isSending;

		BtBase(Listener listener) {
			mListener = listener;
		}

		/**
		 * 循环读取对方数据(若没有数据，则阻塞等待)
		 */
		void loopRead(BluetoothSocket socket) {
			mSocket = socket;
			try {
				if (!mSocket.isConnected())
					mSocket.connect();
				notifyUI(Listener.CONNECTED, mSocket.getRemoteDevice());
				mOut = new DataOutputStream(mSocket.getOutputStream());
				DataInputStream in = new DataInputStream(mSocket.getInputStream());
				isRead = true;
				while (isRead) { //死循环读取
					switch (in.readInt()) {
						case FLAG_MSG: //读取短消息
							String msg = in.readUTF();
							notifyUI(Listener.MSG, "接收短消息：" + msg);
							break;
						case FLAG_FILE: //读取文件
							Util.mkdirs(FILE_PATH);
							String fileName = in.readUTF(); //文件名
							long fileLen = in.readLong(); //文件长度
							notifyUI(Listener.MSG, "正在接收文件(" + fileName + ")····················");
							// 读取文件内容
							long len = 0;
							int r;
							byte[] b = new byte[4 * 1024];
							FileOutputStream out = new FileOutputStream(FILE_PATH + fileName);
							while ((r = in.read(b)) != -1) {
								out.write(b, 0, r);
								len += r;
								if (len >= fileLen)
									break;
							}
							notifyUI(Listener.MSG, "文件接收完成(存放在:" + FILE_PATH + ")");
							break;
					}
				}
			} catch (Throwable e) {
				close();
			}
		}

		/**
		 * 发送短消息
		 */
		public void sendMsg(String msg) {
			if (isSending || TextUtils.isEmpty(msg))
				return;
			isSending = true;
			try {
				mOut.writeInt(FLAG_MSG); //消息标记
				mOut.writeUTF(msg);
			} catch (Throwable e) {
				close();
			}
			notifyUI(Listener.MSG, "发送短消息：" + msg);
			isSending = false;
		}

		/**
		 * 发送文件
		 */
		public void sendFile(final String filePath) {
			if (isSending || TextUtils.isEmpty(filePath))
				return;
			isSending = true;
			Util.EXECUTOR.execute(new Runnable() {
				@Override
				public void run() {
					try {
						notifyUI(Listener.MSG, "正在发送文件(" + filePath + ")····················");
						FileInputStream in = new FileInputStream(filePath);
						File file = new File(filePath);
						mOut.writeInt(FLAG_FILE); //文件标记
						mOut.writeUTF(file.getName()); //文件名
						mOut.writeLong(file.length()); //文件长度
						int r;
						byte[] b = new byte[4 * 1024];
						while ((r = in.read(b)) != -1) {
							mOut.write(b, 0, r);
						}
						notifyUI(Listener.MSG, "文件发送完成.");
					} catch (Throwable e) {
						close();
					}
					isSending = false;
				}
			});
		}

		/**
		 * 关闭Socket连接
		 */
		public void close() {
			try {
				isRead = false;
				mSocket.close();
				notifyUI(Listener.DISCONNECTED, null);
			} catch (Throwable e) {
				e.printStackTrace();
			}
		}

		/**
		 * 当前设备与指定设备是否连接
		 */
		public boolean isConnected(BluetoothDevice dev) {
			boolean connected = (mSocket != null && mSocket.isConnected());
			if (dev == null)
				return connected;
			return connected && mSocket.getRemoteDevice().equals(dev);
		}

		// ============================================通知UI===========================================================
		private void notifyUI(final int state, final Object obj) {
			MainAPP.runUi(new Runnable() {
				@Override
				public void run() {
					try {
						mListener.socketNotify(state, obj);
					} catch (Throwable e) {
						e.printStackTrace();
					}
				}
			});
		}

		public interface Listener {
			int DISCONNECTED = 0;
			int CONNECTED = 1;
			int MSG = 2;

			void socketNotify(int state, Object obj);
		}
	}
	
简书: https://www.jianshu.com/p/977ab323c0a5   
CSDN: https://blog.csdn.net/qq_32115439/article/details/80379262   
GitHub博客: http://lioil.win/2018/05/19/Android-Bluetooth.html   
Coding博客: http://c.lioil.win/2018/05/19/Android-Bluetooth.html