const express = require('express');
const jwt=  require('jsonwebtoken');

const app= express();
app.use(express.json());

const SERECT_KEY= "huynh_nguyen_phuc_vinh";

const verifyToken= (req, res, next) => {
    const authHeader= req.headers['authorization'];
    const token= authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(403).json({status: 'no token provided'});
    }

    jwt.verify(token, SERECT_KEY, (err, decodedData)=>{
        if(err){
            return res.status(401).json({status: 'unauthorized'});
        }
        req.user= decodedData;
        next();
    });
};

app.get('/api/profile', verifyToken, (req, res) => {
    console.log("Access for: ", req.user.fullName);
    res.json({
        message:"Verify token successfully",
        data: req.user
    });
});

app.listen(3000, ()=>{console.log("Resource Service (Consumer) running on port 3000")});