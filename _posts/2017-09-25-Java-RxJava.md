---
layout: post
title: JavaSE-RxJava2笔记
tags: JavaSE
---
参考：  
http://blog.csdn.net/maplejaw_/article/details/52442065  
http://www.jianshu.com/nb/5864063

去年RxJava2.x发布了，与RxJava1.x相比，使用上有不少改动(只是API函数名改了,而使用流程思维不变)，故在此记录笔记存档！

## 一.基本用法
### 1.创建Observable(被观察者/发布者/发射者)   
    (1)create()
    Observable observable = Observable.create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(@NonNull ObservableEmitter<String> observableEmitter) throws Exception {
            observableEmitter.onNext("发布数据1");
            observableEmitter.onNext("发布数据2");
            observableEmitter.onError(new Throwable("发生错误"));          
            observableEmitter.onComplete(); //完成
        }
    });

    (2)just
    Observable observable = Observable.just("发布数据1", "发布数据2");

    (3)fromIterable, fromArray
    ArrayList<String> list = new ArrayList<>();
    list.add("发布数据1");
    list.add("发布数据2");
    Observable observable = Observable.fromIterable(list);

    (4)range,第一个参数为起始值,第二个为发送的个数,如果为0则不发送，负数则抛异常
    Observable observable = Observable.range(10, 5)

    (5)defer,延期,有观察者订阅时才创建Observable
    Observable observable = Observable.defer(new Callable<ObservableSource>() {
        @Override
        public ObservableSource call() throws Exception {
            return Observable.just("发布数据1","发布数据2");
        }
    });

    (6)interval,定时周期发布数据
     Observable observable = Observable.interval(500, TimeUnit.MILLISECONDS); //周期500ms

    (7)timer,延迟发布数据
    Observable observable = Observable.timer(300, TimeUnit.MILLISECONDS); //延迟300ms

    (8)repeat,重复发布数据
    Observable observable = Observable.just("发布数据1").repeat(3); //重复发布3次

### 2.创建Observer(观察者/订阅者/接收者)
    (1).Observer完整形式
    Observer observer = new Observer() {
        @Override
        public void onSubscribe(@NonNull Disposable disposable) {
            //Disposable 相当于RxJava1.x中的Subscription,用于解除订阅
        }

        @Override
        public void onNext(@NonNull Object o) {
            //接收数据
        }

        @Override
        public void onError(@NonNull Throwable throwable) {
            //接收错误
        }

        @Override
        public void onComplete() {
            //通知完成
        }
    };

    (2).Observer简写形式
    Consumer onNext = new Consumer() {//接收数据
        @Override
        public void accept(Object o) throws Exception {
        }
    };

    Consumer<Throwable> onError = new Consumer<Throwable>() {//接收错误
        @Override
        public void accept(Throwable throwable) throws Exception {
        }
    };

    Action onComplete = new Action() {//通知完成
        @Override
        public void run() throws Exception {
        }
    };

    Consumer<Disposable> onSubscribe = new Consumer<Disposable>() {
        @Override
        public void accept(Disposable disposable) throws Exception {
        }
    };

### 3.Observer订阅Observable
    (1).Observer完整订阅
    observable.subscribe(observer); //订阅

    (2).Observer简写订阅
    observable.subscribe(onNext);
    observable.subscribe(onNext, onError);
    observable.subscribe(onNext, onError, onComplete);
    observable.subscribe(onNext, onError, onComplete, onSubscribe);

## 二.线程调度
    调度器类型
    Schedulers.computation( )  用于计算任务，如事件循环或和回调处理，不要用于IO操作(IO操作请使用Schedulers.io())；默认线程数等于处理器的数量
    Schedulers.from(executor)  使用指定的Executor作为调度器
    Schedulers.io( )	       用于IO密集型任务，如异步阻塞IO操作，这个调度器的线程池会根据需要增长；
                               对于普通的计算任务，请使用Schedulers.computation()；
                               Schedulers.io( )默认是一个CachedThreadScheduler，很像一个有线程缓存的新线程调度器
    Schedulers.newThread( )    为每个任务创建一个新线程
    Schedulers.trampoline( )   当其它排队的任务完成后，在当前线程排队开始执行
    AndroidSchedulers.mainThread()  此调度器为RxAndroid特有，顾名思义，运行在Android UI线程上

    Observable.just("耗时操作...")
        .subscribeOn(Schedulers.io())//io线程-发布者
        .observeOn(AndroidSchedulers.mainThread())//主线程-接收者
        .subscribe(new Consumer<String>() {
            @Override
            public void accept(String s) throws Exception {                        
            }
        });

