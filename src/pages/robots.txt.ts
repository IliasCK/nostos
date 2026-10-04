import type { APIRoute } from 'astro';
import { isIndexable, robotsTxt, siteUrl } from '../lib/seo';

export const GET: APIRoute = () =>
  new Response(robotsTxt(isIndexable(process.env), siteUrl(process.env)), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
