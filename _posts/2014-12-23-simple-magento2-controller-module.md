---
title: 'Simple Magento 2 Controller Module'
author: Ash Smith
layout: post
permalink: /2014/12/simple-magento2-controller-module/
categories:
  - Magento Development
share: true
comments: true
---

With the developer beta release of Magento 2 coming out just the other day, I decided it was a good time to take a look at how to create a simple module. The goal of this post is to help you (read as: me) understand some of the new concepts/structures in Magento 2.

It's worth noting this is an investigation by myself, and exploring the magento 2 code base. I talk to myself a lot, and probably make false promises like writing future posts (seriously, my last past was 4 months ago). Imagine those comments as mete @TODO docblocks that never get looked at.

I apologise if anything is hard to follow. It is a complete and utter brain dump. I have a messy brain. Please call me on it, and I'll do my best to re-write it... or you could suggests edits on github [because, well, you just should ok.](https://github.com/ashsmith/ashsmithio)

This post assumes you have good knowledge of Magento 1.x (and that you can understand me translating the rubbish that comes out of my brain un-polished), most importantly though: You should be comfortable creating a module with controllers and blocks already.

## Basic module with controller, block and view.

Let's start with registering a module, and seeing how it works. I'm not going to do anything fancy, we're literally going to output "Hello World" to the content of the frontend on a custom route.

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
Blocks, as in Magento 1.x remain the same. Main difference being the class you extend is no longer `Mage_Core_Block_Template` but instead `\Magento\Framework\View\Element\Template`.

##### Controller/
This folder replaces the `controller/` folder. Controllers have changed a fair bit, and we'll cover this in more depth later.

##### etc/
The `etc/` folder is still the place for module specific configuration, however now configuration for frontend and adminhtml is separated. For example in the module we make below we create two files: `etc/module.xml` and `etc/frontend/routes.xml`, and you would also have a `etc/adminhtml/routes.xml` if you wanted to register routes for the admin too. 

The module.xml file is for registering the module, and telling Magento what dependencies the module has. This is a replacement for the app/etc/modules/Namespace_Module.xml file.

The frontend/routes.xml is where we register our controller and register it with the router for the frontend of the store.

There are more configuration files, and I'd advise you to take a look through some of the core Magento code in app/code/Magento to get a better idea (Customer module is my go-to place). I'll try and cover the other configuration files in a later post.

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
    <module name="Ashsmith_HelloWorld" schema_version="0.0.1" />  
</config>

{% endhighlight %} 
This registers our module, we have no dependencies so we haven't listed any... however if your module does have a dependency then we simply change the `<module>` part of our module.xml file to look like this:


{% highlight xml %}
..
<module name="Ashsmith_HelloWorld" schema_version="0.0.1"> 
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

Ok, so what have done here? To register a router we need to add to this: `<router id="standard">`, and if we wanted an admin router we do this: `<router id="admin">
`. Simple. Next we define our route. The id attribute is simply an identifier, it should be unique. The frontName attribute is going to be the first part of the URL, in the completes example our URL is /helloworld/index/index/. This maps to Controller/Index/Index.php. The URL structure is as follows: /moduleFrontName/controller/action/param1/param2/param3.

With our route registered, now we can create our Controller action. This is something else that has changed in Magento 2 in comparison to 1.x in a fairly major way. Now, instead of specifying a controller class, which has multiple `[actionName]Action()` methods, you now have a class for each action, which implements a `execute` method. Heres the code:

File name: `app/code/Ashsmith/HelloWorld/Controller/Index/Index.php`


{% highlight php %}
<?php
namespace Ashsmith\HelloWorld\Controller\Index;

class Index extends \Magento\Framework\App\Action\Action
{

    /**
     * Default customer account page
     *
     * @return void
     */
    public function execute()
    {
        $this->_view->loadLayout();
        $this->_view->getLayout()->initMessages();
        $this->_view->renderLayout();
    }
}

{% endhighlight %}

And there it is. That's how we implement a controller action. Let's quickly talk about what is going on inside the execute method.

The first thing you'll notice that is different to Magento 1.x is the instance variable `$this->_view`. Strangely, this currently has a deprecated flag (I'll figure out why sometime). This allows us to load the layout, initialise messages and render the layout. Just like in Magento 1.x, so not much need to dive into that too much.

##### Quick Side(tracked) note about routing...
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
{% endhighlight %}

What this method returns in the namespaced class it is expecting, and we can see from the parameters it passes a namespace, which when we step through the code using xDebug (requesting the page `/helloworld/index/` we see this `$namespace` is `index`. `$module` is `Ashsmith_HelloWorld`, `$area` = `null`, and `$action` = `index`. 

I will go into Magento 2 routing in a future post though. Let's focus on building this module! (yes, this is me trying to keep myself on track here...)

Ok, so we have created our controller. Let's create a block next, our file will be: `app/code/Ashsmith/HelloWorld/Block/HelloWorld.php`. Now, in this example we're not going implement any methods, so technically speaking this block is completely pointless. But, I'm here to describe how to create a block, not the methods in it (you'll still have access to those methods in your template as usual).

{% highlight php %}
<?php
namespace Ashsmith\HelloWorld\Block;
class HelloWorld extends \Magento\Framework\View\Element\Template
{
}
{% endhighlight %}
Easy. Will extend the base template view class, this is the equivalent to `Mage_Core_Block_Template` in 1.x Magento.

##### Layout files & Templates!

Now let's create our layout file and the template. We'll start with layout

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

You'll recognise the language used, which means you'll be able to pick up how it works relatively quickly. My current understanding (educated guess, no research done yet, ok... its more of a gut feeling) is that `<body>` refers to the entire page. 

What we have done here is added our Block to the `content` container, and set the template to helloworld.phtml. So lets create that file now: `app/code/Ashsmith/HelloWorld/view/frontend/template/helloworld.phtml`.

In this file we can just put some simple text in there for now: 


{% highlight html %}
    <h1>Hello World!</h1> 

{% endhighlight %}
And that's it! Easy right!?? :)

Some quick notes:

- Magento 2 has a full page cache. So, if you're making changes and not seeing them run: `$ rm -rf var/page_cache/*`
- Don't forget to also clear the usual cache too.
- Oh and Magento 2 has a `var/generation` folder, where there is a lot of compiled code. If you're having issues, try emptying that too.

And a one liner for all your cache clearing needs:

        $ rm -rf var/cache/* var/page_cache/* var/generation/*

## And that's a wrap!

By now you should have a fully functional hello world module. Awesome stuff.