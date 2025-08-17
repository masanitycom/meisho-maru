import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // 管理画面からの更新要求を受け付け、公開ページのキャッシュをクリア
    const { path } = await request.json();
    
    // 指定されたパスのキャッシュをクリア
    if (path) {
      revalidatePath(path);
    } else {
      // デフォルトで主要ページをクリア
      revalidatePath('/');
      revalidatePath('/reservation');
    }
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      path: path || '/' 
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ 
      revalidated: false, 
      error: 'Failed to revalidate' 
    }, { status: 500 });
  }
}