import http from "node:http";

// ポート番号（サーバーの受付番号のようなもの）を設定する
// Render では環境変数 PORT が渡されるのでそれに対応できるようにしておくぞ
const PORT = process.env.PORT || 8888;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // 日本語が文字化けしないよう、文字コードを指定するのじゃ
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  if (url.pathname === "/") {
    console.log("GET /");
    res.writeHead(200);
    res.end("こんにちは！");
  } else if (url.pathname === "/ask") {
    console.log("GET /ask");
    const q = url.searchParams.get("q") ?? "なにか聞いておくれ";
    res.writeHead(200);
    res.end(`お主の質問は '${q}' じゃな。`);
  } else {
    res.writeHead(404);
    res.end("ページが見つかりませぬ");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
