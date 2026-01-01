/* =========================================================
   EDIT THIS CONFIG to match the real campground details.
   Everything else updates automatically on the page.
========================================================= */

const CONFIG = {
  name: "Capers Christian Haven & RV Park",
  locationLine: "Cape Breton Island, Nova Scotia",
  email: "YOUR_EMAIL_HERE",       // e.g. "caperschristianhaven@example.com"
  phoneDisplay: "[PHONE NUMBER]",  // e.g. "(902) 555-0123"
  phoneTel: "+1XXXXXXXXXX",        // e.g. "+19025550123"

  addressHtml: `[STREET ADDRESS]<br>[TOWN/COMMUNITY], NS [POSTAL CODE]<br>Canada`,

  // Map coordinates (placeholder). Replace with real lat/lon when known.
  // Example: lat: 46.235, lon: -60.102
  map: {
    lat: 46.0000,
    lon: -60.0000,
    zoom: 13,
    // bboxDelta roughly controls how “zoomed” the embed feels; adjust if needed.
    bboxDelta: 0.03
  },

  // Optional operational details (placeholders)
  season: "[SEASON DATES PLACEHOLDER]",
  checkin: "[TIME]",
  checkout: "[TIME]",
  pets: "[POLICY]",
  quietHours: "[HOURS]",

  // Optional policy link
  privacyLink: "#", // put a real /privacy.html or section link later if desired

  // Short marketing copy (you can refine anytime)
  hero: {
    eyebrow: "A quiet campground for rest & refreshment",
    title: "Capers Christian Haven & RV Park",
    lead:
      "A small campground on Cape Breton Island — a place for Christians to relax, enjoy God’s creation, and find quiet time away."
  }
};


/* =========================================================
   Page wiring
========================================================= */

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.textContent = value;
}
function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) el.innerHTML = value;
}
function setHref(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.setAttribute("href", value);
}

function buildOsmEmbedUrl(lat, lon, zoom, bboxDelta) {
  // A simple bbox around the marker. Good enough for a campground map embed.
  const d = bboxDelta ?? 0.03;
  const left = lon - d;
  const right = lon + d;
  const top = lat + d;
  const bottom = lat - d;

  // OpenStreetMap embed supports marker and bbox.
  const bbox = `${left}%2C${bottom}%2C${right}%2C${top}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
}

function buildDirectionsUrl(lat, lon, placeName) {
  // Works well across platforms
  const q = encodeURIComponent(`${placeName} @ ${lat},${lon}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function init() {
  // Header/brand
  setText("campgroundName", CONFIG.name);
  setText("campgroundLocation", CONFIG.locationLine);

  // Hero
  setText("heroEyebrow", CONFIG.hero.eyebrow);
  setText("heroTitle", CONFIG.hero.title);
  setText("heroLead", CONFIG.hero.lead);

  // Quick info
  setText("season", CONFIG.season);
  setText("checkin", CONFIG.checkin);
  setText("checkout", CONFIG.checkout);
  setText("pets", CONFIG.pets);
  setText("quietHours", CONFIG.quietHours);

  // Contact links
  setHref("emailLink", `mailto:${CONFIG.email}`);
  setText("emailLink", CONFIG.email);

  setHref("phoneLink", `tel:${CONFIG.phoneTel}`);
  setText("phoneLink", CONFIG.phoneDisplay);

  setHref("callBtn", `tel:${CONFIG.phoneTel}`);

  // Book button (header)
  setHref("bookButton", `mailto:${CONFIG.email}?subject=${encodeURIComponent("Campground Inquiry / Availability")}`);

  // Address
  setHTML("addressLines", CONFIG.addressHtml);

  // Policies link
  setHref("privacyLink", CONFIG.privacyLink);

  // Map embed + directions
  const mapUrl = buildOsmEmbedUrl(CONFIG.map.lat, CONFIG.map.lon, CONFIG.map.zoom, CONFIG.map.bboxDelta);
  const mapEl = document.getElementById("mapEmbed");
  if (mapEl) mapEl.src = mapUrl;

  const directionsUrl = buildDirectionsUrl(CONFIG.map.lat, CONFIG.map.lon, CONFIG.name);
  setHref("directionsBtn", directionsUrl);

  // Contact form fallback: opens user mail app with pre-filled content
  const emailFallbackBtn = document.getElementById("emailFallbackBtn");
  if (emailFallbackBtn) {
    emailFallbackBtn.addEventListener("click", () => {
      const form = document.getElementById("contactForm");
      const name = form?.elements?.namedItem("name")?.value?.trim() || "";
      const email = form?.elements?.namedItem("email")?.value?.trim() || "";
      const message = form?.elements?.namedItem("message")?.value?.trim() || "";

      const subject = `Campground Inquiry - ${CONFIG.name}`;
      const body =
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}\n\n` +
        `---\nSent from the campground website contact form link.`;

      const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    });
  }

  // Footer year
  const y = new Date().getFullYear();
  setText("year", y.toString());

  // Structured data
  const structured = {
    "@context": "https://schema.org",
    "@type": "Campground",
    "name": CONFIG.name,
    "description": "A small, quiet campground on Cape Breton Island — a place for Christians to rest, refresh, and enjoy God’s creation.",
    "telephone": CONFIG.phoneTel,
    "email": CONFIG.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "[STREET ADDRESS]",
      "addressLocality": "[TOWN/COMMUNITY]",
      "addressRegion": "NS",
      "postalCode": "[POSTAL CODE]",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": CONFIG.map.lat,
      "longitude": CONFIG.map.lon
    },
    "url": "[WEBSITE URL PLACEHOLDER]"
  };

  const sd = document.getElementById("structuredData");
  if (sd) sd.textContent = JSON.stringify(structured, null, 2);
}

document.addEventListener("DOMContentLoaded", init);
