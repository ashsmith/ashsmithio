---
title: 'Quick Tip: Adding blocks to templates in Magento'
date: "2011-08-13T12:00:00Z"
author: Ash Smith
layout: post
comments: true
permalink: /2011/08/quick-tip-adding-blocks-to-templates-in-magento/
category: "Magento 1"
---
Today we're going to look at how you can use php to add blocks, both static CMS blocks and blocks that include things like featured products, we can use this line of php in any of our phtml files within the template folder of our themes. Although the same result can be replicated using the XML layout files, this can be used as an alternative way of getting the same result.

## Fetching CMS Blocks using PHP

This first example shows you how to load CMS Blocks into your template files, if you're building a template that will be used by other people, it would be best to not use this, since adding CMS Blocks means the static cms block needs to exist in the installation of the Magento site. Unless you have clear instructions, and you consider it the only way, then by all means use it at free will.

```php
<?php
    echo $this->getLayout()->createBlock('cms/block')->setBlockId('contacts_text')->toHtml();
?>
```

## Fetching Template Blocks using PHP

This second example here shows you how to add any other block type with a specified template, this example below grabs the related products list. This example would be perfectly acceptable to use in a template that will be redistributed. However like I mentioned before you could in actual fact include this in your layout structure (XML files) rather than using it directly in your template files (phtml files)

```php
<?php
    echo $this->getLayout()->createBlock('catalog/product_list_related')->setTemplate('catalog/product/list/related.phtml')->toHtml();
?>
```

## Final Words

By using these php snippets to include Blocks into your templates you can speed up your development. I've often found myself struggling to get blocks to display when using the XML layout files, so by including these snippets you can bypass this. However, use with caution I'm not aware of any performance issues with using this method although I would advise you test both methods and decide which is best for you.

As usual, thanks for reading and I welcome any comments
