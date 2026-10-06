import { Business, FilterState, ApiConfig } from '../types/ftc';
import { INITIAL_BUSINESSES } from '../data/businesses';

// Default public API URL for Fair Trade Commission mail order seller info on data.go.kr
export const DEFAULT_FTC_API_ENDPOINT =
  'https://apis.data.go.kr/1130000/MllBs_1/getMllBsInfo_1';

const LOCAL_STORAGE_KEY_API_CONFIG = 'ftc_openapi_config_v1';
const LOCAL_STORAGE_KEY_BOOKMARKS = 'ftc_saved_bookmarks_v1';

export function getStoredApiConfig(): ApiConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_API_CONFIG);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {
    useLiveApi: false,
    serviceKey: '',
    endpointUrl: DEFAULT_FTC_API_ENDPOINT,
    connectionStatus: 'unconfigured',
    statusMessage: '공공데이터포털 서비스키 미등록 (오프라인 전국 데이터베이스 운용 중)'
  };
}

export function saveApiConfig(config: ApiConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_API_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save API config', e);
  }
}

export function getStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKMARKS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [];
}

export function toggleStoredBookmark(id: string): string[] {
  const current = getStoredBookmarks();
  let updated: string[];
  if (current.includes(id)) {
    updated = current.filter((item) => item !== id);
  } else {
    updated = [...current, id];
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update bookmarks', e);
  }
  return updated;
}

// 사업자등록번호 10자리 유효성 검사 (국세청 표준 체크섬 알고리즘)
export function validateBizrno(bizrno: string): {
  isValid: boolean;
  cleanNumber: string;
  formattedNumber: string;
  reason?: string;
} {
  const clean = bizrno.replace(/[^0-9]/g, '');
  if (clean.length !== 10) {
    return {
      isValid: false,
      cleanNumber: clean,
      formattedNumber: clean,
      reason: '사업자등록번호는 10자리 숫자여야 합니다.'
    };
  }

  const formatted = `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5)}`;
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(clean[i], 10) * weights[i];
  }

  // 9번째 숫자에 가중치 5를 곱한 값의 십의 자리/일의 자리 처리
  const ninthVal = parseInt(clean[8], 10) * 5;
  sum += Math.floor(ninthVal / 10);

  const remainder = (10 - (sum % 10)) % 10;
  const checkDigit = parseInt(clean[9], 10);

  const isValid = remainder === checkDigit;
  return {
    isValid,
    cleanNumber: clean,
    formattedNumber: formatted,
    reason: isValid
      ? '국세청 체크섬 알고리즘 유효 번호입니다.'
      : '체크섬 불일치 (유효하지 않은 번호 형식이거나 오타일 수 있습니다).'
  };
}

