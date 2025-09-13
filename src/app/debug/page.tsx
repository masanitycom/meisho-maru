'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase-client';

interface EnvStatus {
  hasUrl: boolean;
  urlPrefix: string;
  hasKey: boolean;
  keyPrefix: string;
  client: boolean;
}

export default function DebugPage() {
  const [envStatus, setEnvStatus] = useState<EnvStatus>({
    hasUrl: false,
    urlPrefix: '',
    hasKey: false,
    keyPrefix: '',
    client: false
  });
  const [testResult, setTestResult] = useState<string>('');

  useEffect(() => {
    // 環境変数の状態を確認
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    setEnvStatus({
      hasUrl: !!url,
      urlPrefix: url ? url.substring(0, 30) + '...' : 'undefined',
      hasKey: !!key,
      keyPrefix: key ? key.substring(0, 30) + '...' : 'undefined',
      client: !!getSupabaseClient()
    });
  }, []);

  const testSupabase = async () => {
    try {
      const client = getSupabaseClient();
      if (!client) {
        setTestResult('ERROR: Supabase client is null');
        return;
      }

      // テスト：スケジュールテーブルから1件取得
      const { data, error } = await client
        .from('schedules')
        .select('*')
        .limit(1);

      if (error) {
        setTestResult(`ERROR: ${error.message}`);
      } else {
        setTestResult(`SUCCESS: Connected to Supabase. Data: ${JSON.stringify(data)}`);
      }
    } catch (err: unknown) {
      setTestResult(`EXCEPTION: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const testInsert = async () => {
    try {
      const client = getSupabaseClient();
      if (!client) {
        setTestResult('ERROR: Supabase client is null');
        return;
      }

      // テスト予約を作成
      const testDate = new Date().toISOString().split('T')[0];
      const { data, error } = await client
        .from('reservations')
        .insert([{
          date: testDate,
          trip_number: 1,
          people_count: 1,
          name: 'デバッグテスト',
          name_kana: 'デバッグテスト',
          phone: '999-9999-9999',
          rod_rental: false,
          status: 'confirmed',
          source: 'debug'
        } as any])
        .select();

      if (error) {
        setTestResult(`INSERT ERROR: ${error.message}`);
      } else {
        setTestResult(`INSERT SUCCESS: ${JSON.stringify(data)}`);
        
        // 作成したテストデータを削除
        if (data && data[0]) {
          await client
            .from('reservations')
            .delete()
            .eq('id', data[0].id);
        }
      }
    } catch (err: unknown) {
      setTestResult(`INSERT EXCEPTION: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Debug Page</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-bold mb-2">環境変数の状態</h2>
        <pre className="text-sm">{JSON.stringify(envStatus, null, 2)}</pre>
      </div>

      <div className="mb-4">
        <button 
          onClick={testSupabase}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        >
          Test Connection
        </button>
        <button 
          onClick={testInsert}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Test Insert
        </button>
      </div>

      {testResult && (
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold mb-2">テスト結果</h2>
          <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
}