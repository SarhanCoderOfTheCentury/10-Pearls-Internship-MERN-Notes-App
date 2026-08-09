import express from "express";
import healthRoutes from "./routes/health.routes.js";
const app = express();

//router is router.get("/"), app adds /api/health to "/" --> /api/health

//controller method, say getHealth, will be called with all the request data : req.params, req.body, req.query, req.user

//req.params, req.body, req.query --> are from Express
//req.user --> comes from authentication middleware

app.use("/api/health", healthRoutes)

//404 handler (must be placed after all other routes)
app.use((req,res)=>{
    res.status(404).json({
        success: false,
        message: "Route not found",
    })
})
export default app;