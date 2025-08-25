const API_URL = "http://127.0.0.1:5000/api";

export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials), // { email, password }
  });
  return res.json();
}

export async function registerUser(userData) {
  const response = await fetch("http://127.0.0.1:5000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
}



// 🔹 Employee APIs
export async function fetchEmployees() {
  const res = await fetch(`${API_URL}/employees`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
  return res.json();
}

export async function addEmployee(emp) {
  const res = await fetch(`${API_URL}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(emp),
  });
  return res.json();
}

export async function updateEmployee(id, emp) {
  const res = await fetch(`${API_URL}/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(emp),
  });
  return res.json();
}

export async function deleteEmployee(id) {
  await fetch(`${API_URL}/employees/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
}
