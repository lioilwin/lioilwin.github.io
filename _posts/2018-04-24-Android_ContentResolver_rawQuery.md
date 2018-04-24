---
layout: post
title: Android-ContentResolver取巧执行原生SQL语句(rawQuery/execSQL)
tags: Android
---
## 一.困境
	众所周知ContentProvider没有执行原生SQL的方法,只有增删改查四个固定方法和固定参数,
	因此ContentResolver也只有四个固定方法与之对应。
	现在需求是要把某个app的数据库迁移到另一个app，然后通过ContentProvider共享访问，
	这就非常麻烦了，原来的项目所有SQL语句都要重新拆开改写成ContentResolver的四个固定方法...
	非常浪费时间，太无聊了，纠结了很久。。。
	想到了一个取巧方法：自定义ContentProvider添加rawQuery/execSQL方法，直接执行原生SQL语句。
	
## 二.取巧方法
	// 1.在ContentProvider.query()中自定义rawQuery和execSQL方法
	public class DBContentProvider extends ContentProvider {
		private static SQLiteOpenHelper mHelper;
		
		@Override
		public Cursor query(@NonNull Uri uri, @Nullable String[] projection, @Nullable String selection,
							@Nullable String[] selectionArgs, @Nullable String sortOrder) {
			SQLiteDatabase db = mHelper.getReadableDatabase();
			switch(sortOrder){
				case "rawQuery": //查询SQL
					return db.rawQuery(selection, null);
					break;
				case "execSQL": //增删改SQL
					db.execSQL(selection);
					break;			
			}        
			return null;
		}
		
		/*
		@Override
		public Bundle call(@NonNull String method, @Nullable String arg, @Nullable Bundle extras) {
			switch (method) {
				case "execSQL":
					mHelper.getWritableDatabase().execSQL(arg);
					break;
			}
			return super.call(method, arg, extras);
		}
		*/
	}
	
	// 2.对ContentResolver增加rawQuery和execSQL方法，直接执行原生SQL语句
	public class MyContentResolver {
		private static final Uri URI = Uri.parse("content://xxx");

		public static Cursor rawQuery(Context cxt, String sql) {
			try {
				return cxt.getContentResolver().query(URI, null, sql, null, "rawQuery");
			} catch (Throwable e) {
				e.printStackTrace();
			}
			return null;
		}
		
		public static void execSQL(Context cxt, String sql) {
			try {
				cxt.getContentResolver().query(URI, null, sql, null, "execSQL");
			} catch (Throwable e) {
				e.printStackTrace();
			}
        }
	}
	
简书: https://www.jianshu.com/p/a92efa1c52b7  
CSDN: https://blog.csdn.net/qq_32115439/article/details/80072859  
GitHub博客: http://lioil.win/2018/04/24/Android_ContentResolver_rawQuery.html  
Coding博客: http://c.lioil.win/2018/04/24/Android_ContentResolver_rawQuery.html