## 三.常用操作符
### 1.map-数据类型转换
    Observable.just("123")
        .map(new Function<String, Integer>() {
            @Override
            public Integer apply(@NonNull String s) throws Exception {
                return Integer.parseInt(s);
            }
        })
        .subscribe(new Consumer<Integer>() {
            @Override
            public void accept(Integer integer) throws Exception {
                System.out.println(integer);
            }
        });
### 2.flatMap-数据集合扁平化(遍历循环每一个元素)
    List<String> list = new ArrayList<>();
    list.add("1");
    list.add("2");
    list.add("3");
    List<List<String>> listSSS = new ArrayList<>();//二维数组集合
    listSSS.add(list);
    Observable.fromIterable(listSSS)
    .flatMap(new Function<List<String>, ObservableSource<String>>() {
        @Override
        public ObservableSource<String> apply(@NonNull List<String> list) throws Exception {
            return Observable.fromIterable(list);
        }
    })
    .subscribe(new Consumer<String>() {
        @Override
        public void accept(String s) throws Exception {
            System.out.println(s);
        }
    });

### 3.map-缓存满后,以list集合发送数据
    List<String> list = new ArrayList<>();
    list.add("1");
    list.add("2");
    list.add("3");
    Observable.fromIterable(list)
        .buffer(list.size())  //缓存一起发送
        .subscribe(new Consumer<List<String>>() {
            @Override
            public void accept(List<String> list) throws Exception {
                System.out.println(list.size());
            }
        });

### 4.take(n)-发送前n项数据
    Observable.just(1, 2, 1, 1, 2, 3)
        .take(3) //发送前3项数据
        .subscribe(new Consumer<Integer>() {
            @Override
            public void accept(Integer integer) throws Exception {
                System.out.println(integer);
            }
        });

### 5.distinct-去除重复项
    Observable.just(1, 2, 1, 1, 2, 3)
        .distinct() //去重
        .subscribe(new Consumer<Integer>() {
            @Override
            public void accept(Integer integer) throws Exception {
                System.out.println(integer);
            }
        });

### 6.filter-过滤
    Observable.just(1, 2, 3, 4, 5)
        .filter(new Predicate<Integer>() {
            @Override
            public boolean test(@NonNull Integer integer) throws Exception {
                return integer > 3; //过滤大于3
            }
        })
        .subscribe(new Consumer<Integer>() {
            @Override
            public void accept(Integer integer) throws Exception {
                System.out.println(integer);
            }
        });

## 五.Flowable-背压
    Flowable是RxJava2.x中新增的类，专门用于应对背压Backpressure问题
    背压: 即生产者的速度大于消费者的速度带来的问题，比如在Android中常见的点击事件，点击过快则会造成点击两次的效果!
    Flowable.create(new FlowableOnSubscribe<Integer>() {
            @Override
            public void subscribe(FlowableEmitter<Integer> e) throws Exception {
                for (int i = 0; i < 10000; i++)
                    e.onNext(i);
                e.onComplete();
            }
    }, BackpressureStrategy.ERROR) //指定背压处理策略，抛出异常错
        .subscribeOn(Schedulers.computation())
        .observeOn(Schedulers.newThread())
        .subscribe(new Consumer<Integer>() {
            @Override
            public void accept(Integer integer) throws Exception {
                System.out.println(integer);
                Thread.sleep(1000);
            }
        }, new Consumer<Throwable>() {
            @Override
            public void accept(Throwable throwable) throws Exception {
                System.out.println(throwable);
            }
        });

    // 如Rxjava1.x一样简写
    Flowable.range(1,10000)
    .onBackpressureDrop() // 背压
    .subscribe(new Consumer<Integer>() {
        @Override
        public void accept(Integer integer) throws Exception {
            System.out.println(integer);
        }
    });

