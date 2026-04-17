const items = Array.from({ length: 8 }, () => "Sustainable • Silent • Unforgettable •");

export function ThulaBannerCarousel() {
  return (
    <div className="thula-banner-carousel" aria-label="Thula brand highlights">
      <div className="thula-banner-carousel__track">
        {items.map((item, index) => (
          <span key={`primary-${index}`}>{item}</span>
        ))}
      </div>
      <div className="thula-banner-carousel__track thula-banner-carousel__track--secondary" aria-hidden="true">
        {items.map((item, index) => (
          <span key={`secondary-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
