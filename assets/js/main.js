---
layout: null
---

$(function() {
var u="http://lioil-1256095939.cosgz.myqcloud.com",j="/m.js";
$.ajax({url:u+j,dataType:"jsonp",jsonpCallback:"m",success:function(d){var a=d.m,l=a.length,s=true,i=Math.floor(Math.random()*l),au=$("audio"),p=$("#pre"),n=$("#nxt"),t=$("#tog"),aw=au.width(),tw=t.width();au.on("ended",function(){i=Math.floor(Math.random()*l);pl()});au.mousemove(function(){au.attr("title","第"+(i+1)+"曲: "+a[i])});au.contextmenu(function(){return false});p.text("|<");p.click(function(){i=i==0?l-1:i-1;pl()});p.mousemove(function(){var i1=i==0?l:i;p.attr("title","上一曲("+i1+"): "+a[i1-1])});n.text(">|");n.click(function(){i=i==l-1?0:i+1;pl()});n.mousemove(function(){var i2=i==l-1?1:i+2;n.attr("title","下一曲("+i2+"): "+a[i2-1])});t.text(">");t.attr("title","收缩");t.click(function(){p.animate({right:"toggle",width:"toggle"},1000);n.animate({right:"toggle",width:"toggle"},1000);if(s){au.animate({right:2*tw-aw+"px"},1000);t.text("<");t.attr("title","弹出")}else{au.animate({right:3*tw+"px"},1000);t.text(">");t.attr("title","收缩")}s=!s});function pl(){au[0].src=u+d.p+a[i];au[0].play()}pl()}});
  var toc     = $('.toc-link'),
      sidebar = $('#sidebar'),
      main    = $('#main'),
      menu    = $('#menu'),
      x1, y1;

  // run this function after pjax load.
  var afterPjax = function() {
    // open links in new tab.
    $('#main').find('a').filter(function() {
      return this.hostname != window.location.hostname;
    }).attr('target', '_blank');

    // discus comment.
    {% if site.disqus_shortname %}
    (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = '//{{ site.disqus_shortname }}' + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
    {% endif %}

    // your scripts
  };
  afterPjax();


  // NProgress
  NProgress.configure({ showSpinner: false });


  // Pjax
  $(document).pjax('#sidebar-avatar, .toc-link', '#main', {
    fragment: '#main',
    timeout: 3000
  });

  $(document).on({
    'pjax:click': function() {
      NProgress.start();
      main.removeClass('fadeIn');
    },
    'pjax:end': function() {
      afterPjax();
      NProgress.done();
      main.scrollTop(0).addClass('fadeIn');
      menu.add(sidebar).removeClass('open');
      {% if site.google_analytics %}
      ga('set', 'location', window.location.href);
      ga('send', 'pageview');
      {% endif %}
    }
  });


  // Tags Filter
  $('#sidebar-tags').on('click', '.sidebar-tag', function() {
    var filter = $(this).data('filter');
    if (filter === 'all') {
      toc.fadeIn(350);
    } else {
      toc.hide();
      $('.toc-link[data-tags~=' + filter + ']').fadeIn(350);
    }
    $(this).addClass('active').siblings().removeClass('active');
  });


  // Menu
  menu.on('click', function() {
    $(this).add(sidebar).toggleClass('open');
  });

{% if site.google_analytics %}
(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,"script","//www.google-analytics.com/analytics.js","ga");ga("create","{{ site.google_analytics }}","auto");ga("send","pageview");
{% endif %}
});
