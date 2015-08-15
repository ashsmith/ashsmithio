---
title: 'Simple Magento 2 Controller Module'
author: Ash Smith
layout: post
permalink: /2014/12/simple-magento2-controller-module/
categories:
  - magento2
share: true
comments: true
---

With the developer beta release of Magento 2 coming out just the other day, I decided it was a good time to take a look at how to create a simple module. The goal of this post is to help both you and myself to understand some of the new concepts/structures in Magento 2.

This post assumes you have good knowledge of Magento 1.x. You should be comfortable creating a module with controllers and blocks already.

## Basic module with controller, block and view.

Let's start with registering a module, and seeing how it works. I'm not going to do anything fancy, we're just going to output "Hello World" to the content block using a custom frontend route.

### Code Structure

The first thing you will notice in Magento 2 is there are no longer any code pools (local, community, and core). You only have `app/code/`. Naming conventions generally remain the same however. So, to start with our module we'll create the following directory: `app/code/Ashsmith/HelloWorld`.

You will also need the following sub-directories:

- `app/code/Ashsmith/HelloWorld/`
- `app/code/Ashsmith/HelloWorld/Block/`
- `app/code/Ashsmith/HelloWorld/Controller/Index/`
- `app/code/Ashsmith/HelloWorld/etc/frontend`
- `app/code/Ashsmith/HelloWorld/view/frontend/layout`
- `app/code/Ashsmith/HelloWorld/view/frontend/templates`

#### Brief overview of a modules structure

##### Block/
Blocks, as in Magento 1.x remain the same. Main difference being the class you extend is no longer `Mage_Core_Block_Template` but instead `\Magento\Framework\View\Element\Template`. Two differences here, the first is that Magento 2 now uses php namespacing instead of class names based on a modules structure with underscores. Second is that the core Magento framework has been moved into lib/Magento/Framework. We won't dive into this though.

##### Controller/
This folder replaces the `controller/` folder. Controllers have changed a fair bit, and we'll cover this in more depth later.

##### etc/
The `etc/` folder is still the place for module specific configuration, however now configuration for frontend and adminhtml is separated. For example in the module we make below we create two files: `etc/module.xml` and `etc/frontend/routes.xml`, and you would also have a `etc/adminhtml/routes.xml` if you wanted to register routes for the admin too.

The module.xml file is for registering the module, and telling Magento what dependencies the module has. This is a replacement for the app/etc/modules/Namespace_Module.xml file.

The frontend/routes.xml is where we register our controller and register it with the router for the frontend of the store.

There are more configuration files, and I'd advise you to take a look through some of the core Magento code in app/code/Magento to get a better idea (Customer module is my go-to module for seeing how everything works). I'll try and cover the other configuration files in a later post.

##### view/
The `view/` folder is entirely new. This is where your layout files and templates are now stored. This is the equivalent to storing them in `base/default` theme. By storing them here it means anything related to that module is kept in one place, installing and uninstalling a module is made easier (when there are no theme specific overrides).

All the changes like this, and the app/etc/modules/Namespace_Module.xml file being housed all under your modules folder is what I really love about Magento 2. No longer are your files scattered across the entire codebase. Installing and uninstalling modules will be easier.

#### Ok, let's make this module then!

I've rambled on long enough about the module structure, let's actually make something!

We'll start with our configuration files.

`app/code/Ashsmith/HelloWorld/etc/module.xml`


{% highlight xml %}
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../../../../../lib/internal/Magento/Framework/Module/etc/module.xsd"> 
    <module name="Ashsmith_HelloWorld" schema_version="0.0.1" setup_version="0.0.1" /> 
</config>

{% endhighlight %} 
This registers our module, we have no dependencies so we haven't listed any... however if your module does have a dependency then we simply change the `<module>` part of our module.xml file to look like this:


{% highlight xml %}
..
<module name="Ashsmith_HelloWorld" schema_version="0.0.1" setup_version="0.0.1"> 
    <sequence> 
        <module name="Magento_Eav"/> 
        <module name="Magento_Directory"/> 
    </sequence> 
