---
layout: post
title: Importing Product Images via CSV in Magento 1.7.0.0
description: "Sometimes importing images via CSV in Magento is as straightforward as you'd like. This useful post goes over exactly how to do that in Magento with ease."
comments: true
share: true
category: Magento Development
permalink: /2012/05/importing-product-images-via-csv-in-magento-1-7-0-0/
---
Many users have reported issues when trying to import images using the default Import/Export within Magento. I too have suffered this headache. Luckily, I have figured out a way to bypass any issues by separating out our import files.

Traditionally when we import our CSV, we have one giant document full of attributes. Including all the image references  Well, in my version don&#8217;t include the image attributes. Instead, we&#8217;ll put those into a new CSV along side a column with the SKU of the product.

In order to import a second CSV that is customised like this we&#8217;ll need a separate import profile. I&#8217;ll teach you how to create one now.

## Step 1) Create the advanced profile

The solution is to create a custom import profile (System > Import/Export > Dataflow &#8211; Profiles). You only need to include the attributes that are required, which is just the SKU. Plus the appropiate image attributes. Plus labels if you want to go all out.

When you are creating your new profile, enter the following settings:


<img alt="Magento Import Profile Setup" src="/images/uploads/2012/12/Magento-import-profile.png" width="719" height="775" />

Now you can hit save! With our Profile now complete, we just need to create the folder media/import. This is where you will be storing all your images awaiting import.

## Step 2) Create your Magento images import CSV

So now we have our profile created all we need to do is create our CSV. The CSV is pretty standard format. First of we have our SKU, and then followed by our image attributes.

When uploading images, they need to be within a folder called `media/import`. Once saved to that folder you can then reference them relatively. By that I mean if your image is in `media/import/test.jpg` in your csv reference it as `/test.jpg`. It&#8217;s as easy as that.

Now finally all you need to do is modify your CSV file to include only the following columns:

<pre>sku, image, image_label, small_image, small_image_label, thumbnail, thumbnail_label</pre>

Now you can upload and run the profile, sit back and breath.

Did this help you? Have any questions? Got any other tips like this? Let me know in the comments!