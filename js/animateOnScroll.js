const observer2 = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.target.classList.contains("animate-up-hidden")) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-up");
                } else {
                    entry.target.classList.remove("animate-up");
                }
            }

            if (entry.target.classList.contains("animate-down-hidden")) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-down");
                } else {
                    entry.target.classList.remove("animate-down");
                }
            }

            if (entry.target.classList.contains("animate-left-hidden")) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-left");
                } else {
                    entry.target.classList.remove("animate-left");
                }
            }

            if (entry.target.classList.contains("animate-right-hidden")) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-right");
                } else {
                    entry.target.classList.remove("animate-right");
                }
            }

            if (entry.target.classList.contains("animate-fade-hidden")) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-fade");
                } else {
                    entry.target.classList.remove("animate-fade");
                }
            }
        });
    },
    {
        root: null,
    }
);

const hiddenElements2 = document.querySelectorAll("[class*='animate-']");
hiddenElements2.forEach((el) => observer2.observe(el));
