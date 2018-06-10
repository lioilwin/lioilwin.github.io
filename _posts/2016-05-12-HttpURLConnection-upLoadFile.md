---
layout: post
title: Java-HttpURLConnection上传文件
tags: Java
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

public static String upFile(String url, File file) throws Throwable {
	String PREFIX = "--";  // 前缀符
	String BOUNDARY = "*"; // 边界符(任意字符串)
	String CRLF = "\r\n";  // 换行符

	HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
	conn.setChunkedStreamingMode(4 * 1024);// 切换为分块流模式,取消内部缓冲区(默认模式是数据全部写入内存后才开始上传,对于大文件,明显内存不足导致崩溃)
	conn.setConnectTimeout(10 * 1000);
	conn.setDoOutput(true); // 允许输出

	// 1.Http请求行/头
	conn.setRequestMethod("POST");
	conn.setRequestProperty("Connection", "Keep-Alive");
	conn.setRequestProperty("Charset", "UTF-8");
	conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + BOUNDARY);

	// 2.Http请求体
	DataOutputStream out = new DataOutputStream(conn.getOutputStream());
	out.writeUTF(PREFIX + BOUNDARY + CRLF);
	out.writeUTF("Content-Disposition: form-data; name=\"file\"; filename=\"" + file.getName() + "\"" + CRLF);
	out.writeUTF("Content-Type: application/octet-stream" + CRLF);
	out.writeUTF(CRLF);
	InputStream fin = new FileInputStream(file);
	byte[] b = new byte[4 * 1024];
	int len;
	while ((len = fin.read(b)) != -1)
		out.write(b, 0, len); // 写入文件
	fin.close();
	out.writeUTF(CRLF);
	out.writeUTF(PREFIX + BOUNDARY + PREFIX + CRLF);
	out.flush();
	out.close();

	// 3.Http响应
	BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
	StringBuilder result = new StringBuilder();
	String line;
	while ((line = in.readLine()) != null)
		result.append(line);
	in.close();
//  conn.disconnect(); // 断开TCP连接,后续HTTP请求不能重用该连接
	return result.toString();
}

```

简书: http://www.jianshu.com/p/6420017756fb   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/77073415   
GitHub博客: http://lioil.win/2016/05/12/HttpURLConnection-upLoadFile.html   
Coding博客: http://c.lioil.win/2016/05/12/HttpURLConnection-upLoadFile.html