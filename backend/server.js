import "dotenv/config"; 
import app from "./src/app.js";
import connectDB from "./src/config/database.js";

const PORT = process.env.PORT || 5000;

//connecting database
const startServer = async () => {
    try{

    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
    }
    catch(error){
        console.log(error);
    }
}

startServer();
