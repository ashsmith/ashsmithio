---
title: 'Creating a faster Magento Store with Nginx &#038; Varnish'
date: "2012-12-20T12:00:00Z"
description: "Magento is a resource hog, however with a little know-how we can create an incredibly fast Magento store. This guide covers a nginx, php-fpm & varnish setup"
author: Ash Smith
layout: post
comments: true
permalink: /2012/12/creating-a-faster-magento-store-part-one-server-setup/
dsq_thread_id:
  - 1233701209
dsq_needs_sync:
  - 1
category: "Magento 1"
---
In this series about creating a faster Magento store, I will walk you through a number of must-do things that can speed up your Magento stores dramatically. A lot of these tips are easy, and free, a few are technical and require server knowledge and are best carried out by someone who knows their way around a server.
This series will go from optimising your server, and getting your initial magento install set up. I highly recommend these changes are made on a separate server, perhaps a VPS/Cloud Server. I personally use Rackspace Cloud Servers to create new servers quickly.

### What are we going to do?

The main thing we are going to do is installed Nginx, Varnish and PHP-FPM, these all improve performance in their own way. So let's get started.

### Why are we using Nginx, Varnish and PHP-FPM?

Nginx is a web-server, like Apache, but boosts much better performance results, and is much more stable when handling lots of requests, which results in high CPU usage and can slow down your entire server. Apache, for example, doesn't scale quiet so well without a large amount of know-how, and in my experience I have found it easier to use an alternative web server, hence Nginx! Now, Nginx isn't without it's flaws, you will need to install PHP-FPM, which is a FastCGI Process Manager for PHP, essentially it allows us to use PHP via FastCGI, I believe their are alternative solutions to this, however this is one I have come across and is simple enough to setup

Varnish Cache is a HTTP proxy or sometimes referred to as a HTTP accelerator. What Varnish does is sit between you and your web-server, when a page is requested Varnish will check if it has a cached version and return it to the user, if not it simply passes the request onto the normal web server (in this case Nginx), it then caches it so in future it can be returned quickly. What's even better about Varnish is it makes use of the physical memory on your server as opposed to the CPU, which results in high speed without slowing your server down. This leads to some seriously good performance results.

### Server Requirements

This article does presume you're using a CentOS based server, and it's a fresh install (CentOS 6 or greater), if you are using an existing server, parts of this article you will be able to skip, and equally you will need to either stop Apache from running or change the port it runs on when it comes to the stage of running Varnish/Nginx.

For the best performance results, use a dedicated server. VPS's are great, but they do share resources and I don't like relying on them heavily. If you expect your sites to take on a lot of traffic, go for a dedicated server, if not a VPS will be great, and very low cost too.

```bash
rpm -Uvh http://download.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm
yum install mysql mysql-server
/etc/init.d/mysqld start
/usr/bin/mysql_secure_installation
```

As you run through the installation process for mysql note there is no root password by default. Read each step carefully. I highly recommend you set a root password, and all options should be set to yes for the optimal setup.

```bash
yum install nginx
/etc/init.d/nginx start
yum --enablerepo=remi install php-fpm php-mysql php-pdo php-common php-mcrypt php-gd php-curl php-soap
vi /etc/php.ini
```

When you open up php.ini, find `cgi.fix_pathinfo` and set the value to `0`

Next up we need to create our virtual host in Nginx so our site can be accessed from the web! to do this simply enter:

```bash
vi /etc/nginx/conf.d/magentosite.conf
```

Then modify the details below to match your needs:

```nginx
server {
    listen      8080;
    server_name www.magentosite.co.uk;
    root        /var/www/sites/magentosite/;
    index index.html index.php;

    access_log /var/log/nginx/www.magentosite.co.uk-access_log;
    error_log /var/log/nginx/www.magentosite.co.uk-error_log;

    location / {
        try_files $uri $uri/ @handler;
        expires 30d;
    }
    location /app/                       { deny all; }
    location /includes/                  { deny all; }
    location /lib/                       { deny all; }
    location /media/downloadable/        { deny all; }
    location /pkginfo/                   { deny all; }
    location /report/config.xml          { deny all; }
    location /var/                       { deny all; }

    location /var/export/ {
        auth_basic              "Restricted";
        auth_basic_user_file    htpasswd;
        autoindex               on;
    }
    location  /. {
        return 404;
    }

    location @handler {
        rewrite / /index.php;
    }

    location ~ .php/ {
        rewrite ^(.*.php)/ $1 last;
    }

    location ~ \.php$ {
        try_files $uri =404;
        expires off;
        fastcgi_read_timeout 900s;
        fastcgi_index index.php;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include /etc/nginx/fastcgi_params;
    }
    rewrite ^/minify/([0-9]+)(/.*.(js|css))$ /lib/minify/m.php?f=$2&d=$1 last;
    rewrite ^/skin/m/([0-9]+)(/.*.(js|css))$ /lib/minify/m.php?f=$2&d=$1 last;

    location /lib/minify/ {
        allow all;
    }
    gzip on;
    #gzip_comp_level 9;
    gzip_min_length  1000;
    gzip_proxied any;
    gzip_types       text/plain application/xml text/html text/css text/js application/x-javascript;
}
```

