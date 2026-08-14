"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeMobileMenu();
    initializeStickyHeader();
    initializeScrollReveal();
    initializeSmoothScrolling();
    initializeFAQ();
    initializeCurrentYear();
    initializeContactForm();
    initializeCounters();
    initializeSitewideFooter();
});

function initializeSitewideFooter() {
    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    const footerContainer = footer.querySelector(".container");
    if (!footerContainer) return;

    /* Use the exact homepage footer markup on every page. */
    footerContainer.innerHTML = `
        <div class="footer-logo">
            <a href="index.html" class="brand" aria-label="Quantify Data Solutions home">
                <img src="Images/QDS Logo.png" alt="Quantify Data Solutions logo" class="brand-logo">
                <div class="brand-name">Quantify <span>DATA SOLUTIONS</span></div>
            </a>
        </div>
        <div class="footer-columns">
            <div class="footer-column">
                <h4>COMPANY</h4>
                <a href="index.html">Home</a>
                <a href="about.html">About</a>
                <a href="services.html">Services</a>
                <a href="contact.html">Contact</a>
            </div>
            <div class="footer-column">
                <h4>SERVICES</h4>
                <a href="services.html#sports-data-details">Sports Data</a>
                <a href="services.html#video-details">Video Annotation</a>
                <a href="services.html#ai-details">AI & ML Data</a>
                <a href="services.html#software-details">Technology</a>
            </div>
            <div class="footer-column">
                <h4>CONTACT</h4>
                <a href="mailto:info@quantifydatasolutions.in">info@quantifydatasolutions.in</a>
                <span>Nashik, Maharashtra, India</span>
                <a href="contact.html">Start a conversation</a>
            </div>
        </div>
        <div class="footer-bottom">
            <span>© <span id="currentYear"></span> Quantify Data Solutions. All rights reserved.</span>
            <span>Built for data-driven businesses.</span>
        </div>`;

    if (!document.querySelector('link[data-footer-sitewide="true"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "homepage-footer.css?v=20260816-sitewide";
        link.dataset.footerSitewide = "true";
        document.head.appendChild(link);
    }
}

function initializeMobileMenu() {
    const menuButton = document.getElementById("mobileMenuButton");
    const navigation = document.getElementById("mainNavigation");
    if (!menuButton || !navigation) return;
    const icon = menuButton.querySelector("i");
    const setMenuState = (isOpen) => {
        navigation.classList.toggle("open", isOpen);
        document.body.classList.toggle("mobile-menu-open", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }
    };
    menuButton.addEventListener("click", () => setMenuState(!navigation.classList.contains("open")));
    navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenuState(false)));
    document.addEventListener("click", (event) => {
        if (navigation.classList.contains("open") && !navigation.contains(event.target) && !menuButton.contains(event.target)) setMenuState(false);
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navigation.classList.contains("open")) {
            setMenuState(false);
            menuButton.focus();
        }
    });
    window.addEventListener("resize", () => {
        if (window.innerWidth > 820) setMenuState(false);
    });
}

function initializeStickyHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;
    const update = () => header.classList.toggle("scrolled", window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
}

function initializeScrollReveal() {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        elements.forEach((element) => element.classList.add("visible"));
        return;
    }
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observerInstance.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    elements.forEach((element) => observer.observe(element));
}

function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") return;
            const target = document.querySelector(targetId);
            if (!target) return;
            event.preventDefault();
            const header = document.querySelector(".site-header");
            const headerHeight = header ? header.offsetHeight : 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 15;
            window.scrollTo({ top, behavior: "smooth" });
        });
    });
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        item.addEventListener("toggle", () => {
            if (!item.open) return;
            faqItems.forEach((otherItem) => {
                if (otherItem !== item) otherItem.open = false;
            });
        });
    });
}

function initializeCurrentYear() {
    document.querySelectorAll("#currentYear").forEach((element) => {
        element.textContent = new Date().getFullYear();
    });
}

function initializeContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector("button[type=\"submit\"]");
        const originalButtonHTML = submitButton ? submitButton.innerHTML : "";
        clearFormMessage(form);
        if (!form.checkValidity()) { form.reportValidity(); return; }
        if (submitButton) { submitButton.disabled = true; submitButton.innerHTML = 'Sending Inquiry <i class="fa-solid fa-spinner fa-spin"></i>'; }
        try {
            const response = await fetch("contact-handler.php", { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } });
            let result = {};
            try { result = await response.json(); } catch (_) {}
            if (!response.ok || !result.success) throw new Error(result.message || "We could not send your inquiry right now.");
            showFormMessage(form, "Thank you. Your inquiry has been sent successfully. Our team will get back to you soon.", true);
            form.reset();
        } catch (error) {
            showFormMessage(form, error.message || "We could not send your inquiry right now. Please email info@quantifydatasolutions.in directly.", false);
        } finally {
            if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = originalButtonHTML; }
        }
    });
}

function clearFormMessage(form) {
    const existing = form.querySelector(".form-success-message");
    if (existing) existing.remove();
    const existingError = form.querySelector(".form-error-message");
    if (existingError) existingError.remove();
}

function showFormMessage(form, message, success) {
    clearFormMessage(form);
    const element = document.createElement("div");
    element.className = success ? "form-success-message" : "form-error-message";
    element.setAttribute("role", success ? "status" : "alert");
    element.style.display = "flex";
    element.style.alignItems = "center";
    element.style.gap = "10px";
    element.style.padding = "14px 16px";
    element.style.marginTop = "4px";
    element.style.borderRadius = "10px";
    element.style.fontSize = "0.8rem";
    element.style.border = success ? "1px solid rgba(22, 199, 154, 0.25)" : "1px solid rgba(255, 100, 100, 0.3)";
    element.style.background = success ? "rgba(22, 199, 154, 0.07)" : "rgba(255, 100, 100, 0.07)";
    element.style.color = "#b7c5d3";
    element.innerHTML = `<i class="fa-solid ${success ? "fa-circle-check" : "fa-circle-exclamation"}"></i><span></span>`;
    element.querySelector("span").textContent = message;
    form.appendChild(element);
}

function initializeCounters() {
    const counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;
    const showFinalValues = () => counters.forEach(setCounterFinalValue);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { showFinalValues(); return; }
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            observerInstance.unobserve(entry.target);
        });
    }, { threshold: 0.5 });
    counters.forEach((counter) => observer.observe(counter));
}

function setCounterFinalValue(counter) {
    const target = parseFloat(counter.dataset.counter);
    if (Number.isNaN(target)) return;
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";
    const decimals = parseInt(counter.dataset.decimals || "0", 10);
    counter.textContent = prefix + target.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
}

function animateCounter(counter) {
    const target = parseFloat(counter.dataset.counter);
    if (Number.isNaN(target)) return;
    const duration = parseInt(counter.dataset.duration || "1800", 10);
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";
    const decimals = parseInt(counter.dataset.decimals || "0", 10);
    const startTime = performance.now();
    const update = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        counter.textContent = prefix + value.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}
