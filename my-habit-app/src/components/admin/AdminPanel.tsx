import React, { useState, useEffect } from "react";

interface User {
  id: number;
  userId: string;
  isAdmin: boolean;
  createdAt: string;
  _count: {
    routines: number;
  };
}

interface AdminPanelProps {
  adminUserId: string;
}

export function AdminPanel({ adminUserId }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ userId: "", password: "", isAdmin: false });

  // 사용자 목록 조회
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users?adminUserId=${adminUserId}`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("사용자 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 새 사용자 생성
  const handleCreateUser = async () => {
    if (!newUser.userId.trim() || !newUser.password.trim()) {
      setError("사용자 ID와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminUserId, newUser }),
      });

      const data = await response.json();
      
      if (data.success) {
        setNewUser({ userId: "", password: "", isAdmin: false });
        fetchUsers();
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("사용자 생성 중 오류가 발생했습니다.");
    }
  };

  // 사용자 삭제
  const handleDeleteUser = async (targetUserId: string) => {
    if (!confirm("정말로 이 사용자를 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/users?adminUserId=${adminUserId}&targetUserId=${targetUserId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      
      if (data.success) {
        fetchUsers();
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("사용자 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [adminUserId]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">관리자 패널</h2>
      
      {/* 새 사용자 생성 */}
      <div className="border rounded p-4 bg-gray-50">
        <h3 className="font-semibold mb-3">새 사용자 생성</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="사용자 ID"
            value={newUser.userId}
            onChange={(e) => setNewUser(prev => ({ ...prev, userId: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={newUser.password}
            onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newUser.isAdmin}
              onChange={(e) => setNewUser(prev => ({ ...prev, isAdmin: e.target.checked }))}
            />
            <span>관리자 권한</span>
          </label>
          <button
            onClick={handleCreateUser}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            사용자 생성
          </button>
        </div>
      </div>

      {/* 사용자 목록 */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-3">사용자 목록</h3>
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <span className="font-medium">{user.userId}</span>
                  {user.isAdmin && <span className="ml-2 text-blue-600">관리자</span>}
                  <span className="ml-2 text-gray-500">
                    루틴 {user._count.routines}개
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteUser(user.userId)}
                  className="text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 