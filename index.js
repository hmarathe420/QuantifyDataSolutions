/* =========================================================
   QUANTIFY DATA SOLUTIONS
   GLOBAL WEBSITE JAVASCRIPT
   ========================================================= */

"use strict";


/* =========================================================
   01. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeMobileMenu();

    initializeStickyHeader();

    initializeScrollReveal();

    initializeSmoothScrolling();

    initializeFAQ();

    initializeCurrentYear();

    initializeContactForm();

    initializeCounters();

});


/* =========================================================
   02. MOBILE NAVIGATION
   ========================================================= */

function initializeMobileMenu() {
    const menuButton = document.getElementById("mobileMenuButton");
    const navigation = document.getElementById("mainNavigation");

    if (!menuButton || !navigation) {
        return;
    }

    const icon = menuButton.querySelector("i");

    function setMenuState(isOpen) {
        navigation.classList.toggle("open", isOpen);
        document.body.classList.toggle("mobile-menu-open", isOpen);

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

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
    }

    function closeMenu() {
        setMenuState(false);
        menuButton.focus();
    }

    menuButton.addEventListener("click", () => {
        const isOpen =
            navigation.classList.contains("open");

        setMenuState(!isOpen);
    });

    navigation
        .querySelectorAll("a")
        .forEach((link) => {
            link.addEventListener("click", () => {
                setMenuState(false);
            });
        });

    document.addEventListener("click", (event) => {
        const clickedInsideNavigation =
            navigation.contains(event.target);

        const clickedMenuButton =
            menuButton.contains(event.target);

        if (
            navigation.classList.contains("open") &&
            !clickedInsideNavigation &&
            !clickedMenuButton
        ) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }

        if (!navigation.classList.contains("open")) {
            return;
        }

        closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            setMenuState(false);
        }
    });
}


    /*
     * Close menu after clicking a navigation link.
     */

    const navigationLinks =
        navigation.querySelectorAll("a");


    navigationLinks.forEach((link) => {

        link.addEventListener("click", () => {

            navigation.classList.remove("open");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.setAttribute(
                "aria-label",
                "Open navigation menu"
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


    /*
     * Close menu when clicking outside.
     */

    document.addEventListener("click", (event) => {

        if (
            !navigation.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {

            navigation.classList.remove("open");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.setAttribute(
                "aria-label",
                "Open navigation menu"
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

}


/* =========================================================
   03. STICKY HEADER
   ========================================================= */

function initializeStickyHeader() {

    const header =
        document.getElementById("siteHeader");


    if (!header) {
        return;
    }


    const updateHeader =
        () => {

            if (window.scrollY > 30) {

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
   04. SCROLL REVEAL
   ========================================================= */

function initializeScrollReveal() {

    const revealElements =
        document.querySelectorAll(".reveal");


    if (!revealElements.length) {
        return;
    }


    /*
     * Respect users who prefer reduced motion.
     */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (prefersReducedMotion) {

        revealElements.forEach((element) => {

            element.classList.add("visible");

        });

        return;
    }


    /*
     * IntersectionObserver gives us
     * smooth reveal animations without
     * continuously checking scroll position.
     */

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


    revealElements.forEach((element) => {

        observer.observe(element);

    });

}


/* =========================================================
   05. SMOOTH INTERNAL LINKS
   ========================================================= */

function initializeSmoothScrolling() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetId
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
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    15;


                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });

            }
        );

    });

}


/* =========================================================
   06. FAQ
   ========================================================= */

function initializeFAQ() {

    const faqItems =
        document.querySelectorAll(
            ".faq-item"
        );


    if (!faqItems.length) {
        return;
    }


    faqItems.forEach((item) => {

        item.addEventListener(
            "toggle",
            () => {

                if (!item.open) {
                    return;
                }


                /*
                 * Keep only one FAQ open at a time.
                 */

                faqItems.forEach((otherItem) => {

                    if (
                        otherItem !== item &&
                        otherItem.open
                    ) {

                        otherItem.open = false;

                    }

                });

            }
        );

    });

}


/* =========================================================
   07. CURRENT YEAR
   ========================================================= */

function initializeCurrentYear() {

    const yearElements =
        document.querySelectorAll(
            "#currentYear"
        );


    if (!yearElements.length) {
        return;
    }


    const currentYear =
        new Date().getFullYear();


    yearElements.forEach((element) => {

        element.textContent =
            currentYear;

    });

}


/* =========================================================
   08. CONTACT FORM
   ========================================================= */

function initializeContactForm() {

    const form =
        document.getElementById(
            "contactForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        (event) => {

            /*
             * The backend has not been connected yet.
             *
             * We prevent a broken submission and show
             * a temporary success message instead.
             */

            if (
                form.getAttribute("action") ===
                "#"
            ) {

                event.preventDefault();


                showFormMessage(
                    form,
                    "Thank you. Your inquiry is ready to be connected to our business email system."
                );

            }

        }
    );

}


/* =========================================================
   FORM MESSAGE
   ========================================================= */

function showFormMessage(
    form,
    message
) {

    /*
     * Remove an existing message first.
     */

    const existingMessage =
        form.querySelector(
            ".form-success-message"
        );


    if (existingMessage) {

        existingMessage.remove();

    }


    const messageElement =
        document.createElement("div");


    messageElement.className =
        "form-success-message";


    messageElement.setAttribute(
        "role",
        "status"
    );


    messageElement.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <span>
            ${message}
        </span>

    `;


    /*
     * Inline styles keep this temporary message
     * independent from the main design system.
     */

    messageElement.style.display =
        "flex";

    messageElement.style.alignItems =
        "center";

    messageElement.style.gap =
        "10px";

    messageElement.style.padding =
        "14px 16px";

    messageElement.style.marginTop =
        "4px";

    messageElement.style.border =
        "1px solid rgba(22, 199, 154, 0.25)";

    messageElement.style.borderRadius =
        "10px";

    messageElement.style.background =
        "rgba(22, 199, 154, 0.07)";

    messageElement.style.color =
        "#b7c5d3";

    messageElement.style.fontSize =
        "0.8rem";


    const icon =
        messageElement.querySelector("i");


    if (icon) {

        icon.style.color =
            "#16c79a";

    }


    form.appendChild(
        messageElement
    );

}


/* =========================================================
   09. ANIMATED COUNTERS
   ========================================================= */

function initializeCounters() {

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );


    if (!counters.length) {
        return;
    }


    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /*
     * If reduced motion is enabled,
     * show final values immediately.
     */

    if (prefersReducedMotion) {

        counters.forEach((counter) => {

            setCounterFinalValue(counter);

        });

        return;
    }


    const counterObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (
                        !entry.isIntersecting
                    ) {

                        return;

                    }


                    animateCounter(
                        entry.target
                    );


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach((counter) => {

        counterObserver.observe(counter);

    });

}


/* =========================================================
   COUNTER ANIMATION
   ========================================================= */

function animateCounter(counter) {

    const target =
        parseFloat(
            counter.dataset.counter
        );


    if (Number.isNaN(target)) {
        return;
    }


    const duration =
        parseInt(
            counter.dataset.duration || "1800",
            10
        );


    const prefix =
        counter.dataset.prefix || "";


    const suffix =
        counter.dataset.suffix || "";


    const decimals =
        parseInt(
            counter.dataset.decimals || "0",
            10
        );


    const startTime =
        performance.now();


    const update =
        (currentTime) => {

            const elapsed =
                currentTime -
                startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /*
             * Ease-out curve.
             */

            const easedProgress =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const currentValue =
                target *
                easedProgress;


            counter.textContent =
                prefix +
                currentValue.toLocaleString(
                    "en-IN",
                    {
                        minimumFractionDigits:
                            decimals,

                        maximumFractionDigits:
                            decimals
                    }
                ) +
                suffix;


            if (progress < 1) {

                requestAnimationFrame(
                    update
                );

            }

        };


    requestAnimationFrame(
        update
    );

}


/* =========================================================
   COUNTER FINAL VALUE
   ========================================================= */

function setCounterFinalValue(counter) {

    const target =
        parseFloat(
            counter.dataset.counter
        );


    if (Number.isNaN(target)) {
        return;
    }


    const prefix =
        counter.dataset.prefix || "";


    const suffix =
        counter.dataset.suffix || "";


    const decimals =
        parseInt(
            counter.dataset.decimals || "0",
            10
        );


    counter.textContent =
        prefix +
        target.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits:
                    decimals,

                maximumFractionDigits:
                    decimals
            }
        ) +
        suffix;

}


/* =========================================================
   10. ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        const navigation =
            document.getElementById(
                "mainNavigation"
            );


        const menuButton =
            document.getElementById(
                "mobileMenuButton"
            );


        if (
            !navigation ||
            !menuButton
        ) {

            return;

        }


        navigation.classList.remove(
            "open"
        );


        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );


        menuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
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
);


/* =========================================================
   11. WINDOW RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        /*
         * If the user rotates a phone or expands the
         * browser beyond the mobile breakpoint,
         * make sure the mobile menu doesn't remain open.
         */

        if (
            window.innerWidth > 820
        ) {

            const navigation =
                document.getElementById(
                    "mainNavigation"
                );


            const menuButton =
                document.getElementById(
                    "mobileMenuButton"
                );


            if (
                navigation &&
                menuButton
            ) {

                navigation.classList.remove(
                    "open"
                );


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

        }

    },
    {
        passive: true
    }
);
