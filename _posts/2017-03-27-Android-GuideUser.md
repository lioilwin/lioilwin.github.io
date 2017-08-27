---
layout: post
title: Android-绘图-半透明图引导用户
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
	
	// 显示半透明引导界面
	// layout1，layout2分别为自定义布局
	// targetView1，targetView2分别为需要高亮的目标控件，Shape.ELLIPSE，Shape.RECTANGULAR是高亮形状
	// Direction.BOTTOM，Direction.TOP分别是layout1，layout2布局相对于targetView1，targetView2的方位
	new GuideUserView(getActivity(),
			new ViewEntity(targetView1, Shape.ELLIPSE, layout1, Direction.BOTTOM),
			new ViewEntity(targetView2, Shape.RECTANGULAR, layout2, Direction.TOP))
			.show();			

```

# 二.GuideUserView类
	
	1.GuideUserView类继承相对布局  	
	2.添加自定义布局mCustomLayout，通过Margins设置mCustomLayout的位置  
	3.用canvas在mTargetView周围绘制高亮圆圈  
	4.用mPaint.setXfermode(xx)去除高亮圆圈和半透明背景的交集  

```java

public class GuideUserView extends RelativeLayout {
    private final static String TAG = "GuideUserView";
    private final static String PREID = "isShowGuideUserView_";
    private String guideID;
    private Context mContent;
    private final Paint mPaint = new Paint();
    private final RectF mRect = new RectF();

    private int mBgColor = 0x88000000; // 半透明背景
    private ViewEntity[] mViews; // 目标View、自定义布局等参数实体数组

    public GuideUserView(Context context, ViewEntity... views) {
        super(context);
        mContent = context;
        mViews = views;
        mPaint.setAntiAlias(true);
        mPaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_OUT)); // 去除两次绘图的交集
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        Log.i(TAG, "onMeasure: " + getMeasuredWidth() + "," + getMeasuredWidth());
    }

    @Override
    protected void onDraw(Canvas canvas) {
        addCustomView();// 添加自定义布局
        canvas.saveLayer(0, 0, getWidth(), getHeight(), null, Canvas.ALL_SAVE_FLAG); // 新建图层
        canvas.drawColor(mBgColor);// 绘制半透明背景
        // 在目标View周围裁剪出高亮圆圈
        for (ViewEntity ve : mViews) {
            if (ve.targetW == 0 || ve.targetH == 0) return;
            if (ve.mShape == ELLIPSE) {
                // 椭圆
                mRect.left = ve.mCenter[0] - ve.targetW;
                mRect.top = ve.mCenter[1] - ve.targetH;
                mRect.right = ve.mCenter[0] + ve.targetW;
                mRect.bottom = ve.mCenter[1] + ve.targetH;
                canvas.drawOval(mRect, mPaint);
            } else if (ve.mShape == RECTANGULAR) {
                // 矩形
                mRect.left = ve.mCenter[0] - ve.targetW;
                mRect.top = ve.mCenter[1] - ve.targetH;
                mRect.right = ve.mCenter[0] + ve.targetW;
                mRect.bottom = ve.mCenter[1] + ve.targetH;
                canvas.drawRoundRect(mRect, 16, 16, mPaint);
            } else {
                // 圆形
                canvas.drawCircle(ve.mCenter[0], ve.mCenter[1], ve.targetW, mPaint);
            }
        }
    }


    /**
     * 在targetView周围添加mCustomGuideView布局，默认在下方
     */
    protected void addCustomView() {
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

            LayoutParams params = (LayoutParams) ve.mCustomLayout.getLayoutParams();
            if (params == null) {
                params = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
            }
            if (ve.mDirection != null) {
                int width = getWidth();
                int height = getHeight();
                int left = ve.mCenter[0] - ve.targetW;
                int right = ve.mCenter[0] + ve.targetW;
                int top = ve.mCenter[1] - ve.targetH;
                int bottom = ve.mCenter[1] + ve.targetH;
                switch (ve.mDirection) {
                    case TOP:
                        params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
                        params.addRule(RelativeLayout.CENTER_HORIZONTAL);
                        params.setMargins(0, -height + top, 0, height - top);
                        break;
                    case LEFT:
                        params.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
                        params.setMargins(width + left, top, width - left, -top);
                        break;
                    case BOTTOM:
                        params.addRule(RelativeLayout.CENTER_HORIZONTAL);
                        params.setMargins(0, bottom, 0, -bottom);
                        break;
                    case RIGHT:
                        params.setMargins(right, top, -right, -top);
                        break;
                    case LEFT_TOP:
                        params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
                        params.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
                        params.setMargins(width + left, -height + top, width - left, height - top);
                        break;
                    case LEFT_BOTTOM:
                        params.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
                        params.setMargins(-width + left, bottom, width - left, -bottom);
                        break;
                    case RIGHT_TOP:
                        params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
                        params.setMargins(right, -height + top, -right, height - top);
                        break;
                    case RIGHT_BOTTOM:
                        params.setMargins(right, bottom, -right, -top);
                        break;
                }
            } else {
                params.addRule(RelativeLayout.CENTER_IN_PARENT);
            }
            ve.mCustomLayout.setX(ve.offsetX);
            ve.mCustomLayout.setY(ve.offsetY);
            // 添加view，但阻止重新布局和重绘
            addViewInLayout(ve.mCustomLayout, -1, params, true);
        }
        // 统一重新布局和重绘
        requestLayout();
        invalidate();
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        hide();
        return super.onTouchEvent(event);
    }

    public void show() {
//        if (mContent.getSharedPreferences(TAG, Context.MODE_PRIVATE)
//                .getBoolean(getUniqId(), false)) return;
//        mContent.getSharedPreferences(TAG, Context.MODE_PRIVATE)
//                .edit().putBoolean(getUniqId(), true).apply();
        setBackgroundColor(Color.TRANSPARENT);
        ((FrameLayout) ((Activity) mContent).getWindow().getDecorView()).addView(this);
    }

    public void hide() {
        removeAllViews();
        ((FrameLayout) ((Activity) mContent).getWindow().getDecorView()).removeView(this);
    }

    private String getUniqId() {
        String id;
        if (mViews[0].mTargetView != null) {
            id = PREID + mViews[0].mTargetView.getId();
        } else {
            id = PREID + guideID;
        }
        return PREID + id;
    }

    public GuideUserView setGuideID(String guideID) {
        this.guideID = guideID;
        return this;
    }

    /**
     * 目标View、自定义布局等参数实体
     */
    public static class ViewEntity {
        private View mTargetView; // 目标wiew
        private int[] mCenter = new int[2]; // 目标wiew中心
        private Shape mShape; // 目标wiew高亮圆圈形状
        private int targetW = -1; // 目标wiew高亮宽半径
        private int targetH = -1; // 目标wiew高亮高半径

        private View mCustomLayout; // 自定义布局
        private Direction mDirection; // 自定义布局相对于mTargetView的方向

        /**
         * 目标wiew中心
         */
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
     * mCustomGuideView相对于targetView的方位,默认在targetView下方
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

简书: http://www.jianshu.com/p/48a078632fd4   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/67006241   
GitHub博客：http://lioil.win/2017/03/27/Android-GuideUser.html   
Coding博客：http://c.lioil.win/2017/03/27/Android-GuideUser.html