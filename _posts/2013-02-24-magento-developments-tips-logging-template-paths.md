---
title: 'Magento developments tips: logging &#038; template paths'
description: "Magento development can be tricky if you are not aware of all the tools you have available. Today we look at Logging & Template paths and how they can help you"
author: Ash Smith
layout: post
share: true
permalink: /2013/02/magento-developments-tips-logging-template-paths/
categories:
  - Magento Development
---
Whether you&#8217;re developing a theme, or a new extension for Magento the whole process can be made a lot easier when you know various in&#8217;s and out&#8217;s of Magento. Including some of the in-built development tools ready for you to use.

In this post I&#8217;ll cover two ways you can speed up your development. These tips have served me well, and I use these on a daily basis, hopefully you will be too.

### Enable Template paths hints

Ever tried debuging why your Magento theme isn&#8217;t updating? Maybe it&#8217;s not actually using your template for some reason. Enabling Template Path Hints will help you find which templates & blocks are being used in your themes!

To enabled this simply head over to `System > Configuration > Advanced > Developer` and change the configuration scope (top left) to your desired store view. Under the debug menu is two options `Template path hints` and `Add Block Names to Hints`, once enabled your theme will now display a breakdown of all the template files, and also the block names so you can see which block modules are loading too.

Another useful feature under `Developer Client Restrictions` is allowing certain IPs to view your enabled template paths. This helps if you need to quickly debug something on a live site.

### Enabling logging & use Mage::log()

`Mage::log()` is one of my most used lines of code in Magento whilst I&#8217;m developing themes and modules. This is because we can use `Mage::log()` to log anything, and get the contents outputs of objects and arrays without var_dump&#8217;ing.

First of all you need to enable logging, head over `System > Configuration > Advanced > Developer` and under `Log Settings` simply enable the log, and leave the other default values.

To use `Mage::log()` in your theme, or module you can simply add this line: `Mage::log('Hello World')` and when you run your script, over in var/log you will see a system.log file which will now contain your debug message!

Taking this a step further, we can output arrays and objects using `Mage::log()`, just simply pass it as a variable.

If you want to customise the output a little, for example save to a different log file, then no problem! Here&#8217;s all the parameters the log method takes:

{% highlight php startinline %}
Mage::log($message, $level = null, $file = '', $forceLog = false)
{% endhighlight %}    

With this, we can change a few settings, most importantly where the log saves to.

{% highlight php startinline %}
Mage::log($message, null, 'mylogfile.log');
{% endhighlight %}

In `var/log` you will now see a file named `mylogfile.log`! Brilliant. We can use this to split up our logging. General PHP errors will get logged to `system.log`, so by separating our debug logging we can easily scan our log file for what really matters in the early stages of development.

### Have your own Magento Development Tips & Tricks?

I would love to hear any tips and tricks you have for magento development. If you are using any particular development extensions, or are the creator of one, please share it and I&#8217;ll likely feature it here on the meteorify blog too.