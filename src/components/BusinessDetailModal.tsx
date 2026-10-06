import React, { useState } from 'react';
import { Business } from '../types/ftc';
import { validateBizrno } from '../services/ftcApi';
import {
  X,
  Printer,
  Copy,
  Check,
  Building,
  ShieldCheck,
  AlertTriangle,
  Globe,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  Shield,
  FileText,
} from 'lucide-react';

interface BusinessDetailModalProps {
  business: Business | null;
  onClose: () => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!business) return null;

  const brnCheck = validateBizrno(business.bizrno);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = () => {
    switch (business.operSttusNm) {
      case '정상영업':
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>정상영업 (신고 유효)</span>
          </div>
        );
      case '휴업':
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>휴업 (임시 영업중단)</span>
          </div>
        );
      case '폐업':
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-50 px-3 py-1 rounded-md border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>폐업 (상거래 불가)</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
            <span>{business.operSttusNm}</span>
          </div>
        );
    }
  };

  const mapQuery = encodeURIComponent(business.rnAddr || business.bzmnNm);
  const naverMapUrl = `https://map.naver.com/p/search/${mapQuery}`;
  const kakaoMapUrl = `https://map.kakao.com/link/search/${mapQuery}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  통신판매사업자 신고자료 상세내역
                </h3>
                <span className="text-[11px] text-blue-200 font-mono">
                  FTC-{business.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                전자상거래 등에서의 소비자보호에 관한 법률 제12조에 따른 등록정보
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-300 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="인쇄 미리보기"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Top Identity Block */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{business.bzmnNm}</h2>
                <span className="text-xs text-slate-500 font-medium">({business.bupNm}사업자)</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                관할청: {business.wrkrSidoNm} {business.wrkrSiGunGuNm}
              </p>
            </div>
            <div>{getStatusBadge()}</div>
          </div>

          {/* Section 1: 사업자 기본사항 */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              1. 사업자 기본사항
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">상호명 / 법인명</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {business.bzmnNm}
                  {business.corpNm && business.corpNm !== business.bzmnNm && (
                    <span className="text-slate-500 text-xs ml-1 font-normal">
                      ({business.corpNm})
                    </span>
                  )}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">대표자 성명</span>
                <span className="font-semibold text-slate-900 text-sm">{business.rprsvNm}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">사업자등록번호 (10자리)</span>
                <div className="flex items-center gap-1.5 font-mono text-slate-900 font-bold">
                  <span>{business.bizrno}</span>
                  <button
                    onClick={() => handleCopy(business.bizrno, 'modal-brn')}
                    className="p-1 text-slate-400 hover:text-slate-800 transition-colors"
                    title="사업자등록번호 복사"
                  >
                    {copiedKey === 'modal-brn' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {brnCheck.isValid ? (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-sans font-medium">
                      검증 통과
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-sans font-medium">
                      체크섬 확인필요
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">법인등록번호</span>
                <span className="font-mono text-slate-800">
                  {business.jurirno || '해당없음 (개인사업자)'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: 통신판매업 신고정보 */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              2. 통신판매 신고 정보
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">통신판매 신고번호</span>
                <div className="flex items-center gap-1.5 font-mono text-slate-900 font-bold">
                  <span>{business.tongsinBzmnDclrNo}</span>
                  <button
                    onClick={() => handleCopy(business.tongsinBzmnDclrNo, 'modal-tong')}
                    className="p-1 text-slate-400 hover:text-slate-800 transition-colors"
                    title="통신판매번호 복사"
                  >
                    {copiedKey === 'modal-tong' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">신고 일자</span>
                <span className="font-mono text-slate-800">{business.dclrDate}</span>
                {business.sttsChgDtm && (
                  <span className="text-slate-400 text-[11px] ml-1.5">
                    (최종변경: {business.sttsChgDtm})
                  </span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">주요 취급품목</span>
                <span className="font-medium text-slate-800">{business.indutyNm}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">판매 방식</span>
                <span className="font-medium text-slate-800">{business.saleMthdNm}</span>
              </div>
            </div>
          </div>

          {/* Section 3: 인터넷 쇼핑몰 및 호스팅 */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              3. 인터넷 쇼핑몰 및 호스팅
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">쇼핑몰 도메인 / 웹사이트</span>
                {business.siteAddr ? (
                  <div className="flex items-center gap-1.5">
                    <a
                      href={
                        business.siteAddr.startsWith('http')
                          ? business.siteAddr
                          : `https://${business.siteAddr}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800 underline truncate flex items-center gap-1"
                    >
                      <span>{business.siteAddr}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                ) : (
                  <span className="text-slate-400">등록 도메인 없음</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">호스팅 서버 제공자</span>
                <span className="font-medium text-slate-800">
                  {business.hostingPvdNm || '자체 호스팅 / 미지정'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: 사업장 소재지 및 연락처 */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              4. 사업장 소재지 및 연락처
            </h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-2.5">
              <div>
                <span className="text-slate-400 block mb-0.5">도로명 주소</span>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">{business.rnAddr}</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={naverMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-[11px] font-medium"
                    >
                      네이버지도 길찾기
                    </a>
                    <span className="text-slate-300">·</span>
                    <a
                      href={kakaoMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline text-[11px] font-medium"
                    >
                      카카오맵 보기
                    </a>
                  </div>
                </div>
              </div>

              {business.lnoAddr && (
                <div>
                  <span className="text-slate-400 block mb-0.5">지번 주소</span>
                  <span className="text-slate-600">{business.lnoAddr}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-500">전화번호:</span>
                  <a
                    href={`tel:${business.telNo}`}
                    className="font-medium text-slate-900 hover:text-blue-600"
                  >
                    {business.telNo}
                  </a>
                </div>

                {business.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-500">이메일:</span>
                    <a
                      href={`mailto:${business.email}`}
                      className="font-medium text-slate-900 hover:text-blue-600 truncate"
                    >
                      {business.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: 소비자 안심 거래 체크포인트 */}
          <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100">
            <h4 className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              소비자 안심 거래 검증 체크포인트
            </h4>
            <div className="space-y-1.5 text-xs text-blue-950/80">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-800 shrink-0">· 에스크로(구매안전서비스):</span>
                <span>
                  {business.escrow === '가입'
                    ? '가입 확인됨 (결제대금예치 및 소비자피해보상보험 대상)'
                    : '미가입 또는 결제 수단별 확인 필요'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-800 shrink-0">· 국세청 사업자등록 알고리즘:</span>
                <span>{brnCheck.reason}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-800 shrink-0">· 거래 전 필수 확인:</span>
                <span>
                  실제 쇼핑몰 하단(Footer)에 표시된 대표자명, 상호, 사업자번호가 본 신고자료와 정확히 일치하는지 대조하세요.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            출처: 공정거래위원회 공공데이터포털(data.go.kr) 통신판매사업자 신고자료
          </div>
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
