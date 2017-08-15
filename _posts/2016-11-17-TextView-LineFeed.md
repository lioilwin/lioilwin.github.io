---
layout: post
title: Android-TextView自定义换行
tags: Android
---

/**
 * Created by 19219 on 2016/11/16.
 * 强制字符占满一行才换行，避免TextView中英混合过早换行，并且在最后添加点击文字
 */

```java

public class TextViewLineFeed extends TextView {
    private float textX;
    private float textY;
    private int clickStart;
    private ClickTextListner clickTextListner;
    private float clickTextWidth;

    protected void onDraw(Canvas canvas) {
//        使用默认画笔
        getPaint().setColor(getCurrentTextColor());
        getPaint().setUnderlineText(false);

//        获取文字内容
        String text = getText().toString();

//        获取每个字符宽
        float[] charWidths = new float[text.length()];
        getPaint().getTextWidths(text, charWidths);

//        点击文字宽
        for (int i = clickStart; i < charWidths.length; i++)
            clickTextWidth += charWidths[i];

//        循环换行输出
        textLineFeed(canvas, text, charWidths);
    }

    /**
     * 换行，并在最后添加点击文字
     */
    private void textLineFeed(Canvas canvas, String text, float[] charWidths) {
//        第一行文字基线Y坐标
        textY = getTextSize();
        for (int start = 0, end = 0, strLineLen = 0; end < charWidths.length; ++end) {
//            文本宽超过View宽，换行输出
            if ((strLineLen += charWidths[end]) > getWidth()) {
                if (end - 1 < clickStart) {
                    canvas.drawText(text.substring(start, end), 0, textY, getPaint());
                } else {
                    canvas.drawText(text.substring(start, clickStart), 0, textY, getPaint());
//                    避免点击文字中间换行，强制把点击文字换行输出
                    getPaint().setColor(0xff0000ff);
                    getPaint().setUnderlineText(true);
                    canvas.drawText(text.substring(clickStart, charWidths.length), (textX = 0), (textY = textY + getLineHeight()), getPaint());
                    break;
                }
                strLineLen = 0;
                start = end;
                textY += getLineHeight();
            }
//            文本结束且不超过View宽，不换行输出
            if (end == charWidths.length - 1) {
                canvas.drawText(text.substring(start, clickStart), 0, textY, getPaint());
                textX = 0;
                for (int i = start; i < clickStart; i++)
                    textX += charWidths[i];
                getPaint().setColor(0xff0000ff);
                getPaint().setUnderlineText(true);
                canvas.drawText(text.substring(clickStart, ++end), textX, textY, getPaint());
            }
        }
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                if (event.getX() > textX &&
                        event.getX() < (textX + clickTextWidth) &&
                        event.getY() > (textY - getLineHeight()))
                    clickTextListner.clickText();
                break;
        }
        return super.onTouchEvent(event);
    }

    /**
     * 在文字最后附加点击功能
     * @param start 点击文字的起始位置
     */
    public void setClickText(int start) {
        clickStart = start;
    }


    public interface ClickTextListner {
        public void clickText();
    }

    public void setClickTextListner(ClickTextListner click) {
        clickTextListner = click;
    }

    public TextViewLineFeed(Context context) {
        this(context, null);
    }

    public TextViewLineFeed(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public TextViewLineFeed(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }
}

```

简书: http://www.jianshu.com/p/5d8c8448af1b   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/53711576   
GitHub博客：http://lioil.win/2016/11/17/TextView-LineFeed.html   
Coding博客：http://c.lioil.win/2016/11/17/TextView-LineFeed.html