// Базовый URL вашего сервера
const API_BASE_URL = 'http://localhost:3001/api'

// Функции для работы с товарами
export const productAPI = {
	// Получить все товары
	getProducts: async () => {
		const response = await fetch(`${API_BASE_URL}/products`)
		return await response.json()
	},

	// Получить товары по категории
	getProductsByCategory: async category => {
		const response = await fetch(
			`${API_BASE_URL}/products?category=${category}`
		)
		return await response.json()
	},

	// Получить товар по ID
	getProductById: async id => {
		const response = await fetch(`${API_BASE_URL}/products/${id}`)
		return await response.json()
	},
}

// Функции для работы с пользователями
export const userAPI = {
	// Авторизация по телефону
	login: async phone => {
		const response = await fetch(`${API_BASE_URL}/users/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ phone }),
		})
		return await response.json()
	},

	// Получить данные пользователя
	getUser: async userId => {
		const response = await fetch(`${API_BASE_URL}/users/${userId}`)
		return await response.json()
	},

	// Обновить данные пользователя
	updateUser: async (userId, userData) => {
		const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})
		return await response.json()
	},
}

// Функции для работы с заказами
export const orderAPI = {
	// Создать заказ
	createOrder: async orderData => {
		const response = await fetch(`${API_BASE_URL}/orders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(orderData),
		})
		return await response.json()
	},

	// Получить заказы пользователя
	getUserOrders: async userId => {
		const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`)
		return await response.json()
	},

	// Получить все заказы (для админа)
	getAllOrders: async () => {
		const response = await fetch(`${API_BASE_URL}/orders`)
		return await response.json()
	},
}
// Функции для работы с товарами (админские)
export const adminAPI = {
	// Добавить товар
	createProduct: async productData => {
		const response = await fetch(`${API_BASE_URL}/admin/products`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(productData),
		})
		return await response.json()
	},

	// Обновить товар
	updateProduct: async (id, productData) => {
		const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(productData),
		})
		return await response.json()
	},

	// Удалить товар
	deleteProduct: async id => {
		const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
			method: 'DELETE',
		})
		return await response.json()
	},

	// Получить все заказы (для админа)
	getAllOrders: async () => {
		const response = await fetch(`${API_BASE_URL}/admin/orders`)
		return await response.json()
	},

	// Обновить статус заказа
	updateOrderStatus: async (orderId, status) => {
		const response = await fetch(
			`${API_BASE_URL}/admin/orders/${orderId}/status`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status }),
			}
		)
		return await response.json()
	},
}
