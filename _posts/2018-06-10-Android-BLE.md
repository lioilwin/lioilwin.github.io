---
layout: post
title: Android-低功耗蓝牙(BLE)-客户端(主机/中心设备/Central)和服务端(从机/外围设备/peripheral)
tags: Android
---
参考:   
https://developer.android.com/guide/topics/connectivity/bluetooth-le   
http://a1anwang.com/post-47.html

## 一.Android 低功耗蓝牙(BLE)的API简介
	从Android 4.3(API 18)才支持低功耗蓝牙(Bluetooth Low Energy, BLE)的核心功能,
	BLE蓝牙协议是GATT协议, BLE相关类不多, 全都位于android.bluetooth包和android.bluetooth.le包的几个类:
	android.bluetooth.
	  .BluetoothGattService  包含多个Characteristic(属性特征值), 含有唯一的UUID作为标识
	  .BluetoothGattCharacteristic  包含单个值和多个Descriptor, 含有唯一的UUID作为标识
	  .BluetoothGattDescriptor  对Characteristic进行描述, 含有唯一的UUID作为标识
	  
	  .BluetoothGatt   客户端相关
	  .BluetoothGattCallback  客户端连接回调	  
	  .BluetoothGattServer  服务端相关
	  .BluetoothGattServerCallback 服务端连接回调
	
	android.bluetooth.le.
	  .AdvertiseCallback  服务端的广播回调
	  .AdvertiseData  服务端的广播数据
	  .AdvertiseSettings 服务端的广播设置
	  .BluetoothLeAdvertiser 服务端的广播
	  
	  .BluetoothLeScanner  客户端扫描相关(Android5.0新增)
	  .ScanCallback  客户端扫描回调
	  .ScanFilter 客户端扫描过滤
	  .ScanRecord 客户端扫描结果的广播数据
	  .ScanResult 客户端扫描结果
	  .ScanSettings 客户端扫描设置
	  
	BLE设备分为两种设备: 客户端(也叫主机/中心设备/Central), 服务端(也叫从机/外围设备/peripheral)
	客户端的核心类是 BluetoothGatt
	服务端的核心类是 BluetoothGattServer 和 BluetoothLeAdvertiser
	BLE数据的核心类是 BluetoothGattCharacteristic 和 BluetoothGattDescriptor
	
## 二.低功耗蓝牙(BLE)-手机同时作为BLE客户端和BLE服务端,读写Characteristic数据
完整源码: https://github.com/lifegh/Bluetooth   
![](https://raw.githubusercontent.com/lifegh/Bluetooth/master/png/ble_client.png) ![](https://raw.githubusercontent.com/lifegh/Bluetooth/master/png/ble_server.png)

### 1.蓝牙权限
	BLE权限增加了BEL支持检查，其它与上篇的经典蓝牙相同，不再写了
	(1).在manifest中添加权限
    <!-- true 表示手机必须支持BLE，否则无法安装！
		这里设为false, 运行后在Activity中检查-->
    <uses-feature
        android:name="android.hardware.bluetooth_le"
        android:required="false" />
	
	(2).在Activity中设置蓝牙
	// 检查是否支持BLE蓝牙
	if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
		Util.toast(this, "本机不支持低功耗蓝牙！");
		finish();
		return;
	}
	
### 2.BLE客户端(也叫主机/中心设备/Central)
#### (1).扫描BLE设备(不包含经典蓝牙)
	注意: BLE设备地址是动态变化(每隔一段时间都会变化),而经典蓝牙设备是出厂就固定不变了！
	BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
	// 下面使用Android5.0新增的扫描API，扫描返回的结果更友好，比如BLE广播数据以前是byte[] scanRecord，而新API帮我们解析成ScanRecord类\
	// 旧API是BluetoothAdapter.startLeScan(...)
	final BluetoothLeScanner bluetoothLeScanner = bluetoothAdapter.getBluetoothLeScanner();
	bluetoothLeScanner.startScan(mScanCallback);
	mHandler.postDelayed(new Runnable() {
		@Override
		public void run() {
			bluetoothLeScanner.stopScan(mScanCallback); //停止扫描
			isScanning = false;
		}
	}, 3000);
	
	// 扫描结果Callback
	private final ScanCallback mScanCallback = new ScanCallback() {
        @Override
        public void onScanResult(int callbackType, ScanResult result) {、
			BluetoothDevice dev = result.getDevice() 获取BLE设备信息
            // result.getScanRecord() 获取BLE广播数据
        }
    };
	
