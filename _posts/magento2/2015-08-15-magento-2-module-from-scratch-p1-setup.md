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

If you're here, then you are going to be just excited as I am about creating a full blown
Magento 2 module from scratch! This part of the series I'll be covering how to setup your
module so that it can be installed via Composer.

To install a module via Composer we'll need to set it up as a public version controlled repository and
submit it to packagist.org. I'll walk you through how your composer.json should look, anything else is
best left to [the composer documentation](https://getcomposer.org/).

I'll be assuming you have already setup a basic repository, and you are familiar with the CLI.

## Module structure
Let's setup our basic module structure now:

    Block/
    Controller/
    etc/
    etc/frontend/
    etc/backend/
    Test/
    view/

In the root directory we'll want to create a composer.json file. And it should look something like this:

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

There are only a few elements to this I want to explain, as some of it may be unfamiliar to you.

    "type": "magento2-module"

This defines our repo as a magento2-module, this is so when someone includes your module as a
dependency on their Magento 2 install, composer will know what to do with it! And that brings us to the next bit

    "extra": {
        "map": [
            [
                "*",
                "Ashsmith/Blog"
            ]
        ]
    }

What this does is creates a map which will tell Composer how to install this module.

That is: everything (*) should go into the folder: `Ashsmith/Blog`. Which would mean our module will be installed to: `app/code/Ashsmith/Blog`.

> If you want to learn more about this, head to Alan Kent's blog! [This is a fantastic post covering Magento 2 & composer](http://alankent.me/2014/08/03/creating-a-magento-2-composer-module/)


Next up, let's create our `etc/module.xml` with a tiny bit of configuration.

    <?xml version="1.0"?>
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../../../../../lib/internal/Magento/Framework/Module/etc/module.xsd">
        <module name="Ashsmith_Blog" setup_version="1.0.0" />
    </config>

And that's it! Our basic module is now setup. If you want to test this without using composer, you can simply symlink your module directory to your Magento 2 install. That way development becomes simpler.

    ln -s /path/to/module/* /path/to/magento/app/code/Ashsmith/Blog/

Don't forget to define your module in `app/etc/config.php`... otherwise it will not work!

## Conclusion

We've now set up our module, along with composer! If you push to a public repo, register it with packagist you will be able to install it really easily!

Next up, I'll cover how to [create your models & resource models in Magento 2](/magento2/module-from-scratch-module-part-2-models/). Exciting!!

You can checkout the progress on the module over on github, so [check it out](https://github.com/ashsmith/magento2-blog-module-tutorial). You can also install this as a composer package to your Magento 2 install. You can that like so:

    composer require ashsmith/magento2-blog-module-example:0.1.0

This will install the version of the progress we are at in this specific blog post! Each post will have it's own release version, making it easier to follow along.
