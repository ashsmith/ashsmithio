---
title: 'Getting a form key for your form.'
date: "2018-01-17T12:00:00Z"
description: "Quick Tip on how to get a form key in Magento 2, the right way."
author: Ash Smith
layout: post
permalink: /magento2/tip-getting-a-form-key-in-your-template/
category: "Magento 2"
comments: true
---

I was googling around how to add a form key to my form today, and posts out there were telling me to use the ObjectManager. Which is a terrible idea. So, here’s the right way.

Trying to figure out how to add a form key to your form? You’ll need to add `Magento\Framework\Data\Form\FormKey`  class as a dependency to your Block, and get the form key from the method `getFormKey()`.

Here’s a practical example:

```php
<?php
namespace Namespace\Module\Block;

use \Magento\Framework\View\Element\Template;
use \Magento\Framework\View\Element\Template\Context;
use \Magento\Framework\Data\Form\FormKey;

class MyBlock extends Template {

    protected $formKey;

    public function __construct(FormKey $formKey, Context $context, array $data = []) 
    {
        $this->formKey = $forKey
        parent::__construct($context, $data);
    }

    public function getFormKey()
    {
         return $this->formKey->getFormKey();
    }

}
```

Then in your template you’ll be able to use it like so:

```html
<?php /** @var $block \Namespace\Module\Block\MyBlock */ ?>
<form action="/myform" method="post">
    <input type="hidden" name="form_key" value="<?php echo $block->getFormKey() ?>" />
    <!-- ... Rest of your form ... -->
</form>
```

If you’re new to adding classes as dependencies, and want to learn more check out: [Dependency injection - Magento 2 Developer Documentation](http://devdocs.magento.com/guides/v2.0/extension-dev-guide/depend-inj.html)

Equally, learn about why another approach that uses the ObjectManager is a terrible idea: [ObjectManager - Magento 2 Developer Documentation](http://devdocs.magento.com/guides/v2.0/extension-dev-guide/object-manager.html)

Until next time.