---
layout: post
title: Android传感器-实现记录人行走的轨迹
tags: Android
---
本文源码：https://github.com/lifegh/StepOrient

利用Android传感器-方向和计步组合使用,可以在地图上记录人行走的轨迹图
传感器类源码在上两篇文章中，本文主要是方向和计步组合使用!

# 一.方向和计步组合使用，记录轨迹图

```java

public class MainActivity extends AppCompatActivity implements StepSensorBase.StepCallBack, OrientSensor.OrientCallBack {
    public static final int REQUEST_IMG = 1;
    private final String TAG = "MainActivity";

    private TextView stepText;
    private TextView orientText;
    private StepSurfaceView stepSurfaceView;
    private CompassView compassView;
    private ImageView imageView;

    private int stepLen = 50; // 步长
    private StepSensorBase stepSensor; // 计步传感器
    private OrientSensor orientSensor; // 方向传感器

    private int endOrient;

    @Override
    public void Step(int stepNum) {
        //  计步回调
//        stepText.setText("步数:" + stepCount++);
        stepText.append(endOrient + ", ");

        // 步长和方向角度转为圆点坐标
        float x = (float) (stepLen * Math.sin(Math.toRadians(endOrient)));
        float y = (float) (stepLen * Math.cos(Math.toRadians(endOrient)));
        stepSurfaceView.autoAddPoint(x, -y);
    }

    @Override
    public void Orient(int orient) {
        // 方向回调
        compassView.setOrient(-orient); // 指针转动
        orientText.setText("方向:" + orient);
		// 获取手机转动停止后的方向
        endOrient = SensorUtil.getInstance().getRotateEndOrient(orient);
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        SensorUtil.getInstance().printAllSensor(this); // 打印所有可用传感器
		
		········

        // 注册计步监听
//        stepSensor = new StepSensorPedometer(this, this);
//        if (!stepSensor.registerStep()) {
            stepSensor = new StepSensorAcceleration(this, this);
            if (!stepSensor.registerStep()) {
                Toast.makeText(this, "计步功能不可用！", Toast.LENGTH_SHORT).show();
            }
//        }


        // 注册方向监听
        orientSensor = new OrientSensor(this, this);
        if (!orientSensor.registerOrient()) {
            Toast.makeText(this, "方向功能不可用！", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // 注销传感器监听
        stepSensor.unregisterStep();
        orientSensor.unregisterOrient();
    }	

   ······
}

```

# 二.获取手机转动停止的方向,优化转动角度偏差

```java

/**
 * 传感器工具类，
 */
public class SensorUtil {
    private static final String TAG = "SensorUtil";
    private static final SensorUtil sensorUtil = new SensorUtil(); // 单例常量
    private SensorManager sensorManager;

    private static final int SENSE = 10; // 方向差值灵敏度
    private static final int STOP_COUNT = 6; // 停止次数
    private int initialOrient = -1; // 初始方向
    private int endOrient = -1; // 转动停止方向

    private boolean isRotating = false; // 是否正在转动
    private int lastDOrient = 0; // 上次方向与初始方向差值
    private Stack<Integer> dOrientStack = new Stack<>(); // 历史方向与初始方向的差值栈

    ···········省略··········

    /**
     * 获取手机转动停止的方向
     * @param orient 手机实时方向
     */
    public int getRotateEndOrient(int orient) {
        if (initialOrient == -1) {
            // 初始化转动
            endOrient = initialOrient = orient;
            Log.i(TAG, "getRotateEndOrient: 初始化，方向：" + initialOrient);
        }

        int currentDOrient = Math.abs(orient - initialOrient); // 当前方向与初始方向差值
        if (!isRotating) {
            // 检测是否开始转动
            lastDOrient = currentDOrient;
            if (lastDOrient >= SENSE) {
                // 开始转动
                isRotating = true;
            }
        } else {
            // 检测是否停止转动
            if (currentDOrient <= lastDOrient) {
                // 至少累计STOP_COUNT次出现当前方向差小于上次方向差
                int size = dOrientStack.size();
                if (size >= STOP_COUNT) {
                    // 只有以前SENSE次方向差距与当前差距的差值都小于等于SENSE，才判断为停止
                    for (int i = 0; i < size; i++) {
                        if (Math.abs(currentDOrient - dOrientStack.pop()) >= SENSE) {
                            isRotating = true;
                            break;
                        }
                        isRotating = false;
                    }
                }

                if (!isRotating) {
                    // 停止转动
                    dOrientStack.clear();
                    initialOrient = -1;
                    endOrient = orient;
                    Log.i(TAG, "getRotateEndOrient: ------停止转动，方向：" + endOrient);
                } else {
                    // 正在转动，把当前方向与初始方向差值入栈
                    dOrientStack.push(currentDOrient);
                    Log.i(TAG, "getRotateEndOrient: 正在转动，方向：" + orient);
                }
            } else {
                lastDOrient = currentDOrient;
            }
        }
        return endOrient;
    }
}

```
