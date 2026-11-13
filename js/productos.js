import {
  requireAuth, getProducts, saveProducts, getExchanges, saveExchanges, uid
} from "./storage.js";
import { mountShell, productCard, emptyState } from "./ui.js";

const user = requireAuth();

if (user) {
  mountShell();

  const form = document.getElementById("productForm");
  const grid = document.getElementById("productsGrid");
  const productModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal"));
  const exchangeModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("exchangeModal"));
  const fileInput = document.getElementById("productImage");
  const preview = document.getElementById("imagePreview");
  const exchangeForm = document.getElementById("exchangeForm");

  let selectedImage = null;
  let existingImage = null;

  function render() {
    const query = document.getElementById("searchProducts").value.trim().toLowerCase();
    const filter = document.getElementById("filterStatus").value;
    const all = getProducts().filter(product => product.userId === user.id);
    const visible = all.filter(product =>
      (filter === "todos" || product.status === filter) &&
      `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query)
    );

    grid.innerHTML = visible.map(product => productCard(product)).join("");
    document.getElementById("emptyProducts").classList.toggle("d-none", visible.length > 0);
  }

  function resetProductForm() {
    form.reset();
    document.getElementById("productId").value = "";
    document.getElementById("modalTitle").textContent = "Ingresar producto";
    selectedImage = null;
    existingImage = null;
    preview.removeAttribute("src");
    preview.classList.add("d-none");
    document.getElementById("productError").textContent = "";
  }

  document.querySelector('[data-bs-target="#productModal"]')
    .addEventListener("click", resetProductForm);
  document.getElementById("searchProducts").addEventListener("input", render);
  document.getElementById("filterStatus").addEventListener("change", render);

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    selectedImage = null;
    document.getElementById("productError").textContent = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      document.getElementById("productError").textContent = "Formato no permitido. Usa JPG, PNG o WEBP.";
      fileInput.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      document.getElementById("productError").textContent = "La imagen debe pesar máximo 2 MB.";
      fileInput.value = "";
      return;
    }

    selectedImage = file;
    const objectUrl = URL.createObjectURL(file);
    preview.src = objectUrl;
    preview.classList.remove("d-none");
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const error = document.getElementById("productError");
    error.textContent = "";

    const id = document.getElementById("productId").value;
    const name = document.getElementById("productName").value.trim();
    const description = document.getElementById("productDescription").value.trim();
    const category = document.getElementById("productCategory").value;

    if (!name || !description || !category) {
      error.textContent = "Completa todos los campos obligatorios.";
      return;
    }
    if (!selectedImage && !existingImage) {
      error.textContent = "Selecciona una imagen para el producto.";
      return;
    }

    try {
      const image = selectedImage ? await toDataUrl(selectedImage) : existingImage;
      const products = getProducts();

      if (id) {
        const index = products.findIndex(product =>
          product.id === id && product.userId === user.id
        );
        if (index < 0) throw new Error("No encontramos el producto que deseas editar.");
        if (products[index].status !== "disponible") {
          throw new Error("Solo puedes editar productos disponibles.");
        }
        products[index] = { ...products[index], name, description, category, image };
      } else {
        products.push({
          id: uid(), userId: user.id, name, description, category, image,
          status: "disponible", createdAt: new Date().toISOString()
        });
      }

      saveProducts(products);
      productModal.hide();
      resetProductForm();
      render();
    } catch (exception) {
      error.textContent = exception.message || "No fue posible guardar el producto.";
    }
  });

  grid.addEventListener("click", event => {
    const editId = event.target.closest("[data-edit]")?.dataset.edit;
    const deleteId = event.target.closest("[data-delete]")?.dataset.delete;
    const exchangeId = event.target.closest("[data-exchange]")?.dataset.exchange;

    if (editId) {
      const product = getProducts().find(item => item.id === editId && item.userId === user.id);
      if (!product || product.status !== "disponible") {
        alert("Solo puedes editar productos disponibles.");
        return;
      }
      resetProductForm();
      document.getElementById("productId").value = product.id;
      document.getElementById("productName").value = product.name;
      document.getElementById("productDescription").value = product.description;
      document.getElementById("productCategory").value = product.category;
      existingImage = product.image;
      preview.src = product.image;
      preview.classList.remove("d-none");
      document.getElementById("modalTitle").textContent = "Editar producto";
      productModal.show();
      return;
    }

    if (deleteId) {
      const product = getProducts().find(item => item.id === deleteId && item.userId === user.id);
      if (!product) return;
      if (product.status === "pendiente") {
        alert("No puedes eliminar un producto que tiene un intercambio en curso.");
        return;
      }
      if (!confirm(`¿Eliminar el producto "${product.name}"?`)) return;
      saveProducts(getProducts().filter(item => !(item.id === deleteId && item.userId === user.id)));
      render();
      return;
    }

    if (exchangeId) {
      const product = getProducts().find(item =>
        item.id === exchangeId && item.userId === user.id && item.status === "disponible"
      );
      if (!product) {
        alert("Este producto ya no está disponible para proponer un intercambio.");
        return;
      }
      document.getElementById("offeredProductId").value = product.id;
      document.getElementById("offeredProductName").textContent = product.name;
      document.getElementById("wantedProductName").value = "";
      document.getElementById("exchangeNote").value = "";
      document.getElementById("exchangeError").textContent = "";
      exchangeModal.show();
    }
  });

  exchangeForm.addEventListener("submit", event => {
    event.preventDefault();
    const error = document.getElementById("exchangeError");
    error.textContent = "";

    const productId = document.getElementById("offeredProductId").value;
    const wantedName = document.getElementById("wantedProductName").value.trim();
    const note = document.getElementById("exchangeNote").value.trim();
    const products = getProducts();
    const offered = products.find(item =>
      item.id === productId && item.userId === user.id && item.status === "disponible"
    );

    if (!offered) {
      error.textContent = "El producto ofrecido ya no está disponible.";
      return;
    }
    if (!wantedName) {
      error.textContent = "Escribe el nombre del producto que deseas recibir.";
      return;
    }

    const exchanges = getExchanges();
    exchanges.push({
      id: uid(),
      ownerIds: [user.id],
      productIds: [offered.id],
      productNames: [offered.name, wantedName],
      wantedProductName: wantedName,
      note,
      status: "en_curso",
      createdAt: new Date().toISOString(),
      demo: true
    });
    saveExchanges(exchanges);

    const index = products.findIndex(item => item.id === offered.id);
    products[index] = { ...products[index], status: "pendiente" };
    saveProducts(products);

    exchangeModal.hide();
    exchangeForm.reset();
    render();
    alert("Tu propuesta quedó registrada en la sección Intercambios.");
  });

  render();
}

function toDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}
