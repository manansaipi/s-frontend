import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const FakeCursorDemo: React.FC = () => {
    const [isAutoScroll] = useState(() => new URLSearchParams(window.location.search).get("autoScroll") === "true");
    const [cursorStyle, setCursorStyle] = useState<React.CSSProperties>({
        opacity: 0,
        transform: "translate(50vw, 50vh)",
    });
    
    const navigate = useNavigate();
    const cancelledRef = useRef(false);
    const sequenceRunningRef = useRef(false);

    const delay = useCallback((ms: number) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => resolve(), ms);
        });
    }, []);

    const waitForElement = useCallback(async (selector: string, timeoutMs = 8000): Promise<Element | null> => {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            if (cancelledRef.current) return null;
            const el = document.querySelector(selector);
            if (el) return el;
            await new Promise(r => setTimeout(r, 300));
        }
        return null;
    }, []);

    const moveCursorTo = useCallback(async (element: Element, duration = 1000) => {
        if (cancelledRef.current) return;
        const rect = element.getBoundingClientRect();
        setCursorStyle({
            opacity: 1,
            transform: `translate(${rect.left + rect.width / 2}px, ${rect.top + rect.height / 2}px)`,
            transition: `transform ${duration}ms ease-in-out`,
        });
        await delay(duration + 100);
    }, [delay]);

    const simulateClick = useCallback(async (element: Element) => {
        if (cancelledRef.current || !element) return;
        // Press down
        setCursorStyle(prev => ({
            ...prev,
            transform: (prev.transform ? String(prev.transform) : "") + " scale(0.8)",
            transition: "transform 150ms",
        }));
        await delay(200);
        // Release
        setCursorStyle(prev => ({
            ...prev,
            transform: prev.transform ? String(prev.transform).replace(" scale(0.8)", "") : "",
            transition: "transform 150ms",
        }));
        await delay(100);
        (element as HTMLElement).click();
    }, [delay]);

    const simulateTyping = useCallback(async (element: HTMLInputElement, text: string) => {
        if (cancelledRef.current) return;
        for (let i = 0; i < text.length; i++) {
            if (cancelledRef.current) break;
            const charSequence = text.substring(0, i + 1);
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype, "value"
            )?.set;
            if (nativeInputValueSetter) {
                nativeInputValueSetter.call(element, charSequence);
            }
            element.dispatchEvent(new Event("input", { bubbles: true }));
            await delay(120);
        }
    }, [delay]);

    useEffect(() => {
        if (!isAutoScroll) return;
        cancelledRef.current = false;

        const runSequence = async () => {
            if (sequenceRunningRef.current) return;
            sequenceRunningRef.current = true;

            while (!cancelledRef.current) {
                try {
                    // === PHASE 1: Go to Home ===
                    navigate("/?autoScroll=true");
                    await delay(2500);
                    if (cancelledRef.current) break;

                    // === PHASE 2: Find and click search input ===
                    const inputEl = await waitForElement("#fake-cursor-search-input");
                    if (!inputEl || cancelledRef.current) break;

                    await moveCursorTo(inputEl, 1000);
                    await simulateClick(inputEl);
                    await delay(400);

                    // === PHASE 3: Type "Inception" ===
                    await simulateTyping(inputEl as HTMLInputElement, "Inception");
                    await delay(600);
                    if (cancelledRef.current) break;

                    // === PHASE 4: Click Search button ===
                    const searchBtn = await waitForElement("#fake-cursor-search-btn");
                    if (!searchBtn || cancelledRef.current) break;

                    await moveCursorTo(searchBtn, 800);
                    await simulateClick(searchBtn);

                    // === PHASE 5: Wait for search results to load ===
                    await delay(1000); // Give route transition time
                    const resultEl = await waitForElement(".fake-cursor-search-result", 10000);
                    if (!resultEl || cancelledRef.current) break;

                    // === PHASE 6: Click first search result ===
                    await delay(500);
                    await moveCursorTo(resultEl, 1200);
                    await simulateClick(resultEl);

                    // === PHASE 7: Wait for modal to open and admire it ===
                    await delay(1000);
                    const modalContent = await waitForElement(".ant-modal-content", 5000);
                    if (!modalContent || cancelledRef.current) break;
                    await delay(2500);

                    // === PHASE 8: Click "Get Started" to go to detail page ===
                    const getStartedBtn = await waitForElement("#fake-cursor-get-started", 3000);
                    if (!getStartedBtn || cancelledRef.current) break;

                    await moveCursorTo(getStartedBtn, 800);
                    await simulateClick(getStartedBtn);

                    // === PHASE 9: Admire the detail page trailer ===
                    await delay(2000);
                    const detailPage = await waitForElement(".min-h-screen.text-white", 8000);
                    if (!detailPage || cancelledRef.current) break;
                    await delay(3000);

                    // === PHASE 10: Click "More Info" button ===
                    const moreInfoBtn = await waitForElement("#fake-cursor-more-info", 5000);
                    if (!moreInfoBtn || cancelledRef.current) break;

                    await moveCursorTo(moreInfoBtn, 1000);
                    await simulateClick(moreInfoBtn);

                    // === PHASE 11: Wait for MovieInfoModal to open ===
                    await delay(1500);
                    const infoModal = await waitForElement(".ant-modal-body", 5000);
                    if (!infoModal || cancelledRef.current) break;

                    // Scroll down inside the modal to read Details & Crew
                    await delay(1500);
                    const modalBody = document.querySelector(".ant-modal-body") as HTMLElement;
                    if (modalBody) {
                        for (let i = 0; i < 3; i++) {
                            if (cancelledRef.current) break;
                            modalBody.scrollBy({ top: 150, behavior: "smooth" });
                            await delay(1000);
                        }
                    }
                    await delay(1000);

                    // === PHASE 12: Click "Cast" tab ===
                    // Ant Design tabs render as .ant-tabs-tab with inner text
                    const allTabs = document.querySelectorAll(".ant-tabs-tab");
                    let castTab: Element | null = null;
                    let reviewsTab: Element | null = null;
                    allTabs.forEach(tab => {
                        const text = tab.textContent || "";
                        if (text.includes("Cast")) castTab = tab;
                        if (text.includes("Reviews")) reviewsTab = tab;
                    });

                    if (castTab && !cancelledRef.current) {
                        await moveCursorTo(castTab, 800);
                        await simulateClick(castTab);
                        await delay(1500);

                        // Scroll to see cast members
                        if (modalBody) {
                            modalBody.scrollTo({ top: 0, behavior: "smooth" });
                            await delay(500);
                            for (let i = 0; i < 3; i++) {
                                if (cancelledRef.current) break;
                                modalBody.scrollBy({ top: 150, behavior: "smooth" });
                                await delay(1000);
                            }
                        }
                        await delay(1000);
                    }

                    // === PHASE 13: Click "Reviews" tab ===
                    if (reviewsTab && !cancelledRef.current) {
                        await moveCursorTo(reviewsTab, 800);
                        await simulateClick(reviewsTab);
                        await delay(1500);

                        // Scroll to read reviews
                        if (modalBody) {
                            modalBody.scrollTo({ top: 0, behavior: "smooth" });
                            await delay(500);
                            for (let i = 0; i < 2; i++) {
                                if (cancelledRef.current) break;
                                modalBody.scrollBy({ top: 150, behavior: "smooth" });
                                await delay(1000);
                            }
                        }
                        await delay(1500);
                    }

                    // === PHASE 14: Close the modal and loop back home ===
                    const closeInfoBtn = await waitForElement(".ant-modal-close", 3000);
                    if (closeInfoBtn && !cancelledRef.current) {
                        await moveCursorTo(closeInfoBtn, 800);
                        await simulateClick(closeInfoBtn);
                    }
                    await delay(1000);

                    // === PHASE 15: Loop — hide cursor, go back home ===
                    setCursorStyle({ opacity: 0, transform: "translate(50vw, 50vh)" });
                    await delay(1500);

                } catch (err) {
                    console.warn("[FakeCursor] sequence error, restarting:", err);
                    setCursorStyle({ opacity: 0, transform: "translate(50vw, 50vh)" });
                    await delay(3000);
                }
            }

            sequenceRunningRef.current = false;
        };

        runSequence();

        return () => {
            cancelledRef.current = true;
        };
    }, [isAutoScroll, navigate, delay, waitForElement, moveCursorTo, simulateClick, simulateTyping]);

    if (!isAutoScroll) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "24px",
                height: "24px",
                pointerEvents: "none",
                zIndex: 999999,
                ...cursorStyle,
            }}
        >
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.5))" }}
            >
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" fill="black" />
            </svg>
        </div>
    );
};
