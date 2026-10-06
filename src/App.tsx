import React, { useState, useEffect, useMemo } from 'react';
import { Business, FilterState, ApiConfig } from './types/ftc';
import { INITIAL_BUSINESSES } from './data/businesses';
import {
  filterBusinesses,
  getStoredApiConfig,
  getStoredBookmarks,
  toggleStoredBookmark,
} from './services/ftcApi';
import { Header } from './components/Header';
import { RegionStatsDashboard } from './components/RegionStatsDashboard';
import { SearchFilterBar } from './components/SearchFilterBar';
import { BusinessListTable } from './components/BusinessListTable';
import { BusinessDetailModal } from './components/BusinessDetailModal';
import { ApiStatusModal } from './components/ApiStatusModal';
import { BrnValidatorModal } from './components/BrnValidatorModal';
import { SavedBookmarksDrawer } from './components/SavedBookmarksDrawer';
import { Shield, Info, ExternalLink, Database, Search } from 'lucide-react';

export default function App() {
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    useLiveApi: false,
    serviceKey: '',
    endpointUrl: '',
    connectionStatus: 'unconfigured',
  });

  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    searchType: 'all',
    sido: '전체',
    sigungu: '전체',
    status: '전체',
    businessType: '전체',
    category: '전체',
    saleMethod: '전체',
    sortField: 'dclrDate',
    sortOrder: 'desc',
  });

  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);

  // Initialize stored configs and bookmarks
  useEffect(() => {
    setApiConfig(getStoredApiConfig());
    setBookmarks(getStoredBookmarks());

    // Load businesses from backend proxy
    fetch('/api/ftc/businesses')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          setBusinesses(data.items);
        }
      })
      .catch((err) => {
        console.info('Using local dataset', err);
      });
  }, []);

  // Filtered businesses
  const filteredBusinesses = useMemo(() => {
    return filterBusinesses(businesses, filters);
  }, [businesses, filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      searchType: 'all',
      sido: '전체',
      sigungu: '전체',
      status: '전체',
      businessType: '전체',
      category: '전체',
      saleMethod: '전체',
      sortField: 'dclrDate',
      sortOrder: 'desc',
    });
  };

  const handleSelectSido = (sido: string) => {
    setFilters((prev) => ({
      ...prev,
      sido,
      sigungu: '전체',
    }));
  };

  const handleToggleBookmark = (id: string) => {
    const updated = toggleStoredBookmark(id);
    setBookmarks(updated);
  };

  // CSV Export for filtered results
  const handleExportCsv = () => {
    if (filteredBusinesses.length === 0) return;
    const headers = [
      '상호명',
      '대표자',
      '사업자등록번호',
      '통신판매신고번호',
      '사업자구분',
      '관할시도',
      '관할시군구',
      '영업상태',
      '신고일자',
      '취급품목',
      '쇼핑몰도메인',
      '호스팅제공자',
      '대표전화번호',
      '도로명주소',
    ];
    const rows = filteredBusinesses.map((b) => [
      `"${b.bzmnNm.replace(/"/g, '""')}"`,
      `"${b.rprsvNm.replace(/"/g, '""')}"`,
      `"${b.bizrno}"`,
      `"${b.tongsinBzmnDclrNo}"`,
      `"${b.bupNm}"`,
      `"${b.wrkrSidoNm}"`,
      `"${b.wrkrSiGunGuNm}"`,
      `"${b.operSttusNm}"`,
      `"${b.dclrDate}"`,
      `"${b.indutyNm}"`,
      `"${b.siteAddr || ''}"`,
      `"${b.hostingPvdNm || ''}"`,
      `"${b.telNo}"`,
      `"${b.rnAddr.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `공정위_통신판매사업자_조회결과_${filters.sido !== '전체' ? filters.sido + '_' : ''}${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearchByBrn = (cleanBrn: string) => {
    setFilters((prev) => ({
      ...prev,
      keyword: cleanBrn,
      searchType: 'bizrno',
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        apiConfig={apiConfig}
        bookmarkCount={bookmarks.length}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenValidator={() => setIsValidatorOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner with quick search tip */}
        <div className="mb-4 bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">
                전자상거래 소비자보호법에 따른 통신판매사업자 공시정보
              </div>
              <div className="text-[11px] text-slate-500">
                인터넷쇼핑몰, 오픈마켓 셀러, 스마트스토어 등 전자상거래 등록업체의 인허가 신고현황 및 안전거래 정보를 실시간 조회합니다.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">빠른 조회:</span>
            <button
              onClick={() => handleFilterChange({ keyword: '쿠팡', searchType: 'all' })}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              쿠팡
            </button>
            <button
              onClick={() => handleFilterChange({ keyword: '네이버', searchType: 'all' })}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              네이버
            </button>
            <button
              onClick={() => handleFilterChange({ keyword: '우아한형제들', searchType: 'all' })}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              배달의민족
            </button>
            <button
              onClick={() => handleFilterChange({ keyword: '무신사', searchType: 'all' })}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              무신사
            </button>
          </div>
        </div>

        {/* 1. Regional Statistics Dashboard */}
        <RegionStatsDashboard
          selectedSido={filters.sido}
          onSelectSido={handleSelectSido}
          filteredCount={filteredBusinesses.length}
        />

        {/* 2. Search & Filter Bar */}
        <SearchFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onExportCsv={handleExportCsv}
          totalFiltered={filteredBusinesses.length}
        />

        {/* 3. Business List Table & Cards */}
        <BusinessListTable
          businesses={filteredBusinesses}
          bookmarks={bookmarks}
          onToggleBookmark={handleToggleBookmark}
          onSelectBusiness={(biz) => setSelectedBusiness(biz)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-white font-semibold">
                공정거래위원회 통신판매사업자 신고자료 통합조회
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <a
                href="https://www.ftc.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                공정거래위원회(FTC)
              </a>
              <span className="text-slate-700">|</span>
              <a
                href="https://www.data.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                공공데이터포털(data.go.kr)
              </a>
              <span className="text-slate-700">|</span>
              <a
                href="https://www.hometax.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                국세청 홈택스
              </a>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed">
            <p>
              본 시스템은 전자상거래 등에서의 소비자보호에 관한 법률 및 공공데이터의 제공 및 이용 활성화에 관한 법률에 따라 공공데이터포털(data.go.kr) 오픈API와 지자체 인허가 공시자료를 기반으로 제공됩니다.
            </p>
            <p className="mt-1">
              사업자등록상태 및 통신판매업 신고사항의 법적 효력 및 최종 확인은 공정거래위원회 공식 홈페이지 및 관할 시·군·구청에서 확인하시기 바랍니다.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BusinessDetailModal
        business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
      />

      <ApiStatusModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />

      <BrnValidatorModal
        isOpen={isValidatorOpen}
        onClose={() => setIsValidatorOpen(false)}
        onSearchBrn={handleSearchByBrn}
      />

      <SavedBookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        businesses={businesses}
        onToggleBookmark={handleToggleBookmark}
        onSelectBusiness={(biz) => setSelectedBusiness(biz)}
      />
    </div>
  );
}
