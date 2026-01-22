const amqp = require('amqplib');
const express = require('express');
const jwt = require('jsonwebtoken');

const app= express();
app.use(express.json());

const SERECT_KEY = "huynh_nguyen_phuc_vinh";
const RABBITMQ_URL = "amqp://user:password@rabbitmq:5672";
const QUEUE_NAME = "auth_event";
let channel;


// Kết nối RabbitMQ
async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log("Consumer connected to RabbitMQ");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ", error);
        setTimeout(connectRabbitMQ, 3000); // Thử kết nối lại sau 3 giây
    }
}

connectRabbitMQ();

app.post('/login', (req, res) => {
    const {username, password}= req.body;

    if(username === 'vinh' && password === '123'){
        const userPayLoad={
            fullName: 'Huynh Nguyen Phuc Vinh',
            studentId: '22x05xxx',
            role: 'admin'    
        };
        const token= jwt.sign(userPayLoad, SERECT_KEY, {expiresIn: '20m'});

        const message = JSON.stringify({event: 'USER_LOGIN', user: userPayLoad.fullName, timestamp: new Date()});

        channel.sendToQueue(QUEUE_NAME, Buffer.from(message), {persistent: true});
        
        console.log("Token for: ", userPayLoad.fullName);
        return res.json({
            status: 'success',
            token: token
        });
    }

    // authEvent.status = "FAILED";
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify({user: username, timestamp: new Date(), event: 'USER_LOGIN_FAILED'})), {persistent: true});

    res.status(401).json({status: 'unauthorized'});
});

app.listen(3000, ()=>{console.log("Auth Service (Producer) running on port 3000");
});
