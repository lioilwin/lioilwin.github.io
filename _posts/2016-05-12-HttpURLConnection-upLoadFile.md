---
layout: post
title: JavaSE-HttpURLConnection上传文件
tags: JavaSE
---
## 一.Http文件上传格式

```html

Html表单文件上传:
	<form 
		action="${pageContext.request.contextPath}/UploadServlet" 
		method="POST"
		enctype="multipart/form-data">				
			<input type="file" name="testFile" />
			<input type="submit" value="上传"/>
	</form>

Http请求post格式:
	POST /xxx HTTP/1.1
	Host: x.x.x
	Content-Length: xxxxxx
	Content-Type: multipart/form-data; boundary=BoundarybXA7KWbsgAx0OB7z
	
	--BoundarybXA7KWbsgAx0OB7z  (\r\n)
	Content-Disposition: form-data; name="testFile"; filename="文件XXX.zip"  (\r\n)
	Content-Type: application/octet-stream  (\r\n)
	(\r\n)
	...文件内容...  (\r\n)
	--BoundarybXA7KWbsgAx0OB7z--  (\r\n)

```

## 二.Java-HttpURLConnection

```java

String Boundary = UUID.randomUUID().toString(); // 文件边界

// 1.开启Http连接
HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
conn.setConnectTimeout(10*1000);
conn.setDoOutput(true); // 允许输出

// 2.Http请求行/头
conn.setRequestMethod("POST");
conn.setRequestProperty("Charset", "utf-8");
conn.setRequestProperty("Content-Type", "multipart/form-data; boundary="+Boundary);

// 3.Http请求体
DataOutputStream out = new DataOutputStream(conn.getOutputStream());
out.writeUTF("--"+Boundary+"\r\n"
			+"Content-Disposition: form-data; name=\"file\"; filename=\"filename\"\r\n"
			+"Content-Type: application/octet-stream; charset=utf-8"+"\r\n\r\n");
InputStream in = new FileInputStream(file);
byte[] b = new byte[1024];
int l = 0;
while((l = in.read(b)) != -1) out.write(b,0,l); // 写入文件
out.writeUTF("\r\n--"+Boundary+"--\r\n");
out.flush();
out.close();
in.close();

// 4.Http响应
BufferedReader bf = new BufferedReader(new InputStreamReader(conn.getInputStream(),"utf-8"));
String line = null;
while ((line=bf.readLine())!=null) {
	System.out.println(line);
}

```

简书: http://www.jianshu.com/p/6420017756fb   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/77073415   
GitHub博客: http://lioil.win/2016/05/12/HttpURLConnection-upLoadFile.html   
Coding博客: http://c.lioil.win/2016/05/12/HttpURLConnection-upLoadFile.html