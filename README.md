# SEE ME

장애인들만을 위한 채용 플랫폼 서버입니다.  
Rest API 서버로써 `Next.js`와 함께 개발되었습니다.

[클라이언트 Repo](https://github.com/volunteer-project-1/volunteer_client)

# 프로젝트 전체적인 구조

![asdf](https://user-images.githubusercontent.com/50390565/167988433-47848b8a-5d00-4aaf-83e3-dda98d3ec58d.jpg)

# 프로젝트의 주요 관심사

공통사항

- 코드의 지속적인 리팩토링

* Controller와 Service 테스트 커버리지 100%

# 브랜치 관리 전략

Git Flow를 사용하여 브랜치를 관리합니다.  
모든 브랜치는 PR을 진행 후 `main`으로 merge를 진행합니다.

- main : 개발이 끝난 부분에 대해서 Merge를 진행합니다.

* v tag : main 브랜치에서 배포시 사용합니다.
* feature : 기능 개발을 진행할 때 사용합니다.
* fix : 배포를 진행한 후 발생한 버그를 수정할 때 사용합니다.

# 테스트

- Integration Testing

* - Prod DB와 같은 환경의 Test DB에서 테스트를 진행

* Unit Testing
* - DB를 Mock하여 테스트 진행

- GitHub Actions의 CI를 적용하여 테스트 자동화

# 사용 기술 및 환경

ExpressJS, MySQL, Redis, Docker, Filebeat + ELK, AWS Cloud

# CI

`v tag`를 제외한 브랜치의 Commit 푸쉬와 PR 시마다 자동 Build 및 Test 적용

# CD

AWS EC2에 scp를 이용한 파일 전송 후 pm2로 재실행 하여 배포합니다.  
추후 EKS 전환을 대비하여 Docker 이미지를 제작하여 `GitHub Container Registry`에 배포합니다.

# DB ERD

![test0129](https://user-images.githubusercontent.com/50390565/182368454-a34385e4-7686-47fb-a5f6-4828c7353168.png)

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
// or
$ docker-compose -f ./docker-compose.prod.yml up --build
```

# 테스팅

unit testing && integration testing
도커로 테스트 환경 구축

```
$ cd mysql && docker-compose up --build
$ npm run test // 다른 환경 변수 사용 하고 싶으면 `nf -e .env.test run npm run test`
```

# prisma

prisma v4 사용.

- `prisma.shcema`에 정의된 스키마의 타입 생성

```
$ npm run db:generate
```

- `prisma.shcema` 변경 사항 마이그레이션 `.sql` 파일 생성

```
$ npm run db:migrate
```

- `prisma.shcema` 변경 사항을 DB에 직접 마이그레이션

```
$ npm run db:push
```
