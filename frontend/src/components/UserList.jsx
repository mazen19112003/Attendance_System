import React, { useEffect, useState } from "react";
import { fetchDepartments, updateUser, deleteUser } from "../api";

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

export default function UserList({ users, loading, onChanged }) {
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDept, setEditDept] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDepartments()
      .then(setDepartments)
      .catch(() => {});
  }, []);

  const startEdit = (user) => {
    setEditingId(user._id);
    setEditName(user.name);
    setEditDept(user.department || "");
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    if (!editName.trim()) {
      setError("الاسم مينفعش يبقى فاضي");
      return;
    }
    setSavingId(id);
    setError("");
    try {
      await updateUser(id, { name: editName.trim(), department: editDept });
      setEditingId(null);
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("متأكد إنك عايز تمسح اليوزر ده؟")) return;
    setDeletingId(id);
    setError("");
    try {
      await deleteUser(id);
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card">
      <div className="section-title">
        <span>اليوزرز</span>
        <span className="count-pill">{users.length} يوزر</span>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading-state">بنجيب اليوزرز...</div>
      ) : users.length === 0 ? (
        <div className="empty-state">لسه مفيش يوزرز، ضيف أول واحد من فوق</div>
      ) : (
        <ul className="user-list">
          {users.map((user) => {
            const color = colorFor(user.department || "");
            const isEditing = editingId === user._id;

            if (isEditing) {
              return (
                <li className="user-item editing" key={user._id}>
                  <div className="edit-fields">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="الاسم"
                    />
                    <select value={editDept} onChange={(e) => setEditDept(e.target.value)}>
                      <option value="">بدون قسم</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d.Depname}>
                          {d.Depname}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row-actions">
                    <button
                      className="icon-btn save-btn"
                      onClick={() => saveEdit(user._id)}
                      disabled={savingId === user._id}
                    >
                      {savingId === user._id ? "..." : "حفظ"}
                    </button>
                    <button className="icon-btn" onClick={cancelEdit}>
                      إلغاء
                    </button>
                  </div>
                </li>
              );
            }

            return (
              <li className="user-item" key={user._id}>
                <span className="user-name">{user.name}</span>
                <div className="row-actions">
                  <span
                    className="dept-tag"
                    style={{ background: color.bg, color: color.fg }}
                  >
                    {user.department || "بدون قسم"}
                  </span>
                  <button className="icon-btn" onClick={() => startEdit(user)}>
                    تعديل
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => handleDelete(user._id)}
                    disabled={deletingId === user._id}
                  >
                    {deletingId === user._id ? "..." : "حذف"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}