import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await axios.get("http://localhost:4000/users");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (id, role) => {
    await axios.patch(`http://localhost:4000/users/${id}`, { role });
    loadUsers();
  };

  return (
    <div className="text-black">
      <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>

      <div className="bg-white p-6 rounded-xl shadow border">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-gray-600">
              <th className="py-2">User</th>
              <th>Role</th>
              <th>Change</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-3">{u.username}</td>
                <td>{u.role}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="agent">agent</option>
                    <option value="manager">manager</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
