import { ImageResponse } from 'next/og'

// ルートセグメント設定
export const runtime = 'edge'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// favicon生成関数
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '50%',
        }}
      >
        明
      </div>
    ),
    {
      ...size,
    }
  )
}