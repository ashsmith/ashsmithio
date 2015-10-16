---
title: 'Magento 2 module from scratch - Part 5: Adminhtml'
author: Ash Smith
layout: post
permalink: /magento2/module-from-scratch-part-5-adminhtml
categories:
  - magento2
share: true
comments: true
---

_This is part 5 of my ['Magento 2 Module From Scratch'](/magento2/module-from-scratch-introduction/) series. I'd recommend you catch up with the rest first._

Today I'm covering the admin area section of our module. In here, we add links to the main menu, create our grid using the UI Components in Magento 2, create mass actions, and the ability to edit each post!

I won't be going into a huge amount of depth, but you'll be able to follow along and understand how everything fits together. I attend on covering some of these areas later on as they can be entire blog posts in themselves!

First things first, we want to add our blog admin pages to the 'Content' menu. We can do this by creating the file: `etc/adminhtml/menu.xml`

{% highlight xml %}
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../../../../Magento/Backend/etc/menu.xsd">
    <menu>
        <add id="Ashsmith_Blog::blog_content" title="Blog" module="Ashsmith_Blog" sortOrder="50" parent="Magento_Backend::content" resource="Ashsmith_Blog::blog_content" />
        <add id="Ashsmith_Blog::post" title="Posts" module="Ashsmith_Blog" sortOrder="0" parent="Ashsmith_Blog::blog_content" action="blog/post" resource="Ashsmith_Blog::post"/>
    </menu>
</config>
{% endhighlight %}

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

{% highlight xml %}
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../../../../../lib/internal/Magento/Framework/Acl/etc/acl.xsd">
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
{% endhighlight %}

The ACL may feel familiar to that of Magento 1.x. Because our blog belongs under the `Magento_Backend::content` in our menu, we need to embed our resources within there. Then using the same resource identifiers we used in our menu.xml we can define the access. That will handle displaying/hiding the links within the menu based on the users access rights. Finally, we have our save and delete resources. We'll be making use of these in our controllers and block to change how the page looks for certain users.

So we now have our menu, and ACL configured. Let's move onwards by defining our admin routes. As we have already specified a path for our menu link we'll need to use that same convention within our routes configuration. Start by creating: `etc/adminhtml/routes.xml`

{% highlight xml %}
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../../../../../../lib/internal/Magento/Framework/App/etc/routes.xsd">
    <router id="admin">
        <route id="blog" frontName="blog">
            <module name="Ashsmith_Blog" before="Magento_Backend" />
        </route>
    </router>
</config>
{% endhighlight %}

This follows the same format as our frontend router, with the exception of the `router` node's `id` attribute being set to `admin`. We also specify that our module is put before the `Magento_Backend` module.

Now it's time to create our first controller. We'll start with making our grid!

All our admin controllers live within an `Controller/Adminhtml` directory. Let's create our first: `Controller/Adminhtml/Post/Index.php`

{% highlight php %}
<?php
namespace Ashsmith\Blog\Controller\Adminhtml\Post;

use Magento\Backend\App\Action\Context;
use Magento\Framework\View\Result\PageFactory;

class Index extends \Magento\Backend\App\Action
{
    const ADMIN_RESOURCE = 'Ashsmith_Blog::post';

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
}
{% endhighlight %}

Much like a standard controller actions, but instead of extending `\Magento\Framework\App\Action\Action` we now extend `\Magento\Backend\App\Action`. On top of this we have set a constant named `ADMIN_RESOURCE` this is what we defined in our ACL for whether or not a user is allowed access to this page.

