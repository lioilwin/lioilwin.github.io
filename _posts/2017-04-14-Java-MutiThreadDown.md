---
layout: post
title: JavaSE-Http断点/多线程下载文件
tags: JavaSE
---

```java

public class MutiThreadDownload {
	public void download(String url, String filePath){	
		int threadCount = 5; // 下载线程数
		long blocksize; // 每线程下载区块大小
		int runningThreadCount; // 正运行线程数
	
		HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
		int code = conn.getResponseCode();
		if (code == 200) {
			long size = conn.getContentLength();// 文件大小	
			blocksize = size / threadCount;
			// 1.创建RandomAccessFile文件(可以随机访问)		
			RandomAccessFile raf = new RandomAccessFile(new File(filePath), "rw");
			raf.setLength(size);
			// 2.多线程下载对应区块
			runningThreadCount = threadCount;
			for (int i = 1; i <= threadCount; i++) {
				long startIndex = (i - 1) * blocksize;
				long endIndex = i * blocksize - 1;
				if (i == threadCount) {				
					endIndex = size - 1;
				}			
				new DownloadThread(i, url, startIndex, endIndex).start();
			}
		}
		conn.disconnect();
	}

	private class DownloadThread extends Thread {
		private int id;
		private String url;
		private long startIndex;
		private long endIndex;

		public DownloadThread(int id, String url, String filePath, long startIndex, long endIndex) {
			this.id = id;
			this.url = url;			
			this.startIndex = startIndex;
			this.endIndex = endIndex;
		}

		@Override
		public void run() {
			try {						
				HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
				conn.setRequestMethod("GET");
				
				// 1.读取文件断点位置curIndex
				int curIndex = 0;
				File indexFile = new File("indexFile_"+id);
				if (indexFile.exists() && indexFile.length() > 0) {
					FileInputStream fis = new FileInputStream(indexFile);
					BufferedReader br = new BufferedReader(new InputStreamReader(fis));					
					curIndex = Integer.valueOf(br.readLine());			
					startIndex += curIndex;				
					fis.close();
				}
					
				// 2.从startIndex位置下载文件, 并从startIndex位置写入raf文件
				conn.setRequestProperty("Range", "bytes=" + startIndex + "-" + endIndex);			
				InputStream is = conn.getInputStream();				
				RandomAccessFile raf = new RandomAccessFile(new File(filePath), "rw");							
				raf.seek(startIndex);
				int len = 0;
				byte[] buffer = new byte[1024*1024];				
				while ((len = is.read(buffer)) != -1) {					
					raf.write(buffer, 0, len);
					// 更新断点位置
					RandomAccessFile indexRaf = new RandomAccessFile(indexFile, "rwd");
					curIndex += len;
					indexRaf.write(String.valueOf(curIndex).getBytes());
					indexRaf.close();
				}
				is.close();
				raf.close();				
			} catch (Exception e) {
				e.printStackTrace();
			} finally {
				// 3.所有线程下载完,删除断点位置文件indexFile
				synchronized (MutiThreadDownload.class){
					if (--runningThreadCount == 0) {
						for (int i = 1; i <= threadCount; i++) new File("indexFile_"+i).delete();						
					}
				}
			}
		}
	}
}

```

简书: http://www.jianshu.com/p/cb8fab446acd   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/70180205   
GitHub博客：http://lioil.win/2017/04/14/Java-MutiThreadDown.html   
Coding博客：http://c.lioil.win/2017/04/14/Java-MutiThreadDown.html