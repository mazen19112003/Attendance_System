const BASE_URL = "https://attendance-system-deot.vercel.app/api/users";
const DEPS_URL = "https://attendance-system-deot.vercel.app/api/deps";
const ATTENDANCE_URL = "https://attendance-system-deot.vercel.app/api/attendance";
const AUTH_URL = `https://attendance-system-deot.vercel.app/api/auth`;

// const BASE_URL = "http://localhost:5000/api/users";
// const DEPS_URL = "http://localhost:5000/api/deps";
// const ATTENDANCE_URL = "http://localhost:5000/api/attendance";
// const AUTH_URL = `http://localhost:5000/api/auth`;
 
const TOKEN_KEY = "attendance_token";
 
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
 
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
 
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
 
// أي طلب لازم يعدي من هنا -- بيضيف التوكن أوتوماتيك، ولو الجلسة انتهت بيرجعك لصفحة الدخول
async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
 
  const res = await fetch(url, { ...options, headers });
 
  if (res.status === 401) {
    clearToken();
    window.location.reload(); // يرجع لصفحة تسجيل الدخول
    throw new Error("الجلسة انتهت، سجل دخول تاني");
  }
 
  return res.json();
}
 
export async function login(username, password) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "حصل خطأ في تسجيل الدخول");
  setToken(data.data.token);
  return data.data;
}
 
export function logout() {
  clearToken();
}
 
export async function fetchUsers() {
  const data = await apiFetch(BASE_URL);
  if (!data.success) throw new Error(data.message || "حصل خطأ في جلب اليوزرز");
  return data.data;
}
 
export async function addUser({ name, department }) {
  const data = await apiFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({ name, department }),
  });
  if (!data.success) throw new Error(data.message || "حصل خطأ في إضافة اليوزر");
  return data.data;
}
 
export async function updateUser(id, { name, department }) {
  const data = await apiFetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, department }),
  });
  if (!data.success) throw new Error(data.message || "حصل خطأ في تعديل اليوزر");
  return data.data;
}
 
export async function deleteUser(id) {
  const data = await apiFetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!data.success) throw new Error(data.message || "حصل خطأ في حذف اليوزر");
  return true;
}
 
export async function fetchDepartments() {
  const data = await apiFetch(DEPS_URL);
  if (!data.success) throw new Error(data.message || "حصل خطأ في جلب الأقسام");
  return data.data;
}
 
export async function addDepartment(Depname) {
  const data = await apiFetch(DEPS_URL, {
    method: "POST",
    body: JSON.stringify({ Depname }),
  });
  if (!data.success) throw new Error(data.message || "حصل خطأ في إضافة القسم");
  return data.data;
}
 
export async function deleteDepartment(id) {
  const data = await apiFetch(`${DEPS_URL}/${id}`, { method: "DELETE" });
  if (!data.success) throw new Error(data.message || "حصل خطأ في حذف القسم");
  return true;
}
 
export async function recordExit({ userId, day, exitTime }) {
  const data = await apiFetch(`${ATTENDANCE_URL}/exit`, {
    method: "POST",
    body: JSON.stringify({ userId, day, exitTime }),
  });
  if (!data.success) throw new Error(data.message || "حصل خطأ في تسجيل الخروج");
  return data.data;
}
 
export async function recordEntry({ userId, day, entryTime }) {
  const data = await apiFetch(`${ATTENDANCE_URL}/entry`, {
    method: "POST",
    body: JSON.stringify({ userId, day, entryTime }),
  });
  if (!data.success) throw new Error(data.message || "حصل خطأ في تسجيل الدخول");
  return data.data;
}
 
export async function saveNotes({ userId, day, notes }) {
  const data = await apiFetch(`${ATTENDANCE_URL}/notes`, {
    method: "POST",
    body: JSON.stringify({ userId, day, notes }),
  });
  if (!data.success) throw new Error(data.message || "حصل خطأ في حفظ الملاحظة");
  return data.data;
}
 
export async function fetchLastExit(userId) {
  const data = await apiFetch(`${ATTENDANCE_URL}/last/${userId}`);
  if (!data.success) throw new Error(data.message || "حصل خطأ في جلب آخر خروج");
  return data.data; // null لو مفيش سجل قبل كده
}
 
export async function fetchByDay(day) {
  const data = await apiFetch(`${ATTENDANCE_URL}/day/${day}`);
  if (!data.success) throw new Error(data.message || "حصل خطأ في جلب سجلات اليوم ده");
  return data.data;
}
 
export async function fetchAllAttendance() {
  const data = await apiFetch(ATTENDANCE_URL);
  if (!data.success) throw new Error(data.message || "حصل خطأ في جلب السجلات");
  return data.data;
}
 
export async function deleteAttendanceRecord(id) {
  const data = await apiFetch(`${ATTENDANCE_URL}/${id}`, { method: "DELETE" });
  if (!data.success) throw new Error(data.message || "حصل خطأ في حذف السجل");
  return true;
}
 
export async function deleteAttendance(userId, day) {
  const data = await apiFetch(`${ATTENDANCE_URL}/user/${userId}/day/${day}`, {
    method: "DELETE",
  });
  if (!data.success) throw new Error(data.message || "حصل خطأ في حذف السجل");
  return true;
}
 