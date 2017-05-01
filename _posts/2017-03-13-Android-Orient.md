---
layout: post
title: Android传感器-方向
tags: Android
---
使用方向传感器，定位手机y轴方向(y轴与北方夹角0-360度)

y轴: 手机长边方向
x轴：手机短边方向
z轴：与手机平面垂直方向

本文源码：https://github.com/lifegh/StepOrient
![](https://raw.githubusercontent.com/lifegh/StepOrient/master/%E8%AE%A1%E6%AD%A5%E6%88%AA%E5%9B%BE.jpg)

# 一.使用
```java
public class MainActivity extends AppCompatActivity implements OrientSensor.OrientCallBack{
	.........
       @Override
    public void Orient(float orient) {
        // 方向回调,手机长边y轴与北方夹角0-360度
        orientText.setText("方向:" + (int) orient);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);		
        setContentView(R.layout.activity_main);
        orientText = (TextView) findViewById(R.id.orient_text);
		
        // 开启方向监听
        orientSensor = new OrientSensor(this, this);
        if (!orientSensor.registerOrient()) {
            Toast.makeText(this, "方向传感器不可用！", Toast.LENGTH_SHORT).show();
        }
    }
    .......
 }
 
```

# 二.方向传感器类

```java

/**
 * 方向传感器
 */

public class OrientSensor implements SensorEventListener {
    private static final String TAG = "OrientSensor";
    private SensorManager sensorManager;
    private OrientCallBack orientCallBack;
    private Context context;
    float[] accelerometerValues = new float[3];
    float[] magneticValues = new float[3];

    public OrientSensor(Context context, OrientCallBack orientCallBack) {
        this.context = context;
        this.orientCallBack = orientCallBack;
    }

    public interface OrientCallBack {
        /**
         * 方向回调
         */
        void Orient(int orient);
    }

    /**
     * 注册加速度传感器和地磁场传感器 
     * @return 是否支持方向功能
     */
    public Boolean registerOrient() {
        Boolean isAvailable = true;
        sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);

        // 注册加速度传感器
        if (sensorManager.registerListener(this, sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
                SensorManager.SENSOR_DELAY_GAME)) {
            Log.i(TAG, "加速度传感器可用！");
        } else {
            Log.i(TAG, "加速度传感器不可用！");
            isAvailable = false;
        }

        // 注册地磁场传感器
        if (sensorManager.registerListener(this, sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD),
                SensorManager.SENSOR_DELAY_GAME)) {
            Log.i(TAG, "地磁传感器可用！");
        } else {
            Log.i(TAG, "地磁传感器不可用！");
            isAvailable = false;
        }
        return isAvailable;
    }

    /**
     * 注销方向监听器
     */
    public void unregisterOrient() {
        sensorManager.unregisterListener(this);
    }



    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            accelerometerValues = event.values.clone();
        } else if (event.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD) {
            magneticValues = event.values.clone();
        }

        float[] R = new float[9];
        float[] values = new float[3];
        SensorManager.getRotationMatrix(R, null, accelerometerValues, magneticValues);
        SensorManager.getOrientation(R, values);
        int degree = (int) Math.toDegrees(values[0]);//旋转角度
        if (degree < 0) {
            degree += 360;
        }
        orientCallBack.Orient(degree);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }
}

```