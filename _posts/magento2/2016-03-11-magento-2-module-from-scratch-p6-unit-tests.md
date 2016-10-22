---
title: "Magento 2 module from scratch - Part 6: Unit Testing"
description: "Magento 2 & unit testing come hand in hand. Here's a developer guide on unit tests in Magento 2."
author: Ash Smith
layout: post
permalink: /magento2/module-from-scratch-part-6-unit-testing
categories:
  - magento2
  - popular
share: true
comments: true
---


After much delay, the final installment of creating a magento 2 module from scratch I will touch on unit testing, and how Magento go about it. In terms of the module we have created so far,
we are using core magento functionality, which will already be heavily tested. So you may get the impression some of these tests aren't beneficial. However, the purpose of
this article is to give you a quick primer on how unit testing works in Magento.

## Running unit tests in Magento

To get started we can refer to the [documentation provided](http://devdocs.magento.com/guides/v2.0/config-guide/cli/config-cli-subcommands-test.html) by Magento.

You can see that we can use `bin/magento` to run our unit tests:

{% highlight bash linenos=table %}
bin/magento dev:tests:run [--all] <test>
{% endhighlight %}

With this we can run the entire test suite (yeah, it takes a very long time), or we can specify a test suite we'd like to run, such as just the unit tests (which also takes a very long time):

{% highlight bash linenos=table %}
bin/magento dev:tests:run unit
{% endhighlight %}

For me, I prefer to use phpunit directly, this way you can apply a filter to only run your tests. Which is useful for when you are regularly running tests as you are working on a feature.

To use phpunit directly, you need head to the test directory: `[magento2-root]/dev/tests/unit`, and run the phpunit command:

{% highlight bash linenos=table %}
phpunit
{% endhighlight %}

This will run all unit tests within Magento, as defined in the `dev/tests/unitphpunit.xml.dist`.

## Our first unit test

Okay, with this covered lets write a test, and try to run it.

Let's start by testing the getIdentities method on `Ashsmith\Blog\Block\PostView`, if you remember back to that series this method is used for uniquely caching the block for each of our blog posts.

To get started create: `Test/Unit/Block/PostViewTest.php`.

The naming convention used here is important as this will effect which tests are loaded. So be sure to always store your unit tests within the `Test/Unit` directory.

{% highlight php linenos=table %}
<?php namespace Ashsmith\Blog\Test\Unit\Block;

class PostViewTest extends \PHPUnit_Framework_TestCase {

    public function testGetIdentities()
    {
        $this->assertTrue(false);
    }
}
{% endhighlight %}

This is our first unit test, and it will not pass. Let's see how this runs:

{% highlight bash linenos=table %}
phpunit --filter PostViewTest
PHPUnit 4.1.0 by Sebastian Bergmann.

Configuration read from /Users/ashsmith/Sites/magento2/dev/tests/unit/phpunit.xml.dist

F

Time: 13.17 seconds, Memory: 208.00Mb

There was 1 failure:

1) Ashsmith\Blog\Test\Unit\Block\PostViewTest::testGetIdentities
Failed asserting that false is true.

/Users/ashsmith/Sites/magento2/app/code/Ashsmith/Blog/Test/Unit/Block/PostViewTest.php:35
/Users/ashsmith/.composer/vendor/phpunit/phpunit/src/TextUI/Command.php:179
/Users/ashsmith/.composer/vendor/phpunit/phpunit/src/TextUI/Command.php:132

FAILURES!
Tests: 1, Assertions: 1, Failures: 1.
{% endhighlight %}

It worked! Let's fix this test up, and actually test something:

{% highlight php linenos=table %}
<?php namespace Ashsmith\Blog\Test\Unit\Block;

class PostViewTest extends \PHPUnit_Framework_TestCase {

    /**
     * @var \Ashsmith\Blog\Model\Post
     */
    protected $post;

    /**
     * @var \Ashsmith\Blog\Block\PostView
     */
    protected $block;

    /**
     * Sets up the fixture, for example, open a network connection.
     * This method is called before a test is executed.
     *
     */
    protected function setUp()
    {
        $objectManager = new \Magento\Framework\TestFramework\Unit\Helper\ObjectManager($this);
        $this->block = $objectManager->getObject('Ashsmith\Blog\Block\PostView');
        $this->post = $objectManager->getObject('Ashsmith\Blog\Model\Post');
        $reflection = new \ReflectionClass($this->post);
        $reflectionProperty = $reflection->getProperty('_idFieldName');
        $reflectionProperty->setAccessible(true);
        $reflectionProperty->setValue($this->post, 'post_id');
        $this->post->setId(1);
    }


    public function testGetIdentities()
    {
        $id = 1;
        $this->block->setPost($this->post);
        $this->assertEquals(
            [\Ashsmith\Blog\Model\Post::CACHE_TAG . '_' . $id],
            $this->block->getIdentities()
        );
    }

    /**
     * Tears down the fixture, for example, close a network connection.
     * This method is called after a test is executed.
     */
    protected function tearDown()
    {
        $this->block = null;
    }

}

{% endhighlight %}

So, our test has changed a fair bit now. Let's break it down a little:

The `setUp` method is ran _before_ every test. We also have the `tearDown` which is run _after_ every test. This allows us to setup and destroy the environment we require for our tests. In the `setUp` method we use the `TestFramework` object manager so that we can retrieve an instance of our `PostView` block and the `Post` model. We then use `ReflectionClass` to set properties on our Post model, so that the `post_id` value is defined.

Now we have two properties on our test class, `$this->block` and `$this->post`. We can now use these in our test. So if we take a look at our test: `testGetIdentities`, we set the current post on our block, and then simple assert that the getIdentities method on our block matches our expected output which is the cache tag with the post id appended.

We can run our test again and see that it passes successfully:

{% highlight bash linenos=table %}
phpunit --filter PostViewTest
PHPUnit 4.1.0 by Sebastian Bergmann.

Configuration read from /Users/ashsmith/Sites/magento2/dev/tests/unit/phpunit.xml.dist

.

Time: 13.19 seconds, Memory: 210.00Mb

OK (1 test, 1 assertion)
{% endhighlight %}

This example above is incredibly simple, and doesn't require any interaction with the database, and tests a very specific area of our code. Ideally, your unit tests will be similar, testing small portions of code, and only interacting with what you truly need.

If you want to learn more, you can use the resources I've linked to below, or if you're looking for Magento specific examples, the best are in the Magento core.

## Useful links

- [PHPUnit Manual (the holy grail!)](https://phpunit.de/manual/current/en/index.html)
- [Grump Learning - by Chris Hartjes](https://grumpy-learning.com/)
- [Introduction to unit testing - Sitepoint](http://www.sitepoint.com/tutorial-introduction-to-unit-testing-in-php-with-phpunit/)
- [Introduction to mock objects - Sitepoint](http://www.sitepoint.com/an-introduction-to-mock-object-testing/)
- [Hands on unit testing with PHPUnit - Tutsplus](http://code.tutsplus.com/tutorials/hands-on-unit-testing-with-phpunit--net-27454)

Got some useful resources yourself? Comment below, or add yourself (go to my github, link below)
