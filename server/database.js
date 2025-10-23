const sqlite3 = require('sqlite3').verbose()
const path = require('path')

class DatabaseService {
	constructor() {
		this.dbPath = path.join(process.cwd(), 'foodies.db')
		this.db = null
		this.init()
	}

	init() {
		this.db = new sqlite3.Database(this.dbPath, err => {
			if (err) {
				console.error('Ошибка подключения к базе данных:', err)
			} else {
				console.log('Подключение к SQLite установлено')
			}
		})
	}

	// Пользователи
	async getUserById(id) {
		return new Promise((resolve, reject) => {
			this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
				if (err) reject(err)
				else resolve(row)
			})
		})
	}

	async getUserByPhone(phone) {
		return new Promise((resolve, reject) => {
			this.db.get(
				'SELECT * FROM users WHERE phone = ?',
				[phone],
				(err, row) => {
					if (err) reject(err)
					else resolve(row)
				}
			)
		})
	}

	async createUser(userData) {
		return new Promise((resolve, reject) => {
			const {
				phone,
				name = 'Новый пользователь',
				email = '',
				address = '',
			} = userData
			this.db.run(
				'INSERT INTO users (phone, name, email, address) VALUES (?, ?, ?, ?)',
				[phone, name, email, address],
				function (err) {
					if (err) reject(err)
					else resolve({ id: this.lastID, phone, name, email, address })
				}
			)
		})
	}

	async updateUser(id, userData) {
		return new Promise((resolve, reject) => {
			const { name, email, address } = userData
			this.db.run(
				'UPDATE users SET name = ?, email = ?, address = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
				[name, email, address, id],
				function (err) {
					if (err) reject(err)
					else resolve({ id, ...userData })
				}
			)
		})
	}

	// Продукты
	async getAllProducts() {
		return new Promise((resolve, reject) => {
			this.db.all('SELECT * FROM products', (err, rows) => {
				if (err) reject(err)
				else resolve(rows)
			})
		})
	}

	async getProductsByCategory(category) {
		return new Promise((resolve, reject) => {
			this.db.all(
				'SELECT * FROM products WHERE category = ?',
				[category],
				(err, rows) => {
					if (err) reject(err)
					else resolve(rows)
				}
			)
		})
	}

	async searchProducts(query) {
		return new Promise((resolve, reject) => {
			this.db.all(
				'SELECT * FROM products WHERE name LIKE ?',
				[`%${query}%`],
				(err, rows) => {
					if (err) reject(err)
					else resolve(rows)
				}
			)
		})
	}

	// Заказы
	async createOrder(orderData) {
		return new Promise((resolve, reject) => {
			const {
				orderNumber,
				userId,
				type,
				total,
				items,
				pickupPoint,
				deliveryData,
				userPhone,
			} = orderData

			const db = this.db

			// ВАЖНО: Используем локальное время сервера
			const now = new Date()
			// Преобразуем в строку в локальном времени
			const localDateString =
				now.toLocaleString('sv-SE').replace(' ', 'T') + '.000Z'
			// Формат: '2023-10-23T23:41:00.000Z'

			console.log('📦 Creating order with LOCAL date:', {
				serverTime: now.toString(),
				localISO: localDateString,
			})

			db.run(
				`INSERT INTO orders (orderNumber, userId, type, total, items, pickupPoint, deliveryData, userPhone, date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					orderNumber,
					userId,
					type,
					total,
					JSON.stringify(items),
					pickupPoint ? JSON.stringify(pickupPoint) : null,
					deliveryData ? JSON.stringify(deliveryData) : null,
					userPhone,
					localDateString, // Сохраняем в локальном времени
				],
				function (err) {
					if (err) {
						console.error('❌ SQL Error in createOrder:', err)
						reject(err)
					} else {
						const orderId = this.lastID
						console.log('✅ Order created with ID:', orderId)

						db.get(
							'SELECT * FROM orders WHERE id = ?',
							[orderId],
							(err, row) => {
								if (err) {
									console.error('❌ Error fetching created order:', err)
									reject(err)
								} else {
									console.log('📅 Order date from DB:', row.date)

									const order = {
										id: row.id,
										orderNumber: row.orderNumber,
										userId: row.userId,
										type: row.type,
										status: row.status,
										total: row.total,
										items: JSON.parse(row.items),
										pickupPoint: row.pickupPoint
											? JSON.parse(row.pickupPoint)
											: null,
										deliveryData: row.deliveryData
											? JSON.parse(row.deliveryData)
											: null,
										userPhone: row.userPhone,
										date: row.date,
									}

									console.log('🎉 Final order object:', order)
									resolve(order)
								}
							}
						)
					}
				}
			)
		})
	}

	async getOrdersByUserId(userId) {
		return new Promise((resolve, reject) => {
			this.db.all(
				'SELECT * FROM orders WHERE userId = ? ORDER BY date DESC',
				[userId],
				(err, rows) => {
					if (err) reject(err)
					else {
						const orders = rows.map(row => ({
							...row,
							items: JSON.parse(row.items),
							pickupPoint: row.pickupPoint ? JSON.parse(row.pickupPoint) : null,
							deliveryData: row.deliveryData
								? JSON.parse(row.deliveryData)
								: null,
						}))
						resolve(orders)
					}
				}
			)
		})
	}
	// Добавьте в класс DatabaseService в database.js

	// Админские методы для продуктов
	async createProduct(productData) {
		return new Promise((resolve, reject) => {
			const {
				name,
				price,
				category,
				thumbnail,
				description,
				ingredients,
				weight,
				volume,
				cookingTime,
			} = productData

			this.db.run(
				`INSERT INTO products (name, price, category, thumbnail, description, ingredients, weight, volume, cookingTime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					name,
					price,
					category,
					thumbnail,
					description,
					Array.isArray(ingredients) ? ingredients.join(',') : ingredients,
					weight,
					volume,
					cookingTime,
				],
				function (err) {
					if (err) reject(err)
					else
						resolve({
							id: this.lastID,
							...productData,
						})
				}
			)
		})
	}

	async updateProduct(id, productData) {
		return new Promise((resolve, reject) => {
			const {
				name,
				price,
				category,
				thumbnail,
				description,
				ingredients,
				weight,
				volume,
				cookingTime,
			} = productData

			this.db.run(
				`UPDATE products SET 
        name = ?, price = ?, category = ?, thumbnail = ?, 
        description = ?, ingredients = ?, weight = ?, 
        volume = ?, cookingTime = ? 
       WHERE id = ?`,
				[
					name,
					price,
					category,
					thumbnail,
					description,
					Array.isArray(ingredients) ? ingredients.join(',') : ingredients,
					weight,
					volume,
					cookingTime,
					id,
				],
				function (err) {
					if (err) reject(err)
					else resolve({ id, ...productData })
				}
			)
		})
	}

	async deleteProduct(id) {
		return new Promise((resolve, reject) => {
			this.db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
				if (err) reject(err)
				else resolve({ success: true })
			})
		})
	}

	async getAllOrders() {
		return new Promise((resolve, reject) => {
			this.db.all('SELECT * FROM orders ORDER BY date DESC', (err, rows) => {
				if (err) reject(err)
				else {
					const orders = rows.map(row => ({
						...row,
						items: JSON.parse(row.items),
						pickupPoint: row.pickupPoint ? JSON.parse(row.pickupPoint) : null,
						deliveryData: row.deliveryData
							? JSON.parse(row.deliveryData)
							: null,
					}))
					resolve(orders)
				}
			})
		})
	}
	async updateOrderStatus(orderId, status) {
		return new Promise((resolve, reject) => {
			this.db.run(
				'UPDATE orders SET status = ? WHERE id = ?',
				[status, orderId],
				function (err) {
					if (err) reject(err)
					else resolve({ id: orderId, status })
				}
			)
		})
	}

	close() {
		if (this.db) {
			this.db.close()
		}
	}
}

module.exports = new DatabaseService()
