---
layout: post
title: 对话框自定义的5种方法
tags: Android
---

## 1.使用DialogFragment(谷歌官方推荐)
	public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (true) {
            // 若重写了onCreateDialog(),则优先使用onCreateDialog布局
            // 若没有,则使用onCreateView布局
            new MyDialogFragment().show(getSupportFragmentManager(), "dialog");
        } else {
            // 当作fragment使用, 必须重写onCreateView()布局
            getSupportFragmentManager().beginTransaction()
                    .add(android.R.id.content, new MyDialogFragment())
                    .addToBackStack(null)
                    .commit();
        }
	}

	class MyDialogFragment extends DialogFragment {
		@Override
		public Dialog onCreateDialog(Bundle savedInstanceState) {
			return new AlertDialog.Builder(getActivity()).setView(R.layout.dialog).create();
		}

		@Override
		public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
			// getDialog().requestWindowFeature(Window.FEATURE_NO_TITLE);
			return inflater.inflate(R.layout.dialog, container, false);
		}
	}


## 2.使用AlertDialog实现
	new AlertDialog.Builder(this)
	// 自定义布局
                .setView(R.layout.dialog)
                .show();	
				
## 3.使用Dialog实现
	在values/styles.xml
	<style name="MyDialogStyleBottom">
		<!--出入动画-->
        <item name="android:windowAnimationStyle">@style/AnimBottom</item> 
		<!--悬浮-->
		<item name="android:windowIsFloating">true</item>
		<!--无标题-->
		<item name="android:windowNoTitle">true</item>
		<!--背景透明变暗-->
		<item name="android:windowBackground">@android:color/transparent</item>     
		<item name="android:windowIsTranslucent">true</item>
		<item name="android:backgroundDimEnabled">true</item>        
	</style>
	
	Dialog dialog = new Dialog(布局样式MyDialogStyleBottom);
	dialog.setContentView(布局);		
	dialog.show();
		
## 4.使用PopupWindow实现
	View v = View.inflate(布局);
	PopupWindow p = new PopupWindow(v);
	p.setBackground···	
	p.setLoaction···
	或p.setDropdown···(设置显示位置)；
				
## 5.使用Activity实现
	在AndroidManifest.xml中
	修改Actity主题android:theme="@style/MyDialogStyleBottom"
	
	
## 滑出滑入动画
	在values/styles.xml
		<style name="AnimBottom">
			<item name="android:windowEnterAnimation">@anim/push_bottom_in</item>
			<item name="android:windowExitAnimation">@anim/push_bottom_out</item>
		</style>

	在anim/push_bottom_in.xml
	滑入式动画
	<set>  
		<translate  
			android:duration="200"  
			android:fromYDelta="100%p"  
			android:toYDelta="0"/>        
	</set>  

	在anim/push_bottom_out.xml
	滑出式动画
	<set> 
		<translate  
			android:duration="200"  
			android:fromYDelta="0"  
			android:toYDelta="50%p" />  
	</set>