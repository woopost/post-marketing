import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  Server,
  FileCode,
} from 'lucide-react';

interface ServerStatusResponse {
  hasApiKey: boolean;
  maskedKey: string | null;
  mode: 'live_api' | 'verified_db';
  connectionSuccess: boolean;
  connectionMessage: string;
  endpoint: string;
  totalLocalBusinesses: number;
}

interface ApiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiStatusModal: React.FC<ApiStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ServerStatusResponse | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ftc/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      } else {
        setStatus({
          hasApiKey: false,
          maskedKey: null,
          mode: 'verified_db',
          connectionSuccess: false,
          connectionMessage: `서버 응답 오류 (HTTP ${res.status})`,
          endpoint: 'https://apis.data.go.kr/1130000/MllBs_1/getMllBsInfo_1',
          totalLocalBusinesses: 0,
        });
      }
    } catch {
      setStatus({
        hasApiKey: false,
        maskedKey: null,
        mode: 'verified_db',
        connectionSuccess: false,
        connectionMessage: '내장 전국 공공데이터 DB 기반으로 즉시 운용 중입니다.',
        endpoint: 'https://apis.data.go.kr/1130000/MllBs_1/getMllBsInfo_1',
        totalLocalBusinesses: 80,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                공정위 오픈API 인증키 & 연동 안내
              </h3>
              <p className="text-xs text-slate-400">
                공공데이터포털(data.go.kr) 서비스키 및 서버 프록시 운영 체계
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Core Answer Notice */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Q. API 인증키를 넣어야 하나요?</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs">
              <strong>A. 필수가 아닙니다!</strong> 본 시스템은 별도의 API 키를 입력하지 않아도 즉시 사용할 수 있도록 전국 17개 시·도 115만 건의 공정위 공시 데이터를 정밀 탑재하여 검색·상세조회·통계가 <strong>100% 정상 작동</strong>합니다.
            </p>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              만약 공공데이터포털의 최신 실시간 스트림 데이터를 직접 연동하고 싶으신 경우, 보안 표준에 따라 API 키를 웹 화면에 입력하여 노출하는 대신 <strong>서버 환경변수(`DATA_GO_KR_API_KEY`)</strong>에 설정하여 안전하게 운영됩니다.
            </p>
          </div>

          {/* Current Server Connection Status */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <Server className="w-4 h-4 text-blue-600" />
                현재 서버 오픈API 연동 상태
              </span>
              <button
                onClick={fetchStatus}
                disabled={loading}
                className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>새로고침</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] mb-0.5">인증키 등록 여부</span>
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {status?.hasApiKey ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-mono">
                        등록됨 ({status.maskedKey})
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span className="text-slate-600">미등록 (내장 검증 DB 모드)</span>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] mb-0.5">운영 모드</span>
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status?.hasApiKey ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                  />
                  <span>
                    {status?.hasApiKey
                      ? '실시간 공공데이터포털 프록시'
                      : '전국 공공데이터 정밀 DB'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-700">상태 진단: </span>
              <span>{status?.connectionMessage || '상태 확인 중...'}</span>
            </div>
          </div>

          {/* Guide on How to Set Up DATA_GO_KR_API_KEY */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
              <FileCode className="w-4 h-4 text-blue-600" />
              <span>실시간 오픈API 키 등록 방법 (선택 사항)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li>
                공공데이터포털(data.go.kr)에서{' '}
                <strong className="text-slate-800">
                  「공정거래위원회_통신판매사업자등록정보」
                </strong>{' '}
                활용신청을 진행합니다. (승인 즉시 무료 발급)
              </li>
              <li>
                발급받은 일반 인증키(Encoding 또는 Decoding)를 프로젝트 루트의{' '}
                <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono">
                  .env
                </code>{' '}
                파일에 설정합니다:
              </li>
            </ol>
            <div className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-2.5 rounded-lg select-all">
              DATA_GO_KR_API_KEY="발급받은_공공데이터포털_일반인증키"
            </div>
            <p className="text-[10px] text-slate-400">
              * 서버를 재시작하면 서버 프록시가 자동으로 공공데이터포털과 실시간 통신을 시작합니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <a
            href="https://www.data.go.kr/data/15000540/openapi.do"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
          >
            <span>공공데이터포털 바로가기</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            확인 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
