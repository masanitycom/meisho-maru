'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, ArrowLeft, Shield, CheckCircle } from 'lucide-react';

function PDFViewerContent() {
  const searchParams = useSearchParams();
  const pdfType = searchParams.get('type');

  // 動的にページタイトルを設定
  useEffect(() => {
    const title = pdfType === 'registration' 
      ? '遊漁船業者登録票 | 明勝丸 - 鳥取県琴浦町'
      : '遊漁船業務規程 | 明勝丸 - 鳥取県琴浦町';
    document.title = title;
  }, [pdfType]);

  const pdfInfo = {
    registration: {
      title: '遊漁船業者登録票',
      subtitle: '明勝丸 - 鳥取県知事認可',
      description: '鳥取県知事による正式な遊漁船業者の登録票です。適法に営業していることを証明する公式書類です。',
      pdfUrl: '/pdf/RecreationalFishingBoatOperatorRegistrationForm.pdf',
      fileName: '明勝丸_遊漁船業者登録票.pdf',
      icon: Shield,
      color: 'green',
      details: [
        '登録番号記載',
        '鳥取県知事認可',
        '有効期限記載',
        '正式登録証明'
      ]
    },
    regulations: {
      title: '遊漁船業務規程',
      subtitle: '明勝丸 - 安全運航基準',
      description: '遊漁船業の適正な運営のための規程です。料金、安全対策、運航基準等を定めています。',
      pdfUrl: '/pdf/businessregulations.pdf',
      fileName: '明勝丸_遊漁船業務規程.pdf',
      icon: FileText,
      color: 'blue',
      details: [
        '安全運航基準',
        '料金規定',
        '運航ルール',
        'キャンセル規定'
      ]
    }
  };

  const currentPdf = pdfType === 'registration' ? pdfInfo.registration : pdfInfo.regulations;
  const IconComponent = currentPdf.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 戻るボタン */}
          <div className="mb-4 sm:mb-6">
            <Button asChild variant="ghost" size="lg" className="h-12 px-4 -ml-2 touch-manipulation">
              <Link href="/#regulations" className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5 flex-shrink-0" />
                <span className="text-base font-medium">業務規定に戻る</span>
              </Link>
            </Button>
          </div>

          {/* PDFカード */}
          <Card className="shadow-xl">
            <CardHeader className={currentPdf.color === 'green' ? 'bg-green-50 border-b' : 'bg-blue-50 border-b'}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className={currentPdf.color === 'green' ? 'w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0' : 'w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'}>
                    <IconComponent className={currentPdf.color === 'green' ? 'h-6 w-6 sm:h-8 sm:w-8 text-green-600' : 'h-6 w-6 sm:h-8 sm:w-8 text-blue-600'} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-2xl mb-1 sm:mb-2 leading-tight">{currentPdf.title}</CardTitle>
                    <p className="text-sm sm:text-base text-gray-600">{currentPdf.subtitle}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              <div className="space-y-6">
                {/* 説明 */}
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {currentPdf.description}
                  </p>
                </div>

                {/* 詳細情報 */}
                <div className={currentPdf.color === 'green' ? 'bg-green-50 p-6 rounded-lg' : 'bg-blue-50 p-6 rounded-lg'}>
                  <h3 className="font-semibold mb-4 flex items-center">
                    <CheckCircle className={currentPdf.color === 'green' ? 'h-5 w-5 mr-2 text-green-600' : 'h-5 w-5 mr-2 text-blue-600'} />
                    文書内容
                  </h3>
                  <ul className="space-y-2">
                    {currentPdf.details.map((detail, index) => (
                      <li key={index} className="flex items-start">
                        <span className={currentPdf.color === 'green' ? 'mr-2 text-green-600' : 'mr-2 text-blue-600'}>•</span>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ダウンロードボタン */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button
                    asChild
                    size="lg"
                    className={`${currentPdf.color === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} h-14 sm:h-12 text-base font-semibold`}
                  >
                    <a
                      href={currentPdf.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={currentPdf.fileName}
                      className="flex items-center justify-center gap-3 w-full h-full touch-manipulation"
                    >
                      <Download className="h-5 w-5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>PDFダウンロード</span>
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-14 sm:h-12 text-base font-semibold border-2"
                  >
                    <a
                      href={currentPdf.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full h-full touch-manipulation"
                    >
                      <FileText className="h-5 w-5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>ブラウザで開く</span>
                    </a>
                  </Button>
                </div>

                {/* iframe埋め込み */}
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">プレビュー</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-4">
                      モバイルでは「ブラウザで開く」ボタンで閲覧することをおすすめします。
                    </p>
                    <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                      <div className="block sm:hidden">
                        {/* モバイル用の簡易プレビュー */}
                        <div className="p-6 text-center">
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${currentPdf.color === 'green' ? 'bg-green-100' : 'bg-blue-100'}`}>
                            <IconComponent className={`h-8 w-8 ${currentPdf.color === 'green' ? 'text-green-600' : 'text-blue-600'}`} />
                          </div>
                          <h4 className="font-semibold text-lg mb-2">{currentPdf.title}</h4>
                          <p className="text-gray-600 text-sm mb-4">{currentPdf.description}</p>
                          <Button
                            asChild
                            className={`${currentPdf.color === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} w-full h-12 text-base`}
                          >
                            <a
                              href={currentPdf.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 touch-manipulation"
                            >
                              <FileText className="h-5 w-5" />
                              <span>PDFを開いて閲覧</span>
                            </a>
                          </Button>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        {/* デスクトップ用iframe */}
                        <iframe
                          src={`${currentPdf.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="w-full h-[500px] lg:h-[600px]"
                          title={currentPdf.title}
                          style={{ border: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 補足情報 */}
          <div className="mt-8 text-center text-gray-600 text-sm">
            <p>
              PDFが正しく表示されない場合は、ダウンロードしてお使いのPDFリーダーでご覧ください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PDFViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      }
    >
      <PDFViewerContent />
    </Suspense>
  );
}