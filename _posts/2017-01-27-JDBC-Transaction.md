---
layout: post
title: JDBC基础-事务管理
tags: J2eeWeb
---
# 1.事务概念
	事务:一组操作要么同时完成、要么同时不完成。
	
	事务四大特性ACID
	原子性Atomicity:  事务的一组操作是原子不可再分割的,要么同时完成、要么同时不完成。
	一致性Consistency: 事务在执行前后数据完整性(约束)不变。	
	隔离性Isolation:  多个事务同时操作数据库时,应保证各事务隔离,互相不干扰。
	持久性Durability: 事务一旦被提交,数据库永久改变,不能回滚。
	
# 2.管理事务
	数据库默认一条SQL语句独占一个事务
	
	1)在数据库中管理事务:	
		start transaction;
		SQL语句1;
		SQL语句2;	
		commit;
		rollback;
                
	2)在java(JDBC)中管理事务:
		Class.forName(...);
		Connection conn = DriverManager.getConnection(url);		
		PreparedStatement ps = null;		
		Savepoint sp = null;
		try {
			// 关闭默认提交事务(一条SQL独占一个事务)
			conn.setAutoCommit(false);

			ps = conn.prepareStatement(SQL1);
			ps.setString(1, "xx");
			ps.executeUpdate();
			
			ps = conn.prepareStatement(SQL2);
			ps.setString(1, "xx");
			ps.executeUpdate();

			// 设置Savepoint
			sp = conn.setSavepoint();
			
			// 异常测试
			int i = 1 / 0;
			
			ps = conn.prepareStatement(SQL3);
			ps.setString(1, "xx");
			ps.executeUpdate();
			
			// 提交事务
			conn.commit();
		} catch (Exception e) {		
			if (sp == null) {
			// Savepoint之前的SQL语句失败,全部回滚
				conn.rollback();
			} else {
			// Savepoint之前的SQL语句成功,回滚到Savepoint,再提交事务
				conn.rollback(sp);
				conn.commit();
			}
		} finally {
			释放资源
		}
	
# 3.事务隔离性(多线程)
	1)多个事务(多线程)并发查询数据库,没有线程并发问题;
	2)多个事务(多线程)并发修改数据库,有线程并发问题(排它锁解决); 	
	3)一个线程修改数据库,同时另一个线程查询,会导致脏读/不可重复度/虚(幻)读问题。
		脏读问题: 一个事务读取了另一个事务未提交的数据
		重复读问题: 在同一事务多次读取,同时另一事务修改数据,导致同一事务多次读取不一致(行级别)
		虚(幻)读问题: 在同一事务多次读取,同时另一事务插入数据,导致同一事务多次读取不一致(表级别)
		
		四大隔离级别:
			Read uncommitted 不解决脏读、重复度、虚读问题
			Read committed 	 只解决脏读问题
			Repeatable read  只解决脏读和重复读问题
			Serializable 	 解决所有并发问题(数据库设为单线程串行化,效率低下)
			
			oracle默认级别是Read committed, mysql默认级别是Repeatable read
			
			查询隔离级别: select @@tx_isolation;
			设置隔离级别: set [global/session] transaction isolation level 隔离级别

	排它锁:任何情况下修改数据库都加排它锁,和任何锁都不共存。		
	共享锁:在Serializable下查询才加共享锁,共享锁之间可共存,和排它锁不共存,使查询和修改不能同时进行。	
	
# 4.更新丢失
	多个线程,根据同一查询条件的结果,判断是否修改表中记录,后修改的线程会覆盖之前修改的记录,导致更新丢失。
	
	乐观锁:认为每次查询不造成更新丢失,在数据库添加版本字段,判断查询结果是否过期,是否修改;
	悲观锁:认为每次操作都造成更新丢失,在每次查询时加排它锁(for update),使多线程等待; 	
	
	乐观锁使用场景:查询多,修改少。如果修改多,更新失败次数多,需多次重复更新。
	悲观锁使用场景:查询少,修改多。如果查询多,更新少,悲观锁导致效率低。