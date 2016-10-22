---
title: 'Magento 2 module from scratch - Part 4: Frontend Controllers, Blocks and Templates'
description: "Creating Controllers, Blocks and Templates in Magento 2, a developers guide."
author: Ash Smith
layout: post
permalink: /magento2/module-from-scratch-part-4-the-frontend
categories:
  - magento2
  - popular
share: true
comments: true
---

> Magento 2 has been released! This entire series has been updated to reflect the changes since I originally wrote this post.
> I install Magento 2 using Composer, I recommend you do to! [Learn how to here](http://devdocs.magento.com/guides/v2.0/install-gde/install-quick-ref.html#installation-part-1-getting-started)

So far in the series we have created our model, resource model and database schema. It's finally time
to create something which we can see! It's time to setup our controller, blocks, layout and templates!

Let's start with our controller! You may have already read my blog post on [creating a controller in Magento 2](/2014/12/simple-magento2-controller-module/), so please check that out, and that is where a lot more detail will be kept regarding controllers!

Before creating our controller, we need to create a new XML configuration file: `etc/frontend/routes.xml`

{% highlight xml linenos=table %}
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:App/etc/routes.xsd">
    <router id="standard">
        <route id="blog" frontName="blog">
            <module name="Ashsmith_Blog" />
        </route>
    </router>
</config>
{% endhighlight %}

Take a look at the `<route>` node, note how the frontName is `blog`. If you remember from Magento 1.x the URL our controller is mapped to is: `<frontName>/<controller>/<action>`. Well Magento 2 has followed the same structure! However, with one slight change. `<frontName>/<namespace>/<action>`.

Now, instead of having a single controller class with contains all our actions, we use a directory namespace to group our actions. Each action is it's own class extending `\Magento\Framework\App\Action\Action` and simply implementing the method `execute()`.

So, let's go ahead and create our blog index, this is how we'll list our latest blog posts.

Create a file called: `Controller/Index/Index.php`. This will map to: `/blog/` `/blog/index` and `/blog/index/index`.

{% highlight php linenos=table %}
<?php
namespace Ashsmith\Blog\Controller\Index;

use \Magento\Framework\App\Action\Action;

class Index extends Action
{
    /** @var  \Magento\Framework\View\Result\Page */
    protected $resultPageFactory;
    /**
     * @param \Magento\Framework\App\Action\Context $context
     */
    public function __construct(\Magento\Framework\App\Action\Context $context,
                                \Magento\Framework\View\Result\PageFactory $resultPageFactory)
    {
        $this->resultPageFactory = $resultPageFactory;
        parent::__construct($context);
    }

    /**
     * Blog Index, shows a list of recent blog posts.
     *
     * @return \Magento\Framework\View\Result\PageFactory
     */
    public function execute()
    {
        return $this->resultPageFactory->create();
    }
}

{% endhighlight %}

Our controller is super light. We just need return an instance of `\Magento\Framework\View\Result\PageFactory`. When we come to creating our controller that will handle
viewing a single blog post, we'll cover adding custom layout handles, and dispatching events.

So, that's all we need from our blog/index/index controller!

Let's move onto creating our Block: `Block/PostList.php` (note how it's called PostList, we can't use List, it's a reserved word in PHP).

{% highlight php linenos=table %}
<?php
namespace Ashsmith\Blog\Block;

use Ashsmith\Blog\Api\Data\PostInterface;
use Ashsmith\Blog\Model\ResourceModel\Post\Collection as PostCollection;

class PostList extends \Magento\Framework\View\Element\Template implements
    \Magento\Framework\DataObject\IdentityInterface
{
    /**
     * @var \Ashsmith\Blog\Model\ResourceModel\Post\CollectionFactory
     */
    protected $_postCollectionFactory;

    /**
     * Construct
     *
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Ashsmith\Blog\Model\ResourceModel\Post\CollectionFactory $postCollectionFactory,
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Ashsmith\Blog\Model\ResourceModel\Post\CollectionFactory $postCollectionFactory,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->_postCollectionFactory = $postCollectionFactory;
    }

    /**
     * @return \Ashsmith\Blog\Model\ResourceModel\Post\Collection
     */
    public function getPosts()
    {
        // Check if posts has already been defined
        // makes our block nice and re-usable! We could
        // pass the 'posts' data to this block, with a collection
        // that has been filtered differently!
        if (!$this->hasData('posts')) {
            $posts = $this->_postCollectionFactory
                ->create()
                ->addFilter('is_active', 1)
                ->addOrder(
                    PostInterface::CREATION_TIME,
                    PostCollection::SORT_ORDER_DESC
                );
            $this->setData('posts', $posts);
        }
        return $this->getData('posts');
    }

    /**
     * Return identifiers for produced content
     *
     * @return array
     */
    public function getIdentities()
    {
        return [\Ashsmith\Blog\Model\Post::CACHE_TAG . '_' . 'list'];
    }

}
{% endhighlight %}

