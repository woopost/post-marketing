import { RegionSummary } from '../types/ftc';

export const KOREA_REGIONS: RegionSummary[] = [
  {
    sido: '서울특별시',
    shortName: '서울',
    totalCount: 384520,
    activeCount: 326840,
    suspendedCount: 14200,
    closedCount: 41280,
    cancelledCount: 2200,
    activeRate: 85.0,
    districts: [
      '전체', '강남구', '서초구', '송파구', '강동구', '마포구', '용산구', '영등포구',
      '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구', '도봉구', '노원구',
      '은평구', '서대문구', '종로구', '중구', '양천구', '강서구', '구로구', '금천구', '동작구', '관악구'
    ]
  },
  {
    sido: '경기도',
    shortName: '경기',
    totalCount: 342110,
    activeCount: 294200,
    suspendedCount: 12500,
    closedCount: 33400,
    cancelledCount: 2010,
    activeRate: 86.0,
    districts: [
      '전체', '수원시', '성남시 분당구', '성남시 수정구', '성남시 중원구', '고양시 일산동구', '고양시 일산서구', '고양시 덕양구',
      '용인시 수지구', '용인시 기흥구', '용인시 처인구', '부천시', '안산시', '안양시 동안구', '안양시 만안구',
      '남양주시', '화성시', '평택시', '의정부시', '시흥시', '파주시', '김포시', '광명시', '광주시', '군포시',
      '이천시', '오산시', '하남시', '양주시', '구리시', '안성시', '포천시', '의왕시', '여주시', '양평군', '동두천시', '가평군', '연천군'
    ]
  },
  {
    sido: '부산광역시',
    shortName: '부산',
    totalCount: 88420,
    activeCount: 74200,
    suspendedCount: 3400,
    closedCount: 10200,
    cancelledCount: 620,
    activeRate: 83.9,
    districts: [
      '전체', '해운대구', '부산진구', '남구', '동래구', '수영구', '사상구', '북구',
      '금정구', '사하구', '연제구', '강서구', '기장군', '영도구', '중구', '서구', '동구'
    ]
  },
  {
    sido: '인천광역시',
    shortName: '인천',
    totalCount: 79650,
    activeCount: 67300,
    suspendedCount: 3100,
    closedCount: 8800,
    cancelledCount: 450,
    activeRate: 84.5,
    districts: [
      '전체', '연수구(송도)', '남동구', '부평구', '서구(청라/검단)', '미추홀구', '계양구', '중구(영종)', '동구', '강화군', '옹진군'
    ]
  },
  {
    sido: '대구광역시',
    shortName: '대구',
    totalCount: 56340,
    activeCount: 46800,
    suspendedCount: 2200,
    closedCount: 7000,
    cancelledCount: 340,
    activeRate: 83.1,
    districts: [
      '전체', '수성구', '달서구', '중구', '동구', '서구', '남구', '북구', '달성군', '군위군'
    ]
  },
  {
    sido: '대전광역시',
    shortName: '대전',
    totalCount: 42100,
    activeCount: 35800,
    suspendedCount: 1600,
    closedCount: 4450,
    cancelledCount: 250,
    activeRate: 85.0,
    districts: [
      '전체', '유성구', '서구', '중구', '동구', '대덕구'
    ]
  },
  {
    sido: '광주광역시',
    shortName: '광주',
    totalCount: 37800,
    activeCount: 31900,
    suspendedCount: 1450,
    closedCount: 4230,
    cancelledCount: 220,
    activeRate: 84.4,
    districts: [
      '전체', '서구', '북구', '광산구', '동구', '남구'
    ]
  },
  {
    sido: '울산광역시',
    shortName: '울산',
    totalCount: 24900,
    activeCount: 20900,
    suspendedCount: 950,
    closedCount: 2900,
    cancelledCount: 150,
    activeRate: 83.9,
    districts: [
      '전체', '남구', '중구', '북구', '동구', '울주군'
    ]
  },
  {
    sido: '세종특별자치시',
    shortName: '세종',
    totalCount: 12400,
    activeCount: 10980,
    suspendedCount: 380,
    closedCount: 980,
    cancelledCount: 60,
    activeRate: 88.5,
    districts: ['전체', '세종시(조치원/보람동/어진동/나성동)']
  },
  {
    sido: '강원특별자치도',
    shortName: '강원',
    totalCount: 31500,
    activeCount: 26200,
    suspendedCount: 1200,
    closedCount: 3910,
    cancelledCount: 190,
    activeRate: 83.2,
    districts: [
      '전체', '춘천시', '원주시', '강릉시', '속초시', '동해시', '태백시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'
    ]
  },
  {
    sido: '충청북도',
    shortName: '충북',
    totalCount: 33200,
    activeCount: 27900,
    suspendedCount: 1300,
    closedCount: 3810,
    cancelledCount: 190,
    activeRate: 84.0,
    districts: [
      '전체', '청주시 흥덕구', '청주시 상당구', '청주시 서원구', '청주시 청원구', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'
    ]
  },
  {
    sido: '충청남도',
    shortName: '충남',
    totalCount: 46700,
    activeCount: 39400,
    suspendedCount: 1800,
    closedCount: 5240,
    cancelledCount: 260,
    activeRate: 84.4,
    districts: [
      '전체', '천안시 서북구', '천안시 동남구', '아산시', '서산시', '당진시', '공주시', '보령시', '논산시', '계룡시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'
    ]
  },
  {
    sido: '전북특별자치도',
    shortName: '전북',
    totalCount: 35600,
    activeCount: 29800,
    suspendedCount: 1400,
    closedCount: 4210,
    cancelledCount: 190,
    activeRate: 83.7,
    districts: [
      '전체', '전주시 완산구', '전주시 덕진구', '익산시', '군산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'
    ]
  },
  {
    sido: '전라남도',
    shortName: '전남',
    totalCount: 36800,
    activeCount: 30700,
    suspendedCount: 1500,
    closedCount: 4400,
    cancelledCount: 200,
    activeRate: 83.4,
    districts: [
      '전체', '순천시', '여수시', '목포시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'
    ]
  },
  {
    sido: '경상북도',
    shortName: '경북',
    totalCount: 51200,
    activeCount: 42600,
    suspendedCount: 2100,
    closedCount: 6220,
    cancelledCount: 280,
    activeRate: 83.2,
    districts: [
      '전체', '포항시 남구', '포항시 북구', '구미시', '경산시', '경주시', '안동시', '김천시', '영주시', '영천시', '상주시', '문경시', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'
    ]
  },
  {
    sido: '경상남도',
    shortName: '경남',
    totalCount: 66900,
    activeCount: 55800,
    suspendedCount: 2700,
    closedCount: 8050,
    cancelledCount: 350,
    activeRate: 83.4,
    districts: [
      '전체', '창원시 의창구', '창원시 성산구', '창원시 마산합포구', '창원시 마산회원구', '창원시 진해구', '김해시', '진주시', '양산시', '거제시', '통영시', '사천시', '밀양시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군'
    ]
  },
  {
    sido: '제주특별자치도',
    shortName: '제주',
    totalCount: 19800,
    activeCount: 16900,
    suspendedCount: 780,
    closedCount: 2010,
    cancelledCount: 110,
    activeRate: 85.4,
    districts: ['전체', '제주시', '서귀포시']
  }
];

export const TOTAL_NATIONAL_COUNT = KOREA_REGIONS.reduce((acc, curr) => acc + curr.totalCount, 0);
export const TOTAL_NATIONAL_ACTIVE = KOREA_REGIONS.reduce((acc, curr) => acc + curr.activeCount, 0);
export const TOTAL_NATIONAL_SUSPENDED = KOREA_REGIONS.reduce((acc, curr) => acc + curr.suspendedCount, 0);
export const TOTAL_NATIONAL_CLOSED = KOREA_REGIONS.reduce((acc, curr) => acc + curr.closedCount, 0);
