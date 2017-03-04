---
layout: post
title: (转)Android图片加载框架
tags: Android
---
原文：http://www.jianshu.com/p/3ac30878c72c

# 一、UniversalImageLoader
https://github.com/nostra13/Android-Universal-Image-Loader
UIL可以算是老牌最火的图片加载库了，使用过这个框架的项目可以说多到教你做人。可惜的是该作者在项目中说明已经停止了对该项目的维护。这就意味着以后任何的新特性都不会再继续开发，所以毫无疑问 UIL不推荐在项目中使用了。

	加载原理：
	1、ImageLoader图片加载器,采取了单例模式,用于图片的加载和显示
	2、MemoryCache图片内存换成,默认使用算法Least Recently Used(LRU),存储结构LinkedHashMap
	3、DiskCache图片磁盘缓存,默认使用算法LruDiskCache,缓存目录下名为journal文件记录缓存所有操作
	4、图片加载流程
		1.判断图片的内存缓存是否存在,若存在直接执行步骤8
		2.判断图片的磁盘缓存是否存在,若存在直接执行步骤5
		3.ImageDownloader从网络上下载
		4.将图片缓存在磁盘上
		5.ImageDecoder将图片decode成bitmap对象
		6.BitmapProcessor根据DisplayImageOptions配置对图片进行预处理(Pre-process Bitmap)；
		7.将bitma对象缓存到内存中
		8.根据DisplayImageOptions配置对图片进行后处理(Post-process Bitmap)
		9.执行DisplayBitmapTask将图片显示在相应的控件上

# 二、Picasso
https://github.com/square/picasso
Picasso是Square公司开源的一个Android平台上的图片加载框架,简单易用,一句话完成加载图片
		
	使用:Picasso.with(this).load("url").placeholder(R.mipmap.ic_default).into(imageView);
	图片加载流程
		1.初始化Picasso，实例化其唯一的对象
		2.根据传入的Url、File、resource Id，构建ReqeustCreator对象
		3.根据ReqeustCreator构建Request对象，同时根据Reqeust属性，尝试从Cache中访问数据
		4.Cache Hit，则通过回调，设置Target或者ImageView，完成该Reqeust
		5.如果Cache Miss，那么则构建相应的Action，并提交到DispatcherThread当中
		6.Dispatcher中的Handler接收到相应的Message，调用dispatcher.performSubmit(action)进行处理
		7.创建BitmapHunter对象，并提交到PicassoExecutorService线程池
		8.再次检查Memory Cache中已经有缓存，如果Hit，则读取缓存中的Bitmap
		9.如果Cache miss，则交给Action对应的ReqeustHandler进行处理，比如网络请求，或者从File读取图片
		10.返回结果之后，通知Dispatcher中的Handler处理结果
		11.DispatcherThread中将BitmapHunter的结果打包(batch)，最快200ms打包一次。通知主线程HANDLER进行处理
		12.主线程HANDLER接收打包的BitmapHunter，对最后的结果进行分发

# 三、Glide
https://github.com/bumptech/glide
Glide是Google一位员工的大作, 完全是基于Picasso,沿袭了Picasso的简洁风格,但是在此做了大量优化与改进
		
	1.内存缓存
	Picasso默认Bitmap是ARGB8888格式(一个像素占用4个字节内存), 
	Glide默认是RGB565格式(一个像素占用2个字节内存,但是没有透明度A), 内存开销小一半	
	2.磁盘缓存
	Picasso只会缓存原始尺寸图片,而Glide缓存多种规格,
	Glide根据ImageView大小来缓存相应大小图片尺寸,
	如ImageView大小是200*200,原图是400*400,Glide会缓存200*200规格图,而Picasso只会缓存400*400规格	
	3.Glide支持加载Gif动态图,而Picasso不支持	
	总体来说, Glide是在Picasso之上的二次开发,各个方面做了不少改进,
	不过这也导致jar包比Picasso大不少,不过也就不到500k，影响不是很大。

# 四、Fresco
https://github.com/facebook/fresco
Fresco是Facebook出品,新一代图片加载库

	Android应用可用内存有限,经常会因为图片加载导致OOM,虽然我们有各种手段去优化，尽量减少出现OOM的可能性，但是永远没法避免，尤其某些低端手机OOM更是严重。
	Facebook另辟蹊径,既然没法在Java层处理,在更底层的Native堆做手脚,于是Fresco将图片放到一个特别的内存区域叫Ashmem区，就是属于Native堆,图片不再占用Java层内存,所以能大大的减少OOM

四个库对比,加载大图Fresco较好,不过Fresco比较庞大,推荐在主要都是图片的app中使用,一般app使用Glide和Picasso