#### (2).建立连接
	// 获取扫描设备，建立连接
	closeConn();
	BluetoothDevice dev = result.getDevice()
	mBluetoothGatt = dev.connectGatt(BleClientActivity.this, false, mBluetoothGattCallback); // 连接蓝牙设备

    // BLE中心设备连接外围设备的数量有限(大概2~7个)，在建立新连接之前必须释放旧连接资源，否则容易出现连接错误133
    private void closeConn() {
        if (mBluetoothGatt != null) {
            mBluetoothGatt.disconnect();
            mBluetoothGatt.close();
        }
    }
		
	// 与服务端连接的Callback
    public BluetoothGattCallback mBluetoothGattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            BluetoothDevice dev = gatt.getDevice();
            Log.i(TAG, String.format("onConnectionStateChange:%s,%s,%s,%s", dev.getName(), dev.getAddress(), status, newState));
            if (status == BluetoothGatt.GATT_SUCCESS && newState == BluetoothProfile.STATE_CONNECTED) {
                isConnected = true;
                gatt.discoverServices(); //启动服务发现
            } else {
                isConnected = false;
                closeConn();
            }
            logTv(String.format(status == 0 ? (newState == 2 ? "与[%s]连接成功" : "与[%s]连接断开") : ("与[%s]连接出错,错误码:" + status), dev));
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            Log.i(TAG, String.format("onServicesDiscovered:%s,%s,%s", gatt.getDevice().getName(), gatt.getDevice().getAddress(), status));
            if (status == BluetoothGatt.GATT_SUCCESS) { //BLE服务发现成功
                // 遍历获取BLE服务Services/Characteristics/Descriptors的全部UUID
                for (BluetoothGattService service : gatt.getServices()) {
                    StringBuilder allUUIDs = new StringBuilder("UUIDs={\nS=" + service.getUuid().toString());
                    for (BluetoothGattCharacteristic characteristic : service.getCharacteristics()) {
                        allUUIDs.append(",\nC=").append(characteristic.getUuid());
                        for (BluetoothGattDescriptor descriptor : characteristic.getDescriptors())
                            allUUIDs.append(",\nD=").append(descriptor.getUuid());
                    }
                    allUUIDs.append("}");
                    Log.i(TAG, "onServicesDiscovered:" + allUUIDs.toString());
                    logTv("发现服务" + allUUIDs);
                }
            }
        }

        @Override
        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            UUID uuid = characteristic.getUuid();
            String valueStr = new String(characteristic.getValue());
            Log.i(TAG, String.format("onCharacteristicRead:%s,%s,%s,%s,%s", gatt.getDevice().getName(), gatt.getDevice().getAddress(), uuid, valueStr, status));
            logTv("读取Characteristic[" + uuid + "]:\n" + valueStr);
        }

        @Override
        public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            UUID uuid = characteristic.getUuid();
            String valueStr = new String(characteristic.getValue());
            Log.i(TAG, String.format("onCharacteristicWrite:%s,%s,%s,%s,%s", gatt.getDevice().getName(), gatt.getDevice().getAddress(), uuid, valueStr, status));
            logTv("写入Characteristic[" + uuid + "]:\n" + valueStr);
        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
            UUID uuid = characteristic.getUuid();
            String valueStr = new String(characteristic.getValue());
            Log.i(TAG, String.format("onCharacteristicChanged:%s,%s,%s,%s", gatt.getDevice().getName(), gatt.getDevice().getAddress(), uuid, valueStr));
            logTv("通知Characteristic[" + uuid + "]:\n" + valueStr);
        }

        @Override
        public void onDescriptorRead(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
            UUID uuid = descriptor.getUuid();
            String valueStr = Arrays.toString(descriptor.getValue());
            Log.i(TAG, String.format("onDescriptorRead:%s,%s,%s,%s,%s", gatt.getDevice().getName(), gatt.getDevice().getAddress(), uuid, valueStr, status));
            logTv("读取Descriptor[" + uuid + "]:\n" + valueStr);
        }

        @Override
        public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
            UUID uuid = descriptor.getUuid();
            String valueStr = Arrays.toString(descriptor.getValue());
            Log.i(TAG, String.format("onDescriptorWrite:%s,%s,%s,%s,%s", gatt.getDevice().getName(), gatt.getDevice().getAddress(), uuid, valueStr, status));
            logTv("写入Descriptor[" + uuid + "]:\n" + valueStr);
        }
    };
	
