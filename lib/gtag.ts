export const GA_TRACKING_ID = 'G-XBZHT21955';

export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
