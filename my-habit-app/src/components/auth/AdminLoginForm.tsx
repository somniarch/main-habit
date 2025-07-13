import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AdminLoginFormProps {
  onAdminLogin: (userId: string, isAdmin: boolean) => void;
  onBackToNormal: () => void;
}

export function AdminLoginForm({ onAdminLogin, onBackToNormal }: AdminLoginFormProps) {
  const { t } = useLanguage();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async () => {
    if (!userId.trim() || !password.trim()) {
      setLoginError(t('login.error.empty'));
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      const response = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      const data = await response.json();

      if (data.success) {
        onAdminLogin(userId, true);
        setLoginError("");
      } else {
        setLoginError(data.message || t('login.error.admin'));
      }
    } catch {
      setLoginError("관리자 로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 mt-20 border rounded shadow space-y-4 font-sans">
      <h2 className="text-xl font-semibold text-center">관리자 로그인</h2>
      
      <input
        type="text"
        placeholder="관리자 ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
      
      <input
        type="password"
        placeholder="관리자 비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />

      <div className="flex justify-between items-center">
        <button
          onClick={onBackToNormal}
          className="text-sm text-blue-600 hover:underline"
        >
          일반 로그인으로 돌아가기
        </button>
        
        <button
          onClick={handleAdminLogin}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "관리자 로그인"}
        </button>
      </div>

      {loginError && <p className="text-red-600">{loginError}</p>}
    </div>
  );
} 