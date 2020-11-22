importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js",
);

var urlsToCache = [
  { url: "/", revision: "1" },
  { url: "/nav.html", revision: "1" },
  { url: "/index.html", revision: "1" },
  { url: "/article.html", revision: "1" },
  { url: "/pages/team.html", revision: "1" },
  { url: "/pages/standing.html", revision: "1" },
  { url: "/pages/saved.html", revision: "1" },
  { url: "/css/materialize.min.css", revision: "1" },
  { url: "/js/materialize.min.js", revision: "1" },
  { url: "/js/nav.js", revision: "1" },
  { url: "/js/api.js", revision: "1" },
  { url: "/js/db.js", revision: "1" },
  { url: "/js/idb.js", revision: "1" },
  { url: "/manifest.json", revision: "1" },
  { url: "/img/default.png", revision: "1" },
  { url: "/img/icons/36x36.png", revision: "1" },
  { url: "/img/icons/48x48.png", revision: "1" },
  { url: "/img/icons/72x72.png", revision: "1" },
  { url: "/img/icons/96x96.png", revision: "1" },
  { url: "/img/icons/144x144.png", revision: "1" },
  { url: "/img/icons/192x192.png", revision: "1" },
  { url: "/img/icons/512x512.png", revision: "1" },
];

if (workbox) {
  workbox.precaching.precacheAndRoute(urlsToCache);

  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
      cacheName: "images-cache",
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    }),
  );

  workbox.routing.registerRoute(
    new RegExp("https://api.football-data.org/v2/"),
    workbox.strategies.staleWhileRevalidate(),
  );

  // Caching Google Fonts
  workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: "google-fonts-stylesheets",
    }),
  );
}

self.addEventListener("push", function (event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  var options = {
    body: body,
    icon: "img/icons/512x512.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options),
  );
});
