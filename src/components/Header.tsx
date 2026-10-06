import React from 'react';
import { Building2, Search, Sliders, ShieldCheck, Bookmark, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { ApiConfig } from '../types/ftc';

interface HeaderProps {
  apiConfig: ApiConfig;
  bookmarkCount: number;
  onOpenApiModal: () => void;
  onOpenBookmarks: () => void;
  onOpenValidator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiConfig,
  bookmarkCount,
  onOpenApiModal,
  onOpenBookmarks,
  onOpenValidator,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Service Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  공정위 통신판매사업자 신고자료 통합조회
                </span>
                <span className="text-[11px] text-blue-200 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800 font-medium">
                  공공데이터 포털 연동
                </span>
              </div>
              <p className="text-xs text-slate-400">
                전자상거래 등에서의 소비자보호에 관한 법률 제12조에 따른 전국 등록현황 및 상세내역
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* API Status Indicator Button */}
            <button
              onClick={onOpenApiModal}
              title="오픈API 인증키 설정 안내 및 연동 상태"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-slate-300 hover:text-white"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>API 연동 안내</span>
              <Sliders className="w-3 h-3 ml-0.5 text-slate-400" />
            </button>

            {/* Business Number Validator Modal Trigger */}
            <button
              onClick={onOpenValidator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-slate-200"
              title="사업자등록번호 10자리 유효성 검증"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="hidden md:inline">사업자번호 검증기</span>
            </button>

            {/* Saved Bookmarks */}
            <button
              onClick={onOpenBookmarks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-slate-200"
              title="관심 등록업체 보관함"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">관심업체</span>
              {bookmarkCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-blue-600 text-white rounded-full text-[10px] font-bold">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* External FTC Official Portal Link */}
            <a
              href="https://www.ftc.go.kr/www/bizCommList.do?key=232"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="공정거래위원회 공식 통신판매사업자 정보공개 사이트 새창 이동"
            >
              <span>공정위 원문</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
