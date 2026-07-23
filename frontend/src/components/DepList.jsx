import React from "react";

export default function DepList({ departments, loading }) {
  return (
    <div className="card">
      <div className="section-title">
        <span>الأقسام</span>
        <span className="count-pill">{departments.length} قسم</span>
      </div>

      {loading ? (
        <div className="loading-state">بنجيب الأقسام...</div>
      ) : departments.length === 0 ? (
        <div className="empty-state">لسه مفيش أقسام، ضيف أول واحد من فوق</div>
      ) : (
        <ul className="user-list">
          {departments.map((dep) => (
            <li className="user-item" key={dep._id}>
              <span className="user-name">{dep.Depname}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
