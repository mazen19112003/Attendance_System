import React, { useState } from "react";
import { addDepartment } from "../api";

export default function DepForm({ onAdded }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("من فضلك ادخل اسم القسم");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await addDepartment(name.trim());
      setName("");
      onAdded(); // بنعمل ريفريش لقايمة الأقسام بعد الإضافة
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
        <label htmlFor="depname">اسم القسم</label>
        <input
          id="depname"
          type="text"
          placeholder="مثال: المبيعات"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button className="submit-btn" type="submit" disabled={loading}>
        {loading ? "جاري الإضافة..." : "إضافة القسم"}
      </button>
    </form>
  );
}
