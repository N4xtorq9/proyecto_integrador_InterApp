import {
  requireAuth, getExchanges, saveExchanges, getProducts, saveProducts
} from "./storage.js";
import { mountShell, emptyState, escapeHtml } from "./ui.js";

const user = requireAuth();

if (user) {
  mountShell();

  function card(exchange) {
    const completed = exchange.status === "completado";
    const names = (exchange.productNames || []).map(escapeHtml).join(" ↔ ");
    const note = exchange.note
      ? `<p class="small text-secondary mb-3">${escapeHtml(exchange.note)}</p>`
      : "";

    return `<div class="col-lg-6">
      <article class="exchange-card h-100">
        <div class="d-flex justify-content-between gap-2">
          <span class="small text-secondary">${new Date(exchange.createdAt).toLocaleDateString("es-CO")}</span>
          <span class="status-badge ${completed ? "status-done" : "status-pending"}">
            ${completed ? "Completado" : "En curso"}
          </span>
        </div>
        <h2 class="h5 mt-3">${names}</h2>
        ${note}
        <p class="text-secondary small">${exchange.demo ? "Propuesta local de demostración" : "Intercambio"}</p>
        ${completed
          ? `<button class="btn btn-sm btn-outline-danger" data-delete-completed="${exchange.id}">Eliminar producto e historial</button>`
          : `<button class="btn btn-sm btn-primary" data-complete="${exchange.id}">Marcar como completado</button>`
        }
      </article>
    </div>`;
  }

  function render() {
    const items = getExchanges().filter(exchange =>
      Array.isArray(exchange.ownerIds) && exchange.ownerIds.includes(user.id)
    );
    const active = items.filter(exchange => exchange.status === "en_curso");
    const completed = items.filter(exchange => exchange.status === "completado");

    document.getElementById("activeCount").textContent = active.length;
    document.getElementById("doneCount").textContent = completed.length;
    document.getElementById("activeExchanges").innerHTML = active.length
      ? active.map(card).join("")
      : emptyState("No tienes intercambios en curso.");
    document.getElementById("doneExchanges").innerHTML = completed.length
      ? completed.map(card).join("")
      : emptyState("Todavía no has completado intercambios.");
  }

  document.addEventListener("click", event => {
    const completeId = event.target.closest("[data-complete]")?.dataset.complete;
    const deleteId = event.target.closest("[data-delete-completed]")?.dataset.deleteCompleted;

    if (completeId) {
      if (!confirm("¿Confirmas que el intercambio se completó?")) return;

      const exchanges = getExchanges();
      const exchange = exchanges.find(item =>
        item.id === completeId &&
        item.ownerIds?.includes(user.id) &&
        item.status === "en_curso"
      );
      if (!exchange) {
        alert("No encontramos el intercambio o ya fue actualizado.");
        render();
        return;
      }

      exchange.status = "completado";
      exchange.completedAt = new Date().toISOString();
      saveExchanges(exchanges);

      const products = getProducts();
      (exchange.productIds || []).forEach(productId => {
        const product = products.find(item => item.id === productId && item.userId === user.id);
        if (product) product.status = "realizado";
      });
      saveProducts(products);
      render();
      return;
    }

    if (deleteId) {
      const exchanges = getExchanges();
      const exchange = exchanges.find(item =>
        item.id === deleteId &&
        item.ownerIds?.includes(user.id) &&
        item.status === "completado"
      );
      if (!exchange) {
        alert("Solo puedes eliminar intercambios completados.");
        render();
        return;
      }

      const productNames = (exchange.productNames || []).join(" y ");
      if (!confirm(`¿Eliminar "${productNames}" de tus productos y borrar este registro del historial? Esta acción no se puede deshacer.`)) return;

      const ownedProductIds = new Set(exchange.productIds || []);
      saveProducts(getProducts().filter(product =>
        !(product.userId === user.id && ownedProductIds.has(product.id))
      ));
      saveExchanges(exchanges.filter(item => item.id !== deleteId));
      render();
    }
  });

  render();
}
