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

// 한국어 주소 유사도 및 토큰 기반 정밀 검사 함수
export function calculateAddressSimilarityScore(b: Business, query: string): number {
  if (!query || !query.trim()) return 100;

  const q = query.trim().toLowerCase();
  const cleanQ = q.replace(/[\s,\(\)\-\.\_]/g, '');

  const rnAddrLower = b.rnAddr.toLowerCase();
  const cleanRnAddr = rnAddrLower.replace(/[\s,\(\)\-\.\_]/g, '');

  const fullAddr = `${b.wrkrSidoNm} ${b.wrkrSiGunGuNm} ${b.rnAddr} ${b.lnoAddr || ''}`.toLowerCase();
  const cleanFullAddr = fullAddr.replace(/[\s,\(\)\-\.\_]/g, '');

  // 1. 도로명 주소(rnAddr) 완전 일치 또는 도로명 주소에 검색어 직접 포함
  if (cleanRnAddr === cleanQ) return 100;
  if (rnAddrLower.includes(q)) return 95;
  if (cleanRnAddr.includes(cleanQ)) return 90;

  // 2. 전체 주소(시도+시군구+도로명+지번)에 검색어 직접 포함
  if (cleanFullAddr.includes(cleanQ)) {
    return 80;
  }

  // 3. 토큰 기반 매칭 (예: "경북 청도", "청도군 청화로", "청도읍 고수리")
  const tokens = q.split(/\s+/).filter((t) => t.length > 0);
  if (tokens.length > 1) {
    let tokenMatches = 0;
    for (const t of tokens) {
      const cleanToken = t.replace(/[\s,\(\)\-\.\_]/g, '');
      const stripped = t.replace(/(시|군|구|동|읍|면|로|길|리|대로)$/, '');

      const matchesRn =
        rnAddrLower.includes(t) ||
        cleanRnAddr.includes(cleanToken) ||
        (stripped.length >= 2 && cleanRnAddr.includes(stripped));

      const matchesFull =
        fullAddr.includes(t) ||
        cleanFullAddr.includes(cleanToken) ||
        (stripped.length >= 2 && cleanFullAddr.includes(stripped));

      if (matchesRn) {
        tokenMatches += 1;
      } else if (matchesFull) {
        tokenMatches += 0.8;
      }
    }

    // 복수 단어 검색 시 75% 이상의 토큰이 일치해야 유효
    const matchRatio = tokenMatches / tokens.length;
    if (matchRatio >= 0.75) {
      return Math.round(matchRatio * 75);
    }
  } else if (tokens.length === 1) {
    const single = tokens[0];
    const cleanToken = single.replace(/[\s,\(\)\-\.\_]/g, '');
    const stripped = single.replace(/(시|군|구|동|읍|면|로|길|리|대로)$/, '');

    // 단일 단어 검색 접미사 유연 매칭 (예: "청도" -> "청도군/청도읍/청화로")
    if (cleanRnAddr.includes(cleanToken)) return 75;
    if (stripped.length >= 2 && cleanRnAddr.includes(stripped)) return 65;
    if (cleanFullAddr.includes(cleanToken)) return 55;
    if (stripped.length >= 2 && cleanFullAddr.includes(stripped)) return 45;
  }

  return 0;
}

export function isAddressSimilar(b: Business, query: string): boolean {
  return calculateAddressSimilarityScore(b, query) > 0;
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
        case 'address':
          if (!isAddressSimilar(b, q)) {
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
          const matchAddr = isAddressSimilar(b, q);
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
    // 주소 검색 모드일 때는 도로명 주소 유사도가 높은 업체를 우선 정렬
    if (filters.searchType === 'address' && filters.keyword.trim()) {
      const scoreA = calculateAddressSimilarityScore(a, filters.keyword);
      const scoreB = calculateAddressSimilarityScore(b, filters.keyword);
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
    }

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
