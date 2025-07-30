/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell with the block name
  const headerRow = ['Columns (columns22)'];

  // Find the grid container that contains the columns
  const grid = element.querySelector('.flex.flex-col.gap-10, .flex.flex-col.gap-30, .flex.flex-col');
  const kpiColumns = grid ? Array.from(grid.children) : [];

  // Each KPI card is the .border-t-4 element inside the column
  const kpiCards = kpiColumns.map(col => {
    const card = col.querySelector('.border-t-4');
    return card ? card : col;
  });

  // The second row must be an array of the KPI cards (one for each column)
  const row2 = kpiCards;

  // Structure: header row (one column), second row (n columns)
  const tableCells = [headerRow, row2];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
