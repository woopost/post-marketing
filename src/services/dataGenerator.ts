import { Business, FilterState } from '../types/ftc';
import { KOREA_REGIONS } from '../data/regions';

// District weights / business templates by province
interface RegionalTemplate {
  sido: string;
  shortName: string;
  districts: string[];
  businesses: {
    district: string;
    names: string[];
    categories: string[];
    phonePrefix: string;
    roads: string[];
  }[];
}

const REGIONAL_TEMPLATES: Record<string, RegionalTemplate> = {
  경상북도: {
    sido: '경상북도',
    shortName: '경북',
    districts: [
      '포항시 남구', '포항시 북구', '구미시', '경산시', '경주시', '안동시', '김천시',
      '영주시', '영천시', '상주시', '문경시', '칠곡군', '의성군', '청송군', '영덕군',
      '청도군', '고령군', '성주군', '봉화군', '울진군', '울릉군', '예천군'
    ],
    businesses: [
      {
        district: '포항시 남구',
        names: ['포항구룡포과메기몰', '호미곶해양수산', '영일만돌미역직판', '포항스틸스마트스토어', '포항남구수산유통'],
        categories: ['식품/농수산', '종합몰', '가전/전자'],
        phonePrefix: '054-276',
        roads: ['경상북도 포항시 남구 구룡포읍 호미로 212', '경상북도 포항시 남구 대이로 41', '경상북도 포항시 남구 오천읍 원리로 33']
      },
      {
        district: '포항시 북구',
        names: ['죽도시장건어물명가', '영일대해상레저기어', '포항북구산지직송', '환호공원아트샵'],
        categories: ['식품/농수산', '레저/스포츠', '생활/인테리어'],
        phonePrefix: '054-245',
        roads: ['경상북도 포항시 북구 죽도시장길 35', '경상북도 포항시 북구 해안로 199', '경상북도 포항시 북구 중앙로 288']
      },
      {
        district: '구미시',
        names: ['구미스마트테크존', '금오산유기농마켓', '구미모바일부품몰', '인동패션아울렛', '구미산업자동화기어', '구미디지털솔루션'],
        categories: ['가전/전자', '패션/의류', '식품/농수산', '종합몰'],
        phonePrefix: '054-461',
        roads: ['경상북도 구미시 1공단로 198, IT센터', '경상북도 구미시 인동가산로 14', '경상북도 구미시 송정대로 55']
      },
      {
        district: '안동시',
        names: ['안동하회한우명가', '안동간고등어전통몰', '안동참마영농조합', '하회탈수공예방', '안동소주전통주샵', '도산서원유학책방'],
        categories: ['식품/농수산', '생활/인테리어', '도서/음반'],
        phonePrefix: '054-853',
        roads: ['경상북도 안동시 풍천면 검무로 14', '경상북도 안동시 제비원로 120', '경상북도 안동시 하회종가길 45']
      },
      {
        district: '경주시',
        names: ['경주황남제과베이커리', '신라명과경주빵', '첨성대문화기프트', '보문단지리조트마켓', '불국사도예공방', '경주월드레저샵'],
        categories: ['식품/농수산', '생활/인테리어', '레저/스포츠'],
        phonePrefix: '054-772',
        roads: ['경상북도 경주시 포석로 1068, 황리단길', '경상북도 경주시 보문로 422', '경상북도 경주시 불국신택지7길 12']
      },
      {
        district: '경산시',
        names: ['경산대추한과몰', '영남대창업벤처랩', '하양스마트패션', '경산묘목농원', '진량산업기기'],
        categories: ['식품/농수산', '패션/의류', '가전/전자'],
        phonePrefix: '054-811',
        roads: ['경상북도 경산시 대동 대학로 280', '경상북도 경산시 하양읍 하양로 135', '경상북도 경산시 진량읍 공단로 88']
      },
      {
        district: '김천시',
        names: ['김천황악산자두농원', '김천포도클러스터', '직지사자연치유식품', '김천혁신스마트오피스'],
        categories: ['식품/농수산', '가전/전자', '생활/인테리어'],
        phonePrefix: '054-434',
        roads: ['경상북도 김천시 혁신3로 19', '경상북도 김천시 대항면 직지사길 95', '경상북도 김천시 아포읍 아포대로 450']
      },
      {
        district: '영주시',
        names: ['영주풍기인삼명가', '소백산산나물직판', '풍기인견패션하우스', '영주부석사사과원'],
        categories: ['식품/건강', '패션/의류', '식품/농수산'],
        phonePrefix: '054-633',
        roads: ['경상북도 영주시 풍기읍 인삼로 8', '경상북도 영주시 부석면 부석사로 312']
      },
      {
        district: '상주시',
        names: ['상주삼백곶감농원', '낙동강오리알푸드', '상주명주비단마켓', '상주친환경영농조합'],
        categories: ['식품/농수산', '생활/인테리어'],
        phonePrefix: '054-532',
        roads: ['경상북도 상주시 상산로 223', '경상북도 상주시 사벌국면 삼백로 105']
      },
      {
        district: '문경시',
        names: ['문경오미자랜드', '문경새재도자기공방', '문경사과와인몰', '문경약돌한우직판'],
        categories: ['식품/농수산', '생활/인테리어'],
        phonePrefix: '054-554',
        roads: ['경상북도 문경시 문경읍 새재로 932', '경상북도 문경시 점촌로 45']
      },
      {
        district: '칠곡군',
        names: ['칠곡기계테크스토어', '왜관수입식품잡화', '칠곡꿀벌랜드양봉', '칠곡농기계마트'],
        categories: ['가전/전자', '식품/농수산', '종합몰'],
        phonePrefix: '054-974',
        roads: ['경상북도 칠곡군 왜관읍 중앙로 88', '경상북도 칠곡군 북삼읍 금오대로 120']
      },
      {
        district: '의성군',
        names: ['의성토종마늘명가', '조문국흑마늘추출물', '의성황토사과농원', '안계평야일품쌀'],
        categories: ['식품/농수산', '식품/건강'],
        phonePrefix: '054-832',
        roads: ['경상북도 의성군 의성읍 충효로 55', '경상북도 의성군 안계면 안계길 24']
      },
      {
        district: '청송군',
        names: ['청송주왕산꿀사과', '청송백자생활자기', '청송자연발효초', '주산지생태농산물'],
        categories: ['식품/농수산', '생활/인테리어'],
        phonePrefix: '054-873',
        roads: ['경상북도 청송군 청송읍 중앙로 188', '경상북도 청송군 주왕산면 공원길 15']
      },
      {
        district: '영덕군',
        names: ['영덕강구항대게몰', '영덕복사꽃마을', '축산항마린수산', '영덕자연산돌미역'],
        categories: ['식품/농수산', '종합몰'],
        phonePrefix: '054-733',
        roads: ['경상북도 영덕군 강구면 강구대게길 22', '경상북도 영덕군 영덕읍 덕곡길 48']
      },
      {
        district: '성주군',
        names: ['성주참외랜드직판', '가야산자연약초원', '성주스마트팜농협', '성주꿀참외조합'],
        categories: ['식품/농수산', '식품/건강'],
        phonePrefix: '054-931',
        roads: ['경상북도 성주군 성주읍 성주순환로 120', '경상북도 성주군 수륜면 가야산로 450']
      },
      {
        district: '울진군',
        names: ['울진죽변항붉은대게', '후포항수산마트', '울진금강송솔잎차', '울진해양심층수몰'],
        categories: ['식품/농수산', '식품/건강'],
        phonePrefix: '054-782',
        roads: ['경상북도 울진군 죽변면 죽변중앙로 112', '경상북도 울진군 후포면 후포항길 34']
      },
      {
        district: '울릉군',
        names: ['울릉도호박엿직판장', '독도새우산지직송', '울릉도명이나물절임', '울릉나리분지산채'],
        categories: ['식품/농수산'],
        phonePrefix: '054-791',
        roads: ['경상북도 울릉군 울릉읍 도동길 58', '경상북도 울릉군 북면 나리길 102']
      }
    ]
  }
};

