---
layout: post
title: HttpURLConnection上传文件
tags: Android
---

```java

String BD = UUID.randomUUID().toString(); // 文件边界

// 1.开启Http连接
HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
conn.setConnectTimeout(10*1000);
conn.setDoOutput(true); // 允许输出

// 2.Http请求头
conn.setRequestMethod("POST");
conn.setRequestProperty("Charset", "utf-8");
conn.setRequestProperty("Content-Type", "multipart/form-data" + ";boundary="+BD);

// 3.Http请求体
DataOutputStream out = new DataOutputStream(conn.getOutputStream());
out.writeUTF("--"+BD+"\r\n"
			+"Content-Disposition: form-data; name=\"file\"; filename=\"filename\"\r\n"
			+"Content-Type: application/octet-stream; charset=utf-8"+"\r\n");
InputStream in = new FileInputStream(file);
byte[] b = new byte[1024];
int l = 0;
while((l = in.read(b)) != -1) out.write(b,0,l); // 写入文件
out.writeUTF("\r\n--"+BD+"--\r\n");
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