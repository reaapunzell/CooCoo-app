import "dotenv/config"
import express from 'express';
import cors from 'cors';
import { dbConnect } from "./db.js";
import tokenValidation from "./middlewares/tokenValidation.js";

const app = express();
const PORT = process.env.SERVER_PORT || 3000;


console.log(process.env.ANYTHING)

app.use(express.json())
app.use(cors());



import router from "./controllers/users.js"
// import groupsRouter from "./controllerst
app.use('/auth', router)
//app.use("/transactions", transactionsRouter)

app.get('/', (req,res) => {
    res.send("CooCoo");
})



app.listen(PORT, () =>{
    dbConnect()
    console.log(`[server]: listening on port  ${PORT}`)
})