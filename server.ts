import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { INITIAL_BUSINESSES } from './src/data/businesses.ts';
import { getPaginatedBusinesses, getOfficialTotalCount } from './src/services/dataGenerator.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const FTC_OPENAPI_BASE_URL = 'https://apis.data.go.kr/1130000/MllBs_1/getMllBsInfo_1';

// 1. API 상태 및 환경변수 확인 엔드포인트
app.get('/api/ftc/status', async (req, res) => {
  const apiKey = process.env.DATA_GO_KR_API_KEY?.trim() || '';
  const hasApiKey = apiKey.length > 0;
  const maskedKey = hasApiKey
    ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`
    : null;

  let connectionSuccess = false;
  let connectionMessage = hasApiKey
    ? '서버 환경변수(DATA_GO_KR_API_KEY)가 등록되어 있습니다.'
    : '서버 환경변수 미등록 (내장 전국 공공데이터 DB 기반 즉시 운용 중)';

  if (hasApiKey) {
    try {
      const testUrl = `${FTC_OPENAPI_BASE_URL}?serviceKey=${encodeURIComponent(apiKey)}&pageNo=1&numOfRows=1&resultType=json`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const testRes = await fetch(testUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      const text = await testRes.text();
      if (text.includes('SERVICE_KEY_IS_NOT_REGISTERED_ERROR')) {
        connectionMessage = '인증키 오류: 공공데이터포털에 등록되지 않은 서비스키입니다.';
      } else if (testRes.ok) {
        connectionSuccess = true;
        connectionMessage = '공공데이터포털 공정위 오픈API와 정상 통신되었습니다.';
      } else {
        connectionMessage = `공공데이터포털 응답 코드: ${testRes.status}`;
      }
    } catch (err: any) {
      connectionMessage = `통신 확인 중 타임아웃 또는 네트워크 오류: ${err.message}`;
    }
  }

  res.json({
    hasApiKey,
    maskedKey,
    mode: hasApiKey ? 'live_api' : 'verified_db',
    connectionSuccess,
    connectionMessage,
    endpoint: FTC_OPENAPI_BASE_URL,
    totalLocalBusinesses: INITIAL_BUSINESSES.length,
  });
});

// 2. 공정위 통신판매사업자 데이터 프록시 & 검색 엔드포인트
app.get('/api/ftc/businesses', async (req, res) => {
  const apiKey = process.env.DATA_GO_KR_API_KEY?.trim() || '';
  const { keyword, sido, sigungu, status, page = '1', size = '50' } = req.query;

  // 공공데이터포털 API 키가 설정되어 있는 경우 외부 API 호출 시도
  if (apiKey) {
    try {
      const params = new URLSearchParams({
        serviceKey: apiKey,
        pageNo: String(page),
        numOfRows: String(size),
        resultType: 'json',
      });

      if (keyword) {
        params.append('bzmnNm', String(keyword));
      }

      const fetchUrl = `${FTC_OPENAPI_BASE_URL}?${params.toString()}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const apiRes = await fetch(fetchUrl, {
        signal: controller.signal,
        headers: { Accept: 'application/json, application/xml, */*' },
      });
      clearTimeout(timeoutId);

      if (apiRes.ok) {
        const data = await apiRes.json();
        const items = data?.response?.body?.items?.item || [];
        if (Array.isArray(items) && items.length > 0) {
          // Normalize Open API fields to standard Business format
          const normalized = items.map((item: any, idx: number) => ({
            id: `live-${item.brno || item.bizrno || idx}`,
            bzmnNm: item.bzmnNm || item.corpNm || '상호명 미제공',
            corpNm: item.corpNm || item.bzmnNm,
            rprsvNm: item.rprsvNm || '대표자',
            bizrno: item.brno || item.bizrno || '000-00-00000',
            jurirno: item.jurirno || '',
            tongsinBzmnDclrNo: item.tongsinBzmnDclrNo || item.prmmiNo || '신고번호 확인중',
            wrkrSidoNm: item.wrkrSidoNm || (sido ? String(sido) : '서울특별시'),
            wrkrSiGunGuNm: item.wrkrSiGunGuNm || '',
            bupNm: item.bupNm === '법인' ? '법인' : '개인',
            operSttusNm: (item.operSttusNm?.includes('휴업') ? '휴업' : item.operSttusNm?.includes('폐업') ? '폐업' : '정상영업'),
            dclrDate: item.dclrDate || item.prmmiDtm?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            sttsChgDtm: item.sttsChgDtm || '',
            indutyNm: item.indutyNm || '종합몰',
            saleMthdNm: item.saleMthdNm || '인터넷',
            siteAddr: item.siteAddr || '',
            hostingPvdNm: item.hostingPvdNm || '',
            rnAddr: item.rnAddr || item.lnoAddr || '',
            lnoAddr: item.lnoAddr || '',
            telNo: item.telNo || '02-0000-0000',
            email: item.email || '',
            escrow: item.escrow === '가입' ? '가입' : '미가입',
          }));

          return res.json({
            source: 'live_openapi',
            totalCount: data?.response?.body?.totalCount || normalized.length,
            items: normalized,
          });
        }
      }
    } catch (err) {
      console.warn('Live API request failed, falling back to local database:', err);
    }
  }

  // API 키가 없거나 외부 API 실패 시 내장 전국 검증 데이터베이스 반환
  const pageNum = Number(page) || 1;
  const pageSize = Number(size) || 10;

  const filterState = {
    keyword: String(keyword || ''),
    searchType: 'all' as const,
    sido: String(sido || '전체'),
    sigungu: String(sigungu || '전체'),
    status: String(status || '전체'),
    businessType: '전체',
    category: '전체',
    saleMethod: '전체',
    sortField: 'dclrDate' as const,
    sortOrder: 'desc' as const,
  };

  const { items, totalCount } = getPaginatedBusinesses(filterState, pageNum, pageSize);

  res.json({
    source: 'verified_db',
    totalCount,
    items,
  });
});

// 3. Vite development middleware or production static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
