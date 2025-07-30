/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards45)'];
  const rows = [];
  // Each card is a direct child div
  const cards = element.querySelectorAll(':scope > div');
  cards.forEach(card => {
    // Left cell: image from the .mb-4 container
    let image = null;
    const imgDiv = card.querySelector('.mb-4');
    if (imgDiv) {
      image = imgDiv.querySelector('img');
    }
    // Right cell: content
    const content = card.querySelector('.flex.flex-col.gap-6');
    const rightCellContent = [];
    // Title (strong)
    const titleEl = content && content.querySelector('.leading-7.text-xl');
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      rightCellContent.push(strong);
    }
    // Description
    const descEl = content && content.querySelector('.grow');
    if (descEl && descEl.textContent.trim()) {
      if (rightCellContent.length) rightCellContent.push(document.createElement('br'));
      rightCellContent.push(descEl.textContent.trim());
    }
    // CTA link (the overlay a)
    const linkEl = card.querySelector(':scope > a[href]');
    if (linkEl && linkEl.textContent.trim()) {
      if (rightCellContent.length) rightCellContent.push(document.createElement('br'));
      const a = document.createElement('a');
      a.href = linkEl.href;
      a.textContent = linkEl.textContent.trim();
      rightCellContent.push(a);
    }
    // Compose the row
    rows.push([
      image || '',
      rightCellContent.length === 1 ? rightCellContent[0] : rightCellContent
    ]);
  });
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
