//since all our controllers are asynchronous, so creating a middleware that handles async requests and also handles error passing to global error middleware
export const asyncHandler = (handler) =>{
    return (req, res, next)=>{
        Promise.resolve(handler(req,res,next)).catch(next);
        //the catch here is used to catch next(error)
    }
}