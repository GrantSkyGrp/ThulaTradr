import { submitContactRequestAction } from "@/app/actions";
import { SectionHeading } from "@/components/ui/section-heading";
import { getActiveBrand } from "@/lib/branding/get-active-brand";
import { getPageContent } from "@/lib/local-db";

type ContactPageProps = {
  searchParams?: Promise<{ success?: string; error?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const brand = getActiveBrand();
  const content = await getPageContent("contact");
  const params = searchParams ? await searchParams : undefined;

  return (
    <main className="content-section">
      <div className="container-shell split-panel">
        <div>
          <SectionHeading
            eyebrow={content?.eyebrow ?? "Contact"}
            title={content?.title ?? `Get in touch with ${brand.name}.`}
            description={
              content?.description ??
              "The Thula implementation will keep the same enquiry entry points as the current app while moving contact content into brand configuration."
            }
          />
          <div className="ambient-card">
            <p>
              Brand contact data is configuration-driven so future white-label
              brands can use the same form and page structure with different
              content and routing.
            </p>
          </div>
        </div>
        <div className="ambient-card">
          <form action={submitContactRequestAction} className="auth-form">
            <label className="auth-field">
              <span>Name</span>
              <input type="text" name="name" placeholder="Your name" required />
            </label>
            <label className="auth-field">
              <span>Email</span>
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
            <label className="auth-field">
              <span>Message</span>
              <textarea
                name="message"
                className="auth-textarea"
                placeholder="Tell us about your fleet or project"
                required
              />
            </label>
            <button type="submit" className="site-nav__button">
              Send Enquiry
            </button>
          </form>

          {params?.success === "1" ? (
            <p className="account-copy">Enquiry submitted successfully.</p>
          ) : null}

          <div className="feature-list">
            <div>
              <strong>Email</strong>
              <p>{brand.contactEmail}</p>
            </div>
            <div>
              <strong>Phone</strong>
              <p>{brand.contactPhone}</p>
            </div>
            <div>
              <strong>Address</strong>
              <p>{brand.contactAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
