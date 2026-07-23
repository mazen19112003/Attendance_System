import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  fetchUsers,
  recordExit,
  recordEntry,
  saveNotes,
  fetchByDay,
  fetchLastExit,
} from "../api";

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDayLabel(dayStr) {
  const d = new Date(`${dayStr}T00:00:00`);
  return d.toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("ar-EG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// للسجلات اليدوي (تاريخ بس من غير وقت) بنعرض التاريخ بس
function formatLastExit(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  const isMidnight = d.getHours() === 0 && d.getMinutes() === 0;
  if (isMidnight) {
    return d.toLocaleDateString("ar-EG", { day: "numeric", month: "short", year: "numeric" });
  }
  return formatDateTime(iso);
}

export default function AttendancePage() {
  const [sheetDate, setSheetDate] = useState(todayStr());

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState("");

  const [mode, setMode] = useState("exit"); // "exit" | "entry" | "lastExit"
  const [timeValue, setTimeValue] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [lastExitInfo, setLastExitInfo] = useState(null);

  const [notesValue, setNotesValue] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);

  const [manualDate, setManualDate] = useState(todayStr());
  const [manualLoading, setManualLoading] = useState(false);

  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadRecords(sheetDate);
  }, [sheetDate]);

  // لما يتغير الموظف أو اليوم، نجيب الملاحظة المسجلة قبل كده (لو موجودة) ونحطها في الخانة
  useEffect(() => {
    const existing = records.find((r) => r.user === selectedUser);
    setNotesValue(existing?.notes || "");
    setLastExitInfo(null);
  }, [selectedUser, records]);

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
      if (data.length > 0) setSelectedUser(data[0]._id);
    } catch (err) {
      setError(err.message);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadRecords = async (day) => {
    setRecordsLoading(true);
    try {
      const data = await fetchByDay(day);
      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleSaveTime = async (e) => {
    e.preventDefault();
    if (!selectedUser || !timeValue) {
      setError("من فضلك اختار الموظف والوقت");
      return;
    }

    setActionLoading(true);
    setError("");
    try {
      const iso = `${sheetDate}T${timeValue}:00`;
      if (mode === "exit") {
        await recordExit({ userId: selectedUser, day: sheetDate, exitTime: iso });
      } else {
        await recordEntry({ userId: selectedUser, day: sheetDate, entryTime: iso });
      }
      setTimeValue("");
      await loadRecords(sheetDate);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckLastExit = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setError("");
    try {
      const last = await fetchLastExit(selectedUser);
      const currentUser = users.find((u) => u._id === selectedUser);
      setLastExitInfo({
        name: currentUser ? currentUser.name : "",
        exitTime: last ? last.exitTime : null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveManualExit = async () => {
    if (!selectedUser || !manualDate) {
      setError("من فضلك حدد التاريخ");
      return;
    }

    setManualLoading(true);
    setError("");
    try {
      const iso = `${manualDate}T00:00:00`;
      await recordExit({ userId: selectedUser, day: manualDate, exitTime: iso });
      // نحدث النتيجة على طول عشان يظهر التاريخ اللي دخلناه دلوقتي
      const currentUser = users.find((u) => u._id === selectedUser);
      setLastExitInfo({ name: currentUser ? currentUser.name : "", exitTime: iso });
      // بنحدث ريبورت اليوم المعروض دايمًا، عشان عمود "آخر خروج ليه" ممكن يتأثر بالسجل الجديد
      await loadRecords(sheetDate);
    } catch (err) {
      setError(err.message);
    } finally {
      setManualLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedUser) return;
    setNotesLoading(true);
    setError("");
    try {
      await saveNotes({ userId: selectedUser, day: sheetDate, notes: notesValue });
      await loadRecords(sheetDate);
    } catch (err) {
      setError(err.message);
    } finally {
      setNotesLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const handleExportExcel = () => {
    const rows = records.map((r) => ({
      التاريخ: r.day,
      الاسم: r.name,
      القسم: r.department || "",
      "وقت الخروج": formatTime(r.exitTime),
      "وقت الدخول": formatTime(r.entryTime),
      "آخر خروج ليه": formatLastExit(r.previousExitTime),
      ملاحظات: r.notes || "",
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);
    sheet["!cols"] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 16 },
      { wch: 14 },
      { wch: 14 },
      { wch: 18 },
      { wch: 26 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "الحضور");
    XLSX.writeFile(workbook, `${sheetDate}.xlsx`);
  };

  return (
    <>
      <div className="card no-print">
        {error && <div className="error-msg">{error}</div>}

        <div className="form-row">
          <label htmlFor="sheet-date">تاريخ اليوم</label>
          <input
            id="sheet-date"
            type="date"
            value={sheetDate}
            onChange={(e) => setSheetDate(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="employee">الموظف</label>
          {usersLoading ? (
            <div className="loading-state">بنجيب الموظفين...</div>
          ) : users.length === 0 ? (
            <div className="empty-state">لسه مفيش موظفين مضافين</div>
          ) : (
            <select
              id="employee"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mode-toggle">
          <button
            type="button"
            className={`tab-btn ${mode === "exit" ? "active" : ""}`}
            onClick={() => setMode("exit")}
          >
            تسجيل خروج
          </button>
          <button
            type="button"
            className={`tab-btn ${mode === "entry" ? "active" : ""}`}
            onClick={() => setMode("entry")}
          >
            تسجيل دخول
          </button>
          <button
            type="button"
            className={`tab-btn ${mode === "lastExit" ? "active" : ""}`}
            onClick={() => setMode("lastExit")}
          >
            آخر خروج ليه
          </button>
        </div>

        {mode === "lastExit" ? (
          <>
            <button
              className="submit-btn"
              type="button"
              onClick={handleCheckLastExit}
              disabled={actionLoading || !selectedUser}
            >
              {actionLoading ? "جاري البحث..." : "اجيب آخر ميعاد خروج"}
            </button>

            {lastExitInfo && (
              <div className="info-box">
                {lastExitInfo.exitTime ? (
                  <>
                    <strong>{lastExitInfo.name}</strong> آخر مرة خرج فيها كانت
                    <div className="info-time">{formatLastExit(lastExitInfo.exitTime)}</div>
                  </>
                ) : (
                  <>
                    مفيش أي تسجيل خروج سابق لـ <strong>{lastExitInfo.name}</strong>
                    <div className="manual-exit-box">
                      <div className="form-row">
                        <label htmlFor="manual-date">حدد تاريخ آخر خروج يدوي</label>
                        <input
                          id="manual-date"
                          type="date"
                          value={manualDate}
                          onChange={(e) => setManualDate(e.target.value)}
                        />
                      </div>
                      <button
                        className="submit-btn secondary-btn"
                        type="button"
                        onClick={handleSaveManualExit}
                        disabled={manualLoading}
                      >
                        {manualLoading ? "جاري الحفظ..." : "حفظ آخر خروج يدوي"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleSaveTime}>
            <div className="form-row">
              <label htmlFor="time-value">
                {mode === "exit" ? "ميعاد الخروج" : "ميعاد الدخول"}
              </label>
              <input
                id="time-value"
                type="time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
              />
            </div>

            <button className="submit-btn" type="submit" disabled={actionLoading}>
              {actionLoading
                ? "جاري الحفظ..."
                : mode === "exit"
                ? "حفظ ميعاد الخروج"
                : "حفظ ميعاد الدخول"}
            </button>
          </form>
        )}

        <div className="form-row notes-row">
          <label htmlFor="notes">ملاحظات على {sheetDate}</label>
          <textarea
            id="notes"
            rows={2}
            placeholder="اكتب ملاحظة عن الموظف في اليوم ده (اختياري)"
            value={notesValue}
            onChange={(e) => setNotesValue(e.target.value)}
          />
          <button
            className="submit-btn secondary-btn"
            type="button"
            onClick={handleSaveNotes}
            disabled={notesLoading || !selectedUser}
          >
            {notesLoading ? "جاري الحفظ..." : "حفظ الملاحظة"}
          </button>
        </div>
      </div>

      <div className="card" id="printable-report">
        <h1 className="print-title">حركة البوابة</h1>
        <div className="section-title">
          <span>تقرير يوم {formatDayLabel(sheetDate)}</span>
          <div className="report-actions no-print">
            <button className="submit-btn print-btn" type="button" onClick={handleExportExcel}>
              تصدير Excel
            </button>
            <button className="submit-btn print-btn" type="button" onClick={handlePrint}>
              طباعة
            </button>
          </div>
        </div>

        {recordsLoading ? (
          <div className="loading-state no-print">بنجيب السجلات...</div>
        ) : records.length === 0 ? (
          <div className="empty-state no-print">لسه مفيش أي تسجيل في اليوم ده</div>
        ) : (
          <div className="table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>الاسم</th>
                  <th>القسم</th>
                  <th>وقت الخروج</th>
                  <th>وقت الدخول</th>
                  <th>آخر خروج ليه</th>
                  <th>ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td>{r.day}</td>
                    <td>{r.name}</td>
                    <td>{r.department || "—"}</td>
                    <td>{formatTime(r.exitTime)}</td>
                    <td>{formatTime(r.entryTime)}</td>
                    <td>{formatLastExit(r.previousExitTime)}</td>
                    <td>{r.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
