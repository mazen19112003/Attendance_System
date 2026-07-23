import React, { useState } from "react";
// import { useState } from "react";
import { addUser } from "../api";

const DEPARTMENTS = ["الموارد البشرية", "المبيعات", "التسويق", "المحاسبة", "تقنية المعلومات"];

export default function UserForm({ onAdded }) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        <select
          id="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <button className="submit-btn" type="submit" disabled={loading}>
        {loading ? "جاري الإضافة..." : "إضافة اليوزر"}
      </button>
    </form>
  );
}
