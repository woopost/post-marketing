import React from 'react';
import { Business } from '../types/ftc';
import { X, Bookmark, ExternalLink, Trash2, Download } from 'lucide-react';

interface SavedBookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: string[];
  businesses: Business[];
  onToggleBookmark: (id: string) => void;
  onSelectBusiness: (business: Business) => void;
}

export const SavedBookmarksDrawer: React.FC<SavedBookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  businesses,
  onToggleBookmark,
  onSelectBusiness,
}) => {
  if (!isOpen) return null;

  const savedBusinesses = businesses.filter((b) => bookmarks.includes(b.id));

  const handleExportBookmarksCsv = () => {
    if (savedBusinesses.length === 0) return;
    const headers = [
      '상호명',
      '대표자',
      '사업자등록번호',
      '통신판매신고번호',
      '관할시도',
      '관할시군구',
      '영업상태',
      '신고일자',
      '취급품목',
      '도메인',
      '전화번호',
      '도로명주소',
    ];
    const rows = savedBusinesses.map((b) => [
      `"${b.bzmnNm.replace(/"/g, '""')}"`,
      `"${b.rprsvNm.replace(/"/g, '""')}"`,
      `"${b.bizrno}"`,
      `"${b.tongsinBzmnDclrNo}"`,
      `"${b.wrkrSidoNm}"`,
      `"${b.wrkrSiGunGuNm}"`,
      `"${b.operSttusNm}"`,
      `"${b.dclrDate}"`,
      `"${b.indutyNm}"`,
      `"${b.siteAddr || ''}"`,
      `"${b.telNo}"`,
      `"${b.rnAddr.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `공정위_통신판매_관심업체_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 rounded-lg text-white">
              <Bookmark className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                보관된 관심 통신판매업체
              </h3>
              <p className="text-xs text-slate-400">
                총 {savedBusinesses.length}개 업체 저장됨
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

        {/* List */}
        <div className="p-5 overflow-y-auto flex-1 divide-y divide-slate-100">
          {savedBusinesses.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bookmark className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">저장된 관심 업체가 없습니다.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                업체 목록에서 별 또는 북마크 아이콘을 클릭하여 관심 목록에 추가하세요.
              </p>
            </div>
          ) : (
            savedBusinesses.map((biz) => (
              <div
                key={biz.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-lg transition-colors"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelectBusiness(biz);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 hover:text-blue-600">
                      {biz.bzmnNm}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ({biz.wrkrSidoNm} {biz.wrkrSiGunGuNm})
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-mono">
                    <span>{biz.bizrno}</span>
                    <span>·</span>
                    <span>{biz.tongsinBzmnDclrNo}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelectBusiness(biz);
                      onClose();
                    }}
                    className="px-2.5 py-1 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 rounded font-medium"
                  >
                    상세보기
                  </button>
                  <button
                    onClick={() => onToggleBookmark(biz.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="북마크 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleExportBookmarksCsv}
            disabled={savedBusinesses.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>관심목록 CSV 내보내기</span>
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