// Open API 호출 함수
export async function testOpenApiConnection(
  serviceKey: string,
  endpointUrl: string
): Promise<{ success: boolean; message: string; sampleData?: unknown }> {
  if (!serviceKey || serviceKey.trim() === '') {
    return {
      success: false,
      message: '공공데이터포털 서비스키(일반 인증키)를 입력해주세요.'
    };
  }

  try {
    const encodedKey = encodeURIComponent(serviceKey.trim());
    const testUrl = `${endpointUrl}?serviceKey=${encodedKey}&pageNo=1&numOfRows=2&resultType=json`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(testUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json, application/xml, text/xml, */*'
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        success: false,
        message: `HTTP 오류 발생: 응답 코드 ${res.status} (${res.statusText})`
      };
    }

    const text = await res.text();
    // Check if error XML returned from data.go.kr (e.g. SERVICE_KEY_IS_NOT_REGISTERED_ERROR)
    if (text.includes('SERVICE_KEY_IS_NOT_REGISTERED_ERROR')) {
      return {
        success: false,
        message: '등록되지 않은 서비스키입니다. 공공데이터포털(data.go.kr)에서 활용신청 여부를 확인하세요.'
      };
    }
    if (text.includes('LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR')) {
      return {
        success: false,
        message: '일일 트래픽 초과 (일일 허용 호출건수를 초과하였습니다).'
      };
    }

    return {
      success: true,
      message: '공정거래위원회 오픈API와 정상 통신되었습니다.',
      sampleData: text.slice(0, 200)
    };
  } catch (err: unknown) {
    const error = err as Error;
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: '연결 시간 초과 (네트워크 상태 또는 방화벽/CORS 설정을 확인하세요).'
      };
    }
    return {
      success: false,
      message: `통신 실패: ${error.message || 'CORS 또는 네트워크 차단이 감지되었습니다. 로컬 데이터베이스 모드로 자동 운용됩니다.'}`
    };
  }
}

// 통합 검색 및 필터링
export function filterBusinesses(
  businesses: Business[],
  filters: FilterState
): Business[] {
  return businesses.filter((b) => {
    // 키워드 검색
    if (filters.keyword.trim()) {
      const q = filters.keyword.trim().toLowerCase();
      const cleanQ = q.replace(/[^0-9]/g, '');

      switch (filters.searchType) {
        case 'bzmnNm':
          if (!b.bzmnNm.toLowerCase().includes(q) && !(b.corpNm && b.corpNm.toLowerCase().includes(q))) {
            return false;
          }
          break;
        case 'bizrno':
          if (!b.bizrno.replace(/[^0-9]/g, '').includes(cleanQ)) {
            return false;
          }
          break;
        case 'rprsvNm':
          if (!b.rprsvNm.toLowerCase().includes(q)) {
            return false;
          }
          break;
        case 'tongsinNo':
          if (!b.tongsinBzmnDclrNo.toLowerCase().includes(q)) {
            return false;
          }
          break;
        case 'domain':
          if (!b.siteAddr.toLowerCase().includes(q)) {
            return false;
          }
          break;
        case 'all':
        default: {
          const matchName = b.bzmnNm.toLowerCase().includes(q) || (b.corpNm && b.corpNm.toLowerCase().includes(q));
          const matchBizrno = cleanQ ? b.bizrno.replace(/[^0-9]/g, '').includes(cleanQ) : false;
          const matchCeo = b.rprsvNm.toLowerCase().includes(q);
          const matchTongsin = b.tongsinBzmnDclrNo.toLowerCase().includes(q);
          const matchDomain = b.siteAddr.toLowerCase().includes(q);
          const matchAddr = b.rnAddr.toLowerCase().includes(q);
          if (!matchName && !matchBizrno && !matchCeo && !matchTongsin && !matchDomain && !matchAddr) {
            return false;
          }
          break;
        }
      }
    }

    // 시/도 필터
    if (filters.sido && filters.sido !== '전체') {
      if (!b.wrkrSidoNm.includes(filters.sido)) {
        return false;
      }
    }

    // 시/군/구 필터
    if (filters.sigungu && filters.sigungu !== '전체') {
      if (!b.wrkrSiGunGuNm.includes(filters.sigungu)) {
        return false;
      }
    }

    // 영업 상태 필터
    if (filters.status && filters.status !== '전체') {
      if (b.operSttusNm !== filters.status) {
        return false;
      }
    }

    // 사업자 구분 필터 (법인 / 개인)
    if (filters.businessType && filters.businessType !== '전체') {
      if (b.bupNm !== filters.businessType) {
        return false;
      }
    }

    // 취급 품목 필터
    if (filters.category && filters.category !== '전체') {
      if (!b.indutyNm.includes(filters.category)) {
        return false;
      }
    }

    // 판매 방식 필터
    if (filters.saleMethod && filters.saleMethod !== '전체') {
      if (!b.saleMthdNm.includes(filters.saleMethod)) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    let comparison = 0;
    if (filters.sortField === 'dclrDate') {
      comparison = a.dclrDate.localeCompare(b.dclrDate);
    } else if (filters.sortField === 'bzmnNm') {
      comparison = a.bzmnNm.localeCompare(b.bzmnNm, 'ko');
    } else if (filters.sortField === 'bizrno') {
      comparison = a.bizrno.localeCompare(b.bizrno);
    }
    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });
}
