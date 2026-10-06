import React, { useState } from 'react';
import { Business } from '../types/ftc';
import {
  Building2,
  ExternalLink,
  Copy,
  Check,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Eye,
  LayoutList,
  LayoutGrid,
  MapPin,
  Globe,
  Phone,
} from 'lucide-react';

interface BusinessListTableProps {
  businesses: Business[];
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onSelectBusiness: (business: Business) => void;
}

export const BusinessListTable: React.FC<BusinessListTableProps> = ({
  businesses,
  bookmarks,
  onToggleBookmark,
  onSelectBusiness,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(businesses.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBusinesses = businesses.slice(startIndex, startIndex + pageSize);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getStatusColor = (status: Business['operSttusNm']) => {
    switch (status) {
      case '정상영업':
        return { dot: 'bg-emerald-500', text: 'text-emerald-700' };
      case '휴업':
        return { dot: 'bg-amber-500', text: 'text-amber-700' };
      case '폐업':
        return { dot: 'bg-rose-500', text: 'text-rose-700' };
      default:
        return { dot: 'bg-slate-400', text: 'text-slate-600' };
    }
  };

  if (businesses.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">
          검색 조건과 일치하는 사업자가 없습니다
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          입력하신 검색어의 철자를 확인하시거나, 선택된 지역(시·도/시·군·구) 및 영업 상태 필터를 완화하여 다시 검색해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span>전체</span>
          <span className="font-bold font-mono text-slate-800">{businesses.length}</span>
          <span>개 등록업체 중</span>
          <span className="font-semibold text-slate-700">
            {startIndex + 1} - {Math.min(startIndex + pageSize, businesses.length)}
          </span>
          <span>표시</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Page Size Selector */}
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>표시 건수:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 text-xs bg-white border border-slate-200 rounded text-slate-800 focus:outline-hidden"
            >
              <option value={10}>10개씩</option>
              <option value={20}>20개씩</option>
              <option value={50}>50개씩</option>
            </select>
          </div>

          {/* Table / Cards toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="데이터 표 보기"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="카드형 그리드 보기"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Data Table */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
                <th className="py-3 px-4 w-10 text-center">북마크</th>
                <th className="py-3 px-4">상호명 / 대표자</th>
                <th className="py-3 px-4">사업자등록번호</th>
                <th className="py-3 px-4">통신판매신고번호</th>
                <th className="py-3 px-4">관할 지자체</th>
                <th className="py-3 px-4">취급품목</th>
                <th className="py-3 px-4">영업상태</th>
                <th className="py-3 px-4">신고일자</th>
                <th className="py-3 px-4 text-center">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedBusinesses.map((biz) => {
                const isBookmarked = bookmarks.includes(biz.id);
                const statusStyle = getStatusColor(biz.operSttusNm);

                return (
                  <tr
                    key={biz.id}
                    onClick={() => onSelectBusiness(biz)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                  >
                    {/* Bookmark Toggle */}
                    <td
                      className="py-3 px-4 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(biz.id);
                      }}
                    >
                      <button
                        className="text-slate-300 hover:text-amber-500 transition-colors p-1"
                        title={isBookmarked ? '북마크 해제' : '관심업체 저장'}
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${
                            isBookmarked ? 'fill-amber-400 text-amber-500' : ''
                          }`}
                        />
                      </button>
                    </td>

                    {/* Company Name & Representative */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors flex items-center gap-1.5">
                        <span>{biz.bzmnNm}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({biz.bupNm})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        대표: {biz.rprsvNm}
                        {biz.siteAddr && (
                          <span className="ml-1.5 text-slate-400 truncate max-w-[150px] inline-block align-bottom">
                            · {biz.siteAddr}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Business Registration Number (BRN) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-mono text-slate-800">
                        <span>{biz.bizrno}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(biz.bizrno, `brn-${biz.id}`);
                          }}
                          className="text-slate-300 hover:text-slate-700 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="사업자등록번호 복사"
                        >
                          {copiedId === `brn-${biz.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Tongsin Number */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-mono text-slate-700">
                        <span className="truncate max-w-[140px]">{biz.tongsinBzmnDclrNo}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(biz.tongsinBzmnDclrNo, `tong-${biz.id}`);
                          }}
                          className="text-slate-300 hover:text-slate-700 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="통신판매신고번호 복사"
                        >
                          {copiedId === `tong-${biz.id}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Region */}
                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-medium">{biz.wrkrSidoNm}</div>
                      <div className="text-[11px] text-slate-400">{biz.wrkrSiGunGuNm}</div>
                    </td>

                    {/* Industry / Category */}
                    <td className="py-3 px-4 text-slate-700">
                      <span>{biz.indutyNm}</span>
                    </td>

                    {/* Status (Zero-pill discipline: Clean dot + text) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        <span className={statusStyle.text}>{biz.operSttusNm}</span>
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {biz.dclrDate}
                    </td>

                    {/* Detail Action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBusiness(biz);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* View 2: Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 p-5">
          {paginatedBusinesses.map((biz) => {
            const isBookmarked = bookmarks.includes(biz.id);
            const statusStyle = getStatusColor(biz.operSttusNm);

            return (
              <div
                key={biz.id}
                onClick={() => onSelectBusiness(biz)}
                className="p-4 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        {biz.bzmnNm}
                      </h4>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <span>대표: {biz.rprsvNm}</span>
                        <span className="text-slate-300">·</span>
                        <span>{biz.bupNm}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        <span className={statusStyle.text}>{biz.operSttusNm}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(biz.id);
                        }}
                        className="p-1 text-slate-300 hover:text-amber-500 transition-colors"
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${
                            isBookmarked ? 'fill-amber-400 text-amber-500' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Numbers */}
                  <div className="space-y-1 my-3 text-xs font-mono bg-slate-50 p-2.5 rounded border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">사업자번호</span>
                      <span className="text-slate-800 font-medium">{biz.bizrno}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">통신판매번호</span>
                      <span className="text-slate-700 truncate max-w-[160px] text-right">
                        {biz.tongsinBzmnDclrNo}
                      </span>
                    </div>
                  </div>

                  {/* Metadata: Location & Domain */}
                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{biz.rnAddr}</span>
                    </div>
                    {biz.siteAddr && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-blue-600 truncate">{biz.siteAddr}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>신고일: {biz.dclrDate}</span>
                  <span className="text-blue-600 font-medium group-hover:underline">
                    상세내역 조회 →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-slate-500">
          페이지 <span className="font-semibold text-slate-800">{currentPage}</span> /{' '}
          <span className="font-semibold text-slate-800">{totalPages}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            처음
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 bg-white border border-slate-200 rounded text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Number Buttons */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = currentPage - 2 + i;
            if (currentPage <= 2) pageNum = i + 1;
            if (currentPage >= totalPages - 1) pageNum = totalPages - 4 + i;
            if (pageNum < 1 || pageNum > totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 bg-white border border-slate-200 rounded text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            끝
          </button>
        </div>
      </div>
    </div>
  );
};
