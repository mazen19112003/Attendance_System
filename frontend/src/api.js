const BASE_URL = "https://attendance-system-deot.vercel.app/api/users";
const DEPS_URL = "https://attendance-system-deot.vercel.app/api/deps";
const ATTENDANCE_URL = "https://attendance-system-deot.vercel.app/api/attendance";

export async function fetchUsers() {
  const res = await fetch(BASE_URL);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في جلب اليوزرز");
  return data.data;
}

export async function addUser({ name, department }) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, department }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في إضافة اليوزر");
  return data.data;
}

export async function updateUser(id, { name, department }) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, department }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في تعديل اليوزر");
  return data.data;
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في حذف اليوزر");
  return true;
}

export async function fetchDepartments() {
  const res = await fetch(DEPS_URL);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في جلب الأقسام");
  return data.data;
}

export async function addDepartment(Depname) {
  const res = await fetch(DEPS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Depname }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في إضافة القسم");
  return data.data;
}

export async function recordExit({ userId, day, exitTime }) {
  const res = await fetch(`${ATTENDANCE_URL}/exit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, day, exitTime }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في تسجيل الخروج");
  return data.data;
}

export async function recordEntry({ userId, day, entryTime }) {
  const res = await fetch(`${ATTENDANCE_URL}/entry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, day, entryTime }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في تسجيل الدخول");
  return data.data;
}

export async function saveNotes({ userId, day, notes }) {
  const res = await fetch(`${ATTENDANCE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, day, notes }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في حفظ الملاحظة");
  return data.data;
}

export async function fetchLastExit(userId) {
  const res = await fetch(`${ATTENDANCE_URL}/last/${userId}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في جلب آخر خروج");
  return data.data; // null لو مفيش سجل قبل كده
}

export async function fetchByDay(day) {
  const res = await fetch(`${ATTENDANCE_URL}/day/${day}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في جلب سجلات اليوم ده");
  return data.data;
}

export async function fetchAllAttendance() {
  const res = await fetch(ATTENDANCE_URL);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في جلب السجلات");
  return data.data;
}
