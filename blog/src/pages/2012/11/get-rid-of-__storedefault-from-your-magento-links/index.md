---
title: Get rid of ?__store=default from your Magento links
date: "2012-11-05T12:00:00Z"
author: Ash Smith
layout: post
comments: true
permalink: /2012/11/get-rid-of-__storedefault-from-your-magento-links/
category: "Magento 1"
---
If you're like me, you make use of a lot of widget links within Magento, and those Widget links have a pesky habit of adding ?\___store=default to the end of your URLs, which first of all don't look nice and it certainly doesn't help your optimisation efforts when it comes to SEO and ridding yourself of duplicate content.

This is a dead simple fix, and gives you peace of mind.

Simply copy the follow file: app/code/**core**/Mage/Catalog/Block/Widget/Link.php and paste it into app/code/**local**/Magento/Catalog/Block/Widget/Link.php

Then lines 89 &#8211; 92 need to be commented out. These lines look like this: (if it changes in future versions!)

```php
if(strpos($this->_href, "___store") === false){
  $symbol = (strpos($this->_href, "?") === false) ? "?" : "&";
  $this->_href = $this-&gt;_href . $symbol . "___store=" . $store->getCode();
}
```

It's as simple as that!

For extra special bonus points I would recommend packaging this change into it's own module rather than overriding core functionality in this way. Doing so will be covered in a later blog post!

Side note: I have not tested how this works with multiple stores, so I can't comment or recommend this until it's been tested and giving the OK. If anyone runs into problems, I'd love to hear your feedback.
