---
layout: post
title: Kotlin-49.JavaScript模块(JavaScript Module)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/js-modules.html

## 1.JavaScript模块(JavaScript Modules)
    Kotlin允许把Kotlin项目编译为JavaScript模块,以下列表是可用js模块选项:
        1.默认选项: Plain,即不编译成任何模块,在全局作用域中以其名称访问模块;
        2.异步模块定义(Asynchronous Module Definition,简称AMD),常被require.js库使用;
        3.CommonJS惯例约定,广泛用于node.js/npm (require函数和module.exports对象)
        4.统一模块定义(Unified Module Definitions,简称UMD),与AMD,CommonJS兼容,
          当在运行时AMD和CommonJS都不可用时,作为plain使用!

## 2.选择目标模块系统(Choosing the Target Module System)
    目标模块系统取决于构建环境(即项目依赖,编译环境)

### 1.在IntelliJ IDEA中设置JS模块系统
    设置单个模块:
        打开"File -> Project Structure…",在"Modules"中找到模块,并选择"Kotlin",
        在"Module kind"字段中选择合适的模块系统!

    设置整个项目:
        打开"File -> Settings",选择"Build, Execution, Deployment" -> "Compiler" -> "Kotlin compiler",
        在"Module kind"字段中选择合适的模块系统!

### 2.在Maven中设置JS模块系统
    在pom.xml设置moduleKind属性,选择模块系统
        <plugin>
            <artifactId>kotlin-maven-plugin</artifactId>
            <groupId>org.jetbrains.kotlin</groupId>
            <version>${kotlin.version}</version>
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>js</goal>
                    </goals>
                </execution>
            </executions>

            <!-- moduleKind可用值: plain, amd, commonjs, umd -->
            <configuration>
                <moduleKind>commonjs</moduleKind>
            </configuration>          
        </plugin>

### 3.在Gradle中设置JS模块系统
   // 设置moduleKind属性, moduleKind可用值: plain, amd, commonjs, umd
    compileKotlin2Js.kotlinOptions.moduleKind = "commonjs"

## 3.@JsModule注解(@JsModule annotation)
    1.使用@JsModule注解,通知Kotlin一个external类/包/函数/属性是一个JavaScript模块!    
        // CommonJS模块,名叫hello
        module.exports.sayHello = function(name) { alert("Hello, " + name); }

        // 在Kotlin中声明
        @JsModule("hello")
        external fun sayHello(name: String)

    2.将@JsModule应用到包(Applying @JsModule to packages)
        一些JavaScript库导出包package(命名空间)而不是函数和类,
        从JavaScript角度看,包package是一个对象(成员是类/函数/属性),把包作为Kotlin对象导入,很不自然! 
        所以编译器允许使用以下notation将导入的JavaScript包映射到Kotlin包:
            // JavaScript模块声明, extModule
            module.exports = {
                foo: {                
                },
                C: {                
                }
            }

            // kotlin
            @file:JsModule("extModule")
            package ext.jspackage.name

            external fun foo()
            external class C

    提示：有@file:JsModule注解的文件不能声明非外部成员(non external)
            @file:JsModule("extModule")
            package ext.jspackage.name

            external fun foo()
            fun bar() = "!" + foo() + "!" // 编译期报错


    3.导入更深层次的包(Importing deeper package hierarchies)
        在前文示例中JavaScript模块导出单个包,但一些JavaScript库还会从模块中导出多个包,
        Kotlin也支持这种场景,但必须为每个导入的包声明一个新的.kt文件! 
        示例:
            // js模块
            module.exports = {
                mylib: {
                    pkg1: {
                        foo: function() {                        
                        },
                        bar: function() {                        
                        }
                    },
                    pkg2: {
                        baz: function() {                        
                        }
                    }
                }
            }

            // 在Kotlin中导入该js模块,必须编写两个Kotlin源文件
                @file:JsModule("extModule")
                @file:JsQualifier("mylib.pkg1")
                package extlib.pkg1

                external fun foo()
                external fun bar()

            // kotlin文件2
                @file:JsModule("extModule")
                @file:JsQualifier("mylib.pkg2")
                package extlib.pkg2

                external fun baz()

## 4.@JsNonModule注解
    当一个声明有@JsModule注解,如果不把它编译成JavaScript模块,就不能在Kotlin中使用它! 
    开发人员经常将js库既作为JavaScript模块,也作为可下载的.js文件分发到项目静态资源下,通过<script>元素导入! 
    使用@JsNonModule注解,可以让kotlin在非JavaScript模块环境中使用@JsModule声明:
        // JavaScript代码
        function topLevelSayHello(name) { alert("Hello, " + name); }
        if (module && module.exports) {
            module.exports = topLevelSayHello;
        }

        // kotlin
        @JsModule("hello")
        @JsNonModule
        @JsName("topLevelSayHello")
        external fun sayHello(name: String)

提示:
    Kotlin 以kotlin.js标准库作为单个文件分发, 该文件本身被编译成UMD模块,因此可以使用上述任何模块系统;
    也可以在NPM上使用kotlin package
            
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/75948979   
GitHub博客: http://lioil.win/2017/07/23/Kotlin-js-module.html   
Coding博客: http://c.lioil.win/2017/07/23/Kotlin-js-module.html