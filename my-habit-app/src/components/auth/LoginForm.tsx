import React, { useState } from "react";

interface LoginFormProps {
  onLogin: (userId: string, isAdmin: boolean) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [adminModeActive, setAdminModeActive] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [newUserPw, setNewUserPw] = useState("");
  const [userAddError, setUserAddError] = useState("");

  const adminId = "3333";
  const adminPw = "8888";
  const storedUsersKey = "registeredUsers";

  const getRegisteredUsers = (): { id: string; pw: string }[] => {
    if (typeof window === "undefined") return [];
    const json = localStorage.getItem(storedUsersKey);
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  };

  const saveRegisteredUsers = (users: { id: string; pw: string }[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storedUsersKey, JSON.stringify(users));
  };

  const handleLogin = () => {
    if (!userId.trim() || !userPw.trim()) {
      setLoginError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    if (adminModeActive) {
      if (userId === adminId && userPw === adminPw) {
        onLogin(userId, true);
        setLoginError("");
      } else {
        setLoginError("관리자 계정이 아닙니다.");
      }
      return;
    }
    const users = getRegisteredUsers();
    const found = users.find((u) => u.id === userId && u.pw === userPw);
    if (found) {
      onLogin(userId, false);
      setLoginError("");
    } else {
      setLoginError("등록된 사용자 ID 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleAddUser = () => {
    if (!newUserId.trim() || !newUserPw.trim()) {
      setUserAddError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }
    const users = getRegisteredUsers();
    if (users.find((u) => u.id === newUserId)) {
      setUserAddError("이미 존재하는 아이디입니다.");
      return;
    }
    const updated = [...users, { id: newUserId, pw: newUserPw }];
    saveRegisteredUsers(updated);
    setUserAddError("");
    setNewUserId("");
    setNewUserPw("");
  };

  return (
    <div className="max-w-sm mx-auto p-6 mt-20 border rounded shadow space-y-4 font-sans">
      <h2 className="text-xl font-semibold text-center">로그인 해주세요</h2>
      <input
        type="text"
        placeholder="아이디"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={userPw}
        onChange={(e) => setUserPw(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />

      <div className="flex justify-between items-center mt-1">
        <button
          onClick={() => {
            setAdminModeActive(!adminModeActive);
            setLoginError("");
            setUserId("");
            setUserPw("");
            setUserAddError("");
          }}
          className="text-sm text-blue-600 hover:underline"
        >
          {adminModeActive ? "일반 로그인 모드로 전환" : "관리자 모드"}
        </button>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          로그인
        </button>
      </div>

      {loginError && <p className="text-red-600">{loginError}</p>}

      {adminModeActive && (
        <div className="mt-4 border rounded p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">사용자 등록 (관리자 전용)</h3>
          <input
            type="text"
            placeholder="새 사용자 아이디"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-2"
          />
          <input
            type="password"
            placeholder="새 사용자 비밀번호"
            value={newUserPw}
            onChange={(e) => setNewUserPw(e.target.value)}
            className="border rounded px-3 py-2 w-full mb-2"
          />
          {userAddError && <p className="text-red-600 mb-2">{userAddError}</p>}
          <button
            onClick={handleAddUser}
            className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
          >
            사용자 등록
          </button>
        </div>
      )}
    </div>
  );
} 