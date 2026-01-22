const express = require('express');
const jwt = require('jsonwebtoken');

const app= express();
app.use(express.json());

const SERECT_KEY= "huynh_nguyen_phuc_vinh";

app.post('/login', (req, res) => {
    const {username, password}= req.body;

    if(username === 'vinh' && password === '123'){
        const userPayLoad={
            fullName: 'Huynh Nguyen Phuc Vinh',
            studentId: '22x05xxx',
            role: 'admin'    
        };
        const token= jwt.sign(userPayLoad, SERECT_KEY, {expiresIn: '20m'});

        console.log("Token for: ", userPayLoad.fullName);
        return res.json({
            status: 'success',
            token: token
        });
    }
    res.status(401).json({status: 'unauthorized'});
});

app.listen(3000, ()=>{console.log("Auth Service (Producer) running on port 3000");
});
