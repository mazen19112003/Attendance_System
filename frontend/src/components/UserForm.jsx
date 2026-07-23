import React, { useEffect, useState } from "react";
import { addUser, fetchDepartments } from "../api";

export default function UserForm({ onAdded }) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [depsLoading, setDepsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setDepsLoading(true);
    try {
      const data = await fetchDepartments();
      setDepartments(data);
      if (data.length > 0) setDepartment(data[0].Depname);
    } catch (err) {
      setError(err.message);
    } finally {
      setDepsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("من فضلك ادخل الاسم");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const newUser = await addUser({ name: name.trim(), department });
      onAdded(newUser);
      setName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      {error && <div className="error-msg">{error}</div>}

      <div className="form-row">
        <label htmlFor="name">الاسم</label>
        <input
          id="name"
          type="text"
          placeholder="اكتب الاسم هنا"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="department">القسم</label>
        {depsLoading ? (
          <div className="loading-state">بنجيب الأقسام...</div>
        ) : departments.length === 0 ? (
          <div className="empty-state">لسه مفيش أقسام، ضيفها الأول من صفحة الأقسام</div>
        ) : (
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map((dep) => (
              <option key={dep._id} value={dep.Depname}>
                {dep.Depname}
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        className="submit-btn"
        type="submit"
        disabled={loading || departments.length === 0}
      >
        {loading ? "جاري الإضافة..." : "إضافة اليوزر"}
      </button>
    </form>
  );
}
