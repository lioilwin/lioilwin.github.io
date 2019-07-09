---
layout: post
title: Android-RecyclerView分割线(水平/垂直/网格)
tags: Android
---
## RecyclerView分割线
	// 设置水平分割线
	rv.setLayoutManager(new LinearLayoutManager(cxt));
	rv.addItemDecoration(new GridItemDecoration(1, 0, cxt.getResources().getColor(R.color.gray_dim), true));

	// 设置3列网格分割线
	recyclerView.setLayoutManager(new GridLayoutManager(context, 3));
	recyclerView.addItemDecoration(new GridItemDecoration(1, 1, mAct.getResources().getColor(R.color.gray_dim), true)); 

	public class GridItemDecoration extends RecyclerView.ItemDecoration
	{
		private int mHorizonLineWidth;
		private int mVerticalLineWidth;
		private Drawable mDividerDrawable;
		private boolean isDrawLastLine;

		/**
		 * 构造分割线
		 *
		 * @param horizonLineWidth  水平分割线宽
		 * @param verticalLineWidth 垂直分割线宽
		 * @param dividerColor      分割线颜色
		 * @param isDrawLastLine    是否绘制最后一行分割线
		 */
		public GridItemDecoration(int horizonLineWidth, int verticalLineWidth, int dividerColor, boolean isDrawLastLine)
		{
			this.mHorizonLineWidth = horizonLineWidth;
			this.mVerticalLineWidth = verticalLineWidth;
			this.isDrawLastLine = isDrawLastLine;
			this.mDividerDrawable = new ColorDrawable(dividerColor);
		}

		@Override
		public void onDrawOver(Canvas c, RecyclerView parent, RecyclerView.State state)
		{
			// drawHorizontal
			int childCount = parent.getChildCount();
			for (int i = 0; i < childCount; i++)
			{
				View child = parent.getChildAt(i);
				if (!isDrawLastLine && isLastRaw(parent, i, getSpanCount(parent), childCount))
					continue;
				RecyclerView.LayoutParams params = (RecyclerView.LayoutParams) child.getLayoutParams();
				final int left = child.getLeft() - params.leftMargin;
				final int right = child.getRight() + params.rightMargin;
				final int top = child.getBottom() + params.bottomMargin;
				final int bottom = top + mHorizonLineWidth;
				mDividerDrawable.setBounds(left, top, right, bottom);
				mDividerDrawable.draw(c);
			}

			// drawVertical
			int childCount1 = parent.getChildCount();
			for (int i = 0; i < childCount1; i++)
			{
				final View child = parent.getChildAt(i);
				if ((parent.getChildViewHolder(child).getAdapterPosition() + 1) % getSpanCount(parent) == 0)
					continue;
				final RecyclerView.LayoutParams params = (RecyclerView.LayoutParams) child.getLayoutParams();
				final int top = child.getTop() - params.topMargin;
				final int bottom = child.getBottom() + params.bottomMargin + mHorizonLineWidth;
				final int left = child.getRight() + params.rightMargin;
				int right = left + mVerticalLineWidth;
				mDividerDrawable.setBounds(left, top, right, bottom);
				mDividerDrawable.draw(c);
			}
		}

		@Override
		public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state)
		{
			int spanCount = getSpanCount(parent);
			int childCount = parent.getAdapter().getItemCount();
			int itemPosition = ((RecyclerView.LayoutParams) view.getLayoutParams()).getViewLayoutPosition();
			if (itemPosition < 0)
				return;
			int column = itemPosition % spanCount;
			int bottom;
			int left = column * mVerticalLineWidth / spanCount;
			int right = mVerticalLineWidth - (column + 1) * mVerticalLineWidth / spanCount;
			if (isLastRaw(parent, itemPosition, spanCount, childCount))
				bottom = isDrawLastLine ? mHorizonLineWidth : 0;
			else
				bottom = mHorizonLineWidth;
			outRect.set(left, 0, right, bottom);
		}

		private int getSpanCount(RecyclerView parent)
		{
			int spanCount = -1;
			RecyclerView.LayoutManager layoutManager = parent.getLayoutManager();
			if (layoutManager instanceof GridLayoutManager)
				spanCount = ((GridLayoutManager) layoutManager).getSpanCount();
			else if (layoutManager instanceof StaggeredGridLayoutManager)
				spanCount = ((StaggeredGridLayoutManager) layoutManager).getSpanCount();
			return spanCount;
		}

		private boolean isLastRaw(RecyclerView parent, int pos, int spanCount, int childCount)
		{
			RecyclerView.LayoutManager layoutManager = parent.getLayoutManager();
			if (layoutManager instanceof GridLayoutManager)
			{
				int remainCount = childCount % spanCount;
				if (remainCount == 0)
					return pos >= childCount - spanCount;
				else
					return pos >= childCount - childCount % spanCount;
			}
			else if (layoutManager instanceof StaggeredGridLayoutManager)
			{
				int orientation = ((StaggeredGridLayoutManager) layoutManager).getOrientation();
				if (orientation == StaggeredGridLayoutManager.VERTICAL)
				{
					// 水平滚动
					int remainCount = childCount % spanCount;
					if (remainCount == 0)
						return pos >= childCount - spanCount;
					else
						return pos >= childCount - childCount % spanCount;
				}
				else // 垂直滚动
					return (pos + 1) % spanCount == 0;
			}
			else if (layoutManager instanceof LinearLayoutManager)
			{
				return pos >= parent.getAdapter().getItemCount() - 1;
			}
			return false;
		}
	}