Now that we have our controller setup we need to setup the UI components that will make up our admin grid. If you want to learn more about UI Components, head to the Magento 2 dev docs: [http://devdocs.magento.com/guides/v2.0/ui-library/ui-library-component.html](http://devdocs.magento.com/guides/v2.0/ui-library/ui-library-component.html)

Before we dive in with our UI Components, we'll need to create our layout file: `view/adminhtml/layout/blog_post_index.xml`

In here we simply register our UI Component!

{% highlight xml %}
<?xml version="1.0"?>
<!--
/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
-->
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../../../../../../../lib/internal/Magento/Framework/View/Layout/etc/page_configuration.xsd">
    <update handle="styles"/>
    <body>
        <referenceContainer name="content">
            <uiComponent name="blog_post_listing"/>
        </referenceContainer>
    </body>
</page>
{% endhighlight %}

We've registered our component, so lets create it, again this is just another XML based configuration file. It's fairly beefy, as this controls adding all the components that make up our grid view. Such as columns and mass actions!

`views/adminhtml/ui_component/blog_post_listing.xml`
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<listing xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../../../../Ui/etc/ui_configuration.xsd">
    <argument name="data" xsi:type="array">
        <item name="js_config" xsi:type="array">
            <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing_data_source</item>
            <item name="deps" xsi:type="string">blog_post_listing.blog_post_listing_data_source</item>
        </item>
        <item name="spinner" xsi:type="string">blog_post_columns</item>
        <item name="buttons" xsi:type="array">
            <item name="add" xsi:type="array">
                <item name="name" xsi:type="string">add</item>
                <item name="label" xsi:type="string" translate="true">Add New Post</item>
                <item name="class" xsi:type="string">primary</item>
                <item name="url" xsi:type="string">*/*/new</item>
            </item>
        </item>
    </argument>
    <dataSource name="blog_post_listing_data_source">
        <argument name="dataProvider" xsi:type="configurableObject">
            <argument name="class" xsi:type="string">PostGridDataProvider</argument>
            <argument name="name" xsi:type="string">blog_post_listing_data_source</argument>
            <argument name="primaryFieldName" xsi:type="string">block_id</argument>
            <argument name="requestFieldName" xsi:type="string">id</argument>
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="update_url" xsi:type="url" path="mui/index/render"/>
                </item>
            </argument>
        </argument>
        <argument name="data" xsi:type="array">
            <item name="js_config" xsi:type="array">
                <item name="component" xsi:type="string">Magento_Ui/js/grid/provider</item>
            </item>
        </argument>
    </dataSource>
    <container name="listing_top">
        <argument name="data" xsi:type="array">
            <item name="config" xsi:type="array">
                <item name="template" xsi:type="string">ui/grid/toolbar</item>
            </item>
        </argument>
        <bookmark name="bookmarks">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="component" xsi:type="string">Magento_Ui/js/grid/controls/bookmarks/bookmarks</item>
                    <item name="displayArea" xsi:type="string">dataGridActions</item>
                    <item name="storageConfig" xsi:type="array">
                        <item name="saveUrl" xsi:type="url" path="mui/bookmark/save"/>
                        <item name="deleteUrl" xsi:type="url" path="mui/bookmark/delete"/>
                        <item name="namespace" xsi:type="string">blog_post_listing</item>
                    </item>
                </item>
            </argument>
        </bookmark>
        <container name="columns_controls">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="columnsData" xsi:type="array">
                        <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing.blog_post_columns</item>
                    </item>
                    <item name="component" xsi:type="string">Magento_Ui/js/grid/controls/columns</item>
                    <item name="displayArea" xsi:type="string">dataGridActions</item>
                </item>
            </argument>
        </container>
        <filterSearch name="fulltext">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="component" xsi:type="string">Magento_Ui/js/grid/search/search</item>
                    <item name="displayArea" xsi:type="string">dataGridFilters</item>
                    <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing_data_source</item>
                    <item name="chipsProvider" xsi:type="string">blog_post_listing.blog_post_listing.listing_top.listing_filters_chips</item>
                    <item name="storageConfig" xsi:type="array">
                        <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing.listing_top.bookmarks</item>
                        <item name="namespace" xsi:type="string">current.search</item>
                    </item>
                </item>
            </argument>
        </filterSearch>
        <filters name="listing_filters">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="displayArea" xsi:type="string">dataGridFilters</item>
                    <item name="dataScope" xsi:type="string">filters</item>
                    <item name="storageConfig" xsi:type="array">
                        <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing.listing_top.bookmarks</item>
                        <item name="namespace" xsi:type="string">current.filters</item>
                    </item>
                    <item name="childDefaults" xsi:type="array">
                        <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing.listing_top.listing_filters</item>
                        <item name="imports" xsi:type="array">
                            <item name="visible" xsi:type="string">blog_post_listing.blog_post_listing.listing_top.bookmarks:current.columns.${ $.index }.visible</item>
                        </item>
                    </item>
                </item>
            </argument>
            <filterRange name="post_id">
                <argument name="data" xsi:type="array">
                    <item name="config" xsi:type="array">
                        <item name="dataScope" xsi:type="string">post_id</item>
                        <item name="label" xsi:type="string" translate="true">ID</item>
                        <item name="childDefaults" xsi:type="array">
                            <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing.listing_top.listing_filters</item>
                        </item>
                    </item>
                </argument>
                <filterInput name="from">
                    <argument name="data" xsi:type="array">
                        <item name="config" xsi:type="array">
                            <item name="dataScope" xsi:type="string">from</item>
                            <item name="label" xsi:type="string" translate="true">from</item>
                            <item name="placeholder" xsi:type="string" translate="true">From</item>
                        </item>
                    </argument>
                </filterInput>
                <filterInput name="to">
                    <argument name="data" xsi:type="array">
                        <item name="config" xsi:type="array">
                            <item name="dataScope" xsi:type="string">to</item>
                            <item name="label" xsi:type="string" translate="true">to</item>
                            <item name="placeholder" xsi:type="string" translate="true">To</item>
                        </item>
                    </argument>
                </filterInput>
            </filterRange>
            <filterInput name="title">
                <argument name="data" xsi:type="array">
                    <item name="config" xsi:type="array">
                        <item name="dataScope" xsi:type="string">title</item>
                        <item name="label" xsi:type="string" translate="true">Title</item>
                    </item>
                </argument>
            </filterInput>
            <filterInput name="url_key">
                <argument name="data" xsi:type="array">
                    <item name="config" xsi:type="array">
                        <item name="dataScope" xsi:type="string">url_key</item>
                        <item name="label" xsi:type="string" translate="true">URL Key</item>
                    </item>
                </argument>
            </filterInput>
            <filterSelect name="is_active">
                <argument name="data" xsi:type="array">
                    <item name="config" xsi:type="array">
                        <item name="dataScope" xsi:type="string">is_active</item>
                        <item name="label" xsi:type="string" translate="true">Status</item>
                        <item name="caption" xsi:type="string" translate="true">Select...</item>
                        <item name="options" xsi:type="array">
                            <item name="disable" xsi:type="array">
                                <item name="value" xsi:type="string">0</item>
                                <item name="label" xsi:type="string" translate="true">Disabled</item>
                            </item>
                            <item name="enable" xsi:type="array">
                                <item name="value" xsi:type="string">1</item>
                                <item name="label" xsi:type="string" translate="true">Published</item>
                            </item>
                        </item>
                    </item>
                </argument>
            </filterSelect>
            <filterRange name="creation_time" class="Magento\Ui\Component\Filters\Type\DateRange">
                <argument name="data" xsi:type="array">
                    <item name="config" xsi:type="array">
                        <item name="dataScope" xsi:type="string">creation_time</item>
                        <item name="label" xsi:type="string" translate="true">Created</item>
                        <item name="childDefaults" xsi:type="array">
                            <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing.listing_top.listing_filters</item>
                        </item>
                    </item>
                </argument>
                <filterDate name="from">
                    <argument name="data" xsi:type="array">
                        <item name="config" xsi:type="array">
                            <item name="dataScope" xsi:type="string">from</item>
                            <item name="label" xsi:type="string" translate="true">from</item>
                            <item name="placeholder" xsi:type="string" translate="true">From</item>
                            <item name="dateFormat" xsi:type="string" translate="true">MM/dd/YYYY</item>
                        </item>
                    </argument>
                </filterDate>
                <filterDate name="to">
                    <argument name="data" xsi:type="array">
                        <item name="config" xsi:type="array">
                            <item name="dataScope" xsi:type="string">to</item>
                            <item name="label" xsi:type="string" translate="true">to</item>
                            <item name="placeholder" xsi:type="string" translate="true">To</item>
                            <item name="dateFormat" xsi:type="string" translate="true">MM/dd/YYYY</item>
                        </item>
                    </argument>
                </filterDate>
            </filterRange>
            <filterRange name="update_time" class="Magento\Ui\Component\Filters\Type\DateRange">
                <argument name="data" xsi:type="array">
                    <item name="config" xsi:type="array">
                        <item name="dataScope" xsi:type="string">update_time</item>
                        <item name="label" xsi:type="string" translate="true">Modified</item>
                        <item name="childDefaults" xsi:type="array">
                            <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing.listing_top.listing_filters</item>
                        </item>
                    </item>
                </argument>
                <filterDate name="from">
                    <argument name="data" xsi:type="array">
                        <item name="config" xsi:type="array">
                            <item name="dataScope" xsi:type="string">from</item>
                            <item name="label" xsi:type="string" translate="true">from</item>
                            <item name="placeholder" xsi:type="string" translate="true">From</item>
                            <item name="dateFormat" xsi:type="string" translate="true">MM/dd/YYYY</item>
                        </item>
                    </argument>
                </filterDate>
                <filterDate name="to">
                    <argument name="data" xsi:type="array">
                        <item name="config" xsi:type="array">
                            <item name="dataScope" xsi:type="string">to</item>
                            <item name="label" xsi:type="string" translate="true">to</item>
                            <item name="placeholder" xsi:type="string" translate="true">To</item>
                            <item name="dateFormat" xsi:type="string" translate="true">MM/dd/YYYY</item>
                        </item>
                    </argument>
                </filterDate>
            </filterRange>
        </filters>
        <massaction name="listing_massaction">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="selectProvider" xsi:type="string">blog_post_listing.blog_post_listing.blog_post_columns.ids</item>
                    <item name="displayArea" xsi:type="string">bottom</item>
                    <item name="actions" xsi:type="array">
                        <item name="delete" xsi:type="array">
                            <item name="type" xsi:type="string">delete</item>
                            <item name="label" xsi:type="string" translate="true">Delete</item>
                            <item name="url" xsi:type="string">blog/post/massDelete</item>
                            <item name="confirm" xsi:type="array">
                                <item name="title" xsi:type="string" translate="true">Delete items</item>
                                <item name="message" xsi:type="string" translate="true">Are you sure you wan't to delete selected items?</item>
                            </item>
                        </item>
                        <item name="disable" xsi:type="array">
                            <item name="type" xsi:type="string">disable</item>
                            <item name="label" xsi:type="string" translate="true">Disable</item>
                            <item name="url" xsi:type="string">blog/post/massDisable</item>
                        </item>
                        <item name="enable" xsi:type="array">
                            <item name="type" xsi:type="string">enable</item>
                            <item name="label" xsi:type="string" translate="true">Enable</item>
                            <item name="url" xsi:type="string">blog/post/massEnable</item>
                        </item>
                    </item>
                    <item name="indexField" xsi:type="string">post_id</item>
                </item>
            </argument>
        </massaction>
        <paging name="listing_paging">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="storageConfig" xsi:type="array">
                        <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing.listing_top.bookmarks</item>
                        <item name="namespace" xsi:type="string">current.paging</item>
                    </item>
                    <item name="selectProvider" xsi:type="string">blog_post_listing.blog_post_listing.blog_post_columns.ids</item>
                    <item name="displayArea" xsi:type="string">bottom</item>
                    <item name="options" xsi:type="array">
                        <item name="20" xsi:type="array">
                            <item name="value" xsi:type="number">20</item>
                            <item name="label" xsi:type="string" translate="true">20</item>
                        </item>
                        <item name="30" xsi:type="array">
                            <item name="value" xsi:type="number">30</item>
                            <item name="label" xsi:type="string" translate="true">30</item>
                        </item>
                        <item name="50" xsi:type="array">
                            <item name="value" xsi:type="number">50</item>
                            <item name="label" xsi:type="string" translate="true">50</item>
                        </item>
                        <item name="100" xsi:type="array">
                            <item name="value" xsi:type="number">100</item>
                            <item name="label" xsi:type="string" translate="true">100</item>
                        </item>
                        <item name="200" xsi:type="array">
                            <item name="value" xsi:type="number">200</item>
                            <item name="label" xsi:type="string" translate="true">200</item>
                        </item>
                    </item>
                </item>
            </argument>
        </paging>
    </container>
    <columns name="blog_post_columns">
        <argument name="data" xsi:type="array">
            <item name="config" xsi:type="array">
                <item name="storageConfig" xsi:type="array">
                    <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing.listing_top.bookmarks</item>
                    <item name="namespace" xsi:type="string">current</item>
                </item>
                <item name="childDefaults" xsi:type="array">
                    <item name="fieldAction" xsi:type="array">
                        <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing.blog_post_columns.actions</item>
                        <item name="target" xsi:type="string">applyAction</item>
                        <item name="params" xsi:type="array">
                            <item name="0" xsi:type="string">edit</item>
                            <item name="1" xsi:type="string">${ $.$data.rowIndex }</item>
                        </item>
                    </item>
                    <item name="controlVisibility" xsi:type="boolean">true</item>
                    <item name="storageConfig" xsi:type="array">
                        <item name="provider" xsi:type="string">blog_post_listing.blog_post_listing.listing_top.bookmarks</item>
                        <item name="root" xsi:type="string">columns.${ $.index }</item>
                        <item name="namespace" xsi:type="string">current.${ $.storageConfig.root}</item>
                    </item>
                </item>
            </item>
        </argument>
        <column name="ids" class="Magento\Ui\Component\MassAction\Columns\Column">
            <argument name="data" xsi:type="array">
                <item name="js_config" xsi:type="array">
                    <item name="component" xsi:type="string">Magento_Ui/js/grid/columns/multiselect</item>
                </item>
                <item name="config" xsi:type="array">
                    <item name="draggable" xsi:type="boolean">false</item>
                    <item name="indexField" xsi:type="string">post_id</item>
                    <item name="controlVisibility" xsi:type="boolean">false</item>
                </item>
            </argument>
        </column>
        <column name="post_id">
            <argument name="data" xsi:type="array">
                <item name="js_config" xsi:type="array">
                    <item name="component" xsi:type="string">Magento_Ui/js/grid/columns/column</item>
                </item>
                <item name="config" xsi:type="array">
                    <item name="dataType" xsi:type="string">text</item>
                    <item name="sorting" xsi:type="string">asc</item>
                    <item name="align" xsi:type="string">left</item>
                    <item name="label" xsi:type="string" translate="true">ID</item>
                </item>
            </argument>
        </column>
        <column name="title">
            <argument name="data" xsi:type="array">
                <item name="js_config" xsi:type="array">
                    <item name="component" xsi:type="string">Magento_Ui/js/grid/columns/column</item>
                </item>
                <item name="config" xsi:type="array">
                    <item name="dataType" xsi:type="string">text</item>
                    <item name="align" xsi:type="string">left</item>
                    <item name="label" xsi:type="string" translate="true">Title</item>
                </item>
            </argument>
        </column>
        <column name="url_key">
            <argument name="data" xsi:type="array">
                <item name="js_config" xsi:type="array">
                    <item name="component" xsi:type="string">Magento_Ui/js/grid/columns/column</item>
                </item>
                <item name="config" xsi:type="array">
                    <item name="dataType" xsi:type="string">text</item>
                    <item name="align" xsi:type="string">left</item>
                    <item name="label" xsi:type="string" translate="true">URL Key</item>
                </item>
            </argument>
        </column>
        <column name="is_active">
            <argument name="data" xsi:type="array">
                <item name="options" xsi:type="object">Ashsmith\Blog\Model\Post\Source\IsActive</item>
                <item name="js_config" xsi:type="array">
                    <item name="component" xsi:type="string">Magento_Ui/js/grid/columns/select</item>
                </item>
                <item name="config" xsi:type="array">
                    <item name="dataType" xsi:type="string">select</item>
                    <item name="align" xsi:type="string">left</item>
                    <item name="label" xsi:type="string" translate="true">Status</item>
                </item>
            </argument>
        </column>
        <column name="creation_time">
            <argument name="data" xsi:type="array">
                <item name="js_config" xsi:type="array">
                    <item name="component" xsi:type="string">Magento_Ui/js/grid/columns/date</item>
                </item>
                <item name="config" xsi:type="array">
                    <item name="dataType" xsi:type="string">date</item>
                    <item name="align" xsi:type="string">left</item>
                    <item name="label" xsi:type="string" translate="true">Created</item>
                </item>
            </argument>
        </column>
        <column name="update_time">
            <argument name="data" xsi:type="array">
                <item name="js_config" xsi:type="array">
                    <item name="component" xsi:type="string">Magento_Ui/js/grid/columns/date</item>
                </item>
                <item name="config" xsi:type="array">
                    <item name="dataType" xsi:type="string">date</item>
                    <item name="align" xsi:type="string">left</item>
                    <item name="label" xsi:type="string" translate="true">Modified</item>
                </item>
            </argument>
        </column>
        <column name="actions" class="Ashsmith\Blog\Ui\Component\Listing\Column\PostActions">
            <argument name="data" xsi:type="array">
                <item name="config" xsi:type="array">
                    <item name="draggable" xsi:type="boolean">false</item>
                    <item name="dataType" xsi:type="string">actions</item>
                    <item name="indexField" xsi:type="string">post_id</item>
                    <item name="blockVisibility" xsi:type="boolean">true</item>
                    <item name="align" xsi:type="string">left</item>
                    <item name="label" xsi:type="string" translate="true">Action</item>
                    <item name="data_type" xsi:type="string">actions</item>
                    <item name="filterable" xsi:type="boolean">false</item>
                    <item name="sortable" xsi:type="boolean">false</item>
                </item>
            </argument>
        </column>
    </columns>
</listing>
{% endhighlight %}

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

{% highlight xml %}
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../../../../../lib/internal/Magento/Framework/ObjectManager/etc/config.xsd">
    <preference for="Ashsmith\Blog\Api\Data\PostInterface" type="Ashsmith\Blog\Model\Post" />
    <virtualType name="BlogGirdFilterPool" type="Magento\Framework\View\Element\UiComponent\DataProvider\FilterPool">
        <arguments>
            <argument name="appliers" xsi:type="array">
                <item name="regular" xsi:type="object">Magento\Framework\View\Element\UiComponent\DataProvider\RegularFilter</item>
                <item name="fulltext" xsi:type="object">Magento\Framework\View\Element\UiComponent\DataProvider\FulltextFilter</item>
            </argument>
        </arguments>
    </virtualType>
    <virtualType name="PostGridDataProvider" type="Magento\Framework\View\Element\UiComponent\DataProvider\DataProvider">
        <arguments>
            <argument name="collection" xsi:type="object" shared="false">Ashsmith\Blog\Model\Resource\Post\Collection</argument>
            <argument name="filterPool" xsi:type="object" shared="false">BlogGirdFilterPool</argument>
        </arguments>
    </virtualType>
</config>
{% endhighlight %}

In our `di.xml` we have made 3 declarations. The first is the `<preference>` node, this essentially when `Ashsmith\Blog\Api\Data\PostInterface` is a dependency, use `Ashsmith\Blog\Model\Post`. This is essentially how we can implement our own logic into core Magento.. just implementing the interfaces and then using our `di.xml` to switch out the class. Simple! After that we define two virtual types. These are just aliases to other classes, both UI Components on which we need to customise the arguments passed (we provide `PostGridDataProvider` with our resource collection for example)

The next missing class was define on our last column `is_active` we defined a custom class for outputting the options available! This is a new class: `Ashsmith\Blog\Model\Post\Source\IsActive`. Let's create this quickly:

`Model/Post/Source/IsActive.php`:

{% highlight php %}
<?php
namespace Ashsmith\Blog\Model\Post\Source;

class IsActive implements \Magento\Framework\Data\OptionSourceInterface
{
    /**
     * @var \Ashsmith\Blog\Model\Post
     */
    protected $post;

    /**
     * Constructor
     *
     * @param \Ashsmith\Blog\Model\Post $post
     */
    public function __construct(\Ashsmith\Blog\Model\Post $post)
    {
        $this->post = $post;
    }

    /**
     * Get options
     *
     * @return array
     */
    public function toOptionArray()
    {
        $options[] = ['label' => '', 'value' => ''];
        $availableOptions = $this->post->getAvailableStatuses();
        foreach ($availableOptions as $key => $value) {
            $options[] = [
                'label' => $value,
                'value' => $key,
            ];
        }
        return $options;
    }
}
{% endhighlight %}

