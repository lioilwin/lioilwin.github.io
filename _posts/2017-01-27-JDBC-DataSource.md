---
layout: post
title: JDBC基础-连接池(数据源)
tags: JavaEE
---	
	数据库连接池(数据源): 批量创建和数据库之间的连接,缓存到连接池中,提高连接性能。
	
# 1.编写连接池
	1)实现javax.sql.DataSource接口,批量创建与数据库的连接,存到集合对象;
	2)实现getConnection方法,从集合对象取出Connection;
	3)动态代理改造Connection.close方法,把连接返回到集合对象。

	改造类的方法: 继承/装饰/动态代理(java.lang.reflect.Proxy)
		
```java

public class connDataSource implements DataSource {
	private static final List<Connection> connList = new LinkedList<>();
	
	static {
		Class.forName(数据库驱动类全名);
		// 批量创建与数据库的连接,存入connList对象
		for (int i = 0; i < 10; i++) {
			Connection conn = DriverManager.getConnection(url);
			// 动态代理改造close方法
			Connection connProxy = (Connection) Proxy.newProxyInstance(conn.getClass().getClassLoader(), 
									conn.getClass().getInterfaces(), 
									new InvocationHandler(){
				public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
					if ("close".equals(method.getName())) {
						// 改造close方法,把连接返回到connList对象		
						if (conn != null && !conn.isClosed()) {
							connList.add(conn);							
						}					
						return null;
					} else {
						// 其它方法继续保持不变
						return method.invoke(conn, args);
					}
				}
			});
			connList.add(connProxy);
		}
	}

	public Connection getConnection() throws SQLException {		
		Connection connProxy = connList.remove(0);
		return connProxy;
	}
}

```
	
# 2.开源数据库连接池

## ①.DBCP数据源
	Apache软件基金组织下的开源数据库连接池实现, Tomcat连接池也是采用该连接池来实现。
	导入的jar包: commons-dbcp.jar(连接池的实现)、commons-pool.jar(连接池实现的依赖库)

	获取连接方式1
		BasicDataSource source = new BasicDataSource();
		source.setDriverClassName(数据库驱动类全名);
		source.setUrl(数据库地址);
		source.setUsername(用户);
		source.setPassword(密码);
		Connection conn = source.getConnection();

	获取连接方式2
		Properties prop = new Properties();
		prop.load(new FileReader(配置文件));
		DataSource source = BasicDataSourceFactory.createDataSource(prop);
		Connection conn = source.getConnection();

		在配置文件中
		driverClassName=数据库驱动类全名
		url=数据库地址
		username=用户
		password=密码	
		initialSize=初始化连接数	
		maxActive=最大连接数	
		maxIdle=最大空闲连接数	
		minIdle=最小空闲连接数	
		maxWait=超时等待时间(毫秒)	
		defaultAutoCommit=是否自动提交
		defaultTransactionIsolation=事务隔离级别
	
## ②.C3P0数据源
	导入c3p0的jar包
	
	获取连接方式1
		ComboPooledDataSource source = new ComboPooledDataSource();
		source.setDriverClass(数据库驱动类全名);
		source.setJdbcUrl(数据库地址);
		source.setUser(用户);
		source.setPassword(密码);
		Connection conn = source.getConnection();

	获取连接方式2	
		// 自动加载位于类加载目录下c3p0-config.xml配置文件
		ComboPooledDataSource source = new ComboPooledDataSource();
		Connection conn = source.getConnection();
		
		在类加载目录下名为c3p0-config.xml配置文件
		<c3p0-config>
			<default-config>
				<property  name="driverClass">数据库驱动类全名</property >
				<property name="jdbcUrl">数据库地址</property >
				<property name="user">用户</property>
				<prope rty name="password">密码</property>
			</default-config>
			<named-config name="mySoruce"> 
				<property name="driverClass">数据库驱动类全名</property >
				<property name="jdbcUrl">数据库地址</property >
				<property name="user">用户</property>
				<property name="password">密码</property>
			</named-config>
		</c3p0-config>		
		
## ③.tomcat内置数据源(DBCP)
	tomcat服务器已经内置了DBCP数据源
	
	1)在Context中配置数据源
		在tomcat/conf/context.xml配置<Context>					被tomcat所有web应用共享		
		在tomcat/conf/Catalina/主机名/context.xml配置<Context>	被当前虚拟主机所共享	
		
		在tomcat/conf/servler.xml的<Host>标签下配置<Context>	只对当前web应用起作用
		在tomcat/conf/Catalina/主机名/XXXXXX.xml配置<Context>	只对当前web应用起作用		
		在web应用的META-INF目录创建context.xml配置<Context>		只对当前web应用起作用		
					
	2)在<Cotext>中配置
		<Resource
		name="mySource" 在数据源绑定到jndi容器时使用的名字
		auth="Container" 
		type="javax.sql.DataSource" 当前对象类型
		username=用户名
		password=密码
		driverClassName=数据库驱动类全名
		url=数据库地址
		maxActive=最大连接数
		maxIdle=最大空闲连接数 />
			
	3)在Servlet中获取数据源
		必须在Servlet中执行,才能获取tomcat内置数据源
		Context jndi = (Context) new InitialContext().lookup("java:comp/env");
		DataSource source = (DataSource) jndi.lookup("mySource");		
		Connection conn = source.getConnection();
		
		JNDI(Java Naming and Directory Interface),对应于J2SE的javax.naming包		
		把Java对象放在JNDI容器,为java对象取名,通过名称可检索出对象,
		Context代表JNDI容器,context.lookup方法可检索容器中的对象。