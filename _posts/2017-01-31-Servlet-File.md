---
layout: post
title: Servlet-文件上传和下载
tags: JavaEE
---
# 一、文件上传

## 1.文件上传表单(Html)
		<form action="${pageContext.request.contextPath}/UploadServlet" 
			method="POST" enctype="multipart/form-data">
			描述信息<input type="text" name="desc"/>
				<input type="file" name="file1" />
				<input type="file" name="file2" />
				<input type="submit" value="上传"/>
		</form>

	Http请求:
		POST /xxurl HTTP/1.1
		Host: xxx.xx
		Content-Length: 9631091
		Content-Type: multipart/form-data; boundary=------PartBoundary

		------PartBoundary
		Content-Disposition: form-data; name="desc"

		两个壁纸压缩包
		------PartBoundary
		Content-Disposition: form-data; name="file1"; filename="壁纸1.zip"
		Content-Type: application/octet-stream

		......
		------PartBoundary
		Content-Disposition: form-data; name="file2"; filename="壁纸2.zip"
		Content-Type: application/octet-stream

		......
		------PartBoundary--

## 2.Servlet文件上传

### 方法一.使用Servlet3.0规范接口	
	@MultipartConfig(
		fileSizeThreshold=(可选), 内存缓冲区大小
		location=(可选), 临时文件目录,调用Part.write(..)会自动清除临时文件
		maxFileSize=(可选), 单个文件最大值, 超过则抛出IllegalStateException异常
		maxRequestSize=(可选) 总上传的最大值, 超过则抛出IllegalStateException异常
					)
	public class UploadServlet extends HttpServlet {
		protected void doGet(HttpServletRequest request, HttpServletResponse response){
			Collection<Part> part = request.getParts();
			for (Part p : part) {
				if (p.getSubmittedFileName() == null) {
					// 非文件Part
					StringBuilder value = new StringBuilder();
					BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream(), "utf-8"));
					String line;
					while ((line = br.readLine()) != null) {
						value.append(line);
					}
					System.out.println(p.getName() + ": " + value.toString());
				} else {
					// 文件Part
					String uuidName = UUID.randomUUID().toString() + "_" + p.getSubmittedFileName();
					//  参数是绝对路径+文件名,若只传文件名,则存储在location=目录
					p.write(getServletContext().getRealPath("/WEB-INF/upload")+uuidName);
				}		
			}
		}
	}
		
### 方法二.使用Apache-commons-fileupload开源工具
	commons-fileupload和commons-io两个包,fileupload依赖io包	
	public class UploadServlet extends HttpServlet {
		protected void doGet(HttpServletRequest request, HttpServletResponse response){
			if (!ServletFileUpload.isMultipartContent(request)) {
				throw new RuntimeException("请用Multipart表单上传!");
			}
			// 1.创建ServletFileUpload,设定内存缓冲区大小(默认10k),设定临时文件目录(默认操作系统临时目录)
			DiskFileItemFactory factory = new DiskFileItemFactory(100*1024,new File(xx/temp));
			ServletFileUpload fileUpload = new ServletFileUpload(factory);
			fileUpload.setFileSizeMax(1024*1024*10); // 单个文件不大于10M
			fileUpload.setSizeMax(1024*1024*100); // 总大小不大于100M
			fileUpload.setHeaderEncoding("utf-8"); // 设置编码集

			// 2.监听文件上传进度
			fileUpload.setProgressListener(new ProgressListener(){
				public void update(long bytesRead, long contentLength, int items) {
					System.out.print("当前是第" + items + "个上传项, 总大小" + length/1024f + "KB, 已经读取" + read/1024f+ "KB");		
					System.out.println();
				}
			});

			// 4.获取所有FileItem
			for (FileItem fileItem : (List<FileItem>) fileUpload.parseRequest(request)) {
				if (fileItem.isFormField()) {
					// 字符项
					String name = fileItem.getFieldName();
					String value = fileItem.getString("utf-8");
					System.out.println(name + ":" + value);
				} else {
					// 文件项
					String uuidName = UUID.randomUUID().toString() + "_" + fileItem.getName();					
					// 生成随机目录path(目录分离)
					char[] hashPath = Integer.toHexString(uuidName.hashCode()).toCharArray();
					String path = getServletContext().getRealPath("WEB-INF/upload");
					for (char p : hashPath)	path += "/" + p;
					new File(path).mkdirs();
					// 存储文件
					InputStream in = fileItem.getInputStream();
					OutputStream out = new FileOutputStream(new File(path, uuidName));
					byte[] b = new byte[100*1024];
					int len;
					while ((len=in.read(b))!=-1) {
						out.write(b, 0, len);
					}
					// 删除临时文件
					fileItem.delete();
				}
			}
		}
	}
	
# 二、文件下载
	// Http响应头,要求浏览器以附件形式打开
	response.setHeader("Content-Disposition", "attachment;filename="+URLEncoder.encode(filename,"utf-8"));
	// MIME类型
	response.setContentType(getServletContext().getMimeType(filename));