---
layout: post
title: Android-SurfaceView示例
tags: Android
---

```java

public class MySurfaceView extends SurfaceView implements SurfaceHolder.Callback {
	/* 
		SurfaceView功能简述:
		1.Provide a dedicated drawing surface embedded inside of a view hierarchy.
		2.Provide a surface in which a secondary thread can render in to the screen.
		
		SurfaceView注意事项:
		1.All SurfaceView and SurfaceHolder.Callback methods will be called from the UI thread.       
		2.Drawing thread only touches the underlying Surface between SurfaceHolder.Callback.surfaceCreated() 
		and SurfaceHolder.Callback.surfaceDestroyed().
	*/

	private SurfaceHolder holder;
	private RenderThread renderThread; // 渲染绘制线程
	private boolean isRender;          // 控制线程

	public MySurfaceView(Context context) {
		super(context);
		holder = this.getHolder();
		holder.addCallback(this);
		renderThread = new RenderThread();
	}

	@Override
	public void surfaceCreated(SurfaceHolder holder) {
		isRender = true;
		renderThread.start();
	}

	@Override
	public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {
	}

	@Override
	public void surfaceDestroyed(SurfaceHolder holder) {
		isRender = false;
	}

	private class RenderThread extends Thread {
		@Override
		public void run() {
			// 死循环绘制线程
			while (isRender) {
				long startTime = System.currentTimeMillis();
				
				Canvas canvas = null;
				try {
					// 1.锁定Canvas
					canvas = holder.lockCanvas();
					// 2.通过canvas绘制图形
					canvas.drawXX(...);
					
				} catch (Exception e) {									
					e.printStackTrace();
				} finally {
					// 3.解锁Canvas,把图形更新到屏幕
					if (canvas != null)
						holder.unlockCanvasAndPost(canvas);					
				}
				
				long endTime = System.currentTimeMillis();
				
				// 性能评定: 每秒绘制次数(帧率FPS), 动画流畅：FPS>=30
				int fps = 1000/(endTime-startTime) 
			}
		}
	}
}

```

CSDN博客: http://blog.csdn.net/qq_32115439/article/details/76223216   
GitHub博客: http://lioil.win/2017/07/27/Android-SurfaceView.html   
Coding博客: http://c.lioil.win/2017/07/27/Android-SurfaceView.html