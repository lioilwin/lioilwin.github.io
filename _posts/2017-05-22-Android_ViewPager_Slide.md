---
layout: post
title: Android_ViewPager循环滑动(轮播)
tags: Android
---
# 一.问题
	ViewPager可以左右滑动页, 但是不能从首页跳到最后页,也不能从最后页跳到首页。
	这就限制左右循环滑动的功能, 难以实现轮播效果！

# 二.解决方法

## 方法一
	监听ViewPager滑动状态 OnPageChangeListener
	1.当首页向右滑时, ViewPager.setCurrentItem 设为最后页;
	2.当最后页向左滑时, ViewPager.setCurrentItem 设为首页！
	缺陷：很明显首页和最后页过渡效果差，动画效果不好控制，麻烦！
	
## 方法二
	1.把ViewPager总页数设为整数最大值,欺骗ViewPager(PagerAdapter),使得用户不可能滑到边界;
	2.把ViewPager初始位置设为整数最大值的一半附近;
	3.与ViewPager有关的position都要和真实总页数取余数,转换为真实页数！
	方法二明显比方法一过渡效果自然, 用户不可能滑动到整数最大值！
	虽然把总页数设为整数最大值, 但是ViewPager创建总对象数并没有增多, 性能消耗不变！
	此方法虽然是旁门左道，但是可行有效便捷！
		
```java

public class MainActivity extends Activity {
	int mPageSize; // 真实总页数
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		ViewPager viewPager = (ViewPager) findViewById(R.id.viewpager);		
		viewPager.setAdapter(new MyPagerAdapter());
		
		// 把初始位置设为总页数一半(总页数为虚构最大值,用于欺骗ViewPager)
		// 减去余数,使初始位置为真实首页数
		int hMax = Integer.MAX_VALUE/2;		
		viewPager.setCurrentItem(hMax - (hMax%mPageSize)) ; 
		
		viewPager.setOnPageChangeListener(new OnPageChangeListener() {
			@Override			
			public void onPageSelected(int position) {				
				position = position%mPageSize; // 求余,恢复真实页数
				......			
			}
			
			@Override
			public void onPageScrolled(int position, float positionOffset,int positionOffsetPixels) {
				position = position%mPageSize; // 求余,恢复真实页数
				......
			}
			
			@Override		
			public void onPageScrollStateChanged(int state) {				
			}
		});
	}	

	private class MyPagerAdapter extends PagerAdapter {
		@Override		
		public int getCount() {
			// 把总页数设为int最大值,欺骗ViewPager(PagerAdapter)
			// mPageSize才是真实总页数
			return Integer.MAX_VALUE; 
		}

		@Override	
		public Object instantiateItem(ViewGroup container, int position) {
			position = position%mPageSize; // 求余,恢复真实页数
			......
		}

		@Override		
		public boolean isViewFromObject(View view, Object object) {		
		}

		@Override		
		public void destroyItem(ViewGroup container, int position, Object object) {
			position = position%mPageSize; // 求余,恢复真实页数
			......			
		}
	}

}

```