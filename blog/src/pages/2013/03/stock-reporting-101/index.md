---
title: Stock reporting 101
date: "2013-03-29T12:00:00Z"
author: Ash Smith
description: "If your business doesn't utilise stock reports, you could be losing a huge amount of sales when you run low on stock. Every online business needs to know its stock."
layout: post
comments: true
permalink: /2013/03/stock-reporting-101/
category: "Ecommerce"
---
Today we're going to cover some basic stock reporting. If your business doesn't have basic stock reports in place, this guide is for you. I will tell you the three basic reports you need in place. We will be looking at a stock take report, a stock consumption report, and finally a run rate report on your stock.

First of all, you might wonder why we need these reports in place. Well, it's simple, if you run out of stock, you can't deliver those items to your customers in a timely manner, and you will lose sales. It's as simple as that. With these reports in place you will know what is out of stock, how quickly you sell items, and how often you need to re-order you items. Let's get stuck in shall we.

## 1) Stock Taking

If you use a fulfilment warehouse, they'll often let you know how much of each item you have in stock with them. However, if they don't, one way of figuring this number of is subtracting the stock you have sold and the stock you originally had.

If you have your own warehouse, or are running the business out of your home, a stock take is in order. You'll need to manually count exactly how much of everything you have. If you are a small business and don't have a large stock range, don't bother with fancy stock control systems as they can over-complicate a simple task. Simply open a spreadsheet and log everything. If you are running a larger warehouse, stock control systems will save you a lot of time. We'll cover stock control systems another time though.

After you have done your basic stock take, we now know how much of each item we have in stock. Awesome! Now let's go ahead and find out how much we've sold!

## 2) Stock Consumption

[Products Ordered Report Path](./products-ordered-path.png)

You absolutely must know how much you're selling, and over what time period. Without this you will hit stock shortages on a regular basis, which is a nightmare if your priority is bringing in sales.  
Magento has an in-built report which can tell you how many of each item you have sold, it's called the Products Ordered report. This is located here: `Reports > Products > Products Ordered`

Below you can see the response from running the report over a 1 month period

[Products Ordered Report](./products-ordered-report.png)

## 3) Stock Run Rate

This report is known as a run rate report, it's important this report is by no means accurate, it is a predication on how much you sell. I have created a demo run rate using Google Drive Spreadsheets, you can view it here [Run Rate Report Example (Google Doc)][1]

The run rate report below is a very simple one, and not all that intelligent but it gets the point across. It is based on how much stock you consume for each item over six month, it then turns that value into the number of weeks before you will run out. By adding basis formatting rules we can see when we're in the clear with our stock (in green), when we're running close to needing to reorder (in amber), and finally when we're close to running out (in red).

We don't take seasonal variation into account, however if we have last years data, we could use that instead of the past six months.

[Run Rate Report Example](./run-rate-report-example.png)

## Finishing up on stock reporting

Great! Now we have complete control of our stock. It's always possible you will run out of stock, but with these basic reports in place we can minimise that period of time, and maximise sales and it's now one less thing to lose sleep over!

I'd advise doing regular stock takes, as with everything, stock does get damaged or goes missing. By running regular stock takes you can see when this happens.

It's worth mentioning there are more stock reports, such as best selling products, or broken / returned products. These will only further improve your stock management and I'd advise to get the basics down first, then move onto these more advanced reports.

If you liked this article, please share it, or if you have any thoughts or ideas please don't hesitate to post a comment or mention me on Twitter, I'm [@ashsmithco][2] or you can catch me on [@Meteorify][3]

 [1]: https://docs.google.com/spreadsheet/ccc?key=0Avfse7QA0hDtdHdZbHZkQURlTTFmUmdZRms3QU42THc&usp=sharing
 [2]: http://www.twitter.com/
 [3]: http://twitter.com/Meteorify
