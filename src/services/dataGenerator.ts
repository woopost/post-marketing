import { Business, FilterState } from '../types/ftc';
import { KOREA_REGIONS } from '../data/regions';
import { isAddressSimilar, calculateAddressSimilarityScore } from './ftcApi';
import {
  ALL_DG_GB_DISTRICTS,
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
} from '../data/daeguGyeongbuk';

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
  서울특별시: {
    sido: '서울특별시',
    shortName: '서울',
    districts: [
      '강남구', '서초구', '송파구', '마포구', '성동구', '영등포구', '용산구', '중구', '종로구', '강동구'
    ],
    businesses: [
      {
        district: '강남구',
        names: ['테헤란소프트웨어', '강남디지털랩', '역삼스타트업몰', '테헤란밸리상사', '도산대로뷰티', '언주스마트커머스'],
        categories: ['가전/전자', '종합몰', '화장품/뷰티'],
        phonePrefix: '02-555',
        roads: [
          '서울특별시 강남구 테헤란로 134, 포스코타워 역삼',
          '서울특별시 강남구 테헤란로 427, 위워크타워 8층',
          '서울특별시 강남구 테헤란로 501, 브이플렉스 12층',
          '서울특별시 강남구 강남대로 382, 메리츠타워',
          '서울특별시 강남구 도산대로 156, 강남빌딩'
        ]
      },
      {
        district: '송파구',
        names: ['송파물류센터', '잠실스마트스토어', '송파대로이커머스', '올림픽공원기프트', '문정비즈니스존'],
        categories: ['종합몰', '식품/건강', '패션/의류'],
        phonePrefix: '02-412',
        roads: [
          '서울특별시 송파구 송파대로 570, 타워730',
          '서울특별시 송파구 송파대로 201, 테라타워 4층',
          '서울특별시 송파구 위례성대로 2, 장은빌딩',
          '서울특별시 송파구 올림픽로 300, 롯데월드타워'
        ]
      },
      {
        district: '마포구',
        names: ['홍대디자인스튜디오', '마포출판미디어', '독막로인테리어', '서교동패션하우스', '상암디지털미디어'],
        categories: ['생활/인테리어', '도서/음반', '패션/의류'],
        phonePrefix: '02-332',
        roads: [
          '서울특별시 마포구 독막로7길 40',
          '서울특별시 마포구 양화로 160, 홍대입구타워',
          '서울특별시 마포구 마포대로 130, 마포비즈니스센터',
          '서울특별시 마포구 와우산로 29'
        ]
      },
      {
        district: '성동구',
        names: ['성수아차산크래프트', '성수동패션랩', '성수일로스튜디오', '서울숲라이프스타일'],
        categories: ['패션/의류', '생활/인테리어', '종합몰'],
        phonePrefix: '02-466',
        roads: [
          '서울특별시 성동구 아차산로 13길 11, 무신사캠퍼스 N1',
          '서울특별시 성동구 성수일로 89, 메타타워',
          '서울특별시 성동구 왕십리로 115, 헤이그라운드'
        ]
      },
      {
        district: '서초구',
        names: ['서초법조타운기프트', '양재디지털푸드', '반포홈데코', '강남대로이앤씨'],
        categories: ['종합몰', '생활/인테리어', '화장품/뷰티'],
        phonePrefix: '02-581',
        roads: [
          '서울특별시 서초구 강남대로 381, 두산베어스타워',
          '서울특별시 서초구 서초대로 397, 부띠크모나코',
          '서울특별시 서초구 반포대로 222'
        ]
      }
    ]
  },
  경기도: {
    sido: '경기도',
    shortName: '경기',
    districts: [
      '성남시 분당구', '수원시', '고양시 일산동구', '용인시 수지구', '안양시 동안구', '부천시', '화성시'
    ],
    businesses: [
      {
        district: '성남시 분당구',
        names: ['판교테크밸리상사', '정자일로스마트스토어', '분당디지털기어', '알파돔커머스', '판교글로벌솔루션'],
        categories: ['가전/전자', '종합몰', '패션/의류'],
        phonePrefix: '031-711',
        roads: [
          '경기도 성남시 분당구 정자일로 95, NAVER 1784',
          '경기도 성남시 분당구 판교역로 152, 알파돔타워',
          '경기도 성남시 분당구 판교역로 235, 에이치스퀘어',
          '경기도 성남시 분당구 대왕판교로 645번길 12'
        ]
      },
      {
        district: '수원시',
        names: ['수원광교바이오몰', '영통디지털상사', '수원효원로식품', '수원역스마트마켓'],
        categories: ['식품/건강', '가전/전자', '종합몰'],
        phonePrefix: '031-259',
        roads: [
          '경기도 수원시 영통구 광교로 107, 경기도경제과학진흥원',
          '경기도 수원시 팔달구 효원로 295',
          '경기도 수원시 영통구 덕영대로 1556'
        ]
      },
      {
        district: '고양시 일산동구',
        names: ['일산킨텍스글로벌', '일산중앙로리빙', '웨스턴돔패션', '고양킨텍스레저'],
        categories: ['생활/인테리어', '패션/의류', '레저/스포츠'],
        phonePrefix: '031-905',
        roads: [
          '경기도 고양시 일산동구 중앙로 1261번길 55',
          '경기도 고양시 일산서구 킨텍스로 217-60',
          '경기도 고양시 일산동구 백마로 195'
        ]
      }
    ]
  },
  부산광역시: {
    sido: '부산광역시',
    shortName: '부산',
    districts: ['해운대구', '부산진구', '남구', '중구', '수영구'],
    businesses: [
      {
        district: '해운대구',
        names: ['센텀중앙로해양스토어', '해운대마린바이오', '센텀시티디지털몰', '해운대해변로뷰티'],
        categories: ['화장품/뷰티', '식품/농수산', '종합몰'],
        phonePrefix: '051-744',
        roads: [
          '부산광역시 해운대구 센텀중앙로 48, 에이스하이테크21',
          '부산광역시 해운대구 센텀서로 30, KNN타워',
          '부산광역시 해운대구 해운대해변로 298번길 24'
        ]
      },
      {
        district: '부산진구',
        names: ['서면로패션스퀘어', '부산진구중앙대로몰', '전포카페거리기프트'],
        categories: ['패션/의류', '생활/인테리어'],
        phonePrefix: '051-807',
        roads: [
          '부산광역시 부산진구 중앙대로 686',
          '부산광역시 부산진구 서면로 68',
          '부산광역시 부산진구 전포대로 209'
        ]
      },
      {
        district: '중구',
        names: ['자갈치해안로건어물', '남포동수산직판', '중구자갈치시장몰'],
        categories: ['식품/농수산'],
        phonePrefix: '051-246',
        roads: [
          '부산광역시 중구 자갈치해안로 52, 1층',
          '부산광역시 중구 남포길 22',
          '부산광역시 중구 대청로 112'
        ]
      }
    ]
  },
  대구광역시: {
    sido: '대구광역시',
    shortName: '대구',
    districts: [
      '달서구', '수성구', '북구', '중구', '동구', '서구', '남구', '달성군', '군위군'
    ],
    businesses: [
      {
        district: '수성구',
        names: ['대구수성스마트에듀', '범어에비뉴커머스', '수성못라이프스타일', '알파시티소프트', '수성디지털기프트'],
        categories: ['도서/음반', '종합몰', '가전/전자'],
        phonePrefix: '053-741',
        roads: [
          '대구광역시 수성구 달구벌대로 2435, 두산위브 상가 3층',
          '대구광역시 수성구 동대구로 386, 킹덤오피스텔',
          '대구광역시 수성구 알파시티1로 160, SW융합센터'
        ]
      },
      {
        district: '달서구',
        names: ['성서산단자동화기어', '달서월배리빙마켓', '두류파크스포츠', '대구달서종합물류', '성서디지털기기'],
        categories: ['가전/전자', '생활/인테리어', '종합몰'],
        phonePrefix: '053-581',
        roads: [
          '대구광역시 달서구 달구벌대로 1530',
          '대구광역시 달서구 성서공단로 217',
          '대구광역시 달서구 와룡로 123'
        ]
      },
      {
        district: '중구',
        names: ['동성로패션거리몰', '반월당스마트스토어', '대구근대골목공예방', '동성로뷰티스토리'],
        categories: ['패션/의류', '화장품/뷰티', '생활/인테리어'],
        phonePrefix: '053-425',
        roads: [
          '대구광역시 중구 동성로2길 45, 2층',
          '대구광역시 중구 달구벌대로 2077, 반월당역 지하상가',
          '대구광역시 중구 중앙대로 394'
        ]
      },
      {
        district: '북구',
        names: ['대구엑스코전시몰', '산격종합유통단지스토어', '경북대창업혁신랩', '칠곡중앙로커머스'],
        categories: ['가전/전자', '종합몰', '생활/인테리어'],
        phonePrefix: '053-382',
        roads: [
          '대구광역시 북구 엑스코로 10, EXCO 서관',
          '대구광역시 북구 유통단지로 14길 28',
          '대구광역시 북구 대학로 80, IT융합관'
        ]
      },
      {
        district: '동구',
        names: ['동대구벤처밸리몰', '대구혁신도시스마트상사', '팔공산전통식품명가', '대구공항물류'],
        categories: ['식품/농수산', '가전/전자', '종합몰'],
        phonePrefix: '053-752',
        roads: [
          '대구광역시 동구 동대구로 465, 대구스케일업허브',
          '대구광역시 동구 신서로 67, 혁신도시센터',
          '대구광역시 동구 팔공산로 1120'
        ]
      },
      {
        district: '서구',
        names: ['서대구산단부품몰', '대구비산염색패션', '서대구역스마트물류'],
        categories: ['패션/의류', '가전/전자'],
        phonePrefix: '053-563',
        roads: [
          '대구광역시 서구 국채보상로 150',
          '대구광역시 서구 와룡로 315'
        ]
      },
      {
        district: '남구',
        names: ['앞산카페거리굿즈', '대구대명디지털미디어', '남구봉덕라이프'],
        categories: ['생활/인테리어', '종합몰'],
        phonePrefix: '053-471',
        roads: [
          '대구광역시 남구 앞산순환로 415',
          '대구광역시 남구 중앙대로 180'
        ]
      },
      {
        district: '달성군',
        names: ['대구테크노폴리스상사', '달성다사스마트스토어', '현풍백년도깨비특산품'],
        categories: ['가전/전자', '식품/농수산'],
        phonePrefix: '053-614',
        roads: [
          '대구광역시 달성군 유가읍 테크노중앙대로 333',
          '대구광역시 달성군 다사읍 대실역남로 18'
        ]
      },
      {
        district: '군위군',
        names: ['군위화본마을특산품', '군위삼국유사농원', '군위이로운한우마켓'],
        categories: ['식품/농수산'],
        phonePrefix: '054-383',
        roads: [
          '대구광역시 군위군 군위읍 중앙길 65',
          '대구광역시 군위군 산성면 산성가음로 722'
        ]
      }
    ]
  },
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
        roads: [
          '경상북도 포항시 남구 구룡포읍 호미로 212',
          '경상북도 포항시 남구 대이로 41',
          '경상북도 포항시 남구 오천읍 원리로 33'
        ]
      },
      {
        district: '포항시 북구',
        names: ['죽도시장건어물명가', '영일대해상레저기어', '포항북구산지직송', '환호공원아트샵'],
        categories: ['식품/농수산', '레저/스포츠', '생활/인테리어'],
        phonePrefix: '054-245',
        roads: [
          '경상북도 포항시 북구 죽도시장길 35',
          '경상북도 포항시 북구 해안로 199',
          '경상북도 포항시 북구 중앙로 288'
        ]
      },
      {
        district: '구미시',
        names: ['구미스마트테크존', '금오산유기농마켓', '구미모바일부품몰', '인동패션아울렛', '구미산업자동화기어', '구미디지털솔루션'],
        categories: ['가전/전자', '패션/의류', '식품/농수산', '종합몰'],
        phonePrefix: '054-461',
        roads: [
          '경상북도 구미시 1공단로 198, IT센터',
          '경상북도 구미시 인동가산로 14',
          '경상북도 구미시 송정대로 55'
        ]
      },
      {
        district: '안동시',
        names: ['안동하회한우명가', '안동간고등어전통몰', '안동참마영농조합', '하회탈수공예방', '안동소주전통주샵', '도산서원유학책방'],
        categories: ['식품/농수산', '생활/인테리어', '도서/음반'],
        phonePrefix: '054-853',
        roads: [
          '경상북도 안동시 풍천면 검무로 14',
          '경상북도 안동시 제비원로 120',
          '경상북도 안동시 하회종가길 45'
        ]
      },
      {
        district: '경주시',
        names: ['경주황남제과베이커리', '신라명과경주빵', '첨성대문화기프트', '보문단지리조트마켓', '불국사도예공방', '경주월드레저샵'],
        categories: ['식품/농수산', '생활/인테리어', '레저/스포츠'],
        phonePrefix: '054-772',
        roads: [
          '경상북도 경주시 포석로 1068, 황리단길',
          '경상북도 경주시 보문로 422',
          '경상북도 경주시 불국신택지7길 12'
        ]
      },
      {
        district: '경산시',
        names: ['경산대추한과몰', '영남대창업벤처랩', '하양스마트패션', '경산묘목농원', '진량산업기기'],
        categories: ['식품/농수산', '패션/의류', '가전/전자'],
        phonePrefix: '054-811',
        roads: [
          '경상북도 경산시 대동 대학로 280',
          '경상북도 경산시 하양읍 하양로 135',
          '경상북도 경산시 진량읍 공단로 88'
        ]
      },
      {
        district: '청도군',
        names: [
          '청도반시영농조합',
          '청도와인터널특산품',
          '청도소싸움축산명가',
          '청도복숭아직판장',
          '청도운문사전통식품',
          '청도이서스마트스토어',
          '청도각남친환경농산'
        ],
        categories: ['식품/농수산', '종합몰', '생활/인테리어'],
        phonePrefix: '054-371',
        roads: [
          '경상북도 청도군 청도읍 청화로 70',
          '경상북도 청도군 화양읍 연지길 30, 와인터널',
          '경상북도 청도군 청도읍 중앙로 192',
          '경상북도 청도군 청도읍 청도시장길 32',
          '경상북도 청도군 화양읍 온천길 35',
          '경상북도 청도군 이서면 이서로 88',
          '경상북도 청도군 풍각면 송경로 15'
        ]
      },
      {
        district: '김천시',
        names: ['김천혁신도시스마트몰', '김천포도자두직판', '김천직지사전통다원', '김천혁신로디지털'],
        categories: ['식품/농수산', '가전/전자', '종합몰'],
        phonePrefix: '054-434',
        roads: [
          '경상북도 김천시 혁신3로 15',
          '경상북도 김천시 대항면 직지사길 95',
          '경상북도 김천시 시청로 1'
        ]
      },
      {
        district: '영주시',
        names: ['영주풍기인삼명가', '영주소백산한우몰', '영주선비촌전통공예', '영주사과산지직송'],
        categories: ['식품/농수산', '생활/인테리어'],
        phonePrefix: '054-638',
        roads: [
          '경상북도 영주시 풍기읍 인삼로 8',
          '경상북도 영주시 대학로 77',
          '경상북도 영주시 순흥면 소백로 2740'
        ]
      },
      {
        district: '영천시',
        names: ['영천보현산포도와인', '영천한약재유통스토어', '영천스마트부품', '영천금호농원'],
        categories: ['식품/농수산', '가전/전자'],
        phonePrefix: '054-334',
        roads: [
          '경상북도 영천시 완산로 33',
          '경상북도 영천시 화룡동 영화로 65',
          '경상북도 영천시 금호읍 금호로 12'
        ]
      },
      {
        district: '상주시',
        names: ['상주곶감명가직판', '상주삼백친환경농산', '상주경천대레저', '상주함창명주'],
        categories: ['식품/농수산', '생활/인테리어'],
        phonePrefix: '054-535',
        roads: [
          '경상북도 상주시 삼백로 150',
          '경상북도 상주시 상산로 223',
          '경상북도 상주시 함창읍 함창중앙로 45'
        ]
      },
      {
        district: '문경시',
        names: ['문경오미자밸리몰', '문경새재도자기공방', '문경사과산지직송', '문경온천힐링스토어'],
        categories: ['식품/농수산', '생활/인테리어'],
        phonePrefix: '054-571',
        roads: [
          '경상북도 문경시 문경읍 새재로 932',
          '경상북도 문경시 당교로 225',
          '경상북도 문경시 문경읍 온천강변길 12'
        ]
      },
      {
        district: '칠곡군',
        names: ['칠곡왜관물류이커머스', '칠곡스마트산업부품', '칠곡동명친환경마켓', '칠곡북삼스마트몰'],
        categories: ['종합몰', '가전/전자', '생활/인테리어'],
        phonePrefix: '054-974',
        roads: [
          '경상북도 칠곡군 왜관읍 중앙로 112',
          '경상북도 칠곡군 석적읍 남중리 45',
          '경상북도 칠곡군 북삼읍 인평중앙로 22'
        ]
      },
      {
        district: '의성군',
        names: ['의성토종마늘직판', '의성조문국특산품', '의성사과영농조합', '의성안계친환경쌀'],
        categories: ['식품/농수산'],
        phonePrefix: '054-834',
        roads: [
          '경상북도 의성군 의성읍 충효로 30',
          '경상북도 의성군 금성면 조문로 212',
          '경상북도 의성군 안계면 안계길 55'
        ]
      },
      {
        district: '청송군',
        names: ['청송주왕산사과몰', '청송백자전통공예', '청송달기약수토종식품'],
        categories: ['식품/농수산', '생활/인테리어'],
        phonePrefix: '054-873',
        roads: [
          '경상북도 청송군 청송읍 중앙로 250',
          '경상북도 청송군 주왕산면 주왕산로 492'
        ]
      },
      {
        district: '영덕군',
        names: ['영덕강구항대게몰', '영덕블루로드수산', '영덕해파랑직판장', '영덕축산항자연산회'],
        categories: ['식품/농수산'],
        phonePrefix: '054-733',
        roads: [
          '경상북도 영덕군 강구면 강구대게길 22',
          '경상북도 영덕군 영덕읍 군청길 116',
          '경상북도 영덕군 축산면 축산항길 45'
        ]
      },
      {
        district: '울진군',
        names: ['울진죽변항붉은대게', '울진금강송자연식품', '울진후포항해산물', '울진온천힐링마켓'],
        categories: ['식품/농수산', '화장품/뷰티'],
        phonePrefix: '054-783',
        roads: [
          '경상북도 울진군 죽변면 죽변항길 121',
          '경상북도 울진군 울진읍 읍내로 65',
          '경상북도 울진군 후포면 후포삼칠길 10'
        ]
      },
      {
        district: '울릉군',
        names: ['울릉도오징어호박엿직판', '울릉도명이특산품', '독도새우해양스토어', '울릉나리분지산나물'],
        categories: ['식품/농수산'],
        phonePrefix: '054-791',
        roads: [
          '경상북도 울릉군 울릉읍 도동길 58',
          '경상북도 울릉군 울릉읍 울릉순환로 180',
          '경상북도 울릉군 북면 나리길 20'
        ]
      },
      {
        district: '예천군',
        names: ['예천용궁순대참기름몰', '예천회룡포농산물', '예천경북도청신도시디지털', '예천곤충엑스포기프트'],
        categories: ['식품/농수산', '생활/인테리어', '종합몰'],
        phonePrefix: '054-654',
        roads: [
          '경상북도 예천군 호명면 도청대로 100',
          '경상북도 예천군 용궁면 용궁시장길 10',
          '경상북도 예천군 예천읍 시장로 44'
        ]
      },
      {
        district: '봉화군',
        names: ['봉화송이버섯명가', '봉화청량산사과몰', '봉화약초친환경영농', '봉화분천산타마을굿즈'],
        categories: ['식품/농수산', '생활/인테리어'],
        phonePrefix: '054-673',
        roads: [
          '경상북도 봉화군 봉화읍 봉화로 1111',
          '경상북도 봉화군 춘양면 의양로 28',
          '경상북도 봉화군 소천면 분천길 30'
        ]
      },
      {
        district: '고령군',
        names: ['고령대가야딸기직판', '고령개진감자영농', '고령주산전통식품'],
        categories: ['식품/농수산'],
        phonePrefix: '054-954',
        roads: [
          '경상북도 고령군 대가야읍 대가야로 1212',
          '경상북도 고령군 개진면 개진로 34'
        ]
      },
      {
        district: '성주군',
        names: ['성주참외산지직송몰', '성주가야산친환경농산', '성주성밖숲로컬푸드'],
        categories: ['식품/농수산'],
        phonePrefix: '054-933',
        roads: [
          '경상북도 성주군 성주읍 성주순환로 15',
          '경상북도 성주군 수륜면 참외로 220'
        ]
      },
      {
        district: '영양군',
        names: ['영양빛깔찬고춧가루', '영양일월산산나물', '영양반딧불이특산품'],
        categories: ['식품/농수산'],
        phonePrefix: '054-683',
        roads: [
          '경상북도 영양군 영양읍 중앙로 123',
          '경상북도 영양군 일월면 일월로 456'
        ]
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

  // Find template info strictly for this district
  const templateItem = template?.businesses.find((b) => b.district === district);

  let nameSeed: string;
  let roadBase: string;
  let category: string;
  let phonePrefix: string;

  if (templateItem && templateItem.district === district) {
    nameSeed = templateItem.names[index % templateItem.names.length];
    roadBase = templateItem.roads[index % templateItem.roads.length];
    category = templateItem.categories[index % templateItem.categories.length];
    phonePrefix = templateItem.phonePrefix;
  } else {
    const cleanDist = district.replace(/시|군|구/g, '');
    nameSeed = `${cleanDist}스마트상사`;
    roadBase = `${sido} ${district} 중앙로 ${10 + (index % 120)}`;
    category = '종합몰';
    phonePrefix = SIDO_PHONE_MAP[sido] || '02';
  }

  const suffix = index >= 7 ? ` ${Math.floor(index / 5) + 1}호점` : '';
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

  const hosting = HOSTING_PROVIDERS[(index * 3) % HOSTING_PROVIDERS.length];
  const domain = hosting.includes('네이버')
    ? `smartstore.naver.com/biz_${shortName}_${index}`
    : `www.${cleanDistrict.toLowerCase()}${index}.co.kr`;

  const phoneMiddle = 200 + (index % 700);
  const phoneSuffix = String(1000 + ((index * 37) % 9000));
  const telNo = `${phonePrefix}-${phoneMiddle}-${phoneSuffix}`;

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
  if (filters.sigungu && filters.sigungu !== '전체') {
    const districtStat = ALL_DG_GB_DISTRICTS.find((d) => d.district === filters.sigungu);
    if (districtStat) {
      if (filters.status === '정상영업') return districtStat.activeCount;
      if (filters.status === '휴업') return districtStat.suspendedCount;
      if (filters.status === '폐업') return districtStat.closedCount;
      return districtStat.totalCount;
    }
  }

  if (filters.sido === '대구광역시') {
    if (filters.status === '정상영업') return TOTAL_DAEGU_ACTIVE;
    if (filters.status === '휴업') return TOTAL_DAEGU_SUSPENDED;
    if (filters.status === '폐업') return TOTAL_DAEGU_CLOSED;
    return TOTAL_DAEGU_COUNT;
  }

  if (filters.sido === '경상북도') {
    if (filters.status === '정상영업') return TOTAL_GYEONGBUK_ACTIVE;
    if (filters.status === '휴업') return TOTAL_GYEONGBUK_SUSPENDED;
    if (filters.status === '폐업') return TOTAL_GYEONGBUK_CLOSED;
    return TOTAL_GYEONGBUK_COUNT;
  }

  // 대구·경북 전체
  if (filters.status === '정상영업') return TOTAL_DG_GB_ACTIVE;
  if (filters.status === '휴업') return TOTAL_DG_GB_SUSPENDED;
  if (filters.status === '폐업') return TOTAL_DG_GB_CLOSED;
  return TOTAL_DG_GB_COUNT;
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
    const isAddressType = filters.searchType === 'address';

    let candidates = initialList.filter((b) => {
      if (filters.sido !== '전체' && !b.wrkrSidoNm.includes(filters.sido)) return false;
      if (filters.sigungu !== '전체' && !b.wrkrSiGunGuNm.includes(filters.sigungu)) return false;
      if (filters.status !== '전체' && b.operSttusNm !== filters.status) return false;

      if (isAddressType) {
        return isAddressSimilar(b, q);
      }

      if (filters.searchType === 'bzmnNm') {
        return b.bzmnNm.toLowerCase().includes(q) || (b.corpNm && b.corpNm.toLowerCase().includes(q));
      }
      if (filters.searchType === 'bizrno') {
        return b.bizrno.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''));
      }
      if (filters.searchType === 'rprsvNm') {
        return b.rprsvNm.toLowerCase().includes(q);
      }
      if (filters.searchType === 'tongsinNo') {
        return b.tongsinBzmnDclrNo.toLowerCase().includes(q);
      }
      if (filters.searchType === 'domain') {
        return b.siteAddr.toLowerCase().includes(q);
      }

      // 'all'
      return (
        b.bzmnNm.toLowerCase().includes(q) ||
        b.rprsvNm.toLowerCase().includes(q) ||
        b.bizrno.includes(q) ||
        b.tongsinBzmnDclrNo.includes(q) ||
        b.siteAddr.toLowerCase().includes(q) ||
        isAddressSimilar(b, q)
      );
    });

    // 검색어와 일치하는 시·군·구 추출 (예: '청도' -> 경상북도 청도군)
    const cleanQ = q.replace(/[\s,\(\)\-\.\_]/g, '');
    const matchedDistricts: { sido: string; district: string }[] = [];
    for (const region of KOREA_REGIONS) {
      if (filters.sido !== '전체' && region.sido !== filters.sido) continue;
      for (const dist of region.districts) {
        if (dist === '전체') continue;
        const cleanDist = dist.replace(/(시|군|구)/g, '');
        if (
          cleanDist.length >= 2 &&
          (cleanQ.includes(cleanDist) || dist.includes(q) || cleanDist.includes(cleanQ))
        ) {
          matchedDistricts.push({ sido: region.sido, district: dist });
        }
      }
    }

    // 일치하는 시·군·구가 있으면 해당 지역 데이터 집중 생성
    for (const match of matchedDistricts) {
      for (let i = 0; i < 40; i++) {
        const syn = createSyntheticBusiness(match.sido, i, match.district);
        let matchCondition = false;
        if (isAddressType) {
          matchCondition = isAddressSimilar(syn, q);
        } else {
          matchCondition = true;
        }
        if (matchCondition && !candidates.some((c) => c.id === syn.id || c.bzmnNm === syn.bzmnNm)) {
          candidates.push(syn);
        }
      }
    }

    // Determine target provinces to scan:
    const targetSidos =
      filters.sido !== '전체'
        ? [filters.sido]
        : matchedDistricts.length > 0
          ? Array.from(new Set(matchedDistricts.map((m) => m.sido)))
          : ['대구광역시', '경상북도'];

    for (const sido of targetSidos) {
      for (let i = 0; i < 150; i++) {
        const syn = createSyntheticBusiness(sido, i, filters.sigungu !== '전체' ? filters.sigungu : undefined);
        let match = false;
        if (isAddressType) {
          match = isAddressSimilar(syn, q);
        } else if (filters.searchType === 'bzmnNm') {
          match = syn.bzmnNm.toLowerCase().includes(q) || (syn.corpNm ? syn.corpNm.toLowerCase().includes(q) : false);
        } else if (filters.searchType === 'bizrno') {
          match = syn.bizrno.replace(/[^0-9]/g, '').includes(cleanQ);
        } else if (filters.searchType === 'rprsvNm') {
          match = syn.rprsvNm.toLowerCase().includes(q);
        } else if (filters.searchType === 'tongsinNo') {
          match = syn.tongsinBzmnDclrNo.toLowerCase().includes(q);
        } else {
          match =
            syn.bzmnNm.toLowerCase().includes(q) ||
            (syn.corpNm ? syn.corpNm.toLowerCase().includes(q) : false) ||
            syn.rprsvNm.toLowerCase().includes(q) ||
            syn.bizrno.replace(/[^0-9]/g, '').includes(cleanQ) ||
            syn.tongsinBzmnDclrNo.toLowerCase().includes(q) ||
            syn.siteAddr.toLowerCase().includes(q) ||
            isAddressSimilar(syn, q);
        }

        if (match && !candidates.some((c) => c.bzmnNm === syn.bzmnNm)) {
          candidates.push(syn);
        }
      }
    }

    // 도로명 주소 검색 시 유사도 점수 높은 순으로 최우선 정렬
    if (isAddressType) {
      candidates.sort((a, b) => {
        const scoreA = calculateAddressSimilarityScore(a, q);
        const scoreB = calculateAddressSimilarityScore(b, q);
        return scoreB - scoreA;
      });
    }

    const startIndex = (page - 1) * pageSize;
    return {
      items: candidates.slice(startIndex, startIndex + pageSize),
      totalCount: candidates.length,
    };
  }

  const officialTotal = getOfficialTotalCount(filters);
  const targetDistrict = filters.sigungu !== '전체' ? filters.sigungu : undefined;

  const items: Business[] = [];
  const startIndex = (page - 1) * pageSize;

  const initialMatches = initialList.filter((b) => {
    if (filters.sido !== '전체' && !b.wrkrSidoNm.includes(filters.sido)) return false;
    if (filters.sigungu !== '전체' && !b.wrkrSiGunGuNm.includes(filters.sigungu)) return false;
    if (filters.status !== '전체' && b.operSttusNm !== filters.status) return false;
    if (filters.sido === '전체') {
      return b.wrkrSidoNm.includes('대구') || b.wrkrSidoNm.includes('경북') || b.wrkrSidoNm.includes('경상북도');
    }
    return true;
  });

  for (let i = 0; i < pageSize; i++) {
    const itemIndex = startIndex + i;
    if (itemIndex >= officialTotal) break;

    if (itemIndex < initialMatches.length) {
      items.push(initialMatches[itemIndex]);
      continue;
    }

    const sidoToUse =
      filters.sido !== '전체'
        ? filters.sido
        : itemIndex % 2 === 0
          ? '대구광역시'
          : '경상북도';

    const biz = createSyntheticBusiness(sidoToUse, itemIndex, targetDistrict);

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