## 四.Subject
    Subject extends Observable implements Observe
    作用:
        可充当Observable
        可充当Observer
        是Observable和Observer之间的桥梁        
    Subject有四个实现类: AsyncSubject, BehaviorSubject, PublishSubject, ReplaySubject
    注意：
        从多个线程中调用onNext(on系列方法),需要使用串行化Serialized,才能顺序调用！
        SerializedSubject<String, Integer> ser = new SerializedSubject(publishSubject);

    Processor和Subject的作用相同,其中Processor是RxJava2.x新增的,继承自Flowable,所以支持背压控制
    //Processor
    AsyncProcessor<String> processor = AsyncProcessor.create();
    processor.subscribe(o -> Log.d("JG",o)); //three
    processor.onNext("one");
    processor.onNext("two");
    processor.onNext("three");
    processor.onComplete();

### 1.AsyncSubject只接收onCompleted()被调用前的最后一个数据
    AsyncSubject<String> asyncSubject = AsyncSubject.create();
    asyncSubject.onNext("asyncSubject1");
    asyncSubject.onNext("asyncSubject2");
    asyncSubject.onNext("asyncSubject3");
    asyncSubject.onComplete();
    asyncSubject.subscribe(new Consumer<String>() {
        @Override
        public void accept(String s) throws Exception {
            System.out.println(s);//只接收到asyncSubject3
        }
    });    

### 2.BehaviorSubject接收被订阅前的最后一个数据,还接收订阅后的数据
    BehaviorSubject<String> behaviorSubject = BehaviorSubject.create();
    behaviorSubject.onNext("behaviorSubject1");
    behaviorSubject.onNext("behaviorSubject2");
    behaviorSubject.subscribe(new Consumer<String>() {
        @Override
        public void accept(String s) throws Exception {
            System.out.println(s); //接收到behaviorSubject2, behaviorSubject3, behaviorSubject4
        }
    });
    behaviorSubject.onNext("behaviorSubject3");
    behaviorSubject.onNext("behaviorSubject4");

### 3.PublishSubject只接收被订阅后的数据
    PublishSubject<String> publishSubject = PublishSubject.create();
    publishSubject.onNext("publishSubject1");
    publishSubject.onNext("publishSubject2");
    publishSubject.subscribe(new Consumer<String>() {
        @Override
        public void accept(String s) throws Exception {
            System.out.println(s);只接收到behaviorSubject3, behaviorSubject4
        }
    });
    publishSubject.onNext("publishSubject3");
    publishSubject.onNext("publishSubject4");

### 4.ReplaySubject接收所有数据,无论何时订阅! 但缓存到一定大小时或一段时间后会丢弃旧的数据！
    ReplaySubject<String> replaySubject = ReplaySubject.create(); //默认初始缓存容量大小为16
    //replaySubject = ReplaySubject.create(100);//指定初始缓存容量大小为100
    //replaySubject = ReplaySubject.createWithSize(2);//只缓存订阅前最后2条数据
    //replaySubject = ReplaySubject.createWithTime(1,TimeUnit.SECONDS,Schedulers.computation());//只缓存被订阅前1秒内的数据
    replaySubject.onNext("replaySubject:pre1");
    replaySubject.onNext("replaySubject:pre2");
    replaySubject.onNext("replaySubject:pre3");
    replaySubject.subscribe(new Consumer<String>() {
        @Override
        public void accept(String s) throws Exception {
            System.out.println(s);
        }
    });
    replaySubject.onNext("replaySubject:after1");
    replaySubject.onNext("replaySubject:after2");

### 5.Subject作为桥梁,使用示例
    //1.Subject作为桥梁
    Subject<String> subject = BehaviorSubject.create();

    //2.订阅
    subject.subscribe(new Consumer<String>() {
        @Override
        public void accept(String s) throws Exception {
            System.out.println(s);
        }
    });

    //3.发布数据
    Observable.create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(@NonNull ObservableEmitter<String> observableEmitter) throws Exception {
            observableEmitter.onNext("as Bridge");
        }
    }).subscribe(subject);


简书: http://www.jianshu.com/p/724c937e3d0c  
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/78090944  
GitHub博客: http://lioil.win/2017/09/25/JavaSE-RxJava.html  
Coding博客: http://c.lioil.win/2017/09/25/JavaSE-RxJava.html  