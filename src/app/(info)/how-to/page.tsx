import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Get Your Grok Data",
  description: "Step-by-step guide to exporting your xAI Grok conversation data",
};

export default function HowToPage() {
  return (
    <article className="prose-custom space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-text mb-2">How to Get Your Grok Data</h1>
        <p className="text-brand-muted">
          Follow these steps to download your Grok conversations and import them into What Does Grok
          Know?
        </p>
      </div>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">Step 1: Open Grok</h2>
        <p className="text-brand-muted">
          Navigate to{" "}
          <a
            href="https://x.com/i/grok"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:underline"
          >
            x.com/i/grok
          </a>{" "}
          in your browser and make sure you are logged in to your X (formerly Twitter) account.
        </p>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">Step 2: Request Your Data</h2>
        <p className="text-brand-muted">
          xAI provides data export functionality in compliance with GDPR and data portability
          rights. To request your data:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-brand-muted">
          <li>
            Go to your <strong>X account settings</strong>
          </li>
          <li>
            Navigate to <strong>"Your account"</strong> &rarr;{" "}
            <strong>"Download an archive of your data"</strong>
          </li>
          <li>Request your data archive which includes Grok conversations</li>
          <li>Wait for X to prepare your archive (this can take 24-48 hours)</li>
          <li>Download the archive when the email notification arrives</li>
        </ol>
        <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4">
          <p className="text-sm text-brand-muted">
            <strong className="text-brand-text">Alternative:</strong> If you have direct access to
            the Grok API or have previously saved your chat data as JSON, you can use that file
            directly. The expected format is the standard Grok conversation JSON export.
          </p>
        </div>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">Step 3: Find the Grok Chats File</h2>
        <p className="text-brand-muted">
          Once you have downloaded and extracted your data archive, look for the Grok conversations
          file. It is typically named{" "}
          <code className="bg-brand-border/30 px-1.5 py-0.5 rounded text-sm">grok-chats.json</code>{" "}
          or similar and contains your conversation history in JSON format.
        </p>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">Step 4: Import Into the App</h2>
        <p className="text-brand-muted">
          Go to the{" "}
          <a href="/" className="text-brand-primary hover:underline">
            home page
          </a>{" "}
          and either drag-and-drop your JSON file onto the upload area or click to browse and select
          it. The app will parse your data entirely in your browser &mdash; nothing is uploaded to
          any server.
        </p>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">Step 5: Explore Your Brain</h2>
        <p className="text-brand-muted">
          After parsing is complete, you will see a summary of your imported data. Click
          <strong> "Explore Your Brain"</strong> to enter the 3D neural network visualization and
          start discovering patterns in your conversations.
        </p>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">Supported File Format</h2>
        <p className="text-brand-muted">
          The app accepts JSON files containing Grok conversation data. The expected structure is an
          array of conversation objects, each containing messages with sender roles, content, and
          timestamps. Both the official xAI export format and common API response formats are
          supported.
        </p>
      </section>
    </article>
  );
}
