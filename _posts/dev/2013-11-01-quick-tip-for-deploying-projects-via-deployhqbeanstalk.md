---
title: Quick Tip for deploying projects via DeployHQ/Beanstalk
author: Ash Smith
layout: post
share: true
categories:
    - dev
---
Ever struggled with the idea of deploying a site, with the correct user permissions? I've been struggling with this one for a while. My solution up until recently was to simple use the `root` user, a terrible security practice I know.

So what's my new way? It's simple. If you're using apache, or nginx for your web server software, all you need to do is use the user set up with that web server.

By default, these users do not possess the ability to be used as actual users you can login as. To do change this, we need to edit this file: `/etc/passwd`

If you're an nginx user like myself, you'll see something like this in the formentioned file:

{% highlight bash %}
nginx:x:497:496:Nginx web server:/var/lib/nginx:/sbin/nologin
{% endhighlight %}

So what does all of this garbage mean? Well, if you'd like to find out head over to this excellent [article](http://www.cyberciti.biz/faq/understanding-etcpasswd-file-format/) it will explain this file far better than I can!

Let's move onto the important parts.

Noticed this section `:var/lib/nginx:/sbin/nologin"`, the first part is the users home directory, the second is command/shell it uses by default. We need to change both of these values.

I always store all of my sites in `/var/www` so it would make sense to change that directory to `nginx`'s default home folder. Secondly, /sbin/nologin should become `/bin/bash` so we can execute bash commands when we're logged in as this user.

With those changes that line for our `nginx` user should look like this: `nginx:x:497:496:Nginx web server:/var/www:/bin/bash`

### Nearly there..

Fantastic, now we have this user setup. Now we can change the password for this user if we wanted too. However, as it stands I've not had a use for having a password set. Instead I set up an SSH key, and also added myself, and any deployment services I use such as DeployHQ and Beanstalk.

To generate an SSH key for the nginx user run the following command:

{% highlight bash %}
sudo -Hu nginx ssh-keygen -t rsa
{% endhighlight %}

Now, we don't want to set a passpharse, so leave it blank, and we want it to save to default location.

Finally, let's add our key to the `authorized_keys` file:

On MacOSX: `pbcopy ~/.ssh/id_rsa.pub`

On your server: `sudo -Hu nginx vi /var/www/.ssh/authorized_keys` and then paste in your copied key. You can also paste in any keys you have from DeployHQ or Beanstalk.

### All done

Now, you can SSH to your server as the `nginx` user! Which means your deployment services can do the same, and have the correct permissions when deploying your projects. Best of all, it's incredibly secure!
