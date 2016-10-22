---
title: 'Quick Tip: Override Magento Meta data in XML files'
author: Ash Smith
layout: post
share: true
permalink: /2012/11/quick-tip-override-magento-meta-data-in-xml-files/
categories:
  - magento1
---
In this quick tip I&#8217;ll teach you how to override the meta data using Magento&#8217;s XML layout files. You&#8217;ll be able to adjust any meta tag in the head with ease. For the changes I&#8217;m teaching you to make I recommend you add them to your local.xml file which you may need to create within your theme if it doesn&#8217;t already exist (app/design/frontend/[package]/[theme]/layout/local.xml)

### Overriding Robots Meta Tag:

{% highlight xml linenos=table %}
<customer_account_login>
  <reference name="head">
    <action method="setRobots">
      <value>NOINDEX, NOFOLLOW</value>
    </action>
  </reference>
</customer_account_login>
{% endhighlight %}

### Overriding the Page Title:

{% highlight xml linenos=table %}
<customer_account_login>
  <reference name="head">
    <action method="setTitle" translate="title">
      <title>New Page Title</title>
    </action>
  </reference>
</customer_account_login>
{% endhighlight %}

### Overriding the Meta Description:

{% highlight xml linenos=table %}
<customer_account_login>
  <reference name="head">
    <action method="setDescription" translate="title">
      <title>New Meta Description</title>
    </action>
  </reference>
</customer_account_login>
{% endhighlight %}

### Overriding the Meta Keywords:

{% highlight xml linenos=table %}
<customer_account_login>
  <reference name="head">
    <action method="setKeywords" translate="title">
      <title>New Keywords</title>
    </action>
  </reference>
</customer_account_login>
{% endhighlight %}

### Add Rel Canonical

{% highlight xml linenos=table %}
<customer_account_login>
  <reference name="head">
    <action method="addLinkRel" translate="title">
      <rel>canonical</rel>
      <href>http://www.example.com/page.html</href>
    </action>
  </reference>
</customer_account_login>
{% endhighlight %}

To add these to different pages simply change the outer most tag (customer\_account\_login) to the approiate tag. For example if you wanted to override a product page, just change the outer
most tag to <kbd>&lt;catalog_product_index&gt;</kbd>.

That it from me, if you have any other quick references like this, let me know in the comments and I&#8217;ll add them to the post! Thanks for reading!