#### (3).传输数据(读写Characteristic和Descriptor)
	注意：
		1.每次读写数据最多20个字节，如果超过，只能分包
		2.连续频繁读写数据容易失败，读写操作间隔最好200ms以上，或等待上次回调完成后再进行下次读写操作！
    // 读取数据成功会回调->onCharacteristicChanged()
    public void read(View view) {
        BluetoothGattService service = getGattService(BleServerActivity.UUID_SERVICE);
        if (service != null) {
            BluetoothGattCharacteristic characteristic = service.getCharacteristic(BleServerActivity.UUID_CHAR_READ_NOTIFY);//通过UUID获取可读的Characteristic
            mBluetoothGatt.readCharacteristic(characteristic);
        }
    }

    // 写入数据成功会回调->onCharacteristicWrite()
    public void write(View view) {
        BluetoothGattService service = getGattService(BleServerActivity.UUID_SERVICE);
        if (service != null) {
            String text = mWriteET.getText().toString();
            BluetoothGattCharacteristic characteristic = service.getCharacteristic(BleServerActivity.UUID_CHAR_WRITE);//通过UUID获取可写的Characteristic
            characteristic.setValue(text.getBytes()); //单次最多20个字节
            mBluetoothGatt.writeCharacteristic(characteristic);
        }
    }
	
	// 获取Gatt服务
    private BluetoothGattService getGattService(UUID uuid) {
        BluetoothGattService service = mBluetoothGatt.getService(uuid);
        if (service == null)
            Util.toast(this, "没有找到服务UUID=" + uuid);
        return service;
    }
	
#### (4).设置通知,实时监听Characteristic变化
	// Characteristic变化会回调->onCharacteristicChanged()
	BluetoothGattService service = getGattService(BleServerActivity.UUID_SERVICE);
	if (service != null) {
		// 设置Characteristic通知
		BluetoothGattCharacteristic characteristic = service.getCharacteristic(BleServerActivity.UUID_CHAR_READ_NOTIFY);//通过UUID获取可通知的Characteristic
		mBluetoothGatt.setCharacteristicNotification(characteristic, true);

		// 向Characteristic的Descriptor属性写入通知开关，使蓝牙设备主动向手机发送数据
		BluetoothGattDescriptor descriptor = characteristic.getDescriptor(BleServerActivity.UUID_DESC_NOTITY);
		// descriptor.setValue(BluetoothGattDescriptor.ENABLE_INDICATION_VALUE);//和通知类似,但服务端不主动发数据,只指示客户端读取数据
		descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
		mBluetoothGatt.writeDescriptor(descriptor);
	}

