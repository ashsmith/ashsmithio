---
title: 'Magento 2 module from scratch - Part 5: Adminhtml'
date: "2015-08-24T12:00:00Z"
description: "Developing the admin area of our Magento 2 Blog module"
author: Ash Smith
layout: post
permalink: /magento2/module-from-scratch-part-5-adminhtml/
category: "Magento 2"
comments: true
---

> Magento 2 has been released! This entire series has been updated to reflect the changes since I originally wrote this post.
> I install Magento 2 using Composer, I recommend you do to! [Learn how to here](http://devdocs.magento.com/guides/v2.0/install-gde/install-quick-ref.html#installation-part-1-getting-started)

_This is part 5 of my ['Magento 2 Module From Scratch'](/magento2/module-from-scratch-introduction/) series. I'd recommend you catch up with the rest first._


Today I'm covering the admin area section of our module. In here, we add links to the main menu, create our grid using the UI Components in Magento 2, create mass actions, and the ability to edit each post!

I won't be going into a huge amount of depth, but you'll be able to follow along and understand how everything fits together. I attend on covering some of these areas later on as they can be entire blog posts in themselves!

First things first, we want to add our blog admin pages to the 'Content' menu. We can do this by creating the file: `etc/adminhtml/menu.xml`

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Backend:etc/menu.xsd">
    <menu>
        <add id="Ashsmith_Blog::blog_content" title="Blog" module="Ashsmith_Blog" sortOrder="50" parent="Magento_Backend::content" resource="Ashsmith_Blog::blog_content" />
        <add id="Ashsmith_Blog::post" title="Posts" module="Ashsmith_Blog" sortOrder="0" parent="Ashsmith_Blog::blog_content" action="blog/post" resource="Ashsmith_Blog::post"/>
    </menu>
</config>

```

So this is dead simple. within the `<menu>` node we instruct magento to add two new items. First, is simply a heading, the next is our main item which will link to the blog posts grid! I wanted to nest the blog under it's own section in case I decide to add Categories, tags or other common blog features in the future!

**Quick description of the parameters:**

- `id` - A unique id to give to the menu item. Namespace it with your module name to avoid conflicts.
- `title` - The text you want displayed!
- `module` - The module it belongs to
- `sortOrder` - Ordering within the list of items
- `parent` - The ability to specify what node this belongs to, or where to nest the menu item.
- `resource` - This relates to our ACL. We'll cover this next.
- `action` - If you want your link to be clickable specify the path: i.e. `blog/post` (`frontName/action`)

Great, we have our menu items. Next, let's define some ACL rules so that admins can give fine grain control over other admin users!

`etc/acl.xml`

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Acl/etc/acl.xsd">
    <acl>
        <resources>
            <resource id="Magento_Backend::admin">
                <resource id="Magento_Backend::content">
                    <resource id="Ashsmith_Blog::blog_content" title="Blog" sortOrder="10" >
                        <resource id="Ashsmith_Blog::post" title="Blog Posts" sortOrder="40">
                            <resource id="Ashsmith_Blog::save" title="Save Blog Post" sortOrder="10" />
                            <resource id="Ashsmith_Blog::post_delete" title="Delete Blog Post" sortOrder="20" />
                        </resource>
                    </resource>
                </resource>
            </resource>
        </resources>
    </acl>
</config>

```

The ACL may feel familiar to that of Magento 1.x. Because our blog belongs under the `Magento_Backend::content` in our menu, we need to embed our resources within there. Then using the same resource identifiers we used in our menu.xml we can define the access. That will handle displaying/hiding the links within the menu based on the users access rights. Finally, we have our save and delete resources. We'll be making use of these in our controllers and block to change how the page looks for certain users.

So we now have our menu, and ACL configured. Let's move onwards by defining our admin routes. As we have already specified a path for our menu link we'll need to use that same convention within our routes configuration. Start by creating: `etc/adminhtml/routes.xml`

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:App/etc/routes.xsd">
    <router id="admin">
        <route id="blog" frontName="blog">
            <module name="Ashsmith_Blog" before="Magento_Backend" />
        </route>
    </router>
</config>

```

This follows the same format as our frontend router, with the exception of the `router` node's `id` attribute being set to `admin`. We also specify that our module is put before the `Magento_Backend` module.

Now it's time to create our first controller. We'll start with making our grid!

All our admin controllers live within an `Controller/Adminhtml` directory. Let's create our first: `Controller/Adminhtml/Post/Index.php`

```php
<?php
namespace Ashsmith\Blog\Controller\Adminhtml\Post;

use Magento\Backend\App\Action\Context;
use Magento\Framework\View\Result\PageFactory;

class Index extends \Magento\Backend\App\Action
{

    /**
     * @var PageFactory
     */
    protected $resultPageFactory;

    /**
     * @param Context $context
     * @param PageFactory $resultPageFactory
     */
    public function __construct(
        Context $context,
        PageFactory $resultPageFactory
    ) {
        parent::__construct($context);
        $this->resultPageFactory = $resultPageFactory;
    }

    /**
     * Index action
     *
     * @return \Magento\Backend\Model\View\Result\Page
     */
    public function execute()
    {
        /** @var \Magento\Backend\Model\View\Result\Page $resultPage */
        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu('Ashsmith_Blog::post');
        $resultPage->addBreadcrumb(__('Blog Posts'), __('Blog Posts'));
        $resultPage->addBreadcrumb(__('Manage Blog Posts'), __('Manage Blog Posts'));
        $resultPage->getConfig()->getTitle()->prepend(__('Blog Posts'));

        return $resultPage;
    }

    /**
     * Is the user allowed to view the blog post grid.
     *
     * @return bool
     */
    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('Ashsmith_Blog::post');
    }


}

