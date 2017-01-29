---
layout: post
title: JDBC基础-元数据
tags: J2eeWeb
---
	元数据: 数据库、表和字段的结构信息

# 1.数据库元数据(DatabaseMetaData)
	Connection conn = new ComboPooledDataSource().getConnection();
	// 获取数据库元数据
	DatabaseMetaData metaData = conn.getMetaData();
	// 获取数据库连接URL
	String url = metaData.getURL();
	// 获取数据库用户名
	String username = metaData.getUserName();
	// 获取数据库驱动类名
	String driverName = metaData.getDriverName();	
	// 获取数据库指定表主键
	ResultSet rs = metaData.getPrimaryKeys(null, null, 表名);
	while(rs.next()){
		short seq = rs.getShort("KEY_SEQ");
		String name = rs.getString("COLUMN_NAME");		
	}
	// 获取数据库所有表
	rs = metaData.getTables(null, null, "%", new String[]{"TABLE"});
	while(rs.next()){
		String tabName = rs.getString("TABLE_NAME");
		System.out.println(tabName);
	}

# 2.参数元数据(ParameterMetaData)
	Connection conn = new ComboPooledDataSource().getConnection();
	PreparedStatement ps = conn.prepareStatement("select * from xxx where 参数1=? and 参数2=?");
	// 获取参数元数据
	ParameterMetaData metaData = ps.getParameterMetaData();
	// 获取参数个数
	int count = metaData.getParameterCount();
	// 获取参数类型
	String type1 = metaData.getParameterTypeName(1);
	String type2 = metaData.getParameterTypeName(2);

# 3.结果集元数据(ResultSetMetaData)
	Connection conn = new ComboPooledDataSource().getConnection();
	PreparedStatement ps = conn.prepareStatement(SQL);
	ResultSet rs = ps.executeQuery();
	// 获取结果集元数据
	ResultSetMetaData metaData = rs.getMetaData();
	// 获取结果集列数
	int cc = metaData.getColumnCount();
	// 获取结果集指定列名
	String cn = metaData.getColumnName(2);
	// 获取结果集指定列类型
	String ct = metaData.getColumnTypeName(3);