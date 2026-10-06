import React, { useState } from 'react';
import {
  KOREA_REGIONS,
  TOTAL_NATIONAL_COUNT,
  TOTAL_NATIONAL_ACTIVE,
  TOTAL_NATIONAL_SUSPENDED,
  TOTAL_NATIONAL_CLOSED,
} from '../data/regions';
import { MapPin, TrendingUp, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp, BarChart3, Filter } from 'lucide-react';

interface RegionStatsDashboardProps {
  selectedSido: string;
  onSelectSido: (sido: string) => void;
  filteredCount: number;
}

export const RegionStatsDashboard: React.FC<RegionStatsDashboardProps> = ({
  selectedSido,
  onSelectSido,
  filteredCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');

  const nationalActiveRate = ((TOTAL_NATIONAL_ACTIVE / TOTAL_NATIONAL_COUNT) * 100).toFixed(1);
  const nationalClosedRate = ((TOTAL_NATIONAL_CLOSED / TOTAL_NATIONAL_COUNT) * 100).toFixed(1);

  // Top regions by business count for the chart view
  const topRegions = [...KOREA_REGIONS].sort((a, b) => b.totalCount - a.totalCount);
  const maxRegionCount = topRegions[0]?.totalCount || 1;

  const currentRegion = KOREA_REGIONS.find((r) => r.sido === selectedSido);

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
                전국 17개 시·도별 통신판매사업자 등록현황
              </h2>
              {selectedSido && selectedSido !== '전체' && (
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {selectedSido} 집중 조회중
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              공정거래위원회 및 지자체 인허가 신고 자료 기준 등록업체 통계
            </p>
          </div>
        </div>

        {/* Toggle Controls */}
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
              지역 카드
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'chart'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              순위 차트
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
            {/* National Total */}
            <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
              <span className="text-xs text-slate-500 block mb-1">
                {selectedSido === '전체' ? '전국 총 등록사업자' : `${selectedSido} 총 등록`}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 font-mono tracking-tight">
                  {selectedSido === '전체'
                    ? TOTAL_NATIONAL_COUNT.toLocaleString()
                    : (currentRegion?.totalCount ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-slate-500">개소</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                <span>누적 전자상거래 신고</span>
              </div>
            </div>

            {/* Active */}
            <div className="bg-emerald-50/50 rounded-lg p-3.5 border border-emerald-100">
              <span className="text-xs text-emerald-800 block mb-1">정상 영업 업체</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-emerald-700 font-mono tracking-tight">
                  {selectedSido === '전체'
                    ? TOTAL_NATIONAL_ACTIVE.toLocaleString()
                    : (currentRegion?.activeCount ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-emerald-600">개소</span>
              </div>
              <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                <span>영업률 {selectedSido === '전체' ? nationalActiveRate : currentRegion?.activeRate}%</span>
              </div>
            </div>

            {/* Suspended */}
            <div className="bg-amber-50/50 rounded-lg p-3.5 border border-amber-100">
              <span className="text-xs text-amber-800 block mb-1">휴업 상태</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-amber-700 font-mono tracking-tight">
                  {selectedSido === '전체'
                    ? TOTAL_NATIONAL_SUSPENDED.toLocaleString()
                    : (currentRegion?.suspendedCount ?? 0).toLocaleString()}
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
                  {selectedSido === '전체'
                    ? TOTAL_NATIONAL_CLOSED.toLocaleString()
                    : (currentRegion?.closedCount ?? 0).toLocaleString()}
                </span>
                <span className="text-xs text-rose-600">개소</span>
              </div>
              <div className="text-[11px] text-rose-700 mt-1 flex items-center gap-1">
                <XCircle className="w-3 h-3 text-rose-600" />
                <span>폐업률 {selectedSido === '전체' ? nationalClosedRate : (100 - (currentRegion?.activeRate ?? 85)).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* View Mode: Interactive Region Grid */}
          {viewMode === 'grid' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                  지역 카드를 클릭하면 해당 지역으로 즉시 검색됩니다
                </span>
                {selectedSido !== '전체' && (
                  <button
                    onClick={() => onSelectSido('전체')}
                    className="text-xs text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    전국 전체 보기
                  </button>
                )}
              </div>

              {/* 17 Regions Button Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2">
                {/* 전국 전체 선택 버튼 */}
                <button
                  onClick={() => onSelectSido('전체')}
                  className={`p-2.5 rounded-lg border text-left transition-all relative ${
                    selectedSido === '전체'
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">전국전체</span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-blue-700">
                    {(TOTAL_NATIONAL_COUNT / 10000).toFixed(1)}만
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    영업률 {nationalActiveRate}%
                  </div>
                </button>

                {/* 17 Regional Items */}
                {KOREA_REGIONS.map((region) => {
                  const isSelected = selectedSido === region.sido;
                  const countInTenThousand = (region.totalCount / 10000).toFixed(1);

                  return (
                    <button
                      key={region.sido}
                      onClick={() => onSelectSido(region.sido)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">
                          {region.shortName}
                        </span>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            region.activeRate >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          title={`정상영업률 ${region.activeRate}%`}
                        />
                      </div>
                      <div className="text-xs font-mono font-semibold text-slate-800">
                        {countInTenThousand}만건
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        정상 {region.activeRate}%
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
                시·도별 통신판매사업자 등록 규모 순위 (상위 17개 광역시·도)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {topRegions.map((region, idx) => {
                  const percentage = ((region.totalCount / maxRegionCount) * 100).toFixed(0);
                  const isSelected = selectedSido === region.sido;

                  return (
                    <div
                      key={region.sido}
                      onClick={() => onSelectSido(region.sido)}
                      className={`flex items-center gap-3 p-1.5 rounded cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-5 text-right font-mono text-xs text-slate-400 font-bold">
                        {idx + 1}
                      </span>
                      <span className="w-12 text-xs font-medium text-slate-800 truncate">
                        {region.shortName}
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
                        {region.totalCount.toLocaleString()}
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
