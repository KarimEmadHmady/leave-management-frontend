import React, { useState, useEffect } from "react";

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const checkScroll = () => {
        if (window.scrollY > 200) {
        setIsVisible(true);
        } else {
        setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", checkScroll);
        return () => {
        window.removeEventListener("scroll", checkScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
        top: 0,
        behavior: "smooth",
        });
    };

    return (
        <button
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 p-3 bg-blue-600 text-white rounded-full shadow-lg transition-opacity ${
            isVisible ? "opacity-100" : "opacity-0"
        } hover:bg-blue-700`}
        style={{ transition: "opacity 0.3s ease" }}
        aria-label="Back to top"
        >
        ↑
        </button>
    );
};

export default BackToTopButton;
