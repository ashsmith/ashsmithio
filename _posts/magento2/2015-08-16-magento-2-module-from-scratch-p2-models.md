---
title: 'Magento 2 module from scratch - Part 2: Models & Resource Models'
description: "A developers guide to setting up Models & Resource Models in Magento 2."
author: Ash Smith
layout: post
permalink: /magento2/module-from-scratch-module-part-2-models/
categories:
  - magento2
  - popular
share: true
comments: true
---

> Magento 2 has been released! This entire series has been updated to reflect the changes since I originally wrote this post.
> I install Magento 2 using Composer, I recommend you do to! [Learn how to here](http://devdocs.magento.com/guides/v2.0/install-gde/install-quick-ref.html#installation-part-1-getting-started)

If you haven't been following along on the series, I highly recommend you read [part one](/magento2/module-from-scratch-module-part-1-setup/), and checkout the module we'll be creating over on [GitHub](https://github.com/ashsmith/magento2-blog-module-tutorial).

Today's post is going to cover a fair bit, so grab yourself a cuppa. We'll be covering:

- Models
- Resource Models

At the end of this post you will have successfully created your first Service Contract, along with your Model, and Resource Model. A lot of this will feel familiar from Magento 1.x. So don't worry, it's not too different! You'll soon start to feel comfortable!

So let's dive in!

Magento 2 has a lot of new conventions, and a few of those I'll be covering today. The first of which
is it's use of PHP Interfaces. Our blog module will only require one database table, and that table will be named: `ashsmith_blog_post`, namespaced so we don't conflict with other tables, and descriptive of what it relates to. Our model will be called `Post`. So we'll need to create an interface for our `Post` model before we get started! Specifically the interface we're creating is referred to as a data interface.

If you want to learn more about how interfaces are used, devdocs.magento.com have some excellent posts covering this.

- [Service Contracts](http://devdocs.magento.com/guides/v2.0/extension-dev-guide/service-contracts/service-contracts.html)
- [Service Contracts - Data interfaces](http://devdocs.magento.com/guides/v2.0//extension-dev-guide/service-contracts/design-patterns.html#data-interfaces)

Before we build our interface, let's decide on how the blog post table will look. It will have the following columns:

- post_id - our post unique identifier
- url_key - a unique url key, for pretty URLs
- title - the title of our post
- content - the blog post content
- creation_time - timestamp
- update_time - timestamp
- is_active - boolean value if the post is active or not.

Ok, knowing this we can now create our interface. In our project we want to create a new file called: `Api/Data/PostInterface.php`, and inside it we want the following:

{% highlight php linenos=table %}
<?php
namespace Ashsmith\Blog\Api\Data;


interface PostInterface
{
    /**
     * Constants for keys of data array. Identical to the name of the getter in snake case
     */
    const POST_ID       = 'post_id';
    const URL_KEY       = 'url_key';
    const TITLE         = 'title';
    const CONTENT       = 'content';
    const CREATION_TIME = 'creation_time';
    const UPDATE_TIME   = 'update_time';
    const IS_ACTIVE     = 'is_active';

    /**
     * Get ID
     *
     * @return int|null
     */
    public function getId();

    /**
     * Get URL Key
     *
     * @return string
     */
    public function getUrlKey();

    /**
     * Get title
     *
     * @return string|null
     */
    public function getTitle();

    /**
     * Get content
     *
     * @return string|null
     */
    public function getContent();

    /**
     * Get creation time
     *
     * @return string|null
     */
    public function getCreationTime();

    /**
     * Get update time
     *
     * @return string|null
     */
    public function getUpdateTime();

    /**
     * Is active
     *
     * @return bool|null
     */
    public function isActive();

    /**
     * Set ID
     *
     * @param int $id
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setId($id);

    /**
     * Set URL Key
     *
     * @param string $url_key
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setUrlKey($url_key);

    /**
     * Set title
     *
     * @param string $title
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setTitle($title);

    /**
     * Set content
     *
     * @param string $content
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setContent($content);

    /**
     * Set creation time
     *
     * @param string $creationTime
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setCreationTime($creationTime);

    /**
     * Set update time
     *
     * @param string $updateTime
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setUpdateTime($updateTime);

    /**
     * Set is active
     *
     * @param int|bool $isActive
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setIsActive($isActive);
}
{% endhighlight %}

This interface has defined all the setters and getters we would use when interacting with our model.
It also outlines all the methods we must implement! So, let's create our Model!

This file goes to: `Model/Post.php`

{% highlight php linenos=table %}
<?php namespace Ashsmith\Blog\Model;

use Ashsmith\Blog\Api\Data\PostInterface;
use Magento\Framework\DataObject\IdentityInterface;

class Post  extends \Magento\Framework\Model\AbstractModel implements PostInterface, IdentityInterface
{

    /**#@+
     * Post's Statuses
     */
    const STATUS_ENABLED = 1;
    const STATUS_DISABLED = 0;
    /**#@-*/

    /**
     * CMS page cache tag
     */
    const CACHE_TAG = 'blog_post';

    /**
     * @var string
     */
    protected $_cacheTag = 'blog_post';

    /**
     * Prefix of model events names
     *
     * @var string
     */
    protected $_eventPrefix = 'blog_post';

    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('Ashsmith\Blog\Model\ResourceModel\Post');
    }

    /**
     * Check if post url key exists
     * return post id if post exists
     *
     * @param string $url_key
     * @return int
     */
    public function checkUrlKey($url_key)
    {
        return $this->_getResource()->checkUrlKey($url_key);
    }

    /**
     * Prepare post's statuses.
     * Available event blog_post_get_available_statuses to customize statuses.
     *
     * @return array
     */
    public function getAvailableStatuses()
    {
        return [self::STATUS_ENABLED => __('Enabled'), self::STATUS_DISABLED => __('Disabled')];
    }
    /**
     * Return unique ID(s) for each object in system
     *
     * @return array
     */
    public function getIdentities()
    {
        return [self::CACHE_TAG . '_' . $this->getId()];
    }

    /**
     * Get ID
     *
     * @return int|null
     */
    public function getId()
    {
        return $this->getData(self::POST_ID);
    }

    /**
     * Get URL Key
     *
     * @return string
     */
    public function getUrlKey()
    {
        return $this->getData(self::URL_KEY);
    }

    /**
     * Get title
     *
     * @return string|null
     */
    public function getTitle()
    {
        return $this->getData(self::TITLE);
    }

    /**
     * Get content
     *
     * @return string|null
     */
    public function getContent()
    {
        return $this->getData(self::CONTENT);
    }

    /**
     * Get creation time
     *
     * @return string|null
     */
    public function getCreationTime()
    {
        return $this->getData(self::CREATION_TIME);
    }

    /**
     * Get update time
     *
     * @return string|null
     */
    public function getUpdateTime()
    {
        return $this->getData(self::UPDATE_TIME);
    }

    /**
     * Is active
     *
     * @return bool|null
     */
    public function isActive()
    {
        return (bool) $this->getData(self::IS_ACTIVE);
    }

    /**
     * Set ID
     *
     * @param int $id
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setId($id)
    {
        return $this->setData(self::POST_ID, $id);
    }

    /**
     * Set URL Key
     *
     * @param string $url_key
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setUrlKey($url_key)
    {
        return $this->setData(self::URL_KEY, $url_key);
    }

    /**
     * Set title
     *
     * @param string $title
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setTitle($title)
    {
        return $this->setData(self::TITLE, $title);
    }

    /**
     * Set content
     *
     * @param string $content
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setContent($content)
    {
        return $this->setData(self::CONTENT, $content);
    }

    /**
     * Set creation time
     *
     * @param string $creation_time
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setCreationTime($creation_time)
    {
        return $this->setData(self::CREATION_TIME, $creation_time);
    }

    /**
     * Set update time
     *
     * @param string $update_time
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setUpdateTime($update_time)
    {
        return $this->setData(self::UPDATE_TIME, $update_time);
    }

    /**
     * Set is active
     *
     * @param int|bool $is_active
     * @return \Ashsmith\Blog\Api\Data\PostInterface
     */
    public function setIsActive($is_active)
    {
        return $this->setData(self::IS_ACTIVE, $is_active);
    }

}
{% endhighlight %}

As you can see we have implemented each method from our `PostInterface` interface. You will also notice
we have implemented a second interface too, `Magento\Framework\DataObject\IdentityInterface`. This interface
is used for models which require cache refresh after creation/updating/deletion, and models that render
information to the frontend. This simply requires us to implement the `getIdentities()` method. Which will return a unique ID for each instance of our model, that is cacheable.

On top of the methods implemented by our interfaces we have also implemented:

- _construct - This allows us to initialise our resource model, like in Magento 1.x
- getAvailableStatuses - Along with the two constants, we can use this to restrict what statuses can be used.
- checkUrlKey - This will allow us to check if a post with that URL Key already exists!

Furthermore, you'll notice some attributes defined at the top of our class:

- $_cacheTag - a unique identifier for use within caching
- $_eventPrefix - a prefix for events to be triggered. We'll cover this more later.

Now it's time to create our resource model! This goes in: `Model/ResourceModel/Post.php`

{% highlight php linenos=table %}
<?php
namespace Ashsmith\Blog\Model\ResourceModel;

/**
 * Blog post mysql resource
 */
class Post extends \Magento\Framework\Model\ResourceModel\Db\AbstractDb
{

    /**
     * @var \Magento\Framework\Stdlib\DateTime\DateTime
     */
    protected $_date;

    /**
     * Construct
     *
     * @param \Magento\Framework\Model\ResourceModel\Db\Context $context
     * @param \Magento\Framework\Stdlib\DateTime\DateTime $date
     * @param string|null $resourcePrefix
     */
    public function __construct(
        \Magento\Framework\Model\ResourceModel\Db\Context $context,
        \Magento\Framework\Stdlib\DateTime\DateTime $date,
        $resourcePrefix = null
    ) {
        parent::__construct($context, $resourcePrefix);
        $this->_date = $date;
    }

    /**
     * Initialize resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('ashsmith_blog_post', 'post_id');
    }

    /**
     * Process post data before saving
     *
     * @param \Magento\Framework\Model\AbstractModel $object
     * @return $this
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    protected function _beforeSave(\Magento\Framework\Model\AbstractModel $object)
    {

        if (!$this->isValidPostUrlKey($object)) {
            throw new \Magento\Framework\Exception\LocalizedException(
                __('The post URL key contains capital letters or disallowed symbols.')
            );
        }

        if ($this->isNumericPostUrlKey($object)) {
            throw new \Magento\Framework\Exception\LocalizedException(
                __('The post URL key cannot be made of only numbers.')
            );
        }

        if ($object->isObjectNew() && !$object->hasCreationTime()) {
            $object->setCreationTime($this->_date->gmtDate());
        }

        $object->setUpdateTime($this->_date->gmtDate());

        return parent::_beforeSave($object);
    }

    /**
     * Load an object using 'url_key' field if there's no field specified and value is not numeric
     *
     * @param \Magento\Framework\Model\AbstractModel $object
     * @param mixed $value
     * @param string $field
     * @return $this
     */
    public function load(\Magento\Framework\Model\AbstractModel $object, $value, $field = null)
    {
        if (!is_numeric($value) && is_null($field)) {
            $field = 'url_key';
        }

        return parent::load($object, $value, $field);
    }

    /**
     * Retrieve select object for load object data
     *
     * @param string $field
     * @param mixed $value
     * @param \Ashsmith\Blog\Model\Post $object
     * @return \Zend_Db_Select
     */
    protected function _getLoadSelect($field, $value, $object)
    {
        $select = parent::_getLoadSelect($field, $value, $object);

        if ($object->getStoreId()) {

            $select->where(
                'is_active = ?',
                1
            )->limit(
                1
            );
        }

        return $select;
    }

    /**
     * Retrieve load select with filter by url_key and activity
     *
     * @param string $url_key
     * @param int $isActive
     * @return \Magento\Framework\DB\Select
     */
    protected function _getLoadByUrlKeySelect($url_key, $isActive = null)
    {
        $select = $this->getConnection()->select()->from(
            ['bp' => $this->getMainTable()]
        )->where(
            'bp.url_key = ?',
            $url_key
        );

        if (!is_null($isActive)) {
            $select->where('bp.is_active = ?', $isActive);
        }

        return $select;
    }

    /**
     *  Check whether post url key is numeric
     *
     * @param \Magento\Framework\Model\AbstractModel $object
     * @return bool
     */
    protected function isNumericPostUrlKey(\Magento\Framework\Model\AbstractModel $object)
    {
        return preg_match('/^[0-9]+$/', $object->getData('url_key'));
    }

    /**
     *  Check whether post url key is valid
     *
     * @param \Magento\Framework\Model\AbstractModel $object
     * @return bool
     */
    protected function isValidPostUrlKey(\Magento\Framework\Model\AbstractModel $object)
    {
        return preg_match('/^[a-z0-9][a-z0-9_\/-]+(\.[a-z0-9_-]+)?$/', $object->getData('url_key'));
    }

    /**
     * Check if post url key exists
     * return post id if post exists
     *
     * @param string $url_key
     * @return int
     */
    public function checkUrlKey($url_key)
    {
        $select = $this->_getLoadByUrlKeySelect($url_key, 1);
        $select->reset(\Zend_Db_Select::COLUMNS)->columns('bp.post_id')->limit(1);

        return $this->getConnection()->fetchOne($select);
    }
}
{% endhighlight %}

In here we have implemented the following methods:

- __construct - Where we inject dependencies we use in our resource model.
- _construct - Where we initialise our resource model, like we would in Magento 1.x this is where the database table and ID column is defined.
- _beforeSave, we need to make sure we're saving valid data, so a little validation is handled Here
- load, if the user provides a string instead of an id we try to load the model against the url_key column as that is still a uniquely identifiable column.
- _getLoadSelect allows us to filter to only active posts. We don't want to load inactive posts!
- _getLoadByUrlKeySelect allows us to select items by a url key.
- isNumericPostUrlKey is a validation method to see if our url key contains numbers. We don't want numeric url keys!
- isValidPostUrlKey, make sure the post url key is actually valid with a simple regex check.
- checkUrlKey, check if a URL Key exists in the posts table already.

Finally, we need a Collection resource model. The collection model will allow us to filter and fetch a collection of blog posts.

Create a file named: `Model/ResourceModel/Post/Collection.php`

{% highlight php linenos=table %}
<?php namespace Ashsmith\Blog\Model\ResourceModel\Post;

class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    /**
     * @var string
     */
    protected $_idFieldName = 'post_id';

    /**
     * Define resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('Ashsmith\Blog\Model\Post', 'Ashsmith\Blog\Model\ResourceModel\Post');
    }

}
{% endhighlight %}

As per Magento 1.x, this is going to look familiar. Nothing new here really. We initialise our Collection with both our model, and resource model.

So, how do we use our resource model in Magento 2? Well, a factory object is generated that handles instantiating our collection. We can inject this factory into our blocks (or wherever we want to use our collection!) and then we can do as we please! I'll cover this in the  post where we [create our controllers, blocks and templates](/magento2/module-from-scratch-part-4-the-frontend).

And that's how you create and models & resource models for interacting with a database. Did you notice we didn't have to write a single line of XML? Huzzah! Yup, Magento 2 has done away with having to register your models and resource models.

Ok! We have covered a lot, in the next post I'll be covering [how to create our table through Setup scripts](/magento2/module-from-scratch-part-3-database-tables). I'll also be touching on Upgrade scripts too. Until then, let me know in the comments what you think, or any questions.

You can view the complete module over on GitHub. [Magento 2 Blog Module](https://github.com/ashsmith/magento2-blog-module-tutorial)
