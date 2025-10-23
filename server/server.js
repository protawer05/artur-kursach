const express = require('express')
const cors = require('cors')
const database = require('./database.js')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Роуты для продуктов
app.get('/api/products', async (req, res) => {
	try {
		const products = await database.getAllProducts()
		res.json(products)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.get('/api/products/category/:category', async (req, res) => {
	try {
		const products = await database.getProductsByCategory(req.params.category)
		res.json(products)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.post('/api/users/login', async (req, res) => {
	try {
		const { phone } = req.body

		// Ищем пользователя по телефону
		let user = await database.getUserByPhone(phone)

		// Если пользователь не найден, создаем нового
		if (!user) {
			user = await database.createUser({ phone })
		}

		res.json(user)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.get('/api/products/search', async (req, res) => {
	try {
		const products = await database.searchProducts(req.query.q)
		res.json(products)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Роуты для пользователей
app.get('/api/users/:id', async (req, res) => {
	try {
		const user = await database.getUserById(req.params.id)
		if (user) {
			res.json(user)
		} else {
			res.status(404).json({ error: 'Пользователь не найден' })
		}
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.post('/api/users', async (req, res) => {
	try {
		const user = await database.createUser(req.body)
		res.json(user)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.put('/api/users/:id', async (req, res) => {
	try {
		const user = await database.updateUser(req.params.id, req.body)
		res.json(user)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Роуты для заказов
app.post('/api/orders', async (req, res) => {
	try {
		const order = await database.createOrder(req.body)
		res.json(order)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.get('/api/orders/user/:userId', async (req, res) => {
	try {
		const orders = await database.getOrdersByUserId(req.params.userId)
		res.json(orders)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.put('/api/orders/:id/status', async (req, res) => {
	try {
		const order = await database.updateOrderStatus(
			req.params.id,
			req.body.status
		)
		res.json(order)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})
// Добавьте в server.js после основных роутов

// Админские роуты для продуктов
app.post('/api/admin/products', async (req, res) => {
	try {
		const product = await database.createProduct(req.body)
		res.json(product)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.put('/api/admin/products/:id', async (req, res) => {
	try {
		const product = await database.updateProduct(req.params.id, req.body)
		res.json(product)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.delete('/api/admin/products/:id', async (req, res) => {
	try {
		await database.deleteProduct(req.params.id)
		res.json({ success: true })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Админские роуты для заказов
app.get('/api/admin/orders', async (req, res) => {
	try {
		const orders = await database.getAllOrders()
		res.json(orders)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

app.put('/api/admin/orders/:id/status', async (req, res) => {
	try {
		const order = await database.updateOrderStatus(
			req.params.id,
			req.body.status
		)
		res.json(order)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})
app.listen(PORT, () => {
	console.log(`Сервер запущен на порту ${PORT}`)
})
