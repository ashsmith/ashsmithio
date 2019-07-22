---
title: 'Magento 2 module from scratch - Introduction'
date: "2015-08-15T12:00:00Z"
description: "Magento 2 developer guide to creating a blog module from scratch"
author: Ash Smith
layout: post
permalink: /magento2/module-from-scratch-introduction/
category: "Magento 2"
comments: true
---

Magento 2 is quickly becoming something us Magento developers need to learn pretty rapidly as we'll soon be expected to start building our clients stores on the platform and building extensions. I wanted to take the opportunity to create a simple set of posts which will go over, at a bit of a high level, on how to create a full blown magento 2 module.. with admin management, and unit tests!

So, by the end of this small series of blog posts you will be able to do the following, with ease:

- Creating a module that is installable via Composer
- Create controllers and understand how the rewrite system works
- How blocks, layouts and template work
- Create models and interact with the database
- Setup an admin interface to create, edit and delete items from the database.
- Create unit tests to support all of the above!

## What are we going to build?
The end extension will be a fairly basic blog, you'll be able create blog posts from the admin including editing and deleting them. Then from the frontend you will be able to view a list of all the blog posts, and view each blog post individually. I believe this will allow us to cover all the essentials into building a magento extension!

1. [Basic Module Setup](/magento2/module-from-scratch-module-part-1-setup/)
2. [Setting up our Models & Resource Models](/magento2/module-from-scratch-module-part-2-models/)
3. [Migrations & Database Schema!](/magento2/module-from-scratch-part-3-database-tables)
4. [The Frontend: Controllers, Blocks, layouts & views](/magento2/module-from-scratch-part-4-the-frontend)
5. [The Backend: Controllers, Blocks, UI, layouts and views](/magento2/module-from-scratch-part-5-adminhtml/)
6. [Unit testing](/magento2/module-from-scratch-part-6-unit-testing)
