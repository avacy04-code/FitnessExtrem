document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const header = document.getElementById("siteHeader");
  const revealElements = document.querySelectorAll(".reveal");
  const statNumbers = document.querySelectorAll(".stat-number");
  const statsSection = document.getElementById("resultados");

  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");

  const faqItems = document.querySelectorAll(".faq-item");

  const leadForm = document.getElementById("leadForm");
  const formMessage = document.getElementById("formMessage");
  const planSelect = document.getElementById("plan");
  const planLinks = document.querySelectorAll("[data-plan-link]");
  const mensajeAutomatico = document.getElementById("mensajeAutomatico");

  let currentSlide = 0;
  let testimonialInterval;

  const mensajesPorPlan = {
    "Nutrición": "Lead interesado en el plan de Nutrición.",
    "Entrenamiento": "Lead interesado en el plan de Entrenamiento.",
    "Oferta conjunta": "Lead interesado en la Oferta conjunta."
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll);

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));

  let statsAnimated = false;

  const animateValue = (element, target) => {
    const duration = 1800;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);

      if (target === 92) {
        element.textContent = `${value}%`;
      } else if (target === 24) {
        element.textContent = `${value}/7`;
      } else if (target === 8) {
        element.textContent = `${value}kg`;
      } else {
        element.textContent = `${value}+`;
      }

      if (progress < 1) requestAnimationFrame(updateCounter);
    };

    requestAnimationFrame(updateCounter);
  };

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            statNumbers.forEach((stat) => {
              const target = Number(stat.getAttribute("data-target"));
              animateValue(stat, target);
            });
            statsAnimated = true;
          }
        });
      },
      { threshold: 0.35 }
    );

    statsObserver.observe(statsSection);
  }

  const showSlide = (index) => {
    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    currentSlide = index;
  };

  const nextSlide = () => showSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => showSlide((currentSlide - 1 + slides.length) % slides.length);

  const startTestimonialAutoPlay = () => {
    if (slides.length > 1) {
      testimonialInterval = setInterval(nextSlide, 5000);
    }
  };

  const resetTestimonialAutoPlay = () => {
    clearInterval(testimonialInterval);
    startTestimonialAutoPlay();
  };

  if (slides.length > 0) {
    showSlide(0);
    startTestimonialAutoPlay();

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        resetTestimonialAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetTestimonialAutoPlay();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        showSlide(Number(dot.getAttribute("data-slide")));
        resetTestimonialAutoPlay();
      });
    });
  }

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (item.classList.contains("open")) {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("open");
        faqItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        faqItem.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  planLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const selectedPlan = link.getAttribute("data-plan-link");
      if (planSelect && selectedPlan) {
        planSelect.value = selectedPlan;
        if (mensajeAutomatico) {
          mensajeAutomatico.value = mensajesPorPlan[selectedPlan] || "";
        }
      }
    });
  });

  if (planSelect) {
    planSelect.addEventListener("change", () => {
      const selectedPlan = planSelect.value;
      if (mensajeAutomatico) {
        mensajeAutomatico.value = mensajesPorPlan[selectedPlan] || "";
      }
    });
  }

  if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nombre = document.getElementById("nombre")?.value.trim() || "";
      const telefono = document.getElementById("telefono")?.value.trim() || "";
      const email = document.getElementById("email")?.value.trim() || "";
      const plan = document.getElementById("plan")?.value.trim() || "";
      const objetivo = document.getElementById("objetivo")?.value.trim() || "";
      const mensaje = document.getElementById("mensaje")?.value.trim() || "";

      if (!nombre || !telefono || !email || !plan || !objetivo) {
        if (formMessage) {
          formMessage.textContent = "Completa todos los campos obligatorios.";
          formMessage.className = "form-message error";
        }
        return;
      }

      const mensajePlan = mensajesPorPlan[plan] || "Lead recibido desde formulario.";

      const textoWhatsapp = `Hola FitnessExtrem, acabo de rellenar el formulario de la web.

*NUEVO LEAD*
Nombre: ${nombre}
Teléfono: ${telefono}
Email: ${email}
Plan de interés: ${plan}
Objetivo principal: ${objetivo}

Mensaje automático: ${mensajePlan}

Caso:
${mensaje || "No ha añadido mensaje extra."}`;

      const urlWhatsapp = `https://wa.me/34628610934?text=${encodeURIComponent(textoWhatsapp)}`;

      window.open(urlWhatsapp, "_blank");

      setTimeout(() => {
        window.location.href = "gracias.html";
      }, 800);
    });
  }
});
