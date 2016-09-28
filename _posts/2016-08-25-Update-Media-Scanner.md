---
layout: post
title: 扫描更新媒体库
tags: Android
---

拍照或拍视频视频后，扫描把文件添加到系统媒体库，以便我们使用ContentResolver查询文件。

### 方法一、发送广播

```java

sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE,Uri.parse("file://"+filePath)));
// 加权限：
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS" />
// 没第二个权限在4.2的手机上可以浏览但不会更新，在4.4完全扫描不到图片。

```

### 方法二、使用MediaScannerConnection类静态方法

```java

MediaScannerConnection.scanFile(context, new String[]{filePath}, null, null); 

```

### 方法三、使用MediaScannerConnectionClient回调接口(此方法可获得更新完成后的uri)

```java

MediaScannerConnection msc = new MediaScannerConnection(this, new MediaScannerConnectionClient(){
	@Override
	public void onMediaScannerConnected() {
		msc.scanFile(filePath, null);
	}
	
	@Override
	public void onScanCompleted(String path, Uri uri) {		
		msc.disconnect();		
	}
	
});
msc.connect();

```

