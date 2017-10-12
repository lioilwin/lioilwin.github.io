---
layout: post
title: (转)Android-shareUserId作用
tags: Android
---
转载: http://www.cnblogs.com/wotakuc/archive/2013/03/27/2984423.html

## 1.shareUserId介绍：	
	Android给每个APK进程分配一个单独的空间,manifest中的userid就是对应一个分配的Linux用户ID，
	并且为它创建一个沙箱，以防止影响其他应用程序（或者其他应用程序影响它）。
	用户ID 在应用程序安装到设备中时被分配，并且在这个设备中保持它的永久性。
	通常，不同的APK会具有不同的userId，因此运行时属于不同的进程中，而不同进程中的资源是不共享的，
	在保障了程序运行的稳定。然后在有些时候，我们自己开发了多个APK并且需要他们之间互相共享资源，
	那么就需要通过设置shareUserId来实现这一目的。
	通过Shared User id,拥有同一个User id的多个APK可以配置成运行在同一个进程中.所以默认就是可以互相访问任意数据. 也可以配置成运行成不同的进程, 同时可以访问其他APK的数据目录下的数据库和文件.就像访问本程序的数据一样。
	
## 2.shareUserId设置：
	在需要共享资源的项目的每个AndroidMainfest.xml中添加shareuserId的标签。
	android:sharedUserId="com.example"
	id名自由设置，但必须保证每个项目都使用了相同的sharedUserId。一个mainfest只能有一个Shareuserid标签。
	<manifest xmlns:android="http://schemas.android.com/apk/res/android"
		package="com.example.shareusertesta"
		android:versionCode="1"
		android:versionName="1.0" 
		android:sharedUserId="com.example">
 
## 3.不同APP的(/data/data/app包名/文件)的共享
	每个安装的程序都会根据自己的包名在手机文件系统的/data/data/app包名/建立一个文件夹（需要su权限才能看见），用于存储程序相关的数据。
	在代码中，我们通过context操作一些IO资源时，相关文件都在此路径的相应文件夹中。比如默认不设置外部路径的文件、DB等等。
	正常情况下，不同的apk无法互相访问对应的app文件夹。但通过设置相同的shareUserId后，就可以互相访问了。代码如下。
	
```java

//程序A：
public class MainActivityA extends Activity {
    TextView textView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        textView = (TextView)findViewById(R.id.textView1);
        WriteSettings(this, "123");
    }

    public void WriteSettings(Context context, String data) {
        FileOutputStream fOut = null;
        OutputStreamWriter osw = null;
        try {
            //默认建立在data/data/xxx/file/ 
            fOut = openFileOutput("settings.dat", MODE_PRIVATE);            
            osw = new OutputStreamWriter(fOut);
            osw.write(data);
            osw.flush();
            Toast.makeText(context, "Settings saved", Toast.LENGTH_SHORT)
                    .show();
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(context, "Settings not saved", Toast.LENGTH_SHORT)
                    .show();
        } finally {
            try {
                osw.close();
                fOut.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
	
```
	