</module>
..
{% endhighlight %}

Dead easy, right?

Next up, is our frontend router configuration file. Save this to `app/code/Ashsmith/HelloWorld/etc/frontend/routes.xml`


{% highlight xml %}
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../../../../../../lib/internal/Magento/Framework/App/etc/routes.xsd"> 
    <router id="standard"> 
        <route id="helloworld" frontName="helloworld"> 
            <module name="Ashsmith_HelloWorld" /> 
        </route> 
    </router> 
</config> 
{% endhighlight %}

Ok, so what have done here? To register a router we need to add to this: `<router id="standard">`, and if we wanted an admin router we do this: `<router id="admin">`. Simple. Next we define our route. The id attribute is simply an identifier, it should be unique. The frontName attribute is going to be the first part of the URL, in the completes example our URL is /helloworld/index/index/. This maps to Controller/Index/Index.php. The URL structure is as follows: /moduleFrontName/controller/action/param1/param2/param3.

With our route registered, now we can create our Controller action. This is something else that has changed in Magento 2 in comparison to 1.x in a fairly major way. Now, instead of specifying a controller class, which has multiple `[actionName]Action()` methods, you now have a class for each action, which implements a `execute` method. Here is the code:

File name: `app/code/Ashsmith/HelloWorld/Controller/Index/Index.php`


{% highlight php %}
<?php
namespace Ashsmith\HelloWorld\Controller\Index;

class Index extends \Magento\Framework\App\Action\Action
{
        /**
         * @var \Magento\Framework\View\Result\PageFactory
         */
        protected $resultPageFactory;

        /**
         * @param \Magento\Framework\App\Action\Context $context
         * @param \Magento\Framework\View\Result\PageFactory resultPageFactory
         */
        public function __construct(
            \Magento\Framework\App\Action\Context $context,
            \Magento\Framework\View\Result\PageFactory $resultPageFactory
        )
        {
            $this->resultPageFactory = $resultPageFactory;
            parent::__construct($context);
        }
    /**
     * Default customer account page
     *
     * @return void
     */
    public function execute()
    {
        return $this->resultPageFactory->create();
    }
}
?>
{% endhighlight %}

And there it is. That's how we implement a controller action. Let's quickly talk about what is going on inside the execute method.

Let's start with the `__construct` method we've implemented. The two parameters we expect both dependencies of our controller action. If you need to use the `__construct`, you only need to include `$context` and ensure the parent method is still executed.

So what is `$context`? Context gives you access to things like: the object manager, the URL model, and more. All very handy stuff! The Context class will handle the DI of those components for you.

Now what on earth is `$resultPageFactory`?! It's a factory object to handle the creation of our result page of course ;). That doesn't really help us much though. This object is all we need to call to render our page.. remember how Magento 1.x you had to do `$this->loadLayout()` and `$this->renderLayout`. Well, now you just need to do: `$this->resultPageFactory->create()`. Awesome!

##### Side note on routing...
It's important to note that the namespacing is important here. The full class **has** to be `Ashsmith\HelloWorld\Controller\Index\Index`. This is due to way routing is handled. Here's a section from the class `Magento\Framework\App\Router\ActionList`

{% highlight php %}
<?php
/**
 *
 * @copyright Copyright (c) 2014 X.commerce, Inc. (http://www.magentocommerce.com)
 */
namespace Magento\Framework\App\Router;

class ActionList
{
    ...

    public function get($module, $area, $namespace, $action)
    {
        if ($area) {
            $area = '\\' . $area;
        }
        if (in_array(strtolower($action), $this->reservedWords)) {
            $action .= 'action';
        }
        $fullPath = str_replace(
            '_',
            '\\',
            strtolower(
                $module . '\\controller' . $area . '\\' . $namespace . '\\' . $action
            )
        );
        if (isset($this->actions[$fullPath])) {
            return is_subclass_of($this->actions[$fullPath], $this->actionInterface) ? $this->actions[$fullPath] : null;
        }

        return null;
    }

