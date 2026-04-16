import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

await db.read();
db.data ||= {
  board: {
    title: "Product Launch Board",
    columns: {
      "col-1": { id: "col-1", title: "Todo", cardIds: ["card-1"] },
      "col-2": { id: "col-2", title: "Doing", cardIds: [] },
      "col-3": { id: "col-3", title: "Done", cardIds: [] },
    },
    cards: {
      "card-1": { id: "card-1", title: "First Task" },
    },
    columnOrder: ["col-1", "col-2", "col-3"],
  },
};

await db.write();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/board", async (req, res) => {
  await db.read();
  res.json({ board: db.data.board });
});

app.put("/board", async (req, res) => {
  const { board } = req.body;
  if (!board) {
    return res.status(400).json({ error: "Missing board payload" });
  }

  db.data.board = board;
  await db.write();

  res.json({ board: db.data.board });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Kanban backend running on http://localhost:${PORT}`);
});
