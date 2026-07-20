"use strict";

document.addEventListener(
    "DOMContentLoaded",
    function ()
    {
        const topbar =
            document.querySelector(".topbar");

        const sections =
            document.querySelectorAll(
                "main section[id]"
            );

        const navigationLinks =
            document.querySelectorAll(
                '.navigation a[href^="#"]'
            );

        const faqItems =
            document.querySelectorAll(
                ".faq-list details"
            );

        /*
            Highlight the navigation link for the
            section currently closest to the middle
            of the screen.

            The Completion link is not included
            because it links to another HTML page
            rather than a section beginning with #.
        */

        if (
            "IntersectionObserver" in window &&
            sections.length > 0
        )
        {
            const sectionObserver =
                new IntersectionObserver(
                    function (entries)
                    {
                        entries.forEach(
                            function (entry)
                            {
                                if (!entry.isIntersecting)
                                {
                                    return;
                                }

                                const currentID =
                                    entry.target.id;

                                navigationLinks.forEach(
                                    function (link)
                                    {
                                        const targetID =
                                            link
                                                .getAttribute(
                                                    "href"
                                                )
                                                .slice(1);

                                        link.classList.toggle(
                                            "active",
                                            targetID === currentID
                                        );
                                    }
                                );
                            }
                        );
                    },
                    {
                        threshold: 0.2,

                        rootMargin:
                            "-25% 0px -55% 0px"
                    }
                );

            sections.forEach(
                function (section)
                {
                    sectionObserver.observe(section);
                }
            );
        }

        /*
            Slightly shorten the navigation bar
            after scrolling and hide the hero
            scroll prompt.
        */

        function updateScrollState()
        {
            const scrollPosition =
                window.scrollY ||
                document.documentElement.scrollTop;

            document.body.classList.toggle(
                "has-scrolled",
                scrollPosition > 25
            );

            if (topbar)
            {
                topbar.classList.toggle(
                    "scrolled",
                    scrollPosition > 40
                );
            }
        }

        window.addEventListener(
            "scroll",
            updateScrollState,
            {
                passive: true
            }
        );

        updateScrollState();

        /*
            Keep only one FAQ answer open
            at a time.
        */

        faqItems.forEach(
            function (selectedItem)
            {
                selectedItem.addEventListener(
                    "toggle",
                    function ()
                    {
                        if (!selectedItem.open)
                        {
                            return;
                        }

                        faqItems.forEach(
                            function (otherItem)
                            {
                                if (
                                    otherItem !==
                                    selectedItem
                                )
                                {
                                    otherItem.open =
                                        false;
                                }
                            }
                        );
                    }
                );
            }
        );
    }
);