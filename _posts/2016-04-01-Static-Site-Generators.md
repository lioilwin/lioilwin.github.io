---
layout: post
title: 静态网站生成器大总结(Static-Site-Generators)
tags: Html_Xml
---
# 一.介绍

静态网站生成器到底有多少呢？GitHub用户对静态博客生成程序进行了大规模总结，太多了啊，太恐怖，萌新被吓傻了……       
GitHub地址: https://github.com/pinceladasdaweb/Static-Site-Generators

我选了jekyll博客, 因为两大代码仓库GitHub(国外)和Coding(国内)都提供免费空间自动构建Jekyll网站！	  
我的博客同时部署在GitHub Pages和Coding Pages，感谢Github的各路同行奉献，让我有幸能用到这么方便的高效工具，制作自己喜欢的博客。
当然还要感谢GitHub和Coding网站，能让我这样一穷二白且毫无商业价值的码畜，免费使用服务器空间！   
近期发现Coding Pages部署网站大小不能超过100M, 还没发现GitHub Pages有大小限制！
   
GitHub和Coding的默认博客地址都太长了，不好记忆，
所以我在阿里云买了十年域名lioil.win，域名.win太便宜了，没商业价值没人要!       
GitHub博客: http://lioil.win     
Coding博客: http://c.lioil.win

# 二.在windows安装jekyll	

	1.下载Ruby
		1.1点击安装Ruby
		1.2添加环境变量,输入命令查看版本 ruby -v
	
	2.下载RubyDevKit,模拟Linux的gcc编译
		2.1点击安装RubyDevKit
		2.2在config.yml文件加入Ruby安装目录
			- xx\xx\Ruby		
		2.3初始化命令
			ruby dk.rb init
			ruby dk.rb install
		
	3.输入Jekyll安装命令(需联网下载软件)
		3.1换镜像源 gem sources --add http://gems.ruby-china.org --remove https://rubygems.org		
		3.2安装 gem install jekyll	
		3.3安装 gem install jekyll-sitemap
		
		查看镜像源 gem sources -l
		查看已安装软件 gem list
		查询远程软件库 gem query –r 软件名
		
	4.生成和运行网站命令
		4.1生成网站模板	jekyll new mysite	
		4.2运行网站
			cd mysite
			jekyll s
				
		在_posts中存放文章,输入命令jekyll s
		在浏览器打开http://127.0.0.1:4000,查看网站
		下划线开头文件夹会被jekyll编译成html和css,其它文件夹保持原样
				
	注意：
		因为众所周知原因,国外镜像源经常不可用,一定要将RubyGems镜像源改为国内的！
		网上流传淘宝的镜像源已经不可用,我被坑了很久啊,血泪的教训啊！
		花了很多时间才在Ruby中文社区找到新镜像源https://gems.ruby-china.org
		
# 三.在GitHub或Coding部署jekyll网站

	1.注册登陆GitHub 或Coding网站
	2.创建代码仓库
	3.找到GitHub Pages 或GitHub Pages设置,可以添加自己域名
	4.把本地jekyll网站上传到代码仓库,GitHub 或Coding都会默认用jekyll工具生成网站
	
# 四.工具汇总列表

GitHub地址: https://github.com/pinceladasdaweb/Static-Site-Generators

## 编程语言汇总

