---
layout: post
title: Android绘图-引导用户的透明图
tags: Android
---

```java

public class GuideView extends RelativeLayout {
    private final String TAG = getClass().getSimpleName();
    private Context mContent;
    private boolean first = true;
    /**
     * targetView前缀。SHOW_GUIDE_PREFIX + targetView.getId()作为保存在SP文件的key。
     */
    private static final String SHOW_GUIDE_PREFIX = "show_guide_on_view_";
    /**
     * GuideView 偏移量
     */
    private int offsetX, offsetY;
    /**
     * targetView 的外切圆半径
     */
    private int radius;
    /**
     * 需要显示提示信息的View
     */
    private View targetView;
    /**
     * 自定义View
     */
    private View customGuideView;
    /**
     * 透明圆形画笔
     */
    private Paint mCirclePaint;
    /**
     * targetView圆心
     */
    private int[] center;
    /**
     * 绘制前景bitmap
     */
    private Bitmap bitmap;
    /**
     * 背景色和透明度，格式 #aarrggbb
     */
    private int backgroundColor;
    /**
     * Canvas,绘制bitmap
     */
    private Canvas temp;
    /**
     * 相对于targetView的位置.在target的那个方向
     */
    private Direction direction;

    /**
     * 形状
     */
    private MyShape myShape;
    /**
     * targetView左上角坐标
     */
    private int[] location;

    private OnClickCallback onclickListener;
    private RelativeLayout guideViewLayout;

    public void restoreState() {
        Log.v(TAG, "restoreState");
        offsetX = offsetY = 0;
        radius = 0;
        mCirclePaint = null;
        center = null;
        bitmap = null;
        needDraw = true;
        temp = null;
        Builder.guiderView = null;
    }

    public int[] getLocation() {
        return location;
    }

    public void setLocation(int[] location) {
        this.location = location;
    }

    public GuideView(Context context) {
        super(context);
        this.mContent = context;
        init();
    }

    public int getRadius() {
        return radius;
    }

    public void setRadius(int radius) {
        this.radius = radius;
    }

    public void setOffsetX(int offsetX) {
        this.offsetX = offsetX;
    }

    public void setOffsetY(int offsetY) {
        this.offsetY = offsetY;
    }

    public void setDirection(Direction direction) {
        this.direction = direction;
    }

    public void setShape(MyShape shape) {
        this.myShape = shape;
    }

    public void setCustomGuideView(View customGuideView) {
        this.customGuideView = customGuideView;
        if (!first) {
            restoreState();
        }
    }

    public void setBgColor(int background_color) {
        this.backgroundColor = background_color;
    }

    public View getTargetView() {
        return targetView;
    }

    public void setTargetView(View targetView) {
        this.targetView = targetView;
    }

    private void init() {
    }

    public void showOnce() {
        if (targetView != null) {
            mContent.getSharedPreferences(TAG, Context.MODE_PRIVATE).edit().putBoolean(generateUniqId(targetView), true).apply();
        }
    }

    private boolean hasShown() {
        if (targetView == null) return true;
        return mContent.getSharedPreferences(TAG, Context.MODE_PRIVATE).getBoolean(generateUniqId(targetView), false);
    }

    private String generateUniqId(View v) {
        Log.i(TAG, "generateUniqId: " + v.getId());
        return SHOW_GUIDE_PREFIX + v.getId();
    }

    public int[] getCenter() {
        return center;
    }

    public void setCenter(int[] center) {
        this.center = center;
    }

    public void hide() {
        Log.v(TAG, "hide");
        if (customGuideView != null) {
            this.removeAllViews();
            ((FrameLayout) ((Activity) mContent).getWindow().getDecorView()).removeView(this);
            restoreState();
        }
    }

    public void show() {
        Log.v(TAG, "show");
//        if (hasShown()) return;
//        showOnce();
        setBackgroundColor(Color.TRANSPARENT);
        ((FrameLayout) ((Activity) mContent).getWindow().getDecorView()).addView(this);
        first = false;
    }

    /**
     * 添加提示文字，位置在targetView的下边
     * 在屏幕窗口，添加蒙层，蒙层绘制总背景和透明圆形，圆形下边绘制说明文字
     */
    private void createGuideView() {
        Log.v(TAG, "createGuideView");
        // Tips布局参数
        LayoutParams guideViewParams;
        guideViewParams = new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
        guideViewParams.setMargins(0, center[1] + radius + 10, 0, 0);
        if (customGuideView != null) {
            if (direction != null) {
                int width = this.getWidth();
                int height = this.getHeight();
                int left = center[0] - radius;
                int right = center[0] + radius;
                int top = center[1] - radius;
                int bottom = center[1] + radius;
                switch (direction) {
                    case TOP:
                        this.setGravity(Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL);
                        guideViewParams.setMargins(offsetX, offsetY - height + top, -offsetX, height - top - offsetY);
                        break;
                    case LEFT:
                        this.setGravity(Gravity.RIGHT);
                        guideViewParams.setMargins(offsetX - width + left, top + offsetY, width - left - offsetX, -top - offsetY);
                        break;
                    case BOTTOM:
                        this.setGravity(Gravity.CENTER_HORIZONTAL);
                        guideViewParams.setMargins(offsetX, bottom + offsetY, -offsetX, -bottom - offsetY);
                        break;
                    case RIGHT:
                        guideViewParams.setMargins(right + offsetX, top + offsetY, -right - offsetX, -top - offsetY);
                        break;
                    case LEFT_TOP:
                        this.setGravity(Gravity.RIGHT | Gravity.BOTTOM);
                        guideViewParams.setMargins(offsetX - width + left, offsetY - height + top, width - left - offsetX, height - top - offsetY);
                        break;
                    case LEFT_BOTTOM:
                        this.setGravity(Gravity.RIGHT);
                        guideViewParams.setMargins(offsetX - width + left, bottom + offsetY, width - left - offsetX, -bottom - offsetY);
                        break;
                    case RIGHT_TOP:
                        this.setGravity(Gravity.BOTTOM);
                        guideViewParams.setMargins(right + offsetX, offsetY - height + top, -right - offsetX, height - top - offsetY);
                        break;
                    case RIGHT_BOTTOM:
                        guideViewParams.setMargins(right + offsetX, bottom + offsetY, -right - offsetX, -top - offsetY);
                        break;
                }
            } else {
                guideViewParams = new LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                guideViewParams.setMargins(offsetX, offsetY, -offsetX, -offsetY);
            }
            if (customGuideView.getParent() != null)
                ((ViewGroup) customGuideView.getParent()).removeView(customGuideView);
            addView(customGuideView, guideViewParams);
        }
    }

    /**
     * 获得targetView半径
     */
    private int getTargetViewRadius() {
        int x = targetView.getWidth();
        int y = targetView.getHeight();
        return (int) (Math.sqrt(x * x + y * y) / 2);
    }

    boolean needDraw = true;

    @Override
    protected void onDraw(Canvas canvas) {
        Log.v(TAG, "onDraw");
        if (targetView == null) return;

        // 获取targetView的中心坐标
        if (center == null) {
            // 获取右上角坐标
            location = new int[2];
            targetView.getLocationOnScreen(location);
            center = new int[2];
            // 获取中心坐标
            center[0] = location[0] + targetView.getWidth() / 2;
            center[1] = location[1] + targetView.getHeight() / 2;
        }
        // 获取targetView外切圆半径
        if (radius == 0) {
            radius = getTargetViewRadius();
        }
        // 添加GuideView
        createGuideView();
        drawBackground(canvas);
    }

    private void drawBackground(Canvas canvas) {
        Log.v(TAG, "drawBackground");
        needDraw = false;
        // 先绘制bitmap，再将bitmap绘制到屏幕
        bitmap = Bitmap.createBitmap(canvas.getWidth(), canvas.getHeight(), Bitmap.Config.ARGB_8888);
        temp = new Canvas(bitmap);

        // 背景画笔
        Paint bgPaint = new Paint();
        if (backgroundColor != 0)
            bgPaint.setColor(backgroundColor);
        else
            bgPaint.setColor(0xcc222222);

        // 绘制屏幕背景
        temp.drawRect(0, 0, temp.getWidth(), temp.getHeight(), bgPaint);

        // targetView 的透明圆形画笔
        if (mCirclePaint == null) mCirclePaint = new Paint();
        mCirclePaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_OUT));
        mCirclePaint.setAntiAlias(true);

        if (myShape != null) {
            RectF oval = new RectF();
            switch (myShape) {
                case CIRCULAR://圆形
                    temp.drawCircle(center[0], center[1], radius, mCirclePaint);//绘制圆形
                    break;
                case ELLIPSE://椭圆
                    oval.left = center[0] - 150;                              //左边
                    oval.top = center[1] - 50;                                   //上边
                    oval.right = center[0] + 150;                             //右边
                    oval.bottom = center[1] + 50;                                //下边
                    temp.drawOval(oval, mCirclePaint);                   //绘制椭圆
                    break;
                case RECTANGULAR://圆角矩形
                    oval.left = center[0] - 150;                              //左边
                    oval.top = center[1] - 50;                                   //上边
                    oval.right = center[0] + 150;                             //右边
                    oval.bottom = center[1] + 50;                                //下边
                    temp.drawRoundRect(oval, radius, radius, mCirclePaint);                   //绘制圆角矩形
                    break;
            }
        } else {
            temp.drawCircle(center[0], center[1], radius, mCirclePaint);//绘制圆形
        }

        // 绘制到屏幕
        canvas.drawBitmap(bitmap, 0, 0, bgPaint);
        bitmap.recycle();
    }

    public void setOnclickListener(OnClickCallback onclickListener) {
        this.onclickListener = onclickListener;
    }

    private void setClickInfo() {
        setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                if (onclickListener != null) {
                    onclickListener.onClickedGuideView();
                }
                hide();
            }
        });
    }

    /**
     * 定义GuideView相对于targetView的方位，共八种。不设置则默认在targetView下方
     */
    public enum Direction {
        LEFT, TOP, RIGHT, BOTTOM,
        LEFT_TOP, LEFT_BOTTOM,
        RIGHT_TOP, RIGHT_BOTTOM
    }

    /**
     * 定义目标控件的形状，共3种。圆形，椭圆，带圆角的矩形（可以设置圆角大小），不设置则默认是圆形
     */
    public enum MyShape {
        CIRCULAR, ELLIPSE, RECTANGULAR
    }

    /**
     * GuideView点击Callback
     */
    public interface OnClickCallback {
        void onClickedGuideView();
    }

    public static class Builder {
        private static GuideView guiderView;
        private static Builder builder = new Builder();

        private Builder() {
        }

        public static Builder newInstance(Context ctx) {
            if (guiderView == null) guiderView = new GuideView(ctx);
            return builder;
        }

        public Builder setTargetView(View target) {
            guiderView.setTargetView(target);
            return builder;
        }

        public Builder setBgColor(int color) {
            guiderView.setBgColor(color);
            return builder;
        }

        public Builder setDirction(Direction dir) {
            guiderView.setDirection(dir);
            return builder;
        }

        public Builder setShape(MyShape shape) {
            guiderView.setShape(shape);
            return builder;
        }

        public Builder setOffset(int x, int y) {
            guiderView.setOffsetX(x);
            guiderView.setOffsetY(y);
            return builder;
        }

        public Builder setRadius(int radius) {
            guiderView.setRadius(radius);
            return builder;
        }

        public Builder setCustomGuideView(View view) {
            guiderView.setCustomGuideView(view);
            return builder;
        }

        public Builder setCenter(int X, int Y) {
            guiderView.setCenter(new int[]{X, Y});
            return builder;
        }

        public void show() {
            guiderView.setClickInfo();
            guiderView.show();
        }

        public Builder setOnclickListener(final OnClickCallback callback) {
            guiderView.setOnclickListener(callback);
            return builder;
        }
    }
}

```