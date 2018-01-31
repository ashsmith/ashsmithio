---
title: 'Quick Tip: Override Magento Meta data in XML files'
date: "2012-11-14T12:00:00Z"
author: Ash Smith
layout: post
comments: true
permalink: /2012/11/quick-tip-override-magento-meta-data-in-xml-files/
category: "Magento 1"
---
In this quick tip I'll teach you how to override the meta data using Magento's XML layout files. You'll be able to adjust any meta tag in the head with ease. For the changes I'm teaching you to make I recommend you add them to your local.xml file which you may need to create within your theme if it doesn't already exist (app/design/frontend/[package]/[theme]/layout/local.xml)

### Overriding Robots Meta Tag:

```xml
<customer_account_login>
  <reference name="head">
    <action method="setRobots">
      <value>NOINDEX, NOFOLLOW</value>
    </action>
  </reference>
</customer_account_login>
```

### Overriding the Page Title:

```xml
<customer_account_login>
  <reference name="head">
    <action method="setTitle" translate="title">
      <title>New Page Title</title>
    </action>
  </reference>
</customer_account_login>
```

### Overriding the Meta Description:

```xml
<customer_account_login>
  <reference name="head">
    <action method="setDescription" translate="title">
      <title>New Meta Description</title>
    </action>
  </reference>
</customer_account_login>
```

### Overriding the Meta Keywords:

```xml
<customer_account_login>
  <reference name="head">
    <action method="setKeywords" translate="title">
      <title>New Keywords</title>
    </action>
  </reference>
</customer_account_login>
```

### Add Rel Canonical

```xml
<customer_account_login>
  <reference name="head">
    <action method="addLinkRel" translate="title">
      <rel>canonical</rel>
      <href>http://www.example.com/page.html</href>
    </action>
  </reference>
</customer_account_login>
```

To add these to different pages simply change the outer most tag (customer\_account\_login) to the approiate tag. For example if you wanted to override a product page, just change the outer
most tag to <kbd>&lt;catalog_product_index&gt;</kbd>.

That it from me, if you have any other quick references like this, let me know in the comments and I'll add them to the post! Thanks for reading!
