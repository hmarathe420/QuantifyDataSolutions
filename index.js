/* =========================================================
   QUANTIFY DATA SOLUTIONS
   index.js
   ========================================================= */


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initMobileNavigation();

    initHeaderScroll();

    initRevealAnimations();

    initCounters();

    initSmoothNavigation();

    initCurrentYear();

});


/* =========================================================
   MOBILE NAVIGATION
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

        if (!icon) {
            return;
        }


        if (isOpen) {

            icon.classList.remove(
                "fa-bars"
            );

            icon.classList.add(
                "fa-xmark"
            );

            menuButton.setAttribute(
                "aria-label",
                "Close navigation menu"
            );

        } else {

            icon.classList.remove(
                "fa-xmark"
            );

            icon.classList.add(
                "fa-bars"
            );

            menuButton.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        }

    });


    /*
     * Close menu when a navigation link is clicked.
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
     * Close the menu when clicking outside it.
     */

    document.addEventListener("click", (event) => {

        const clickedInsideNavigation =
            navigation.contains(event.target);

        const clickedMenuButton =
            menuButton.contains(event.target);


        if (
            !clickedInsideNavigation &&
            !clickedMenuButton &&
            navigation.classList.contains("open")
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


    /*
     * Reset mobile menu when returning to desktop.
     */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 820) {

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
    );

}


/* =========================================================
   HEADER SCROLL EFFECT
   ========================================================= */

function initHeaderScroll() {

    const header =
        document.getElementById("siteHeader");

    if (!header) {
        return;
    }


    const updateHeader =
        () => {

            if (window.scrollY > 20) {

                header.classList.add(
                    "scrolled"
                );

            } else {

                header.classList.remove(
                    "scrolled"
                );

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
   SCROLL REVEAL ANIMATIONS
   ========================================================= */

function initRevealAnimations() {

    const elements =
        document.querySelectorAll(".reveal");


    if (!elements.length) {
        return;
    }


    /*
     * Fallback for browsers without
     * IntersectionObserver.
     */

    if (!("IntersectionObserver" in window)) {

        elements.forEach((element) => {

            element.classList.add(
                "visible"
            );

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
   NUMBER COUNTERS
   ========================================================= */

function initCounters() {

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );


    if (!counters.length) {
        return;
    }


    /*
     * Respect users who prefer
     * reduced motion.
     */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (prefersReducedMotion) {

        counters.forEach((counter) => {

            setCounterValue(
                counter,
                Number(
                    counter.dataset.counter
                )
            );

        });

        return;
    }


    if (!("IntersectionObserver" in window)) {

        counters.forEach((counter) => {

            animateCounter(counter);

        });

        return;
    }


    const counterObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
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

function animateCounter(element) {

    const target =
        Number(
            element.dataset.counter
        );


    if (
        Number.isNaN(target) ||
        target < 0
    ) {

        return;

    }


    const suffix =
        element.dataset.suffix || "";


    const duration =
        target > 10000
            ? 1800
            : 1200;


    const startTime =
        performance.now();


    function update(currentTime) {

        const elapsed =
            currentTime - startTime;


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
            Math.floor(
                easedProgress * target
            );


        setCounterValue(
            element,
            currentValue,
            suffix
        );


        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        } else {

            setCounterValue(
                element,
                target,
                suffix
            );

        }

    }


    requestAnimationFrame(update);

}


/* =========================================================
   SET COUNTER VALUE
   ========================================================= */

function setCounterValue(
    element,
    value,
    suffix = null
) {

    if (suffix === null) {

        suffix =
            element.dataset.suffix || "";

    }


    element.textContent =
        formatNumber(value) + suffix;

}


/* =========================================================
   NUMBER FORMATTER
   ========================================================= */

function formatNumber(number) {

    return new Intl.NumberFormat(
        "en-IN"
    ).format(number);

}


/* =========================================================
   SMOOTH NAVIGATION
   ========================================================= */

function initSmoothNavigation() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


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


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });


                /*
                 * Update URL without causing
                 * another page jump.
                 */

                if (
                    window.history &&
                    window.history.replaceState
                ) {

                    window.history.replaceState(
                        null,
                        "",
                        href
                    );

                }

            }
        );

    });

}


/* =========================================================
   CURRENT YEAR
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
   ACTIVE NAVIGATION SECTION
   ========================================================= */

function initActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const navigationLinks =
        document.querySelectorAll(
            '.main-navigation a[href^="#"]'
        );


    if (
        !sections.length ||
        !navigationLinks.length
    ) {

        return;

    }


    const sectionObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    const currentId =
                        entry.target.getAttribute(
                            "id"
                        );


                    navigationLinks.forEach(
                        (link) => {

                            const href =
                                link.getAttribute(
                                    "href"
                                );


                            if (
                                href ===
                                `#${currentId}`
                            ) {

                                link.classList.add(
                                    "active"
                                );

                            } else {

                                link.classList.remove(
                                    "active"
                                );

                            }

                        }
                    );

                });

            },
            {
                rootMargin:
                    "-30% 0px -60% 0px"
            }
        );


    sections.forEach((section) => {

        sectionObserver.observe(
            section
        );

    });

}


/* =========================================================
   INITIALIZE ACTIVE NAVIGATION
   ========================================================= */

initActiveNavigation();


/* =========================================================
   PAGE VISIBILITY
   ========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            document.documentElement
                .classList.add(
                    "page-visible"
                );

        }

    }
);


/* =========================================================
   EXTERNAL LINK SAFETY
   ========================================================= */

document
    .querySelectorAll(
        'a[target="_blank"]'
    )
    .forEach((link) => {

        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );

    });
