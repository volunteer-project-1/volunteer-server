module.exports = {
  apps: [
    {
      name: "See Me", // pm2로 실행한 프로세스 목록에서 이 애플리케이션의 이름으로 지정될 문자열
      script: "./dist/index.js", // pm2로 실행될 파일 경로
      //   watch: true, // 파일이 변경되면 자동으로 재실행 (true || false)
      node_args: "--max_old_space_size=4096",
      wait_ready: true,
      // 'ready' 이벤트를 기다릴 시간값
      listen_timeout: 50000,
      // SIGINT 시그널을 보낸 후 프로세스가 종료되지 않았을 때 SIGKILL 시그널을 보내기까지의 대기 시간을
      // 디폴트 값 1600ms에서 5000ms로 변경할 수 있습니다.
      kill_timeout: 5000,
      //   max_memory_restart: "80M",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
