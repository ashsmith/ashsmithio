---
title: '4 tips for a more productive Magento 2 Frontend Workflow'
description: "4 useful Magento 2 frontend development tips to improve your workflow efficiency."
author: Ash Smith
layout: post
permalink: /magento2/tips-to-improve-frontend-development-workflow/
categories: magento2
share: true
comments: true
---

As with any new platform, you’ll want to learn how to be as efficient as possible so that you can get more done and avoid common pitfalls. This happens over time as you learn any platform. I’d like to share with you a few tips that can help you become more productive. They certainly helped me.

## 1. Developer mode.
Developer mode is critical when doing development (it sounds so obvious…). Running in the default or production modes will slow you done ten fold. Whilst Magento 2 is in developer mode everything in `pub/static` is symlinked, which means as you update the files in their source location, it’ll update in `pub/static`.

{% highlight bash linenos=table %}
bin/magento deploy:mode:set developer
{% endhighlight %}

You can use: `bin/magento deploy:mode` to see what mode you’re currently running in. When switching modes Magento 2 will automatically handle any cleanup required. So when switching from default or production to developer mode it will delete the contents of `pub/static` and the `var/` appropriate directories.

## 2. Use Grunt.
Whilst  a lot of the frontend world have moved towards using Gulp, Grunt is still a great tool to use for frontend development. Let’s not get hung up on that, and focus on how we can use it to enhance our productivity.

#### Set up Grunt with:
{% highlight bash linenos=table %}
mv Gruntfile.js.sample Gruntfile.js
mv package.json.sample package.json
npm install -g grunt-cli
npm install
{% endhighlight %}

#### Configure Grunt

You’ll want to configure Grunt by adding your theme to `[magento-root]/dev/tools/grunt/configs/themes.js`, use an existing theme in the file as your template.

#### Using Grunt in Magento 2

Once you have grunt setup, there are a few commands you can use to speed up your workflow.

{% highlight bash linenos=table %}
# compile less for your theme
grunt less:<theme>

# removes theme related static files from pub/static and var
grunt clean:<theme>

# republish theme symlinks for your theme to pub/static
grunt exec:<theme>

# tracks changes to source files, recompiles less, and reloads page when using BrowserSync
grunt watch
{% endhighlight %}

Note the last one and the usage of browser sync. We’ll visit that in our next tip.

Learn more about the grunt commands from Magento’s DevDocs: [Compile LESS with Grunt](http://devdocs.magento.com/guides/v2.0/frontend-dev-guide/css-topics/css_debug.html)

## 3. Use BrowserSync
BrowserSync is a great tool for automatically injecting new css into your browser each time it is updated. It’s pretty simple to use.

First, start the `grunt watch` task in a terminal window.

{% highlight bash linenos=table %}
grunt watch
{% endhighlight %}

Next, open up a second terminal window and install browser sync if you haven’t already:

{% highlight bash linenos=table %}
npm install -g browser-sync
{% endhighlight %}

Next, change to your `css` directory within `pub/static` e.g:

{% highlight bash linenos=table %}
cd pub/static/frontend/MyTheme/default/en_GB/css
{% endhighlight %}

Now, fire up browser-sync with the following (adjust the proxy URL to your store installation)

{% highlight bash linenos=table %}
browser-sync start --proxy 'dev.www.mystore.com' --files="*.css"
{% endhighlight %}

This will launch a browser tab opening to: `http://localhost:3000` which will load your store. Now as you make changes to your LESS files the `grunt watch` command will re-compile the CSS, which in turn triggers browser sync to inject the new css. All without you having to lift a finger.

/Note: If you’re using docker, I currently run browser-sync outside of docker, and grunt runs inside. It works great./

## 4. Overriding templates and LESS.

After overriding templates and LESS files, you’ll want to flush cache and recompile LESS. Here’s some quick commands to make your life a little easier:

{% highlight bash linenos=table %}
bin/magento cache:flush layout block_html full_page
grunt clean:<theme>
{% endhighlight %}

This will ensure the `block_html` `layout`  and `full_page` cache types have been flushed. These are the most critical, and most likely to get in the way during frontend development. You could also disable these, but I prefer not to. If you’re making changes that could effect other cache types such as configuration (`config` type), then be sure to flush those too.

## Bonus tip: Read the docs.
Seriously. READ them. I’m terrible for scan reading and just trying to find the snippet I need. But when you actually take time to read the documentation you’ll find a lot of topics are covered and well explained.

Documentation I’ve found useful:
1. [Compile LESS with Grunt](http://devdocs.magento.com/guides/v2.0/frontend-dev-guide/css-topics/css_debug.html)
2. [Common layout customization tasks](http://devdocs.magento.com/guides/v2.0/frontend-dev-guide/layouts/xml-manage.html)
3. [CSS preprocessing](http://devdocs.magento.com/guides/v2.0/frontend-dev-guide/css-topics/css-preprocess.html)
4. [Override a layout](http://devdocs.magento.com/guides/v2.0/frontend-dev-guide/layouts/layout-override.html)
5. [Locate templates, layouts, and styles](http://devdocs.magento.com/guides/v2.0/frontend-dev-guide/themes/debug-theme.html)

## Conclusion
With these five tips you can speed up your frontend development workflow, and become a more productive Magento 2 developer as a result. As someone who is more commonly associates himself as a back-end developer, these tips are something I need to remind myself of, and have worked their way into my daily workflow.

Have you got any tips? Let me know in the comments!
