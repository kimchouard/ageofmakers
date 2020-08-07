import { useEffect } from 'react';

export default function AnalyticsProvider() {
  const initAnalytics = () => {
    setTimeout(() => {
      try {
        const gaPlugin = _gaq || [];
        gaPlugin.push(['_setAccount', 'UA-173708168-1']);
        gaPlugin.push(['_trackPageview']);
      }
      catch(err) {
        console.error('Error while initializing Google Analytics', err);
      };
    }, 5000);
  };

  useEffect(() => {
    (function() {
      var ga = document.createElement('script');
      ga.type = 'text/javascript';
      ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(ga, s);
      initAnalytics();
    })();
  }, []);

  return null;
}