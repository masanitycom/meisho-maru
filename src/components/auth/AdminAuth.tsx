'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Ship, Eye, EyeOff } from 'lucide-react';

interface AdminAuthProps {
  children: React.ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // ローカルストレージから認証状態を確認
    const authStatus = localStorage.getItem('meisho_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 簡単なAPI呼び出しでパスワード確認
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('meisho_admin_auth', 'true');
        setPassword('');
      } else {
        setError('パスワードが間違っています');
        setPassword('');
      }
    } catch (error) {
      setError('認証に失敗しました');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('meisho_admin_auth');
  };

  // マウント前はローディング表示
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Ship className="h-8 w-8 animate-bounce mx-auto mb-4 text-blue-500" />
          <p className="text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 認証済みの場合は子コンポーネントを表示
  if (isAuthenticated) {
    return (
      <div className="relative">
        {/* ログアウトボタン */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm"
          >
            <Lock className="h-4 w-4 mr-2" />
            ログアウト
          </Button>
        </div>
        {children}
      </div>
    );
  }

  // 未認証の場合はログイン画面を表示
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Ship className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">明勝丸 管理画面</CardTitle>
          <p className="text-gray-600">管理者認証が必要です</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">
                <Lock className="inline h-4 w-4 mr-2" />
                パスワード
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="管理者パスワードを入力"
                  required
                  className="text-lg h-12 pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white mr-2"></div>
                  認証中...
                </div>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  ログイン
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>※管理者のみアクセスできます</p>
            <p className="mt-2">パスワードを忘れた場合は<br />システム管理者にお問い合わせください</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}