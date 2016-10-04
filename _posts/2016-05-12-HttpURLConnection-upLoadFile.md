---
layout: post
title: HttpURLConnection上传文件
tags: Android
---

```java
String PREFIX = "--";
String BOUNDARY = UUID.randomUUID().toString(); // 文件边界
String LINE_END = "\r\n";
String CONTENT_TYPE = "multipart/form-data"; // 类型
int TIME_OUT = 10 * 1000; // 超时
String CHARSET = "utf-8"; // 编码
////////////////////建立Http连接///////////////////////////////////////////////////
HttpURLConnection httpConn = (HttpURLConnection) new URL(url).openConnection();
httpConn.setReadTimeout(TIME_OUT);
httpConn.setConnectTimeout(TIME_OUT);
httpConn.setDoInput(true); // 允许输入流
httpConn.setDoOutput(true); // 允许输出流
httpConn.setUseCaches(false); // 不允许使用缓存
httpConn.setRequestMethod("POST"); // 请求方式
httpConn.setRequestProperty("Charset", CHARSET); // 编码
httpConn.setRequestProperty("connection", "keep-alive");
httpConn.setRequestProperty("Content-Type", CONTENT_TYPE + ";boundary=" + BOUNDARY);
////////////////////Http上传文件////////////////////////////////////////////////////////
DataOutputStream httpOut = new DataOutputStream(conn.getOutputStream());
httpOut.write((PREFIX+BOUNDARY+LINE_END+"Content-Disposition: form-data; name=\"upfile\"; filename=\"" + file.getName() + "\"" + LINE_END).getBytes()); // 服务器所需文件参数name="", filename=""
httpOut.write(("Content-Type: application/octet-stream; charset=" + CHARSET + LINE_END + LINE_END).getBytes());
InputStream fileIn = new FileInputStream(file);
byte[] bytes = new byte[1024];
int len = 0;
while ((len = fileIn.read(bytes)) != -1)
	httpOut.write(bytes, 0, len);// 写入文件原始数据
fileIn.flush();
fileIn.close();
httpOut.write((LINE_END+PREFIX + BOUNDARY + PREFIX + LINE_END).getBytes());
httpOut.flush();
httpOut.close();
////////////////////获取Http结果//////////////////////////////////////////////////////
BufferedReader httpIn = new BufferedReader(new InputStreamReader(conn.getInputStream(), CHARSET));// utf-8以防乱码
StringBuffer result = new StringBuffer();
String line = null;
while ((line = httpIn.readLine()) != null) {
	result.append(line);
}
```