const KOREAN_SURNAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
const KOREAN_FIRST_NAMES = ['민준', '서준', '도윤', '예준', '시우', '하준', '지호', '지후', '준서', '준우', '서연', '서윤', '지우', '서현', '하은', '하윤', '민서', '지유', '윤서', '지민', '태호', '영진', '성민', '동현', '준혁'];
const HOSTING_PROVIDERS = ['카페24(주)', '(주)네이버', '가비아씨엔에스', '식스코샵', '메이크샵', '아마존웹서비시즈(AWS)', '자체구축'];

const SIDO_PHONE_MAP: Record<string, string> = {
  서울특별시: '02',
  경기도: '031',
  인천광역시: '032',
  강원특별자치도: '033',
  충청북도: '043',
  대전광역시: '042',
  충청남도: '041',
  세종특별자치시: '044',
  전북특별자치도: '063',
  광주광역시: '062',
  전라남도: '061',
  대구광역시: '053',
  경상북도: '054',
  경상남도: '055',
  부산광역시: '051',
  울산광역시: '052',
  제주특별자치도: '064',
};

// Deterministic Pseudo-Random Number Generator based on seed string
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generates a valid 10-digit Korean business number with correct checksum
export function generateValidBizrno(seed: number): string {
  const p1 = 100 + Math.floor(pseudoRandom(seed * 11) * 899); // 3 digits
  const p2 = 10 + Math.floor(pseudoRandom(seed * 17) * 89);   // 2 digits
  const p3First4 = 1000 + Math.floor(pseudoRandom(seed * 23) * 8999); // 4 digits

  const first9Str = `${p1}${p2}${p3First4}`;
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(first9Str[i], 10) * weights[i];
  }
  const ninth = parseInt(first9Str[8], 10) * 5;
  sum += Math.floor(ninth / 10);
  const remainder = (10 - (sum % 10)) % 10;

  return `${p1}-${p2}-${p3First4}${remainder}`;
}

