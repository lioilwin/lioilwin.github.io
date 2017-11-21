---
layout: post
title: Android-绘图-半透明/蒙层引导用户
tags: Android
---
## 一.使用半透明图引导

```java
	
// 同时添加两个目标View，即同一层图两个高亮目标View
GuideUserView.show(MainActivity.this,
	new ViewEntity(目标View1, R.layout.guide1, Direction.BOTTOM),
	new ViewEntity(目标View2, R.layout.guide2, Direction.BOTTOM));
	
// 自定义布局guide1.xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:orientation="vertical">
    <View
        android:layout_width="64dp"
        android:layout_height="64dp"
        android:background="@drawable/arrow"/>

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="使用说明"/>
</LinearLayout>

```

## 二.GuideUserView类	
	1.GuideUserView类继承相对布局  	
	2.添加自定义布局mCustomLayout，通过Margins设置mCustomLayout的位置  
	3.用canvas在mTargetView周围绘制高亮圆圈  
	4.用mPaint.setXfermode(xx)去除高亮圆圈和半透明背景的交集  

```java

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.RectF;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import static com.wellcell.view.GuideUserView.Shape.CIRCULAR;
import static com.wellcell.view.GuideUserView.Shape.ELLIPSE;
import static com.wellcell.view.GuideUserView.Shape.RECTANGULAR;

@SuppressLint("ViewConstructor")
public class GuideUserView extends RelativeLayout implements ViewTreeObserver.OnGlobalLayoutListener {
    private final static String TAG = "GuideUserView";
    private final static String PRI = "GuideUserViewID_";
    private final ClickListener mClickListener;
    private Context mContent;
    private final Paint mPaint = new Paint();
    private final RectF mRect = new RectF();
    private ViewEntity[] mViews; // 目标View、自定义布局等参数实体数组
    private boolean handleTouch = false;

    /**
     * 默认显示一次
     */
    public static void show(Context context, ViewEntity... views) {
        GuideUserView.show(true, null, context, views);
    }

    /**
     * 默认显示一次，监听点击
     */
    public static void show(ClickListener clickListener, Context context, ViewEntity... views) {
        GuideUserView.show(true, clickListener, context, views);
    }

    public static void show(boolean showOne, ClickListener clickListener, Context context, ViewEntity... views) {
        try {
            if (showOne) {
                String id = PRI + views[0].mCustomLayoutID;
                if (context.getSharedPreferences(TAG, Context.MODE_PRIVATE).getBoolean(id, false))
                    return;
                context.getSharedPreferences(TAG, Context.MODE_PRIVATE).edit().putBoolean(id, true).apply();
            }
            new GuideUserView(context, clickListener, views);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private GuideUserView(Context context, ClickListener clickListener, ViewEntity... views) {
        super(context);
        mContent = context;
        mClickListener = clickListener;
        mViews = views;
        mPaint.setAntiAlias(true);
        mPaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.DST_OUT)); // 去除两次绘图的交集
        setBackgroundColor(Color.TRANSPARENT);
        getViewTreeObserver().addOnGlobalLayoutListener(this);
        /*
            在Activity上面添加半透明/蒙层的引导View，有两种方法
            方法一
            ((FrameLayout) ((Activity) mContent).getWindow().getDecorView()).addView(this);
            ((FrameLayout) ((Activity) mContent).getWindow().getDecorView()).removeView(this);
            使用DecorView().addView，引导蒙层界面会被PopupWindow，Dialog等弹窗遮挡

            方法二
            WindowManager.LayoutParams params = new WindowManager.LayoutParams();
            params.format = PixelFormat.TRANSLUCENT;
            ((Activity) mContent).getWindow().getWindowManager().addView(this, params);
            ((Activity) mContent).getWindow().getWindowManager().removeView(this);
            该方法能覆盖PopupWindow，Dialog等弹窗，但有时获取目标View的坐标偶尔会失效，
            获取目标View的坐标方法：View.getLocationOnScreen, View.getLocationOnScreen,
                              View.getGlobalVisibleRect, View.getLocalVisibleRect
        */
        ((FrameLayout) ((Activity) mContent).getWindow().getDecorView()).addView(this); //添加蒙层View
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if (!handleTouch) {
            handleTouch = true;
            if (mClickListener != null)
                mClickListener.onClick();
//            ((Activity) mContent).getWindow().getWindowManager().removeView(this);
            ((FrameLayout) ((Activity) mContent).getWindow().getDecorView()).removeView(this);//移除蒙层View
        }
        return true;
    }

    @Override
    public void onGlobalLayout() {// 监听全局视图树开始布局
        getViewTreeObserver().removeOnGlobalLayoutListener(this);
        addCustomView();
    }

    protected void addCustomView() {// 在目标view周围添加自定义布局
        int statusBarHeight = 0;
        int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0)
            statusBarHeight = getResources().getDimensionPixelSize(resourceId);
        for (final ViewEntity ve : mViews) {
            // 获取targetView的中心坐标
            if (ve.mTargetView != null) {
                ve.targetW = ve.mTargetView.getWidth() / 2;
                ve.targetH = ve.mTargetView.getHeight() / 2;
                ve.mTargetView.getLocationOnScreen(ve.mCenter);
                ve.mCenter[0] += ve.targetW;
                ve.mCenter[1] += ve.targetH;
            }
            // 方位
            LayoutParams params = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
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
                        params.setMargins(left, 0, 0, height - top);
                        break;
                    case LEFT:
                        params.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
                        params.setMargins(0, top, width - left, 0);
                        break;
                    case BOTTOM:
                        params.setMargins(left, bottom, 0, 0);
                        break;
                    case RIGHT:
                        params.setMargins(right, top, 0, 0);
                        break;
                    case LEFT_TOP:
                        params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
                        params.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
                        params.setMargins(0, 0, width - left, height - top);
                        break;
                    case LEFT_BOTTOM:
                        params.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
                        params.setMargins(0, bottom, width - left, 0);
                        break;
                    case RIGHT_TOP:
                        params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
                        params.setMargins(right, 0, 0, height - top);
                        break;
                    case RIGHT_BOTTOM:
                        params.setMargins(right, bottom, 0, 0);
                        break;
                }
            } else {
                params.addRule(RelativeLayout.CENTER_IN_PARENT);
            }
            View view = LayoutInflater.from(getContext()).inflate(ve.mCustomLayoutID, this, false);
            addViewInLayout(view, -1, params, true);// 添加view, 不会重新布局
        }
        requestLayout();// 统一重新布局
    }

    @Override
    protected void onDraw(Canvas canvas) {
        canvas.saveLayer(0, 0, getWidth(), getHeight(), null, Canvas.ALL_SAVE_FLAG); // 新建图层
        canvas.drawColor(0x77000000);// 绘制半透明背景
        // 在目标View周围裁剪出高亮圆圈
        for (ViewEntity ve : mViews) {
            if (ve.targetW == 0 || ve.targetH == 0)
                return;
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
            } else if (ve.mShape == CIRCULAR) {
                // 圆形
                canvas.drawCircle(ve.mCenter[0], ve.mCenter[1], ve.targetW, mPaint);
            }
        }
    }

    public interface ClickListener {
        void onClick();
    }

    /**
     * 目标View和自定义布局等参数实体
     */
    public static class ViewEntity {
        private View mTargetView; // 目标wiew
        private int[] mCenter = new int[2]; // 目标wiew中心坐标
        private Shape mShape; // 目标wiew高亮圆圈形状
        private int targetW = -1; // 目标wiew高亮宽半径
        private int targetH = -1; // 目标wiew高亮高半径

        private int mCustomLayoutID; // 自定义布局资源ID
        private Direction mDirection; // 自定义布局相对于目标wiew的方向

        public ViewEntity(View targetView, int customLayoutID, Direction direction) {
            this(targetView, null, Shape.RECTANGULAR, customLayoutID, direction);
        }

        public ViewEntity(View targetView, int[] targetSize, Shape shape, int customLayoutID, Direction direction) {
            this.mTargetView = targetView;
            this.mShape = shape;
            this.mCustomLayoutID = customLayoutID;
            this.mDirection = direction;
            if (targetSize != null) {
                targetW = targetSize[0] / 2;
                targetH = targetSize[1] / 2;
            }
        }
    }

    public enum Direction { // 相对于目标wiew的方位
        LEFT, TOP, RIGHT, BOTTOM, LEFT_TOP, LEFT_BOTTOM, RIGHT_TOP, RIGHT_BOTTOM
    }

    public enum Shape { // 目标wiew的高亮圆圈形状: 圆形，椭圆，圆角矩形
        CIRCULAR, ELLIPSE, RECTANGULAR
    }
}

```

简书: http://www.jianshu.com/p/48a078632fd4   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/67006241   
GitHub博客：http://lioil.win/2017/03/27/Android-GuideUser.html   
Coding博客：http://c.lioil.win/2017/03/27/Android-GuideUser.html