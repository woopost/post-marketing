import React, { useState, useMemo } from 'react';
import {
  ALL_DG_GB_DISTRICTS,
  DAEGU_DISTRICTS,
  GYEONGBUK_DISTRICTS,
  TOTAL_DAEGU_COUNT,
  TOTAL_DAEGU_ACTIVE,
  TOTAL_DAEGU_SUSPENDED,
  TOTAL_DAEGU_CLOSED,
  TOTAL_GYEONGBUK_COUNT,
  TOTAL_GYEONGBUK_ACTIVE,
  TOTAL_GYEONGBUK_SUSPENDED,
  TOTAL_GYEONGBUK_CLOSED,
  TOTAL_DG_GB_COUNT,
  TOTAL_DG_GB_ACTIVE,
  TOTAL_DG_GB_SUSPENDED,
  TOTAL_DG_GB_CLOSED,
  DistrictStat,
} from '../data/daeguGyeongbuk';
import {
  MapPin,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Building,
} from 'lucide-react';

interface RegionStatsDashboardProps {
  selectedSido: string;
  selectedSigungu?: string;
  onSelectRegion: (sido: string, sigungu?: string) => void;
  filteredCount: number;
}

export const RegionStatsDashboard: React.FC<RegionStatsDashboardProps> = ({
  selectedSido,
  selectedSigungu = '전체',
  onSelectRegion,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');
  const [regionTab, setRegionTab] = useState<'all' | 'daegu' | 'gyeongbuk'>('all');

  // Determine current statistics based on selected Sido and Sigungu
  const currentStats = useMemo(() => {
    // Specific district selected
    if (selectedSigungu && selectedSigungu !== '전체') {
      const match = ALL_DG_GB_DISTRICTS.find((d) => d.district === selectedSigungu);
      if (match) {
        return {
          title: `${match.sido} ${match.district}`,
          total: match.totalCount,
          active: match.activeCount,
          suspended: match.suspendedCount,
          closed: match.closedCount,
          activeRate: match.activeRate.toFixed(1),
          closedRate: (100 - match.activeRate).toFixed(1),
        };
      }
    }

    // Daegu selected
    if (selectedSido === '대구광역시') {
      return {
        title: '대구광역시 전체',
        total: TOTAL_DAEGU_COUNT,
        active: TOTAL_DAEGU_ACTIVE,
        suspended: TOTAL_DAEGU_SUSPENDED,
        closed: TOTAL_DAEGU_CLOSED,
        activeRate: ((TOTAL_DAEGU_ACTIVE / TOTAL_DAEGU_COUNT) * 100).toFixed(1),
        closedRate: ((TOTAL_DAEGU_CLOSED / TOTAL_DAEGU_COUNT) * 100).toFixed(1),
      };
    }

    // Gyeongbuk selected
    if (selectedSido === '경상북도') {
      return {
        title: '경상북도 전체',
        total: TOTAL_GYEONGBUK_COUNT,
        active: TOTAL_GYEONGBUK_ACTIVE,
        suspended: TOTAL_GYEONGBUK_SUSPENDED,
        closed: TOTAL_GYEONGBUK_CLOSED,
        activeRate: ((TOTAL_GYEONGBUK_ACTIVE / TOTAL_GYEONGBUK_COUNT) * 100).toFixed(1),
        closedRate: ((TOTAL_GYEONGBUK_CLOSED / TOTAL_GYEONGBUK_COUNT) * 100).toFixed(1),
      };
    }

    // Default: Daegu + Gyeongbuk combined
    return {
      title: '대구·경북 전체 (32개 시·군·구)',
      total: TOTAL_DG_GB_COUNT,
      active: TOTAL_DG_GB_ACTIVE,
      suspended: TOTAL_DG_GB_SUSPENDED,
      closed: TOTAL_DG_GB_CLOSED,
      activeRate: ((TOTAL_DG_GB_ACTIVE / TOTAL_DG_GB_COUNT) * 100).toFixed(1),
      closedRate: ((TOTAL_DG_GB_CLOSED / TOTAL_DG_GB_COUNT) * 100).toFixed(1),
    };
  }, [selectedSido, selectedSigungu]);

  // Filtered district cards list according to tab
  const displayDistricts = useMemo(() => {
    if (regionTab === 'daegu') return DAEGU_DISTRICTS;
    if (regionTab === 'gyeongbuk') return GYEONGBUK_DISTRICTS;
    return ALL_DG_GB_DISTRICTS;
  }, [regionTab]);

  // Top districts for ranking chart view
  const topDistricts = useMemo(() => {
    return [...ALL_DG_GB_DISTRICTS].sort((a, b) => b.totalCount - a.totalCount);
  }, []);

  const maxDistrictCount = topDistricts[0]?.totalCount || 1;

  const isDistrictSelected = (sido: string, district: string) => {
    if (district === '전체') {
      return selectedSido === sido && (!selectedSigungu || selectedSigungu === '전체');
    }
    return (
      (selectedSido === '전체' || selectedSido === sido) &&
      selectedSigungu === district
    );
  };

  const isAllSelected =
    (!selectedSido || selectedSido === '전체') &&
    (!selectedSigungu || selectedSigungu === '전체');

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-6">
      {/* Top Banner / Accordion Header */}
      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                대구·경북 통신판매사업자 등록현황 (시·군·구)
              </h2>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                {currentStats.title}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              대구광역시 9개 구·군 및 경상북도 23개 시·군 인허가 신고 자료 기준 등록업체 통계
            </p>
          </div>
        </div>

        {/* Toggle Controls: Grid/Chart & Collapse */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              시군구 카드
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'chart'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              규모 순위
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
            title={isExpanded ? '통계 접기' : '통계 펼치기'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5">
          {/* Summary KPIs Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {/* Total */}
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
              <span className="text-xs text-slate-500 block mb-1">
                {currentStats.title} 총 등록
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 font-mono tracking-tight">
                  {currentStats.total.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500">개소</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                <span>누적 인허가 신고</span>
              </div>
            </div>

            {/* Active */}
            <div className="bg-emerald-50/50 rounded-lg p-3.5 border border-emerald-100">
              <span className="text-xs text-emerald-800 block mb-1">정상 영업 업체</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-emerald-700 font-mono tracking-tight">
                  {currentStats.active.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-600">개소</span>
              </div>
              <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>영업률 {currentStats.activeRate}%</span>
              </div>
            </div>

            {/* Suspended */}
            <div className="bg-amber-50/50 rounded-lg p-3.5 border border-amber-100">
              <span className="text-xs text-amber-800 block mb-1">휴업 상태</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-amber-700 font-mono tracking-tight">
                  {currentStats.suspended.toLocaleString()}
                </span>
                <span className="text-xs text-amber-600">개소</span>
              </div>
              <div className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>임시 사업 중단</span>
              </div>
            </div>

            {/* Closed */}
            <div className="bg-rose-50/50 rounded-lg p-3.5 border border-rose-100">
              <span className="text-xs text-rose-800 block mb-1">폐업 및 취소</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-rose-700 font-mono tracking-tight">
                  {currentStats.closed.toLocaleString()}
                </span>
                <span className="text-xs text-rose-600">개소</span>
              </div>
              <div className="text-[11px] text-rose-700 mt-1 flex items-center gap-1">
                <XCircle className="w-3 h-3 text-rose-600" />
                <span>폐업률 {currentStats.closedRate}%</span>
              </div>
            </div>
          </div>

          {/* View Mode: Interactive District Cards */}
          {viewMode === 'grid' && (
            <div>
              {/* Scope Tabs & Instruction */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setRegionTab('all')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      regionTab === 'all'
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    대구·경북 전체 (32개)
                  </button>
                  <button
                    onClick={() => setRegionTab('daegu')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      regionTab === 'daegu'
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    대구광역시 (9개 구·군)
                  </button>
                  <button
                    onClick={() => setRegionTab('gyeongbuk')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      regionTab === 'gyeongbuk'
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    경상북도 (23개 시·군)
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-blue-600" />
                    시·군·구 카드를 클릭하면 해당 지역으로 즉시 검색됩니다
                  </span>
                  {!isAllSelected && (
                    <button
                      onClick={() => onSelectRegion('전체', '전체')}
                      className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold"
                    >
                      전체 초기화
                    </button>
                  )}
                </div>
              </div>

              {/* District Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {/* 1. 대구·경북 총괄 카드 */}
                {regionTab === 'all' && (
                  <button
                    onClick={() => onSelectRegion('전체', '전체')}
                    className={`p-2.5 rounded-lg border text-left transition-all relative ${
                      isAllSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">대구·경북 전체</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-blue-700">
                      {(TOTAL_DG_GB_COUNT / 10000).toFixed(1)}만건
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      영업률 83.1%
                    </div>
                  </button>
                )}

                {/* 2. 대구광역시 광역 카드 */}
                {(regionTab === 'all' || regionTab === 'daegu') && (
                  <button
                    onClick={() => onSelectRegion('대구광역시', '전체')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      selectedSido === '대구광역시' && selectedSigungu === '전체'
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">대구 전체</span>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1 rounded">
                        시
                      </span>
                    </div>
                    <div className="text-xs font-mono font-semibold text-slate-900">
                      {(TOTAL_DAEGU_COUNT / 10000).toFixed(1)}만건
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      9개 구·군
                    </div>
                  </button>
                )}

                {/* 3. 경상북도 광역 카드 */}
                {(regionTab === 'all' || regionTab === 'gyeongbuk') && (
                  <button
                    onClick={() => onSelectRegion('경상북도', '전체')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      selectedSido === '경상북도' && selectedSigungu === '전체'
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">경북 전체</span>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1 rounded">
                        도
                      </span>
                    </div>
                    <div className="text-xs font-mono font-semibold text-slate-900">
                      {(TOTAL_GYEONGBUK_COUNT / 10000).toFixed(1)}만건
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      23개 시·군
                    </div>
                  </button>
                )}

                {/* 4. Individual District Cards */}
                {displayDistricts.map((item) => {
                  const isSelected = isDistrictSelected(item.sido, item.district);
                  const isDaegu = item.sidoShort === '대구';

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelectRegion(item.sido, item.district)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.district}
                        </span>
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-medium ${
                            isDaegu
                              ? 'text-indigo-700 bg-indigo-50 border border-indigo-100'
                              : 'text-slate-600 bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {item.sidoShort}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-semibold text-slate-800">
                        {item.totalCount >= 10000
                          ? `${(item.totalCount / 10000).toFixed(1)}만건`
                          : `${item.totalCount.toLocaleString()}건`}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
                        <span>정상 {item.activeRate}%</span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.activeRate >= 83 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          title={`정상영업률 ${item.activeRate}%`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* View Mode: Ranking Bar Chart */}
          {viewMode === 'chart' && (
            <div className="space-y-2 pt-1">
              <div className="text-xs font-semibold text-slate-700 mb-2">
                대구·경북 시·군·구별 통신판매사업자 등록 규모 순위 (상위 32개 구·시·군)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {topDistricts.map((item, idx) => {
                  const percentage = ((item.totalCount / maxDistrictCount) * 100).toFixed(0);
                  const isSelected = isDistrictSelected(item.sido, item.district);

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectRegion(item.sido, item.district)}
                      className={`flex items-center gap-3 p-1.5 rounded cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-5 text-right font-mono text-xs text-slate-400 font-bold">
                        {idx + 1}
                      </span>
                      <span className="w-24 text-xs font-medium text-slate-800 truncate flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">[{item.sidoShort}]</span>
                        <span>{item.district}</span>
                      </span>
                      <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isSelected ? 'bg-blue-600' : 'bg-slate-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-16 text-right font-mono text-xs font-medium text-slate-700">
                        {item.totalCount.toLocaleString()}건
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
