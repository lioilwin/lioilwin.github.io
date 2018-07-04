---
layout: post
title: Android-USB-OTG-读写U盘文件
tags: Android
---
参考:
https://developer.android.com/guide/topics/connectivity/usb/host.html
https://blog.csdn.net/qq_29924041/article/details/80141514

本文介绍Android手机通过OTG数据线读写USB存储设备(U盘,移动硬盘,存储卡)的两种方法

### 方法一: 和UsbDevice建立USB连接,借助第三方库libaums识别U盘的文件系统
由于libaums只支持FAT32文件系统,所以U盘的格式化必须采用FAT32,否则无法识别!   
该库的GitHub地址: https://github.com/magnusja/libaums
	
#### 1.权限	
	<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />	
	// 手机必须支持USB主机特性(OTG)
    <uses-feature android:name="android.hardware.usb.host" />
	
#### 2.监听USB插入/拔出
	private static final String ACTION_USB_PERMISSION = "com.demo.otgusb.USB_PERMISSION";
    private UsbManager mUsbManager;
    private PendingIntent mPermissionIntent;	
	private BroadcastReceiver mUsbReceiver = new BroadcastReceiver() {
        public void onReceive(Context context, Intent intent) {
            Log.d(TAG, "onReceive: " + intent);
            String action = intent.getAction();
            if (action == null)
                return;
            switch (action) {
                case ACTION_USB_PERMISSION://用户授权广播
                    synchronized (this) {
                        if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) { //允许权限申请
                            test();
                        } else {
                            logShow("用户未授权，访问USB设备失败");
                        }
                    }
                    break;
                case UsbManager.ACTION_USB_DEVICE_ATTACHED://USB设备插入广播
                    logShow("USB设备插入");
                    break;
                case UsbManager.ACTION_USB_DEVICE_DETACHED://USB设备拔出广播
                    logShow("USB设备拔出");
                    break;
            }
        }
    };
	
	private void init() {	
		//USB管理器
		mUsbManager = (UsbManager) getSystemService(Context.USB_SERVICE);
		mPermissionIntent = PendingIntent.getBroadcast(this, 0, new Intent(ACTION_USB_PERMISSION), 0);
		
		//注册广播,监听USB插入和拔出
		IntentFilter intentFilter = new IntentFilter();
		intentFilter.addAction(UsbManager.ACTION_USB_DEVICE_ATTACHED);
		intentFilter.addAction(UsbManager.ACTION_USB_DEVICE_DETACHED);
		intentFilter.addAction(ACTION_USB_PERMISSION);
		registerReceiver(mUsbReceiver, intentFilter);

		//读写权限
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
			requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE,
					Manifest.permission.READ_EXTERNAL_STORAGE}, 111);
		}
	}
	
