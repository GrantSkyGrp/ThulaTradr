import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thula Electric Boat | Quiet. Clean. Capable.",
  description:
    "Whisper-quiet electric boating for rivers, lakes, and deltas. Zero emissions, smooth torque, and unforgettable water safaris.",
};

const boatVideoUrl = "https://media.thula.africa/videos/Thula_Website_eBoat_3.mov";
const boatFlyerUrl = "https://media.thula.africa/flyers/Thula%20eBoat.pdf";
const boatImages = {
  heroPoster: "https://thula.africa/images/Eboat.png",
  water: "https://thula.africa/images/closeup-blue-sea-surface-1.png",
  story: "https://thula.africa/images/IMG_9112-1.png",
  esv: "https://thula.africa/images/sign-in-background.jpg",
};

const boatFeatures = [
  {
    icon: "Leaf",
    title: "Sustainability",
    description:
      "Zero-emission electric motors with solar-powered options for complete off-grid operation.",
  },
  {
    icon: "Sprout",
    title: "Eco-Friendly",
    description:
      "Protect Africa's fragile ecosystems with electric motors that eliminate harmful pollutants, unburnt fuel, and oil residue.",
  },
  {
    icon: "Sound",
    title: "Silent operation",
    description:
      "Glide through rivers and lakes in near silence so guests fully experience the sounds of nature without engine noise.",
  },
  {
    icon: "Save",
    title: "Lower operating costs",
    description:
      "Minimal maintenance and no fuel costs provide significant long-term savings for eco-lodges.",
  },
  {
    icon: "Power",
    title: "Onboard power",
    description:
      "Unlock new possibilities with 5kW AC power-run a fridge, coffee machine, or induction hobs to elevate guest experiences.",
  },
];

export default function BoatPage() {
  return (
    <main className="boat-page-shell">
      <section className="boat-live-hero">
        <video
          className="boat-live-hero__video"
          src={boatVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          poster={boatImages.heroPoster}
        />
        <div className="container-shell boat-live-hero__content">
          <h1 className="boat-live-hero__title">Engineered for excellence crafted for silence</h1>
          <div className="boat-live-hero__actions">
            <Link href="/contact" className="button-primary">
              Contact us
            </Link>
            <Link href="/" className="button-secondary">
              Back to home
            </Link>
            <a href={boatFlyerUrl} className="button-secondary" target="_blank" rel="noreferrer">
              Download Flyer
            </a>
          </div>
        </div>
      </section>

      <section
        className="boat-water-band"
        style={{
          backgroundImage: `linear-gradient(rgba(154, 123, 82, 0.86), rgba(154, 123, 82, 0.86)), url("${boatImages.water}")`,
        }}
      >
        <div className="container-shell boat-water-band__inner">
          <p>
            Our advanced powertrains for electric boats ensure a smooth, quiet ride.
            Enjoy nature&apos;s symphony with only the gentle lapping of water
            accompanying you on your journey.
          </p>
          <p>
            Experience the tranquillity of the water and capture stunning photographs
            without the disturbance of vibrations, ensuring a truly eco-friendly and
            engaging wildlife adventure.
          </p>
        </div>
      </section>

      <section
        className="boat-story-panel"
        style={{
          backgroundImage: `linear-gradient(rgba(154, 123, 82, 0.72), rgba(154, 123, 82, 0.72)), url("${boatImages.story}")`,
        }}
      >
        <div className="container-shell boat-story-panel__inner">
          <div className="boat-story-panel__copy">
            <h2>Silence on the water</h2>
            <p>
              Introducing our state-of-the-art electric boat, designed specifically for
              the eco-tourism and safari market.
            </p>
            <p>
              In collaboration with ePropulsion, we provide a fully electric boating
              solution that ensures a tranquil, noise-free journey while safeguarding the
              natural environment.
            </p>
            <p>
              Our electric boats are perfect for safari lodges aiming to stand out with
              sustainable practices, offering guests an unparalleled and immersive
              experience. Embrace sustainability and elevate your guests&apos; adventures
              with Thula.
            </p>
            <h3>Customized to your needs</h3>
            <p>
              Each eBoat setup is tailored to meet the specific needs of every lodge or
              use case, delivering versatile, quiet, and sustainable solutions that work
              with both nature and technology. Contact us to discover our eBoat offerings,
              each designed for a unique, custom experience on the water.
            </p>
          </div>
        </div>
      </section>

      <section className="boat-live-features">
        <div className="container-shell">
          <div className="boat-live-features__header">
            <div className="boat-section-label">Features</div>
            <h2>Engineered for experience</h2>
          </div>

          <div className="boat-live-features__grid boat-live-features__grid--three">
            {boatFeatures.slice(0, 3).map((feature) => (
              <article key={feature.title} className="boat-live-feature">
                <div className="boat-live-feature__icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="boat-live-features__grid boat-live-features__grid--two">
            {boatFeatures.slice(3).map((feature) => (
              <article key={feature.title} className="boat-live-feature">
                <div className="boat-live-feature__icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="boat-esv-link">
        <div className="boat-esv-link__copy">
          <h3>Explore the ESV</h3>
          <p>
            Engineered for silence, it allows you to fully immerse yourself in
            nature&apos;s symphony. Instead of engine noise, you&apos;ll hear the
            chirping of birds, the rustle of leaves, and the surrounding wildscape.
          </p>
          <Link
            href="/esv"
            className="boat-esv-link__cta"
            aria-label="Explore the Electric Safari Vehicle"
          >
            →
          </Link>
        </div>
        <div className="boat-esv-link__visual">
          <img src={boatImages.esv} alt="Electric Safari Vehicle" />
        </div>
      </section>

      <section className="boat-live-footer-cta">
        <div className="container-shell boat-live-footer-cta__inner">
          <Link href="/contact" className="button-primary">
            Talk to us
          </Link>
          <Link href="/" className="button-secondary--outline">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
