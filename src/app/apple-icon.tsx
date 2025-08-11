import { ImageResponse } from 'next/og'

// ルートセグメント設定
export const runtime = 'edge'
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Apple touch icon生成関数
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '20%',
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          <div>明</div>
          <div style={{ fontSize: 40, marginTop: -20 }}>勝</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}