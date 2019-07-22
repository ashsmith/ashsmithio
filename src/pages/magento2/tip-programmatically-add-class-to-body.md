---
title: 'Programmatically adding a class to the page body'
date: "2018-01-18T12:00:00Z"
description: "Quick Tip on how to add a class to the body tag programmatically in Magento 2"
author: Ash Smith
layout: post
permalink: /magento2/tip-programmatically-add-class-to-body/
category: "Magento 2"
comments: true
---

If you ever need to programmatically add a class to the body tag of your Magento stores, you’ll need to setup an event observer for the `layout_load_before` event. Within your observer you’ll then want to add `Magento\Framework\View\Page\Config`  as a dependency, you’ll then use the `addBodyClass` method to add your class.

See below for a more detailed example. In my example, I’m adding the class `customer-logged-in` to the body when a customer is logged in.

**Event:** `layout_load_before`

**File:** `etc/frontend/events.xml`
```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Event/etc/events.xsd">
    <event name="layout_load_before">
        <observer name="vendor_module_add_body_class" instance="Vendor\Module\Observer\AddClassToBody" />
    </event>
</config>
```

**File:** `Observer/AddClassToBody.php`
```php
<?php
namespace Vendor\Module\Observer;

use Magento\Customer\Model\Session as CustomerSession;
use Magento\Framework\View\Page\Config as PageConfig;
use Magento\Framework\Event\ObserverInterface;

class AddClassToBody implements ObserverInterface
{
    /** @var PageConfig */
    protected $pageConfig;
	  /** @var CustomerSession */
    protected $customerSession;

    public function __construct(PageConfig $pageConfig, CustomerSession $customerSession)
    {
        $this->pageConfig = $pageConfig;
        $this->customerSession = $customerSession;
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {
        if (!$this->customerSession->isLoggedIn()) {
            return;
        }

        $this->pageConfig->addBodyClass('customer-logged-in');
    }
}

```


**Tip:** Some class names in Magento are not very help when you’re using the `use`  statement. I’ll often use an alias to refer to classes see below:

**Example:**

Directly using `Magento\Customer\Model\Session` in my constructor is long winded. But also, when using the `use` statement simply putting `Session` doesn’t mean too much either.

Instead I’ll do this: `use Magento\Customer\Model\Session as CustomerSession;`. Immediately it’s clear what the class is doing.

Another example: `use Magento\Framework\View\Page\Config as PageConfig;`. `Config` doesn’t mean anything useful, however `PageConfig` is much more meaningful as it provides that extra bit of context into what the class does.


