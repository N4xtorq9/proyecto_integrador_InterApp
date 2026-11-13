import { requireAuth, getProducts, getExchanges } from "./storage.js";
import { mountShell, productCard, emptyState } from "./ui.js";
const user = requireAuth();
if (user) {
  mountShell();
  document.getElementById("welcomeName").textContent = user.name.split(" ")[0];
  const products = getProducts().filter((p) => p.userId === user.id);
  const exchanges = getExchanges().filter((x) => x.ownerIds.includes(user.id));
  document.getElementById("statProducts").textContent = products.length;
  document.getElementById("statActive").textContent = exchanges.filter(
    (x) => x.status === "en_curso",
  ).length;
  document.getElementById("statDone").textContent = exchanges.filter(
    (x) => x.status === "completado",
  ).length;
  document.getElementById("recentProducts").innerHTML = products.length
    ? products
        .slice(-3)
        .reverse()
        .map((p) => productCard(p, false))
        .join("")
    : emptyState("Aún no has publicado productos.");
  document.getElementById("recentExchanges").innerHTML = exchanges.length
    ? exchanges
        .slice(-3)
        .reverse()
        .map(
          (x) =>
            `<div class="col-md-6"><div class="exchange-card"><b>${x.productNames.map(escapeText).join(" ↔ ")}</b><p class="small text-secondary mb-0">${x.status === "completado" ? "Completado" : "En curso"}</p></div></div>`,
        )
        .join("")
    : emptyState("Todavía no tienes intercambios.");
}
function escapeText(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}
