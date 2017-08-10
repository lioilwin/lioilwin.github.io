---
layout: post
title: Android-扫描更新媒体库(图库相册)
tags: Android
---
拍照或拍视频视频后，扫描把文件添加到系统媒体库，也就是更新系统图库/相册，以便使用ContentResolver查询文件。

### 方法一、发送广播

```java

sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE,Uri.parse("file://"+filePath)));
// 如果没有第二个权限,在4.2的手机上可以浏览但不会更新,在4.4完全扫描不到图片
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS" />

```

### 方法二、使用MediaScannerConnection类静态方法

```java

// 指定更新某个文件, 添加到媒体库(相册)
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

简书: http://www.jianshu.com/p/6e59c2cfe94c   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/53711236   
GitHub博客：http://lioil.win/2016/08/25/Update-Media-Scanner.html   
Coding博客：http://c.lioil.win/2016/08/25/Update-Media-Scanner.html