The last class we're missing is the one we defined for our 'actions' column. This is another source for available actions to do to a single blog post

`Ui/Component/Listing/Column/PostActions.php`:

{% highlight php %}
<?php
namespace Ashsmith\Blog\Ui\Component\Listing\Column;

use Magento\Framework\View\Element\UiComponent\ContextInterface;
use Magento\Framework\View\Element\UiComponentFactory;
use Magento\Ui\Component\Listing\Columns\Column;
use Magento\Framework\UrlInterface;

class PostActions extends Column
{
    /** Url path */
    const BLOG_URL_PATH_EDIT = 'blog/post/edit';
    const BLOG_URL_PATH_DELETE = 'blog/post/delete';

    /** @var UrlInterface */
    protected $urlBuilder;

    /**
     * @var string
     */
    private $editUrl;

    /**
     * @param ContextInterface $context
     * @param UiComponentFactory $uiComponentFactory
     * @param UrlInterface $urlBuilder
     * @param array $components
     * @param array $data
     * @param string $editUrl
     */
    public function __construct(
        ContextInterface $context,
        UiComponentFactory $uiComponentFactory,
        UrlInterface $urlBuilder,
        array $components = [],
        array $data = [],
        $editUrl = self::BLOG_URL_PATH_EDIT
    ) {
        $this->urlBuilder = $urlBuilder;
        $this->editUrl = $editUrl;
        parent::__construct($context, $uiComponentFactory, $components, $data);
    }

    /**
     * Prepare Data Source
     *
     * @param array $dataSource
     * @return void
     */
    public function prepareDataSource(array & $dataSource)
    {
        if (isset($dataSource['data']['items'])) {
            foreach ($dataSource['data']['items'] as & $item) {
                $name = $this->getData('name');
                if (isset($item['post_id'])) {
                    $item[$name]['edit'] = [
                        'href' => $this->urlBuilder->getUrl($this->editUrl, ['post_id' => $item['post_id']]),
                        'label' => __('Edit')
                    ];
                    $item[$name]['delete'] = [
                        'href' => $this->urlBuilder->getUrl(self::BLOG_URL_PATH_DELETE, ['post_id' => $item['post_id']]),
                        'label' => __('Delete'),
                        'confirm' => [
                            'title' => __('Delete "${ $.$data.title }"'),
                            'message' => __('Are you sure you wan\'t to delete a "${ $.$data.title }" record?')
                        ]
                    ];
                }
            }
        }
    }
}
{% endhighlight %}

Now we have all our files required to make the grid page work, you should now be able to clear cache and access the grid page! Huzzah!

Next up, let's create our mass actions. So, we have already defined those as: Deleting, Enabling and Disabling posts. Each have their own controller actions, so let's create them:

`Controller/Adminhtml/Post/MassDelete.php`

{% highlight php %}
<?php
namespace Ashsmith\Blog\Controller\Adminhtml\Post;

/**
 * Class MassDelete
 */
class MassDelete extends \Magento\Backend\App\Action
{
    /**
     * Field id
     */
    const ID_FIELD = 'post_id';

    /**
     * Resource collection
     *
     * @var string
     */
    protected $collection = 'Ashsmith\Blog\Model\Resource\Post\Collection';

    /**
     * Page model
     *
     * @var string
     */
    protected $model = 'Ashsmith\Blog\Model\Post';
    /**
     * Execute action
     *
     * @return \Magento\Backend\Model\View\Result\Redirect
     * @throws \Magento\Framework\Exception\LocalizedException|\Exception
     */
    public function execute()
    {
        $selected = $this->getRequest()->getParam('selected');
        $excluded = $this->getRequest()->getParam('excluded');

        try {
            if (isset($excluded)) {
                if (!empty($excluded)) {
                    $this->excludedDelete($excluded);
                } else {
                    $this->deleteAll();
                }
            } elseif (!empty($selected)) {
                $this->selectedDelete($selected);
            } else {
                $this->messageManager->addError(__('Please select item(s).'));
            }
        } catch (\Exception $e) {
            $this->messageManager->addError($e->getMessage());
        }

        /** @var \Magento\Backend\Model\View\Result\Redirect $resultRedirect */
        $resultRedirect = $this->resultFactory->create(ResultFactory::TYPE_REDIRECT);
        return $resultRedirect->setPath(static::REDIRECT_URL);
    }

    /**
     * Delete all
     *
     * @return void
     * @throws \Exception
     */
    protected function deleteAll()
    {
        /** @var AbstractCollection $collection */
        $collection = $this->_objectManager->get($this->collection);
        $this->setSuccessMessage($this->delete($collection));
    }

    /**
     * Delete all but the not selected
     *
     * @param array $excluded
     * @return void
     * @throws \Exception
     */
    protected function excludedDelete(array $excluded)
    {
        /** @var AbstractCollection $collection */
        $collection = $this->_objectManager->get($this->collection);
        $collection->addFieldToFilter(static::ID_FIELD, ['nin' => $excluded]);
        $this->setSuccessMessage($this->delete($collection));
    }

    /**
     * Delete selected items
     *
     * @param array $selected
     * @return void
     * @throws \Exception
     */
    protected function selectedDelete(array $selected)
    {
        /** @var AbstractCollection $collection */
        $collection = $this->_objectManager->get($this->collection);
        $collection->addFieldToFilter(static::ID_FIELD, ['in' => $selected]);
        $this->setSuccessMessage($this->delete($collection));
    }

    /**
     * Delete collection items
     *
     * @param AbstractCollection $collection
     * @return int
     */
    protected function delete(AbstractCollection $collection)
    {
        $count = 0;
        foreach ($collection->getAllIds() as $id) {
            /** @var \Magento\Framework\Model\AbstractModel $model */
            $model = $this->_objectManager->get($this->model);
            $model->load($id);
            $model->delete();
            ++$count;
        }

        return $count;
    }

    /**
     * Set error messages
     *
     * @param int $count
     * @return void
     */
    protected function setSuccessMessage($count)
    {
        $this->messageManager->addSuccess(__('A total of %1 record(s) have been deleted.', $count));
    }
}
{% endhighlight %}


That's our delete action done. Now we need to create the enable and disable actions. First, we'll create as these actions will share a lot of functionality. In fact, the only thing to change between them will be a protected attribute `$status`.

`Controller/Adminhtml/AbstractMassStatus.php`

{% highlight php %}
<?php
namespace Ashsmith\Blog\Controller\Adminhtml;

use Magento\Framework\Model\Resource\Db\Collection\AbstractCollection;
use Magento\Framework\Controller\ResultFactory;

/**
 * Class AbstractMassStatus
 */
class AbstractMassStatus extends \Magento\Backend\App\Action
{
    /**
     * Field id
     */
    const ID_FIELD = 'entity_id';

    /**
     * Redirect url
     */
    const REDIRECT_URL = '*/*/';

    /**
     * Resource collection
     *
     * @var string
     */
    protected $collection = 'Magento\Framework\Model\Resource\Db\Collection\AbstractCollection';

    /**
     * Model
     *
     * @var string
     */
    protected $model = 'Magento\Framework\Model\AbstractModel';


    /**
     * Item status
     *
     * @var bool
     */
    protected $status = true;
    /**
     * Execute action
     *
     * @return \Magento\Backend\Model\View\Result\Redirect
     * @throws \Magento\Framework\Exception\LocalizedException|\Exception
     */
    public function execute()
    {
        $selected = $this->getRequest()->getParam('selected');
        $excluded = $this->getRequest()->getParam('excluded');
        try {
            if (isset($excluded)) {
                if (!empty($excluded)) {
                    $this->excludedSetStatus($excluded);
                } else {
                    $this->setStatusAll();
                }
            } elseif (!empty($selected)) {
                $this->selectedSetStatus($selected);
            } else {
                $this->messageManager->addError(__('Please select item(s).'));
            }
        } catch (\Exception $e) {
            $this->messageManager->addError($e->getMessage());
        }

        /** @var \Magento\Backend\Model\View\Result\Redirect $resultRedirect */
        $resultRedirect = $this->resultFactory->create(ResultFactory::TYPE_REDIRECT);
        return $resultRedirect->setPath(static::REDIRECT_URL);
    }

    /**
     * Set status to all
     *
     * @return void
     * @throws \Exception
     */
    protected function setStatusAll()
    {
        /** @var AbstractCollection $collection */
        $collection = $this->_objectManager->get($this->collection);
        $this->setStatus($collection);
    }

    /**
     * Set status to all but the not selected
     *
     * @param array $excluded
     * @return void
     * @throws \Exception
     */
    protected function excludedSetStatus(array $excluded)
    {
        /** @var AbstractCollection $collection */
        $collection = $this->_objectManager->get($this->collection);
        $collection->addFieldToFilter(static::ID_FIELD, ['nin' => $excluded]);
        $this->setStatus($collection);
    }

    /**
     * Set status to selected items
     *
     * @param array $selected
     * @return void
     * @throws \Exception
     */
    protected function selectedSetStatus(array $selected)
    {
        /** @var AbstractCollection $collection */
        $collection = $this->_objectManager->get($this->collection);
        $collection->addFieldToFilter(static::ID_FIELD, ['in' => $selected]);
        $this->setStatus($collection);
    }

    /**
     * Set status to collection items
     *
     * @param AbstractCollection $collection
     * @return void
     */
    protected function setStatus(AbstractCollection $collection)
    {
        foreach ($collection->getAllIds() as $id) {
            /** @var \Magento\Framework\Model\AbstractModel $model */
            $model = $this->_objectManager->get($this->model);
            $model->load($id);
            $model->setIsActive($this->status);
            $model->save();
        }
    }
}
{% endhighlight %}

Next up, our enable mass action: `Controller/Adminhtml/Post/MassEnable.php`

{% highlight php %}
<?php
namespace Ashsmith\Blog\Controller\Adminhtml\Post;

use Ashsmith\Blog\Controller\Adminhtml\AbstractMassStatus;

/**
 * Class MassEnable
 */
class MassEnable extends AbstractMassStatus
{
    /**
     * Field id
     */
    const ID_FIELD = 'post_id';

    /**
     * Resource collection
     *
     * @var string
     */
    protected $collection = 'Ashsmith\Blog\Model\Resource\Post\Collection';

    /**
     * Post model
     *
     * @var string
     */
    protected $model = 'Ashsmith\Blog\Model\Post';

    /**
     * Post enable status
     *
     * @var boolean
     */
    protected $status = true;
}
{% endhighlight %}

And finally the mass delete: `Controller/Adminhtml/Post/MassDisable.php`

{% highlight php %}
<?php
namespace Ashsmith\Blog\Controller\Adminhtml\Post;

use Ashsmith\Blog\Controller\Adminhtml\AbstractMassStatus;

/**
 * Class MassDisable
 */
class MassDisable extends AbstractMassStatus
{
    /**
     * Field id
     */
    const ID_FIELD = 'post_id';

    /**
     * Resource collection
     *
     * @var string
     */
    protected $collection = 'Ashsmith\Blog\Model\Resource\Post\Collection';

    /**
     * Post model
     *
     * @var string
     */
    protected $model = 'Ashsmith\Blog\Model\Post';

    /**
     * Post disable status
     *
     * @var boolean
     */
    protected $status = false;
}

{% endhighlight %}


Now that we can delete, enable and disable posts it's probably about time we made the ability to edit and create new posts! For this we need 3 more controllers: new, edit and save!

Let's start with the New action: `Controller/Adminhtml/Post/NewAction.php`

{% highlight php %}
<?php
namespace Ashsmith\Blog\Controller\Adminhtml\Post;

class NewAction extends \Magento\Backend\App\Action
{
    /**
     * @var \Magento\Backend\Model\View\Result\Forward
     */
    protected $resultForwardFactory;

    /**
     * @param \Magento\Backend\App\Action\Context $context
     * @param \Magento\Backend\Model\View\Result\ForwardFactory $resultForwardFactory
     */
    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Backend\Model\View\Result\ForwardFactory $resultForwardFactory
    ) {
        $this->resultForwardFactory = $resultForwardFactory;
        parent::__construct($context);
    }

    /**
     * {@inheritdoc}
     */
    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('Ashsmith_Blog::save');
    }

    /**
     * Forward to edit
     *
     * @return \Magento\Backend\Model\View\Result\Forward
     */
    public function execute()
    {
        /** @var \Magento\Backend\Model\View\Result\Forward $resultForward */
        $resultForward = $this->resultForwardFactory->create();
        return $resultForward->forward('edit');
    }
}
{% endhighlight %}

All we do here is simply forward the request onto the edit controller!

Let's create our edit action: `Controller/Adminhtml/Post/Edit.php`

{% highlight php %}
<?php
namespace Ashsmith\Blog\Controller\Adminhtml\Post;

use Magento\Backend\App\Action;

class Edit extends \Magento\Backend\App\Action
{
    /**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $_coreRegistry = null;

    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $resultPageFactory;

    /**
     * @param Action\Context $context
     * @param \Magento\Framework\View\Result\PageFactory $resultPageFactory
     * @param \Magento\Framework\Registry $registry
     */
    public function __construct(
        Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Framework\Registry $registry
    ) {
        $this->resultPageFactory = $resultPageFactory;
        $this->_coreRegistry = $registry;
        parent::__construct($context);
    }

    /**
     * {@inheritdoc}
     */
    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('Ashsmith_Blog::save');
    }

    /**
     * Init actions
     *
     * @return \Magento\Backend\Model\View\Result\Page
     */
    protected function _initAction()
    {
        // load layout, set active menu and breadcrumbs
        /** @var \Magento\Backend\Model\View\Result\Page $resultPage */
        $resultPage = $this->resultPageFactory->create();
        $resultPage->setActiveMenu('Ashsmith_blog::post')
            ->addBreadcrumb(__('Blog'), __('Blog'))
            ->addBreadcrumb(__('Manage Blog Posts'), __('Manage Blog Posts'));
        return $resultPage;
    }

    /**
     * Edit Blog post
     *
     * @return \Magento\Backend\Model\View\Result\Page|\Magento\Backend\Model\View\Result\Redirect
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function execute()
    {
        $id = $this->getRequest()->getParam('post_id');
        $model = $this->_objectManager->create('Ashsmith\Blog\Model\Post');

        if ($id) {
            $model->load($id);
            if (!$model->getId()) {
                $this->messageManager->addError(__('This post no longer exists.'));
                /** \Magento\Backend\Model\View\Result\Redirect $resultRedirect */
                $resultRedirect = $this->resultRedirectFactory->create();

                return $resultRedirect->setPath('*/*/');
            }
        }

        $data = $this->_objectManager->get('Magento\Backend\Model\Session')->getFormData(true);
        if (!empty($data)) {
            $model->setData($data);
        }

        $this->_coreRegistry->register('blog_post', $model);

        /** @var \Magento\Backend\Model\View\Result\Page $resultPage */
        $resultPage = $this->_initAction();
        $resultPage->addBreadcrumb(
            $id ? __('Edit Blog Post') : __('New Blog Post'),
            $id ? __('Edit Blog Post') : __('New Blog Post')
        );
        $resultPage->getConfig()->getTitle()->prepend(__('Blog Posts'));
        $resultPage->getConfig()->getTitle()
            ->prepend($model->getId() ? $model->getTitle() : __('New Blog Post'));

        return $resultPage;
    }
}
{% endhighlight %}

Before rendering the page, we attempt to load a record, and also check if any form data was previously submitted. If it was, we'll set the data on our model, then finally the model is added to the registry.

Now that we have our edit page, let's create our layout file, and blocks that will make up the page and display a form for us!

`view/adminhtml/layout/blog_post_edit.xml`

{% highlight xml %}
<?xml version="1.0"?>
<!--
/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
-->
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="../../../../../../../lib/internal/Magento/Framework/View/Layout/etc/page_configuration.xsd">
    <update handle="editor"/>
    <body>
        <referenceContainer name="content">
            <block class="Ashsmith\Blog\Block\Adminhtml\Post\Edit" name="blog_post_edit"/>
        </referenceContainer>
    </body>
</page>
{% endhighlight %}

Now we need to create our corresponding blocks!

`Block/Adminhtml/Post/Edit.php`
{% highlight php %}
<?php
namespace Ashsmith\Blog\Block\Adminhtml\Post;

class Edit extends \Magento\Backend\Block\Widget\Form\Container
{
    /**
     * Core registry
     *
     * @var \Magento\Framework\Registry
     */
    protected $_coreRegistry = null;

    /**
     * @param \Magento\Backend\Block\Widget\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Widget\Context $context,
        \Magento\Framework\Registry $registry,
        array $data = []
    ) {
        $this->_coreRegistry = $registry;
        parent::__construct($context, $data);
    }

    /**
     * Initialize blog post edit block
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_objectId = 'post_id';
        $this->_blockGroup = 'Ashsmith_Blog';
        $this->_controller = 'adminhtml_post';

        parent::_construct();

        if ($this->_isAllowedAction('Ashsmith_Blog::save')) {
            $this->buttonList->update('save', 'label', __('Save Blog Post'));
            $this->buttonList->add(
                'saveandcontinue',
                [
                    'label' => __('Save and Continue Edit'),
                    'class' => 'save',
                    'data_attribute' => [
                        'mage-init' => [
                            'button' => ['event' => 'saveAndContinueEdit', 'target' => '#edit_form'],
                        ],
                    ]
                ],
                -100
            );
        } else {
            $this->buttonList->remove('save');
        }

        if ($this->_isAllowedAction('Ashsmith_Blog::post_delete')) {
            $this->buttonList->update('delete', 'label', __('Delete Post'));
        } else {
            $this->buttonList->remove('delete');
        }
    }

    /**
     * Retrieve text for header element depending on loaded post
     *
     * @return \Magento\Framework\Phrase
     */
    public function getHeaderText()
    {
        if ($this->_coreRegistry->registry('blog_post')->getId()) {
            return __("Edit Post '%1'", $this->escapeHtml($this->_coreRegistry->registry('blog_post')->getTitle()));
        } else {
            return __('New Post');
        }
    }

