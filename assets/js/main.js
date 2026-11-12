// Mobilni meni
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("otvoren");
      toggle.setAttribute("aria-expanded", nav.classList.contains("otvoren"));
    });
  }

  // Godina u footeru
  var god = document.getElementById("godina");
  if (god) god.textContent = new Date().getFullYear();

  // Povratna adresa za forme (stranica "hvala")
  document.querySelectorAll("input[name=_next]").forEach(function (el) {
    el.value = new URL("hvala.html", window.location.href).href;
  });

  initKalkulator();
});

// ---------------- Kalkulator za pranje tepiha ----------------
// CENE: izmeni ovde ako se promene
var CENA_OSNOVNA = 190;     // din po m², kupac sam donosi tepih
var CENA_PREUZIMANJE = 220; // din po m², mi preuzimamo i vraćamo tepih

function broj(v) {
  var n = parseFloat(String(v).replace(",", ".").trim());
  return isNaN(n) || n < 0 ? 0 : n;
}

function formatDin(n) {
  return Math.round(n).toLocaleString("sr-RS") + " din";
}

function initKalkulator() {
  var kalk = document.getElementById("kalkulator");
  if (!kalk) return;

  var lista = kalk.querySelector(".tepisi-lista");
  var dodaj = kalk.querySelector(".dodaj-tepih");
  var preuzimanje = document.getElementById("preuzimanje");
  var iznos = document.getElementById("iznos");
  var detalji = document.getElementById("detalji");
  var skriveno = document.getElementById("obracun-polje");
  var brojac = 0;

  function noviTepih() {
    brojac++;
    var red = document.createElement("div");
    red.className = "tepih";
    red.innerHTML =
      '<div class="polje" style="margin:0"><label>Dužina (m)</label>' +
      '<input type="text" inputmode="decimal" class="duzina" placeholder="npr. 3"></div>' +
      '<div class="polje" style="margin:0"><label>Širina (m)</label>' +
      '<input type="text" inputmode="decimal" class="sirina" placeholder="npr. 2"></div>' +
      '<button type="button" class="ukloni" aria-label="Ukloni tepih">×</button>';
    lista.appendChild(red);
    red.querySelector(".ukloni").addEventListener("click", function () {
      if (lista.children.length > 1) { red.remove(); izracunaj(); }
    });
    red.querySelectorAll("input").forEach(function (i) { i.addEventListener("input", izracunaj); });
  }

  function izracunaj() {
    var ukupnoM2 = 0;
    var opis = [];
    lista.querySelectorAll(".tepih").forEach(function (red, i) {
      var d = broj(red.querySelector(".duzina").value);
      var s = broj(red.querySelector(".sirina").value);
      var m2 = d * s;
      if (m2 > 0) {
        ukupnoM2 += m2;
        opis.push("Tepih " + (i + 1) + ": " + d + " x " + s + " m = " + m2.toFixed(2) + " m²");
      }
    });
    var cena = preuzimanje.checked ? CENA_PREUZIMANJE : CENA_OSNOVNA;
    var ukupno = ukupnoM2 * cena;
    iznos.textContent = formatDin(ukupno);
    detalji.textContent = ukupnoM2.toFixed(2).replace(".", ",") + " m² × " + cena + " din/m²" +
      (preuzimanje.checked ? " (sa preuzimanjem i dostavom)" : " (bez preuzimanja)");
    if (skriveno) {
      skriveno.value = opis.join("; ") + (opis.length ? " | " : "") +
        "Ukupno: " + ukupnoM2.toFixed(2) + " m², " + formatDin(ukupno) +
        (preuzimanje.checked ? ", SA preuzimanjem" : ", BEZ preuzimanja");
    }
  }

  dodaj.addEventListener("click", function () { noviTepih(); izracunaj(); });
  preuzimanje.addEventListener("change", izracunaj);
  noviTepih();
  izracunaj();
}
