/* =========================================================
   QUANTIFY DATA SOLUTIONS
   GLOBAL WEBSITE JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   01. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initMobileNavigation();

    initHeaderScroll();

    initRevealAnimations();

    initCounters();

    initContactForm();

    initSmoothScrolling();

    initCurrentYear();

});


/* =========================================================
   02. MOBILE NAVIGATION
   ========================================================= */

function initMobileNavigation() {

    const menuButton =
        document.getElementById("mobileMenuButton");

    const navigation =
        document.getElementById("mainNavigation");

    if (!menuButton || !navigation) {
        return;
    }


    menuButton.addEventListener("click", () => {

        const isOpen =
            navigation.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );


        const icon =
            menuButton.querySelector("i");

        if (icon) {

            icon.classList.toggle(
                "fa-bars",
                !isOpen
            );

            icon.classList.toggle(
                "fa-xmark",
                isOpen
            );

        }

    });


    /* Close menu after clicking a link */

    navigation
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener("click", () => {

                navigation.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );


                const icon =
                    menuButton.querySelector("i");

                if (icon) {

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );

                }

            });

        });


    /* Close when clicking outside */

    document.addEventListener("click", (event) => {

        const clickedInsideNavigation =
            navigation.contains(event.target);

        const clickedMenuButton =
            menuButton.contains(event.target);

        if (
            !clickedInsideNavigation &&
            !clickedMenuButton
        ) {

            navigation.classList.remove("open");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );


            const icon =
                menuButton.querySelector("i");

            if (icon) {

                icon.classList.remove(
                    "fa-xmark"
                );

                icon.classList.add(
                    "fa-bars"
                );

            }

        }

    });


    /* Close menu with Escape */

    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") {
            return;
        }

        navigation.classList.remove("open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );


        const icon =
            menuButton.querySelector("i");

        if (icon) {

            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-bars"
            );

        }

    });

}


/* =========================================================
   03. HEADER SCROLL EFFECT
   ========================================================= */

function initHeaderScroll() {

    const header =
        document.getElementById("siteHeader");

    if (!header) {
        return;
    }


    const updateHeader = () => {

        if (window.scrollY > 20) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    };


    updateHeader();


    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );

}


/* =========================================================
   04. REVEAL ANIMATIONS
   ========================================================= */

function initRevealAnimations() {

    const elements =
        document.querySelectorAll(".reveal");

    if (!elements.length) {
        return;
    }


    /*
     * If IntersectionObserver is not available,
     * display everything immediately.
     */

    if (!("IntersectionObserver" in window)) {

        elements.forEach((element) => {
            element.classList.add("visible");
        });

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        "visible"
                    );


                    observerInstance.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    elements.forEach((element) => {

        observer.observe(element);

    });

}


/* =========================================================
   05. NUMBER COUNTERS
   ========================================================= */

function initCounters() {

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );

    if (!counters.length) {
        return;
    }


    if (!("IntersectionObserver" in window)) {

        counters.forEach((counter) => {

            counter.textContent =
                counter.dataset.counter;

        });

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    animateCounter(
                        entry.target
                    );


                    observerInstance.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.6
            }
        );


    counters.forEach((counter) => {

        observer.observe(counter);

    });

}


/* =========================================================
   COUNTER ANIMATION
   ========================================================= */

function animateCounter(element) {

    const target =
        Number(element.dataset.counter);

    if (
        Number.isNaN(target) ||
        target < 0
    ) {
        return;
    }


    const duration =
        Number(element.dataset.duration) ||
        1800;


    const suffix =
        element.dataset.suffix || "";


    const prefix =
        element.dataset.prefix || "";


    const startTime =
        performance.now();


    function updateCounter(currentTime) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /*
         * Ease-out animation.
         */

        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const currentValue =
            Math.floor(
                easedProgress * target
            );


        element.textContent =
            prefix +
            formatNumber(currentValue) +
            suffix;


        if (progress < 1) {

            requestAnimationFrame(
                updateCounter
            );

        } else {

            element.textContent =
                prefix +
                formatNumber(target) +
                suffix;

        }

    }


    requestAnimationFrame(
        updateCounter
    );

}


/* =========================================================
   FORMAT NUMBERS
   ========================================================= */

function formatNumber(number) {

    return new Intl.NumberFormat(
        "en-IN"
    ).format(number);

}


/* =========================================================
   06. CONTACT FORM
   ========================================================= */

function initContactForm() {

    const form =
        document.getElementById(
            "projectContactForm"
        );

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        (event) => {

            /*
             * The current form uses mailto:
             * so the browser/email client can
             * handle the submission.
             *
             * We only validate here and do not
             * interfere with the default action.
             */

            if (!form.checkValidity()) {

                event.preventDefault();

                form.reportValidity();

                return;

            }

        }
    );

}


/* =========================================================
   07. SMOOTH INTERNAL SCROLLING
   ========================================================= */

function initSmoothScrolling() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    if (!links.length) {
        return;
    }


    links.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const href =
                    link.getAttribute("href");


                if (
                    !href ||
                    href === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        href
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                const header =
                    document.querySelector(
                        ".site-header"
                    );


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;


                const targetPosition =
                    target.getBoundingClientRect()
                        .top +
                    window.scrollY -
                    headerHeight -
                    10;


                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });

            }
        );

    });

}


/* =========================================================
   08. CURRENT YEAR
   ========================================================= */

function initCurrentYear() {

    const yearElement =
        document.getElementById(
            "currentYear"
        );

    if (!yearElement) {
        return;
    }


    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   09. ACTIVE NAVIGATION
   ========================================================= */

function initActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    const navigationLinks =
        document.querySelectorAll(
            ".main-navigation a"
        );


    if (!navigationLinks.length) {
        return;
    }


    navigationLinks.forEach((link) => {

        const href =
            link
                .getAttribute("href")
                ?.split("#")[0]
                .toLowerCase();


        if (
            !href ||
            href === ""
        ) {
            return;
        }


        const normalizedCurrentPage =
            currentPage || "index.html";


        const normalizedHref =
            href || "index.html";


        if (
            normalizedCurrentPage ===
            normalizedHref
        ) {

            link.classList.add("active");

        }

    });

}


/* =========================================================
   10. IMAGE ERROR HANDLING
   ========================================================= */

function initImageFallbacks() {

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach((image) => {

        image.addEventListener(
            "error",
            () => {

                image.classList.add(
                    "image-error"
                );

            }
        );

    });

}


/* =========================================================
   11. INITIALIZE EXTRA FEATURES
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initActiveNavigation();

        initImageFallbacks();

    }
);
