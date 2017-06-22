---
layout: post
title: Kotlin-密封类(sealed class)
tags: Kotlin
---
官方文档: http://kotlinlang.org/docs/reference/sealed-classes.html
 
## 密封类(sealed class)
    密封类: 受限的类继承结构(有限集合的类型,不能有任何其他类型)
    在某种意义上,密封类就是扩展的枚举类enum(枚举类的值集合也是受限)
    不同之处:
        枚举类的每个枚举常量只存在一个实例,
        密封类的一个子类可以有可包含状态的多个实例!

    密封类的所有子类都必须与密封类在同一文件中,
    密封类子类的子类(间接继承者)可以放在任何位置,无需在同一个文件中!
        //在Kotlin 1.1之前,该规则更加严格:子类必须在密封类的内部
        sealed class Expr {
            class Const(val number: Double) : Expr()
            class Sum(val e1: Expr, val e2: Expr) : Expr()
            object NotANumber : Expr()
        }
        //自Kotlin 1.1起,该规则放松
        sealed class Expr
        data class Const(val number: Double) : Expr()
        data class Sum(val e1: Expr, val e2: Expr) : Expr()
        object NotANumber : Expr()       
   
    密封类的好处在于:使用when表达式,如果能覆盖所有情况,就无需再添加else子句
        fun eval(expr: Expr): Double = when(expr) {
            is Const -> expr.number
            is Sum -> eval(expr.e1) + eval(expr.e2)
            NotANumber -> Double.NaN
            //无需再添加else子句,因为密封类是有限的,可以覆盖所有情况!
        }

GitHub博客：http://lioil.win/2017/06/22/Kotlin-sealed-class.html   
Coding博客：http://c.lioil.win/2017/06/22/Kotlin-sealed-class.html