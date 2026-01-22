const amqp = require('amqplib'); // THÊM DÒNG NÀY VÀO ĐẦU FILE
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
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

        channel.consume(QUEUE_NAME, (msg) => {
            if(msg!= null){
                const content= msg.content.toString();
                console.log("[X] receeived from RabbitMQ:", content);

                const data= JSON.parse(content);
                console.log(`Processing task for user: ${data.user ||'Unknown'}`);

                channel.ack(msg); 
            }
        });

    } catch (error) {
        console.error("Failed to connect to RabbitMQ", error);
        setTimeout(connectRabbitMQ, 3000); // Thử kết nối lại sau 3 giây
    }
}

connectRabbitMQ();


const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ status: 'no token provided' });
    }

    jwt.verify(token, SERECT_KEY, (err, decodedData) => {
        if (err) {
            return res.status(401).json({ status: 'unauthorized' });
        }
        req.user = decodedData;
        next();
    });
};

app.get('/api/profile', verifyToken, (req, res) => {
    console.log("Access for: ", req.user.fullName);
    res.json({
        message: "Verify token successfully",
        data: req.user
    });
});

app.listen(3000, () => { console.log("Resource Service (Consumer) running on port 3000") });