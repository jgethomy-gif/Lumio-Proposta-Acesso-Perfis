
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function cadastro(req, res) {
  try {
    const { nome, email, senha, perfil, aceitouTermos } = req.body;

    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos."
      });
    }

    if (senha.length < 8) {
      return res.status(400).json({
        mensagem: "A senha deve ter pelo menos 8 caracteres."
      });
    }

    if (!["RESPONSAVEL", "MOTORISTA"].includes(perfil)) {
      return res.status(400).json({
        mensagem: "Perfil inválido."
      });
    }

    if (aceitouTermos !== true) {
      return res.status(400).json({
        mensagem: "É necessário aceitar os Termos de Uso e a Política de Privacidade."
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const [existente] = await db.execute(
      "SELECT id FROM usuarios WHERE email = ?",
      [emailNormalizado]
    );

    if (existente.length > 0) {
      return res.status(409).json({
        mensagem: "Este e-mail já está cadastrado."
      });
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    const [resultado] = await db.execute(
      `INSERT INTO usuarios
      (nome, email, senha_hash, perfil, aceitou_termos, data_aceite)
      VALUES (?, ?, ?, ?, TRUE, NOW())`,
      [nome.trim(), emailNormalizado, senhaHash, perfil]
    );

    return res.status(201).json({
      mensagem: "Cadastro realizado com sucesso!",
      usuario: {
        id: resultado.insertId,
        nome: nome.trim(),
        email: emailNormalizado,
        perfil
      }
    });
  } catch (error) {
    console.error("Erro no cadastro:", error.message);

    return res.status(500).json({
      mensagem: "Erro interno ao realizar cadastro."
    });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Informe o e-mail e a senha."
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const [usuarios] = await db.execute(
      `SELECT id, nome, email, senha_hash, perfil, ativo
       FROM usuarios WHERE email = ?`,
      [emailNormalizado]
    );

    if (usuarios.length === 0 || !usuarios[0].ativo) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos."
      });
    }

    const usuario = usuarios[0];

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "E-mail ou senha incorretos."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado.");
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    console.error("Erro no login:", error.message);

    return res.status(500).json({
      mensagem: "Erro interno ao realizar login."
    });
  }
}

module.exports = { cadastro, login };
