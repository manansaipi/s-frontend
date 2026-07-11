import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const FakeCursorDemo: React.FC = () => {
    const isAutoScroll = new URLSearchParams(window.location.search).get("autoScroll") === "true";
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
                    navigate("/");
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
                    await delay(3500);

                    // === PHASE 8: Close modal ===
                    const closeBtn = await waitForElement(".ant-modal-close", 3000);
                    if (!closeBtn || cancelledRef.current) break;

                    await moveCursorTo(closeBtn, 800);
                    await simulateClick(closeBtn);
                    await delay(1500);

                    // === PHASE 9: Loop — hide cursor briefly then restart ===
                    setCursorStyle({ opacity: 0, transform: "translate(50vw, 50vh)" });
                    await delay(2000);

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
