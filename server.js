const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const userData = {
    income: 0,
    expense: 0,
    balance: 0,
};

const userRouter = express.Router();

function validateUserData(req, res, next) {
    const { income, expense } = req.body;

    if (isNaN(parseFloat(income)) || isNaN(parseFloat(expense))) {
        return res.status(400).json({ error: 'Os dados de entrada são inválidos.' });
    }

    next();
}

userRouter.get('/', (req, res) => {
    res.json(userData);
});

userRouter.post('/update', validateUserData, (req, res) => {
    const { income, expense } = req.body;

    userData.income = parseFloat(income);
    userData.expense = parseFloat(expense);
    userData.balance = userData.income - userData.expense;

    // Envie os dados atualizados para todos os clientes conectados via Socket.io
    io.emit('updateData', userData);

    res.json(userData);
});

app.use('/api/user', userRouter);

app.get('/', (req, res) => {
    res.send('O servidor está rodando.');
});

io.on('connection', (socket) => {
    console.log('Cliente conectado');
    // Envia os dados iniciais ao cliente assim que ele se conectar
    socket.emit('updateData', userData);
});

server.listen(port, () => {
    console.log(`Servidor está rodando em http://localhost:${port}`);
});