```java

//程序B：
public class MainActivityB extends Activity {
    TextView textView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        textView = (TextView) this.findViewById(R.id.textView1);
        
        try {
            //获取程序A的context
            Context ctx = this.createPackageContext(
                    "com.example.shareusertesta",             Context.CONTEXT_IGNORE_SECURITY);
            String msg = ReadSettings(ctxDealFile);
            Toast.makeText(this, "DealFile2 Settings read" + msg,
                    Toast.LENGTH_SHORT).show();
            WriteSettings(ctx, "deal file2 write");
        } catch (NameNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public String ReadSettings(Context context) {
        FileInputStream fIn = null;
        InputStreamReader isr = null;
        char[] inputBuffer = new char[255];
        String data = null;
        try {
            //此处调用并没有区别，但context此时是从程序A里面获取的
            fIn = context.openFileInput("settings.dat");
            isr = new InputStreamReader(fIn);
            isr.read(inputBuffer);
            data = new String(inputBuffer);
            textView.setText(data);
            Toast.makeText(context, "Settings read", Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(context, "Settings not read", Toast.LENGTH_SHORT)
                    .show();
        } finally {
            try {
                isr.close();
                fIn.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return data;
    }

    public void WriteSettings(Context context, String data) {
        FileOutputStream fOut = null;
        OutputStreamWriter osw = null;
        try {
            fOut = context.openFileOutput("settings.dat", MODE_PRIVATE);
            //此处调用并没有区别，但context此时是从程序A里面获取的
            osw = new OutputStreamWriter(fOut);
            osw.write(data);
            osw.flush();
            Toast.makeText(context, "Settings saved", Toast.LENGTH_SHORT)
                    .show();

        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(context, "Settings not saved", Toast.LENGTH_SHORT)
                    .show();

        } finally {
            try {
                osw.close();
                fOut.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}

``` 
	如果A和B的mainfest中设置了相同的shareuserId，那么B的read函数就能正确读取A写入的内容。否则，B无法获取该文件IO。
	通过这种方式，两个程序之间不需要代码层级的引用。之间的约束是，B需要知道A的file下面存在“settings.dat”这个文件以及B需要知道A的package的name。
 

## 4.Resources和SharedPreferences的共享
	通过shareuserId共享，我们可获取到程序A的context。因此，我们就可以通过context来获取程序A对应的各种资源。
	比较常用的就是Raw资源的获取，如一些软件的apk皮肤包就是采用了这种技术，将主程序和皮肤资源包分在两个apk中。
	获取Resources很简单，在程序A和B的mainfest中设置好相同的shareuserId后，通过createPackageContext获取context即可。
	之后就和原来的方式一样，通过getResources函数获取各种资源，只是此时的context环境是目标APP的context环境。

	//在B中获取A的各种资源
	Context friendContext = this.createPackageContext( "com.example.shareusertesta", Context.CONTEXT_IGNORE_SECURITY);
	Resources res = friendContext.getResources();
	int xId = res.getIdentifier("xxx", "drawable", "com.example.shareusertesta"); //R.string.xxx 
	int yId = res.getIdentifier("yyy", "string", "com.example.shareusertesta"); //R.Drawable.yyy
	res.getString(xId);
	res.getDrawable(yId);
 

## 5.访问安全性(签名)
	上文中通过测试，验证了同key下设置相同shareuserid后可共享资源，否则失败。
	但还有两种情况尚未讨论。一是假设A和C用两个不同的签名，但设置相同的shareuserid，那么能否共享资源。
	二是假设A用签名后的apk安装，C用usb直连调试（即debug key）,两者设置相同的shareuserid，那么能否共享资源。
	经过测试，不论是USB调试还是新签名APK都安装不上。
	再进一步测试后发现，能否安装取决于之前手机中是否已经存在对应该shareduserId的应用。
	如有，则需要判断签名key是否相同，如不同则无法安装。也就是说，如果你删除a和b的应用先装c，此时c的安装正常，
	而原来a和b的安装就失败了（a、b同key，c不同key，三者userId相同）。
 
## 6.其他讨论
	1 android:sharedUserId="android.uid.system" 如果这么设置，可实现提权的功能，修改系统时间等需要core权限的操作就可完成了。
	但看到有人说会造成sd卡读取bug，网上有不少解决方案（未测试）。

	2 修改shareuserId后，usb开发调试安装没有问题，但是利用Ecplise打包签名APK后，
	部分机型会造成无法安装的问题。网上有提到需要源码环境mm打包或其他，较麻烦暂未验证。
	目前测试了三台机子：三星S3自带系统失败；华为一机子成功；三星一刷官方anroid系统的机子成功。
	初步估计部分厂商修改了一定的内核，造成安装失败，具体兼容性情况有待进一步测试

	3 使用shareuserid后，对同系列的产品的签名key必须统一，不要丢失。否则后面开发的系列app就无法获取数据了。
	此外，注意从没有userId的版本到有userId版本时的升级，也可能存在一定的安全权限问题。