export interface Business {
  id: string;
  bzmnNm: string; // 상호명
  corpNm?: string; // 법인명
  rprsvNm: string; // 대표자명
  bizrno: string; // 사업자등록번호 (10자리 e.g. 120-81-47521)
  jurirno?: string; // 법인등록번호
  tongsinBzmnDclrNo: string; // 통신판매번호 (e.g. 2024-서울강남-0123)
  wrkrSidoNm: string; // 관할 시/도 (e.g. 서울특별시)
  wrkrSiGunGuNm: string; // 관할 시/군/구 (e.g. 강남구)
  bupNm: '법인' | '개인'; // 사업자 구분
  operSttusNm: '정상영업' | '휴업' | '폐업' | '등록취소'; // 영업상태
  dclrDate: string; // 최초 신고일자 (YYYY-MM-DD)
  sttsChgDtm?: string; // 최종 상태변경일자
  indutyNm: string; // 주요 취급품목 (종합몰, 패션/의류, 식품/농수산 등)
  saleMthdNm: string; // 판매방식 (인터넷, 모바일 등)
  siteAddr: string; // 쇼핑몰 도메인 / 웹사이트
  hostingPvdNm: string; // 호스팅 제공사
  rnAddr: string; // 사업장 도로명주소
  lnoAddr?: string; // 사업장 지번주소
  telNo: string; // 전화번호
  email?: string; // 대표 이메일
  escrow: '가입' | '미가입' | '해당없음'; // 구매안전(에스크로) 가입 여부
  notes?: string;
}

export interface RegionSummary {
  sido: string; // 시/도 명칭 (e.g. 서울특별시)
  shortName: string; // 축약명 (e.g. 서울)
  totalCount: number; // 총 등록업체수
  activeCount: number; // 정상영업수
  suspendedCount: number; // 휴업수
  closedCount: number; // 폐업수
  cancelledCount: number; // 등록취소수
  activeRate: number; // 정상영업율 (%)
  districts: string[]; // 하위 시군구 목록
}

export interface FilterState {
  keyword: string;
  searchType: 'all' | 'bzmnNm' | 'bizrno' | 'rprsvNm' | 'tongsinNo' | 'domain' | 'address';
  sido: string;
  sigungu: string;
  status: string;
  businessType: string;
  category: string;
  saleMethod: string;
  sortField: 'dclrDate' | 'bzmnNm' | 'bizrno';
  sortOrder: 'desc' | 'asc';
}

export interface ApiConfig {
  useLiveApi: boolean;
  serviceKey: string;
  endpointUrl: string;
  lastTestedAt?: string;
  connectionStatus: 'unconfigured' | 'success' | 'failed' | 'testing';
  statusMessage?: string;
}
