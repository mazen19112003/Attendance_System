import React from "react";
const PALETTE = [
  { bg: "#e4efe6", fg: "#3f5f4b" },
  { bg: "#fbe4cc", fg: "#a05a1e" },
  { bg: "#e3ecf6", fg: "#2f5788" },
  { bg: "#f3e3ee", fg: "#8a3d74" },
  { bg: "#f6ecdd", fg: "#8a6a2f" },
];

function colorFor(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function UserList({ users, loading }) {
  return (
    <div className="card">
      <div className="section-title">
        <span>اليوزرز</span>
        <span className="count-pill">{users.length} يوزر</span>
      </div>

      {loading ? (
        <div className="loading-state">بنجيب اليوزرز...</div>
      ) : users.length === 0 ? (
        <div className="empty-state">لسه مفيش يوزرز، ضيف أول واحد من فوق</div>
      ) : (
        <ul className="user-list">
          {users.map((user) => {
            const color = colorFor(user.department || "");
            return (
              <li className="user-item" key={user._id || user.id}>
                <span className="user-name">{user.name}</span>
                <span
                  className="dept-tag"
                  style={{ background: color.bg, color: color.fg }}
                >
                  {user.department}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
