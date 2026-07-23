import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import DepForm from "./components/DepForm";
import DepList from "./components/DepList";
import AttendancePage from "./components/AttendancePage";
import { fetchUsers, fetchDepartments } from "./api";

export default function App() {
  const [tab, setTab] = useState("users"); // "users" | "departments"

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [departments, setDepartments] = useState([]);
  const [depsLoading, setDepsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
    loadDepartments();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setDepsLoading(false);
    }
  };

  const handleUserAdded = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <div className="app-shell">
      <Sidebar active={tab} onChange={setTab} />

      <main className="main-content">
        <div className="page">
          <div className="hero">
            <span className="hero-eyebrow">إدارة اليوزرز</span>
            <h1>
              {tab === "users" && "ضيف يوزر بسرعة"}
              {tab === "departments" && "ضيف قسم جديد"}
              {tab === "attendance" && "متابعة العمل اليومي"}
            </h1>
            <p>
              {tab === "users" &&
                "اكتب الاسم واختار القسم، وهيتضاف على طول للقايمة تحت."}
              {tab === "departments" &&
                "اكتب اسم القسم، وهيظهر على طول في قايمة الأقسام تحت."}
              {tab === "attendance" &&
                "اختار الموظف، سجل ميعاد خروجه، ولو هو داخل هيجيبلك آخر ميعاد خروج ليه."}
            </p>
          </div>

          {tab === "users" && (
            <>
              <UserForm onAdded={handleUserAdded} />
              <UserList users={users} loading={usersLoading} />
            </>
          )}

          {tab === "departments" && (
            <>
              <DepForm onAdded={loadDepartments} />
              <DepList departments={departments} loading={depsLoading} />
            </>
          )}

          {tab === "attendance" && <AttendancePage />}
        </div>
      </main>
    </div>
  );
}
