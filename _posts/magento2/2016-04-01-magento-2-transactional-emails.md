---
title: 'Transactional Emails in Magento 2'
author: Ash Smith
layout: post
permalink: /magento2/transactional-emails-in-magento-2/
categories:
  - Magento Development
share: true
comments: true
---

In this blog post I aim to cover a number of topics surrounding transactional emails. Such as:

- Overview of how transactional emails are built up in Magento 2.
- Using that information to create and send our own.
- How to replace the default email transport method with an external service

Let's dive in...

## How transactional emails are built up Magento 2

There are a number of core modules we can look at for examples of how transactional emails are handled within Magento 2. The two examples I'll provide here is the `module-contact`, and `module-sales` modules. `module-contact` is a much simpler example, so we'll start here. If you're familiar with Magento 1.x, then this will be easy to get your head around!

### Contact form example

To find the `module-contact` module, head to: `vendor/magento/module-contact`.

The logic for sending emails is handled directly in the Post controller action: `Controller/Index/Post.php`.

The notable code is here:

{% highlight php %}
<?php
$transport = $this->_transportBuilder
    ->setTemplateIdentifier($this->scopeConfig->getValue(self::XML_PATH_EMAIL_TEMPLATE, $storeScope))
    ->setTemplateOptions(
        [
            'area' => \Magento\Backend\App\Area\FrontNameResolver::AREA_CODE,
            'store' => \Magento\Store\Model\Store::DEFAULT_STORE_ID,
        ]
    )
    ->setTemplateVars(['data' => $postObject])
    ->setFrom($this->scopeConfig->getValue(self::XML_PATH_EMAIL_SENDER, $storeScope))
    ->addTo($this->scopeConfig->getValue(self::XML_PATH_EMAIL_RECIPIENT, $storeScope))
    ->setReplyTo($post['email'])
    ->getTransport();

    $transport->sendMessage();
{% endhighlight %}

In our constructor the `$_transportBuilder` property is the following class: `\Magento\Framework\Mail\Template\TransportBuilder`, and the `$_scopeConfig` must implement: `\Magento\Framework\App\Config\ScopeConfigInterface`.

This might feel familiar if you're coming from Magento 1.x background, you can see values are pulled from configuration (which email template, sender and recipient are all defined from config), template variables are passed in, and the email is sent. Pretty straight forward stuff.

Let's look at how this is done when placing an order...

### Order confirmation email example

This example is a lot more complicated, as there are a range of classes used. I'll list them out below so you can reference them easily:

- `Magento\Sales\Model\EmailSenderHandler` - This handles sending emails on cron for Orders, Invoices, Shipments or Creditmemos.
- `Magento\Sales\Model\Email\SenderBuilder` - Sends an email, and can send copies.
- `Magento\Sales\Model\Email\Sender` - Prepares and invokes `SenderBuilder`
- `Magento\Sales\Model\Email\Sender\OrderSender` - Inherits from `Sender,`` but adds the public method `send`. This excepts an `Order` object, based on configuration it will either send the email immediately, or it'll allow the cron to pick up the sending.
- `Magento\Sales\Observer\Virtual\SendEmails` - Invokes `EmailSenderHandler`.

## Replacing email transport method

Magento 2 makes it incredibly easy to replace functionality with your own. With this, here is, very quickly, how to replace the default method of sending emails (sendmail), with another method.

Two use cases for replacing the default method: Debugging email templates easily (dump emails to a file in a specified folder), using an external mail service (like SendGrid, or AWS SES).

To do this, we simply need to implement the following interface: `Magento\Framework\Mail\TransportInterface`. This expects a public method `sendMessage` that accepts no parameters.

Then in your `di.xml` you will need to specify the preference:

{% highlight xml %}
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:ObjectManager/etc/config.xsd">
    <preference for="Magento\Framework\Mail\TransportInterface" type="[YOUR CLASS GOES HERE]" />
</config>
{% endhighlight %}

Yes, it's that easy.

Thanks for reading! Any questions, please leave a comment below!
