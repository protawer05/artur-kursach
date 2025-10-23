import React, { useState, useEffect } from 'react'
import { userAPI, orderAPI } from '../../../services/api'
import styles from './profilePage.module.scss'

const ProfilePage = ({ currentUser, onUserUpdate }) => {
	const [user, setUser] = useState(null)
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(true)
	const [editing, setEditing] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		address: '',
	})

	// Временные интервалы для автоматического изменения статусов (в минутах)
	const statusTimings = {
		processing: 1,
		cooking: 2,
		delivering: 3,
		completed: 4,
	}

	useEffect(() => {
		console.log('ProfilePage currentUser:', currentUser)
		if (currentUser && currentUser.id) {
			fetchUserData()
			fetchUserOrders()
		} else {
			console.log('No currentUser or userId')
			setLoading(false)
		}
	}, [currentUser])

	// Функция для коррекции часового пояса
	const sqliteDateToLocal = sqliteDate => {
		if (!sqliteDate) return new Date()

		let date

		if (sqliteDate.includes('T')) {
			date = new Date(sqliteDate)
		} else if (sqliteDate.includes(' ')) {
			date = new Date(sqliteDate.replace(' ', 'T'))
		} else {
			date = new Date(sqliteDate)
		}

		const timezoneOffset = date.getTimezoneOffset() * 60000
		return new Date(date.getTime() + timezoneOffset)
	}

	const calculateCurrentStatus = orderDate => {
		const now = new Date()
		const orderTime = sqliteDateToLocal(orderDate)
		const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60))

		if (diffInMinutes >= statusTimings.completed) return 'completed'
		if (diffInMinutes >= statusTimings.delivering) return 'delivering'
		if (diffInMinutes >= statusTimings.cooking) return 'cooking'
		if (diffInMinutes >= statusTimings.processing) return 'processing'

		return 'processing'
	}

	const calculateProgress = orderDate => {
		const now = new Date()
		const orderTime = sqliteDateToLocal(orderDate)
		const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60))

		const totalTime = statusTimings.completed
		const progress = Math.min((diffInMinutes / totalTime) * 100, 100)

		return Math.floor(progress)
	}

	const getCurrentStep = orderDate => {
		const now = new Date()
		const orderTime = sqliteDateToLocal(orderDate)
		const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60))

		if (diffInMinutes >= statusTimings.completed) return 4
		if (diffInMinutes >= statusTimings.delivering) return 3
		if (diffInMinutes >= statusTimings.cooking) return 2
		if (diffInMinutes >= statusTimings.processing) return 1

		return 0
	}

	const fetchUserData = async () => {
		try {
			const userData = await userAPI.getUser(currentUser.id)
			setUser(userData)
			setFormData({
				name: userData.name || '',
				email: userData.email || '',
				address: userData.address || '',
			})
		} catch (error) {
			console.error('Ошибка загрузки данных пользователя:', error)
		} finally {
			setLoading(false)
		}
	}

	const fetchUserOrders = async () => {
		try {
			const ordersData = await orderAPI.getUserOrders(currentUser.id)

			const ordersWithCalculatedStatus = ordersData.map(order => {
				const calculatedStatus = calculateCurrentStatus(order.date)
				const progress = calculateProgress(order.date)
				const currentStep = getCurrentStep(order.date)
				const isActive =
					calculatedStatus !== 'completed' && calculatedStatus !== 'cancelled'

				return {
					...order,
					calculatedStatus,
					progress,
					currentStep,
					isActive,
				}
			})

			setOrders(ordersWithCalculatedStatus)
		} catch (error) {
			console.error('Ошибка загрузки заказов:', error)
		}
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setOrders(prevOrders =>
				prevOrders.map(order => ({
					...order,
					calculatedStatus: calculateCurrentStatus(order.date),
					progress: calculateProgress(order.date),
					currentStep: getCurrentStep(order.date),
					isActive:
						calculateCurrentStatus(order.date) !== 'completed' &&
						calculateCurrentStatus(order.date) !== 'cancelled',
				}))
			)
		}, 60000)

		return () => clearInterval(interval)
	}, [])

	const handleEditToggle = () => {
		setEditing(!editing)
	}

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSave = async () => {
		try {
			const updatedUser = await userAPI.updateUser(currentUser.id, formData)
			setUser(updatedUser)
			fetchUserOrders()

			if (onUserUpdate) {
				onUserUpdate(updatedUser)
			}

			setEditing(false)
			alert('Данные успешно обновлены!')
		} catch (error) {
			console.error('Ошибка обновления данных:', error)
			alert('Ошибка при обновлении данных')
		}
	}

	const formatDate = dateString => {
		const date = sqliteDateToLocal(dateString) // ИСПОЛЬЗУЕМ КОРРЕКЦИЮ ЧАСОВОГО ПОЯСА
		return date.toLocaleDateString('ru-RU', {
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
			delivering: 'Доставляется',
			completed: 'Завершен',
			cancelled: 'Отменен',
		}
		return statusMap[status] || status
	}

	const getStatusColor = status => {
		switch (status) {
			case 'processing':
				return { background: '#fff3cd', color: '#856404' }
			case 'cooking':
				return { background: '#cce7ff', color: '#004085' }
			case 'delivering':
				return { background: '#d4edda', color: '#155724' }
			case 'completed':
				return { background: '#d1e7dd', color: '#0f5132' }
			case 'cancelled':
				return { background: '#f8d7da', color: '#721c24' }
			default:
				return { background: '#e2e3e5', color: '#383d41' }
		}
	}

	const getTimePassed = orderDate => {
		const now = new Date()
		const orderTime = sqliteDateToLocal(orderDate)
		const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60))

		if (diffInMinutes < 1) return 'только что'
		if (diffInMinutes === 1) return '1 минуту назад'
		if (diffInMinutes < 5) return `${diffInMinutes} минуты назад`
		if (diffInMinutes < 60) return `${diffInMinutes} минут назад`

		const diffInHours = Math.floor(diffInMinutes / 60)
		if (diffInHours === 1) return '1 час назад'
		if (diffInHours < 5) return `${diffInHours} часа назад`
		return `${diffInHours} часов назад`
	}

	if (loading) {
		return <div className={styles.loading}>Загрузка профиля...</div>
	}

	if (!user) {
		return <div className={styles.errorMessage}>Пользователь не найден</div>
	}

	const sortedOrders = [...orders].sort((a, b) => {
		if (a.isActive && !b.isActive) return -1
		if (!a.isActive && b.isActive) return 1
		return new Date(b.date) - new Date(a.date)
	})

	return (
		<div className={styles.profilePage}>
			<div className={styles.container}>
				<h1 className={styles.title}>Мой профиль</h1>

				<div className={styles.profileContent}>
					<div className={styles.profileInfo}>
						<h2>Личная информация</h2>

						{!editing ? (
							<div className={styles.infoDisplay}>
								<div className={styles.infoItem}>
									<strong>Телефон:</strong>
									<span>{user.phone}</span>
								</div>
								<div className={styles.infoItem}>
									<strong>Имя:</strong>
									<span>{user.name || 'Не указано'}</span>
								</div>
								<div className={styles.infoItem}>
									<strong>Email:</strong>
									<span>{user.email || 'Не указан'}</span>
								</div>
								<div className={styles.infoItem}>
									<strong>Адрес:</strong>
									<span>{user.address || 'Не указан'}</span>
								</div>
								<button
									className={styles.editBtn}
									onClick={() => setEditing(true)}
								>
									Редактировать профиль
								</button>
							</div>
						) : (
							<div className={styles.infoEdit}>
								<div className={styles.formGroup}>
									<label>Имя:</label>
									<input
										type='text'
										name='name'
										value={formData.name}
										onChange={handleInputChange}
										placeholder='Введите ваше имя'
									/>
								</div>
								<div className={styles.formGroup}>
									<label>Email:</label>
									<input
										type='email'
										name='email'
										value={formData.email}
										onChange={handleInputChange}
										placeholder='Введите ваш email'
									/>
								</div>
								<div className={styles.formGroup}>
									<label>Адрес:</label>
									<input
										type='text'
										name='address'
										value={formData.address}
										onChange={handleInputChange}
										placeholder='Введите ваш адрес'
									/>
								</div>
								<div className={styles.editActions}>
									<button className={styles.saveBtn} onClick={handleSave}>
										Сохранить
									</button>
									<button
										className={styles.cancelBtn}
										onClick={() => setEditing(false)}
									>
										Отмена
									</button>
								</div>
							</div>
						)}
					</div>

					<div className={styles.ordersHistory}>
						<h2>История заказов</h2>

						{sortedOrders.length === 0 ? (
							<div className={styles.noOrders}>
								<p>У вас еще нет заказов</p>
							</div>
						) : (
							<div className={styles.ordersList}>
								{sortedOrders.map(order => {
									const statusColors = getStatusColor(order.calculatedStatus)

									return (
										<div key={order.id} className={styles.orderItem}>
											<div className={styles.orderHeader}>
												<div className={styles.orderInfo}>
													<span className={styles.orderNumber}>
														Заказ #{order.orderNumber}
													</span>
													<span className={styles.orderDate}>
														{formatDate(order.date)}
													</span>
													<span className={styles.orderTime}>
														{getTimePassed(order.date)}
													</span>
												</div>
												<span
													className={styles.orderStatus}
													style={{
														backgroundColor: statusColors.background,
														color: statusColors.color,
													}}
												>
													{getStatusText(order.calculatedStatus)}
												</span>
											</div>

											{order.isActive && (
												<div className={styles.progressContainer}>
													<div className={styles.progressBar}>
														<div
															className={styles.progressFill}
															style={{ width: `${order.progress}%` }}
														></div>
													</div>
													<div className={styles.progressSteps}>
														<span
															className={
																order.currentStep >= 1 ? styles.active : ''
															}
														>
															Обработка
														</span>
														<span
															className={
																order.currentStep >= 2 ? styles.active : ''
															}
														>
															Приготовление
														</span>
														<span
															className={
																order.currentStep >= 3 ? styles.active : ''
															}
														>
															Доставка
														</span>
														<span
															className={
																order.currentStep >= 4 ? styles.active : ''
															}
														>
															Завершен
														</span>
													</div>
													<div className={styles.progressText}>
														Прогресс: {order.progress}%
													</div>
												</div>
											)}

											<div className={styles.orderDetails}>
												<div className={styles.orderRow}>
													<span className={styles.orderLabel}>Тип:</span>
													<span className={styles.orderValue}>
														{order.type === 'delivery'
															? 'Доставка'
															: 'Самовывоз'}
													</span>
												</div>
												<div className={styles.orderRow}>
													<span className={styles.orderLabel}>Сумма:</span>
													<span className={styles.orderValue}>
														{order.total} ₽
													</span>
												</div>
												<div className={styles.orderRow}>
													<span className={styles.orderLabel}>Товары:</span>
													<span className={styles.orderValue}>
														{order.items &&
															order.items.map((item, index) => (
																<span
																	key={index}
																	className={styles.orderProduct}
																>
																	{item.name} ({item.quantity} шт)
																	{index < order.items.length - 1 ? ', ' : ''}
																</span>
															))}
													</span>
												</div>

												{order.deliveryData && order.type === 'delivery' && (
													<div className={styles.orderRow}>
														<span className={styles.orderLabel}>
															Адрес доставки:
														</span>
														<span className={styles.orderValue}>
															{order.deliveryData.address}
															{order.deliveryData.comment && (
																<div className={styles.comment}>
																	Комментарий: {order.deliveryData.comment}
																</div>
															)}
														</span>
													</div>
												)}

												{order.pickupPoint && order.type === 'pickup' && (
													<div className={styles.orderRow}>
														<span className={styles.orderLabel}>
															Пункт выдачи:
														</span>
														<span className={styles.orderValue}>
															{order.pickupPoint.address}
															{order.pickupPoint.workingHours && (
																<div className={styles.workingHours}>
																	Часы работы: {order.pickupPoint.workingHours}
																</div>
															)}
														</span>
													</div>
												)}
											</div>
										</div>
									)
								})}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProfilePage
