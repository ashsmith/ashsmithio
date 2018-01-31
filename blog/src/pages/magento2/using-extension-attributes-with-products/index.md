---
title: 'Using Extension Attributes in Magento 2 on Products'
date: "2017-03-13T12:00:00Z"
description: "Magento 2 module development using extension attributes to enhance your product pages"
author: Ash Smith
layout: post
permalink2: /magento2/using-extension-attributes-with-products/
permalink: /ash-is-testing-here
category: "Magento 2"
comments: true
---

In today’s post I’m going to go over how I create custom attributes for products. I will be creating a standalone module that will create my desired product attribute, and we handle how data is saved and fetched from the attribute.

In this tutorial I’ll be creating a “features” attribute. It will simply be a text area attribute, where the admin can define the products features via an unordered list.

## Step 1) Create our module

I’m using n98-magerun2 for generating my module, so I won’t post all the initial code for this, but this command gives us the boilerplate we’d like:

```bash
n98-magerun2.phar dev:module:create --add-setup --add-readme --add-composer --author-name="Ash Smith" --author-email="hello@ashsmith.io" Ashsmith ProductFeatures
```

# Step 2) Create our InstallData class
Our InstallData class handle the creation of our new `features` attribute:

```php
<?php

namespace Ashsmith\ProductFeatures\Setup;

use Magento\Framework\Setup\InstallDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Eav\Setup\EavSetupFactory;
use Magento\Catalog\Model\Product;

class InstallData implements InstallDataInterface
{
    /**
     * @param EavSetupFactory $eavSetupFactory
     */
    public function __construct(EavSetupFactory $eavSetupFactory)
    {
        $this->eavSetupFactory = $eavSetupFactory;
    }

    public function install(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        /** @var \Magento\Eav\Setup\EavSetup $eavSetup */
        $eavSetup = $this->eavSetupFactory->create(['setup' => $setup]);

        // Add our "features" attribute
        $eavSetup->addAttribute(Product::ENTITY, 'features', [
            'type' => 'text',
            'label' => 'Features',
            'input' => 'textarea',
            'required' => false,
            'sort_order' => 100,
            'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
            'wysiwyg_enabled' => true,
            'is_html_allowed_on_front' => true,
        ]);

        $setup->endSetup();
    }
}
```

This class contains two methods `__construct` and `install`. Let’s walk through them quickly.

In the `__construct` we are injecting our only dependency. The `Magento\Eav\Setup\EavSetupFactory` class. We require this class in order to create EAV attributes.

Meanwhile the `install` is required by `InstallDataInterface`, this is the public method that will be executed when our module is installed. Within here we run `$setup->startSetup()` (remember that from Magento 1? It does the same thing, disables foreign key constraint.). Then we create our attribute. Finished off with `$setup->endSetup()` which enables foreign key constraints again.

Let’s discuss the attribute settings

```php
[
    'type' => 'text',
    'label' => 'Features',
    'input' => 'textarea',
    'required' => false,
    'sort_order' => 100,
    'global' => \Magento\Eav\Model\Entity\Attribute\ScopedAttributeInterface::SCOPE_STORE,
    'wysiwyg_enabled' => true,
    'is_html_allowed_on_front' => true,
]
```

The `type` key informs us which which EAV table this attributes data will saved to. In this case it’s `catalog_product_entity_text`. 

`label` is a user friendly label that is used within the admin (and can be used on the frontend too).

 `input` defined the type of input that will be used, so in our case we’re going for a `textarea` as I want people to write multiple lines. 

`required` is a boolean value, which tells us if the field is required to be entered before the product can be saved.

`sort_order` defines the order it will be displayed within the admin.

`global` tells us the scope that is allowed for the value to be modified. In this case I have defined it to the store scope, which means you can override this value on specific store views if you wish. Other options are: website (you can override a website level at most), global (can only be defined on the global scope).

`wysiwyg_enabled` is a boolean that will make the WYSIWYG editor display for this particular attribute. Allowing admin users to use a GUI style interface instead of authoring raw HTML.

`is_html_allowed_on_front` tells the validation engine that HTML is allowed for this attribute. This is important as we’d like to render the HTML!

## Step 3) Install our module and test the attribute exists!

Next up, we’ll need to enable our module and install the data.

```bash
bin/magento module:enable Ashsmith_ProductFeatures
bin/magento setup:upgrade
```

Once this has run, we can head to the admin and modify an existing product (or create a new one), and you’ll now find your new attribute!

Ok great. Now how do we use it on the frontend? Let’s move on to that now!

## Step 4) Define our configuration in extension_attributes.xml and di.xml

The first step is to register our extension attribute with Magento 2. We do this like with `extension_attributes.xml` which lives within the `etc` directory of your module.

`etc/extension_attributes.xml`

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Api/etc/extension_attributes.xsd">
    <extension_attributes for="Magento\Catalog\Api\Data\ProductInterface">
        <attribute code="features" type="string" />
    </extension_attributes>
