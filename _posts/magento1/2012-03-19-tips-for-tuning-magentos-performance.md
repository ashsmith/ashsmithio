---
title: 'Tips for Tuning Magento&#8217;s Performance'
author: Ash Smith
layout: post
share: true
permalink: /2012/03/tips-for-tuning-magentos-performance/
categories:
  - magento1
---
Magento is a fantastic system with a huge range of features, however with that comes a &#8220;slight&#8221; performance issue, whereby all the requests are long and slow and without a completely kick-ass server your site will struggle to load quickly. Luckily, provided you own a VPS or dedicated server there are many things you can do to combat the performance issues you&#8217;ll experience with Magento, which in the long run could save you money and time whilst speeding up your Magento websites dramatically!

## 1) Install a PHP accelerator

PHP Accelerators can improve PHP&#8217;s performance by ten-fold, so using an accelerator would be perfect for the likes of Magento, there are a number of PHP Accelerators such as: [eaccelerator][1], [APC][2], [ionCube][3], [XCache][4], [Zend Optimizer+][5]&#8230; the list goes on and on

PHP Accelerators work by caching a complied version of all the PHP scripts, and storing them in shared memory thus meaning the code is not read from the slow hard disk, and is already complied.

I personally installed eaccelerator on this server, and on our two production servers at work, we have seen a fantastic performance difference and even managed to reduce the overall server load. PHP Accelerators are a must if you ask me.

## 2) NGinx, reverse proxy set up

[nginx ][6](or engine x) is a http and reverse proxy server, as well as a mail proxy server. Now, nginx as a http server is far faster than Apache, setting nginx up as a reverse proxy (nginx receives http requests, serves static content and passes everything else onto Apache) is also far faster than using Apache alone, in most cases it can increase speed by 50% and decrease load by 50%. So, with that in mind you could now use a smaller server set up, and dramatically reduce costs.

Sadly I haven&#8217;t been able to install NGinx on our main production server which receives the most traffic, and therefore can&#8217;t truly speak for the performance difference. The reason for this is there appear to be too many things that could go wrong, we use Plesk on our main production server and all the guides and forum posts I have read covering this seem to experience issues with mail on Plesk, which is something I can&#8217;t risk. Perhaps I&#8217;ll set up a Plesk development server in the future and try that & I&#8217;ll report back how I managed to do it sometime in the future.

## 3) Disable unused magento modules

By disabling unused modules on Magento you can stop Magento from loading them and reduce the time it takes for each page to be generated, along with a PHP Accelerator you could see  a solid change in performance.

Modules I&#8217;ve disabled: Tags, PayPal (I&#8217;ve kept PayPal UK on), Weee, Find\_Feed, Authorizenet, Downloadable, GiftMessage, GoogleCheckout, Newsletter, Paygate, Poll, Mage\_Usa and Phoenix_Moneybookers. That&#8217;s 13 Modules I don&#8217;t use, and will most likely never use. Why bother having them enabled if you&#8217;re not going to use them? Perhaps you might use some of the above, but it&#8217;s completely down to what your requirements are.

To disable/enable modules on Magento simply go:

<pre>System &gt; Configuration &gt; Advanced &gt; Advanced</pre>

## 4) Edit your .htaccess settings

By uncommenting settings within your .htaccess you can unlock better magento performance again, enabling settings such as gzip compression and increasing PHP&#8217;s memory limit will have a positive effect on your performance. Personally, I set our PHP memory limit to 500m to make sure there is no doubt it has enough memory. Furthermore I make sure everything is gzip compressed before sending to the browser.

So there it is, 4 useful tips towards unlocking your magento&#8217;s store hidden potential. If you have any tips on increasing performance please use the comments below, I&#8217;d like to hear what tips you have!

 [1]: http://eaccelerator.net/
 [2]: http://pecl.php.net/package/APC
 [3]: http://www.ioncube.com/
 [4]: http://xcache.lighttpd.net/
 [5]: http://www.zend.com/products/server/
 [6]: http://nginx.org/en/
