const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwfgV_xT-3U-ZSfyH4aUqz-BkwK9lvnQKYbGZR0AGU7NSQ3G_BiPiVNx22A-Lr-y01P/exec";

const heroSlides = [
  {
    image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.35.jpeg",
    service: "Landscaping",
    title: "Professional property work with real project photos.",
    description: "Full-screen slideshow featuring real SMP projects from the img folder.",
  },
  {
    image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.35 (1).jpeg",
    service: "Landscaping",
    title: "Grounds maintenance done with professional equipment.",
    description: "Show clients the tools, finished spaces and site quality in one smooth auto-slider.",
  },
  {
    image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.34 (1).jpeg",
    service: "Landscaping",
    title: "Clean, neat outdoor spaces after the job is done.",
    description: "Real before-and-after landscaping results build trust quickly.",
  },
  {
    image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.23.jpeg",
    service: "Electrical",
    title: "Construction, repairs and installation support in one team.",
    description: "The slideshow can also highlight electrical and finishing work by SMP.",
  },
  {
    image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.22.jpeg",
    service: "Plumbing",
    title: "Practical repairs for pipes, fittings and site maintenance.",
    description: "Use the same hero to showcase maintenance jobs and utility work.",
  },
];

const galleryImages = [
  { image: "img/BeforeAfterGrass/Before.jpeg", service: "Landscaping", title: "Before grass cutting", description: "Outdoor area before landscaping." },
  { image: "img/BeforeAfterGrass/Aftre1.jpeg", service: "Landscaping", title: "After grass cutting", description: "Outdoor area after the service." },
  { image: "img/BeforeAfterGrass/After2.jpeg", service: "Landscaping", title: "After landscaping result 2", description: "Another finished landscaping result." },
  { image: "img/BeforeAfterGrass/After3.jpeg", service: "Landscaping", title: "After landscaping result 3", description: "Completed grounds maintenance work." },
  { image: "img/BeforeAfterPipe/Before.jpeg", service: "Plumbing", title: "Before pipe repair", description: "Pipe condition before repair." },
  { image: "img/BeforeAfterPipe/After.jpeg", service: "Plumbing", title: "After pipe repair", description: "Pipe repair completed." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.21.jpeg", service: "Electrical", title: "Electrical control work", description: "On-site electrical work in progress." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.22.jpeg", service: "Plumbing", title: "Utility and pipe support work", description: "Maintenance and pipe servicing." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.23.jpeg", service: "Electrical", title: "Wall channel and switch preparation", description: "Electrical routing before final finishing." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.24 (1).jpeg", service: "Electrical", title: "Cable installation inside wall channel", description: "Cable routing before closure." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.24.jpeg", service: "Electrical", title: "Finished switch point", description: "Electrical finish after the internal work." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.27.jpeg", service: "Electrical", title: "Plastered outlet finish", description: "Surface repaired and outlet finished." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.29.jpeg", service: "Electrical", title: "Wall socket completion", description: "Completed electrical finish." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.32 (1).jpeg", service: "Electrical", title: "Outlet installation in progress", description: "Socket and wall preparation work." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.32 (2).jpeg", service: "Electrical", title: "Vertical channel finishing", description: "Cable route with fresh finish work." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.32.jpeg", service: "Electrical", title: "Wall channel with switch point", description: "Prepared connection point on a finished wall." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.33 (1).jpeg", service: "Landscaping", title: "Grass-cutting equipment set", description: "Equipment used for landscaping work." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.33.jpeg", service: "Landscaping", title: "Grass-cutting mower", description: "Mower prepared for property maintenance." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.34.jpeg", service: "Landscaping", title: "Large site before clean-up", description: "Outdoor area ready for landscaping work." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.34 (1).jpeg", service: "Landscaping", title: "Finished landscaped courtyard", description: "Neat outdoor presentation after the work is done." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.34 (2).jpeg", service: "Landscaping", title: "Landscaped pathway edge", description: "Bed edging and cleaner walkway presentation." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.34 (3).jpeg", service: "Plumbing", title: "Bathroom plumbing repair", description: "Toilet-side plumbing maintenance." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.34 (4).jpeg", service: "Plumbing", title: "Sink plumbing repair", description: "Sink-side pipe and fitting work." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.35.jpeg", service: "Landscaping", title: "Brush cutter equipment lineup", description: "Heavy-duty tools for cutting and site cleanup." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.35 (1).jpeg", service: "Landscaping", title: "Lawn mower ready on-site", description: "Prepared mower for field and yard work." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.35 (2).jpeg", service: "Landscaping", title: "Open grounds before landscaping", description: "Outdoor area ready for cutting and clearing." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.35 (3).jpeg", service: "Landscaping", title: "Grass-cutting in progress", description: "Workers actively cutting and cleaning an outdoor site." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.37.jpeg", service: "Landscaping", title: "Garden border and planting", description: "Home garden presentation and finishing." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.38 (1).jpeg", service: "Renovations", title: "Room finishing work", description: "Interior surface preparation and finishing." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.38 (2).jpeg", service: "Renovations", title: "Wall finishing and plastering", description: "Interior renovation and wall treatment." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.38.jpeg", service: "Renovations", title: "Interior room repair", description: "Renovation support and surface restoration." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.39 (1).jpeg", service: "Construction", title: "Site groundwork and leveling", description: "Outdoor preparation and construction support work." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.39.jpeg", service: "Construction", title: "Brick and masonry support", description: "Structural outdoor work in progress." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.40 (1).jpeg", service: "Renovations", title: "Interior finishing detail", description: "Repair and finishing work for interior spaces." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.40.jpeg", service: "Construction", title: "General project support", description: "Construction and finishing support." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.42 (1).jpeg", service: "Construction", title: "Surface repair and finish", description: "Construction finishing detail from a site project." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.42 (2).jpeg", service: "Construction", title: "On-site workmanship", description: "Construction support image from the gallery." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.42 (3).jpeg", service: "Construction", title: "General site progress", description: "Project image from the slideshow folder." },
  { image: "img/SlideShow/WhatsApp Image 2026-06-02 at 10.33.42.jpeg", service: "Construction", title: "Construction project image", description: "General construction work from the supplied images." },
];