### 3.BLE服务端(也叫从机/外围设备/peripheral)
    public static final UUID UUID_SERVICE = UUID.fromString("10000000-0000-0000-0000-000000000000"); //自定义UUID
    public static final UUID UUID_CHAR_READ_NOTIFY = UUID.fromString("11000000-0000-0000-0000-000000000000");
    public static final UUID UUID_DESC_NOTITY = UUID.fromString("11100000-0000-0000-0000-000000000000");
    public static final UUID UUID_CHAR_WRITE = UUID.fromString("12000000-0000-0000-0000-000000000000");
    private BluetoothLeAdvertiser mBluetoothLeAdvertiser; // BLE广播
    private BluetoothGattServer mBluetoothGattServer; // BLE服务端

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        ......
        BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        // BluetoothAdapter bluetoothAdapter = bluetoothManager.getAdapter();
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();

        // ============启动BLE蓝牙广播(广告) =================================================================================
        //广播设置(必须)
        AdvertiseSettings settings = new AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY) //广播模式: 低功耗,平衡,低延迟
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH) //发射功率级别: 极低,低,中,高
                .setConnectable(true) //能否连接,广播分为可连接广播和不可连接广播
                .build();
        //广播数据(必须，广播启动就会发送)
        AdvertiseData advertiseData = new AdvertiseData.Builder()
                .setIncludeDeviceName(true) //包含蓝牙名称
                .setIncludeTxPowerLevel(true) //包含发射功率级别
                .addManufacturerData(1, new byte[]{23, 33}) //设备厂商数据，自定义
                .build();
        //扫描响应数据(可选，当客户端扫描时才发送)
        AdvertiseData scanResponse = new AdvertiseData.Builder()
                .addManufacturerData(2, new byte[]{66, 66}) //设备厂商数据，自定义
                .addServiceUuid(new ParcelUuid(UUID_SERVICE)) //服务UUID
        //      .addServiceData(new ParcelUuid(UUID_SERVICE), new byte[]{2}) //服务数据，自定义
                .build();
        mBluetoothLeAdvertiser = bluetoothAdapter.getBluetoothLeAdvertiser();
        mBluetoothLeAdvertiser.startAdvertising(settings, advertiseData, scanResponse, mAdvertiseCallback);

        // 注意：必须要开启可连接的BLE广播，其它设备才能发现并连接BLE服务端!
        // =============启动BLE蓝牙服务端=====================================================================================
        BluetoothGattService service = new BluetoothGattService(UUID_SERVICE, BluetoothGattService.SERVICE_TYPE_PRIMARY);
        //添加可读+通知characteristic
        BluetoothGattCharacteristic characteristicRead = new BluetoothGattCharacteristic(UUID_CHAR_READ_NOTIFY,
                BluetoothGattCharacteristic.PROPERTY_READ | BluetoothGattCharacteristic.PROPERTY_NOTIFY, BluetoothGattCharacteristic.PERMISSION_READ);
        characteristicRead.addDescriptor(new BluetoothGattDescriptor(UUID_DESC_NOTITY, BluetoothGattCharacteristic.PERMISSION_WRITE));
        service.addCharacteristic(characteristicRead);
        //添加可写characteristic
        BluetoothGattCharacteristic characteristicWrite = new BluetoothGattCharacteristic(UUID_CHAR_WRITE,
                BluetoothGattCharacteristic.PROPERTY_WRITE, BluetoothGattCharacteristic.PERMISSION_WRITE);
        service.addCharacteristic(characteristicWrite);
        if (bluetoothManager != null)
            mBluetoothGattServer = bluetoothManager.openGattServer(this, mBluetoothGattServerCallback);
        mBluetoothGattServer.addService(service);
    }

    // BLE广播Callback
    private AdvertiseCallback mAdvertiseCallback = new AdvertiseCallback() {
        @Override
        public void onStartSuccess(AdvertiseSettings settingsInEffect) {
            logTv("BLE广播开启成功");
        }

        @Override
        public void onStartFailure(int errorCode) {
            logTv("BLE广播开启失败,错误码:" + errorCode);
        }
    };

    // BLE服务端Callback
    private BluetoothGattServerCallback mBluetoothGattServerCallback = new BluetoothGattServerCallback() {
        @Override
        public void onConnectionStateChange(BluetoothDevice device, int status, int newState) {
            Log.i(TAG, String.format("onConnectionStateChange:%s,%s,%s,%s", device.getName(), device.getAddress(), status, newState));
            logTv(String.format(status == 0 ? (newState == 2 ? "与[%s]连接成功" : "与[%s]连接断开") : ("与[%s]连接出错,错误码:" + status), device));
        }

        @Override
        public void onServiceAdded(int status, BluetoothGattService service) {
            Log.i(TAG, String.format("onServiceAdded:%s,%s", status, service.getUuid()));
            logTv(String.format(status == 0 ? "添加服务[%s]成功" : "添加服务[%s]失败,错误码:" + status, service.getUuid()));
        }

        @Override
        public void onCharacteristicReadRequest(BluetoothDevice device, int requestId, int offset, BluetoothGattCharacteristic characteristic) {
            Log.i(TAG, String.format("onCharacteristicReadRequest:%s,%s,%s,%s,%s", device.getName(), device.getAddress(), requestId, offset, characteristic.getUuid()));
            String response = "CHAR_" + (int) (Math.random() * 100); //模拟数据
            mBluetoothGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, response.getBytes());// 响应客户端
            logTv("客户端读取Characteristic[" + characteristic.getUuid() + "]:\n" + response);
        }

        @Override
        public void onCharacteristicWriteRequest(BluetoothDevice device, int requestId, BluetoothGattCharacteristic characteristic, boolean preparedWrite, boolean responseNeeded, int offset, byte[] requestBytes) {
            // 获取客户端发过来的数据
            String requestStr = new String(requestBytes);
            Log.i(TAG, String.format("onCharacteristicWriteRequest:%s,%s,%s,%s,%s,%s,%s,%s", device.getName(), device.getAddress(), requestId, characteristic.getUuid(),
                    preparedWrite, responseNeeded, offset, requestStr));
            mBluetoothGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, requestBytes);// 响应客户端
            logTv("客户端写入Characteristic[" + characteristic.getUuid() + "]:\n" + requestStr);
        }

        @Override
        public void onDescriptorReadRequest(BluetoothDevice device, int requestId, int offset, BluetoothGattDescriptor descriptor) {
            Log.i(TAG, String.format("onDescriptorReadRequest:%s,%s,%s,%s,%s", device.getName(), device.getAddress(), requestId, offset, descriptor.getUuid()));
            String response = "DESC_" + (int) (Math.random() * 100); //模拟数据
            mBluetoothGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, response.getBytes()); // 响应客户端
            logTv("客户端读取Descriptor[" + descriptor.getUuid() + "]:\n" + response);
        }

        @Override
        public void onDescriptorWriteRequest(final BluetoothDevice device, int requestId, BluetoothGattDescriptor descriptor, boolean preparedWrite, boolean responseNeeded, int offset, byte[] value) {
            // 获取客户端发过来的数据
            String valueStr = Arrays.toString(value);
            Log.i(TAG, String.format("onDescriptorWriteRequest:%s,%s,%s,%s,%s,%s,%s,%s", device.getName(), device.getAddress(), requestId, descriptor.getUuid(),
                    preparedWrite, responseNeeded, offset, valueStr));
            mBluetoothGattServer.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, value);// 响应客户端
            logTv("客户端写入Descriptor[" + descriptor.getUuid() + "]:\n" + valueStr);

            // 简单模拟通知客户端Characteristic变化
            if (Arrays.toString(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE).equals(valueStr)) { //是否开启通知
                final BluetoothGattCharacteristic characteristic = descriptor.getCharacteristic();
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        for (int i = 0; i < 5; i++) {
                            SystemClock.sleep(3000);
                            String response = "CHAR_" + (int) (Math.random() * 100); //模拟数据
                            characteristic.setValue(response);
                            mBluetoothGattServer.notifyCharacteristicChanged(device, characteristic, false);
                            logTv("通知客户端改变Characteristic[" + characteristic.getUuid() + "]:\n" + response);
                        }
                    }
                }).start();
            }
        }

        @Override
        public void onExecuteWrite(BluetoothDevice device, int requestId, boolean execute) {
            Log.i(TAG, String.format("onExecuteWrite:%s,%s,%s,%s", device.getName(), device.getAddress(), requestId, execute));
        }

        @Override
        public void onNotificationSent(BluetoothDevice device, int status) {
            Log.i(TAG, String.format("onNotificationSent:%s,%s,%s", device.getName(), device.getAddress(), status));
        }

        @Override
        public void onMtuChanged(BluetoothDevice device, int mtu) {
            Log.i(TAG, String.format("onMtuChanged:%s,%s,%s", device.getName(), device.getAddress(), mtu));
        }
    };

简书: https://www.jianshu.com/p/8ac31a5070d4   
CSDN: https://blog.csdn.net/qq_32115439/article/details/80643906   
GitHub博客: http://lioil.win/2018/06/10/Android-BLE.html   
Coding博客: http://c.lioil.win/2018/06/10/Android-BLE.html