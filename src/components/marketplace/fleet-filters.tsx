"use client";

type FleetFiltersProps = {
  filters: Array<{
    title: string;
    options: string[];
  }>;
  selectedFilters: Record<string, string[]>;
  onToggleFilter: (groupTitle: string, option: string) => void;
  onResetFilters: () => void;
};

export function FleetFilters({
  filters,
  selectedFilters,
  onToggleFilter,
  onResetFilters,
}: FleetFiltersProps) {
  return (
    <aside className="fleet-panel__left">
      <nav className="fleet-filter-nav" aria-label="Fleet filters">
        <div className="fleet-filter-block">
          <div className="fleet-filter-heading">
            <span className="fleet-filter-icon" />
            <h4>Filter Fleet</h4>
          </div>
        </div>

        {filters.map((group) => (
          <section key={group.title} className="fleet-filter-block">
            <h5>{group.title}</h5>
            <div className="fleet-filter-options">
              {group.options.map((option) => (
                <label key={option} className="fleet-filter-option">
                  <input
                    type="checkbox"
                    checked={(selectedFilters[group.title] ?? []).includes(option)}
                    onChange={() => onToggleFilter(group.title, option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </section>
        ))}

        <button type="button" className="button-primary fleet-apply-button" onClick={onResetFilters}>
          Reset Filters
        </button>
      </nav>
    </aside>
  );
}
