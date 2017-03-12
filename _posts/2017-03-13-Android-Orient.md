---
layout: post
title: Android方向传感器
tags: Android
---
使用方向传感器，定位手机y轴方向(y轴与北方夹角0-360度)

y轴: 手机长边方向
x轴：手机短边方向
z轴：与手机平面垂直方向

本文源码：https://github.com/lifegh/StepOrient

# 一.使用
```java
public class MainActivity extends AppCompatActivity implements StepCallBack{
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

public class OrientSensor implements SensorEventListener {
    private static final String TAG = "OrientSensor";
    private SensorManager sensorManager;
    private OrientCallBack orientCallBack;
    private Context context;

    public OrientSensor(Context context, OrientCallBack orientCallBack) {
        this.context = context;
        this.orientCallBack = orientCallBack;
    }


    /**
     * 注册方向监听器
     *
     * @return 是否支持
     */
    public Boolean registerOrient() {
        sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        boolean isAvailable = sensorManager.registerListener(this,
                sensorManager.getDefaultSensor(Sensor.TYPE_ORIENTATION),
                SensorManager.SENSOR_DELAY_GAME);
        if (isAvailable) {
            Log.i(TAG, "方向传感器可用！");
        } else {
            Log.i(TAG, "方向传感器不可用！");
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
        orientCallBack.Orient(event.values[0]);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }
}

````