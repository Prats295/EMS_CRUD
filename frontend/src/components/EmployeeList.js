import React, { useState, useEffect } from "react";
import axios from "axios";
import EditEmployee from "./EditEmployee/EditEmployee";
import AddEmployee from "./AddEmployee/AddEmployee";


function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  // Open edit modal
  const editEmployee = (emp) => {
    setEditingEmployee(emp);
  };

  // Save edited employee
  const handleSave = async (updatedEmp) => {
    try {
      await axios.put(`http://localhost:5000/employees/${updatedEmp.id}`, updatedEmp);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingEmployee(null);
  };

  // Save new employee
  const handleAdd = async (newEmp) => {
    try {
      await axios.post("http://localhost:5000/employees", newEmp);
      setShowAdd(false);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employee List</h2>
      {/* Add Employee Button */}
      <button onClick={() => setShowAdd(true)} style={{ marginBottom: "10px" }}>
        Add Employee
      </button>

      {/* Add Employee Modal */}
      {showAdd && (
        <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
          <AddEmployee onSave={handleAdd} onCancel={() => setShowAdd(false)} />
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
          <EditEmployee
            employee={editingEmployee}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Employee Table */}
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>No.</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr key={emp.id}>
              <td>{index + 1}</td> {/* Sequential numbering */}
              <td>{emp.first_name}</td>
              <td>{emp.last_name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>
                <button onClick={() => editEmployee(emp)}>Edit</button>
                <button onClick={() => deleteEmployee(emp.id)} style={{ marginLeft: "5px" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
