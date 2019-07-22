---
title: 'Formatting a price with the currency symbol.'
date: "2018-01-17T12:00:00Z"
description: "Quick Tip on how to format a price with currency symbol in Magento 2, the right way."
author: Ash Smith
layout: post
permalink: /magento2/tip-getting-formatted-price-with-currency-symbol/
category: "Magento 2"
comments: true
---

I was googling around how to get a formatted price today, and posts out there were telling me to use the ObjectManager. Which is a terrible idea! So, here’s the right way.

If you ever need to retrieve a formatted price, with the currency attached in Magento 2 the best way of doing this by adding the class as a dependency to your own the class. The class we need to add as a dependency is: `Magento\Framework\Pricing\Helper\Data` 

This helper class has two methods to use. The `currency` method or `currencyByStore` method. The `currency` method will use the current store scope’s currency. `currencyByStore` works in the same way by default, but has a second optional parameter to define which store.

Method signatures:

```php
currency($value, $format = true, $includeContainer = true)

currencyByStore($value, $store = null, $format = true, $includeContainer = true)
```

*Tip:* Setting the  `$includeContainer` parameter value to `false` will remove containing html, and you’ll just get the price and it’s currency.

How do you add a class to your class you ask? Simple, we pass it as an argument into our `__construct`, then set the instance to a protected property on the class. See the example below:

```php
<?php
namespace Namespace\Module\Model;

class MyClass {

    protected $pricingHelper;

    public function __construct(Magento\Framework\Pricing\Helper\Data $pricingHelper) 
    {
        $this->pricingHelper = $pricingHelper
    }

    public function getFormattedPrice($price, $format = true, $includeContainer = true)
    {
         return $this->pricingHelper->currency($price, $format, $includeContainer);
    }

}
```

It’s possible you’ve come across ObjectManager examples. These are BAD practices. Always do the extra work to inject your classes correctly, don’t get lazy! The Dependency Injection system is better in the long run, as your dependencies are made clear. 

Read more about why ObjectManage is not recommended [ObjectManager - Magento 2 Developer Documentation](http://devdocs.magento.com/guides/v2.0/extension-dev-guide/object-manager.html) (better yet, its straight from the horses mouth)

Seeing ObjectManager examples everywhere drove me to write this post.