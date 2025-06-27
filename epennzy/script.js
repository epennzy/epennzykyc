
const sheetUrl = "https://api.sheetbest.com/sheets/f046c6f6-2a09-44f9-8195-23d42d4038aa";
let allData = [];
let asc = true;

document.addEventListener("DOMContentLoaded", () => {
  fetch(sheetUrl)
    .then(res => res.json())
    .then(data => {
      allData = data;
      renderJobs(data);
    });

  window.addEventListener("scroll", () => {
    const btn = document.getElementById("backToTop");
    btn.style.display = window.scrollY > 100 ? "block" : "none";
  });
});

function renderJobs(data) {
  const list = document.getElementById("jobList");
  list.innerHTML = "";
  data.forEach(job => {
    if (job.status.toLowerCase() !== "on") return;

    const card = document.createElement("div");
    card.className = "job-card";
    card.setAttribute("data-category", job.category.toLowerCase());
    card.setAttribute("data-pay", parseInt(job.pay) || 0);
    card.innerHTML = `
      <h2>${job.title}
        ${job.verified.toLowerCase() === "yes" ? '<span class="verified">Verified</span>' : ''}
      </h2>
      <p><span class="${job.status === 'on' ? 'text-green-500' : 'text-red-500'}">
        ${job.status === 'on' ? '✅ Aktif' : '❌ Nonaktif'}
      </span></p>
      <p class="text-sm">${job.description}</p>
      <p><strong>Bayaran:</strong> Rp${job.pay}</p>
      <p><em>Syarat:</em> ${job.syarat}</p>
      <div style="text-align: right; margin-top: 10px;">
        <button onclick='openModal(${JSON.stringify(job)})'
          class="bg-blue-500 text-white px-3 py-1 text-sm rounded">Detail</button>
        <a href="${job.link}" target="_blank"
          class="bg-green-500 text-white px-3 py-1 text-sm rounded ml-2">Apply</a>
      </div>
    `;
    list.appendChild(card);
  });
}

function filterJobs() {
    let hasVisible = false;
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const cards = document.querySelectorAll(".job-card");

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const cat = card.getAttribute("data-category");
    const matchKeyword = text.includes(keyword);
    const matchCategory = category === "all" || category === cat;
    card.style.display = matchKeyword && matchCategory ? "block" : "none";
  });
}

function sortByPay() {
  const list = document.getElementById("jobList");
  const cards = Array.from(list.children);
  cards.sort((a, b) => {
    const payA = parseInt(a.getAttribute("data-pay"));
    const payB = parseInt(b.getAttribute("data-pay"));
    return asc ? payA - payB : payB - payA;
  });
  asc = !asc;
  cards.forEach(card => list.appendChild(card));
}

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
}

function openModal(job) {
  const modal = document.getElementById("modal");
  const body = document.getElementById("modalBody");
  modal.classList.remove("hidden");
  body.innerHTML = `
    <h3 class="text-lg font-bold mb-2">${job.title}</h3>
    <p><strong>Bayaran:</strong> Rp${job.pay}</p>
    <p><strong>Kategori:</strong> ${job.category}</p>
    <p><strong>Status:</strong> ${job.status}</p>
    <p><strong>Syarat:</strong> ${job.syarat}</p>
    <p class="mt-2">${job.description}</p>
    <div class="mt-4 text-right">
      <a href="${job.link}" target="_blank"
        class="bg-green-600 text-white px-4 py-2 rounded-md">Apply via WhatsApp</a>
    </div>
  `;
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}


// === Fade-in on Scroll ===
document.addEventListener("DOMContentLoaded", () => {
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});

// Show/hide "no results" message
const noResults = document.getElementById("noResults");
if (noResults) {
    noResults.style.display = hasVisible ? "none" : "block";
}

function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}
function openDetail() {
  document.getElementById("detailModal").style.display = "flex";
}
function closeDetail() {
  document.getElementById("detailModal").style.display = "none";
}