    ...
}
?>
{% endhighlight %}

What this method returns in the namespaced class it is expecting, and we can see from the parameters it passes a namespace, which when we step through the code using xDebug (requesting the page `/helloworld/index/` we see this `$namespace` is `index`. `$module` is `Ashsmith_HelloWorld`, `$area` = `null`, and `$action` = `index`.

I want to cover Magento 2 routing in more depth at a later stage. So we'll leave this here for now.

--

##### Creating our block

We have created our controller. Let's create a block next, our file will be: `app/code/Ashsmith/HelloWorld/Block/HelloWorld.php`. Now, in this example we're not going implement any methods, so it's a pointless class really, but if we were to implement some methods, in our template we would have access to them via the `$block` variable, NOT the `$this`. `$this` now refers to the template engine, you can get to your block from it, but `$block` makes this much easier and cleaner.

{% highlight php %}
<?php
namespace Ashsmith\HelloWorld\Block;
class HelloWorld extends \Magento\Framework\View\Element\Template
{
}
?>
{% endhighlight %}

This extends the base template view class, this is the equivalent to `Mage_Core_Block_Template` in 1.x Magento.

##### Layout files & Templates!

Now let's create our layout configuration file and the template. We'll start with layout

File name: `app/code/Ashsmith/HelloWorld/view/frontend/layout/helloworld_index_index.xml`. Notice the naming convention, its our full route, this is important. On top of this we can create a `default.xml` which would be applied on every route. The customer module has a good example of this in: `app/code/Magento/Customer/view/frontend/layout`


{% highlight xml %}
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../../../../../../../lib/internal/Magento/Framework/View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceContainer name="content">
            <block class="Ashsmith\HelloWorld\Block\HelloWorld" name="helloworld" template="helloworld.phtml" />
        </referenceContainer>
    </body>
</page>
{% endhighlight %}

You'll recognise the language used, which means so you should be able to pick up how it works relatively quickly. `<body>` refers to everything within the `<body>` tag in the rendered HTML page. There is also a `<head>` where you can add blocks to the page such as adding CSS.

What we have done here is added our block to the `content` container, and set the template of our block to helloworld.phtml. So lets create that file now: `app/code/Ashsmith/HelloWorld/view/frontend/templates/helloworld.phtml`.

In this file we can just put some simple text in there for now:

{% highlight html %}
    <h1>Hello World!</h1> 

{% endhighlight %}

And that's it! Our Module is now complete!

Well, not quite. It doesn't actually work! Why? Well, we need to activate manually. At the time of writing the devdocs lacked this information. It is rather simple thought. You just need to add the module to `app/etc/config.php`. In this file is an array of configuration key/value pairs. Find the `modules` key, and add our module name `Ashsmith_HelloWorld` to the end of the array.

{% highlight php %}
<?php
return array(
    ..
    'modules' => array(
        ...
        'Magento_CurrencySymbol' => 1,
        'Magento_Wishlist' => 1,
        'Ashsmith_HelloWorld' => 1 # Here is our module!
    )
    ...
    );
?>
{% endhighlight %}

Some quick notes:

- Magento 2 has a full page cache. So, if you're making changes and not seeing them run: `$ rm -rf var/page_cache/*`
- Don't forget to also clear the usual cache too.
- Oh and Magento 2 has a `var/generation` folder, where there is a lot of compiled code. If you're having issues, try emptying that too.

And a one liner for all your cache clearing needs:

        $ bin/magento cache:flush --all

## And that's a wrap!

By now you should have a fully functional hello world module. Awesome stuff.

## Update 29th Dec 2014

As requested in the comments, I have added the completed module to my github: [https://github.com/ashsmith/magento2-controller-module](https://github.com/ashsmith/magento2-controller-module)

## Update 15th Aug 2015

I've neglected updating this post. I've correct a few things with our controller and blocks. :)

The example on GitHub is now composer installable too! Check out the repo linked above to find out more!
