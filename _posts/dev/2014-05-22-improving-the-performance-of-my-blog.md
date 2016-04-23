---
title: 'Improving the performance of my blog'
author: Ash Smith
layout: post
share: true
comments: true
categories:
    - dev
---

Over the past few days I have been playing around with the performance of my blog. In this post I'll outline what I did the enhance the speed, and performance. Hopefully from this post you'll be able to take what I did and apply it to your own sites.


### The original site

At the time of writing the site hasn't visually changed massively. A few minor tweaks such as fonts, and icons are absent and resized images. Other than that, everything remains the same.

Here are a few stats about the old site (based on the homepage):

- **Number of requests:** 36
- **Total page size transferred:** 965.75kb
- **Page speed:** roughly 1 second
- 8 Scripts (10 requests, 2 redirects), 234.89kb
- 2 stylesheets, **591.88kb**
- 3 images, 72.17kb
- fonts: 56.73kb
- **HTML page:** 10.06kb

For a site as simple as mine, that is pretty damn wasteful. In fact, it was just plain awful.

### The new site

- **Number of requests:** 7 (80% reduction)
- **Total page size transferred:** 80.15kb (92% reduction)
- **Page speed:** 330ms (67% reduction)
- 2 Scripts, 31.81kb
- 1 stylesheet, 29.68kb
- 3 images, 10.85kb
- 0 fonts
- **HTML page:** 7.79kb

Furthermore, I added gzip compression which further reduces the sizes of these files (with the exception of Google Analytics, although that is served gzipped anyway). Gzipping the content, reduces the file size, and then the browser will deflate/uncompress in order to render. I don't currently have the size stats including gzipping (I blame the differences I'm seeing in Firefox and Chrome for these stats).

### What did I do?

First and foremost, I originally planned on moving my site over to Amazon S3, in order to reduce costs slightly. Whilst reading up on the pricing per request and data transferred I figured I'd take a look at the size of my site.

So, the first thing I did was transfer my site over to Amazon S3. This increased page speed slightly. Here are the resources I used for transferring my Jekyll site to S3:

- [S3 Website](https://github.com/laurilehmijoki/s3_website) - This Ruby Gem allows you run various commands to deploy and setup your site. Including setting up a CDN. Running `s3_website push` will push your built site!
- [Hosting a static website on S3](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html)
- [Setting up static website with custom domain on S3](http://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html)
- [Getting started with CloudFront](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.html) (more on this a little later in the post)

#### The actual optimisation

The first thing I did was create a list of what I saw as wasteful. My list looked a little like this:

- Remove unused JS (in my case, all but modernizr)
- Remove disqus comments code from loading on every page (and disable commenting on some posts)
- Optimise my main image
- Remove icon fonts (I used 4 icons, pretty wasteful to load an entire icon-font library)
- Switch out web-fonts for web safe fonts: Georgia, and Helvetica with Verdana fallback. My excuse here is those web fonts were just fluff, I didn't see any benefit in having them.
- Compress my CSS

**Tools used:**

- [http://lesscss.org/](http://lesscss.org/) (site currently uses LESS, I want to switch to SASS in my up-coming redesign)
- [ImageOptim](http://imageoptim.com/) (drag and drag GUI for Mac OSX to optimise images).
- A code editor (sublime text my this case)


#### Caching & Gzipping

As I mentioned before I now serve all content gzipped, which is then decompressed in the browser. It'll reduce the size of requests, and speed up your site. As my site is Jekyll based, and uses `s3_website` (link above), this is the configuration I set in my `s3_website.yml`

    max_age:
      "assets/*": 604800
      "images/*": 604800
      "*": 86400

    gzip:
      - .html
      - .css
      - .md
      - .js
    gzip_zopfli: true

What this does is set the max lifetime age of all my images and assets (js/css) to 1 week (the number is in seconds), then everything else (.html files) lasts for 1 day. The gzip code specifies which files types should be served gzip compressed.

`gzip_zopfli: true` instructs S3 to use the zopfli compression algorithm which while 100 times slow, it will actually compresses better. View the project here: [https://code.google.com/p/zopfli/](https://code.google.com/p/zopfli/)

#### Using a CDN

Once I started using just Amazon S3, I kind of wanted more, so I went a head and setup a CDN using Amazon CloudFront. It's dead simple to setup, and you can point it to your S3 bucket, then change the A record in your DNS to point to the CDN.

A CDN is a Content Distributed Network. Essentially, your content will be cached on the CDN, and shared between this network of servers. The network then figures out the closest server to the end-user and serves the assets cached to the user.

There is also another benefit for using CloudFront, as my AWS account is new, I'm on their free trier. You get 50gb data transfer and 2 million http/https request for free. My blog is tiny, and therefore I'll barely touch that limit. This will save money on requests to S3 (storage costs still apply, but those are marginal)



### What did I learn / Key take aways

- Using a theme without checking what it actually does.
    - I'd never do this with a client, and yet I did it to myself, I put it down to laziness.
- Optimise everything you can, speed improves user experience, and can increase rankings in search engines.
- You can save a shed load of money using Amazon S3 over a VPS (I was actually using DigitalOcean $5 VPS, and it was awesome. My savings are still around 50% though!)
