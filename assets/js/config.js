/*
 * 사이트 설정 파일 — 가게 정보는 전부 여기서만 바꾸면 됩니다.
 * (.NET의 appsettings.json 같은 역할. 값이 빈 문자열이면 화면에 "추후 안내"로 표시됩니다.)
 */
window.SITE = {
  name: "성운목재합판",
  nameEn: "SEONGWOON WOOD",
  owner: "강민준",
  tagline: "언제나 신뢰할 수 있는 목자재 파트너",
  description: "경기도 안산시 상록구 용신로 199, 1층(사동 1551-2)의 목자재 전문점. 구조목·각재·합판·석고보드·MDF 판매, 예림도어·몰딩·중문 취급. 합리적인 견적, 신속한 배송, 양중 문의.",

  phone: "010-5333-4848",
  fax: "0504-312-4848",
  email: "swwood4848@naver.com",
  hours: "평일 06:30~18:00 / 주말·공휴일 06:30~15:00",
  address: "경기도 안산시 상록구 용신로 199, 1층",
  addressNote: "(사동 1551-2)",

  account: {
    bank: "신한은행",
    number: "110-362-260567",
    holder: "강민준"
  },

  sns: {
    // 있으면 주소를 넣으세요. 빈 값은 표시되지 않습니다.
    blog: "",
    instagram: ""
  },

  // 문의 폼 전송 주소. https://formspree.io 에서 무료 폼을 만들고 받은 주소를 넣으세요.
  // 예: "https://formspree.io/f/abcdwxyz"  — 비어 있으면 폼 대신 전화 안내가 나옵니다.
  formEndpoint: ""
};