function asset(path) {
  return encodeURI(path);
}

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setStatus(statusElement, text, tone) {
  const tones = {
    neutral: "text-sm font-medium text-slate-500",
    success: "text-sm font-medium text-green-600",
    error: "text-sm font-medium text-red-600",
  };

  statusElement.textContent = text;
  statusElement.className = tones[tone] || tones.neutral;
}

async function parseAppsScriptResponse(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    if (text.includes("Script function not found: doPost")) {
      throw new Error("Apps Script deployment is missing doPost.");
    }

    if (text.includes("Sign in") || text.includes("Authorization") || text.includes("You need permission")) {
      throw new Error("Apps Script access is restricted. Change deployment access to Anyone and execute as Me.");
    }

    return { success: response.ok, message: text };
  }
}

async function submitToGoogleAppsScript(formType, form, statusElement) {
  setStatus(statusElement, "Submitting...", "neutral");

  try {
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formType,
        ...payload,
        submittedAt: new Date().toISOString(),
      }),
    });

    const result = await parseAppsScriptResponse(response);

    if (!response.ok || result.success === false) {
      throw new Error(result.message || "Submission failed.");
    }

    setStatus(
      statusElement,
      formType === "quote"
        ? "Quote request sent successfully."
        : "Contractor registration sent successfully.",
      "success"
    );
    form.reset();
  } catch (error) {
    setStatus(statusElement, error.message || "Submission failed. Please try again.", "error");
  }
}

function initQuoteForm() {
  const form = document.getElementById("quoteRequestForm");
  const statusElement = document.getElementById("quote-status");

  if (!form || !statusElement) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitToGoogleAppsScript("quote", form, statusElement);
  });
}

function initContractorForm() {
  const form = document.getElementById("contractorRegistrationForm");
  const statusElement = document.getElementById("contractor-status");

  if (!form || !statusElement) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitToGoogleAppsScript("contractor", form, statusElement);
  });
}

