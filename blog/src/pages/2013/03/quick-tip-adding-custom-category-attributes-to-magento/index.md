---
title: 'Quick Tip: Adding Custom Category Attributes to Magento'
date: "2013-03-11T12:00:00Z"
description: "In this short article I will teach you how to create a module that will add custom category attributes into your magento install. It's really dead simple."
author: Ash Smith
layout: post
comments: true
permalink: /2013/03/quick-tip-adding-custom-category-attributes-to-magento/
dsq_thread_id:
  - 1243038583
category: "Magento 1"
---
Time and time again I need to create a custom category attribute for a site I'm working on, and each time I search for a good article covering the topic in depth I fall short, and half written and poorly explained versions of how to do exactly this. I've learnt how to do this over time, and now I'll share exactly how to, and also how it works. First of all, I'll show you the code for each file, and explain everything afterwards.

### Lets get going then..

To create a custom attribute we are going to create it as a module, the reason for this is so when we come to install our Magento site on another server, or if our extension we're developing needs to be used on other Magento installs our custom category attribute will be installed if it doesn't yet exist!

First of all let's set up our basic module file structure we need for this:

    app/code/local/Meteorify/Customcatattrb
    app/code/local/Meteorify/Customcatattrb/etc
    app/code/local/Meteorify/Customcatattrb/sql/customcatattrb_setup


Now let's create the files, first up is our config.xml, this is the main file within your module which tells Magento which controllers and models to load, plus plenty more.

Save this file to: `app/code/local/Meteorify/Customcatattrb/etc/config.xml`

```xml
<?xml version="1.0"?>
<config>
  <modules>
    <Meteorify_Customcatattrb>
      <version>0.0.1</version>
    </Meteorify_Customcatattrb>
  </modules>
    <global>
      <resources>
          <customcatattrb_setup>
            <setup>
              <module>Meteorify_Customcatattrb</module>
              <class>Mage_Eav_Model_Entity_Setup</class>
            </setup>
            <connection>
              <use>default_setup</use>
            </connection>
          </customcatattrb_setup>
      </resources>
    </global>
</config>
```

So what we have done here is defined a few requirements for our module. We tell Magento to load in the setup resources, and which database connection to use. If we wanted, we could define our own class for the setup, extending off of the same class specified above so we can do a few more things to install our attributes. However that is out of scope for this article today.

Next up, let's create yet another XML file, this time it's our file which lets magento know we have a module to be loaded in, and where the module is located.

Save this file to: `app/etc/modules/Meteorify_Customcatattrb.xml`

```xml
<?xml version="1.0"?>
<config>
  <modules>
    <Meteorify_Customcatattrb>
      <active>true</active>
      <codePool>local</codePool>
    </Meteorify_Customcatattrb>
  </modules>
</config>
```  


As mentioned above, all this file does is let Magento know this module exists, and to load it. We also specify which code pool it belong to (either Community, Core, or Local).

Last but not least, is our install script. This is a tiny script which will install our attribute to the database, and we can start using our newly created attribute straight away after!

Save to: `app/code/local/Meteorify/Customcatattrb/sql/customcatattrb_setup/mysql4-install-0.0.1.php`

```php
<?php
$installer = $this;
$installer->startSetup();
$attribute  = array(
    'type' => 'text',
    'label'=> 'Bottom Description',
    'input' => 'textarea',
    'global' => Mage_Catalog_Model_Resource_Eav_Attribute::SCOPE_GLOBAL,
    'visible' => true,
    'required' => false,
    'user_defined' => true,
    'default' => "",
    'group' => "General Information"
);
$installer->addAttribute('catalog_category', 'bottom_description', $attribute);
$installer->endSetup();
?>
```

Once you have done all of this, clear the cache, and head over to `Catalog > Manage Categories` and you will now see your new custom attribute appearing at the bottom of the General Information tab. Perfecto!

### Explanation of our module

In this dead simple module the main points I want to make is about our install script we created. Whenever we install this module on another Magento install our attribute will be created along with it. Making it super easy to maintain! So let's dig into it a bit, and learn what else we can do with this.

Let's start with our `$attribute` variable which contains an array of values.

`type` = The character type, it can be any of the following: text, varchar, or int

`label` = Label is the visible name of our attribute. This allows us to define a more human friendly title to our attribute.

`input` = Input is how the data will be inputted by the end-user. In this case we used a `textarea`, but we can also use `text`, or other ones such as drop downs, multi-selects and date ranges. We'll cover these other attributes in more depth another time.

`global` = Global simply defines the scope of the attribute. By default I use the global scope available on all store views, and website views.

`visible` = Is a boolean, it simply states whether or not the module is visible to the user or not.

`required` = Self explanatory, we can set this to `true` to make the field mandatory for the user to fill in before saving the category.

`user_defined` = If the user can define the value of this or not.

`group` = The tab where this attribute will live. If you enter a new tab name, it will create the new tab for you.

#### Parameters I didn't include:

`sort_order` = Here we can define which position this attribute appears when editing a category.

`option` = If we have defined our input to be a drop down or mutli-select we can use this to define our different options, see the code below for a complete example:

    'option' => array ('value' => array(
        'optionone'=> array(
            0 =>'My First Option'),
        'optiontwo'=> array(
            0 =>'My Second Option'))),


### Using your new attribute

If you want to use this attribute in your template file, you can do so with the following:

```php
  <?php echo $_category->getBottomDescription() ?>
```
### And that's how you create a custom category attribute

I hope you learnt something from this article. I have personally learnt more researching for this article than I have trying to find an article to simply follow.

I will be doing a follow up post covering attributes in a more complete way, covering custom product attributes, CMS page attributes and more!

If you have any questions, post them in the comments and I'll do my best to answer. Although, stack overflow will be the best place.
