---
layout: post
title: Android绘图-半透明图引导用户
tags: Android
---

一.使用半透明图引导

```java
	
	// 布局1
	TextView tv = new TextView(getActivity());
	tv.setText("yyyyyy");
	tv.setTextColor(Color.WHITE);
	tv.setTextSize(14);
	ImageView iv = new ImageView(getActivity());
	iv.setImageResource(R.drawable.arrow);
	LinearLayout layout1 = new LinearLayout(getActivity());
	layout1.setOrientation(LinearLayout.VERTICAL);
	layout1.addView(iv);
	layout1.addView(tv);
	
	// 布局2
	TextView tv2 = new TextView(getActivity());
	tv2.setText("xxxxxx");
	tv2.setTextColor(Color.WHITE);
	tv2.setTextSize(14);
	ImageView iv2 = new ImageView(getActivity());
	iv2.setImageResource(R.drawable.arrow);
	LinearLayout layout2 = new LinearLayout(getActivity());
	layout2.setOrientation(LinearLayout.VERTICAL);
	layout2.addView(tv2);
	iv2.setRotation(180);
	layout2.addView(iv2);
	
	// 显示半透明界面
	// layout1，layout2分别为自定义布局
	// targetView1，targetView2分别为需要高亮的目标控件，Shape.ELLIPSE，Shape.RECTANGULAR是高亮形状
	// Direction.BOTTOM，Direction.TOP分别是layout1，layout2布局相对于targetView1，targetView2的方位
	new GuideUserView(getActivity(),
			new ViewEntity(targetView1, Shape.ELLIPSE, layout1, Direction.BOTTOM),
			new ViewEntity(targetView2, Shape.RECTANGULAR, layout2, Direction.TOP))
			.show();			

```

二.GuideView类
	1.GuideView类继承相对布局	
	2.添加自定义布局mCustomLayout，通过Margins设置mCustomLayout的位置
	3.用canvas在mTargetView周围绘制高亮圆圈
	4.用mPaint.setXfermode(xx)去除高亮圆圈和半透明背景的交集

