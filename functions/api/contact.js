import { contact } from '../../contact.js';

export function onRequestPost({ request, env }) {
  return contact(request, env);
}
