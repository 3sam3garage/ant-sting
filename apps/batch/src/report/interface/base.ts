export interface BaseReport {
  // naver 증권내 pageId
  nid: string;
  // 제목
  title: string;
  // 상세 url
  detailUrl: string;
  // 증권사
  stockFirm: string;
  // file download link
  file: string;
  // 작성일
  date: string;
  // 조회수
  views: string; // todo 실제론 number 타입인데 파싱 번거로워서
}
