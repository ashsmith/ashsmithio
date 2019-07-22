---
title: 'Getting the add to cart URL for a product.'
date: "2018-01-17T12:00:00Z"
description: "Quick Tip on how to get the add to cart URL for a product in Magento 2, the right way."
author: Ash Smith
layout: post
permalink: /magento2/tip-getting-add-to-cart-url-for-product/
category: "Magento 2"
comments: true
---

Sometimes you’ll need to get the add to cart URL for a given product, to do this you’ll want to use the following helper class: `Magento\Checkout\Helper\Cart`, and the method: `getAddUrl`.

Below is a practical example of this being used:


```php
<?php
namespace Namespace\Module\Block;

use \Magento\Framework\View\Element\Template;
use \Magento\Framework\View\Element\Template\Context;
use \Magento\Checkout\Helper\Cart as CartHelper;
use \Magento\Catalog\Api\ProductRepositoryInterface;

class MyBlock extends Template {

    protected $cartHelper;
    protected $productRepository;

    public function __construct(CartHelper $cartHelper, ProductRepositoryInterface $productRepository Context $context, array $data = []) 
    {
        $this->cartHelper = $cartHelper;
        $this->productRepository = $productRepository;
        parent::__construct($context, $data);
    }

    public function getAddToCartUrlForProduct($productSku)
    {
        $product = $this->productRepository->get($productSku);
        return $this->cartHelper->getAddUrl($product);
    }

}
```


Don’t forget that any similar examples using the ObjectManager are bad practise and should be avoided.

Final note: When you use this URL, make sure you submit it with a POST request, and that the request [contains the form key too](/magento2/tip-getting-a-form-key-in-your-template/)!