#### 3.使用libaums库读写U盘文件
	private void test() {
        try {
            UsbMassStorageDevice[] storageDevices = UsbMassStorageDevice.getMassStorageDevices(this);
            for (UsbMassStorageDevice storageDevice : storageDevices) { //一般手机只有一个USB设备
                // 申请USB权限
                if (!mUsbManager.hasPermission(storageDevice.getUsbDevice())) {
                    mUsbManager.requestPermission(storageDevice.getUsbDevice(), mPermissionIntent);
                    break;
                }
                // 初始化
                storageDevice.init();
                // 获取分区
                List<Partition> partitions = storageDevice.getPartitions();
                if (partitions.size() == 0) {
                    logShow("错误: 读取分区失败");
                    return;
                }
                // 仅使用第一分区
                FileSystem fileSystem = partitions.get(0).getFileSystem();
                logShow("Volume Label: " + fileSystem.getVolumeLabel());
                logShow("Capacity: " + fSize(fileSystem.getCapacity()));
                logShow("Occupied Space: " + fSize(fileSystem.getOccupiedSpace()));
                logShow("Free Space: " + fSize(fileSystem.getFreeSpace()));
                logShow("Chunk size: " + fSize(fileSystem.getChunkSize()));

                UsbFile root = fileSystem.getRootDirectory();
                UsbFile[] files = root.listFiles();
                for (UsbFile file : files)
                    logShow("文件: " + file.getName());

                // 新建文件
                UsbFile newFile = root.createFile("hello_" + System.currentTimeMillis() + ".txt");
                logShow("新建文件: " + newFile.getName());

                // 写文件
				// OutputStream os = new UsbFileOutputStream(newFile);
                OutputStream os = UsbFileStreamFactory.createBufferedOutputStream(newFile, fileSystem);
                os.write(("hi_" + System.currentTimeMillis()).getBytes());
                os.close();
                logShow("写文件: " + newFile.getName());

                // 读文件
				// InputStream is = new UsbFileInputStream(newFile);
                InputStream is = UsbFileStreamFactory.createBufferedInputStream(newFile, fileSystem);
                byte[] buffer = new byte[fileSystem.getChunkSize()];
                int len;
                File sdFile = new File("/sdcard/111");
                sdFile.mkdirs();
                FileOutputStream sdOut = new FileOutputStream(sdFile.getAbsolutePath() + "/" + newFile.getName());
                while ((len = is.read(buffer)) != -1) {
                    sdOut.write(buffer, 0, len);
                }
                is.close();
                sdOut.close();
                logShow("读文件: " + newFile.getName() + " ->复制到/sdcard/111/");

                storageDevice.close();
            }
        } catch (Exception e) {
            logShow("错误: " + e);
        }
    }
	
	public static String fSize(long sizeInByte) {
        if (sizeInByte < 1024)
            return String.format("%s", sizeInByte);
        else if (sizeInByte < 1024 * 1024)
            return String.format(Locale.CANADA, "%.2fKB", sizeInByte / 1024.);
        else if (sizeInByte < 1024 * 1024 * 1024)
            return String.format(Locale.CANADA, "%.2fMB", sizeInByte / 1024. / 1024);
        else
            return String.format(Locale.CANADA, "%.2fGB", sizeInByte / 1024. / 1024 / 1024);
    }
	
### 方法二: 获取U盘的挂载路径,直接读写U盘(就像挂载sdcard读写文件)
	对于U盘的文件系统,只依赖于手机系统是否支持,无需我们做额外工作(所有手机都支持FAT32, 仅个别手机支持NTFS)
	
	// 注册系统广播
	<receiver android:name=".MediaReceiver">
		<intent-filter>
			<action android:name="android.intent.action.MEDIA_CHECKING" />
			<action android:name="android.intent.action.MEDIA_MOUNTED" />
			<action android:name="android.intent.action.MEDIA_EJECT" />
			<action android:name="android.intent.action.MEDIA_UNMOUNTED" />

			<data android:scheme="file" />
		</intent-filter>
	</receiver>

	// 获取USB挂载路径
	public class MediaReceiver extends BroadcastReceiver {		
		@Override
		public void onReceive(Context context, Intent intent) {
			switch (intent.getAction()) {
				case Intent.ACTION_MEDIA_CHECKING:
					break;
				case Intent.ACTION_MEDIA_MOUNTED:
					// 获取挂载路径, 读取U盘文件
					Uri uri = intent.getData();
					if (uri != null) {
						String filePath = uri.getPath();
						File rootFile = new File(filePath);
						for (File file : rootFile.listFiles()) {
							// 文件列表...
						}
					}
					break;
				case Intent.ACTION_MEDIA_EJECT:
					break;
				case Intent.ACTION_MEDIA_UNMOUNTED:
					break;
			}
		}
	}

简书: https://www.jianshu.com/p/a32e376ea70e   
CSDN: https://blog.csdn.net/qq_32115439/article/details/80918046   
GitHub博客: http://lioil.win/2018/07/04/Android-USB-OTG.html   
Coding博客: http://c.lioil.win/2018/07/04/Android-USB-OTG.html