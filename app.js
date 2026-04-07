(function () {
  "use strict";

  const FARM_KEY = "souqFarm";
  const PRODUCTS_KEY = "souqProducts";
  const EDIT_INDEX_KEY = "souqEditProductIndex";
  const USERS_KEY = "souqUsers";
  const CURRENT_USER_KEY = "souqCurrentUser";

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

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function saveCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  function showMessage(errorElement, successElement, errorMsg, successMsg) {
    if (errorElement) {
      errorElement.textContent = errorMsg || "";
    }
    if (successElement) {
      successElement.textContent = successMsg || "";
    }
  }

  /* ---------- CREATE FARM PAGE ---------- */

  function initCreateFarmPage() {
    const form = document.getElementById("createFarmForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const farmNameEl = document.getElementById("farmName");
      const regionEl = document.getElementById("region");
      const priceEl = document.getElementById("farmPrice");
      const quantityEl = document.getElementById("farmQuantity");
      const descriptionEl = document.getElementById("farmDescription");

      if (!farmNameEl  !regionEl  !priceEl  !quantityEl  !descriptionEl) return;

      const farmName = farmNameEl.value.trim();
      const region = regionEl.value;
      const price = priceEl.value.trim();
      const quantity = quantityEl.value.trim();
      const description = descriptionEl.value.trim();
      const checkedTypes = document.querySelectorAll('input[name="dateType"]:checked');

      const errorBox = document.getElementById("farmError");
      const successBox = document.getElementById("farmSuccess");

      showMessage(errorBox, successBox, "", "");

      if (farmName === "") {
        showMessage(errorBox, successBox, "Please enter the farm name.", "");
        return;
      }

      if (region === "" || region === "Select Region") {
        showMessage(errorBox, successBox, "Please select a region.", "");
        return;
      }

      if (checkedTypes.length === 0) {
        showMessage(errorBox, successBox, "Please select at least one date type.", "");
        return;
      }

      if (price === ""  isNaN(Number(price))  Number(price) < 0) {
        showMessage(errorBox, successBox, "Price must be a valid number greater than or equal to 0.", "");
        return;
      }

      if (quantity === ""  isNaN(Number(quantity))  Number(quantity) < 0) {
        showMessage(errorBox, successBox, "Quantity must be a valid number greater than or equal to 0.", "");
        return;
      }

      if (description === "") {
        showMessage(errorBox, successBox, "Please enter the farm description.", "");
        return;
      }

      const farm = {
        farmName: farmName,
        region: region,
        dateTypes: Array.from(checkedTypes).map(function (item) {
          return item.value;
        }),
        price: Number(price),
        quantity: Number(quantity),
        description: description,
        verifiedStatus: "Pending",
        trustedBadge: false};

      saveFarm(farm);
      showMessage(errorBox, successBox, "", "Farm profile created successfully.");

      setTimeout(function () {
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

    const productNameEl = document.getElementById("productName");
    const dateTypeEl = document.getElementById("dateType");
    const priceEl = document.getElementById("price");
    const quantityEl = document.getElementById("quantity");
    const regionEl = document.getElementById("originRegion");
    const descriptionEl = document.getElementById("productDescription");

    if (
      !productNameEl ||
      !dateTypeEl ||
      !priceEl ||
      !quantityEl ||
      !regionEl ||
      !descriptionEl
    ) {
      return;
    }

    productNameEl.value = product.productName;
    dateTypeEl.value = product.dateType;
    priceEl.value = product.price;
    quantityEl.value = product.quantity;
    regionEl.value = product.region;
    descriptionEl.value = product.description;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const productName = productNameEl.value.trim();
      const dateType = dateTypeEl.value;
      const price = priceEl.value.trim();
      const quantity = quantityEl.value.trim();
      const region = regionEl.value;
      const description = descriptionEl.value.trim();

      showMessage(errorBox, successBox, "", "");

      if (productName === "") {
        showMessage(errorBox, successBox, "Please enter the product name.", "");
        return;
      }

      if (dateType === "" || dateType === "Select Date Type") {
        showMessage(errorBox, successBox, "Please select a date type.", "");
        return;
      }

      if (price === ""  isNaN(Number(price))  Number(price) < 0) {
        showMessage(errorBox, successBox, "Price must be a valid number greater than or equal to 0.", "");
        return;
      }

      if (quantity === ""  isNaN(Number(quantity))  Number(quantity) < 0) {
        showMessage(errorBox, successBox, "Quantity must be a valid number greater than or equal to 0.", "");
        return;
      }

      if (region === "" || region === "Select Region") {
        showMessage(errorBox, successBox, "Please select the origin region.", "");
        return;
      }

      if (description === "") {
        showMessage(errorBox, successBox, "Please enter the product description.", "");
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

      setTimeout(function () {
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
      productsSubtext.textContent = "Current products listed under " + farm.farmName + ".";
    }

    if (!productsTableBody) return;

    if (products.length === 0) {
      productsTableBody.innerHTML = '<tr><td colspan="5">No products added yet.</td></tr>';
      return;
    }

    productsTableBody.innerHTML = products
      .map(function (product, index) {
        return (
          "<tr>" +
            "<td>" + product.productName + "</td>" +
            "<td>" + product.dateType + "</td>" +
            "<td>" + product.price + " SAR</td>" +
            "<td>" + product.quantity + "</td>" +
            "<td>" +
              '<div class="table-actions">' +
                '<a class="mini-btn edit" href="editProduct.html" data-index="' + index + '">Edit</a>' +
                '<a class="mini-btn delete" href="#" data-delete-index="' + index + '">Delete</a>' +
              "</div>" +
            "</td>" +
          "</tr>"
        );
      })
      .join("");

    const editButtons = productsTableBody.querySelectorAll("[data-index]");
    editButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = Number(this.getAttribute("data-index"));
        setEditProductIndex(index);
      });
    });

    const deleteButtons = productsTableBody.querySelectorAll("[data-delete-index]");
    deleteButtons.forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const index = Number(this.getAttribute("data-delete-index"));
        deleteProduct(index);
      });
    });
  }

  /* ---------- DELETE PRODUCT ---------- */

  function deleteProduct(index) {
    const products = getProducts();
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    products.splice(index, 1);saveProducts(products);
    window.location.reload();
  }

  /* ---------- REGISTER PAGE ---------- */

  function initRegisterPage() {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    const fullName = document.getElementById("full-name");
    const email = document.getElementById("register-email");
    const password = document.getElementById("register-password");
    const confirmPassword = document.getElementById("confirm-password");
    const role = document.getElementById("register-role");
    const registerMessage = document.getElementById("registerMessage");

    if (!fullName  !email  !password  !confirmPassword  !registerMessage) return;

    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const fullNameValue = fullName.value.trim();
      const emailValue = email.value.trim();
      const passwordValue = password.value.trim();
      const confirmPasswordValue = confirmPassword.value.trim();
      const roleValue = role ? role.value : "Customer";

      registerMessage.textContent = "";
      registerMessage.className = "form-message";

      if (!fullNameValue  !emailValue  !passwordValue) {
        registerMessage.textContent = "Please fill in Full Name, Email, and Password.";
        registerMessage.classList.add("error-message");
        return;
      }

      const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;
      if (!emailPattern.test(emailValue)) {
        registerMessage.textContent = "Please enter a valid email format (example@domain.com).";
        registerMessage.classList.add("error-message");
        return;
      }

      if (passwordValue !== confirmPasswordValue) {
        registerMessage.textContent = "Passwords do not match.";
        registerMessage.classList.add("error-message");
        return;
      }

      const users = getUsers();
      const existingUser = users.find(function (user) {
        return user.email.toLowerCase() === emailValue.toLowerCase();
      });

      if (existingUser) {
        registerMessage.textContent = "This email is already registered.";
        registerMessage.classList.add("error-message");
        return;
      }

      const newUser = {
        fullName: fullNameValue,
        email: emailValue,
        password: passwordValue,
        role: roleValue
      };

      users.push(newUser);
      saveUsers(users);

      registerMessage.textContent = "Registration successful! You can now log in using the same email and password.";
      registerMessage.classList.add("success-message");

      registerForm.reset();

      setTimeout(function () {
        window.location.href = "login.html";
      }, 1500);
    });
  }

  /* ---------- LOGIN PAGE ---------- */

  function initLoginPage() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const messageBox = document.getElementById("loginMessage");

    if (!emailInput  !passwordInput  !messageBox) return;

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      messageBox.textContent = "";
      messageBox.className = "form-message";

      if (!email || !password) {
        messageBox.textContent = "Please enter email and password.";
        messageBox.classList.add("error-message");
        return;
      }

      const users = getUsers();

      const user = users.find(function (u) {
        return (
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
        );
      });

      if (!user) {
        messageBox.textContent = "Invalid email or password.";
        messageBox.classList.add("error-message");
        return;
      }

      messageBox.textContent = "Login successful!";
      messageBox.classList.add("success-message");

      saveCurrentUser(user);setTimeout(function () {
        window.location.href = "Farmerdashboard.html";
      }, 1000);
    });
  }

  /* ---------- LOGOUT ---------- */

  function logout() {
    clearCurrentUser();
    window.location.href = "login.html";
  }

  window.logout = logout;

  /* ---------- BACK BUTTON ---------- */

  function goBackSafe() {
    if (window.history.length > 1) {
      window.history.back();
    }
  }

  window.goBackSafe = goBackSafe;

  function setupBackButton() {
    const backBtn = document.querySelector(".back-btn");
    if (!backBtn) return;

    if (window.history.length <= 1) {
      backBtn.disabled = true;
      backBtn.style.opacity = "0.5";
      backBtn.style.cursor = "not-allowed";
    }
  }

  /* ---------- START ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    initCreateFarmPage();
    initEditProductPage();
    initFarmerDashboardPage();
    initRegisterPage();
    initLoginPage();
    setupBackButton();
  });
})();