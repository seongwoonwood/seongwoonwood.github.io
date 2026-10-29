# 성운목재합판 홈페이지

빌드 없는 순수 HTML/CSS/JS 정적 사이트입니다. GitHub Pages에 그대로 올리면 동작합니다.

## 폴더 구조

```
index.html        홈
about.html        소개
products.html     취급 품목
gallery.html      갤러리
notice.html       공지 목록
post.html         공지 본문 (post.html?id=글파일명)
location.html     오시는 길 (지도)
contact.html      문의 폼
assets/js/config.js   ★ 가게 정보(전화·이메일·영업시간·계좌·폼 주소) — 여기만 고치면 전 페이지 반영
assets/js/main.js     헤더/푸터/다크모드 공통 코드
assets/css/style.css  디자인 (맨 위 :root 색상 변수)
assets/img/           이미지 (지금은 임시 이미지)
posts/                공지 글 (마크다운)
serve.ps1             로컬 미리보기 서버
```

.NET에 비유하면 `config.js`가 appsettings.json, `main.js`가 _Layout.cshtml 역할입니다.
헤더·푸터는 `main.js`가 모든 페이지에 똑같이 그려 넣습니다. 메뉴를 바꾸려면 `main.js` 위쪽 `NAV` 배열을 고치세요.

## 로컬에서 미리보기

공지 글을 `fetch`로 읽기 때문에 html 파일을 더블클릭(file://)하면 공지가 안 보입니다. 아래 스크립트로 띄우세요.

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

브라우저에서 http://localhost:8080 을 엽니다. (VS Code를 쓴다면 Live Server 확장도 됩니다.)

## 추후 전달받을 정보 넣기

`assets/js/config.js`에서:

- `email`: 이메일 주소
- `hours`: 영업시간 (예: `"평일 08:00~18:00 / 토 08:00~13:00 / 일·공휴일 휴무"`)
- `formEndpoint`: 문의 폼 주소 (아래 참고)

빈 값은 화면에 "추후 안내"로 나옵니다.

## 문의 폼 연결 (Formspree, 무료)

GitHub Pages에는 서버가 없어서 메일 발송은 외부 서비스를 씁니다.

1. https://formspree.io 가입 → New Form → 받을 이메일 입력
2. 발급된 주소(`https://formspree.io/f/xxxxxxx`)를 `config.js`의 `formEndpoint`에 붙여넣기
3. 처음 한 번 테스트 전송하면 Formspree가 확인 메일을 보냅니다. 확인하면 이후부터 메일로 문의가 옵니다.

무료 플랜은 월 50건까지입니다.

## 공지 글 쓰기

1. `posts/` 폴더에 `2026-11-05-holiday.md`처럼 마크다운 파일을 만듭니다.
2. `posts/posts.json` 맨 위에 한 줄 추가합니다.
   ```json
   { "id": "2026-11-05-holiday", "title": "11월 휴무 안내", "date": "2026-11-05" },
   ```
   `id`는 파일명(.md 제외)과 같아야 합니다. 맨 위에 고정하려면 `"pinned": true`를 넣으세요.
3. 커밋하고 푸시하면 1~2분 뒤 반영됩니다.

GitHub 웹사이트에서 바로 할 수도 있습니다. 저장소 → `posts` 폴더 → **Add file → Create new file**.
그다음 `posts.json`을 연필 아이콘으로 수정하면 됩니다. PC에 아무것도 설치하지 않아도 됩니다.

## 사진 바꾸기

- 로고: `assets/img/logo.png`(마크만), `logo-full.png`(마크+상호)는 명함 이미지에서 잘라낸 것입니다. 디자인 원본 파일(AI/SVG/고해상도 PNG)이 있으면 같은 이름으로 덮어쓰면 화질이 좋아집니다.
- 메인 배경: `assets/img/hero.svg` → 매장 사진(예: `hero.jpg`)으로 바꾸고 `style.css`의 `.hero` 경로를 수정하세요.
- 품목·갤러리: 같은 방법으로 `assets/img`에 넣고 html의 `src` / `href`를 바꿉니다. 사진은 가로 1600px 이하로 줄여서 올리면 빨리 뜹니다.

## 지도

- 네이버지도·카카오맵 **길찾기 버튼**은 주소로 자동 연결됩니다.
- 페이지에 박혀 있는 지도는 API 키 없이 쓸 수 있는 구글 지도입니다. 카카오맵 지도를 넣고 싶다면 map.kakao.com에서 매장 검색 → 공유 → **지도 퍼가기**로 받은 HTML을 `location.html`의 `<iframe>` 자리에 붙여넣으세요. 이 방법은 API 키가 필요 없습니다.

## GitHub Pages 배포

1. GitHub에서 새 저장소를 만듭니다. 이름이 `<아이디>.github.io`면 주소가 `https://<아이디>.github.io`이고, 다른 이름이면 `https://<아이디>.github.io/<저장소명>`입니다.
2. 이 폴더 내용을 올립니다.
   ```bash
   git init
   git add .
   git commit -m "성운목재합판 홈페이지"
   git branch -M main
   git remote add origin https://github.com/<아이디>/<저장소명>.git
   git push -u origin main
   ```
3. 저장소 → **Settings → Pages** → Source: `Deploy from a branch`, Branch: `main` / `/ (root)` → Save
4. 1~2분 뒤 위 주소로 접속합니다.

`.nojekyll` 파일은 GitHub가 Jekyll 변환을 하지 않도록 막는 용도입니다. 지우지 마세요.

나중에 개인 도메인(예: seongwoonwood.com)을 사면 Settings → Pages → Custom domain에 입력하고, 도메인 업체 DNS에 CNAME 레코드를 `<아이디>.github.io`로 추가하면 됩니다.
