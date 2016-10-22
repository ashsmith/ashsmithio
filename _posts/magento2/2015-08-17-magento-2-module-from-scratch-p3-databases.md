---
title: 'Magento 2 module from scratch - Part 3: Setup classes & databases'
description: "A developers guide to create database tables in Magento 2."
author: Ash Smith
layout: post
permalink: /magento2/module-from-scratch-part-3-database-tables/
categories:
  - magento2
  - popular
share: true
comments: true
---

> Magento 2 has been released! This entire series has been updated to reflect the changes since I originally wrote this post.
> I install Magento 2 using Composer, I recommend you do to! [Learn how to here](http://devdocs.magento.com/guides/v2.0/install-gde/install-quick-ref.html#installation-part-1-getting-started)

In the last part of the series we cover creating our model & resource model so that we can interact
with the database. However, we haven't yet created our table! This part of the series will soon fix that!

I separated this into it's own post as I felt it needed it's own post!

If you haven't been following along on the series, I highly recommend you read [part one](/magento2/module-from-scratch-module-part-1), and part two, and checkout the module we'll be creating over on [GitHub](https://github.com/ashsmith/magento2-blog-module-tutorial).

In Magento 1.x you'll know that to make changes to the database we would create setup/upgrade scripts
to handle this. Well, that hasn't changed, it's just now we take an OOP approach.

Now, I'd like the mention something I noticed before we get started. As it stands with the beta version of
Magento 2, I don't personally understand how our setup classes link to speicifc versions of our modules.
You'll notice this too as we go forward, you may also ask yourself how you can control which order these can be run in. As it stands, I have no idea and hope to find out!

Let's dive in!

Remember in `etc/module.xml` we defined the `setup_version`? Well, this is what is used to tell Magento 2
which version our module is currently at, and will decide if upgrade or setup scripts need to be run.

When you first install your module and run `bin/magento setup:upgrade` our Setup script will be ran, and a record inserted into a table called `setup_module`, which is the same as the `core_resource` table from Magento 1.x.

So let's create our Setup class to install our database!

Create a file called: `Setup/InstallSchema.php`

{% highlight php linenos=table %}
<?php namespace Ashsmith\Blog\Setup;

use Magento\Framework\Setup\InstallSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\DB\Ddl\Table;

class InstallSchema implements InstallSchemaInterface
{
    /**
     * Installs DB schema for a module
     *
     * @param SchemaSetupInterface $setup
     * @param ModuleContextInterface $context
     * @return void
     */
    public function install(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $installer = $setup;

        $installer->startSetup();

        $table = $installer->getConnection()
            ->newTable($installer->getTable('ashsmith_blog_post'))
            ->addColumn(
                'post_id',
                Table::TYPE_SMALLINT,
                null,
                ['identity' => true, 'nullable' => false, 'primary' => true],
                'Post ID'
            )
            ->addColumn('url_key', Table::TYPE_TEXT, 100, ['nullable' => true, 'default' => null])
            ->addColumn('title', Table::TYPE_TEXT, 255, ['nullable' => false], 'Blog Title')
            ->addColumn('content', Table::TYPE_TEXT, '2M', [], 'Blog Content')
            ->addColumn('is_active', Table::TYPE_SMALLINT, null, ['nullable' => false, 'default' => '1'], 'Is Post Active?')
            ->addColumn('creation_time', Table::TYPE_DATETIME, null, ['nullable' => false], 'Creation Time')
            ->addColumn('update_time', Table::TYPE_DATETIME, null, ['nullable' => false], 'Update Time')
            ->addIndex($installer->getIdxName('blog_post', ['url_key']), ['url_key'])
            ->setComment('Ash Smith Blog Posts');

        $installer->getConnection()->createTable($table);

        $installer->endSetup();
    }

}
{% endhighlight %}

The name of this class can be anything you want. You just need to implement the interface `Magento\Framework\Setup\InstallSchemaInterface`. What do you do if you want to create an upgrade
script? Well, you'd implement `Magento\Framework\Setup\UpgradeSchemaInterface`.

If you need to check the version of your module between upgrades, you will now need to manage that yourself. You can find out more from my [magento.stackexchange.com question on handling upgrade scripts in magento 2](http://magento.stackexchange.com/questions/79201/how-do-you-control-ordering-of-upgrade-setup-scripts-in-magento-2)

Now we can head to the CLI and run the `bin/magento` command to install our database table!

{% highlight bash linenos=table %}
bin/magento setup:upgrade
{% endhighlight%}

When you run this you should see something along the lines of:

{% highlight bash linenos=table %}
    $ bin/magento setup:db-schema:upgrade
    Schema creation/updates:
    Module 'Ashsmith_Blog':
    Installing schema..
    Module 'Magento_Store':
    ...
{% endhighlight %}

That shows it has picked up your Schema Setup and ran it successfully!

>*Note:* If you run into any issues, it will be because you have already installed the module from the first part of my series. You will need to go into the `setup_module` table and delete your module from the table. Then re-run the `bin/magento setup:upgrade` command.

[Part 4 covers: frontend controllers, blocks and templates](/magento2/module-from-scratch-part-4-the-frontend)

You can view the complete module over on GitHub. [Magento 2 Blog Module](https://github.com/ashsmith/magento2-blog-module-tutorial)
