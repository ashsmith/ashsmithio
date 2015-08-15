---
title: 'Tracking Magento&#8217;s Onepage Checkout Steps in Google Analytics'
author: Ash Smith
layout: post
comments: true
share: true
permalink: /2012/03/tracking-magentos-onepage-checkout-steps-in-google-analytics/
dsq_thread_id:
  - 1243038239
categories:
  - magento1
---
Being able to track Checkout Abandonment is crucial when you&#8217;re focused on increasing conversions, with Magento&#8217;s one page checkout by default you can&#8217;t step up goals for Google Analytics to pick out each step, so instead we can use the trackPageview method to track fake pageviews for each step, we can then add these into our Goal steps inside GA.

## Step 1) Modify onepage checkout template file

First of all we need to modify the file called onepage.phtml located inside checkout/onepage.phtml within your theme&#8217;s template directory, if the file doesn&#8217;t exist here copy it across from the base/default folder:

**Your Theme:**  
app/design/frontend/`[package]`/`[yourtemplate]`/template/checkout/onepage.phtml  
**Base Default:**  
app/design/frontend/base/default/template/checkout/onepage.phtml

Once you&#8217;ve got the file open paste in the following code at the end of the file, save and upload.

{% gist 1974388 %}

## Step 2) Set up Goal & Funnel on Google Analytics

All that is left to do now is to set up the goal and funnel on Google Analytics so we can begin tracking our abandonment&#8217;s. To do this within the new version of Google Analytics in the top right in the main navigation bar there is a link called &#8220;Admin&#8221; on this page navigate to the Goals section under Profiles > Goals.

Then enter the following information:  

<img src="/images/uploads/2012/03/Screen-Shot-2012-03-04-at-18.50.12.png" alt="Google Analytics Goal Setup" width="623" height="420" class="size-full wp-image-53" />

**Goal Type:** URL Destination  
**Match Type:** Head Match  
**Goal URL:** /checkout/onepage/success/


<img class="size-full wp-image-14" alt="Example of goal funnel setup" src="/images/uploads/2012/12/Screen-Shot-2012-03-04-at-18.48.59.png" width="511" height="316" />

**Funnel Steps:**  
Step 1: /checkout/cart/  
Step 2: /checkout/onepage/  
Step 3: /checkout/onepage/billing/  
Step 4: /checkout/onepage/shipping/  
Step 5: /checkout/onepage/shipping_method/  
Step 6: /checkout/onepage/payment/  
Step 7: /checkout/onepage/review/

## And that&#8217;s it!

Save those changes and voila! You&#8217;re done and now tracking checkout abandonment! On the Standard Reporting section to Google Analytics go to `Conversions > Goals > Funnel Visualization` to see where your users are dropping out from the checkout process.
