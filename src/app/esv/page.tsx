import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thula ESV | Electric Safari Vehicle",
  description: "Sub-Saharan Africa's first electric safari vehicle.",
};

const esvHeroVideoUrl = "https://media.thula.africa/videos/Website_ESV_001.mov";
const esvFlyerUrl = "https://media.thula.africa/flyers/ThulaESV_v2.pdf";
const esvImages = {
  heroPoster: "https://thula.africa/images/IMG_9501.png",
  silence: "https://thula.africa/images/img_esv_section02_01.jpg",
  wildlife: "https://thula.africa/images/buck-1.png",
  comfort: "https://thula.africa/images/img_esv_section03_01.png",
  comfortSecondary: "https://thula.africa/images/IMG_9501.png",
  durability: "https://thula.africa/images/img_esv_section04_01.jpg",
  eco: "https://thula.africa/images/Giraffe-desktop-1.png",
  specs: "https://thula.africa/images/cleared-esv.png",
  optionalBg: "https://thula.africa/images/optional_inclusion_bg02.jpg",
  ctaBg: "https://thula.africa/images/ready_to_ride_bg.jpg",
  eboat: "https://thula.africa/images/eBoat-1.png",
};

const specs = [
  {
    title: "Performance and Range",
    items: [
      ["Drivetrain", "AWD via dual motors: 300kW and 660Nm"],
      ["Range", "200km"],
      ["LFP Battery", "Battery capacity: 65kWh"],
      ["Suspension", "Independent front and rear suspension"],
    ],
  },
  {
    title: "Efficient Charging",
    items: [
      ["Charging Time", "6 hours via 10kW three phase or 6.6kW single phase"],
      ["Cost Efficiency", "Zero fuel costs with solar power integration"],
    ],
  },
  {
    title: "Other Features",
    items: [
      ["Hassle-Free Maintenance", "Minimal moving parts with less wear and tear"],
      ["Regenerative Braking", "Reduced wear on braking components"],
      ["Vehicle to Load", "On-board power up to 5kW AC 230V"],
    ],
  },
  {
    title: "Pricing",
    items: [
      ["Starting Price", "Starting at R1 750 000 excl. VAT"],
      ["Custom Quote", "Contact us for a quote based on your final specification"],
    ],
  },
];

const optionalInclusions = [
  "Rear Fridge",
  "Colour",
  "Sundowner Chairs and Table",
  "Seating Configuration",
  "Heated Seats",
  "Coffee Machine",
  "Tracker Seat",
];