* [.NET](#net)
* [Awk](#awk)
* [Bash](#bash)
* [C++](#c)
* [C#](#c-sharp)
* [C and Perl](#c-and-perl)
* [Clojure](#clojure)
* [Common Lisp](#common-lisp)
* [Dropbox](#dropbox)
* [Elixir](#elixir)
* [Erlang](#erlang)
* [Go](#go)
* [Groovy](#groovy)
* [Haskell](#haskell)
* [Java](#java)
* [Language Agnostic](#language-agnostic)
* [Lua](#lua)
* [Nimrod](#nimrod)
* [Node.js](#nodejs)
* [OCaml](#ocaml)
* [PHP](#php)
* [Python](#python)
* [Racket](#racket)
* [Ruby](#ruby)
* [Rust](#rust)
* [Scala](#scala)
* [Scheme](#scheme)
* [Shell](#shell)
* [Tcl](#tcl)

## .NET

* [Pretzel](https://github.com/Code52/pretzel)
* [Wyam](http://wyam.io)

## Awk

* [zodiac](https://github.com/nuex/zodiac)

## Bash

* [baker](https://github.com/taylorchu/baker/)
* [bashblog](https://github.com/carlesfe/bashblog)
* [NanoBlogger](http://nanoblogger.sourceforge.net/)
* [Pagegen](http://pagegen.phnd.net/)
* [SKF](http://skf.jeannedhack.org/)

## C++

* [Leo](http://leohtml.sourceforge.net/)

## C Sharp

* [Graze](https://github.com/mikoskinen/graze)

## C and Perl

* [BlazeBlogger](http://blaze.blackened.cz/)
* [blosxom](http://blosxom.sourceforge.net/documentation/users/configure/static.html)
* [Bryar](https://metacpan.org/pod/Bryar::Frontend::Static)
* [Dapper](http://vanilladraft.com/dapper/)
* [HiD](https://metacpan.org/pod/HiD)
* [ikiwiki](https://ikiwiki.info/)
* [Papery](https://metacpan.org/pod/Papery)
* [Quietly::Confident](http://search.cpan.org/dist/Quietly-Confident/qc.pod)
* [StaticVolt](https://metacpan.org/pod/StaticVolt)
* [Statocles](https://metacpan.org/pod/Statocles)
* [Templer](https://github.com/skx/templer)
* [Website Meta Language](http://www.thewml.org/)
* [XDO](http://www.idocs.com/xdo/)
* [Zucchini](https://metacpan.org/pod/Zucchini)

## Clojure

* [Cryogen](http://cryogenweb.org/)
* [incise](http://www.ryanmcg.com/incise/)
* [misaki](https://github.com/liquidz/misaki)
* [Static](http://nakkaya.com/static.html)

## Common Lisp

* [coleslaw](http://www.cliki.net/coleslaw)
* [regenerate](https://gist.github.com/TeMPOraL/4190622)

## Dropbox

* [900dpi](http://900dpi.com/)
* [Blogmark](https://blogmark.me/)
* [Brace](http://brace.io/)
* [Calepin](http://calepin.co/)
* [Chili](http://chilipy.com/)
* [Cloud Cannon](http://cloudcannon.com/)
* [Drapache](https://github.com/louissobel/Drapache)
* [DropPages](http://droppages.com/)
* [KISSr](http://www.kissr.com/)
* [Pancake.io](https://www.pancake.io/)
* [Scriptogr.am](http://scriptogr.am/)
* [Site44](http://www.site44.com/)
* [Sitebox.io](http://www.sitebox.io/)
* [Telegram](https://telegr.am/)
* [Yoozon](https://yoozon.com/)

## Elixir

* [Obelisk](https://github.com/BennyHallett/obelisk)

## Erlang

* [LambdaPad](https://github.com/gar1t/lambdapad)

## Go

* [gor](https://github.com/wendal/gor)
* [gostatic](https://github.com/piranha/gostatic)
* [Hastie](https://github.com/mkaz/hastie)
* [Hugo](http://hugo.spf13.com/)
* [jkl](https://github.com/drone/jkl)
* [kkr](https://github.com/dchest/kkr)

## Groovy

* [Grain](http://sysgears.com/grain/)
* [Rizzo](https://github.com/fifthposition/rizzo/)

## Haskell

* [Hakyll](http://jaspervdj.be/hakyll/)
* [yst](https://github.com/jgm/yst)

## Java

* [FMPP](http://fmpp.sourceforge.net/)
* [JBake](http://jbake.org/)
* [StaGen](https://github.com/wiztools/stagen)

## Language Agnostic

* [Hammer](http://hammerformac.com/)
* [LiveReload](http://livereload.com/)
* [Mixture](http://mixture.io/)
* [Site builder console](http://sitebuilder.codeplex.com/)
* [StaticMate](https://staticmate.com/)
* [vimwiki](https://github.com/vim-scripts/vimwiki)

## Lua

* [Luapress](https://github.com/Fizzadar/Luapress)

## Nimrod

* [ipsum genera](https://github.com/dom96/ipsumgenera)

## Node.js

* [antwar](https://github.com/antwarjs/antwar)
* [Apto](https://github.com/modparadigm/apto)
* [Assemble](http://assemble.io)
* [Automaton](http://indigounited.com/automaton/)
* [BAM](https://npmjs.org/package/bam)
* [Bi Sheng](https://github.com/benjycui/bisheng)
* [blacksmith](https://github.com/flatiron/blacksmith/)
* [Blode](https://github.com/stackoverflow/blode)
* [Bloguizim](https://github.com/bloguizim/bloguizim)
* [bread](https://github.com/pvorb/node-bread)
* [Broccoli Taco](http://broccoli-taco.com/)
* [Brunch](http://brunch.io/)
* [Cabin](http://www.cabinjs.com/)
* [CMS.js](https://github.com/cdmedia/cms.js)
* [Codex](https://github.com/logicalparadox/codex)
* [Conf-Boilerplate](https://github.com/braziljs/conf-boilerplate) (For Conference and Events)
* [Derby](http://derbyjs.com/)
* [DocPad](https://github.com/bevry/docpad)
* [Easystatic](https://github.com/easystatic/easystatic)
* [Enfield](https://github.com/fortes/enfield)
* [Equiprose](https://github.com/thibaultCha/Equiprose)
* [Gabby](https://github.com/alexmingoia/gabby)
* [Gatsby](https://github.com/gatsbyjs/gatsby)
* [generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp)
* [Genesis](http://forge.synthmedia.co.uk/genesis/)
* [ghost-render](https://github.com/mixu/ghost-render)
* [GloriaJS](https://gloriajs.com/)
* [Go-Static!](https://github.com/colynb/generator-go-static)
* [Grunt](http://gruntjs.com/)
* [GruntStart](http://tsvensen.github.io/GruntStart/)
* [grunt-bear](https://github.com/tvooo/grunt-bear)
* [Grunt-Carpenter](https://github.com/TxSSC/grunt-carpenter)
* [grunt-html-builder](https://github.com/aaaristo/grunt-html-builder)
* [grunt-stencil](https://github.com/cambridge-healthcare/grunt-stencil)
* [gulp-ssg](https://github.com/paulwib/gulp-ssg)
* [Harmonic](https://github.com/es6rocks/harmonic)
* [Harp](http://harpjs.com)
* [Heckle](http://macwright.org/heckle/)
* [Hexo](https://github.com/tommy351/hexo)
* [Hoodie](http://hood.ie/)
* [jen](https://github.com/rfunduk/jen)
* [Jekyde](http://zohooo.github.io/jekyde/)
* [Jott](https://github.com/jonsherrard/jott)
* [Kel](https://github.com/koostudios/kel)
* [Kerouac](https://github.com/jaredhanson/kerouac)
* [Lineman](https://github.com/testdouble/lineman)
* [Lingon](https://github.com/jpettersson/lingon)
* [Lumbar](https://github.com/walmartlabs/lumbar)
* [markdown-styles](https://github.com/mixu/markdown-styles)
* [markx](https://github.com/jgallen23/markx)
* [Metalsmith](http://www.metalsmith.io/)
* [Mimosa](http://mimosajs.com/)
* [modan](https://github.com/r7kamura/modan)
* [Modjs](http://modulejs.github.io/modjs/)
* [Nirman](https://github.com/anupshinde/nirman)
* [Nico](http://lab.lepture.com/nico/)
* [node-blog](https://github.com/creationix/node-blog)
* [node-buster](https://github.com/cassiobsilva/node-buster)
* [node-jekyll](https://github.com/wangbus/node-jekyll)
* [noflo-jekyll](https://github.com/the-grid/noflo-jekyll)
* [Nog](https://github.com/c9/nog)
* [pagen](https://github.com/jawerty/pagen)
* [Petrify](https://github.com/caolan/petrify)
* [Phenomic](https://phenomic.io/)
* [Poet](http://jsantell.github.io/poet/)
* [Pop](https://github.com/alexyoung/pop)
* [Propeller](https://github.com/thegreatsunra/propeller)
* [Punch](https://github.com/laktek/punch)
* [Qabex](https://github.com/shanewholloway/node-qssg)
* [Quick Start Guide Template](https://github.com/tjvantoll/quick-start-template)
* [Quill](https://npmjs.org/package/quill)
* [React Static Site](https://github.com/BradDenver/react-static-site)
* [React Static Site Webpack plugin](https://github.com/pierresaux/react-static-site-webpack-plugin)
* [React + Webpack](http://jxnblk.com/writing/posts/static-site-generation-with-react-and-webpack/)
* [Reptar](http://reptar.github.io/)
* [romulus](https://github.com/felixge/node-romulus)
* [roots](http://roots.cx/)
* [Rufio](https://github.com/wesleytodd/rufio)
* [Surge](https://surge.sh/)
* [Scotch](https://github.com/techwraith/scotch)
* [Situs](https://github.com/fians/situs)
* [squareboy](https://github.com/harsha-mudi/squareboy)
* [Staticman](https://staticman.net/)
* [static site generator webpack plugin](https://github.com/markdalgleish/static-site-generator-webpack-plugin)
* [Static Site Starter Kit](https://github.com/kriasoft/static-site-starter)
* [statil](https://github.com/Mitranim/statil)
* [Statix](https://github.com/ff0000/statix)
* [SuSi](https://github.com/AVGP/susi)
* [Szyslak](https://github.com/ido50/Szyslak)
* [Techy](http://krasimir.github.io/techy/)
* [thumbsup](https://github.com/rprieto/thumbsup)
* [volo](http://volojs.org/)
* [wainwright](https://github.com/wprl/wainwright)
* [Wanna](https://github.com/shaoshuai0102/wanna)
* [Wheat](https://github.com/creationix/wheat)
* [Wikismith](http://www.wikismith.com/)
* [Wintersmith](http://jnordberg.github.io/wintersmith/)
* [Woods](https://github.com/studiomoniker/woods)
* [yassg](https://npmjs.org/package/yassg)
* [Yeoman](http://yeoman.io/)

## OCaml

* [Stog](http://zoggy.github.io/stog/)
* [Ultra Simple Site Maker](http://loup-vaillant.fr/projects/ussm/)

## PHP

* [Animal](https://github.com/billpatrianakos/animal-f)
* [BloggerCMS](https://github.com/sarfraznawaz2005/BloggerCMS)
* [Carew](http://carew.github.io/)
* [Couscous](http://couscous.io/)
* [Dropplets](https://github.com/Circa75/dropplets)
* [Fansoro](http://fansoro.org/)
* [Grav](http://getgrav.org/)
* [Gumdrop](http://gumdropapp.com/)
* [PHPoole](http://phpoole.org/)
* [Phrozn](http://www.phrozn.info/en/)
* [PieCrust](http://bolt80.com/piecrust/)
* [Purepress](https://github.com/megakote/purepress)
* [Sculpin](http://sculpin.io/)
* [Second Crack](https://github.com/marcoarment/secondcrack)
* [SG](https://github.com/maxailloud/SG)
* [Site-builder](https://github.com/inanimatt/site-builder)
* [SiteMaker](https://github.com/yqtaku/site-maker)
* [Snowshoe](https://github.com/edvanbeinum/snowshoe)
* [Spress](https://github.com/yosymfony/Spress)
* [Stacey](https://github.com/kolber/stacey)
* [Statamic](http://www.statamic.com/)
* [Static](https://github.com/juy/static)
* [Tempo](https://github.com/catnapgames/Tempo)
* [Vaseman](http://about.asika.tw/vaseman/)
* [Yellow](http://github.com/datenstrom/yellow)
* [Wadoo](https://github.com/alpacaaa/wadoo)

## Python

* [Acrylamid](https://github.com/posativ/acrylamid)
* [Blatter](https://bitbucket.org/jek/blatter/)
* [Blogofile](http://www.blogofile.com/)
* [Blogen](https://github.com/ipconfiger/blogen)
* [buster](https://github.com/axitkhurana/buster)
* [Cactus](http://cactusformac.com/)
* [Chisel](https://github.com/dz/chisel)
* [Cipherpress](https://github.com/lejonet/Cipherpress)
* [Composer](https://github.com/shazow/composer)
* [cyrax](https://pypi.python.org/pypi/cyrax)
* [django-medusa](https://github.com/mtigas/django-medusa/)
* [djangothis](https://github.com/amitu/djangothis/)
* [drupan](https://github.com/fallenhitokiri/drupan)
* [Elyse](https://github.com/FSX/elyse)
* [Engineer](https://github.com/tylerbutler/engineer)
* [Firedrop2](http://www.voidspace.org.uk/python/firedrop2/)
* [fjord](http://dkuntz2.github.io/fjord/)
* [Floyd](https://github.com/nikcub/floyd)
* [Fragments](http://glyphobet.github.io/fragments/)
* [Frozen-Flask](http://pythonhosted.org/Frozen-Flask/)
* [Glynn](https://github.com/teiko/glynn)
* [growl](https://github.com/xfire/growl/)
* [Halwa](https://github.com/mhlakhani/halwa)
* [handcrank](https://pypi.python.org/pypi/handcrank)
* [Hyde](https://github.com/lakshmivyas/hyde)
* [Igor](https://github.com/aconbere/igor)
* [Jinja](http://jinja.pocoo.org/)
* [jinjet](https://github.com/jokull/jinjet)
* [Lektor](https://www.getlektor.com/)
* [Letterpress](https://github.com/an0/Letterpress)
* [Lightning](https://github.com/borismus/lightning)
* [lilac](https://lilac.readthedocs.org/en/latest/index.html)
* [Logya](https://github.com/yaph/logya)
* [Mako](http://www.makotemplates.org/)
* [Markbox](https://github.com/myfreeweb/markbox)
* [Markdoc](http://markdoc.org/)
* [MkDocs](http://www.mkdocs.org/)
* [mynt](http://mynt.mirroredwhite.com/)
* [Nib](https://github.com/jreese/nib)
* [Nikola](http://nikola.ralsina.com.ar/)
* [Obraz](http://obraz.pirx.ru/)
* [Pelican](https://github.com/getpelican/pelican/)
* [PILCROW](http://inky.github.io/pilcrow/)
* [Poole](https://bitbucket.org/obensonne/poole)
* [PyBlosxom](http://pyblosxom.github.io/)
* [PyKwiki](http://pykwiki.nullism.com/)
* [Pyll](https://github.com/arthurk/pyll)
* [rstblog](https://github.com/mitsuhiko/rstblog)
* [Serious Chicken](http://rtorr.github.io/serious-chicken/)
* [sg](https://github.com/venthur/sg)
* [Socrates](http://honza.ca/socrates/)
* [Speech Hub](https://github.com/alvesjnr/speechhub)
* [Sphinx](http://sphinx-doc.org/)
* [Squirrel](https://github.com/nickpetty/squirrel)
* [Stadø](http://stadoproject.org/)
* [staticjinja](https://github.com/Ceasar/staticjinja)
* [StrangeCase](https://github.com/colinta/StrangeCase)
* [Syte](https://github.com/rigoneri/syte)
* [Tags](http://tags.brace.io/)
* [tahchee](https://github.com/sebastien/tahchee)
* [Tinkerer](http://tinkerer.me/)
* [Voldemort](https://github.com/semk/voldemort)
* [Volt](https://github.com/bow/volt/)
* [Webber](http://gitorious.org/webber)
* [Wok](https://github.com/mythmon/wok)

## Racket
* [Frog](https://github.com/greghendershott/frog)

## Ruby

* [Ace](https://github.com/botanicus/ace)
* [Bonsai](http://tinytree.info/)
* [Brochure](https://github.com/sstephenson/brochure)
* [deplot](https://github.com/cdn64/deplot)
* [DynamicMatic](https://github.com/nex3/dynamicmatic)
* [Fairytale](https://github.com/46Bit/fairytale)
* [Frank](https://github.com/blahed/frank)
* [gollum-site](https://github.com/dreverri/gollum-site)
* [Gravity](https://github.com/owainlewis/gravity)
* [High Voltage](https://github.com/thoughtbot/high_voltage)
* [hobix](http://hobix.github.io/hobix/)
* [Hobix](https://github.com/hobix/hobix/)
* [Jekyll](https://github.com/mojombo/jekyll)
* [korma](https://github.com/sandal/korma)
* [Laze](http://avdgaag.github.io/laze/)
* [Machined](https://github.com/petebrowne/machined)
* [Magneto](https://github.com/donmelton/magneto)
* [Massimo](https://github.com/petebrowne/massimo)
* [Middleman](http://middlemanapp.com/)
* [Moka](https://github.com/lucaong/Moka)
* [Nanoc](http://nanoc.ws/)
* [NestaCMS](http://nestacms.com/)
* [Octopress](http://octopress.org/)
* [Pith](https://github.com/mdub/pith)
* [Rakeweb](http://rubyforge.org/projects/rakeweb/)
* [Rassmalog](http://snk.tuxfamily.org/lib/rassmalog/doc/guide.html)
* [Rog](http://rog.rubyforge.org/)
* [rote](http://rote.rubyforge.org/)
* [RubyFrontier](http://www.apeth.com/RubyFrontierDocs/default.html)
* [Ruhoh](http://ruhoh.com/)
* [Serif](https://github.com/aprescott/serif)
* [Serve](http://get-serve.com/)
* [Shelob](https://github.com/rubyworks/shelob)
* [stasis](http://stasis.me/)
* [StaticMatic 2](https://github.com/mindeavor/staticmatic2)
* [StaticMatic](http://rubyforge.org/projects/staticmatic/)
* [StaticWeb](http://staticweb.rubyforge.org/)
* [Striker](https://github.com/swaroopsm/striker)
* [toto](https://github.com/cloudhead/toto)
* [Webby](http://webby.rubyforge.org/)
* [webgen](http://webgen.rubyforge.org/)
* [Yurt CMS](http://yurtcms.roberthahn.ca/)
* [zenweb](http://www.zenspider.com/projects/zenweb.html)
* [{ :awestruct }](http://awestruct.org/)

## Rust
* [cobalt.rs](https://github.com/cobalt-org/cobalt.rs)

## Scala
* [monkeyman](https://github.com/wspringer/monkeyman)
* [Scalate](https://github.com/scalate/scalate)

## Scheme
* [Hyde](http://wiki.call-cc.org/eggref/4/hyde)

## Shell

* [Exposé](https://github.com/Jack000/Expose)
* [fugitive](https://gitorious.org/fugitive)
* [rawk](https://github.com/kisom/rawk)
* [simple-static](https://github.com/wlangstroth/simple-static)
* [sw](https://github.com/jroimartin/sw)
* [Utterson](https://github.com/stef/utterson)
* [Vee](http://www.0x743.com/vee/)
* [werc](http://werc.cat-v.org/)

## Tcl

* [Tclssg](https://github.com/dbohdan/tclssg)	


简书：http://www.jianshu.com/p/42dcb7784f42   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/51038561   
GitHub博客: http://lioil.win/2016/04/01/Static-Site-Generators.html   
Coding博客: http://c.lioil.win/2016/04/01/Static-Site-Generators.html