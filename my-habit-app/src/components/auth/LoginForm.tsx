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

  const handleLogin = async () => {
    if (!userId.trim() || !userPw.trim()) {
      setLoginError(t('login.error.empty'));
      return;
    }
    // 어드민 계정만 로그인 허용
    const adminIds = (process.env.NEXT_PUBLIC_ADMIN_USER_ID || "").split(',').map(id => id.trim());
    const adminPws = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "").split(',').map(pw => pw.trim());
    let isAdmin = false;
    let adminIdx = -1;
    for (let i = 0; i < adminIds.length; i++) {
      if (userId === adminIds[i] && userPw === adminPws[i]) {
        isAdmin = true;
        adminIdx = i;
        break;
      }
    }
    if (isAdmin) {
      // DB에 userId가 없으면 자동 생성
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adminUserId: userId,
            newUser: { userId, password: userPw, isAdmin: true }
          })
        });
        // 이미 있으면 409, 성공이면 200
        // 무시하고 로그인 진행
      } catch {}
      onLogin(userId, true);
      setLoginError("");
    } else {
      setLoginError("아이디 및 비밀번호가 틀렸습니다.");
    }
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
    </div>
  );
} 