import React, { useState } from 'react';
import { validateBizrno } from '../services/ftcApi';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface BrnValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchBrn?: (brn: string) => void;
}

export const BrnValidatorModal: React.FC<BrnValidatorModalProps> = ({
  isOpen,
  onClose,
  onSearchBrn,
}) => {
  const [inputBrn, setInputBrn] = useState('');
  const [result, setResult] = useState<ReturnType<typeof validateBizrno> | null>(null);

  if (!isOpen) return null;

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputBrn.trim()) return;
    const res = validateBizrno(inputBrn);
    setResult(res);
  };

  const handleApplyExample = (example: string) => {
    setInputBrn(example);
    setResult(validateBizrno(example));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                사업자등록번호 유효성 검증기
              </h3>
              <p className="text-xs text-slate-400">
                국세청 표준 10자리 체크섬 모듈로10 가중치 알고리즘
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
        <div className="p-5 space-y-4 text-xs text-slate-700">
          <form onSubmit={handleValidate} className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                사업자등록번호 10자리 입력
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputBrn}
                  onChange={(e) => {
                    setInputBrn(e.target.value);
                    setResult(null);
                  }}
                  placeholder="예: 120-88-00767 또는 1208800767"
                  className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors shrink-0"
                >
                  검증하기
                </button>
              </div>
            </div>
          </form>

          {/* Validation Result */}
          {result && (
            <div
              className={`p-3.5 rounded-xl border ${
                result.isValid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {result.isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="font-bold text-sm">
                  {result.isValid ? '유효한 사업자등록번호' : '유효하지 않은 번호'}
                </span>
                <span className="font-mono text-xs bg-white/70 px-1.5 py-0.5 rounded ml-auto">
                  {result.formattedNumber}
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-700">{result.reason}</p>

              {result.isValid && onSearchBrn && (
                <button
                  onClick={() => {
                    onSearchBrn(result.cleanNumber);
                    onClose();
                  }}
                  className="mt-2.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md text-xs transition-colors"
                >
                  본 사업자번호로 통신판매 자료 즉시 검색 →
                </button>
              )}
            </div>
          )}

          {/* Examples */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              테스트 예시 번호 클릭
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleApplyExample('120-88-00767')}
                className="px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 rounded text-slate-700 font-mono text-[11px]"
              >
                120-88-00767 (쿠팡)
              </button>
              <button
                onClick={() => handleApplyExample('220-81-62517')}
                className="px-2 py-1 bg-white hover:bg-blue-50 border border-slate-200 rounded text-slate-700 font-mono text-[11px]"
              >
                220-81-62517 (네이버)
              </button>
              <button
                onClick={() => handleApplyExample('123-45-67899')}
                className="px-2 py-1 bg-white hover:bg-rose-50 border border-slate-200 rounded text-slate-700 font-mono text-[11px]"
              >
                123-45-67899 (오류번호)
              </button>
            </div>
          </div>

          {/* Info note */}
          <div className="flex items-start gap-1.5 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              사업자등록번호 체크섬은 번호 생성 규격의 유효성을 검사하며, 실제 개업/폐업 등 국세청 과세상태 조회가 필요한 경우 홈택스 사업자등록상태 조회를 이용할 수 있습니다.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg text-xs transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
