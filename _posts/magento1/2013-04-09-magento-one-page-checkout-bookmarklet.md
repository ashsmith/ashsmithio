---
title: Magento one page checkout bookmarklet
author: Ash Smith
layout: post
share: true
permalink: /2013/04/magento-one-page-checkout-bookmarklet/
categories:
  - magento1
---
Ever needed to test a new payment module, or shipping rate? Hate going through the checkout multiple times? Well, I&#8217;ve put together this simple little bookmarklet:

{% highlight js %}
javascript: (function(){
    document.getElementById("login:guest").checked="checked";
    checkout.setMethod();
    document.getElementById("billing:firstname").value="John";
    document.getElementById("billing:lastname").value="Doe";
    document.getElementById("billing:email").value="demo@example.com";
    document.getElementById("billing:company").value="Acme Corp";
    document.getElementById("billing:street1").value="Doe House";
    document.getElementById("billing:street2").value="Doe Road";
    document.getElementById("billing:city").value="Doe Town";
    document.getElementById("billing:region").value="Doe Region";
    document.getElementById("billing:postcode").value="DO33 3OD";
    document.getElementById("billing:telephone").value="12345678901";
    document.getElementById("billing:fax").value="";
    billing.save();
    function waitForBilling() {
        if(checkout.loadWaiting != false){
            return setTimeout(waitForBilling, 50);
        }
        document.getElementsByName("shipping_method")[0].checked="checked";
        shippingMethod.save();
    }
    waitForBilling();
})();
{% endhighlight %}

To use, simply create a new bookmark, and enter the above code into the URL section of the bookmark and keep the bookmark in your bookmarks toolbar. Now, when you hit the first stage of the onepage checkout, click your bookmarklet. It will populate your fields, and progress you to the payment stage. Easy!

Word of warning: This bookmarklet is not perfect, and feel free to tailor the information contained, this has been put together for UK stores which doesn&#8217;t require a region (I entered dummy data anyway, but if you are for example a US user, you will need to change this value in relation to the states drop-down menu.)

Other solutions? yes, you could just create an account, and use that. However sometimes we need to test as a guest user.

Don&#8217;t want to skip shipping methods? Simply remove lines 16 &#8211; 23.
