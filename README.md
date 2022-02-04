# 실행 방법

> 도커 컴포즈 방법을 추천드립니다.

## 로컬

PORT 변경은 `.env.*`에서 가능합니다.

```
$ nvm use //.nvmrc에 node 버전 명시
$ npm ci // 디펜던시 설치
$ npm run build


$ nf -e .env run npm run dev // `foreman`이라는 환경변수 주입 라이브러리 사용, 전역에 설치해주세요
```

## 도커

로컬에 docker가 설치되어 있어야 합니다.

```
$ docker build --target dev -t seeme .
$ docker run -d -it -p 3000:3000 --env-file .env --name seeme_server seeme npm run dev
```

> `-d` 는 백그라운드 실행 옵션 입니다. (도커 컴포즈도 마찬가지)  
> 주의 사항 : `.env.*` 에서 port 변경 시 `docker run` 에서의 `port` 도 변경해 주어야 합니다.

## 도커 컴포즈

```
$ docker-compose up --build
```

# db-migrate

```
$ nf -e .env run npm run migrate up
```

> 위 명령어 실행 시 `migrations` 폴더 아래의 모든 파일 실행  
> 특정 파일 실행을 원하면 파일명 입력

# API

## API 테스트

```
GET "/health" return `"ok"`
POST "/health2" return `request.body`
```

##

```
GET "/api/v1/auth/google"  // 구글 로그인

GET "/api/v1/user" // 전체 유저 찾기
GET "/api/v1/user/profile" // 내 profile 확인
GET "/api/v1/user/:id" // id를 갖는 유저 찾기
```
