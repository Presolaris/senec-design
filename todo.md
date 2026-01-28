
## Image Optimization
- [x] Analyze all images and their current sizes
- [x] Compress images and convert to WebP format (already optimally compressed)
- [x] Implement lazy loading for all images
- [x] Test performance improvements

## SEO Meta Tags Implementation
- [x] Create SEO component with meta tags
- [x] Add meta tags to index page
- [x] Add meta tags to Privat page
- [x] Add meta tags to Gewerbe page
- [x] Add meta tags to Service page
- [x] Add meta tags to Wallbox page
- [ ] Add meta tags to Ratgeber pages
- [x] Add meta tags to Referenzen page
- [x] Add meta tags to Kontakt page
- [x] Add structured data (JSON-LD) for LocalBusiness
- [x] Test meta tags with SEO tools

## Logo Integration
- [x] Download logo from leipzig-photovoltaik.de
- [x] Replace existing logo files
- [x] Update logo references in components (already using logo.webp)
- [x] Test logo display across all pages

## Fix pnpm Error
- [x] Remove conflicting React/tRPC template files (server/, client/, drizzle/)
- [x] Clean package.json from React/tRPC dependencies (already clean - Astro project)
- [x] Reinstall dependencies
- [x] Restart Astro dev server
- [x] Verify error is resolved

## Permanent pnpm TTY Fix
- [x] Create .npmrc with CI=true setting
- [x] Update package.json scripts with CI prefix
- [x] Test pnpm install with new configuration
- [x] Verify error no longer occurs

## Fix Deployment pnpm Error
- [x] Update .npmrc with additional pnpm settings
- [x] Added preinstall script to package.json (cannot create .env directly)
- [x] Verify configuration works for deployment

## Fix Build Error (fontkitten/jspdf)
- [x] Find component using jspdf
- [x] Make jspdf import client-side only (dynamic import)
- [x] Test build locally - SUCCESS

## Remove jspdf from dependencies (CDN approach)
- [x] Remove jspdf from package.json
- [x] Update SolarCalculator to load jspdf from CDN
- [x] Test build locally - SUCCESS (no fontkitten error)

## Fix fontkitten SSR issue (Astro dependency)
- [x] Add vite.ssr.external config to exclude fontkitten
- [x] Add vite.optimizeDeps.exclude for fontkitten
- [x] Test build locally - SUCCESS

## Sitemap & robots.txt
- [x] Create dynamic XML sitemap with all pages
- [x] Add lastmod dates and priority values
- [x] Create robots.txt with sitemap reference
- [x] Test sitemap generation - SUCCESS

## Remove SENEC Products from Wallbox Page
- [x] Replace SENEC wallbox models with alternative brands (Fronius, ABL, Easee)
- [x] Update product descriptions and features
- [x] Test page display

## Fix Deployment Configuration
- [x] Update package.json for static site deployment
- [x] Added Express server for static file serving
- [x] Test build output - SUCCESS
