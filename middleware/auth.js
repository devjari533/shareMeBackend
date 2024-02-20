import jwt from 'jsonwebtoken'

const auth = async (req,res,next) => {
    try {
        const tokenArray = req.headers.authorization.split(" ")
        // console.log("Header is ",tokenArray);
        // console.log("Now ",tokenArray[1]);

        const token = tokenArray[1]
        // console.log("Token is ",token);
        const isCustomAuth = token.length < 500

        let decodedData

        if(token && isCustomAuth){
            decodedData=jwt.verify(token,'test')
            req.userId = decodedData?.id
        }else{
            decodedData=jwt.decode(token)
            req.userId = decodedData?.sub
        }

        next()

    } catch (error) {
        console.log(error);
    }
}

export default auth