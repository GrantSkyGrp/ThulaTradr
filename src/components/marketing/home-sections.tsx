import Image from "next/image";
import Link from "next/link";
import type { BrandConfig } from "@/lib/branding/types";
import thulaEboat from "../../../public/Thula eboat.png";
import { ThulaBannerCarousel } from "@/components/marketing/thula-banner-carousel";

type HomeSectionsProps = {
  brand: BrandConfig;
};

export function HomeSections({ brand }: HomeSectionsProps) {
  return (
    <>
      <section className="thula-immersive">
        <div className="container-shell">
          <div className="thula-immersive__grid">
            <div className="thula-immersive__headline">
              <h2 className="thula-immersive__heading">
                Immersive nature experiences tailored with guests in mind
              </h2>
            </div>

            <div className="thula-immersive__media thula-immersive__media--top">
              <Image
                src={thulaEboat}
                alt="Thula electric boat on the water"
                className="thula-immersive__image thula-immersive__image--boat"
                sizes="(max-width: 1000px) 100vw, 40vw"
                quality={100}
                placeholder="blur"
              />
            </div>

            <div className="thula-immersive__media thula-immersive__media--bottom">
              <Image
                src="https://thula.africa/images/img_home_section02_01.jpg"
                alt="Electric safari vehicle in the African bush"
                width={900}
                height={900}
                className="thula-immersive__image"
                sizes="(max-width: 1000px) 100vw, 40vw"
                quality={100}
              />
            </div>

            <div className="thula-immersive__body">
              <p className="thula-immersive__copy">
                Immerse yourself in nature&apos;s sounds
                <br />
                and enjoy an exceptional, eco-friendly
                <br />
                experience like never before.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="thula-why">
        <div className="container-shell">
          <div className="thula-why__intro">
            <h2 className="thula-why__title">Why choose Thula</h2>
          </div>

          <div className="thula-why__grid">
            {brand.home.whyChoose.features.map((feature) => (
              <article key={feature.title} className="thula-why__card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="thula-showcase">
        <div className="container-shell">
          <div className="thula-product-grid">
            <article className="thula-product-card">
              <div className="thula-showcase__img">
                <img
                  src="https://thula.africa/images/img_esv_section02_01.jpg"
                  alt="Thula ESV exploring the African wilderness"
                  className="thula-showcase__image"
                />
                <div className="thula-showcase__copy">
                  <div className="thula-kicker--dark">The Marketplace</div>
                  <h2>Explore the Electric Safari Vehicle (ESV)</h2>
                  <p>
                    Experience the untouched beauty of the African bush as you glide
                    through in silence. South Africa&apos;s first all-electric,
                    all-wheel-drive game vehicle, engineered for the terrain,
                    designed for the guest.
                  </p>
                  <Link
                    href="/esv"
                    className="thula-showcase__arrow"
                    aria-label="Explore ESV"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </article>

            <article className="thula-product-card">
              <div className="thula-showcase__img">
                <Image
                  src={thulaEboat}
                  alt="Thula electric boat on the water"
                  className="thula-showcase__image thula-showcase__image--boat"
                  sizes="(max-width: 1000px) 100vw, 40vw"
                  quality={100}
                />
                <div className="thula-showcase__copy">
                  <div className="thula-kicker--dark">On The Water</div>
                  <h2>Discover the Thula eBoat</h2>
                  <p>
                    Extend the same quiet, sustainability-led guest experience to rivers,
                    lakes, and lodge water routes with a tailored fully electric boat
                    solution.
                  </p>
                  <Link
                    href="/boat"
                    className="thula-showcase__arrow"
                    aria-label="Explore eBoat"
                  >
                    Discover
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div className="thula-marquee">
        <ThulaBannerCarousel />
      </div>

      <section className="thula-partner">
        <div className="container-shell">
          <div className="thula-kicker--dark">Fleet Enquiries</div>
          <h2>{brand.home.closingCta.title}</h2>
          <p className="thula-partner__sub">{brand.home.closingCta.description}</p>
          <div className="thula-actions">
            <Link href="/marketplace" className="button-primary button-primary--dark">
              {brand.home.closingCta.primaryLabel}
            </Link>
            <Link href="/contact" className="button-secondary--outline">
              {brand.home.closingCta.secondaryLabel}
            </Link>
          </div>
          <div className="thula-partner__contact">
            <span>Email us</span>
            <a href={`mailto:${brand.contactEmail}`}>{brand.contactEmail}</a>
          </div>
        </div>
      </section>
    </>
  );
}
