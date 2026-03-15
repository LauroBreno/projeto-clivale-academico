const bcrypt = require('bcrypt'); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Certifique-se que o arquivo na pasta models se chama 'user.js' ou 'User.js'
// No prompt anterior vimos que seu sistema diferencia maiúsculas, ajuste se necessário:
const User = require('./models/user'); 

const app = express();

app.use(cors());
app.use(express.json());

// Sua conexão do MongoDB Atlas
const mongoURI = "mongodb+srv://breno2020_db:Clivale2026@clivaleprojeto.ra4zgxp.mongodb.net/?appName=ClivaleProjeto";

mongoose.connect(mongoURI)
  .then(() => console.log("Conectado com sucesso ao MongoDB Atlas (Nuvem)!"))
  .catch(err => {
    console.error("Erro ao conectar ao Atlas:", err.message);
  });

// ROTA DE REGISTRO
app.post('/api/usuarios/registrar', async (req, res) => {
  try {
    const { 
      nome, cpf, email, nascimento, cep, 
      ruaBairro, cidadeEstado, numeroComplemento, 
      tel1, tel2, senha 
    } = req.body;

    const usuarioExistente = await User.findOne({ $or: [{ cpf }, { email }] });
    if (usuarioExistente) {
      return res.status(400).json({ message: "CPF ou E-mail já cadastrados." });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const novoUsuario = new User({
      nome, 
      cpf, 
      email, 
      nascimento, 
      tel1, 
      tel2, 
      senha: senhaCriptografada,
      endereco: { 
        cep, 
        ruaBairro, 
        cidadeEstado, 
        numeroComplemento // Agora opcional no banco também
      }
    });

    await novoUsuario.save();
    res.status(201).json({ message: "Cadastro realizado com sucesso!" });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ message: "Erro interno no servidor ao cadastrar." });
  }
});

// ROTA DE LOGIN (IMPLEMENTADA)
app.post('/api/usuarios/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Busca o usuário pelo e-mail
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: "E-mail ou senha incorretos." });
    }

    // 2. Compara a senha digitada com a criptografada
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ message: "E-mail ou senha incorretos." });
    }

    // 3. Retorna sucesso e os dados básicos do usuário
    res.status(200).json({ 
      message: "Login realizado com sucesso!",
      usuario: {
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro interno no servidor." });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor Clivale Online!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});