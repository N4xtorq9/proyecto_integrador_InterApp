import { currentUser, clearSession } from "./storage.js";
export function mountShell() {
  const user = currentUser();
  const header = document.getElementById("appHeader");
  if (header)
    header.innerHTML = `<nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top"><div class="container"><a class="navbar-brand d-inline-flex align-items-center" href="dashboard.html" aria-label="InterApp, inicio"><img src="../assets/images/logo-interapp.png" class="brand-logo" alt="InterApp - Intercambio Fácil"></a><button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Abrir menú"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="mainNav"><div class="navbar-nav ms-auto align-items-lg-center gap-lg-2"><a class="nav-link" href="dashboard.html">Dashboard</a><a class="nav-link" href="productos.html">Mis productos</a><a class="nav-link" href="intercambios.html">Intercambios</a><span class="navbar-text small text-secondary">${escapeHtml(user?.name ?? "")}</span><button class="btn btn-outline-secondary btn-sm ms-lg-2" id="logoutBtn">Cerrar sesión</button></div></div></div></nav>`;
  const footer = document.getElementById("appFooter");
  if (footer)
    footer.innerHTML = `<footer class="site-footer">InterApp · Proyecto integrador</footer>`;
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    clearSession();
    location.href = "login.html";
  });
}
export function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
export function statusBadge(status) {
  const map = {
    disponible: ["Disponible", "status-available"],
    pendiente: ["Pendiente", "status-pending"],
    realizado: ["Intercambio realizado", "status-done"],
  };
  const [label, cls] = map[status] ?? ["Desconocido", "status-unknown"];
  return `<span class="status-badge ${cls}">${label}</span>`;
}
export function productCard(p, actions = true) {
  return `<div class="col-sm-6 col-lg-4"><article class="product-card h-100"><div class="product-image-wrap">${p.image ? `<img class="product-image" src="${p.image}" alt="${escapeHtml(p.name)}">` : `<div class="image-placeholder" aria-hidden="true">📦</div>`}</div><div class="product-content"><div class="product-status">${statusBadge(p.status)}</div><h3 class="h5 product-title">${escapeHtml(p.name)}</h3><p class="product-description">${escapeHtml(p.description)}</p><div class="product-category">${escapeHtml(p.category)}</div>${actions ? `<div class="product-actions"><button class="btn btn-sm btn-outline-primary" data-edit="${p.id}" ${p.status !== "disponible" ? "disabled" : ""}>Editar</button><button class="btn btn-sm btn-outline-danger" data-delete="${p.id}" ${p.status === "pendiente" ? "disabled" : ""}>Eliminar</button><button class="btn btn-sm btn-primary ms-auto" data-exchange="${p.id}" ${p.status !== "disponible" ? "disabled" : ""}>Proponer</button></div>` : ""}</div></article></div>`;
}
export function emptyState(message) {
  return `<div class="empty-state">${escapeHtml(message)}</div>`;
}
