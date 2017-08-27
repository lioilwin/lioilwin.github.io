---
layout: post
title: Android-绘图-绘制导航箭头
tags: Android
---

项目源码：https://github.com/lifegh/StepOrient  
利用Android传感器-方向和计步组合使用,可以在地图上记录人行走的轨迹图

本文主要是在行走轨迹上增加方向导航箭头(类似地图导航箭头)

方向箭头绘制步骤:   
	1.保存画布旋转前的状态canvas.save()  
       canvas.translate(mCurX, mCurY); // 平移画布坐标原点  
	   canvas.rotate(orient); // 旋转画布(相当于旋转箭头)  
	2.利用mArrowPath会完成圆弧和三角形组合路径绘制  
	3.使用canvas.drawPath(mArrowPath, mPaint)完成填充mArrowPath路径  
	4.利用canvas.drawArc(..., mStrokePaint)绘制完整圆环  
	5.恢复画布旋转前的状态canvas.restore();  

```java

public class MainSurfaceView extends SurfaceView {
    private SurfaceHolder mHolder;
    private Bitmap mBitmap;
    private Canvas mTmpCanvas;

    private Paint mPaint;
    private Paint mStrokePaint;
    private Path mArrowPath; // 箭头路径

    private int cR = 10; // 圆点半径
    private int arrowR = 20; // 箭头半径

    private float mCurX = 0;
    private float mCurY = 0;
    private int mPreOrient;

    public MainSurfaceView(Context context) {
        this(context, null);
    }

    public MainSurfaceView(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public MainSurfaceView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        mHolder = getHolder(); // 获得SurfaceHolder对象
//        // 设置背景透明
//        setZOrderOnTop(true);
//        mHolder.setFormat(PixelFormat.TRANSLUCENT);

        initPaint();     // 初始化画笔
        initArrowPath(); // 初始化箭头路径
    }

    private void initPaint() {
        mPaint = new Paint();
        mPaint.setColor(Color.BLUE);
        mPaint.setAntiAlias(true);
        mPaint.setStyle(Paint.Style.FILL);

        mStrokePaint = new Paint(mPaint);
        mStrokePaint.setStyle(Paint.Style.STROKE);
        mStrokePaint.setStrokeWidth(5);
    }

    /**
     * 初始化箭头
     */
    private void initArrowPath() {
        // 初始化箭头路径
        mArrowPath = new Path();
        mArrowPath.arcTo(new RectF(-arrowR, -arrowR, arrowR, arrowR), 0, -180);
        mArrowPath.lineTo(0, -3 * arrowR);
        mArrowPath.close();
    }

    /**
     * 当屏幕被触摸时调用
     */
    @Override
    public boolean onTouchEvent(MotionEvent event) {
        mCurX = event.getX();
        mCurY = event.getY();
        addPoint();
        return true;
    }

    /**
     * 自动增加点
     */
    public void autoAddPoint(float stepLen, float endOrient) {
        mCurX += (float) (stepLen * Math.sin(Math.toRadians(endOrient)));
        mCurY += (float) (stepLen * Math.cos(Math.toRadians(endOrient)));
        addPoint();
    }

    /**
     * 增加点
     */
    private void addPoint() {
        if (mTmpCanvas == null) {
            mBitmap = Bitmap.createBitmap(getWidth(), getHeight(), Bitmap.Config.ARGB_8888);
            mTmpCanvas = new Canvas(mBitmap);
            mTmpCanvas.drawColor(Color.GRAY);
        }
        mTmpCanvas.drawCircle(mCurX, mCurY, cR, mPaint); // 在mBitmap上画点
        drawBitmap(0);  // 在surfaceView绘图
    }

    public void autoDrawArrow(int orient) {
        if (orient - mPreOrient > 6) {
            drawBitmap(orient);
        }
        mPreOrient = orient;
    }

    private void drawBitmap(int orient) {
        Canvas canvas = mHolder.lockCanvas(); // 加锁，获取canLock
        if (canvas == null || mBitmap == null) return;
        canvas.drawBitmap(mBitmap, 0, 0, null); // 将mBitmap绘到canLock
        canvas.save(); // 保存画布
        canvas.translate(mCurX, mCurY); // 平移画布
        canvas.rotate(orient); // 转动画布
        canvas.drawPath(mArrowPath, mPaint);
        canvas.drawArc(new RectF(-arrowR * 0.8f, -arrowR * 0.8f, arrowR * 0.8f, arrowR * 0.8f),
                0, 360, false, mStrokePaint);
        canvas.restore(); // 恢复画布
        mHolder.unlockCanvasAndPost(canvas); // 解锁，把画布显示在屏幕上
    }

    /**
     * 更换背景地图
     */
    public void changeBitmap(Bitmap bitmap) {
        mBitmap = resizeBitmap(bitmap.copy(Bitmap.Config.ARGB_8888, true), getWidth(), getHeight());
        if (mTmpCanvas == null) {
            mTmpCanvas = new Canvas();
        }
        mTmpCanvas.setBitmap(mBitmap);
    }

    /**
     * 缩放bitmap
     */
    public static Bitmap resizeBitmap(Bitmap bitmap, float x, float y) {
        int w = bitmap.getWidth();
        int h = bitmap.getHeight();
        Matrix matrix = new Matrix();
        matrix.postScale(x / w, y / h);
        return Bitmap.createBitmap(bitmap, 0, 0, w, h, matrix, false);
    }
}

```

简书: http://www.jianshu.com/p/824674356f05   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/65946310   
GitHub博客：http://lioil.win/2017/03/25/Canvas-Arrow.html   
Coding博客：http://c.lioil.win/2017/03/25/Canvas-Arrow.html