So first thing, our block extends `\Magento\Framework\View\Element\Template` and implements the `\Magento\Framework\Object\IdentityInterface` interface. The `Template` class can be compared to `Mage_Core_Block_Template`. Next our `IdentityInterface` requires the `getIdentities` method to be implemented. This is an identifier for caching our blocks output!

Next up we have the `getPosts` method. In this, we use our factory class (Magento creates these automatically if you think you missed a step!), the factory class simply handles instantiating our
collection for us, along with it's dependencies. Calling the `create()` method will create an instance
of our collection, then I have just ordered our collection to get the newest posts.

Now that we have our block, let's create our layout file, and templates!

Create the file: `view/frontend/layout/blog_index_index.xml`

{% highlight xml linenos=table %}
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" layout="1column" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceContainer name="content">
            <block class="Ashsmith\Blog\Block\PostList" name="blog.list" template="Ashsmith_Blog::list.phtml" />
        </referenceContainer>
    </body>
</page>

{% endhighlight %}

We can create a layout file per handle, and in here we can specify which blocks we want, and which template we require to use!

> I'd want to keep this post down in length, so I'm skipping over a fair bit about layout and templating.
> I will aim to cover it in more depth in a later post!

Let's move onto our actual template:


Create the file `view/frontend/templates/list.phtml`:

{% highlight php linenos=table %}
<?php /** @var $block \Ashsmith\Blog\Block\PostList */ ?>
<h1><?php echo __('Latest Blog Posts') ?></h1>
<ul class="blog-post-list">
<?php /** @var $post \Ashsmith\Blog\Model\Post */ ?>
<?php foreach ($block->getPosts() as $post): ?>
    <li class="blog-post-list-item">
        <h3 class="blog-post-item-title">
            <a href="<?php echo $post->getUrl() ?>"><?php echo $post->getTitle() ?></a>
        </h3>

        <div class="blog-post-item-content">
            <?php echo $post->getContent(); ?>
        </div>

        <div class="blog-post-item-meta">
            <strong><?php echo __('Created at:') ?></strong> <?php echo $post->getCreationTime() ?>
        </div>
    </li>
<?php endforeach; ?>
</ul>

{% endhighlight %}

Nothing out of the ordinary here. You're probably very familiar with this!

The main thing to note is that `$this` is not your block anymore, it's actually the template engine. You
have access to another variable though: `$block`. That is your block!

Now, as you don't actually have any blog posts yet. You will want to put some into the database manually or the time being!
{% highlight sql linenos=table %}
INSERT INTO `ashsmith_blog_post` (`post_id`, `url_key`, `title`, `content`, `is_active`, `creation_time`, `update_time`) VALUES (NULL, 'test-1', 'test title 1', 'testing content 1', 1, '2015-08-17 22:59:00', '2015-07-17 22:59:00');
INSERT INTO `ashsmith_blog_post` (`post_id`, `url_key`, `title`, `content`, `is_active`, `creation_time`, `update_time`) VALUES (NULL, 'test-2', 'test title 2', 'testing content 2', 1, '2015-08-17 22:59:00', '2015-07-17 22:59:00');
{% endhighlight %}

Now, clear cache and head to `blog/`. You will see a list of blog posts!

Now that we have our list of blog posts, you'll notice the URL's are nice and friendly (mystore.dev/blog/test-1 for example). So how do tell Magento how to handle those? Well, we can register a custom router. To do this, we create our router: `Controller/Router.php`, then we'll need to edit `etc/frontend/di.xml` within out module to register our custom router.

Create: `Controller/Router.php`

{% highlight php linenos=table %}
<?php
namespace Ashsmith\Blog\Controller;

class Router implements \Magento\Framework\App\RouterInterface
{
    /**
     * @var \Magento\Framework\App\ActionFactory
     */
    protected $actionFactory;

    /**
     * Post factory
     *
     * @var \Ashsmith\Blog\Model\PostFactory
     */
    protected $_postFactory;

