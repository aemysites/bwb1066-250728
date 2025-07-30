/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Video'];

  // Find the video player main content block
  // The relevant content is the entire .video-player container (contains player, overlay, text)
  const playerContainer = element.querySelector('.video-player');

  // Will gather content: any images, non-empty text, and the video link
  const cellContent = [];

  if (playerContainer) {
    // Gather all non-empty text within the player
    const textNodes = [];
    playerContainer.querySelectorAll('*').forEach((node) => {
      for (const child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = child.textContent.trim();
          textNodes.push(span);
        }
      }
    });
    if (textNodes.length) {
      cellContent.push(...textNodes);
    }

    // Add images/poster if any
    const img = playerContainer.querySelector('img');
    if (img) {
      cellContent.push(img);
    }

    // Add the video link from the iframe
    const iframe = playerContainer.querySelector('iframe[src]');
    if (iframe) {
      let src = iframe.getAttribute('src');
      let cleanHref = src;
      // Vimeo conversion
      if (src.startsWith('https://player.vimeo.com/video/')) {
        const match = src.match(/https:\/\/player.vimeo.com\/video\/(\d+)/);
        if (match) {
          cleanHref = `https://vimeo.com/${match[1]}`;
        }
      }
      // YouTube conversion
      if (src.startsWith('https://www.youtube.com/embed/')) {
        const match = src.match(/https:\/\/www.youtube.com\/embed\/([\w-]+)/);
        if (match) {
          cleanHref = `https://www.youtube.com/watch?v=${match[1]}`;
        }
      }
      const link = document.createElement('a');
      link.href = cleanHref;
      link.textContent = cleanHref;
      cellContent.push(link);
    }
  } else {
    // Fallback: gather all text from the element if structure is different
    const allText = element.textContent.trim();
    if (allText) {
      const span = document.createElement('span');
      span.textContent = allText;
      cellContent.push(span);
    }
  }

  // Ensure at least something is present
  if (cellContent.length === 0) {
    cellContent.push('');
  }

  const block = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent]
  ], document);

  element.replaceWith(block);
}
