---
title: Get rid of ?__store=default from your Magento links
author: Ash Smith
layout: post
share: true
permalink: /2012/11/get-rid-of-__storedefault-from-your-magento-links/
categories:
  - Magento Development
---
If you&#8217;re like me, you make use of a lot of widget links within Magento, and those Widget links have a pesky habit of adding ?\___store=default to the end of your URLs, which first of all don&#8217;t look nice and it certainly doesn&#8217;t help your optimisation efforts when it comes to SEO and ridding yourself of duplicate content.

This is a dead simple fix, and gives you peace of mind.

Simply copy the follow file: app/code/**core**/Mage/Catalog/Block/Widget/Link.php and paste it into app/code/**local**/Magento/Catalog/Block/Widget/Link.php

Then lines 89 &#8211; 92 need to be commented out. These lines look like this: (if it changes in future versions!)

{% highlight php startinline %}
if(strpos($this->_href, "___store") === false){
  $symbol = (strpos($this->_href, "?") === false) ? "?" : "&";
  $this->_href = $this-&gt;_href . $symbol . "___store=" . $store->getCode();
}
{% endhighlight %}

It&#8217;s as simple as that!

For extra special bonus points I would recommend packaging this change into it&#8217;s own module rather than overriding core functionality in this way. Doing so will be covered in a later blog post!

Side note: I have not tested how this works with multiple stores, so I can&#8217;t comment or recommend this until it&#8217;s been tested and giving the OK. If anyone runs into problems, I&#8217;d love to hear your feedback.