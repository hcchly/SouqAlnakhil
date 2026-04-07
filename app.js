const FARM_KEY = "souqFarm";
const PRODUCTS_KEY = "souqProducts";
const EDIT_INDEX_KEY = "souqEditProductIndex";

/* ---------- STORAGE ---------- */

function getFarm() {
  return JSON.parse(localStorage.getItem(FARM_KEY)) || null;
}

function saveFarm(farm) {
  localStorage.setItem(FARM_KEY, JSON.stringify(farm));
}

function getProducts() {
  return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function setEditProductIndex(index) {
  localStorage.setItem(EDIT_INDEX_KEY, String(index));
}

function getEditProductIndex() {
  const index = localStorage.getItem(EDIT_INDEX_KEY);
  return index === null ? null : Number(index);
}

function clearEditProductIndex() {
  localStorage.removeItem(EDIT_INDEX_KEY);
}

function showMessage(errorElement, successElement, errorMsg = "", successMsg = "") {
  if (errorElement) errorElement.textContent = errorMsg;
  if (successElement) successElement.textContent = successMsg;
}

/* ---------- CREATE FARM PAGE ---------- */

function initCreateFarmPage() {
  const form = document.getElementById("createFarmForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const farmName = document.getElementById("farmName").value.trim();
    const region = document.getElementById("region").value;
    const price = document.getElementById("farmPrice").value.trim();
    const quantity = document.getElementById("farmQuantity").value.trim();
    const description = document.getElementById("farmDescription").value.trim();
    const checkedTypes = document.querySelectorAll('input[name="dateType"]:checked');

    const errorBox = document.getElementById("farmError");
    const successBox = document.getElementById("farmSuccess");

    showMessage(errorBox, successBox);

    if (farmName === "") {
      showMessage(errorBox, successBox, "Please enter the farm name.");
      return;
    }

    if (region === "" || region === "Select Region") {
      showMessage(errorBox, successBox, "Please select a region.");
      return;
    }

    if (checkedTypes.length === 0) {
      showMessage(errorBox, successBox, "Please select at least one date type.");
      return;
    }

    if (price === "" || isNaN(Number(price)) || Number(price) < 0) {
      showMessage(errorBox, successBox, "Price must be a valid number greater than or equal to 0.");
      return;
    }

    if (quantity === "" || isNaN(Number(quantity)) || Number(quantity) < 0) {
      showMessage(errorBox, successBox, "Quantity must be a valid number greater than or equal to 0.");
      return;
    }

    if (description === "") {
      showMessage(errorBox, successBox, "Please enter the farm description.");
      return;
    }

    const farm = {
      farmName: farmName,
      region: region,
      dateTypes: Array.from(checkedTypes).map(item => item.value),
      price: Number(price),
      quantity: Number(quantity),
      description: description,
      verifiedStatus: "Pending",
      trustedBadge: false
    };

    saveFarm(farm);
    showMessage(errorBox, successBox, "", "Farm profile created successfully.");

    setTimeout(() => {
      window.location.href = "Farmerdashboard.html";
    }, 700);
  });
}

/* ---------- EDIT PRODUCT PAGE ---------- */

function initEditProductPage() {
  const form = document.getElementById("editProductForm");
  if (!form) return;

  const products = getProducts();
  const editIndex = getEditProductIndex();

  const errorBox = document.getElementById("productError");
  const successBox = document.getElementById("productSuccess");

  if (editIndex === null || !products[editIndex]) {
    alert("Please select a product from the dashboard first.");
    window.location.href = "Farmerdashboard.html";
    return;
  }

  const product = products[editIndex];

  document.getElementById("productName").value = product.productName;
  document.getElementById("dateType").value = product.dateType;
  document.getElementById("price").value = product.price;
  document.getElementById("quantity").value = product.quantity;
  document.getElementById("originRegion").value = product.region;
  document.getElementById("productDescription").value = product.description;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const productName = document.getElementById("productName").value.trim();
    const dateType = document.getElementById("dateType").value;
    const price = document.getElementById("price").value.trim();
    const quantity = document.getElementById("quantity").value.trim();
    const region = document.getElementById("originRegion").value;
    const description = document.getElementById("productDescription").value.trim();

    showMessage(errorBox, successBox);

    if (productName === "") {
      showMessage(errorBox, successBox, "Please enter the product name.");
      return;
    }

    if (dateType === "" || dateType === "Select Date Type") {
      showMessage(errorBox, successBox, "Please select a date type.");
      return;
    }

    if (price === "" || isNaN(Number(price)) || Number(price) < 0) {
      showMessage(errorBox, successBox, "Price must be a valid number greater than or equal to 0.");
      return;
    }

    if (quantity === "" || isNaN(Number(quantity)) || Number(quantity) < 0) {
      showMessage(errorBox, successBox, "Quantity must be a valid number greater than or equal to 0.");
      return;
    }

    if (region === "" || region === "Select Region") {
      showMessage(errorBox, successBox, "Please select the origin region.");
      return;
    }

    if (description === "") {
      showMessage(errorBox, successBox, "Please enter the product description.");
      return;
    }

    products[editIndex] = {
      ...products[editIndex],
      productName: productName,
      dateType: dateType,
      price: Number(price),
      quantity: Number(quantity),
      region: region,
      description: description
    };

    saveProducts(products);
    showMessage(errorBox, successBox, "", "Product updated successfully.");

    setTimeout(() => {
      clearEditProductIndex();
      window.location.href = "Farmerdashboard.html";
    }, 700);
  });
}

