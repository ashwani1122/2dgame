import express from 'express';
import { router } from './routes/v1';
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1" ,router);

app.listen(PORT, ()=>{

    console.log(`Server is running on http://localhost:${PORT}`);
})