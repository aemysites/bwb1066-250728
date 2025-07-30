/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card data for each set (image card and text card)
  function extractCard(imageAnchor, textDiv) {
    // Get image element
    let imgDiv = imageAnchor.querySelector('.text-center');
    let img = imgDiv ? imgDiv.querySelector('img') : null;

    // Get text content (title, description)
    let textAnchor = textDiv.querySelector('a');
    let contentDiv = textAnchor ? textAnchor.querySelector('div') : null;
    let heading = contentDiv ? contentDiv.querySelector('h3') : null;
    let desc = contentDiv ? contentDiv.querySelector('div') : null;

    // Get CTA (learn more) - must be from the sibling flex container
    let btnContainer = textDiv.querySelector('.flex-row');
    let cta = null;
    if (btnContainer) {
      // Find the first <a> with non-empty text
      let btnLinks = Array.from(btnContainer.querySelectorAll('a'));
      for (let a of btnLinks) {
        if (a.textContent.trim()) {
          cta = a;
          break;
        }
      }
    }

    // Compose text cell
    const textChildren = [];
    if (heading) textChildren.push(heading);
    if (desc) textChildren.push(desc);
    if (cta) textChildren.push(cta);
    return [img, textChildren];
  }

  // Find the card pairs (image/text alternation)
  const grid = element.querySelector('.grid.grid-cols-12.gap-6');
  const cards = [];
  if (grid) {
    const children = Array.from(grid.children);
    // Pattern is: image <a>, text <div>, image <a>, text <div>, ...
    for (let i = 0; i < children.length; i += 2) {
      const imageAnchor = children[i];
      const textDiv = children[i + 1];
      if (imageAnchor && textDiv) {
        cards.push(extractCard(imageAnchor, textDiv));
      }
    }
  }

  // Table header exactly as required
  const cells = [
    ['Cards (cards44)'],
    ...cards
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
