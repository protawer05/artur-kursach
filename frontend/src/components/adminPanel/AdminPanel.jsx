import React, { useState, useEffect } from 'react'
import { productAPI, adminAPI } from '../../services/api'
import styles from './adminPanel.module.scss'

const AdminPanel = ({ currentUser }) => {
	const [products, setProducts] = useState([])
	const [orders, setOrders] = useState([])
	const [activeTab, setActiveTab] = useState('products')
	const [showProductModal, setShowProductModal] = useState(false)
	const [editingProduct, setEditingProduct] = useState(null)
	const [loading, setLoading] = useState(true)

	// Форма для товара
	const [productForm, setProductForm] = useState({
		name: '',
		price: '',
		category: 'супы',
		thumbnail: '',
		description: '',
		ingredients: '',
		weight: '',
		volume: '',
		cookingTime: '',
	})

	// Список разрешенных админов (номера телефонов)
	const adminPhones = ['79191402161', '79999999999', '78888888888']

	// Проверка прав администратора
	const isAdmin = adminPhones.includes(currentUser?.phone)

	useEffect(() => {
		if (isAdmin) {
			fetchProducts()
			fetchOrders()
		}
	}, [isAdmin])

	const fetchProducts = async () => {
		try {
			const data = await productAPI.getProducts()
			setProducts(data)
		} catch (error) {
			console.error('Ошибка загрузки товаров:', error)
		} finally {
			setLoading(false)
		}
	}

	const fetchOrders = async () => {
		try {
			const data = await adminAPI.getAllOrders()
			setOrders(data)
		} catch (error) {
			console.error('Ошибка загрузки заказов:', error)
		}
	}

	const handleProductSubmit = async e => {
		e.preventDefault()
		try {
			const productData = {
				...productForm,
				price: parseInt(productForm.price),
				ingredients: productForm.ingredients.split(',').map(i => i.trim()),
			}

			if (editingProduct) {
				await adminAPI.updateProduct(editingProduct.id, productData)
			} else {
				await adminAPI.createProduct(productData)
			}

			setShowProductModal(false)
			setEditingProduct(null)
			setProductForm({
				name: '',
				price: '',
				category: 'супы',
				thumbnail: '',
				description: '',
				ingredients: '',
				weight: '',
				volume: '',
				cookingTime: '',
			})

			fetchProducts()
			alert(editingProduct ? 'Товар обновлен!' : 'Товар добавлен!')
		} catch (error) {
			console.error('Ошибка сохранения товара:', error)
			alert('Ошибка при сохранении товара')
		}
	}

	const handleEditProduct = product => {
		setEditingProduct(product)
		setProductForm({
			name: product.name,
			price: product.price.toString(),
			category: product.category,
			thumbnail: product.thumbnail,
			description: product.description,
			ingredients: Array.isArray(product.ingredients)
				? product.ingredients.join(', ')
				: product.ingredients,
			weight: product.weight || '',
			volume: product.volume || '',
			cookingTime: product.cookingTime || '',
		})
		setShowProductModal(true)
	}

	const handleDeleteProduct = async id => {
		if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
			try {
				await adminAPI.deleteProduct(id)
				fetchProducts()
				alert('Товар удален!')
			} catch (error) {
				console.error('Ошибка удаления товара:', error)
				alert('Ошибка при удалении товара')
			}
		}
	}

	const handleOrderStatusUpdate = async (orderId, newStatus) => {
		try {
			await adminAPI.updateOrderStatus(orderId, newStatus)
			fetchOrders()
			alert('Статус заказа обновлен!')
		} catch (error) {
			console.error('Ошибка обновления статуса:', error)
			alert('Ошибка при обновлении статуса')
		}
	}

	const formatDate = dateString => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const getStatusText = status => {
		const statusMap = {
			processing: 'В обработке',
			cooking: 'Готовится',
			ready: 'Готов к выдаче',
			delivering: 'Доставляется',
			completed: 'Завершен',
			cancelled: 'Отменен',
		}
		return statusMap[status] || status
	}

	if (!isAdmin) {
		return (
			<div className={styles.adminPanel}>
				<div className={styles.accessDenied}>
					<h2>Доступ запрещен</h2>
					<p>У вас нет прав для доступа к панели администратора</p>
				</div>
			</div>
		)
	}

	if (loading) {
		return <div className={styles.loading}>Загрузка...</div>
	}

	return (
		<div className={styles.adminPanel}>
			<div className={styles.container}>
				<h1 className={styles.title}>Панель администратора</h1>

				<div className={styles.tabs}>
					<button
						className={`${styles.tab} ${
							activeTab === 'products' ? styles.active : ''
						}`}
						onClick={() => setActiveTab('products')}
					>
						Управление товарами
					</button>
					<button
						className={`${styles.tab} ${
							activeTab === 'orders' ? styles.active : ''
						}`}
						onClick={() => setActiveTab('orders')}
					>
						Управление заказами
					</button>
				</div>

				{activeTab === 'products' && (
					<div className={styles.productsSection}>
						<div className={styles.sectionHeader}>
							<h2>Товары ({products.length})</h2>
							<button
								className={styles.addButton}
								onClick={() => {
									setEditingProduct(null)
									setShowProductModal(true)
								}}
							>
								+ Добавить товар
							</button>
						</div>

						<div className={styles.productsGrid}>
							{products.map(product => (
								<div key={product.id} className={styles.productCard}>
									<img src={product.thumbnail} alt={product.name} />
									<div className={styles.productInfo}>
										<h3>{product.name}</h3>
										<p className={styles.price}>{product.price} ₽</p>
										<p className={styles.category}>{product.category}</p>
									</div>
									<div className={styles.productActions}>
										<button
											className={styles.editBtn}
											onClick={() => handleEditProduct(product)}
										>
											Редактировать
										</button>
										<button
											className={styles.deleteBtn}
											onClick={() => handleDeleteProduct(product.id)}
										>
											Удалить
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{activeTab === 'orders' && (
					<div className={styles.ordersSection}>
						<h2>Заказы ({orders.length})</h2>

						<div className={styles.ordersList}>
							{orders.map(order => (
								<div key={order.id} className={styles.orderCard}>
									<div className={styles.orderHeader}>
										<div>
											<strong>Заказ #{order.orderNumber}</strong>
											<span className={styles.orderDate}>
												{formatDate(order.date)}
											</span>
										</div>
										<div className={styles.orderStatus}>
											<select
												value={order.status}
												onChange={e =>
													handleOrderStatusUpdate(order.id, e.target.value)
												}
											>
												<option value='processing'>В обработке</option>
												<option value='cooking'>Готовится</option>
												<option value='ready'>Готов к выдаче</option>
												<option value='delivering'>Доставляется</option>
												<option value='completed'>Завершен</option>
												<option value='cancelled'>Отменен</option>
											</select>
										</div>
									</div>

									<div className={styles.orderDetails}>
										<p>
											<strong>Телефон:</strong> {order.userPhone}
										</p>
										<p>
											<strong>Тип:</strong>{' '}
											{order.type === 'delivery' ? 'Доставка' : 'Самовывоз'}
										</p>
										<p>
											<strong>Сумма:</strong> {order.total} ₽
										</p>

										<div className={styles.orderItems}>
											<strong>Товары:</strong>
											{order.items.map((item, index) => (
												<div key={index} className={styles.orderItem}>
													{item.name} - {item.quantity} шт × {item.price} ₽
												</div>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Модальное окно для добавления/редактирования товара */}
				{showProductModal && (
					<div className={styles.modalOverlay}>
						<div className={styles.modal}>
							<h2>
								{editingProduct ? 'Редактировать товар' : 'Добавить товар'}
							</h2>

							<form onSubmit={handleProductSubmit}>
								<div className={styles.formRow}>
									<div className={styles.formGroup}>
										<label>Название:</label>
										<input
											type='text'
											value={productForm.name}
											onChange={e =>
												setProductForm({ ...productForm, name: e.target.value })
											}
											required
										/>
									</div>

									<div className={styles.formGroup}>
										<label>Цена (₽):</label>
										<input
											type='number'
											value={productForm.price}
											onChange={e =>
												setProductForm({
													...productForm,
													price: e.target.value,
												})
											}
											required
										/>
									</div>
								</div>

								<div className={styles.formGroup}>
									<label>Категория:</label>
									<select
										value={productForm.category}
										onChange={e =>
											setProductForm({
												...productForm,
												category: e.target.value,
											})
										}
									>
										<option value='супы'>Супы</option>
										<option value='горячее'>Горячее</option>
										<option value='закуски'>Закуски</option>
										<option value='напитки'>Напитки</option>
										<option value='пицца'>Пицца</option>
										<option value='бургеры'>Бургеры</option>
										<option value='салаты'>Салаты</option>
									</select>
								</div>

								<div className={styles.formGroup}>
									<label>URL изображения:</label>
									<input
										type='url'
										value={productForm.thumbnail}
										onChange={e =>
											setProductForm({
												...productForm,
												thumbnail: e.target.value,
											})
										}
										required
									/>
								</div>

								<div className={styles.formGroup}>
									<label>Описание:</label>
									<textarea
										value={productForm.description}
										onChange={e =>
											setProductForm({
												...productForm,
												description: e.target.value,
											})
										}
										rows='3'
									/>
								</div>

								<div className={styles.formGroup}>
									<label>Ингредиенты (через запятую):</label>
									<input
										type='text'
										value={productForm.ingredients}
										onChange={e =>
											setProductForm({
												...productForm,
												ingredients: e.target.value,
											})
										}
										placeholder='томаты, сыр, базилик'
									/>
								</div>

								<div className={styles.formRow}>
									<div className={styles.formGroup}>
										<label>Вес:</label>
										<input
											type='text'
											value={productForm.weight}
											onChange={e =>
												setProductForm({
													...productForm,
													weight: e.target.value,
												})
											}
											placeholder='350г'
										/>
									</div>

									<div className={styles.formGroup}>
										<label>Объем:</label>
										<input
											type='text'
											value={productForm.volume}
											onChange={e =>
												setProductForm({
													...productForm,
													volume: e.target.value,
												})
											}
											placeholder='400мл'
										/>
									</div>

									<div className={styles.formGroup}>
										<label>Время приготовления:</label>
										<input
											type='text'
											value={productForm.cookingTime}
											onChange={e =>
												setProductForm({
													...productForm,
													cookingTime: e.target.value,
												})
											}
											placeholder='15-20 мин'
										/>
									</div>
								</div>

								<div className={styles.modalActions}>
									<button type='submit' className={styles.saveBtn}>
										{editingProduct ? 'Обновить' : 'Добавить'}
									</button>
									<button
										type='button'
										className={styles.cancelBtn}
										onClick={() => setShowProductModal(false)}
									>
										Отмена
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default AdminPanel
