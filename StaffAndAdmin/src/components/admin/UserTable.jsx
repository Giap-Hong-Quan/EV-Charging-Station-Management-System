import { userService } from '@/services/userService';
import { Edit, Eye, Mail, MapPin, Pencil, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import EditUserModal from './EditDriverModal';

const UserTable = ({ users = [], loading, onReload }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
  const handleDelete = async (userId) => {
    await userService.deleteUser(userId);
    onReload();
  };
    if (loading) return <p className="p-4">Đang tải dữ liệu...</p>;
   return (
    <div className="rounded-lg border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Người dùng</th>
            <th className="p-3 text-left">Liên hệ</th>
            <th className="p-3 text-left">Xác thực</th>
            <th className="p-3 text-left">Trạng thái</th>
            <th className="p-3 text-left">Ngày tạo</th>
            <th className="p-3 text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const isActive = user.sessions?.length > 0;

            return (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-3">#{user.id}</td>

                {/* Avatar + Name */}
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                  />
                  <div>
                    <p className="font-semibold">{user.full_name}</p>

                  </div>
                </td>

                {/* Contact */}
                <td className="p-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-500" />
                    {user.email}
                  </div>

                  {user.address && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      {user.address}
                    </div>
                  )}
                </td>

                {/* Provider */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-xs ${
                      user.social_provider === "google"
                        ? "bg-red-50 text-red-600"
                        : user.social_provider === "facebook"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.social_provider ? user.social_provider : "Email/Pass"}
                  </span>
                </td>

                {/* Active status */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>

                {/* Created */}
                <td className="p-3">
                  {new Date(user.created_at).toLocaleString("vi-VN")}
                </td>

                {/* Actions */}
                <td className="p-3">
                  <div className="flex justify-center gap-3">
                    <Eye
                      className="w-5 h-5 text-slate-400 hover:text-violet-600 cursor-pointer"
                      onClick={() => {
                        setSelectedUser(user);
                        setViewOpen(true);
                      }}
                    />

                    <Edit
                      className="w-5 h-5 text-slate-400 hover:text-blue-600 cursor-pointer"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditOpen(true);
                      }}
                    />

                    <Trash2
                      className="w-5 h-5 text-slate-400 hover:text-rose-600 cursor-pointer"
                      onClick={() => {
                        handleDelete(user.id);
                        setSelectedUser(user);
                        // setDeleteOpen(true);
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* MODALS */}
       {/* <ViewUserModal
        open={viewOpen}
        onOpenChange={setViewOpen}
        user={selectedUser}
      /> */}

      <EditUserModal
        open={editOpen}
        onOpenChange={setEditOpen}
        user={selectedUser}
        onUpdated={onReload}
      />
{/* 
      <DeleteConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={selectedUser}
        onDeleted={onReload}
      />  */}
    </div>
  );
}

export default UserTable