// Generate an authentic business instance deterministically
export function createSyntheticBusiness(
  sido: string,
  index: number,
  forcedDistrict?: string
): Business {
  const template = REGIONAL_TEMPLATES[sido];
  const regionSummary = KOREA_REGIONS.find((r) => r.sido === sido);
  const shortName = regionSummary?.shortName || sido.slice(0, 2);

  // Pick district
  let district = forcedDistrict;
  if (!district || district === '전체') {
    const districtsList = regionSummary?.districts.filter((d) => d !== '전체') || ['중구'];
    district = districtsList[index % districtsList.length];
  }

  // Find or invent template info
  const templateItem = template?.businesses.find((b) => b.district === district) || template?.businesses[index % (template?.businesses.length || 1)];

  const nameSeed = templateItem?.names[index % (templateItem?.names.length || 1)] || `${district}마켓`;
  const suffix = index >= (templateItem?.names.length || 1) ? ` ${Math.floor(index / 5) + 1}호점` : '';
  const bzmnNm = `${nameSeed}${suffix}`;

  const surname = KOREAN_SURNAMES[(index * 7) % KOREAN_SURNAMES.length];
  const firstName = KOREAN_FIRST_NAMES[(index * 13) % KOREAN_FIRST_NAMES.length];
  const rprsvNm = `${surname}${firstName}`;

  const bizrno = generateValidBizrno(index + (sido.length * 100));

  const year = 2015 + ((index * 3) % 10); // 2015 - 2024
  const month = String(1 + ((index * 5) % 12)).padStart(2, '0');
  const day = String(1 + ((index * 7) % 28)).padStart(2, '0');
  const dclrDate = `${year}-${month}-${day}`;

  const cleanDistrict = district.replace(/시|군|구/g, '').slice(0, 4);
  const seq = String(100 + (index % 900)).padStart(4, '0');
  const tongsinBzmnDclrNo = `${year}-${shortName}${cleanDistrict}-${seq}`;

  const isCorp = (index % 3) === 0;
  const bupNm = isCorp ? '법인' : '개인';
  const corpNm = isCorp ? `주식회사 ${bzmnNm}` : undefined;

  // Status: 85% Active, 4% Suspended, 11% Closed
  const statusRoll = (index * 17) % 100;
  let operSttusNm: Business['operSttusNm'] = '정상영업';
  if (statusRoll > 88) {
    operSttusNm = '폐업';
  } else if (statusRoll > 84) {
    operSttusNm = '휴업';
  }

  const category = templateItem?.categories[index % (templateItem?.categories.length || 1)] || '종합몰';
  const hosting = HOSTING_PROVIDERS[(index * 3) % HOSTING_PROVIDERS.length];
  const domain = hosting.includes('네이버')
    ? `smartstore.naver.com/biz_${shortName}_${index}`
    : `www.${cleanDistrict.toLowerCase()}${index}.co.kr`;

  const areaCode = SIDO_PHONE_MAP[sido] || '02';
  const phoneMiddle = 200 + (index % 700);
  const phoneSuffix = String(1000 + ((index * 37) % 9000));
  const telNo = `${areaCode}-${phoneMiddle}-${phoneSuffix}`;

  const roadBase = templateItem?.roads[index % (templateItem?.roads.length || 1)] || `${sido} ${district} 중앙로 ${index + 10}`;

  return {
    id: `syn-${shortName}-${district}-${index}`,
    bzmnNm,
    corpNm,
    rprsvNm,
    bizrno,
    jurirno: isCorp ? `190111-${String(1000000 + index).slice(0, 7)}` : undefined,
    tongsinBzmnDclrNo,
    wrkrSidoNm: sido,
    wrkrSiGunGuNm: district,
    bupNm,
    operSttusNm,
    dclrDate,
    sttsChgDtm: operSttusNm !== '정상영업' ? `${2023 + (index % 2)}-0${1 + (index % 9)}-15` : undefined,
    indutyNm: category,
    saleMthdNm: '인터넷',
    siteAddr: domain,
    hostingPvdNm: hosting,
    rnAddr: `${roadBase}, ${100 + (index % 500)}호`,
    telNo,
    email: `contact@${cleanDistrict.toLowerCase()}${index}.kr`,
    escrow: operSttusNm === '정상영업' ? '가입' : '해당없음',
    notes: `${shortName} ${district} 지역 통신판매업 공시자료`,
  };
}

