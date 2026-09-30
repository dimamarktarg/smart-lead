export function onRequestGet({ request }) {
  return Response.json({ country: request.cf?.country || null }, {
    headers: { 'Cache-Control': 'private, no-store' }
  });
}
