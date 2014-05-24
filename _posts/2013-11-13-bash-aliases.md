---
title: 'My Bash Aliases'
author: Ash Smith
layout: post
share: true
categories:
  - General
---
I love working in terminal, I'm either SSH'd into a server, working with git or making file/directory changes. To be more efficent at these things though, I've created some lovely aliases that I live by.

Let's dive.

####Creating aliases
For those of you who may not be that familiar with the command line, I'll show you how to create an alias. Run the following in your terminal window:

{% highlight bash %}
alias ping="ping -c 5"
{% endhighlight %}
This alias allows us to limit how many ping requests we send to just 5, usage: `ping www.google.co.uk`, and the response:

{% highlight bash %}
PING www.google.co.uk (74.125.195.94): 56 data bytes
64 bytes from 74.125.195.94: icmp_seq=0 ttl=49 time=57.533 ms
64 bytes from 74.125.195.94: icmp_seq=1 ttl=49 time=61.224 ms
64 bytes from 74.125.195.94: icmp_seq=2 ttl=49 time=79.374 ms
64 bytes from 74.125.195.94: icmp_seq=3 ttl=49 time=60.143 ms
64 bytes from 74.125.195.94: icmp_seq=4 ttl=49 time=62.271 ms

--- www.google.co.uk ping statistics ---
5 packets transmitted, 5 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 57.533/64.109/79.374/7.794 ms
{% endhighlight %}

This alias is only a temporary, once you have closed your terminal that session ends, and the alias is lost. To save aliases we must add them to our profile file.

The chances are, you're using a `bash` terminal, however if like me you use `zsh` then the instructions below are actually a little different.

To save your awesome aliases, you need to create a `.bash_profile` (or a `.zprofile` for `zsh` users) in your home directory. 

{% highlight bash %}
vi ~/.bash_profile
{% endhighlight %}

Then in this file you can place the alias we created earlier. Save the file then type:

{% highlight bash %}
. ~/.bash_profile  #or . ~/.zprofile for zsh users
{% endhighlight %}

Smashing stuff! We've created an alias, and saved it for future use too!

### My Aliases

Now that you're a pro at making aliases, let me show you mine (and you can show me yours in the comments!). I've broken each section of profile file into sections, and I'll explain the logic behind each.

#####1) PATH

{% highlight bash %}
PATH=$PATH:/Applications/MAMP/Library/bin
PATH=$PATH:/Applications/MAMP/bin/php/php5.4.4/bin
export PATH
{% endhighlight %}

I use MAMP Pro religiously, so the above updates my PATH (which is a global variable that is used to look up the locations of commands you run on the command line), by updating my PATH to include these two folders whenever I use any `mysql` or `php` command it uses MAMP's `php` or `mysql` instead of the built in php/mysql in Mac OSX. Which is awesomely useful for updating/backing up my databases and executing php on the command line.

#####2) Git Aliases

I love git, so having a few shorthands can help speed my up, these are a few of my git aliases (others are stored in my gitconfig).

{% highlight bash %}
alias gs='git status'
alias gc='git commit'
alias gl='git log'
alias ga='git add'
alias gpush='git push'
alias gpull='git pull'
{% endhighlight %}

#####3) Misc

The first alias here is the one I used it my example to limit the number of pings sent. The second is a quick command to "reload" my terminal session when I update my profile file. Next up, open any url from the command line in Chrome usage: `url http://www.google.co.uk`, and finally when navigating directories I always use `ls` to view inside the directory, and I have added the flag `-h` which changes file sizes into human readable sizes (so rather showing 1024 it would show 1kb)

{% highlight bash %}
alias ping="ping -c 5"
alias reload=". ~/.zprofile"
alias url="open -a /Applications/Google\ Chrome.app"
alias ls="ls -h"
{% endhighlight %}

#####4) Error logs!

When I'm working on an application, I'll refer to my `php_error.log` A LOT. So I created a handy alias to help me here. This simply shows the last 5 lines of the error log file

{% highlight bash %}
alias phplog="tail -n 5 /Applications/MAMP/logs/php_error.log"
{% endhighlight %}
        
##### What are yours?

I've shown you mine, now you gotta show me yours. Post them below, or mention me on twitter [@ashsmithco](http://twitter.com/ashsmithco).