```

Much like a standard controller actions, but instead of extending `\Magento\Framework\App\Action\Action` we now extend `\Magento\Backend\App\Action`. On top of this we have set a constant named `ADMIN_RESOURCE` this is what we defined in our ACL for whether or not a user is allowed access to this page.

Now that we have our controller setup we need to setup the UI components that will make up our admin grid. If you want to learn more about UI Components, head to the Magento 2 dev docs: [http://devdocs.magento.com/guides/v2.0/ui-library/ui-library-component.html](http://devdocs.magento.com/guides/v2.0/ui-library/ui-library-component.html)

Before we dive in with our UI Components, we'll need to create our layout file: `view/adminhtml/layout/blog_post_index.xml`

In here we simply register our UI Component!

```xml
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <update handle="styles"/>
    <body>
        <referenceContainer name="content">
            <uiComponent name="blog_post_listing"/>
        </referenceContainer>
    </body>
</page>

```

We've registered our component, so lets create it, again this is just another XML based configuration file. It's fairly beefy, as this controls adding all the components that make up our grid view. Such as columns and mass actions!

`views/adminhtml/ui_component/blog_post_listing.xml`

`gist:e92df7f790cf6ce84b20c8ee28f1f400#blog_post_listing.xml`

Let's quickly cover what we've done here:

- Setup and configure our JS, and data sources
- Define our containers
- Define our filter components
- Define our mass actions components
- Define our paging components
- Define our columns for the grid component
    - Our last column is an 'actions' column, allowing you to edit or delete from a little dropdown menu.

In here we have used 3 custom classes.

Under our `<dataSource>` node we defined the class: `PostGridDataProvider`. However, this doesn't
exist. Don't worry though, this is where Dependency Injection comes in. We'll setup a virtual type, which is an alias to our resource collection. So let's create our DI configuration file: `etc/di.xml`

`gist:e92df7f790cf6ce84b20c8ee28f1f400#di.xml`

In our `di.xml` we have made 3 declarations. The first is the `<preference>` node, this essentially when `Ashsmith\Blog\Api\Data\PostInterface` is a dependency, use `Ashsmith\Blog\Model\Post`. This is essentially how we can implement our own logic into core Magento.. just implementing the interfaces and then using our `di.xml` to switch out the class. Simple! After that we define two virtual types. These are just aliases to other classes, both UI Components on which we need to customise the arguments passed (we provide `PostGridDataProvider` with our resource collection for example)

The next missing class was define on our last column `is_active` we defined a custom class for outputting the options available! This is a new class: `Ashsmith\Blog\Model\Post\Source\IsActive`. Let's create this quickly:

`Model/Post/Source/IsActive.php`:

`gist:e92df7f790cf6ce84b20c8ee28f1f400#IsActive.php`

The last class we're missing is the one we defined for our 'actions' column. This is another source for available actions to do to a single blog post

`Ui/Component/Listing/Column/PostActions.php`:

`gist:e92df7f790cf6ce84b20c8ee28f1f400#PostActions.php`

Now we have all our files required to make the grid page work, you should now be able to clear cache and access the grid page! Huzzah!

Next up, let's create our mass actions. So, we have already defined those as: Deleting, Enabling and Disabling posts. Each have their own controller actions, so let's create them:

`Controller/Adminhtml/Post/MassDelete.php`

`gist:e92df7f790cf6ce84b20c8ee28f1f400#MassDelete.php`


That's our delete action done. Next up, our enable mass action: `Controller/Adminhtml/Post/MassEnable.php`

`gist:e92df7f790cf6ce84b20c8ee28f1f400#MassEnable.php`

And finally the mass delete: `Controller/Adminhtml/Post/MassDisable.php`

`gist:e92df7f790cf6ce84b20c8ee28f1f400#MassDisable.php`

Now that we can delete, enable and disable posts with Mass Actions, it's probably about time we made the ability to edit and create new posts! For this we need 3 more controllers: new, edit, save, and delete!

Let's start with the New action: `Controller/Adminhtml/Post/NewAction.php`

`gist:e92df7f790cf6ce84b20c8ee28f1f400#NewAction.php`

All we do here is simply forward the request onto the edit controller!

Let's create our edit action: `Controller/Adminhtml/Post/Edit.php`

`gist:e92df7f790cf6ce84b20c8ee28f1f400#Controller-Edit.php`

Before rendering the page, we attempt to load a record, and also check if any form data was previously submitted. If it was, we'll set the data on our model, then finally the model is added to the registry.

Let's create the delete action next:

`gist:e92df7f790cf6ce84b20c8ee28f1f400#Delete.php`


Now that we have our controllers setup, let's create our layout file, and blocks that will make up the page and display a form for us!

`view/adminhtml/layout/blog_post_edit.xml`

`gist:e92df7f790cf6ce84b20c8ee28f1f400#blog_post_edit.xml`

Now we need to create our corresponding blocks!

`Block/Adminhtml/Post/Edit.php`
`gist:e92df7f790cf6ce84b20c8ee28f1f400#Edit.php`

And the form block too: `Block/Adminhtml/Post/Edit/Form.php`

`gist:e92df7f790cf6ce84b20c8ee28f1f400#Form.php`

And there we have it! We're just missing the ability to save our blog posts now! So let's setup our final controller:

`Controller/Adminhtml/Post/Save.php`

`gist:e92df7f790cf6ce84b20c8ee28f1f400#Save.php`

### And that's it!

Clear cache, and you'll now have a fully functional Magento 2 module!

The final addition to the series will be adding unit tests to everything we have created. Check back soon!