export default function EsvPage() {
  return (
    <main className="esv-page-shell">
      <section className="esv-hero">
        <video
          className="esv-hero__video"
          src={esvHeroVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          poster={esvImages.heroPoster}
        />
        <div className="container-shell esv-hero__content">
          <div className="esv-hero__eyebrow">Sub-Saharan Africa&apos;s first electric safari vehicle</div>
          <h1 className="esv-hero__title">
            <span>The Future</span>
            <span>Of Safari Awaits</span>
          </h1>
          <div className="esv-hero__actions">
            <Link href="/contact" className="button-primary">
              Reserve now
            </Link>
            <Link href="/contact" className="button-secondary">
              Contact us
            </Link>
            <a href={esvFlyerUrl} className="button-secondary" target="_blank" rel="noreferrer">
              Download Flyer
            </a>
          </div>
        </div>
      </section>

      <section className="esv-section">
        <div className="container-shell esv-intro-grid">
          <div className="esv-section__heading">
            <h2>Explore the Electric Safari Vehicle (ESV)</h2>
          </div>

          <div className="esv-intro-column">
            <div className="esv-copy-block esv-copy-block--intro">
              <h3>Engineered for silence</h3>
              <p>
                Experience the untouched beauty of the African bush as you glide through in
                silence, enveloped by the sounds of nature. Without the noise of a
                traditional engine, every rustle, call, and whisper from the wild surrounds
                you.
              </p>
            </div>
            <div className="esv-media-card esv-media-card--tall">
              <img src={esvImages.wildlife} alt="Wildlife in the bush" />
            </div>
          </div>

          <div className="esv-intro-column">
            <div className="esv-media-card esv-media-card--wildlife">
              <img src={esvImages.silence} alt="Electric safari vehicle among wildlife" />
            </div>
            <div className="esv-copy-block esv-copy-block--support">
              <p>
                With Thula&apos;s electric safari vehicle, your guests can enjoy effortless
                dialogue between guides and passengers while staying fully immersed in the
                sounds of nature. The quiet operation also opens up better photography
                opportunities without engine vibration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="esv-section esv-section--cream">
        <div className="container-shell esv-comfort-grid">
          <div className="esv-comfort-stack" aria-hidden="true">
            <div className="esv-comfort-card esv-comfort-card--single">
              <img src={esvImages.comfort} alt="" />
            </div>
          </div>
          <div className="esv-copy-block esv-copy-block--comfort">
            <h2>Designed for comfort</h2>
            <p>
              With Thula&apos;s ESV independent suspension, you&apos;ll experience
              unmatched comfort on all terrains, from bumpy dirt tracks to challenging
              riverbeds.
            </p>
            <p>
              This electric safari vehicle transforms the safari drive into an
              exhilarating journey, combining guest comfort with technical capability.
            </p>
          </div>
        </div>
      </section>

      <section className="esv-section">
        <div className="container-shell esv-two-up esv-two-up--center">
          <div className="esv-copy-block">
            <div className="esv-section-label">Built to Endure</div>
            <h2>Built for durability and reliability</h2>
            <p>
              Thula&apos;s ESV combines advanced management systems, independent
              suspension, a low centre of gravity, and instantaneous torque to deliver
              strength, control, and versatility across demanding terrain.
            </p>
            <p>
              Designed with fewer moving parts than traditional vehicles, the ESV
              promises a longer lifespan and uses regenerative braking to reduce wear
              while recycling energy back into the system.
            </p>
          </div>
          <div className="esv-media-card esv-media-card--large">
            <img src={esvImages.durability} alt="Thula ESV built for durability" />
          </div>
        </div>
      </section>

      <section className="esv-eco">
        <img className="esv-eco__bg" src={esvImages.eco} alt="Giraffes in the African bush" />
        <div className="container-shell esv-eco__inner">
          <div className="esv-section-label">Sustainability</div>
          <h2>Designed to be eco-friendly</h2>
          <p>
            Thula Solutions is driven by a passion for the African bush and a commitment
            to sustainability. Founded in 2017, the brand set out to develop greener ways
            to power eco-tourism.
          </p>
          <p>
            Our vehicles are quieter, produce fewer emissions, and help preserve the
            wilderness we hold sacred so future generations can experience the beauty of
            the bush with less environmental impact.
          </p>
        </div>
      </section>

      <section className="esv-specs">
        <div className="container-shell esv-specs__grid">
          <div className="esv-specs__visual">
            <img src={esvImages.specs} alt="Thula ESV side profile" />
          </div>
          <div className="esv-specs__content">
            <div className="esv-section-label">Technical Detail</div>
            <h2>Specs</h2>
            <div className="esv-accordion">
              {specs.map((group, index) => (
                <details key={group.title} className="esv-accordion__item" open={index === 0}>
                  <summary>{group.title}</summary>
                  <div className="esv-accordion__panel">
                    {group.items.map(([label, value]) => (
                      <div key={label} className="esv-spec-row">
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="esv-options">
        <div className="container-shell esv-options__grid">
          <div
            className="esv-options__hero"
            style={{ backgroundImage: `linear-gradient(rgba(26, 20, 15, 0.24), rgba(26, 20, 15, 0.42)), url("${esvImages.optionalBg}")` }}
          >
            <div className="esv-section-label esv-section-label--light">Optional Add-ons</div>
            <h2>Optional inclusions</h2>
            <p>
              Tailor every aspect of the journey with add-ons designed for comfort,
              utility, and a more memorable guest experience.
            </p>
          </div>
          <div className="esv-options__list">
            {optionalInclusions.map((item) => (
              <article key={item} className="esv-option-card">
                <div className="esv-option-card__icon" aria-hidden="true">
                  +
                </div>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="esv-ready"
        style={{ backgroundImage: `linear-gradient(rgba(20, 13, 8, 0.38), rgba(20, 13, 8, 0.5)), url("${esvImages.ctaBg}")` }}
      >
        <div className="container-shell esv-ready__inner">
          <div className="esv-section-label esv-section-label--light">Ready to move</div>
          <h2>Ready to ride?</h2>
          <Link href="/contact" className="button-primary button-primary--dark">
            Reserve your ESV today
          </Link>
        </div>
      </section>

      <section className="esv-crosslink">
        <div className="esv-crosslink__copy">
          <div className="esv-section-label esv-section-label--light">On the water</div>
          <h3>Explore the eBoat</h3>
          <p>
            Extend the same quiet, sustainability-led guest experience to rivers, lakes,
            and lodge water routes with a tailored electric boating solution.
          </p>
          <Link href="/boat" className="esv-crosslink__cta">
            View eBoat
          </Link>
        </div>
        <div className="esv-crosslink__visual">
          <img src={esvImages.eboat} alt="Thula eBoat" />
        </div>
      </section>

      <section className="esv-wordmark">
        <div className="esv-wordmark__track">
          <span>Immersive</span>
          <span>Silent</span>
          <span>Electric</span>
          <span>Immersive</span>
          <span>Silent</span>
          <span>Electric</span>
          <span>Immersive</span>
          <span>Silent</span>
          <span>Electric</span>
        </div>
      </section>

      <section className="esv-end-cta">
        <div className="container-shell esv-end-cta__inner">
          <Link href="/contact" className="button-primary button-primary--dark">
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
