---
layout: post
title: 图片裁剪/旋转/缩放
tags: Android
---
## 1.系统裁剪

```java
	
	// 选择图片,裁剪
    public void crop(View view) {
        startActivityForResult(new Intent(Intent.ACTION_PICK,
			MediaStore.Images.Media.EXTERNAL_CONTENT_URI)
			.putExtra("crop", "true")
			.putExtra("output", Uri.fromFile(new File("/sdcard/!temp.jpg")))
			,1);
			
		// 系统选择图片还可用new Intent(Intent.ACTION_GET_CONTENT).setType(image/*)
		// 系统相机可用new Intent(MediaStore.ACTION_IMAGE_CAPTURE).putExtra("output", xx);
    }
	
	@Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {  
        if (resultCode != RESULT_OK) return;
        imageView.setImageBitmap(BitmapFactory.decodeFile("/sdcard/!temp.jpg"));
    }
	
```
	
## 2.旋转缩放
	
```java

	 @Override
    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {		
		// 旋转
		Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher);
        Matrix matrix = new Matrix();
        matrix.setRotate(progress);
        imageView.setImageBitmap(Bitmap.createBitmap(bitmap,0,0,
						bitmap.getWidth(),bitmap.getHeight(),matrix,true));
		
		// 缩放
		imageView.setLayoutParams(new RelativeLayout.LayoutParams(progress,progress));
	}

```