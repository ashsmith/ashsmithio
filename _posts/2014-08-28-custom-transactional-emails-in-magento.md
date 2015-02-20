---
title: 'Quick Tip: Sending custom transactional emails in Magento'
author: Ash Smith
layout: post
share: true
comments: true
---

I always forget how to create custom transactional emails, I thought I'd throw a blog post together to remind myself!

## Step 1) Adding your template to `etc/config.xml` to register the email template.

First of all, assuming you already have a basic module setup, add this into `app/code/[codePool]/[Namespace]/[Module]/etc/config.xml`
{% highlight xml %}
<config>
    ...
    <global>
        ...
        <template>
            <email>
                <!-- Give the template a uniqiue name, you'll need to refer to this later when sending the email-->
                <[email_template_name]>
                    <label>[Email Template Label]</label>
                    <file>[email_template_filename].html</file>
                    <type>html</type>
                </[email_template_name]>
            </email>
        </template>
    </global>
</config>
{% endhighlight %}

## Step 2) Creating your email template!

Awesome, we now have the email template setup, next up we'll need to create the email template itself. This file needs to be saved in `app/locale/[your_locale_or_en_US]/template/email/[email_template_filename].html`. The locale code is important, this allows you to create the email in multiple languages, the default locale in Magento is en_US, so saving there is a good place if you're not sure.

{% highlight html %}
<!--@subject This is the subject line of the email! @-->
<div style="font:11px/1.35em Verdana, Arial, Helvetica, sans-serif;">
  <table cellspacing="0" cellpadding="0" border="0" width="98%" style="margin-top:10px; font:11px/1.35em Verdana, Arial, Helvetica, sans-serif; margin-bottom:10px;">
    <tr>
      <td align="center" valign="top">
        <!-- [ header starts here] -->
          <table cellspacing="0" cellpadding="0" border="0" width="650">
            <tr>
              <td valign="top">
                <p>
                  <a href="{% raw %}{{store url=""}}{% endraw %}" style="color:#1E7EC8;"><img src="{% raw %}{{skin url="images/logo_email.gif" _area='frontend'}}{% endraw %}" alt="Magento" border="0"/></a>
                </p>
              </td>
            </tr>
          </table>
          <!-- [ middle starts here] -->
          <table cellspacing="0" cellpadding="0" border="0" width="650">
            <tr>
              <td valign="top">
                <p>
                <strong>Dear {% raw %}{{var customer_name}}{% endraw %}</strong>,<br/>
                This is the content of your email!
                </p>
              </td>
            </tr>
          </table>
      </td>
    </tr>
  </table>
</div>
{% endhighlight %}

Items to note in the above email template:

####Your subject looks like a HTML comment:

    <!--@subject This is the subject line of the email! @-->

####Variables!

Since these templates don't support PHP directly, we can use this form accessing variables and objects.

    Get the current stores URL
    {% raw %}{{store url=""}}{% endraw %}

    Get the skin url, accepts a path, in this case it's the logo image.
    {% raw %}{{skin url="images/logo_email.gif"}}{% endraw %}

    Custom variables, as defined by us. We'll cover this shortly!
    {% raw %}{{var customer_name}}{% endraw %}


##Step 3) Sending the email!

We have our email template configured, and recognised by Magento. Now it's time to put it all together and send the email!

{% highlight php %}
<?php

// This is the template name from your etc/config.xml 
$template_id = '[email_template_name]';

// Who were sending to...
$email_to = 'demo@example.com';
$customer_name   = 'John Doe';

// Load our template by template_id
$email_template  = Mage::getModel('core/email_template')->loadDefault($template_id);

// Here is where we can define custom variables to go in our email template!
$email_template_variables = array(
    'customer_name' => $customerName
    // Other variables for our email template.
);

// I'm using the Store Name as sender name here.
$sender_name = Mage::getStoreConfig(Mage_Core_Model_Store::XML_PATH_STORE_STORE_NAME);
// I'm using the general store contact here as the sender email.
$sender_email = Mage::getStoreConfig('trans_email/ident_general/email');
$email_template->setSenderName($sender_name);
$email_template->setSenderEmail($sender_email); 

//Send the email!
$email_template->send($email_to, $customer_name, $email_template_variables);
?>
{% endhighlight %}

## Conclusion

And that's it, that is how you send a transactional email in Magento. We can put the code from step 3 in side of a Cron, Observer, or in a custom model to send emails how ever we like. Here are a few use cases:

- Automate getting reviews and feedback from customers
- Abandon cart emails
- Customer assistance (ask if they need any help after browsing the store)
- And many more!
