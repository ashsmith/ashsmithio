---
title: 'Magento 2 module from scratch - Part 1: Module Setup'
author: Ash Smith
layout: post
permalink: /magento2/module-from-scratch-module-part-1-setup
categories:
  - magento2
share: true
comments: true
---

> Magento 2 has been released! This entire series has been updated to reflect the changes since I originally wrote this post.
> I install Magento 2 using Composer, I recommend you do to! [Learn how to here](http://devdocs.magento.com/guides/v2.0/install-gde/install-quick-ref.html#installation-part-1-getting-started)

If you're here, then you are going to be just excited as I am about creating a full blown
Magento 2 module from scratch! This part of the series I'll be covering how to setup your
module so that it can be installed via Composer.

To install a module via Composer we'll need to set it up as a public version controlled repository and
submit it to packagist.org. I'll walk you through how your composer.json should look, anything else is
best left to [the composer documentation](https://getcomposer.org/).

I'll be assuming you have already setup a basic repository, and you are familiar with the CLI.

## Module structure
Let's setup our basic module structure now:

    etc/module.xml
    registration.php

In the root directory we'll want to create a composer.json file. And it should look something like this:
{% highlight json %}
    {
        "name": "ashsmith/magento2-blog",
        "description": "A simple blog module.",
        "type": "magento2-module",
        "version": "1.0.0",
        "license": [
            "OSL-3.0",
            "AFL-3.0"
        ],
        "require": {
            "php": "~5.5.0|~5.6.0",
            "magento/magento-composer-installer": "*"
        },
        "extra": {
            "map": [
                [
                    "*",
                    "Ashsmith/Blog"
                ]
            ]
        }
    }
{% endhighlight %}

There are only a few elements to this I want to explain, as some of it may be unfamiliar to you.
{% highlight json %}
    "type": "magento2-module"
{% endhighlight %}

This defines our repo as a magento2-module, this is so when someone includes your module as a
dependency on their Magento 2 install, composer will know what to do with it! And that brings us to the next bit
{% highlight json %}

    "extra": {
        "map": [
            [
                "*",
                "Ashsmith/Blog"
            ]
        ]
    }
{% endhighlight %}

What this does is creates a map which will tell Composer how to install this module.

That is: everything (*) should go into the folder: `Ashsmith/Blog`. Which would mean our module will be installed to: `app/code/Ashsmith/Blog`.

> If you want to learn more about this, head to Alan Kent's blog! [This is a fantastic post covering Magento 2 & composer](http://alankent.me/2014/08/03/creating-a-magento-2-composer-module/)


The first file you'll want to create is the `etc/module.xml`.
{% highlight xml %}
    <?xml version="1.0"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">
        <module name="Ashsmith_Blog" setup_version="1.0.0" />
    </config>
{% endhighlight %}

> Noticed the Schema location is a little strange looking? Your IDE won't recongise that, but you can fix that! Here how in PHPStorm: [XML Schema Resolution in PHPStorm](http://alankent.me/2015/10/07/xml-schema-resolution-in-php-storm-with-urns-quick-note/)

Next up, we need a `registration.php` file in the root of our module. This is picked up by the Magento framework and will handle registering your module with Magento.

{% highlight php %}
<?php
\Magento\Framework\Component\ComponentRegistrar::register(
    \Magento\Framework\Component\ComponentRegistrar::MODULE,
    'Ashsmith_Blog',
    __DIR__
);
{% endhighlight %}

Now, with this done our module has is setup, but it won't work within Magento just yet. We will need to enable it, then upgrade the database too. Like so:

{% highlight bash %}
    bin/magento module:status # this will give us the status of each module. It'll show ours as disabled.
    bin/magento module:enable Ashsmith_Blog # this will enable our module
    bin/magento setup:upgrade # upgrade the system, essentially this will make sure any setup scripts have been run and the current module version saved to the setup_module table.
    bin/magento module:status # confirm our module has been enabled!
{% endhighlight %}


If you want to skip over the Composer installation of the module, you can just create the `app/code` directory if it doesn't yet exist, and then copy in your code to the following structure: `app/code/Ashsmith/Blog/`.

## Conclusion

We've now set up our module, along with composer! If you push to a public repo, register it with packagist you will be able to install it really easily!

Next up, I'll cover how to [create your models & resource models in Magento 2](/magento2/module-from-scratch-module-part-2-models/).

You can view the complete module over on GitHub. [Magento 2 Blog Module](https://github.com/ashsmith/magento2-blog-module-tutorial)
