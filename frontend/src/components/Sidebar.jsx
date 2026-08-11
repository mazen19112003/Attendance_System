import React from "react";

const NAV_ITEMS = [
  {
    key: "users",
    label: "اليوزرز",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M5 20c0-3.6 3.13-6 7-6s7 2.4 7 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "departments",
    label: "الأقسام",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="10" width="6" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
        <rect x="14" y="6" width="6" height="14" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "attendance",
    label: "متابعة العمل",
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Sidebar({ active, onChange, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-dot" />
        <span>لوحة الإدارة</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${active === item.key ? "active" : ""}`}
            onClick={() => onChange(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="nav-item logout-item" onClick={onLogout}>
        <span className="nav-icon">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 17l5-5-5-5M20 12H9M12 19H6a2 2 0 01-2-2V7a2 2 0 012-2h6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>تسجيل خروج</span>
      </button>
    </aside>
  );
}