    /**
     * @param \Magento\Framework\App\ActionFactory $actionFactory
     * @param \Ashsmith\Blog\Model\PostFactory $postFactory
     */
    public function __construct(
        \Magento\Framework\App\ActionFactory $actionFactory,
        \Ashsmith\Blog\Model\PostFactory $postFactory
    ) {
        $this->actionFactory = $actionFactory;
        $this->_postFactory = $postFactory;
    }

    /**
     * Validate and Match Blog Post and modify request
     *
     * @param \Magento\Framework\App\RequestInterface $request
     * @return bool
     */
    public function match(\Magento\Framework\App\RequestInterface $request)
    {
        $url_key = trim($request->getPathInfo(), '/blog/');
        $url_key = rtrim($url_key, '/');

        /** @var \Ashsmith\Blog\Model\Post $post */
        $post = $this->_postFactory->create();
        $post_id = $post->checkUrlKey($url_key);
        if (!$post_id) {
            return null;
        }

        $request->setModuleName('blog')->setControllerName('view')->setActionName('index')->setParam('post_id', $post_id);
        $request->setAlias(\Magento\Framework\Url::REWRITE_REQUEST_PATH_ALIAS, $url_key);

        return $this->actionFactory->create('Magento\Framework\App\Action\Forward');
    }
}

{% endhighlight %}

We have to follow the `\Magento\Framework\App\RouterInterface` interface, which requires the `match` method, from here we can fetch the URL key of the post from the request path. We do this by stripping out the `/blog/` and any trailing slashes on the end of the request path. Then we can check if it exists, if it doesn't we return null. This will then skip our router and if there are any other routers to be checked it'll carry on until it hits the default 404 page. If there is a match we update the request with our controller/action along with the blog post id. Then we forward the request.

Right, to get this working we need to add our Router into the list of routers, this is done with `etc/frontend/di.xml`.

{% highlight xml linenos=table %}
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:ObjectManager/etc/config.xsd">
    <type name="Magento\Framework\App\RouterList">
        <arguments>
            <argument name="routerList" xsi:type="array">
                <item name="blog" xsi:type="array">
                    <item name="class" xsi:type="string">Ashsmith\Blog\Controller\Router</item>
                    <item name="disable" xsi:type="boolean">false</item>
                    <item name="sortOrder" xsi:type="string">70</item>
                </item>
            </argument>
        </arguments>
    </type>
</config>

{% endhighlight %}

Let's create our controller, block, layout and template for viewing a single blog post. We'll fly over this as we've covered a lot of this already.

File: `Controller/View/Index.php`

{% highlight php linenos=table %}
<?php
namespace Ashsmith\Blog\Controller\View;

use \Magento\Framework\App\Action\Action;

class Index extends Action
{
    /** @var  \Magento\Framework\View\Result\Page */
    protected $resultPageFactory;

    /**
     * @param \Magento\Framework\App\Action\Context $context
     */
    public function __construct(\Magento\Framework\App\Action\Context $context,
                                \Magento\Framework\Controller\Result\ForwardFactory $resultForwardFactory
    )
    {
        $this->resultForwardFactory = $resultForwardFactory;
        parent::__construct($context);
    }

    /**
     * Blog Index, shows a list of recent blog posts.
     *
     * @return \Magento\Framework\View\Result\PageFactory
     */
    public function execute()
    {
        $post_id = $this->getRequest()->getParam('post_id', $this->getRequest()->getParam('id', false));
        /** @var \Ashsmith\Blog\Helper\Post $post_helper */
        $post_helper = $this->_objectManager->get('Ashsmith\Blog\Helper\Post');
        $result_page = $post_helper->prepareResultPost($this, $post_id);
        if (!$result_page) {
            $resultForward = $this->resultForwardFactory->create();
            return $resultForward->forward('noroute');
        }
        return $result_page;
    }
}

{% endhighlight %}

We've taken a slightly different approach to last time and instead of keeping a lot
of the logic within our controller we have moved it out to a helper method.

Create our helper: `Helper/Post.php`
{% highlight php linenos=table %}
<?php namespace Ashsmith\Blog\Helper;

use Magento\Framework\App\Action\Action;

class Post extends \Magento\Framework\App\Helper\AbstractHelper
{

    /**
     * @var \Ashsmith\Blog\Model\Post
     */
    protected $_post;

    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $resultPageFactory;