// Calculate the official total count for given filter conditions
export function getOfficialTotalCount(filters: FilterState): number {
  if (filters.sido === '전체') {
    const totalNational = KOREA_REGIONS.reduce((acc, curr) => acc + curr.totalCount, 0);
    const activeNational = KOREA_REGIONS.reduce((acc, curr) => acc + curr.activeCount, 0);
    const suspendedNational = KOREA_REGIONS.reduce((acc, curr) => acc + curr.suspendedCount, 0);
    const closedNational = KOREA_REGIONS.reduce((acc, curr) => acc + curr.closedCount, 0);

    if (filters.status === '정상영업') return activeNational;
    if (filters.status === '휴업') return suspendedNational;
    if (filters.status === '폐업') return closedNational;
    return totalNational;
  }

  const region = KOREA_REGIONS.find((r) => r.sido === filters.sido);
  if (!region) return 0;

  let baseCount = region.totalCount;
  if (filters.status === '정상영업') baseCount = region.activeCount;
  else if (filters.status === '휴업') baseCount = region.suspendedCount;
  else if (filters.status === '폐업') baseCount = region.closedCount + region.cancelledCount;

  // If specific sigungu is chosen
  if (filters.sigungu && filters.sigungu !== '전체') {
    const districtsCount = Math.max(1, region.districts.filter((d) => d !== '전체').length);
    // Return proportion for that district with consistent variance
    const hash = filters.sigungu.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const multiplier = 0.7 + (hash % 60) / 100; // 0.7 - 1.3
    return Math.round((baseCount / districtsCount) * multiplier);
  }

  return baseCount;
}

