---
layout: post
title: 静态网站生成器大总结(Static-Site-Generators)
tags: HtmlXml
---
# 一.介绍
	静态网站生成器到底有多少呢？GitHub用户对静态博客生成程序进行了大规模总结，太多了啊，太恐怖，萌新被吓傻了……
	GitHub地址: https://github.com/pinceladasdaweb/Static-Site-Generators

	我选了jekyll博客, 因为两大代码仓库GitHub(国外)和Coding(国内)都提供免费空间自动构建Jekyll网站！	
	在阿里云买了十年域名, 域名.win太便宜了，没商业价值没人要! 
	我的博客同时部署在GitHub Pages和Coding Pages
	GitHub博客: http://lioil.win
	GitHub博客: http://c.lioil.win
	
	近期发现Coding Pages部署网站大小不能超过100M，
	而还没发现GitHub Pages有大小限制！
	
# 二.在windows安装jekyll	
	1.下载Ruby
		1.1点击安装Ruby
		1.2添加环境变量,输入命令查看版本 ruby -v
	
	2.下载RubyDevKit,模拟Linux的gcc编译
		2.1点击安装RubyDevKit
		2.2在config.yml文件加入Ruby安装目录
			- xx\xx\Ruby		
		2.3初始化命令
			ruby dk.rb init
			ruby dk.rb install
		
	3.输入Jekyll安装命令(需联网下载软件)
		3.1换镜像源 gem sources --add http://gems.ruby-china.org --remove https://rubygems.org		
		3.2安装 gem install jekyll	
		3.3安装 gem install jekyll-sitemap
		
		查看镜像源 gem sources -l
		查看已安装软件 gem list
		查询远程软件库 gem query –r 软件名
		
	4.生成和运行网站命令
		4.1生成网站模板	jekyll new mysite	
		4.2运行网站
			cd mysite
			jekyll s
				
		在_posts中存放文章,输入命令jekyll s
		在浏览器打开http://127.0.0.1:4000,查看网站
		下划线开头文件夹会被jekyll编译成html和css,其它文件夹保持原样
				
	注意：
		因为众所周知原因,国外镜像源经常不可用,一定要将RubyGems镜像源改为国内的！
		网上流传淘宝的镜像源已经不可用,我被坑了很久啊,血泪的教训啊！
		花了很多时间才在Ruby中文社区找到新镜像源https://gems.ruby-china.org
		
# 三.在GitHub或Coding部署jekyll网站
	1.注册登陆GitHub 或Coding网站
	2.创建代码仓库
	3.找到GitHub Pages 或GitHub Pages设置,可以添加自己域名
	4.把本地jekyll网站上传到代码仓库,GitHub 或Coding都会默认用jekyll工具生成网站