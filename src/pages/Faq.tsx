import React, { useState } from 'react';
import { ChevronDown, Wine, HelpCircle } from 'lucide-react';
import { supportFaqs } from '../data/offers';

export const Faq: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center mx-auto shadow-xs">
            <Wine className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Frequently Asked Questions</h1>
          <p className="text-xs sm:text-sm text-slate-600">Everything you need to know about ordering liquor, 21+ verification, and 30-min chilled delivery.</p>
        </div>

        <div className="space-y-4">
          {supportFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 flex items-center justify-between text-left font-bold text-slate-800 hover:text-amber-700 transition-colors text-xs sm:text-sm"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
