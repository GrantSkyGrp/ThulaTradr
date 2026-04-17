import { loginAction } from "@/app/actions";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const showError = params?.error === "invalid";

  return (
    <main className="auth-shell">
      <div className="container-shell auth-grid">
        <section className="auth-card">
          <div className="thula-kicker">Sign In</div>
          <h1 className="auth-title">Access your Thula account</h1>
          <p className="auth-copy">
            This is a local-only sign-in for the rewrite. It does not connect to any
            live SkyTradr environment.
          </p>

          <form action={loginAction} className="auth-form">
            <label className="auth-field">
              <span>Email</span>
              <input type="email" name="email" placeholder="buyer@thula.local" required />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input type="password" name="password" placeholder="demo1234" required />
            </label>

            <button type="submit" className="button-primary auth-button">
              Sign In
            </button>
          </form>

          {showError ? (
            <div className="offer-panel__error">Invalid email or password.</div>
          ) : null}
        </section>

        <aside className="auth-card auth-card--muted">
          <h2>Demo accounts</h2>
          <div className="auth-demo-list">
            <div>
              <strong>Buyer</strong>
              <p>buyer@thula.local</p>
              <p>demo1234</p>
            </div>
            <div>
              <strong>Admin</strong>
              <p>admin@thula.local</p>
              <p>demo1234</p>
            </div>
            <div>
              <strong>Operations</strong>
              <p>ops@thula.local</p>
              <p>demo1234</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
