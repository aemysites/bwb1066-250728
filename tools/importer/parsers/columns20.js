/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // Left: bio and LinkedIn
  const leftCol = columns[0];
  const bio = leftCol.querySelector('.richtext');
  const linkedinBtn = leftCol.querySelector('a[href*="linkedin.com"]');
  const leftContent = [];
  if (bio) leftContent.push(bio);
  if (linkedinBtn) leftContent.push(linkedinBtn);

  // Right: image
  const rightCol = columns[1];
  const img = rightCol.querySelector('img');
  const rightContent = [];
  if (img) rightContent.push(img);

  // Ensure header row is a single column, then content row is two columns
  const cells = [
    ['Columns (columns20)'],
    [leftContent, rightContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