    /**
     * Constructor
     *
     * @param \Magento\Framework\App\Helper\Context $context
     * @param \Ashsmith\Blog\Model\Post $post
     * @param \Magento\Framework\View\Result\PageFactory $resultPageFactory
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Ashsmith\Blog\Model\Post $post,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory
    )
    {
        $this->_post = $post;
        $this->resultPageFactory = $resultPageFactory;
        parent::__construct($context);
    }

    /**
     * Return a blog post from given post id.
     *
     * @param Action $action
     * @param null $postId
     * @return \Magento\Framework\View\Result\Page|bool
     */
    public function prepareResultPost(Action $action, $postId = null)
    {
        if ($postId !== null && $postId !== $this->_post->getId()) {
            $delimiterPosition = strrpos($postId, '|');
            if ($delimiterPosition) {
                $postId = substr($postId, 0, $delimiterPosition);
            }

            if (!$this->_post->load($postId)) {
                return false;
            }
        }

        if (!$this->_post->getId()) {
            return false;
        }

        /** @var \Magento\Framework\View\Result\Page $resultPage */
        $resultPage = $this->resultPageFactory->create();
        // We can add our own custom page handles for layout easily.
        $resultPage->addHandle('blog_post_view');

        // This will generate a layout handle like: blog_post_view_id_1
        // giving us a unique handle to target specific blog posts if we wish to.
        $resultPage->addPageLayoutHandles(['id' => $this->_post->getId()]);

        // Magento is event driven after all, lets remember to dispatch our own, to help people
        // who might want to add additional functionality, or filter the posts somehow!
        $this->_eventManager->dispatch(
            'ashsmith_blog_post_render',
            ['post' => $this->_post, 'controller_action' => $action]
        );

        return $resultPage;
    }
}

{% endhighlight %}

Create our Block: `Block/PostView.php`
{% highlight php linenos=table %}
<?php
namespace Ashsmith\Blog\Block;

class PostView extends \Magento\Framework\View\Element\Template implements
    \Magento\Framework\DataObject\IdentityInterface
{

    /**
     * Construct
     *
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \Ashsmith\Blog\Model\Post $post
     * @param \Ashsmith\Blog\Model\PostFactory $postFactory
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Ashsmith\Blog\Model\Post $post,
        \Ashsmith\Blog\Model\PostFactory $postFactory,
        array $data = []
    )
    {
        parent::__construct($context, $data);
        $this->_post = $post;
        $this->_postFactory = $postFactory;
    }

    /**
     * @return \Ashsmith\Blog\Model\Post
     */
    public function getPost()
    {
        // Check if posts has already been defined
        // makes our block nice and re-usable! We could
        // pass the 'posts' data to this block, with a collection
        // that has been filtered differently!
        if (!$this->hasData('post')) {
            if ($this->getPostId()) {
                /** @var \Ashsmith\Blog\Model\Post $page */
                $post = $this->_postFactory->create();
            } else {
                $post = $this->_post;
            }
            $this->setData('post', $post);
        }
        return $this->getData('post');
    }

    /**
     * Return identifiers for produced content
     *
     * @return array
     */
    public function getIdentities()
    {
        return [\Ashsmith\Blog\Model\Post::CACHE_TAG . '_' . $this->getPost()->getId()];
    }

}

{% endhighlight %}

Create our layout file: `view/frontend/layout/blog_view_index.xml`
{% highlight xml linenos=table %}
<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" layout="1column" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
        <referenceContainer name="content">
            <block class="Ashsmith\Blog\Block\PostView" name="blog.list" template="Ashsmith_Blog::view.phtml" />
        </referenceContainer>
    </body>
</page>

{% endhighlight %}

And finally our template file: `view/frontend/templates/view.phtml`
{% highlight php linenos=table %}
<?php
/** @var $block \Ashsmith\Blog\Block\PostView */
/** @var $post \Ashsmith\Blog\Model\Post */
$post = $block->getPost();
?>
<h1 class="blog-post-item-title"><?php echo $post->getTitle() ?></h1>

<div class="blog-post-item-content">
    <?php echo $post->getContent(); ?>
</div>

<div class="blog-post-item-meta">
    <strong><?php echo __('Created at:') ?></strong> <?php echo $post->getCreationTime() ?>
</div>

{% endhighlight %}

And that's it! Now, clear cache and vist `blog/` again, and click on a blog post title.
You should now see you're on something like: `blog/test-1`.


##### What's up next
In part 5 we'll be creating our [admin interface for creating, editing and deleting blog posts](/magento2/module-from-scratch-part-5-adminhtml)!
