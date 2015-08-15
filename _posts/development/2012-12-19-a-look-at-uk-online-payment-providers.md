---
title: A look at UK online payment providers
description: "Selecting a good UK payment provider can be a tricky task. I have compiled a list of providers with their pricing, and benefits, to help you choose."
author: Ash Smith
layout: post
share: true
permalink: /2012/12/a-look-at-uk-online-payment-providers/
categories:
  - Payment Providers
---
Finding the right UK payment provider is tricky business. You need to way up the options, you&#8217;ll want one that is easy to integrate  but also has the best pricing, plus other features such as reporting, ability to take telephone or mail order payments. In this article I&#8217;ll go over the top providers in the UK.

I have written up about a number of services, and will continue to add to this list as new ones emerge.

### Here is my list as of 12/12 of UK Payment Providers:

*   [Paypal][1]
*   [GoCardless][2]
*   [Paymill][3]
*   [&#8220;Traditional&#8221; payment providers][4]
    *   [Sage Pay][5]
    *   [World Pay][6]
    *   [Authorize.net][7]

## <a name="paypal"></a>Paypal

Let&#8217;s kick the list of with the provider everyone knows, and a growing number of people are coming to dislike. Yes, it&#8217;s Paypal!

Paypal allows you to create an account, which stores your payment details and bank information, and then allows you pay for pretty much anything. It&#8217;s ease of use is why so many customers love PayPal. In fact, just offering Paypal as an option will increase your stores conversion rates.

#### Fees:

Paypal&#8217;s fees are per transaction and for businesses it is based on your monthly sales. Here&#8217;s the rates as of 12/12:

**up to**** £1,500**  
3.4% + £0.40

**£1,500 &#8211; £6,000**  
2.9% + £0.20

**£6,000 &#8211; £15,000**  
2.4% + £0.20

**£15,000 &#8211; £55,000**  
1.9% + £0.20

#### Why do a lot of people hate Paypal?

Paypal has hurt a lot of people. There are countless reports of people&#8217;s accounts being blocked and to make things worse Paypal have a record for poor customer service.

For example, within the conference/show industry a huge number of show organisers sell their tickets via Paypal, to only get their entire account blocked without access to their funds. Sadly, this can lead to no money there to actually put the show on. The reasoning Paypal give, is to protect their customers, and/or because they noticed are large increase in sales, which marks their activity as suspicious.

#### So should I use Paypal?

Absolutely. Paypal is a service a huge number of your potential customers will use. It&#8217;s dead simple to get started, and there is a huge amount of documentation, plugins and extensions for most e-commerce stores CMS&#8217;s. For example, Magento comes with Paypal integration, enter your account details and you&#8217;re done.

I only wouldn&#8217;t use Paypal if you are providing a pre-sale (tickets, pre-ordering of products and/or services), typically this is where a large number of problems come to light.

## <a name="gocardless"></a>Go Cardless

GoCardless is a new and upcoming payment provider, but with a twist. They use Direct Debit to make payments. Meaning you can also use GoCardless for recurring payments.

However, the service has it&#8217;s drawbacks. It&#8217;s not called GoCardless for no reason, it&#8217;s relies on the customer entering their bank details. Now, entering your card details is easy, you often have your wallet/purse on you, but your bank details, that requires either grabbing a bank statement, your cheque book/paying in book, or logging in to your online banking. That&#8217;s a lot of effort.

#### Fees

GoCardless&#8217; fees are incredibly simple. It&#8217;s 2% per transaction up to a maximum of £2.00. So why can they go this low? Because authorising Direct Debit requests is completely different to processing credit cards, and has much lower charges involved, a saving they pass onto you.

#### Where to use GoCardless?

I personally believe services like GoCardless are best suited for recurring services, such as subscription based services like web hosting, magazines, subscription based web apps and gym memberships.

Outside of this, asking a potential customer to enter their bank details instead of their credit/debit card details maybe a bit disorientating for them. It could result in loss of sales.

## <a name="paymill"></a>Paymill

Paymill is a new up and coming payment provider different to that of those that are to follow. With a developer focus, Paymill has perhaps the easiest system for processing payments I have seen, that is available in the UK.

You know they&#8217;re developer focused by offering an example of how simple it is to create a payment directly on the homepage! Here is the PHP example:

{% highlight php %}
<?php
$params = array(
    'amount'      => '4200',  // e.g. "4200" for 42.00 EUR
    'currency'    => 'EUR',   // ISO 4217
    'token'       => '098f6bcd4621d373cade4e832627b4f6',
    'description' => 'Test Transaction'
);
$apiKey             = 'YOUR_PRIVATE_KEY';
$apiEndpoint        = 'https://api.paymill.de/v2/';
$transactionsObject = new Services_Paymill_Transactions(
    $apiKey, $apiEndpoint
);
$transaction        = $transactionsObject->create($params);
?>
{% endhighlight %}

It&#8217;s as simple as that.

One line that might rise a few eyebrows is the token. Where does it come from? Well, the token is created based on the customers credit card information. It can be created with a mere few lines of Javascript. You never need to store sensitive card information on your servers! You could store this token (valid for one year) so you can take payments again, should the customer log back into their account! Making it incredibly easy for your customers to buy again.

Further more, they also can process Direct Debits too. Which, means you can offer your customer a choice of how they&#8217;d like to pay. This is particularly useful for subscription based services.

#### Pricing

Pricing is competitive with other provided @ 2.95% + 0.28€ per transaction. The advantage here, there

## <a name="traditional"></a>Traditional payment providers

Next up are the more traditional providers, these are the services that have monthly fees, require a merchant account, they typically have higher transaction costs too. Furthermore integration can be even more difficult. Which is why they are at the bottom of my list.

### <a name="sagepay"></a>Sage Pay

Sagepay, previously known as Protx are well known and established in the UK for their merchant services. They accept all major credit cards, they allow you to integrate their services into your website. They have their own MOTO (Mail order telephone order) platform, which can be used to search for transactions and get reporting data. Sage Pay can also be integrated with Card machines, or terminals.

That is one of the biggest benefits of using SagePay is for the ability to integrate with card machines, like those you get in shops. A service, none of the above actually offer. However this comes at an additional cost.

Sagepay also offer different integration levels. One of which redirects the user to their site to process the payment. Taking that stress off your shoulders.

As of currently, their form solution (where the user gets sent to their site) doesn&#8217;t have a mobile site, making it incredibly difficult to use for the user.

#### Pricing

Sagepay&#8217;s pricing is relatively straightforward. for £25p/m you can get your payment gateway set up relatively easily. This also gives you access to their MOTO screen for management, reporting and taking telephone/mail order payments.

However, if you want fraud prevention you&#8217;ll need to pay an additional £10 per month. Card terminals also cost additional, there is a one-off fee + a monthly rental fee, plus transaction fees change.

Services like Sagepay are incredibly handy if you have a large range of requirements for processing payments, such as off-line processing. They also require you to have a merchant account to be setup with your bank. It&#8217;s a painful process, and if you&#8217;re building a simple web-app, or e-commerce store where none of the above is applicable. Stick to a simpler solution.

### <a name="worldpay"></a>World Pay

WorldPay is very similar to Sagepay in many ways. The core differences comes in their pricing. They also require a merchant account, but they offer services to get you a merchant account if you don&#8217;t currently have one. This can make the entire process less daunting.

#### Pricing

Pricing for Worldpay is £19.95 a month, first 350 transaction each month are free, and then 10p per transaction thereafter. This assumes you already have a merchant account.

If you don&#8217;t own a merchant account, for £75 one-off setup fee you can get one from Worldpay. Then after that it&#8217;s £15 per month, plus 1.9% + 10p per transaction.

### <a name="authorize"></a>Authorize.net

Authorize.net are the final provider in my list of traditional payment providers. They accept all major credit cards, great fraud prevention built in. With the ability to access all of your data from your online account. All with fantastic support too.

#### Pricing

Assuming you only want to process payments online, there is a one off setup fee of $99, a monthly fee of $20, a transaction fee of $0.10, and a Batch fee of $0.25.

What is a batch fee I hear you ask? Well, according to their website it&#8217;s &#8220;The fee assessed per batch of settled credit card transaction&#8221;. Yeah. Not sure why that pricing exists. Or why at the very least it&#8217;s not accounted for in the transaction fee.

## Do you know any? Did I miss one?

If I&#8217;ve missed out a UK payment provider that you believe deserves recognition by being on this list, just let me know in the comments. Perhaps, it&#8217;s a new service that has emerged and needs to be shouted about, I&#8217;d love to hear about it.

 [1]: #paypal
 [2]: #gocardless
 [3]: #paymill
 [4]: #traditional
 [5]: #sagepay
 [6]: #worldpay
 [7]: #authorize
