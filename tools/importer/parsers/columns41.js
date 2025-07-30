/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main flex container with the two columns
  const rootDiv = element.querySelector('div > div > div.flex');
  if (!rootDiv) return;

  // Get both columns, text and image
  const columns = rootDiv.children;
  if (columns.length < 2) return;

  // Text column: headline area + bulleted lists
  const textCol = columns[0];
  // Use a div to hold all relevant text elements, preserving semantic structure and order
  const textCell = document.createElement('div');
  // Headline area
  const headline = textCol.querySelector('.headline');
  if (headline) textCell.appendChild(headline);
  // Bulleted lists and description
  const richtext = textCol.querySelector('.richtext');
  if (richtext) textCell.appendChild(richtext);

  // Image column: look for the img element
  const imgCol = columns[1];
  let imgCell = document.createElement('div');
  const img = imgCol.querySelector('img');
  if (img) imgCell = img;

  // Build the table rows
  const headerRow = ['Columns (columns41)'];
  const contentRow = [textCell, imgCell];
  const cells = [headerRow, contentRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