    /**
     * Check permission for passed action
     *
     * @param string $resourceId
     * @return bool
     */
    protected function _isAllowedAction($resourceId)
    {
        return $this->_authorization->isAllowed($resourceId);
    }

    /**
     * Getter of url for "Save and Continue" button
     * tab_id will be replaced by desired by JS later
     *
     * @return string
     */
    protected function _getSaveAndContinueUrl()
    {
        return $this->getUrl('blog/*/save', ['_current' => true, 'back' => 'edit', 'active_tab' => '{{tab_id}}']);
    }
}
{% endhighlight %}

And the form block too: `Block/Adminhtml/Post/Edit/Form.php`

{% highlight php %}
<?php
namespace Ashsmith\Blog\Block\Adminhtml\Post\Edit;

/**
 * Adminhtml blog post edit form
 */
class Form extends \Magento\Backend\Block\Widget\Form\Generic
{

    /**
     * @var \Magento\Store\Model\System\Store
     */
    protected $_systemStore;

    /**
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\Framework\Data\FormFactory $formFactory
     * @param \Magento\Cms\Model\Wysiwyg\Config $wysiwygConfig
     * @param \Magento\Store\Model\System\Store $systemStore
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Data\FormFactory $formFactory,
        \Magento\Store\Model\System\Store $systemStore,
        array $data = []
    ) {
        $this->_systemStore = $systemStore;
        parent::__construct($context, $registry, $formFactory, $data);
    }

    /**
     * Init form
     *
     * @return void
     */
    protected function _construct()
    {
        parent::_construct();
        $this->setId('post_form');
        $this->setTitle(__('Post Information'));
    }

    /**
     * Prepare form
     *
     * @return $this
     */
    protected function _prepareForm()
    {
        /** @var \Ashsmith\Blog\Model\Post $model */
        $model = $this->_coreRegistry->registry('blog_post');

        /** @var \Magento\Framework\Data\Form $form */
        $form = $this->_formFactory->create(
            ['data' => ['id' => 'edit_form', 'action' => $this->getData('action'), 'method' => 'post']]
        );

        $form->setHtmlIdPrefix('post_');

        $fieldset = $form->addFieldset(
            'base_fieldset',
            ['legend' => __('General Information'), 'class' => 'fieldset-wide']
        );

        if ($model->getPostId()) {
            $fieldset->addField('post_id', 'hidden', ['name' => 'post_id']);
        }

        $fieldset->addField(
            'title',
            'text',
            ['name' => 'title', 'label' => __('Post Title'), 'title' => __('Post Title'), 'required' => true]
        );

        $fieldset->addField(
            'url_key',
            'text',
            [
                'name' => 'url_key',
                'label' => __('URL Key'),
                'title' => __('URL Key'),
                'required' => true,
                'class' => 'validate-xml-identifier'
            ]
        );

        $fieldset->addField(
            'is_active',
            'select',
            [
                'label' => __('Status'),
                'title' => __('Status'),
                'name' => 'is_active',
                'required' => true,
                'options' => ['1' => __('Enabled'), '0' => __('Disabled')]
            ]
        );
        if (!$model->getId()) {
            $model->setData('is_active', '1');
        }

        $fieldset->addField(
            'content',
            'editor',
            [
                'name' => 'content',
                'label' => __('Content'),
                'title' => __('Content'),
                'style' => 'height:36em',
                'required' => true
            ]
        );

        $form->setValues($model->getData());
        $form->setUseContainer(true);
        $this->setForm($form);

        return parent::_prepareForm();
    }
}
{% endhighlight %}

And there we have it! We're just missing the ability to save our blog posts now! So let's setup our final controller:

`Controller/Adminhtml/Post/Save.php`

{% highlight php %}
<?php
namespace Ashsmith\Blog\Controller\Adminhtml\Post;

use Magento\Backend\App\Action;
use Magento\TestFramework\ErrorLog\Logger;

class Save extends \Magento\Backend\App\Action
{

    /**
     * @param Action\Context $context
     */
    public function __construct(Action\Context $context)
    {
        parent::__construct($context);
    }

    /**
     * {@inheritdoc}
     */
    protected function _isAllowed()
    {
        return $this->_authorization->isAllowed('Ashsmith_Blog::save');
    }

    /**
     * Save action
     *
     * @return \Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        $data = $this->getRequest()->getPostValue();
        /** @var \Magento\Backend\Model\View\Result\Redirect $resultRedirect */
        $resultRedirect = $this->resultRedirectFactory->create();
        if ($data) {
            /** @var \Ashsmith\Blog\Model\Post $model */
            $model = $this->_objectManager->create('Ashsmith\Blog\Model\Post');

            $id = $this->getRequest()->getParam('post_id');
            if ($id) {
                $model->load($id);
            }

            $model->setData($data);

            $this->_eventManager->dispatch(
                'blog_post_prepare_save',
                ['post' => $model, 'request' => $this->getRequest()]
            );

            try {
                $model->save();
                $this->messageManager->addSuccess(__('You saved this Post.'));
                $this->_objectManager->get('Magento\Backend\Model\Session')->setFormData(false);
                if ($this->getRequest()->getParam('back')) {
                    return $resultRedirect->setPath('*/*/edit', ['post_id' => $model->getId(), '_current' => true]);
                }
                return $resultRedirect->setPath('*/*/');
            } catch (\Magento\Framework\Exception\LocalizedException $e) {
                $this->messageManager->addError($e->getMessage());
            } catch (\RuntimeException $e) {
                $this->messageManager->addError($e->getMessage());
            } catch (\Exception $e) {
                $this->messageManager->addException($e, __('Something went wrong while saving the post.'));
            }

            $this->_getSession()->setFormData($data);
            return $resultRedirect->setPath('*/*/edit', ['post_id' => $this->getRequest()->getParam('post_id')]);
        }
        return $resultRedirect->setPath('*/*/');
    }
}
{% endhighlight %}

### And that's it!

Clear cache, and you'll now have a fully functional Magento 2 module!

The final addition to the series will be adding unit tests to everything we have created. Check back soon!

As always, you can checkout this version of the tutorial from composer:

    composer require ashsmith/magento2-blog-module-example:0.5.0
