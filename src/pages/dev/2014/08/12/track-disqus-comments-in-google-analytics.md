---
title: 'Track Disqus Comments in Google Analytics'
date: "2014-08-12T12:00:00Z"
author: Ash Smith
layout: post
comments: true
category: "Development"
---

Lately I've been thinking about how I can track, and collect more information from the readers of this blog. In an attempt to do that I have decided to start tracking when a reader submits a new comment. Luckily, with disqus and the latest version of Google Analytics this is dead simple to set-up. Allow me to show you!

The following code will allow you to begin tracking disqus comments:

```js
    var disqus_config = function() {
        this.callbacks.onNewComment.push(function() {
            ga('send', {
                'hitType': 'event',            // Required.
                'eventCategory': 'Comments',   // Required.
                'eventAction': 'New Comment',  // Required.
                'eventLabel': 'New Comment'
            });
        });
    };
```

### Installation instructions

Simply place this code AFTER the main Disqus JavaScript code.

### Explanation of the code

#### The Disqus code

Let's break this down quickly, this first section of the code sets up the function which is called by Disqus.

```js
    var disqus_config = function() {
        this.callbacks.onNewComment.push(function() {

        });
    };
```

If we run `console.log(this.callbacks)` we find that there are a bunch of callbacks we can use. Here's a complete list:

- afterRender
- beforeComment
- onIdentify
- onInit
- onNewComment
- onPaginate
- onReady
- preData
- preInit
- preReset

#### The Google Analytics Code

As you can see in the snippet below I have specified which fields are required.

```js

    ga('send', {
        'hitType': 'event',            // Required.
        'eventCategory': 'Comments',   // Required.
        'eventAction': 'New Comment',  // Required.
        'eventLabel': 'New Comment'
      });

```

You can also provide a eventValue too, if you wish. Although this is optional.

There is also a less verbose version of this code (which isn't as self-explanatory.)

```js

// Don't forget that label and value are optional.
// ga('send', 'event', 'category', 'action', 'label', value);
ga('send', 'event', 'Comments', 'New Comment', 'New Comment', 1);

```

What this code simply registers an event with Google Analytics' servers, with the Category, Action, Label and Value. When you are viewing the Events reports within GA you can filter down by either Category, Action, or Label. This is useful if you have multiple events which fit under one category. In this instance, no so much.

### And that's it!

That is how you make use of Google Analytics Event Tracking to allow you to track new Disqus comments. Dead simple.

Let me know in the comments if you have any questions!

##### Useful links:

- [Google Analytics Documentation on Events](https://developers.google.com/analytics/devguides/collection/analyticsjs/events)
- [Disqus Capturing commenting activity](https://help.disqus.com/customer/portal/articles/466258-capturing-disqus-commenting-activity-via-callbacks)


### Update: 12/08 22:44pm

If you are using InstantClick (like this blog does), then you may find all your events tracks as the homepage. Which is very annoying! You can fix this by using the following code instead:

```js

    var disqus_config = function() {
        this.callbacks.onNewComment.push(function() {
            ga('send', 'event', 'Comments', 'New Comment', 'New Comment', 1, {'page': location.pathname + location.search});
        });
    };

```

Thanks all!
