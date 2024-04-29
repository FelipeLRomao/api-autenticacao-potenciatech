const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const { createUser, findUserByEmail } = require('./controllers/userController');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Informe os campos corretamente' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return res.status(400).json({ message: 'Usuário já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashedPassword);
    return res.status(201).json({ message: 'Cadastro realizado com sucesso', user });
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Informe os campos corretamente' });
    }

    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Login inválido' });
    }

    const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });
    return res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