function initHomePage() {
  const heroSlidesContainer = document.getElementById("hero-slides");
  const heroDotsContainer = document.getElementById("hero-dots");
  const heroService = document.getElementById("hero-service");
  const heroTitle = document.getElementById("hero-title");
  const heroDescription = document.getElementById("hero-description");
  const galleryFilters = document.getElementById("gallery-filters");
  const galleryGrid = document.getElementById("gallery-grid");
  const imageModal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-image");
  const modalService = document.getElementById("modal-service");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const closeModalButton = document.getElementById("close-modal");

  if (!heroSlidesContainer || !heroDotsContainer || !galleryFilters || !galleryGrid) {
    return;
  }

  let activeSlideIndex = 0;
  let activeFilter = "All";

  function updateHeroContent(index) {
    const slide = heroSlides[index];
    heroService.textContent = slide.service;
    heroTitle.textContent = slide.title;
    heroDescription.textContent = slide.description;
  }

  function showSlide(index) {
    heroSlidesContainer.querySelectorAll(".hero-slide").forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === index);
    });

    heroDotsContainer.querySelectorAll(".hero-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });

    updateHeroContent(index);
  }

  function buildHeroSlides() {
    heroSlidesContainer.innerHTML = heroSlides
      .map(
        (slide, index) => `
          <div
            class="hero-slide absolute inset-0 bg-cover bg-center ${index === 0 ? "active" : ""}"
            style="background-image: url('${asset(slide.image)}')"
          ></div>
        `
      )
      .join("");

    heroDotsContainer.innerHTML = heroSlides
      .map(
        (_, index) => `
          <button
            type="button"
            data-slide-index="${index}"
            class="hero-dot h-3 w-3 rounded-full bg-white/40 ${index === 0 ? "active" : ""}"
            aria-label="Go to slide ${index + 1}"
          ></button>
        `
      )
      .join("");

    heroDotsContainer.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        activeSlideIndex = Number(button.dataset.slideIndex);
        showSlide(activeSlideIndex);
      });
    });

    updateHeroContent(0);
  }

  function startSlideshow() {
    setInterval(() => {
      activeSlideIndex = (activeSlideIndex + 1) % heroSlides.length;
      showSlide(activeSlideIndex);
    }, 4500);
  }

  function openModal(image) {
    modalImage.src = asset(image.image);
    modalImage.alt = image.title;
    modalService.textContent = image.service;
    modalTitle.textContent = image.title;
    modalDescription.textContent = image.description;
    imageModal.classList.remove("hidden");
    imageModal.classList.add("flex");
  }

  function closeModal() {
    imageModal.classList.add("hidden");
    imageModal.classList.remove("flex");
  }

  function renderGallery(filter) {
    const filteredImages = filter === "All"
      ? galleryImages
      : galleryImages.filter((image) => image.service === filter);

    galleryGrid.innerHTML = filteredImages
      .map((image) => {
        const originalIndex = galleryImages.findIndex(
          (entry) => entry.image === image.image && entry.title === image.title
        );

        return `
          <button
            type="button"
            class="gallery-thumb overflow-hidden rounded-[24px] border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            data-gallery-index="${originalIndex}"
          >
            <div class="overflow-hidden">
              <img src="${asset(image.image)}" alt="${escapeHtml(image.title)}" class="h-52 w-full object-cover sm:h-56 lg:h-60" />
            </div>
            <div class="p-4">
              <p class="text-[11px] font-bold uppercase tracking-[0.24em] text-green-700">${escapeHtml(image.service)}</p>
              <p class="mt-2 text-base font-black text-slate-900">${escapeHtml(image.title)}</p>
              <p class="mt-2 text-sm leading-6 text-slate-600">${escapeHtml(image.description)}</p>
            </div>
          </button>
        `;
      })
      .join("");

    galleryGrid.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        openModal(galleryImages[Number(button.dataset.galleryIndex)]);
      });
    });
  }

  function renderFilters() {
    const filters = ["All", ...new Set(galleryImages.map((image) => image.service))];

    galleryFilters.innerHTML = filters
      .map(
        (filter) => `
          <button
            type="button"
            data-filter="${filter}"
            class="gallery-filter rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-green-700 hover:text-green-700 ${filter === activeFilter ? "active border-green-700" : ""}"
          >
            ${filter}
          </button>
        `
      )
      .join("");

    galleryFilters.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;
        renderFilters();
        renderGallery(activeFilter);
      });
    });
  }

  document.getElementById("open-all-gallery")?.addEventListener("click", () => {
    activeFilter = "All";
    renderFilters();
    renderGallery(activeFilter);
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  closeModalButton?.addEventListener("click", closeModal);
  imageModal?.addEventListener("click", (event) => {
    if (event.target === imageModal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  buildHeroSlides();
  renderFilters();
  renderGallery(activeFilter);
  startSlideshow();
}

document.addEventListener("DOMContentLoaded", () => {
  initHomePage();
  initQuoteForm();
  initContractorForm();
});