```java

public class GuideUserView extends RelativeLayout {
    private final static String TAG = "GuideUserView";
    private final String mPrefixId;
    private Context mContent;
    private final Paint mPaint = new Paint();
    private int mBgColor = 0x88000000; // 半透明背景
    private ViewEntity[] mViews; // 目标View、自定义布局等参数实体数组

    public GuideUserView(Context context, ViewEntity... views) {
        super(context);
        mPrefixId = context.getClass().getName();
        mContent = context;
        mViews = views;
        mPaint.setAntiAlias(true);
        mPaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_OUT)); // 去除两次绘图的交集
    }

    @Override
    protected void onDraw(Canvas canvas) {
        Log.v(TAG, "onDraw");
        if (mViews.length == 0) return;
        addCustomView();// 添加自定义布局
        // 绘制半透明和高亮提示
        canvas.saveLayer(0, 0, getWidth(), getHeight(), null, Canvas.ALL_SAVE_FLAG); // 新建图层
        canvas.drawColor(mBgColor); // 绘制半透明背景
        for (ViewEntity ve : mViews) {
            if (ve.targetW == 0 || ve.targetH == 0) return;
            if (ve.mShape == null || ve.mShape == CIRCULAR) {
                canvas.drawCircle(ve.mCenter[0], ve.mCenter[1], ve.targetW, mPaint); // 绘制圆形
            } else {
                RectF rect = new RectF();
                switch (ve.mShape) {
                    case ELLIPSE: // 椭圆
                        rect.left = ve.mCenter[0] - ve.targetW;
                        rect.top = ve.mCenter[1] - ve.targetH;
                        rect.right = ve.mCenter[0] + ve.targetW;
                        rect.bottom = ve.mCenter[1] + ve.targetH;
                        canvas.drawOval(rect, mPaint);
                        break;
                    case RECTANGULAR: // 圆角矩形
                        rect.left = ve.mCenter[0] - ve.targetW;
                        rect.top = ve.mCenter[1] - ve.targetH;
                        rect.right = ve.mCenter[0] + ve.targetW;
                        rect.bottom = ve.mCenter[1] + ve.targetH;
                        canvas.drawRoundRect(rect, 16, 16, mPaint);
                        break;
                }
            }
        }
    }

    /**
     * 在targetView周围添加mCustomGuideView布局，默认在下方
     */
    protected void addCustomView() {
        Log.v(TAG, "addCustomView");
        for (ViewEntity ve : mViews) {
            if (ve.mCustomLayout.getParent() != null || ve.mCustomLayout == null) return;
            // 获取targetView的中心坐标
            if (ve.mTargetView != null) {
                ve.targetW = ve.mTargetView.getWidth() / 2;
                ve.targetH = ve.mTargetView.getHeight() / 2;
                ve.mTargetView.getLocationInWindow(ve.mCenter);
                ve.mCenter[0] += ve.targetW;
                ve.mCenter[1] += ve.targetH;
            }

            LayoutParams layoutParams = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
            if (ve.mDirection != null) {
                int width = getWidth();
                int height = getHeight();
                int left = ve.mCenter[0] - ve.targetW;
                int right = ve.mCenter[0] + ve.targetW;
                int top = ve.mCenter[1] - ve.targetH;
                int bottom = ve.mCenter[1] + ve.targetH;
                switch (ve.mDirection) {
                    case TOP:
                        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
                        layoutParams.addRule(RelativeLayout.CENTER_HORIZONTAL);
                        layoutParams.setMargins(ve.offsetX, ve.offsetY - height + top, -ve.offsetX, height - top - ve.offsetY);
                        break;
                    case LEFT:
                        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
                        layoutParams.setMargins(ve.offsetX - width + left, top + ve.offsetY, width - left - ve.offsetX, -top - ve.offsetY);
                        break;
                    case BOTTOM:
                        layoutParams.addRule(RelativeLayout.CENTER_HORIZONTAL);
                        layoutParams.setMargins(ve.offsetX, bottom + ve.offsetY, -ve.offsetX, -bottom - ve.offsetY);
                        break;
                    case RIGHT:
                        layoutParams.setMargins(right + ve.offsetX, top + ve.offsetY, -right - ve.offsetX, -top - ve.offsetY);
                        break;
                    case LEFT_TOP:
                        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
                        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
                        layoutParams.setMargins(ve.offsetX - width + left, ve.offsetY - height + top, width - left - ve.offsetX, height - top - ve.offsetY);
                        break;
                    case LEFT_BOTTOM:
                        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
                        layoutParams.setMargins(ve.offsetX - width + left, bottom + ve.offsetY, width - left - ve.offsetX, -bottom - ve.offsetY);
                        break;
                    case RIGHT_TOP:
                        layoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
                        layoutParams.setMargins(right + ve.offsetX, ve.offsetY - height + top, -right - ve.offsetX, height - top - ve.offsetY);
                        break;
                    case RIGHT_BOTTOM:
                        layoutParams.setMargins(right + ve.offsetX, bottom + ve.offsetY, -right - ve.offsetX, -top - ve.offsetY);
                        break;
                }
            } else {
                layoutParams.addRule(RelativeLayout.CENTER_IN_PARENT);
            }
            addViewInLayout(ve.mCustomLayout, -1, layoutParams, true);
        }
        requestLayout();
        invalidate();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        hide();
        return super.onTouchEvent(event);
    }

    public void show() {
        Log.v(TAG, "show");
//        if (mTargetView == null || mContent.getSharedPreferences(TAG, Context.MODE_PRIVATE).getBoolean(getUniqId(mTargetView), false)) {
//            return;
//        }
//        mContent.getSharedPreferences(TAG, Context.MODE_PRIVATE).edit().putBoolean(getUniqId(mTargetView), true).apply();
        setBackgroundColor(Color.TRANSPARENT);
        ((FrameLayout) ((Activity) mContent).getWindow().getDecorView()).addView(this);
    }

    public void hide() {
        Log.v(TAG, "hide");
        removeAllViews();
        ((FrameLayout) ((Activity) mContent).getWindow().getDecorView()).removeView(this);
    }

    public GuideUserView setBgColor(int bgColor) {
        mBgColor = bgColor;
        return this;
    }

    private String getUniqId(View v) {
        return mPrefixId + v.getId();
    }

    /**
     * 目标View、自定义布局等参数实体
     */
    public static class ViewEntity {
        private View mTargetView; // 目标wiew
        private int[] mCenter = new int[2]; // 目标wiew中心
        private Shape mShape; // 目标wiew高亮圆圈形状
        private int targetW = -1; // 目标wiew高亮宽
        private int targetH = -1; // 目标wiew高亮高

        private View mCustomLayout; // 自定义布局
        private Direction mDirection; // 自定义布局相对于mTargetView的方向

        public ViewEntity setCenter(int... mCenter) {
            this.mCenter = mCenter;
            return this;
        }

        /**
         * 目标wiew高亮圆圈尺寸
         */
        public ViewEntity setTargetSize(int... targetSize) {
            targetW = targetSize[0] / 2;
            targetH = targetSize[1] / 2;
            return this;
        }

        public ViewEntity setOffsetX(int offsetX) {
            this.offsetX = offsetX;
            return this;
        }

        public ViewEntity setOffsetY(int offsetY) {
            this.offsetY = offsetY;
            return this;
        }

        private int offsetX = 0, offsetY = 0; // 自定义布局偏移

        public ViewEntity(View mTargetView, Shape mShape, View mCustomLayout, Direction mDirection) {
            this.mTargetView = mTargetView;
            this.mShape = mShape;
            this.mCustomLayout = mCustomLayout;
            this.mDirection = mDirection;
        }
    }

    /**
     * mCustomGuideView相对于targetView的方位，默认在targetView下方
     */
    public enum Direction {
        LEFT, TOP, RIGHT, BOTTOM,
        LEFT_TOP, LEFT_BOTTOM,
        RIGHT_TOP, RIGHT_BOTTOM
    }

    /**
     * targetView高亮圆圈形状，圆形，椭圆，圆角矩形，默认是圆形
     */
    public enum Shape {
        CIRCULAR, ELLIPSE, RECTANGULAR
    }
}

```