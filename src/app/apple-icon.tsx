import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          borderRadius: '20px',
        }}
      >
        <img
          src="https://kotourameishomaru.com/images/logo.png"
          alt="明勝丸ロゴ"
          width="160"
          height="160"
          style={{
            borderRadius: '10px',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}