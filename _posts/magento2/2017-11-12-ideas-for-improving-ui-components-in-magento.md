---
title: 'Suggestions for improving UI Components in Magento 2'
description: "UI Components in Magento 2 have been a pain point for many. I'd like to suggest a few ideas to hopefully fix that."
author: Ash Smith
layout: post
permalink: /magento2/suggestions-to-improve-ui-components/
categories: magento2
share: true
comments: true
---

After attending [MageTitans MCR](https://twitter.com/MageTitans) it was abundantly clear that UI Components are a huge pain point for a lot of people! I feel the same way, and to be honest it makes me feel like a bad developer when I struggle to do (supposedly) straight forward things. Hearing the same from other developers, even from the mouths of prolific speakers, it made me realise we need to do something. I left MageTitans feeling a lot better knowing I wasn't the only one, but I also left motivated to try and do something about it. This left me with a long train journey back down to the [land of cider](https://www.youtube.com/watch?v=lzGkB6YO9Yc) with a lot to think about.

The problem of UI Components boils down to a two things for me personally.

1. XML Fatigue. XML is great, but when you need to figure out the exact point in the xml tree to modify a small part of a component it is incredibly difficult. child after child  after child. It's rough, it's hard to read and takes time to wrap our little minds around.
2. Documentation. This last one hit me recently whilst working on some admin components. I was using existing components to build the functionality I needed, but there was ZERO _useful_ docs that explained and offered sampled usage. This component I constructed took me several _long_ days.

Perhaps you have other issues too, such as knowing how to manipulate and inject your own data from the backend. Let me know, and we can figure out some solutions.

I believe if we can tackle these two issues we can resolve most of the frustration around Magento. Below, I'm going to break down each item a little more, and describe why it isn't working, and what we can do to resolve it. This could be a community effort, and some of this would/could be implemented by Magento themselves. Either way, we're all in it together right?


### XML Fatigue

The very first thing that comes to mind when working with UI Components are, as [Max Pronko](https://twitter.com/max_pronko) said, [XML Christmas Trees](https://twitter.com/benmarks/status/929378725594107905). It is really difficult to find components nest this deep, and writing out all that XML is prone to error (we're all human).

So let's take a quick example of a deeply nested component, where all we want to do is replace the JS component with our own:

{% highlight xml  linenos=table %}
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceBlock name="checkout.root">
            <arguments>
                <argument name="jsLayout" xsi:type="array">
                    <item name="components" xsi:type="array">
                        <item name="checkout" xsi:type="array">
                            <item name="children" xsi:type="array">
                                <item name="steps" xsi:type="array">
                                    <item name="children" xsi:type="array">
                                        <item name="shipping-step" xsi:type="array">
                                            <item name="children" xsi:type="array">
                                                <item name="shippingAddress" xsi:type="array">
                                                    <item name="component" xsi:type="string">Ashsmith_Checkout/js/view/shipping</item>
                                                </item>
                                            </item>
                                        </item>
                                    </item>
                                </item>
                            </item>
                        </item>
                    </item>
                </argument>
            </arguments>
        </referenceBlock>
    </body>
</page>
{%endhighlight%}

And there is that Christmas tree. This likely isn't the worst example either.

The idea I had for solving this came to me on the train. It's simple. What if Magento introduced two new nodes within XML Layouts. I'd call them `alias` and `referenceAlias`. An alias would be a way of taking deeply nested nodes representing them as a string and giving it a name we can reference later in `referenceAlias` to make our changes. We'd result in writing less XML, with less depth, resulting in high readability. If Magento provided this, along with a bunch of useful aliases defined for us, they would be invaluable extension points.

Consider the following:

{% highlight xml  linenos=table %}
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <!-- This could be defined in checkout_index_index within the Magento core as an easy way to reference the shipping address component -->
        <alias name=checkout_step_shipping_address path=“checkout.root/arguments/jsLayout/components/checkout/children/steps/children/shipping-step/children/shippingAddress” /> 
        <!-- Now I can easily change the component javascript class. Easy. -->
        <referenceAlias name="checkout_step_shipping_address">
            <!-- Original: Magento_Checkout/js/view/shipping -->
            <item name="component" xsi:type="string">Ashsmith_Checkout/js/view/shipping</item>
        </referenceAlias>
    </body>
</page>
{%endhighlight%}

The above proposed solution would the exact same as our christmas tree, and at a glance we can see we're referencing the shipping address component. We have achieved high readability, along with reduced code. Furthermore, we would not actually introduce any breaking changes in Magento by implementing this, these are merely new extension points that can be used optionally.

Coupled with good documentation (and good alias coverage from the core), developers would be able to simple changes quickly, without too much hassle.

If you're wondering about the alias path attribute, and what makes it up, to me it takes a fairly simple approach to referencing nodes: if the node we're specifying has a name attribute, we use the name, otherwise we use the node itself. In this case see: `checkout.root/arguments/jsLayout` is actually: `<referenceBlock name=checkout.root><arguments><argument name=jsLayout>`. This will mean `referenceContainer`, `referenceBlock`, `argument`, `item` nodes are all referenced by their name attribute, and the `arguments` node has no attributes to reference by so we simply use the nodes name.

An alternative approach could be introduce a new (optional) attribute to the `item` node whereby we can specify this alias name. eg: `<item name="shippingAddress" alias="checkout_step_shipping_address" xsi:type="array">` then use `<referenceAlias name="">` as before. This would skip the node tree path option, but would make it impractical for developers to introduce, we'd be at the mercy of core developers. 

This approach should also apply to UI Component XML within the Admin. These are also incredibly hard to read and digest. Check out my [post on creating a blog where I cover the admin](https://www.ashsmith.io/magento2/module-from-scratch-part-5-adminhtml/) and scroll until you hit a wall of XML. Yup _that_. Which actually, is a brilliant [segway/segue](https://itunes.apple.com/us/podcast/id1300143014) to my next suggestion on reducing XML fatigure.

Splitting large XML Files.

Who in their right mind would want to open up a [446 line file](https://github.com/magento/magento2/blob/2.2-develop/app/code/Magento/Checkout/view/frontend/layout/checkout_index_index.xml) and make changes. Not me! 

If we split these XML layout files up, we can reduce them down to digestible chunks, then simply extend/rewrite the appropriate layout file. Within layout XML this is already possible, and something we can do today. It's simple:

checkout_index_index.xml
{% highlight xml  linenos=table %}
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <!-- include the top level children of our first component -->
    <update handle="checkout_index_index_errors">
    <update handle="checkout_index_index_authentication">
    <update handle="checkout_index_index_progress_bar">
    <update handle="checkout_index_index_estimation">
    <update handle="checkout_index_index_step_shipping">
    <update handle="checkout_index_index_step_billing">
    <update handle="checkout_index_index_sidebar">
    <body>
    <!-- define the root block, and the base component -->
    </body>
</page>
{%endhighlight%}

checkout_index_index_step_shipping.xml
{% highlight xml  linenos=table %}
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <update handle="checkout_index_index_step_shipping_address">
    <!-- plus any other direct children of the shipping step -->
    <body>
    <!-- define shipping step component -->
    </body>
</page>
{%endhighlight%}

checkout_index_index_step_shipping_address.xml
{% highlight xml  linenos=table %}
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <!-- Children components of the shipping address component can be introduced by, you guessed it: <update handle=""> -->
    <body>
        <!-- That horrible xml(xmas) tree that defined the shipping address component -->
        <!-- or better yet, our <referenceAlias="checkout_step_shipping_address"> with the component config defined below.-->
    </body>
</page>
{%endhighlight%}

Immediately we break our component configuration up into digestible chunks. This makes discovery easier, as children nodes are defined at the top of the XML file, but also we'll stick with a flat directory structure for layout files and the naming conventions would be self-explanatory.

Reduce the amount of XML I need to write. Reduce the amount of XML I need to read. Ultimately, reduce the amount of thinking I have to do, and then you'll have an [happy Ash](https://i.pinimg.com/736x/2a/c7/d0/2ac7d07764cbd45af9116a62e6714ef5--ash-ketchum-pikachu.jpg).

I don't want to sound like I'm hating on XML, it's great, but when you're faced with several hundred lines of XML, I honestly can't keep track of it. You're literally going down the rabbit hole each time, and each time I lose a little more of my sanity. Keep It Simple Splease.

### Documentation (or lack thereof)

Good documentation is critical for Magento's adoption by developers. I don't work with frameworks where documentation sucks, at least not for long, because how the heck will I ever figure it out? I want to be productive, and use the platform to solve mine (or my clients) problems. Magento's history makes this difficult though (it shouldn't, but it has effected this), back in the early days (some 10 years ago now), there were no docs, there were no docs for OSCommerce either, and I'm sure it was the same for other frameworks. The community got together as Magento (and OSCommerce) solved the problem of ecommerce, and we figured it out, through StackExchange, blogs, and forums. Problem is, these days, in my eyes every framework worth its weight has good documentation. Without documentation you won't get adoption, and without that you'll die (not you personally, the platform!).

The Magento community solves this problem itself most of the time, and places like StackExchange are now our go-to resources a lot of time, along with everyone who contributes a technical blog post here and there (even if they are almost 9 months apart. Sorry). When in actual fact, so much of its content should be provided in an official format, and leave StackExchange for specific use cases. I shouldn't have to turn to stackexchange to implement an Event Observer for example, or asking how add or reorder a field to checkout

With this said, DevDocs has become an amazing resource, and the team behind it have done a great job (along with the community contributors!). I don't want to take anything away from that. They went from no real documentation, to having a ton. It's a fantastic step forward. Magento a huge platform, it's complex, this is taking time. I understand. But we still have a way to go before I personally will use it as my number one, go to resource.

For example, Laravel's documentation is my go-to for anything framework specific. Then if it turns out I need a little more hand holding on specific details than their docs provide then I turn to Google (which lands me on StackOverflow 90% of the time). Right now though, I google first. I maybe check the DevDocs every so often.

Coming back to UI Components, the most useful thing in the world for me is solid docs. Failing the above suggestions for XML, we need solid documentation with practical examples to fall back on.

As it stands documentation for existing UI Components is limited to describing the options available on a given component. Which, I have to say, it may as well not be there, because that every time I landed on the page has been useless. I end up having to read core code in order to understand it, and we've already been over the problem of XML fatigue, I'm slowly going more insane each time I do that.

Need an example a good vs bad docs: [Bookmarks UI Component Docs](http://devdocs.magento.com/guides/v2.2/ui_comp_guide/components/ui-bookmarks.html) vs [VueJS List Rendering Docs](https://vuejs.org/v2/guide/list.html)

We need practical usage examples, not a table of it's options.


## What happens next?

I intend on suggesting my XML changes to Magento, and in part this post serves to hear the communities feedback, but the full discussion probably should happen on GitHub or on the forums, that's way an official proposal could be discussed and put forward, then PR's can go from there. I see them as non-breaking changes, so I can't see why it would be a bad idea. If you have an opinion on this, please reach out. I'd love to hear your thoughts and find the best solution.

I realise this alias option doesn't offer something that can be used today, and it'll be yet another thing we'd have to wait for (I also hate hearing "Oh yeah but 2.x fixes that"). In the meantime, we have documentation to fix, and further deep dive blog posts to write in order to help make UI Components seem like a not-so frightening task. Providing a central well-organised place for UI Component documentation should be the most actionable item.

Documentation is the big one though, and it will be more time consuming than anything else. There's a reason its not documented well enough at the end of the day.

I want to do my part. I find myself working with UI Components regularly, and in theory taking the time to write up what I've learnt isn't too big of a task (provided I don't over-commit and under deliver!). I already have plans for a deeper dive into Admin UI Component, along with some practical frontend component changes/implementations. 

Finally, we need to keep the conversation going. I'm on [twitter](https://twitter.com/ashsmithco), there's the comments below this post, and my inbox welcomes you too (use the <a href="https://www.urbandictionary.com/define.php?term=gert">gert</a> big contact me link below this post).

PS, keep an eye out for videos from [MageTitans MCR](https://twitter.com/MageTitans) there were two fantastic talks touching on UI Components which will help you out massively. For me, [Maria Kern](https://twitter.com/maja_kern)'s talk mentioned a few useful Chrome extensions such as [MageSpecialist DevTools](https://chrome.google.com/webstore/detail/magespecialist-devtools-f/odbnbnenehdodpnebgldhhmicbnlmapj) which will give you information on UI Components. I honestly can't wait to try this out on Monday (it's actually got me hyped up about working on UI Components funnily enough).

I feel like I should finish this with some sort of statement we can all get behind...

<img src="/images/uploads/hat.png" alt="Make UI Components Great (Again?)" title="Make UI Components Great Again" width="400"/>

[This too.](https://twitter.com/philwinkle/status/929093121174134784)