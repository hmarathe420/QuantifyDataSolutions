/* =========================================================
   QUANTIFY DATA SOLUTIONS
   Global Website JavaScript
   Version 2.0
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. ELEMENTS
    ===================================================== */

    const header = document.getElementById("siteHeader");

    const mobileMenuButton =
        document.getElementById("mobileMenuButton");

    const mainNavigation =
        document.getElementById("mainNavigation");

    const currentYear =
        document.getElementById("currentYear");


    /* =====================================================
       02. CURRENT YEAR
    ===================================================== */

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       03. STICKY HEADER
    ===================================================== */

    const handleHeaderScroll = () => {

        if (!header) return;

        if (window.scrollY > 20) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    };

    handleHeaderScroll();

    window.addEventListener(
        "scroll",
        handleHeaderScroll,
        { passive: true }
    );


    /* =====================================================
       04. MOBILE NAVIGATION
    ===================================================== */

    if (
        mobileMenuButton &&
        mainNavigation
    ) {

        mobileMenuButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    mainNavigation.classList.toggle("open");

                mobileMenuButton.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );


                const icon =
                    mobileMenuButton.querySelector("i");

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
        );


        /* Close menu after clicking a link */

        const navigationLinks =
            mainNavigation.querySelectorAll("a");

        navigationLinks.forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mainNavigation.classList.remove(
                        "open"
                    );

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    const icon =
                        mobileMenuButton.querySelector("i");

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

        });


        /* Close when clicking outside */

        document.addEventListener(
            "click",
            event => {

                const clickedInsideNavigation =
                    mainNavigation.contains(event.target);

                const clickedMenuButton =
                    mobileMenuButton.contains(event.target);


                if (
                    !clickedInsideNavigation &&
                    !clickedMenuButton
                ) {

                    mainNavigation.classList.remove(
                        "open"
                    );

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    const icon =
                        mobileMenuButton.querySelector("i");

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


        /* Close mobile menu when resizing */

        window.addEventListener(
            "resize",
            () => {

                if (window.innerWidth > 760) {

                    mainNavigation.classList.remove(
                        "open"
                    );

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    const icon =
                        mobileMenuButton.querySelector("i");

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


    /* =====================================================
       05. SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    if (revealElements.length) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "revealed"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(
            element => {

                revealObserver.observe(element);

            }
        );

    }


    /* =====================================================
       06. NUMBER COUNTERS
    ===================================================== */

    const counters =
        document.querySelectorAll(".counter");


    const animateCounter = counter => {

        const target =
            Number(
                counter.getAttribute(
                    "data-target"
                )
            );


        if (
            Number.isNaN(target)
        ) {
            return;
        }


        const duration = 1800;

        const startTime =
            performance.now();


        const updateCounter =
            currentTime => {

                const elapsed =
                    currentTime - startTime;


                const progress =
                    Math.min(
                        elapsed / duration,
                        1
                    );


                /*
                 * Ease-out animation
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


                counter.textContent =
                    currentValue.toLocaleString();


                if (progress < 1) {

                    requestAnimationFrame(
                        updateCounter
                    );

                } else {

                    counter.textContent =
                        target.toLocaleString();

                }

            };


        requestAnimationFrame(
            updateCounter
        );

    };


    if (counters.length) {

        const counterObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            animateCounter(
                                entry.target
                            );

                            counterObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.4
                }
            );


        counters.forEach(counter => {

            counterObserver.observe(
                counter
            );

        });

    }


    /* =====================================================
       07. ACTIVE NAVIGATION
    ===================================================== */

    const navigationLinks =
        document.querySelectorAll(
            ".main-navigation > a"
        );


    const currentPage =
        window.location.pathname
            .split("/")
            .pop() || "index.html";


    navigationLinks.forEach(link => {

        const href =
            link.getAttribute("href");


        if (
            href === currentPage
        ) {

            navigationLinks.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            link.classList.add(
                "active"
            );

        }

    });


    /* =====================================================
       08. SMOOTH ANCHOR SCROLLING
    ===================================================== */

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


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


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;


                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight;


                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });

            }
        );

    });


    /* =====================================================
       09. IMAGE LOAD OPTIMIZATION
    ===================================================== */

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(image => {

        /*
         * Avoid applying lazy loading
         * to the main hero image.
         */

        const isHeroImage =
            image.closest(
                ".hero-image-wrapper"
            );


        if (!isHeroImage) {

            image.loading = "lazy";

        }

        image.decoding = "async";

    });


    /* =====================================================
       10. KEYBOARD ACCESSIBILITY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                mainNavigation &&
                mainNavigation.classList.contains(
                    "open"
                )
            ) {

                mainNavigation.classList.remove(
                    "open"
                );


                if (mobileMenuButton) {

                    mobileMenuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    const icon =
                        mobileMenuButton.querySelector(
                            "i"
                        );


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

        }
    );


    /* =====================================================
       11. PAGE READY
    ===================================================== */

    document.documentElement.classList.add(
        "js-ready"
    );


    console.log(
        "Quantify Data Solutions website initialized."
    );

});
