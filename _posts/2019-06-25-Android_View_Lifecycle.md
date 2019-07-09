---
layout: post
title: Android-View-生命周期
tags: Android
---
## View生命周期
	onFinishInflate            View布局解析完成（Activity.onCreate执行时调用）
	onAttachedToWindow         View添加到Window中
	onWindowVisibilityChanged  Window可见性
	onVisibilityChanged        View可见性
	onMeasure                  测量View尺寸（Activity.onResume执行后才开始View绘制）
	onSizeChanged              View大小改变
	onLayout                   布局View位置
	onDraw                     绘制View内容
	onWindowFocusChanged       Window焦点
	onWindowVisibilityChanged  Window可见性
	onVisibilityChanged        View可见性
	onDetachedFromWindow       Window中移除View
	
	public class MyView extends View
	{
		@Override
		protected void onFinishInflate()
		{
			super.onFinishInflate();
			Log.d(TAG, "onFinishInflate: ");
		}

		@Override
		protected void onAttachedToWindow()
		{
			super.onAttachedToWindow();
			Log.d(TAG, "onAttachedToWindow: ");
		}

		@Override
		protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec)
		{
			super.onMeasure(widthMeasureSpec, heightMeasureSpec);
			Log.d(TAG, "onMeasure: " + getMeasuredWidth() + "," + getMeasuredHeight() + "," + getWidth() + ", " + getHeight());
		}

		@Override
		protected void onSizeChanged(int w, int h, int oldw, int oldh)
		{
			super.onSizeChanged(w, h, oldw, oldh);
			Log.d(TAG, "onSizeChanged: " + w + "," + h + "," + oldw + "," + oldh);
		}

		@Override
		protected void onLayout(boolean changed, int left, int top, int right, int bottom)
		{
			super.onLayout(changed, left, top, right, bottom);
			Log.d(TAG, "onLayout: " + changed + "," + left + "," + top + "," + right + "," + bottom);
		}

		@Override
		protected void onDraw(Canvas canvas)
		{
			super.onDraw(canvas);
			Log.d(TAG, "onDraw: ");
		}

		@Override
		protected void onDetachedFromWindow()
		{
			super.onDetachedFromWindow();
			Log.d(TAG, "onDetachedFromWindow: ");
		}			

		@Override
		public void onWindowFocusChanged(boolean hasWindowFocus)
		{
			super.onWindowFocusChanged(hasWindowFocus);
			Log.d(TAG, "onWindowFocusChanged: " + hasWindowFocus);
		}

		@Override
		protected void onWindowVisibilityChanged(int visibility)
		{
			super.onWindowVisibilityChanged(visibility);
			Log.d(TAG, "onWindowVisibilityChanged: " + visibility);
		}

		@Override
		protected void onVisibilityChanged(View changedView, int visibility)
		{
			super.onVisibilityChanged(changedView, visibility);
			Log.d(TAG, "onVisibilityChanged: " + (changedView == this) + ", " + visibility);
		}
	}