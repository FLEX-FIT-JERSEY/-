const designCards = document.querySelectorAll(".design-card");

const productModal = document.getElementById("productModal");
const closeProductModalButton = document.getElementById("closeProductModalButton");
const productViewType = document.getElementById("productViewType");
const productViewTitle = document.getElementById("productModalTitle");
const productViewDescription = document.getElementById("productViewDescription");
const productViewPrice = document.getElementById("productViewPrice");
const productViewImage = document.getElementById("productViewImage");
const openOrderButton = document.getElementById("openOrderButton");

const orderModal = document.getElementById("orderModal");
const closeModalButton = document.getElementById("closeModalButton");
const cancelStepOne = document.getElementById("cancelStepOne");
const nextStepButton = document.getElementById("nextStepButton");
const backStepButton = document.getElementById("backStepButton");

const customerStep = document.getElementById("customerStep");
const playerStep = document.getElementById("playerStep");
const stepOnePill = document.getElementById("stepOnePill");
const stepTwoPill = document.getElementById("stepTwoPill");

const modalTitle = document.getElementById("modalTitle");
const modalProductType = document.getElementById("modalProductType");
const modalPriceLabel = document.getElementById("modalPriceLabel");

const selectedProductInput = document.getElementById("selectedProductInput");
const selectedProductTypeInput = document.getElementById("selectedProductTypeInput");
const orderSummaryInput = document.getElementById("orderSummaryInput");

const quantityInput = document.getElementById("quantity");
const subtotalValue = document.getElementById("subtotalValue");
const totalValue = document.getElementById("totalValue");
const playerCounter = document.getElementById("playerCounter");
const playerFields = document.getElementById("playerFields");
const orderForm = document.getElementById("orderForm");

const customOrderForm = document.getElementById("customOrderForm");
const customOrderType = document.getElementById("customOrderType");
const customQuantityInput = document.getElementById("customQuantity");
const customSubtotalValue = document.getElementById("customSubtotalValue");
const customTotalValue = document.getElementById("customTotalValue");
const customPlayerCounter = document.getElementById("customPlayerCounter");
const customPlayerFields = document.getElementById("customPlayerFields");
const customOrderSummaryInput = document.getElementById("customOrderSummaryInput");

const requiredStepOneFields = [
  document.getElementById("customerName"),
  document.getElementById("customerEmail"),
  document.getElementById("customerPhone"),
  document.getElementById("customerAddress"),
  quantityInput
];

const PRICES = {
  shirt: 1000,
  kit: 1700,
  custom: 1000,
  delivery: 1000
};

let selectedProduct = {
  type: "shirt",
  title: "Shirt Design 1",
  price: 1000,
  image: "Add shirt image here",
  description: "A sharp cricket shirt layout with bold panel breaks, premium contrast, and full player personalization."
};

function clampQuantity(value) {
  if (Number.isNaN(value)) return 5;
  return Math.max(5, Math.min(50, value));
}

function formatCurrency(value) {
  return `Rs ${value.toLocaleString("en-PK")}`;
}

function readProductData(element) {
  return {
    type: element.dataset.productType,
    title: element.dataset.productTitle,
    price: Number(element.dataset.productPrice),
    image: element.dataset.productImage,
    description: element.dataset.productDescription
  };
}

function setBodyLock(locked) {
  document.body.style.overflow = locked ? "hidden" : "";
}

function openProductModal(card) {
  selectedProduct = readProductData(card);

  productViewType.textContent = selectedProduct.type === "kit" ? "Full Cricket Kit" : "Custom Cricket Shirt";
  productViewTitle.textContent = selectedProduct.title;
  productViewDescription.textContent = selectedProduct.description;
  productViewPrice.textContent = `${formatCurrency(selectedProduct.price)} each`;
  productViewImage.src = selectedProduct.image;
productViewImage.alt = selectedProduct.title;


  productModal.classList.remove("hidden");
  productModal.setAttribute("aria-hidden", "false");
  setBodyLock(true);
}

function closeProductModal() {
  productModal.classList.add("hidden");
  productModal.setAttribute("aria-hidden", "true");
  setBodyLock(false);
}

function buildPlayerFields(quantity, container, prefix) {
  container.innerHTML = "";

  for (let index = 1; index <= quantity; index += 1) {
    const row = document.createElement("div");
    row.className = "player-row";

    row.innerHTML = `
      <div class="player-index">Player ${index}</div>
      <label>
        Name
        <input type="text" name="${prefix}_player_${index}_name" required>
      </label>
      <label>
        Size
        <select name="${prefix}_player_${index}_size" required>
          <option value="">Select size</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>
      </label>
      <label>
        Number
        <input type="text" name="${prefix}_player_${index}_number" required>
      </label>
    `;

    container.appendChild(row);
  }
}

