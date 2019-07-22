---
title: 'Tracking Magentos Onepage Checkout Steps in Google Analytics'
date: "2012-03-04T12:00:00Z"
author: Ash Smith
layout: post
comments: true
permalink: /2012/03/tracking-magentos-onepage-checkout-steps-in-google-analytics/
dsq_thread_id:
  - 1243038239
category: "Magento 1"
---
Being able to track Checkout Abandonment is crucial when you're focused on increasing conversions, with Magento's one page checkout by default you can't step up goals for Google Analytics to pick out each step, so instead we can use the trackPageview method to track fake pageviews for each step, we can then add these into our Goal steps inside GA.

## Step 1) Modify onepage checkout template file

First of all we need to modify the file called onepage.phtml located inside checkout/onepage.phtml within your theme's template directory, if the file doesn't exist here copy it across from the base/default folder:

**Your Theme:**
app/design/frontend/`[package]`/`[yourtemplate]`/template/checkout/onepage.phtml
**Base Default:**
app/design/frontend/base/default/template/checkout/onepage.phtml

Once you've got the file open paste in the following code at the end of the file, save and upload.

```html
<script type="text/javascript">
  Checkout.prototype.gotoSection = Checkout.prototype.gotoSection.wrap(function(parentMethod, section, reloadProgressBlock) {

    // Call parent method.
    parentMethod(section, reloadProgressBlock);

    var _gaq = _gaq || [];

    try {
      // push current checkout section to google analytics if available.
      _gaq.push(['_trackPageview', '<?php echo $this->getUrl('checkout/onepage'); ?>' + section + '/']);
    } catch(err) {
      // silent fail.
    }
  });
</script>
```

## Step 2) Set up Goal & Funnel on Google Analytics

All that is left to do now is to set up the goal and funnel on Google Analytics so we can begin tracking our abandonment's. To do this within the new version of Google Analytics in the top right in the main navigation bar there is a link called &#8220;Admin&#8221; on this page navigate to the Goals section under Profiles > Goals.

Then enter the following information:
[Google Analytics Goal Setup](./Screen-Shot-2012-03-04-at-18.50.12.png)

**Goal Type:** URL Destination<br />
**Match Type:** Head Match<br />
**Goal URL:** /checkout/onepage/success/<br />

[Example of goal funnel setup](./Screen-Shot-2012-03-04-at-18.48.59.png)

**Funnel Steps:**
Step 1: /checkout/cart/<br />
Step 2: /checkout/onepage/<br />
Step 3: /checkout/onepage/billing/<br />
Step 4: /checkout/onepage/shipping/<br />
Step 5: /checkout/onepage/shipping_method/<br />
Step 6: /checkout/onepage/payment/<br />
Step 7: /checkout/onepage/review/<br />

## And that's it!

Save those changes and voila! You're done and now tracking checkout abandonment! On the Standard Reporting section to Google Analytics go to `Conversions > Goals > Funnel Visualization` to see where your users are dropping out from the checkout process.
