---
title: 'Quick Tip: Remove Paypal logo from Catalog pages in Magento'
author: Ash Smith
layout: post
share: true
permalink: /2011/07/quick-tip-remove-paypal-logo-from-catalog-pages-in-magento/
categories:
  - magento1
---
When setting your store up one of the first things you&#8217;ll come across is on the catalog pages of your store you&#8217;ll see down the right hand side in the 2columns-right.phtml file is the paypal logo saying you accept paypal. If you are new to Magento this can prove to be rather difficult. Anyway, there are two options to getting rid of the Paypal logo.

## Option One: Disable Paypal

So, if you have no intention of using paypal as a payment method you can disable paypal from your store completely, this is simple to do go to: system > confiuration > advanced > advanced  then from the list of modules disable both paypal and paypaluk. Refresh your cache and the logo has gone from your right hand sidebar.

## Option Two: Remove the logo yourself

To remove the logo from the right hand sidebar all you need to do is go into your file system and navigate to: app/design/frontend/base/default/layout/ and open up paypal.xml. copy this file to your theme&#8217;s layout directory (app/design/frontend/package/yourtheme/layout/) once you&#8217;ve done this open up paypal.xml and remove the following lines from the file: 98-100, 106 112, 118. Once you&#8217;ve completed this simply refresh your cache and you&#8217;re done!

Thanks for reading this quick tip on removing the paypal logo from catalog page inside of your Magento store. For more quick tips stay tuned and subscribe to our RSS feed.
