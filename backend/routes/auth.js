import express from "express";
const router = express.Router();

// usuário fixo
const ADMIN_USER = { email: "admin@site.com", password: "admin123" };

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    res.json({ token: "mock-admin-token", user: "admin" });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

export default router;
