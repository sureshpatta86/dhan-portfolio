/**
 * Service worker for handling chunk loading errors
 */

// Skip waiting to activate the service worker immediately
self.skipWaiting();

// Claim control of all clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Handle fetch requests
self.addEventListener('fetch', (event) => {
  // Only handle requests for chunks
  if (event.request.url.includes('/_next/static/chunks/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If chunk loading fails, send a message to the client to reload
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: 'CHUNK_LOAD_ERROR',
                url: event.request.url,
              });
            });
          });
          
          // Return a fallback response
          return new Response(
            'console.error("Chunk loading failed for: ' + event.request.url + '"); window.location.reload();',
            {
              headers: {
                'Content-Type': 'application/javascript',
              },
            }
          );
        })
    );
  }
});
