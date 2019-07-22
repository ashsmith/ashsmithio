---
title: 'Adding custom images to the product media gallery.'
date: "2018-01-02T12:00:00Z"
description: "Magento 2 tip: Add custom images to the product media gallery"
author: Ash Smith
layout: post
category: "Magento 2"
comments: true
---

Recently needed to add custom images to the media gallery, and below are the two approaches I investigated. 

First of all, lets look how to do this in Javascript, as this seemed like a good way of going about it. By modifying the media gallery widget we can update the gallery images fairly easily:

```html
<script>
    require(['jquery'], function ($) {
        var gallerySelector = '[data-gallery-role=gallery-placeholder]';
        $(gallerySelector).on('gallery:loaded', function () {
            var gallery = $(gallerySelector).data('gallery');
            var images = gallery.returnCurrentImages();
            images.push({
                img: 'image1.jpg',
                thumb: 'thumb1.jpg',
                full: 'full1.jpg',
                caption: 'caption',
                position: 100
            });
            gallery.updateData(images);
        });
    });
</script>
```

This works quite nicely. But to be honest, I’d prefer the images to be added to the gallery in PHP code rather than in JS, because it’ll have less of a performance impact.

So let’s take a look at my second, and final approach:

I used a plugin after `getGalleryImages` is called on the Gallery block class: `Magento\Catalog\Block\Product\View\Gallery`. All we’ll need to do is add our image data to the collection that `getGalleryImages` returns. Simple as that.

File: `di.xml`
```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:noNamespaceSchemaLocation="urn:magento:framework:ObjectManager/etc/config.xsd">
	<type name="Magento\Catalog\Block\Product\View\Gallery">
        <plugin name="add_images_to_gallery" type="VENDOR\MODULE\Plugin\AddImagesToGalleryBlock" />
    </type>
</config>
```

File: `Plugin/AddImagesToGalleryBlock.php`
```php
<?php
namespace VENDOR\MODULE\Plugin;

use Magento\Catalog\Helper\Image;
use Magento\Catalog\Model\Product;
use Magento\Framework\App\Filesystem\DirectoryList;
use Magento\Catalog\Block\Product\View\Gallery;

class AddImagesToGalleryBlock
{
    protected $dataCollectionFactory;
    protected $filesystem;
    protected $mediaConfig;
    protected $imageHelper;
    protected $dataCollectionFactory;

    public function __construct(
        \Magento\Framework\Data\CollectionFactory $dataCollectionFactory,
        \Magento\Framework\Filesystem $filesystem,
        \Magento\Catalog\Model\Product\Media\Config $mediaConfig,
        Image $imageHelper,
        \Magento\Framework\Data\CollectionFactory $dataCollectionFactory
)
    {
        $this->dataCollectionFactory = $dataCollectionFactory;
        $this->filesystem = $filesystem;
        $this->mediaConfig = $mediaConfig;
        $this->imageHelper = $imageHelper;
        $this->dataCollectionFactory = $dataCollectionFactory;
    }

    /**
     * @param Gallery $subject
     * @param \Magento\Framework\Data\Collection|null $images
     * @return \Magento\Framework\Data\Collection|null
     */
    public function afterGetGalleryImages(Gallery $subject, $images) {
        $product = $subject->getProduct();
        if (!$images instanceof  \Magento\Framework\Data\Collection) {
            $images = $this->dataCollectionFactory->create();
        }

       
        $myCustomImages = $product->getExtensionAttributes()->getCustomImages();
        if (empty($myCustomImages)) {
            return $images;
        }

        $directory = $this->filesystem->getDirectoryRead(DirectoryList::MEDIA);

        $imageId = uniqid();
        $imageCount = $images->getSize();
        $myCustomImage = '/s/o/some_image.jpg';
        $file = $myCustomImage;
        $smallImage = $this->imageHelper->init($product, 'product_page_image_small')
            ->setImageFile($file)
            ->getUrl();
        $mediumImage = $this->imageHelper->init($product, 'product_page_image_medium')
            ->constrainOnly(true)->keepAspectRatio(true)->keepFrame(false)
            ->setImageFile($file)
            ->getUrl();
        $largeImage = $this->imageHelper->init($product, 'product_page_image_large')
            ->constrainOnly(true)->keepAspectRatio(true)->keepFrame(false)
            ->setImageFile($file)
            ->getUrl();
            
        $image = [
            'file' => $file,
            'media_type' => 'image',
            'value_id' => $imageId, // unique value
            'row_id' => $imageId, // unique value
            'label' => 'some image',
            'label_default' => 'some image',
            'position' => 100,
            'position_default' => 100,
            'disabled' => 0,
            'url'  => $this->mediaConfig->getMediaUrl($file),
            'path' => $directory->getAbsolutePath($this->mediaConfig->getMediaPath($file)),
            'small_image_url' => $smallImage,
            'medium_image_url' => $mediumImage,
            'large_image_url' => $largeImage
        ];
        $images->addItem(new \Magento\Framework\DataObject($image));

        return $images;
    }
}

```


*Side note:* you can see I used the product image helper (`$this->imageHelper`) to fetch the small, medium and large images. This is because the images I’m using are actually stored in the product media (`pub/media/catalog/product`) directory, and it seemed like a good idea to stick to Magento’s image resizing without any additional customisations.

I hope this article points you in the right direction to adding images to the media gallery! 