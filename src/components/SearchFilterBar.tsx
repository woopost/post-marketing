import React from 'react';
import { Search, RotateCcw, Download, Filter, Building, Tag, Briefcase } from 'lucide-react';
import { FilterState } from '../types/ftc';
import { KOREA_REGIONS } from '../data/regions';

interface SearchFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onExportCsv: () => void;
  totalFiltered: number;
}

const CATEGORIES = [
  '전체',
  '종합몰',
  '패션/의류',
  '식품/농수산',
  '식품/건강',
  '화장품/뷰티',
  '가전/전자',
  '생활/인테리어',
  '레저/스포츠',
  '도서/음반',
  '출산/유아동',
  '여행/항공/e쿠폰'
];

const STATUS_OPTIONS = [
  { label: '전체 상태', value: '전체' },
  { label: '정상영업', value: '정상영업' },
  { label: '휴업', value: '휴업' },
  { label: '폐업', value: '폐업' }
];

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  onExportCsv,
  totalFiltered,
}) => {
  // Determine available sigungu options based on selected sido
  const currentRegion = KOREA_REGIONS.find((r) => r.sido === filters.sido);
  const districtList = currentRegion ? currentRegion.districts : ['전체'];

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // already controlled
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 sm:p-5 mb-6">
      {/* Search Input Row */}
      <div className="flex flex-col md:flex-row gap-2.5 mb-3.5">
        {/* Search Scope Selector */}
        <div className="w-full md:w-44 shrink-0">
          <select
            value={filters.searchType}
            onChange={(e) =>
              onFilterChange({
                searchType: e.target.value as FilterState['searchType'],
              })
            }
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="all">통합 검색 (전체)</option>
            <option value="bzmnNm">상호명 / 법인명</option>
            <option value="bizrno">사업자등록번호 (10자리)</option>
            <option value="rprsvNm">대표자 성명</option>
            <option value="tongsinNo">통신판매신고번호</option>
            <option value="domain">도메인 / 쇼핑몰URL</option>
          </select>
        </div>

        {/* Main Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => onFilterChange({ keyword: e.target.value })}
            onKeyDown={handleKeywordKeyDown}
            placeholder={
              filters.searchType === 'bizrno'
                ? '사업자등록번호 10자리 입력 (예: 120-88-00767)'
                : filters.searchType === 'tongsinNo'
                ? '통신판매신고번호 입력 (예: 2024-서울강남-0123)'
                : '검색어를 입력하세요 (예: 우아한형제들, 쿠팡, 강남구, 스마트스토어 등)'
            }
            className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          {filters.keyword && (
            <button
              onClick={() => onFilterChange({ keyword: '' })}
              className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-700 p-0.5 rounded"
            >
              ×
            </button>
          )}
        </div>

        {/* Action Buttons: Export & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExportCsv}
            disabled={totalFiltered === 0}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="현재 검색된 결과 CSV 파일 다운로드"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV 저장</span>
          </button>

          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            title="모든 검색 및 필터 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>초기화</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Sido, Sigungu, Status, Category, Business Type */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100">
        {/* 1. 시/도 선택 */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            관할 시·도
          </label>
          <select
            value={filters.sido}
            onChange={(e) =>
              onFilterChange({ sido: e.target.value, sigungu: '전체' })
            }
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="전체">전국 (전체 시·도)</option>
            {KOREA_REGIONS.map((r) => (
              <option key={r.sido} value={r.sido}>
                {r.sido}
              </option>
            ))}
          </select>
        </div>

        {/* 2. 시/군/구 선택 */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            관할 시·군·구
          </label>
          <select
            value={filters.sigungu}
            onChange={(e) => onFilterChange({ sigungu: e.target.value })}
            disabled={filters.sido === '전체'}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800 disabled:bg-slate-100 disabled:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            {districtList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* 3. 영업 상태 */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            영업 상태
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. 사업자 구분 (법인/개인) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            사업자 구분
          </label>
          <select
            value={filters.businessType}
            onChange={(e) => onFilterChange({ businessType: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="전체">전체 (법인/개인)</option>
            <option value="법인">법인사업자</option>
            <option value="개인">개인사업자</option>
          </select>
        </div>

        {/* 5. 취급 품목 */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            취급 품목
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter status line: Active filters display & total count */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span>검색 결과:</span>
          <span className="font-bold font-mono text-slate-900 text-sm">
            {totalFiltered.toLocaleString()}
          </span>
          <span>건</span>

          {(filters.keyword ||
            filters.sido !== '전체' ||
            filters.sigungu !== '전체' ||
            filters.status !== '전체' ||
            filters.businessType !== '전체' ||
            filters.category !== '전체') && (
            <span className="text-blue-600 font-medium ml-2">
              (필터 적용됨)
            </span>
          )}
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400">정렬:</span>
          <button
            onClick={() => {
              if (filters.sortField === 'dclrDate') {
                onFilterChange({
                  sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc',
                });
              } else {
                onFilterChange({ sortField: 'dclrDate', sortOrder: 'desc' });
              }
            }}
            className={`px-2 py-0.5 rounded transition-colors ${
              filters.sortField === 'dclrDate'
                ? 'font-bold text-blue-700 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            신고일자 {filters.sortField === 'dclrDate' && (filters.sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <span className="text-slate-300">·</span>
          <button
            onClick={() => {
              if (filters.sortField === 'bzmnNm') {
                onFilterChange({
                  sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc',
                });
              } else {
                onFilterChange({ sortField: 'bzmnNm', sortOrder: 'asc' });
              }
            }}
            className={`px-2 py-0.5 rounded transition-colors ${
              filters.sortField === 'bzmnNm'
                ? 'font-bold text-blue-700 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            상호명 {filters.sortField === 'bzmnNm' && (filters.sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>
    </div>
  );
};
