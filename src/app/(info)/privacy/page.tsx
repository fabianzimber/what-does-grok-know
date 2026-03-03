import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung gem. DSGVO für What Does Grok Know?",
};

export default function PrivacyPage() {
  return (
    <article className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-text">Datenschutzerkl&auml;rung</h1>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">1. Datenschutz auf einen Blick</h2>
        <h3 className="font-medium text-brand-text">Allgemeine Hinweise</h3>
        <p className="text-brand-muted text-sm">
          Die folgenden Hinweise geben einen einfachen &Uuml;berblick dar&uuml;ber, was mit Ihren
          personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-800 font-medium">
            Wichtig: Diese Anwendung verarbeitet Ihre Grok-Chatdaten ausschlie&szlig;lich lokal in
            Ihrem Browser. Es werden keine Chatdaten an unsere oder fremde Server &uuml;bermittelt.
          </p>
        </div>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">2. Verantwortliche Stelle</h2>
        <div className="text-brand-muted text-sm space-y-1">
          <p>shiftbloom studio</p>
          <p>Fabian Zimber</p>
          <p>Hamburg, Deutschland</p>
          <p>E-Mail: fabian@shiftbloom.studio</p>
          <p>Telefon: +49 (0) 163 8552 708</p>
        </div>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">
          3. Datenerfassung auf dieser Website
        </h2>

        <div className="space-y-3">
          <h3 className="font-medium text-brand-text">Hosting</h3>
          <p className="text-brand-muted text-sm">
            Diese Website wird bei Vercel Inc. gehostet. Beim Besuch erfasst der Hosting-Anbieter
            automatisch Informationen in Server-Log-Dateien: Browsertyp, Betriebssystem, Referrer
            URL, Hostname, Uhrzeit und IP-Adresse.
          </p>
          <p className="text-brand-muted text-sm">
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-brand-text">Lokale Datenverarbeitung (Grok-Chatdaten)</h3>
          <p className="text-brand-muted text-sm">
            Importierte Grok-Exportdateien werden ausschlie&szlig;lich in Ihrem Browser verarbeitet:
          </p>
          <ul className="list-disc list-inside text-brand-muted text-sm space-y-1">
            <li>Parsing der JSON-Datei in einem Web Worker (clientseitig)</li>
            <li>Speicherung in IndexedDB (lokale Browserdatenbank)</li>
            <li>NLP-Analyse in einem Web Worker (clientseitig)</li>
            <li>3D-Visualisierung mittels WebGL (clientseitig)</li>
          </ul>
          <p className="text-brand-muted text-sm font-medium">
            Es werden zu keinem Zeitpunkt Chatdaten an einen Server gesendet.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-brand-text">Cookies</h3>
          <p className="text-brand-muted text-sm">Diese Website verwendet keine Cookies.</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-brand-text">Analyse-Tools und Tracking</h3>
          <p className="text-brand-muted text-sm">
            Diese Website verwendet keine Analyse-Tools oder Tracking-Dienste.
          </p>
        </div>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">4. Ihre Rechte (DSGVO)</h2>
        <ul className="list-disc list-inside text-brand-muted text-sm space-y-1">
          <li>
            <strong>Auskunftsrecht</strong> (Art. 15 DSGVO)
          </li>
          <li>
            <strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)
          </li>
          <li>
            <strong>Recht auf L&ouml;schung</strong> (Art. 17 DSGVO)
          </li>
          <li>
            <strong>Recht auf Einschr&auml;nkung</strong> (Art. 18 DSGVO)
          </li>
          <li>
            <strong>Recht auf Daten&uuml;bertragbarkeit</strong> (Art. 20 DSGVO)
          </li>
          <li>
            <strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)
          </li>
        </ul>
        <p className="text-brand-muted text-sm">
          Da Ihre Chatdaten lokal gespeichert werden, haben Sie jederzeit die volle Kontrolle.
          L&ouml;schen Sie Ihre Browser-Daten (IndexedDB) um alle Daten zu entfernen.
        </p>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">5. Aufsichtsbeh&ouml;rde</h2>
        <div className="text-brand-muted text-sm space-y-1">
          <p className="font-medium text-brand-text">
            Der Hamburgische Beauftragte f&uuml;r Datenschutz und Informationsfreiheit
          </p>
          <p>Ludwig-Erhard-Stra&szlig;e 22, 7. OG, 20459 Hamburg</p>
          <p>
            <a
              href="https://datenschutz-hamburg.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline"
            >
              datenschutz-hamburg.de
            </a>
          </p>
        </div>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">6. &Auml;nderungen</h2>
        <p className="text-brand-muted text-sm">
          Wir behalten uns vor, diese Datenschutzerkl&auml;rung anzupassen. Stand: M&auml;rz 2026
        </p>
      </section>
    </article>
  );
}
