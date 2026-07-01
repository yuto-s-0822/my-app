import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// 7行目あたり、const pool ... の前に書き足すのじゃ
console.log("接続URLを確認:", process.env.DATABASE_URL ? "URLは読み込めておるぞ" : "URLが空っぽじゃ！");


// 修正前: ssl: true
// 修正後: 次のように書き換えるのじゃ
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // 「証明書のチェックをパスする」という設定じゃ
  }
});


const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

const app = express();
const PORT = process.env.PORT || 8888;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  // ここで prisma.user が使えるようになれば成功じゃ
  const users = await prisma.user.findMany();
  res.render("index", { users });
});

app.post("/users", async (req, res) => {
  const name = req.body.name;
  if (name) {
    await prisma.user.create({ data: { name } });
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
