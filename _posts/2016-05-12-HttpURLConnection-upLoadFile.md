---
layout: post
title: HttpURLConnection上传文件
tags: Android
---

HttpURLConnection上传文件

```java

private String uploadFile(File file, String RequestURL) {
		int TIME_OUT = 10 * 1000; // 超时时间
		String CHARSET = "utf-8"; // 设置编码
		String result = null;
		String BOUNDARY = UUID.randomUUID().toString(); // 边界标识 随机生成
		String PREFIX = "--", LINE_END = "\r\n";
		String CONTENT_TYPE = "multipart/form-data"; // 内容类型
		try {
			URL url = new URL(RequestURL);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setReadTimeout(TIME_OUT);
			conn.setConnectTimeout(TIME_OUT);
			conn.setDoInput(true); // 允许输入流
			conn.setDoOutput(true); // 允许输出流
			conn.setUseCaches(false); // 不允许使用缓存
			conn.setRequestMethod("POST"); // 请求方式
			conn.setRequestProperty("Charset", CHARSET); // 设置编码
			conn.setRequestProperty("connection", "keep-alive");
			conn.setRequestProperty("Content-Type", CONTENT_TYPE + ";boundary=" + BOUNDARY);

			if (file != null) {
			
				// dos输出流post请求数据
				DataOutputStream dos = new DataOutputStream(conn.getOutputStream());
				StringBuffer sb = new StringBuffer();
				sb.append(PREFIX);
				sb.append(BOUNDARY);
				sb.append(LINE_END);	
				
				// 网上很多例子没有说清楚这里，服务器所需参数name="", filename=""（等号左边固定，右边填参数）
				sb.append("Content-Disposition: form-data; name=\"upfile\"; filename=\"" + file.getName() + "\"" + LINE_END);				
				sb.append("Content-Type: application/octet-stream; charset=" + CHARSET + LINE_END);
				sb.append(LINE_END);
				
				// dos输出流加入文件开始边界
				dos.write(sb.toString().getBytes());
				
				// dos输出流加入文件原始二进制数据
				InputStream is = new FileInputStream(file);
				byte[] bytes = new byte[1024];
				int len = 0;
				while ((len = is.read(bytes)) != -1) {
					dos.write(bytes, 0, len);
				}
				is.close();
				dos.write(LINE_END.getBytes());
				byte[] end_data = (PREFIX + BOUNDARY + PREFIX + LINE_END).getBytes();
				
				// dos输出流加入文件结束边界
				dos.write(end_data);
				dos.flush();

				// 获取响应码 200=成功 当响应成功，获取响应的流
				int res = conn.getResponseCode();
				Log.d(TAG, "---ResponseCode:" + res);
				
				// 输入流返回响应数据; 编码utf-8, 以防乱码
				BufferedReader buffR = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
				StringBuffer sb1 = new StringBuffer();
				String line = "";
				while ((line = buffR.readLine()) != null) {
					sb1.append(line);
				}
				
				result = sb1.toString();
				Log.d(TAG, "---result : " + result);
			}
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return result;
		
```