</config>
```

Note: `<extension_attributes for=“CLASS”>`? This tells Magento 2 which class we are defining an extension attribute for. As we’re doing this for a product, we’ll need to use the `Magento\Catalog\Api\Data\ProductInterface` interface.

The next line `<attribute code=“” type=“” />` defines our attributes. We give them a name, and a type. The `type` in this case can reference either a PHP type or a class type.

Next up is our `di.xml` again, living in `etc` directory. This is so we can register a plugin to set data to our extension attribute (I’ll cover this more in the next step)

`etc/di.xml`

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:ObjectManager/etc/config.xsd">
    <type name="Magento\Catalog\Api\ProductRepositoryInterface">
        <plugin name="get_product_features" type="Ashsmith\ProductFeatures\Plugin\ProductGet"/>
    </type>
</config>
```
 
In our di.xml we have defined a plugin for the `ProductRepositoryInterface`. Our plugin class is: `Ashsmith\ProductFeatures\Plugin\ProductGet` we’ll need to create this in the next step.

## Step 5) Create our plugin

Now, when creating extension_attributes you can implement your own logic. Thats one of the powerful features of extension_attributes. Instead of defining a PHP type you could instead specify a class that implements a bunch of logic. However, the drawback is if you’re implementing something “simple” like an attribute in our case, we still need to do all the hard work. No magic here folks.

The way we achieve this is by defining a plugin around the `getById` method on the `ProductRepositoryInterface` interface. At this point we can handle fetching data directly from the product model, and set it on the extension attribute class.

```php
<?php namespace Ashsmith\ProductFeatures\Plugin;

use Magento\Catalog\Api\Data\ProductInterface;

class ProductGet
{
    protected $productExtensionFactory;
    protected $productFactory;

    public function __construct(
        \Magento\Catalog\Api\Data\ProductExtensionFactory $productExtensionFactory,
        \Magento\Catalog\Model\ProductFactory $productFactory
    )
    {
        $this->productFactory = $productFactory;
        $this->productExtensionFactory = $productExtensionFactory;
    }

    public function aroundGetById(
        \Magento\Catalog\Api\ProductRepositoryInterface $subject,
        \Closure $proceed,
        $customerId
    )
    {
        /** @var ProductInterface $product */
        $product = $proceed($customerId);

	// If extension attribute is already set, return early.
        if ($product->getExtensionAttributes() && $product->getExtensionAttributes()->getFeatures()) {
            return $product;
        }

        // In the event that extension attribute class has not be instansiated yet.
        // in this event, we create it ourselves.
        if (!$product->getExtensionAttributes()) {
            $productExtension = $this->productExtensionFactory->create();
            $product->setExtensionAttributes($productExtension);
        }

        // Fetch the raw product model (I have not found a better way), and set the data onto our attribute.
        $productModel = $this->productFactory->create()->load($product->getId());
        $product->getExtensionAttributes()
            ->setFeatures($productModel->getData('features'));

        return $product;
    }
}
```

## Step 6)  Creating a Block and template

To finish this off, let’s create a quick Block and template to test all of this.

Create: `Block/Features.php`
Here we’re extending `Magento\Catalog\Block\Product\View` this gives us access to the current product with ease.

```php
<?php
namespace Ashsmith\ProductFeatures\Block;

use Magento\Catalog\Block\Product\View;

class Features extends View
{
    public function getFeatures()
    {
        return $this->getProduct()->getExtensionAttributes()->getFeatures();
    }
}
```

Create: `view/frontend/template/product_features.phtml`

```php
<?php /** @var $block Ashsmith\ProductFeatures\Block\Features */ ?>
<div class="product-view-features">
    <h4><?php echo __("Features:") ?></h4>
    <?php echo $block->getFeatures(); ?>
</div>
```

Create: `view/frontend/layout/catalog_product_view.xml`

```xml
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceContainer name="content">
            <block class="Ashsmith\ProductFeatures\Block\Features" name="product.info.features"
                   after="product.info.details"
                   template="Ashsmith_ProductFeatures::product_features.phtml"/>
        </referenceContainer>
    </body>
</page>
```

## Step 7) Give it a test drive!
Now we can flush cache, and head to a product. With a little luck we’ll have our features displaying on the page.

Side note: I didn’t implement any logic to hide the features when none are set to keep this simple.

## Magento 2 extension attribute gotchas.
Please, please use developer mode: `bin/magento deploy:mode:set developer`. Whilst writing this article I did not need to re-compile DI (despite what you may think. I promise. Developer mode is the reason for this.)

## Bonus. Add some less
Nothing fancy. But I’d like to bump up the font size, make ‘em bold and spread ‘em out a bit.

You can add LESS to your modules by creating a `_module.less` file:

`view/frontend/web/css/source/_module.less`

```less
.product-view-features {
    li {
        font-size: 1.2em;
        font-weight: bold;
        line-height: 2em;
    }
}
```

