const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  nascimento: { type: String, required: true }, // Novo campo
  tel1: { type: String, required: true }, // Novo campo
  tel2: { type: String }, // Opcional
  senha: { type: String, required: true },
  endereco: {
    cep: { type: String, required: true },
    ruaBairro: { type: String }, // Unificado
    cidadeEstado: { type: String }, // Unificado
    numeroComplemento: { type: String, required: false }, // Opcional/Unificado
  },
  dataCadastro: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);