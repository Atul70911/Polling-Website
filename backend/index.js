import dotenv from "dotenv";
dotenv.config({ path: "../env" }); // or whatever your env file is
import { app } from "./src/server.js";
import connectDB from "./src/db/index.js";

const PORT = 3000

connectDB();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
