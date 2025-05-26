const jsonServer = require("json-server")
const server = jsonServer.create()
const router = jsonServer.router("db.json")
const middlewares = jsonServer.defaults()

// Middleware для CORS
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  res.header("Access-Control-Allow-Methods", "*")
  next()
})

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Маршрут для входа
server.post("/auth/login", (req, res) => {
  const { email, password } = req.body
  const db = router.db
  const users = db.get("users").value()

  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    const { password, ...userWithoutPassword } = user
    res.json({
      token: `fake-jwt-token-${user.id}`,
      user: userWithoutPassword,
    })
  } else {
    res.status(401).json({ message: "Неверные учетные данные" })
  }
})

// Маршрут для регистрации
server.post("/auth/register", (req, res) => {
  const { name, email, password, role = "user" } = req.body
  const db = router.db
  const users = db.get("users").value()

  // Проверяем, существует ли пользователь
  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    return res.status(400).json({ message: "Пользователь уже существует" })
  }

  // Создаем нового пользователя
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role,
    avatar: "/placeholder.svg?height=120&width=120",
    createdAt: new Date().toISOString(),
  }

  db.get("users").push(newUser).write()

  const { password: _, ...userWithoutPassword } = newUser
  res.json({
    token: `fake-jwt-token-${newUser.id}`,
    user: userWithoutPassword,
  })
})

// Middleware для проверки авторизации
server.use((req, res, next) => {
  if (req.method === "GET" && req.path === "/users") {
    // Только для GET /users требуется авторизация
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Требуется авторизация" })
    }
  }
  next()
})

server.use(router)

const PORT = 3001
server.listen(PORT, () => {
  console.log(`JSON Server запущен на http://localhost:${PORT}`)
})
