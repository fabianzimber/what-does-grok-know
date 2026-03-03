import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung gem. § 5 DDG",
};

export default function ImpressumPage() {
  return (
    <article className="space-y-8">
      <h1 className="text-3xl font-bold text-brand-text">Impressum</h1>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">
          Angaben gem&auml;&szlig; &sect; 5 DDG
        </h2>
        <div className="text-brand-muted space-y-1">
          <p className="font-medium text-brand-text">shiftbloom studio</p>
          <p>Fabian Zimber</p>
          <p>Hamburg, Deutschland</p>
        </div>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">Kontakt</h2>
        <div className="text-brand-muted space-y-1">
          <p>
            E-Mail:{" "}
            <a
              href="mailto:fabian@shiftbloom.studio"
              className="text-brand-primary hover:underline"
            >
              fabian@shiftbloom.studio
            </a>
          </p>
          <p>Telefon: +49 (0) 163 8552 708</p>
          <p>
            Website:{" "}
            <a
              href="https://shiftbloom.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline"
            >
              shiftbloom.studio
            </a>
          </p>
        </div>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">
          Verantwortlich f&uuml;r den Inhalt gem. &sect; 18 Abs. 2 MStV
        </h2>
        <div className="text-brand-muted space-y-1">
          <p>Fabian Zimber</p>
          <p>Hamburg, Deutschland</p>
        </div>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">EU-Streitschlichtung</h2>
        <p className="text-brand-muted">
          Die Europ&auml;ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
          bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-primary hover:underline break-all"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p className="text-brand-muted">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">
          Verbraucherstreitbeilegung / Universalschlichtungsstelle
        </h2>
        <p className="text-brand-muted">
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <section className="glass-deep rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-brand-text">Haftungsausschluss</h2>

        <div className="space-y-3">
          <h3 className="font-medium text-brand-text">Haftung f&uuml;r Inhalte</h3>
          <p className="text-brand-muted text-sm">
            Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs. 1 DDG f&uuml;r eigene
            Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            &sect;&sect; 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet,
            &uuml;bermittelte oder gespeicherte fremde Informationen zu &uuml;berwachen oder nach
            Umst&auml;nden zu forschen, die auf eine rechtswidrige T&auml;tigkeit hinweisen.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-brand-text">Haftung f&uuml;r Links</h3>
          <p className="text-brand-muted text-sm">
            Unser Angebot enth&auml;lt Links zu externen Websites Dritter, auf deren Inhalte wir
            keinen Einfluss haben. Deshalb k&ouml;nnen wir f&uuml;r diese fremden Inhalte auch keine
            Gew&auml;hr &uuml;bernehmen. F&uuml;r die Inhalte der verlinkten Seiten ist stets der
            jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-brand-text">Urheberrecht</h3>
          <p className="text-brand-muted text-sm">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielf&auml;ltigung, Bearbeitung, Verbreitung und jede
            Art der Verwertung au&szlig;erhalb der Grenzen des Urheberrechtes bed&uuml;rfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </div>
      </section>
    </article>
  );
}