function updateModalTotals() {
  const quantity = clampQuantity(parseInt(quantityInput.value, 10));
  const subtotal = quantity * selectedProduct.price;
  const total = subtotal + PRICES.delivery;

  quantityInput.value = quantity;
  subtotalValue.textContent = formatCurrency(subtotal);
  totalValue.textContent = formatCurrency(total);
  playerCounter.textContent = `${quantity} players`;
  orderSummaryInput.value =
    `Product: ${selectedProduct.title}, Type: ${selectedProduct.type}, Quantity: ${quantity}, ` +
    `Unit price: ${selectedProduct.price}, Delivery: ${PRICES.delivery}, Total: ${total}`;

  buildPlayerFields(quantity, playerFields, selectedProduct.type);
}

function updateCustomTotals() {
  const quantity = clampQuantity(parseInt(customQuantityInput.value, 10));
  const unitPrice = customOrderType.value === "kit" ? PRICES.kit : PRICES.custom;
  const subtotal = quantity * unitPrice;
  const total = subtotal + PRICES.delivery;

  customQuantityInput.value = quantity;
  customSubtotalValue.textContent = formatCurrency(subtotal);
  customTotalValue.textContent = formatCurrency(total);
  customPlayerCounter.textContent = `${quantity} players`;
  customOrderSummaryInput.value =
    `Customized order type: ${customOrderType.value}, Quantity: ${quantity}, ` +
    `Unit price: ${unitPrice}, Delivery: ${PRICES.delivery}, Total: ${total}`;

  buildPlayerFields(quantity, customPlayerFields, "custom");
}

function showStep(stepNumber) {
  const showCustomer = stepNumber === 1;
  customerStep.classList.toggle("hidden", !showCustomer);
  playerStep.classList.toggle("hidden", showCustomer);
  stepOnePill.classList.toggle("active", showCustomer);
  stepTwoPill.classList.toggle("active", !showCustomer);
}

function openOrderModal() {
  selectedProductInput.value = selectedProduct.title;
  selectedProductTypeInput.value = selectedProduct.type;
  modalTitle.textContent = selectedProduct.title;
  modalProductType.textContent = selectedProduct.type === "kit" ? "Kit Order Form" : "Shirt Order Form";
  modalPriceLabel.textContent = `${formatCurrency(selectedProduct.price)} each`;

  showStep(1);
  updateModalTotals();
  orderModal.classList.remove("hidden");
  orderModal.setAttribute("aria-hidden", "false");
  productModal.classList.add("hidden");
  productModal.setAttribute("aria-hidden", "true");
  setBodyLock(true);
}

function closeOrderModal() {
  orderModal.classList.add("hidden");
  orderModal.setAttribute("aria-hidden", "true");
  setBodyLock(false);
}

function validateStepOne() {
  for (const field of requiredStepOneFields) {
    if (!field.value.trim()) {
      field.reportValidity();
      return false;
    }
  }

  const quantity = clampQuantity(parseInt(quantityInput.value, 10));

  if (quantity < 5 || quantity > 50) {
    window.alert("Quantity must be between 5 and 50.");
    return false;
  }

  return true;
}

function validateFormspreeLink(form) {
  if (form.action.includes("YOUR_FORMSPREE_LINK_HERE")) {
    window.alert("Please replace YOUR_FORMSPREE_LINK_HERE with your actual Formspree link first.");
    return false;
  }

  return true;
}

designCards.forEach((card) => {
  card.addEventListener("click", () => openProductModal(card));
});

closeProductModalButton.addEventListener("click", closeProductModal);
document.querySelectorAll("[data-close-product='true']").forEach((element) => {
  element.addEventListener("click", closeProductModal);
});

openOrderButton.addEventListener("click", openOrderModal);

closeModalButton.addEventListener("click", closeOrderModal);
cancelStepOne.addEventListener("click", closeOrderModal);
backStepButton.addEventListener("click", () => showStep(1));

document.querySelectorAll("[data-close-modal='true']").forEach((element) => {
  element.addEventListener("click", closeOrderModal);
});

nextStepButton.addEventListener("click", () => {
  if (!validateStepOne()) return;
  showStep(2);
});

quantityInput.addEventListener("input", updateModalTotals);
customQuantityInput.addEventListener("input", updateCustomTotals);
customOrderType.addEventListener("change", updateCustomTotals);

orderForm.addEventListener("submit", (event) => {
  const quantity = clampQuantity(parseInt(quantityInput.value, 10));

  if (quantity < 5 || quantity > 50) {
    event.preventDefault();
    window.alert("Quantity must be between 5 and 50.");
    return;
  }

  if (!validateFormspreeLink(orderForm)) {
    event.preventDefault();
  }
});

customOrderForm.addEventListener("submit", (event) => {
  const quantity = clampQuantity(parseInt(customQuantityInput.value, 10));

  if (quantity < 5 || quantity > 50) {
    event.preventDefault();
    window.alert("Quantity must be between 5 and 50.");
    return;
  }

  if (!validateFormspreeLink(customOrderForm)) {
    event.preventDefault();
  }
});

updateModalTotals();
updateCustomTotals();
