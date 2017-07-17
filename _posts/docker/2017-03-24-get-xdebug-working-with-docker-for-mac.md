---
title: 'How to get xdebug working with Docker for Mac'
description: "A quick guide on how to configure xdebug to work with Docker for Mac"
author: Ash Smith
layout: post
permalink: /docker/get-xdebug-working-with-docker-for-mac/
categories: docker
share: true
comments: true
---

The problem with Docker for Mac and xDebug is that it is mapped to your localhost (127.0.0.1), so PHP/xDebug doesn’t actually know the true IP address of the remote host connecting to xdebug. To get around this what we need to do is configure an alias to the loopback device to get this work.

{% highlight bash linenos=table %}
sudo ifconfig lo0 alias 10.254.254.254
{% endhighlight %}

Your xdebug configuration should then also include the following:

{% highlight bash linenos=table %}
xdebug.remote_enable = 1
xdebug.remote_port = 9000
xdebug.remote_host= 10.254.254.254
{% endhighlight %}

To persist the loopback address, you can create a plist, which will be loaded automatically when you boot your mac:

Filename: `/Library/LaunchDaemons/com.ralphschindler.docker_10254_alias.plist`

{% highlight xml linenos=table %}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ralphschindler.docker_10254_alias</string>
    <key>ProgramArguments</key>
    <array>
        <string>ifconfig</string>
        <string>lo0</string>
        <string>alias</string>
        <string>10.254.254.254</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
{% endhighlight %}

To run this straightaway (without a reboot) run the following:

{% highlight bash linenos=table %}
launchctl load /Library/LaunchDaemons/com.ralphschindler.docker_10254_alias.plist
{% endhighlight %}

Credit goes to [@ralphschindler](https://github.com/ralphschindler) for this epic gist: [Docker (Mac) De-facto Standard Host Address Alias](https://gist.github.com/ralphschindler/535dc5916ccbd06f53c1b0ee5a868c93)