/* ---------- DASHBOARD PAGE ---------- */

function initFarmerDashboardPage() {
  const beforeFarmSection = document.getElementById("beforeFarmSection");
  const afterFarmSection = document.getElementById("afterFarmSection");
  const farmStatsSection = document.getElementById("farmStatsSection");
  const farmProfileSection = document.getElementById("farmProfileSection");
  const productsSection = document.getElementById("productsSection");
  const productsTableBody = document.getElementById("dashboardProductsBody");
  const productsSubtext = document.getElementById("productsSubtext");

  if (!beforeFarmSection && !afterFarmSection && !farmStatsSection && !farmProfileSection && !productsSection) {
    return;
  }

  const farm = getFarm();
  const products = getProducts();

  if (!farm) {
    if (beforeFarmSection) beforeFarmSection.style.display = "block";
    if (afterFarmSection) afterFarmSection.style.display = "none";
    if (farmStatsSection) farmStatsSection.style.display = "none";
    if (farmProfileSection) farmProfileSection.style.display = "none";
    if (productsSection) productsSection.style.display = "none";
    return;
  }

  if (beforeFarmSection) beforeFarmSection.style.display = "none";
  if (afterFarmSection) afterFarmSection.style.display = "block";
  if (farmStatsSection) farmStatsSection.style.display = "grid";
  if (farmProfileSection) farmProfileSection.style.display = "block";
  if (productsSection) productsSection.style.display = "block";

  const totalProducts = document.getElementById("totalProducts");
  const dashboardFarmRegion = document.getElementById("dashboardFarmRegion");
  const dashboardFarmStatus = document.getElementById("dashboardFarmStatus");

  const dashboardFarmName = document.getElementById("dashboardFarmName");
  const dashboardFarmRegionText = document.getElementById("dashboardFarmRegionText");
  const dashboardFarmDateTypes = document.getElementById("dashboardFarmDateTypes");
  const dashboardFarmDescription = document.getElementById("dashboardFarmDescription");

  if (totalProducts) totalProducts.textContent = products.length;
  if (dashboardFarmRegion) dashboardFarmRegion.textContent = farm.region;
  if (dashboardFarmStatus) dashboardFarmStatus.textContent = farm.verifiedStatus;

  if (dashboardFarmName) dashboardFarmName.textContent = farm.farmName;
  if (dashboardFarmRegionText) dashboardFarmRegionText.textContent = farm.region;
  if (dashboardFarmDateTypes) dashboardFarmDateTypes.textContent = farm.dateTypes.join(", ");
  if (dashboardFarmDescription) dashboardFarmDescription.textContent = farm.description;

  if (productsSubtext) {
    productsSubtext.textContent = `Current products listed under ${farm.farmName}.`;
  }

  if (productsTableBody) {
    if (products.length === 0) {
      productsTableBody.innerHTML = `
        <tr>
          <td colspan="5">No products added yet.</td>
        </tr>
      `;
    } else {
      productsTableBody.innerHTML = products.map((product, index) => `
        <tr>
          <td>${product.productName}</td>
          <td>${product.dateType}</td>
          <td>${product.price} SAR</td>
          <td>${product.quantity}</td>
          <td>
            <div class="table-actions">
              <a class="mini-btn edit" href="editProduct.html" data-index="${index}">Edit</a>
              <a class="mini-btn delete" href="#" data-delete-index="${index}">Delete</a>
            </div>
          </td>
        </tr>
      `).join("");

      const editButtons = productsTableBody.querySelectorAll("[data-index]");
      editButtons.forEach(button => {
        button.addEventListener("click", function () {
          const index = Number(this.getAttribute("data-index"));
          setEditProductIndex(index);
        });
      });

      const deleteButtons = productsTableBody.querySelectorAll("[data-delete-index]");
      deleteButtons.forEach(button => {
        button.addEventListener("click", function (e) {
          e.preventDefault();
          const index = Number(this.getAttribute("data-delete-index"));
          deleteProduct(index);
        });
      });
    }
  }
}

/* ---------- DELETE PRODUCT ---------- */

function deleteProduct(index) {
  const products = getProducts();
  const confirmed = confirm("Are you sure you want to delete this product?");

  if (!confirmed) return;

  products.splice(index, 1);
  saveProducts(products);
  window.location.reload();
}

/* ---------- START ---------- */

document.addEventListener("DOMContentLoaded", function () {
  initCreateFarmPage();
  initEditProductPage();
  initFarmerDashboardPage();
});

function goBackSafe() {
  if (window.history.length > 1) {
    window.history.back();
  }
}

function setupBackButton() {
  const backBtn = document.querySelector(".back-btn");
  if (!backBtn) return;

  if (window.history.length <= 1) {
    backBtn.disabled = true;
    backBtn.style.opacity = "0.5";
    backBtn.style.cursor = "not-allowed";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initCreateFarmPage();
  initEditProductPage();
  initFarmerDashboardPage();
  setupBackButton();
});