import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to our express app");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
