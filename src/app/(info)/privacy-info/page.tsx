import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Verification",
  description: "How to verify that your Grok data stays in your browser",
};

export default function PrivacyInfoPage() {
  return (
    <article className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-text mb-2">Privacy Verification</h1>
        <p className="text-brand-muted">
          We claim your data never leaves your browser. Here is how you can verify it yourself.
        </p>
      </div>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">The Architecture</h2>
        <p className="text-brand-muted text-sm">
          What Does Grok Know? is a <strong>static Next.js application</strong>. After the initial
          page load, all processing happens entirely in your browser:
        </p>
        <ul className="list-disc list-inside text-brand-muted text-sm space-y-2">
          <li>
            <strong>File parsing</strong> runs in a Web Worker &mdash; a sandboxed browser thread
            with no network access by default
          </li>
          <li>
            <strong>Data storage</strong> uses IndexedDB &mdash; a browser-native database that
            stores data on your device only
          </li>
          <li>
            <strong>NLP analysis</strong> (topics, sentiment, behavioral profiling) runs in a second
            Web Worker &mdash; entirely client-side
          </li>
          <li>
            <strong>3D visualization</strong> uses WebGL via Three.js &mdash; rendered by your GPU,
            no server involvement
          </li>
        </ul>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">How to Verify: Network Tab</h2>
        <p className="text-brand-muted text-sm">
          The most straightforward way to verify that no data is sent to a server:
        </p>
        <ol className="list-decimal list-inside text-brand-muted text-sm space-y-3">
          <li>
            Open your browser Developer Tools (press{" "}
            <code className="bg-brand-border/30 px-1.5 py-0.5 rounded text-xs">F12</code> or{" "}
            <code className="bg-brand-border/30 px-1.5 py-0.5 rounded text-xs">Ctrl+Shift+I</code>)
          </li>
          <li>
            Go to the <strong>Network</strong> tab
          </li>
          <li>Clear the existing network log</li>
          <li>Now import your Grok JSON file into the app</li>
          <li>
            Watch the Network tab &mdash; you will see <strong>zero outgoing requests</strong>{" "}
            containing your chat data
          </li>
        </ol>
        <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4">
          <p className="text-sm text-brand-muted">
            <strong className="text-brand-text">What you will see:</strong> After the initial page
            load (HTML, JS, CSS assets), the only activity is local. The parsing and analysis happen
            in Web Workers which do not make network requests. You can even disconnect from the
            internet after the page loads and the app will continue to work perfectly.
          </p>
        </div>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">How to Verify: Offline Mode</h2>
        <p className="text-brand-muted text-sm">For absolute certainty:</p>
        <ol className="list-decimal list-inside text-brand-muted text-sm space-y-3">
          <li>Load the app in your browser</li>
          <li>
            <strong>Disconnect from the internet</strong> (turn off WiFi or unplug ethernet)
          </li>
          <li>Import your Grok JSON file</li>
          <li>The app will parse, analyze, and visualize your data completely offline</li>
        </ol>
        <p className="text-brand-muted text-sm">
          If data were being sent to a server, the import would fail offline. The fact that
          everything works offline proves the processing is 100% local.
        </p>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">
          How to Verify: Application Storage
        </h2>
        <p className="text-brand-muted text-sm">
          You can inspect exactly where your data is stored:
        </p>
        <ol className="list-decimal list-inside text-brand-muted text-sm space-y-3">
          <li>Open Developer Tools &rarr; Application tab</li>
          <li>
            Expand <strong>IndexedDB</strong> in the sidebar
          </li>
          <li>
            You will see <strong>&quot;GrokBrainDB&quot;</strong> with tables for conversations and
            messages
          </li>
          <li>Click any table to browse data &mdash; all stored locally on your device</li>
          <li>
            Check <strong>Cookies</strong> &mdash; you will find none from this app
          </li>
        </ol>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">How to Verify: Source Code</h2>
        <p className="text-brand-muted text-sm">The app is fully open source:</p>
        <ul className="list-disc list-inside text-brand-muted text-sm space-y-2">
          <li>
            <a
              href="https://github.com/fabianzimber/what-does-grok-know"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline"
            >
              View the source code on GitHub
            </a>
          </li>
          <li>
            Search for{" "}
            <code className="bg-brand-border/30 px-1.5 py-0.5 rounded text-xs">fetch</code>,{" "}
            <code className="bg-brand-border/30 px-1.5 py-0.5 rounded text-xs">XMLHttpRequest</code>
            , or <code className="bg-brand-border/30 px-1.5 py-0.5 rounded text-xs">axios</code>{" "}
            &mdash; none transmit user data
          </li>
        </ul>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">How to Delete Your Data</h2>
        <ul className="list-disc list-inside text-brand-muted text-sm space-y-2">
          <li>
            <strong>Browser settings:</strong> Clear site data for this domain
          </li>
          <li>
            <strong>Developer Tools:</strong> Application &rarr; IndexedDB &rarr; right-click
            &quot;GrokBrainDB&quot; &rarr; Delete database
          </li>
          <li>
            <strong>In the app:</strong> Use &quot;New Import&quot; to replace existing data
          </li>
        </ul>
      </section>
    </article>
  );
}
