"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages: string;
              layout: number;
              autoDisplay?: boolean;
            },
            elementId: string
          ): void;
          InlineLayout: {
            SIMPLE: number;
            HORIZONTAL: number;
            VERTICAL: number;
          };
        };
      };
    };
    googleTranslateElementInit: () => void;
  }
}

export const GoogleTranslate = () => {
  useEffect(() => {
    if (window.google?.translate?.TranslateElement) return;

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,bn,ru,fr,el,hi,mr,es,de,it,ja,zh-CN,ar,pt,tr",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google-translate-element"
      );
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div
        className="bg-white/40 backdrop-blur-md shadow-lg rounded-xl px-4 py-2 border border-white/30 flex items-center gap-2 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() =>
          document
            .querySelector<HTMLSelectElement>(
              "#google-translate-element select"
            )
            ?.focus()
        }
      >
       
        <div
          id="google-translate-element"
          className="inline-block translate-dropdown"
        ></div>
      </div>

      <style jsx global>{`
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 14px !important;
          color: #374151 !important;
        }
        .goog-te-gadget .goog-te-combo {
          appearance: none !important;
          border: 1px solid rgba(255, 255, 255, 0.4) !important;
          border-radius: 0.75rem !important;
          padding: 0.5rem 2rem 0.5rem 0.75rem !important;
          background: rgba(255, 255, 255, 0.5) !important;
          backdrop-filter: blur(8px) !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          color: #1f2937 !important;
          cursor: pointer !important;
          position: relative !important;
          transition: all 0.2s ease-in-out !important;
        }
        .goog-te-gadget .goog-te-combo:hover {
          border-color: rgba(59, 130, 246, 0.7) !important;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.3) !important;
        }
        .goog-te-gadget .goog-te-combo {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 0.75rem center !important;
          background-size: 1rem !important;
        }
        .goog-logo-link {
          display: none !important;
        }
        .goog-te-gadget span {
          display: none !important;
        }
      `}</style>
    </div>
  );
};
