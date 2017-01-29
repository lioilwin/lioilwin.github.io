---
layout: post
title: JDBC工具-DBUtils
tags: J2eeWeb
---
	commons-dbutils是Apache对JDBC简单封装的开源类库,减少JDBC对数据库增删改查的编码量。
	核心类:
		org.apache.commons.dbutils.QueryRunner
		org.apache.commons.dbutils.ResultSetHandler
		
# 1.QueryRunner增删改查
	1)不需要控制事务
	QueryRunner runner = QueryRunner(new ComboPooledDataSource()); // ComboPooledDataSource为c3p0数据库连接池
	runner.updateupdate(sql, params);
	runner.query(sql, ResultSetHandler<T>, params);
	
	2)需要控制事务
	QueryRunner runner = QueryRunner();
	Connection conn = new ComboPooledDataSource().getConnection();
	conn.setAutoCommit(false);
	runner.updateupdate(conn, sql, params);
	runner.query(conn, sql, ResultSetHandler<T>, params);
	conn.commit();
	

# 2.ResultSetHandler实现类		
	ArrayHandler 把结果集第一行数据存入对象数组
	ArrayListHandler 把结果集每一行数据都存入对象数组,再存放到List
	
	BeanHandler 把结果集第一行数据存入JavaBean对象
	BeanListHandler 把结果集每一行数据都存入JavaBean对象,存放到List
	
	MapHandler 把结果集第一行数据存入Map(key为列名)
	MapListHandler 把结果集每一行数据都存入Map(key为列名),再存放到List
	KeyedHandler(columnName) 把结果集每一行数据都存入Map(key为列名),再存入map(key为columnName)
	
	ScalarHandler(columnIndex) 获取结果集第一行数据指定列值,用于单值查询
	
	ColumnListHandler(columnIndex) 将结果集指定列存到List