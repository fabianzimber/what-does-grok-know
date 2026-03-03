import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about What Does Grok Know?",
};

const faqs = [
  {
    q: "What is What Does Grok Know?",
    a: "It is a privacy-first web application that lets you visualize and analyze your xAI Grok conversations as an interactive 3D neural network. It runs entirely in your browser — no data is ever sent to a server.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. Your Grok chat data is processed and stored exclusively in your browser using Web Workers and IndexedDB. No data leaves your device. You can verify this yourself on our Privacy Verification page.",
  },
  {
    q: "What file format do I need?",
    a: "The app accepts a JSON file containing your Grok conversation export. This is the standard format provided by xAI when you request your data.",
  },
  {
    q: "How do I get my Grok data?",
    a: "You can request your data through X (formerly Twitter) account settings under 'Download an archive of your data'. See our How-To page for detailed steps.",
  },
  {
    q: "What kind of analysis does the app perform?",
    a: "The app performs topic clustering (TF-IDF), sentiment analysis, behavioral profiling (peak hours, model preferences), cognitive profiling (vocabulary richness, question ratios), and memory extraction (facts, decisions, goals).",
  },
  {
    q: "Does the app use AI or external APIs?",
    a: "No. All analysis is performed locally using custom NLP algorithms running in Web Workers. There are no external API calls, no AI services, and no cloud processing.",
  },
  {
    q: "What is the 3D Neural Network view?",
    a: "It is an interactive Three.js visualization where each conversation is a node (neuron), topics form clusters, and connections represent shared themes. You can rotate, zoom, and click nodes to read conversations.",
  },
  {
    q: "Can I delete my data?",
    a: "Yes. Since all data is stored in your browser's IndexedDB, you can clear it at any time through your browser settings or by clearing site data. The app also provides a 'New Import' option that replaces existing data.",
  },
  {
    q: "Does the app work offline?",
    a: "After the initial page load, all functionality works without an internet connection since everything runs client-side.",
  },
  {
    q: "Is the app free?",
    a: "Yes, completely free and open source. The source code is available on GitHub.",
  },
  {
    q: "Which browsers are supported?",
    a: "Any modern browser that supports WebGL, Web Workers, and IndexedDB. This includes Chrome, Firefox, Safari, and Edge (latest versions).",
  },
];

export default function FaqPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-text mb-2">Frequently Asked Questions</h1>
        <p className="text-brand-muted">Everything you need to know about What Does Grok Know?</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={faq.q} className="glass-deep rounded-2xl group" open={i === 0}>
            <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between">
              <span className="font-medium text-brand-text pr-4">{faq.q}</span>
              <svg
                className="w-5 h-5 text-brand-muted shrink-0 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="px-6 pb-4">
              <p className="text-brand-muted text-sm">{faq.a}</p>
            </div>
          </details>
        ))}
      </div>
    </article>
  );
}