In short what the above does is create a virtual host much like how we do in Apache, assign a server name, and root directory for where the store is set. We then also do various other tweaks to pass PHP requests to PHP-FPM, and to allow friendly URLs without index.php.

Most importantly I have set nginx to run on port 8080 rather than the usual port 80. This is so we can run Varnish on port 80, and pass requests onto 8080. We will be installing varnish shortly

Next we want to configure php-fpm to work nicely with Nginx, to do this simply open up /etc/php-fpm.d/www.conf and find the User & Group settings, and set both the user and group to &#8216;nginx'.

Now start php-fpm:

```bash
service php-fpm start
```

If you want to quickly test your changes before adding your magento installation simply create a file in your root directory you defined in your nginx conf and set it to output phpinfo();

Then finally restart nginx by doing service nginx restart. You can then navigate to your site followed by :8080 (e.g. http://example.com:8080/) you should now see details about your php configuration. Perfect! If you receive a 500 error, try changing the ownership of your files and folders for the root site to the nginx user. Like so:

```bash
chown -R nginx:nginx /var/www/mysite
```

Great, so you have your site working on port 8080! Now let's get varnish installed and configured to run on port 80!

To install varnish simply run:


```bash
sudo yum install varnish
```

Great, now we have that installed let's get Varnish running on port 80. This is so when we first request a page it will go through to Varnish cache first, check if a cached version exists and return that, if no cache exists it'll pass the request to nginx, which in turn will then cache that and return it to the user.


```bash
vi /etc/sysconfig/varnish
```

Now find `VARNISH_LISTEN_PORT=6081` and change it to port 80, save and close.

Next up we want to update the default configuration for our server. We need to check what version of Varnish we have installed, as this will dictate which configuration file we need to load in. You can run the following command to find out your version:


```bash
sudo varnishd -V
```

My version was 2.1.5, so I can use the first set of code below. I have both of these configurations saved using Gist by GitHub, so you can head to one of the following links to jump directly to the configuration you require: <a href="https://gist.github.com/ashsmith/5429365#file-default_2-1-vcl" target="_blank">version 2.1</a> or <a href="https://gist.github.com/ashsmith/5429365#file-default_3-0-vcl" target="_blank">version 3.0+</a>

We'll want to place this configuration in the following file:

```bash
etc/varnish/default.vcl
```

#### Varnish configuration for version 2.1:

{% gist 5429365 default_2.1.vcl %}

#### Varnish configuration for version 3.0+

{% gist 5429365 default_3.0.vcl %}

Now we can fire up Varnish:

```bash
service varnish start
```

Now if you access your site again but without the port :8080 you should see your entire site working perfectly!

From here you can set up your database, and install magento. Once that is done, install the following plugin:
[PageCache powered by Varnish][1] this will allow you to clear the Varnish cache from within the Admin and auto-clear after saving categories/products or CMS pages. Very handy indeed.

Then when logged into the Magento admin head over to System > Configuration > Advanced > System. You'll notice a new section labeled &#8220;PageCache powered by Varnish settings&#8221; Enable the module, set the varnish port to 80, and you may also want to set the purge settings to yes, these will enable auto-purging when categories/products or CMS pages are edited. Very handy for getting your changes live before the cache expires on it's own.

You can also make sure everything is set to run on startup with these simple commands:

```bash
chkconfig --levels 235 mysqld on
chkconfig --levels 235 nginx on
chkconfig --levels 235 php-fpm on
chkconfig --levels 235 varnish on
```

### Known Quirks

*   If you have design exceptions i.e. a mobile site. Varnish cache will not work. I'm working on a fix. But, if the budget is there purchase the full-version of the free extension.
*   Your .htaccess will no longer work, that's because we're not using Apache anymore. So any unique changes in there need to be transfered directly to your PHP settings or to your nginx VHOST setup.

### Finishing up

And we're done with this part of the series. From here on we'll be looking at various other ways we can speed up our stores by optimising our site resources to increase speed further. Plus various other plugins we can use to speed up our stores.

If you have any questions, or even suggestions on how you optimise your servers for the best performance on Magento stores, please use the comments!

 [1]: http://www.magentocommerce.com/magento-connect/pagecache-powered-by-varnish.html
