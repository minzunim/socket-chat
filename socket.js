// 웹소켓 로직이 있는 파일
const WebSocket = require("ws");

// WebSocket 클래스의 Server 생성자 메소드로 웹소켓 서버 생성
// 웹소켓과 http는 같은 포트 공유 가능하므로 server 위에서 생성 후 동작
module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  // connection 이벤트 리스너 등록: 클라이언트가 서버와 웹 소켓 연결을 맺을 떄 발생
  wss.on("connection", (ws, req) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; // 클라이언트 IP를 알아내는 코드
    console.log("새로운 클라이언트 접속", ip);
    // message가 왔을 때 발생하는 이벤트
    ws.on("message", (message) => {
      console.log("" + message);
    });
    // 에러 발생 시
    ws.on("error", (error) => {
      console.error(error);
    });
    // 클라이언트와 연결이 끊겼을 때
    ws.on("close", () => {
      console.log("클라이언트 접속 해제", ip);
      clearInterval(ws.interval);
    });
    const interval = setInterval(() => {
      // 웹소켓이 열려 있을 떄 클라이언트로 메시지를 3초에 한번씩 보냄
      if (ws.readyState === ws.OPEN) {
        ws.send("서버에서 클라이언트로 메시지를 보냅니다.");
      }
    }, 3000);
    ws.interval = interval;
  });
};
