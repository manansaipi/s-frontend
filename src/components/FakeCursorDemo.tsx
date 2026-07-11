import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const FakeCursorDemo: React.FC = () => {
    const isAutoScroll = new URLSearchParams(window.location.search).get("autoScroll") === "true";
    const [cursorStyle, setCursorStyle] = useState<React.CSSProperties>({
        opacity: 0,
        transform: "translate(50vw, 50vh)",
    });
    
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAutoScroll) return;

        let isCancelled = false;
        
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        
        const moveCursor = async (selector: string, offsetX = 0, offsetY = 0, duration = 1000) => {
            if (isCancelled) return null;
            const element = document.querySelector(selector);
            if (element) {
                const rect = element.getBoundingClientRect();
                setCursorStyle({
                    opacity: 1,
                    transform: `translate(${rect.left + rect.width / 2 + offsetX}px, ${rect.top + rect.height / 2 + offsetY}px)`,
                    transition: `transform ${duration}ms ease-in-out`,
                });
                await delay(duration + 100);
                return element;
            }
            return null;
        };
        
        const simulateClick = (element: Element) => {
            if (isCancelled || !element) return;
            setCursorStyle(prev => ({ ...prev, transform: (prev.transform ? String(prev.transform) : "") + " scale(0.8)", transition: "transform 150ms" }));
            setTimeout(() => {
                if (!isCancelled) {
                    setCursorStyle(prev => ({ ...prev, transform: prev.transform ? String(prev.transform).replace(" scale(0.8)", "") : "", transition: "transform 150ms" }));
                    (element as HTMLElement).click();
                }
            }, 150);
        };
        
        const simulateTyping = async (element: HTMLInputElement, text: string) => {
            if (isCancelled) return;
            for (let i = 0; i < text.length; i++) {
                if (isCancelled) break;
                const charSequence = text.substring(0, i + 1);
                
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
                if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(element, charSequence);
                }
                
                const event = new Event("input", { bubbles: true });
                element.dispatchEvent(event);
                await delay(150);
            }
        };

        const runSequence = async () => {
            if (isCancelled) return;
            
            // Start from homepage if not already there
            if (location.pathname !== "/") {
                navigate("/?autoScroll=true");
                await delay(2000);
            } else {
                await delay(2000); // Initial wait
            }

            if (isCancelled) return;
            
            // Move to search input
            const inputEl = await moveCursor("#fake-cursor-search-input");
            if (inputEl) {
                simulateClick(inputEl);
                await delay(500);
                await simulateTyping(inputEl as HTMLInputElement, "Inception");
                await delay(500);
                
                // Move to search button
                const searchBtn = await moveCursor("#fake-cursor-search-btn");
                if (searchBtn) {
                    simulateClick(searchBtn);
                    // The app navigates to /search now.
                    // Wait a bit for the page transition and API load
                    await delay(3000);
                    
                    if (isCancelled) return;
                    
                    // Move to the first search result
                    const resultEl = await moveCursor(".fake-cursor-search-result");
                    if (resultEl) {
                        simulateClick(resultEl);
                        
                        // Wait for Modal to open and user to "read"
                        await delay(2500);
                        
                        if (isCancelled) return;
                        
                        // Move to "Get Started" button
                        const getStartedBtn = await moveCursor("#fake-cursor-modal-get-started");
                        if (getStartedBtn) {
                            simulateClick(getStartedBtn.closest('button') || getStartedBtn);
                            
                            // Wait for DetailPage to load and user to "read"
                            await delay(4000);
                            
                            // Navigate back to home and loop
                            navigate("/?autoScroll=true");
                        }
                    }
                }
            }
        };

        // We run the sequence continuously
        const intervalId = setInterval(() => {
            runSequence();
        }, 15000); // Repeat every 15s (make sure the sequence finishes within this time)
        
        // Run immediately
        runSequence();

        return () => {
            isCancelled = true;
            clearInterval(intervalId);
        };
    }, [isAutoScroll, navigate, location.pathname]);

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