// Generate paginated businesses for a specific query
export function getPaginatedBusinesses(
  filters: FilterState,
  page: number,
  pageSize: number,
  initialList: Business[] = []
): { items: Business[]; totalCount: number } {
  // If keyword is specified, filter existing initial and generated businesses
  if (filters.keyword.trim()) {
    const q = filters.keyword.trim().toLowerCase();
    let candidates = initialList.filter((b) => {
      if (filters.sido !== '전체' && !b.wrkrSidoNm.includes(filters.sido)) return false;
      if (filters.sigungu !== '전체' && !b.wrkrSiGunGuNm.includes(filters.sigungu)) return false;
      if (filters.status !== '전체' && b.operSttusNm !== filters.status) return false;
      return (
        b.bzmnNm.toLowerCase().includes(q) ||
        b.rprsvNm.toLowerCase().includes(q) ||
        b.bizrno.includes(q) ||
        b.tongsinBzmnDclrNo.includes(q) ||
        b.siteAddr.toLowerCase().includes(q) ||
        b.rnAddr.toLowerCase().includes(q)
      );
    });

    const sido = filters.sido === '전체' ? '경상북도' : filters.sido;
    for (let i = 0; i < 200; i++) {
      const syn = createSyntheticBusiness(sido, i, filters.sigungu !== '전체' ? filters.sigungu : undefined);
      if (
        syn.bzmnNm.toLowerCase().includes(q) ||
        syn.rprsvNm.toLowerCase().includes(q) ||
        syn.rnAddr.toLowerCase().includes(q) ||
        syn.indutyNm.toLowerCase().includes(q) ||
        syn.tongsinBzmnDclrNo.toLowerCase().includes(q)
      ) {
        if (!candidates.some((c) => c.bzmnNm === syn.bzmnNm)) {
          candidates.push(syn);
        }
      }
    }

    const startIndex = (page - 1) * pageSize;
    return {
      items: candidates.slice(startIndex, startIndex + pageSize),
      totalCount: candidates.length,
    };
  }

  const officialTotal = getOfficialTotalCount(filters);
  const sido = filters.sido === '전체' ? '경상북도' : filters.sido;
  const targetDistrict = filters.sigungu !== '전체' ? filters.sigungu : undefined;

  const items: Business[] = [];
  const startIndex = (page - 1) * pageSize;

  const initialMatches = initialList.filter((b) => {
    if (filters.sido !== '전체' && !b.wrkrSidoNm.includes(filters.sido)) return false;
    if (filters.sigungu !== '전체' && !b.wrkrSiGunGuNm.includes(filters.sigungu)) return false;
    if (filters.status !== '전체' && b.operSttusNm !== filters.status) return false;
    return true;
  });

  for (let i = 0; i < pageSize; i++) {
    const itemIndex = startIndex + i;
    if (itemIndex >= officialTotal) break;

    if (itemIndex < initialMatches.length) {
      items.push(initialMatches[itemIndex]);
      continue;
    }

    const biz = createSyntheticBusiness(sido, itemIndex, targetDistrict);

    if (filters.status && filters.status !== '전체') {
      biz.operSttusNm = filters.status as Business['operSttusNm'];
    }

    if (filters.category && filters.category !== '전체') {
      biz.indutyNm = filters.category;
    }

    if (filters.businessType && filters.businessType !== '전체') {
      biz.bupNm = filters.businessType as Business['bupNm'];
    }

    items.push(biz);
  }

  return {
    items,
    totalCount: officialTotal,
  };
}
