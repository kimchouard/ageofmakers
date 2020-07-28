import { useEffect } from 'react';

export default function AnalyticsProvider() {
  const initAnalytics = () => {
    setTimeout(() => {
      const gaPlugin = _gaq || [];
      gaPlugin.push(['_setAccount', 'UA-173708168-1']);
      gaPlugin.push(['_trackPageview']);
    }, 2000);
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