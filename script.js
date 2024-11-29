const itemTable = document.getElementById('item-table').getElementsByTagName('tbody')[0];
const itemNameInput = document.getElementById('item-name');
const itemPriceInput = document.getElementById('item-price');
const addItemButton = document.getElementById('add-item');
const promotionPercentInput = document.getElementById('promotion-percent');
const totalAmountElement = document.getElementById('total-amount');
const printPDFButton = document.getElementById('print-pdf');

let items = [];

addItemButton.addEventListener('click', addItem);
itemTable.addEventListener('click', removeItem);
promotionPercentInput.addEventListener('input', updateTotal);
printPDFButton.addEventListener('click', printPDF);

function addItem() {
  const name = itemNameInput.value.trim();
  const price = parseFloat(itemPriceInput.value);

  if (name !== '' && !isNaN(price)) {
    const item = { name, price };
    items.push(item);
    renderItems();
    updateTotal();
    clearInputs();
  }
}

function removeItem(event) {
  if (event.target.classList.contains('remove-item')) {
    const index = parseInt(event.target.dataset.index);
    items.splice(index, 1);
    renderItems();
    updateTotal();
  }
}

function updateTotal() {
  const promotionPercent = parseFloat(promotionPercentInput.value);
  const subtotal = items.reduce((total, item) => total + item.price, 0);
  const discount = subtotal * (promotionPercent / 100);
  const total = subtotal - discount;
  totalAmountElement.textContent = total.toFixed(2);
}

function renderItems() {
  itemTable.innerHTML = '';
  items.forEach((item, index) => {
    const row = itemTable.insertRow();
    const nameCell = row.insertCell();
    const priceCell = row.insertCell();
    const actionCell = row.insertCell();

    nameCell.textContent = item.name;
    priceCell.textContent = '$' + item.price.toFixed(2);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-item');
    removeButton.dataset.index = index;
    actionCell.appendChild(removeButton);
  });
}

function clearInputs() {
  itemNameInput.value = '';
  itemPriceInput.value = '';
}

function printPDF() {
  const doc = new jsPDF();

  // Add content to the PDF
  doc.setFontSize(18);
  doc.text('Cost Calculator Receipt', 10, 10);

  doc.setFontSize(12);
  doc.text(`Promotion: ${promotionPercentInput.value}%`, 10, 20);

  // Add table headers
  doc.setFontSize(14);
  doc.text('Item', 10, 40);
  doc.text('Price', 100, 40);

  // Add table rows
  doc.setFontSize(12);
  let y = 50;
  items.forEach(item => {
    doc.text(item.name, 10, y);
    doc.text(`$${item.price.toFixed(2)}`, 100, y);
    y += 10;
  });

  // Add total amount
  doc.setFontSize(14);
  doc.text(`Total: $${totalAmountElement.textContent}`, 10, y + 10);

  // Save the PDF
  doc.save('receipt.pdf');
}