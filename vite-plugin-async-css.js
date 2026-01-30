// Vite Plugin to make CSS non-render-blocking
export default function asyncCssPlugin() {
  return {
    name: 'async-css',
    enforce: 'post',
    transformIndexHtml(html) {
      // Transform all stylesheet links to load asynchronously
      return html.replace(
        /<link\s+rel="stylesheet"\s+href="([^"]+)"/g,
        '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'"'
      );
    },
  };
}
