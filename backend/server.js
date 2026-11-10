
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./src/config/db");
const usuarioRoutes = require("./src/routes/usuarioRoutes");

const app = express();

// Middlewares
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174"
  ]
}));

app.use(express.json());

// Rotas de usuários
app.use("/api/usuarios", usuarioRoutes);

// Rota principal
app.get("/", (req, res) => {
  res.json({
    mensagem: "API Lumio funcionando!"
  });
});

// Verificar conexão com MySQL
app.get("/api/health", async (req, res) => {
  try {
    const [result] = await db.query("SELECT 1 AS conectado");

    res.status(200).json({
      status: "success",
      mensagem: "Backend e MySQL conectados!",
      database: process.env.DB_NAME,
      mysql: result[0].conectado === 1
    });
  } catch (error) {
    console.error("Erro no MySQL:", error.message);

    res.status(500).json({
      status: "error",
      mensagem: "Não foi possível conectar ao MySQL."
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;

async function iniciarServidor() {
  try {
    await db.query("SELECT 1");

    app.listen(PORT, () => {
      console.log(`Lumio API rodando em http://localhost:${PORT}`);
      console.log("MySQL conectado com sucesso!");
    });
  } catch (error) {
    console.error("Erro ao iniciar o backend:", error.message);
    process.exit(1);
  }
}

iniciarServidor();
