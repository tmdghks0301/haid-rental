# 헤이드 렌트카

휠체어카 렌트 및 사고 대차 렌트 서비스를 위한 웹 앱입니다.

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 **http://localhost:5173** 으로 접속하세요.

### 화면이 안 뜨는 경우

1. **개발 서버가 켜져 있는지 확인**  
   터미널에 `npm run dev` 실행 후 `Local: http://localhost:5173` 메시지가 나와야 합니다.

2. **주소 확인**  
   반드시 **http://localhost:5173** 으로 접속하세요. (8080이 아님)

3. **CMD에서 실행**  
   PowerShell에서 오류가 나면, **명령 프롬프트(CMD)** 를 열고 프로젝트 폴더에서 `npm run dev` 를 실행해 보세요.

4. **VS Code 디버그 실행**  
   F5 또는 "Launch Chrome against localhost" 로 실행 시, 자동으로 5173 포트로 열리도록 설정되어 있습니다.

## 빌드

```bash
npm run build
```

## 화면 구성

1. **홈** - 렌트 유형 선택 (휠체어카 / 사고 대차)
2. **렌트 서비스 안내** - 선택한 렌트 유형별 서비스 특성 안내
3. **렌트 예약 정보 입력** - 휠체어카 또는 사고 대차별 입력 폼
4. **예약 요청 완료** - 예약 접수 안내 및 예약 정보 표시
5. **예약 현황 확인** - 진행 단계 표시 및 결제 (상담 완료 후)
6. **이용 중** - 남은 시간, 차량 정보, 연장/반납 버튼
7. **이용 완료** - 이용 요약 및 홈으로 이동

## 기술 스택

- React 18
- React Router 6
- Vite 5

## 메인 컬러

- Primary: #61C21E

---

## GitHub에 올리는 방법

### 1. GitHub에서 새 저장소 만들기

1. [github.com](https://github.com) 로그인
2. 오른쪽 위 **+** → **New repository**
3. Repository name: `head-rentcar` (원하는 이름으로)
4. **Public** 선택 후 **Create repository** 클릭
5. 생성된 페이지에서 **저장소 주소** 복사 (예: `https://github.com/내아이디/head-rentcar.git`)

### 2. 터미널에서 프로젝트 폴더로 이동

```bash
cd "c:\Users\LIMEFRIENDS\Desktop\헤이드 렌트카"
```

### 3. Git 초기화 및 첫 커밋

```bash
git init
git add .
git commit -m "첫 커밋: 헤이드 렌트카 앱"
```

### 4. GitHub 저장소 연결 후 푸시

아래 `저장소주소`를 1번에서 복사한 주소로 바꾸세요.

```bash
git remote add origin 저장소주소
git branch -M main
git push -u origin main
```

예시:
```bash
git remote add origin https://github.com/내아이디/head-rentcar.git
git branch -M main
git push -u origin main
```

- **Git이 설치되어 있지 않다면** [git-scm.com](https://git-scm.com) 에서 설치 후 진행하세요.
- **첫 푸시 시** GitHub 로그인(또는 토큰)을 요구할 수 있습니다.
