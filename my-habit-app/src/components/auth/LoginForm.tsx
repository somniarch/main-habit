import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoginFormProps {
  onLogin: (userId: string, isAdmin: boolean) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const { t } = useLanguage();
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [newUserPw, setNewUserPw] = useState("");
  const [userAddError, setUserAddError] = useState("");

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
      setLoginError(t('login.error.empty'));
      return;
    }
    
    const users = getRegisteredUsers();
    const found = users.find((u) => u.id === userId && u.pw === userPw);
    if (found) {
      onLogin(userId, false);
      setLoginError("");
    } else {
      setLoginError(t('login.error.invalid'));
    }
  };

  const handleAddUser = () => {
    if (!newUserId.trim() || !newUserPw.trim()) {
      setUserAddError(t('register.error.empty'));
      return;
    }
    const users = getRegisteredUsers();
    if (users.find((u) => u.id === newUserId)) {
      setUserAddError(t('register.error.exists'));
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
      <h2 className="text-xl font-semibold text-center">{t('login.title')}</h2>
      <input
        type="text"
        placeholder={t('login.id')}
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
      <input
        type="password"
        placeholder={t('login.password')}
        value={userPw}
        onChange={(e) => setUserPw(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />

      <div className="flex justify-end">
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          {t('login.button')}
        </button>
      </div>

      {loginError && <p className="text-red-600">{loginError}</p>}

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">{t('register.new.user')}</h3>
        <input
          type="text"
          placeholder={t('register.new.user.id')}
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-2"
        />
        <input
          type="password"
          placeholder={t('register.new.user.password')}
          value={newUserPw}
          onChange={(e) => setNewUserPw(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-2"
        />
        <button
          onClick={handleAddUser}
          className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
        >
          {t('register.new.user')}
        </button>
        {userAddError && <p className="text-red-600 mt-2">{userAddError}</p>}
      </div>
    </div>
  );
} 