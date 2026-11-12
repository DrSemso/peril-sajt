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

  initForme();

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
    red.querySelectorAll("input").forEach(function (i) {
      i.addEventListener("input", function () { i.classList.remove("greska"); izracunaj(); });
    });
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
    window.PERIL_OBRACUN = ukupnoM2 > 0
      ? opis.join("\n") + "\nUkupno: " + ukupnoM2.toFixed(2).replace(".", ",") + " m² = " + formatDin(ukupno) +
        "\nPreuzimanje na adresi: " + (preuzimanje.checked ? "DA (220 din/m²)" : "NE, donosim sam (190 din/m²)")
      : "";
  }

  dodaj.addEventListener("click", function () { noviTepih(); izracunaj(); });
  preuzimanje.addEventListener("change", izracunaj);
  noviTepih();
  izracunaj();
}

// ---------------- Slanje formi na telefon (WhatsApp ili SMS) ----------------
// Broj na koji stižu porudžbine i upiti (međunarodni format, bez +)
var BROJ_ZA_PORUKE = "381631951501";

function initForme() {
  document.querySelectorAll(".forma-poruka").forEach(function (forma) {
    var slika = forma.querySelector(".slika-polje");
    var slikaInfo = forma.querySelector(".slika-info");
    if (slika && slikaInfo) {
      slika.addEventListener("change", function () {
        if (slika.files.length) {
          slikaInfo.textContent = "Izabrana slika: " + slika.files[0].name +
            ". Priložite je u razgovoru odmah posle poruke (ikonica spajalice ili kamere).";
        }
      });
    }

    forma.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      forma.querySelectorAll("[required]").forEach(function (polje) {
        var prazno = !polje.value.trim();
        polje.classList.toggle("greska", prazno);
        if (prazno && ok) { polje.focus(); ok = false; }
      });
      if (!ok) return;
      if (forma.dataset.usluga === "Pranje tepiha" && !window.PERIL_OBRACUN) {
        var dim = forma.querySelector(".duzina");
        dim.classList.add("greska");
        dim.scrollIntoView({ block: "center" });
        dim.focus();
        return;
      }

      var usluga = forma.dataset.usluga;
      var naslov = usluga === "Pranje tepiha" ? "NOVA PORUDŽBINA – Pranje tepiha" : "NOVI UPIT – " + usluga;
      var linije = [naslov, ""];
      forma.querySelectorAll("[data-label]").forEach(function (polje) {
        linije.push(polje.dataset.label + ": " + polje.value.trim());
      });
      if (usluga === "Pranje tepiha" && window.PERIL_OBRACUN) {
        linije.push("", window.PERIL_OBRACUN);
      }
      if (slika && slika.files.length) linije.push("", "(Šaljem i sliku površine)");
      var tekst = encodeURIComponent(linije.join("\n"));

      var kanal = e.submitter ? e.submitter.value : "whatsapp";
      window.location.href = kanal === "sms"
        ? "sms:+" + BROJ_ZA_PORUKE + "?&body=" + tekst
        : "https://wa.me/" + BROJ_ZA_PORUKE + "?text=" + tekst;
    });
  });
}
