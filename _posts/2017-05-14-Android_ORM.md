---
layout: post
title: Android数据库-ORM框架
tags: Android
---
# 一.ORM介绍  
对象关系映射Object Relational Mapping, 用于实现面向对象编程里不同系统数据之间转换!	  
面向对象是从耦合/聚合/封装的基础上发展, 关系数据库是从数学理论发展而来;   
两套理论存在显著的区别, ORM对象关系映射就是为了解决它们之间的差异!

直白地说，ORM建立对象和数据库表的对应关系，方便程序员直接用对象操作数据库！
	
# 二.Java的ORM框架  
Hibernate, iBatis, DbUtils，OrmLite等等

# 三.Android的ORM框架  
	OrmLite JDBC和Android的轻量级ORM java包
	SugarORM 用超级简单的方法处理Android数据库
	GreenDAO 一种轻快地将对象映射到SQLite数据库的ORM解决方案
	ActiveAndroid 以活动记录方式为Android SQLite提供持久化
	SQLBrite SQLiteOpenHelper 和ContentResolver的轻量级包装
	Realm是一个跨平台移动数据库引擎,支持iOS、OS X（Objective-C和Swift）以及Android。
	核心数据引擎C++打造，并不是建立在SQLite之上的ORM！
	
	xUtils3, 源于afinal(已不再维护更新)，都是国产框架，方便小巧工具集
	包含了orm, http(s), image, view注解, 但依然很轻量级(246K), 并且特性强大, 方便扩展
	拥有更加灵活的ORM, 和greenDao一致的性能

# 四.xUtils3-ORM框架使用步骤    
Android ORM框架繁多，走马观花看了大部分框架用法，还是觉得xUtils3比较方便使用！   
xUtils3源码和sample：https://github.com/wyouflf/xUtils3    

吐槽一下：xUtils3在ORM框架这块文档说明和代码注释实在太少了！
好在ORM源码不复杂，走一走流程就可以大概看懂！

## 1.在Application全局初始化	
	@Override
	public void onCreate() {
		super.onCreate();
		x.Ext.init(this);
		x.Ext.setDebug(BuildConfig.DEBUG); //是否输出debug日志,影响性能
		...
	}

## 2.创建实体类(与数据库表映射)  

```java

@Table(name = "child") // 使用注解@Table @Column声明表列
public class Child {
    @Column(name = "id", isId = true)
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "parentId" /*, property = "UNIQUE"//如果是一对一加上唯一约束*/)
    private long parentId; // 外键表id

    // 被忽略，不存入数据库
    private String willIgnore;

    @Column(name = "text")
    private String text;

    public long getParentId() {
        return parentId;
    }

    public void setParentId(long parentId) {
        this.parentId = parentId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWillIgnore() {
        return willIgnore;
    }

    public void setWillIgnore(String willIgnore) {
        this.willIgnore = willIgnore;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}

```

## 3.增删改查CRUD

```java

DbManager.DaoConfig daoConfig = new DbManager.DaoConfig()
		.setDbName("test.db")
		// 不设置dbDir时, 默认存储在app私有目录.
		.setDbDir(new File("/sdcard")) // "sdcard"的写法并非最佳实践, 这里为了简单, 先这样写了.
		.setDbVersion(2)
		.setDbOpenListener(new DbManager.DbOpenListener() {
			@Override
			public void onDbOpened(DbManager db) {
				// 开启WAL, 对写入加速提升巨大
				db.getDatabase().enableWriteAheadLogging();
			}
		})
		.setDbUpgradeListener(new DbManager.DbUpgradeListener() {
			@Override
			public void onUpgrade(DbManager db, int oldVersion, int newVersion) {
				// TODO: ...
				// db.addColumn(...);
				// db.dropTable(...);
				// ...
				// or
				// db.dropDb();
			}
		});
		
private void testDb() throws DbException {
	DbManager db = x.getDb(daoConfig );
	// 1.插入(没有表,会创建)——————————————————————————
	// 1.1插入一条
	Child child = new Child();
	child.setName("childname");
	db.save(child);
	// 1.2插入多条
	List<Child> childList = new ArrayList<>();
	childList.add(child);
	childList.add(child);
	db.save(childList);

	// 2.查找——————————————————————————
	// 2.1不用select()筛选列,返回结果Child类 或List<Child>
	Child child2 = db.selector(Child.class).where("id", "=", new String[]{"1"}).findFirst();
	List<Child> childList2 = db.selector(Child.class).where("id", "between", new String[]{"1", "5"}).findAll();
	// 2.2使用select()筛选列,返回结果DbModel 或List<DbModel>
	DbModel dbModel = db.selector(Parent.class).select("name").findFirst();
	List<DbModel> dbModels = db.selector(Parent.class).select("name").findAll();
	// 2.3使用原生sql查询语句，多表內连接查询
	Cursor cursor = db.execQuery("select name from child, parent where parent.id = child.id");

	// 3.修改——————————————————————————
	child.setName("xxx");
	child.setEmail("xxx@qq.com");
	db.update(child);// 根据child的id更新
	db.update(Child.class, WhereBuilder.b("name", "=", "childname"),
			new KeyValue("name", "xxx"));

	// 4.删除——————————————————————————
	db.delete(child);// 根据child的id删除
	db.delete(Child.class, WhereBuilder.b("name", "=", "xxx"));
}

// 性能测试————————————————————————————
private void testDb2() {
	tv_db_result.setText("wait...");
	x.task().run(new Runnable() {
		@Override
		public void run() {
			// 后台线程
			DbManager db = x.getDb(daoConfig);
			String result = "";
			int count = 10000;
			long start;
			List<Parent> parentList = new ArrayList<>();
			for (int i = 0; i < count; i++) {
				Parent parent = new Parent();
				parent.setAdmin(true);
				parent.setDate(new java.sql.Date(1234));
				parent.setTime(new Date());
				parent.setEmail(i + "_@qq.com");
				parentList.add(parent);
			}

			// 批量插入————————————————————————————
			start = System.currentTimeMillis();
			try {
				db.save(parentList);
			} catch (DbException ex) {
				ex.printStackTrace();
			}
			result += "批量插入" + count + "条数据:" + (System.currentTimeMillis() - start) + "ms\n";

			// 循环插入————————————————————————————
			start = System.currentTimeMillis();
			for (Parent parent : parentList) {
				try {
					db.save(parent);
				} catch (DbException ex) {
					ex.printStackTrace();
				}
			}
			result += "循环插入" + count + "条数据:" + (System.currentTimeMillis() - start) + "ms\n";
			count *= 2;

			// 查找————————————————————————————
			start = System.currentTimeMillis();
			try {
				parentList = db.selector(Parent.class).limit(count).findAll();
			} catch (DbException ex) {
				ex.printStackTrace();
			}
			result += "查找" + count + "条数据:" + (System.currentTimeMillis() - start) + "ms\n";

			// 删除————————————————————————————
			start = System.currentTimeMillis();
			try {
				db.delete(parentList);
			} catch (DbException ex) {
				ex.printStackTrace();
			}
			result += "删除" + count + "条数据:" + (System.currentTimeMillis() - start) + "ms\n";

			final String finalResult = result;
			x.task().post(new Runnable() {
				@Override
				public void run() {
					// UI线程
					tv_db_result.setText(finalResult);
				}
			});
		}
	});
}

```
	