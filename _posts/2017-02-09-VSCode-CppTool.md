---
layout: post
title: VSCode编译调试C/C++
tags: C
---
	记录在Windows中使用VSCode编译调试C/C++

## 1.下载C/C++编译工具MinGW
	在Windows中配置MinGW的环境变量[path]

## 2.在VSCode中安装cpptools插件

## 3.配置MinGW编译工具g++命令
	1).在VSCode中按F1,输入configure Task Runner,进入选择others,配置tasks.json
	{
		"version": "0.1.0",
		
		// 使用MinGW的g++命令编译(必须配置MinGW环境变量)
		"command": "g++",
		
		// 配置g++命令参数, ${file}表示当前打开的源码, 
		// ${fileBasenameNoExtension}.exe表示当前源码编译后的文件
		"args": ["-g", "${file}", "-o", "${fileBasenameNoExtension}.exe"],
		
		"isShellCommand": true,
		"showOutput": "always",
	}
	2).在当前源码文件中,按Ctr+Shift+B,即可编译当前源码

## 4.配置MinGW调试工具GDB路径	
	1).在VSCode中按F5,选择C++(GDB/LLDB),配置launch.json
	{
		"version": "0.2.0",
		"configurations": [{
			...
			...
			
			// 预先使用tasks.json命令编译源码
			"preLaunchTask": "g++",
			
			// 当前打开的源码编译后的路径
			"program": "${workspaceRoot}/${fileBasenameNoExtension}.exe",
			
			// MinGW的调试工具路径
			"miDebuggerPath": "D:/MinGW/bin/gdb.exe",
			
			...
			...
		}]
	}
	2).在当前源码文件中,添加断点,按F5,即可调试当前源码