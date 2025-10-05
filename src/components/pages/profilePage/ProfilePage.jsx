import { useState, useEffect } from 'react'
import s from './profilePage.module.scss'

const ProfilePage = ({ currentUser, onUserUpdate }) => {
	const [userData, setUserData] = useState(currentUser)
	const [orders, setOrders] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isEditing, setIsEditing] = useState(false)

	const statusTimings = {
		processing: 1,
		cooking: 2,
		delivering: 3,
		delivered: 4,
	}

	useEffect(() => {
		if (currentUser) {
			setUserData(currentUser)
			fetchOrders()
		}
		// eslint-disable-next-line
	}, [currentUser])

	const getCurrentStatus = orderDate => {
		const now = new Date()
		const orderTime = new Date(orderDate)
		const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60))

		if (diffInMinutes >= statusTimings.delivered) return 'delivered'
		if (diffInMinutes >= statusTimings.delivering) return 'delivering'
		if (diffInMinutes >= statusTimings.cooking) return 'cooking'
		if (diffInMinutes >= statusTimings.processing) return 'processing'

		return 'processing'
	}

	const getProgressPercentage = orderDate => {
		const now = new Date()
		const orderTime = new Date(orderDate)
		const diffInMinutes = Math.floor((now - orderTime) / (1000 * 60))

		const totalStages = Object.keys(statusTimings).length
		const currentStage = Math.min(diffInMinutes + 1, totalStages)

		return (currentStage / totalStages) * 100
	}

	const fetchOrders = async () => {
		try {
			const response = await fetch(
				`https://68d662abc2a1754b426a8851.mockapi.io/orders?userId=${currentUser.id}`
			)
			if (!response.ok) throw new Error('Orders not found')
			const data = await response.json()

			const ordersWithCalculatedStatus = Array.isArray(data)
				? data.map(order => ({
						...order,
						calculatedStatus: getCurrentStatus(order.date),
						progress: getProgressPercentage(order.date),
				  }))
				: []

			setOrders(ordersWithCalculatedStatus)
		} catch (error) {
			console.error('Ошибка загрузки заказов:', error)
			setOrders([])
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setOrders(prevOrders =>
				prevOrders.map(order => ({
					...order,
					calculatedStatus: getCurrentStatus(order.date),
					progress: getProgressPercentage(order.date),
				}))
			)
		}, 60000)

		return () => clearInterval(interval)
		// eslint-disable-next-line
	}, [])

	const handleSave = async () => {
		try {
			const response = await fetch(
				`https://68d662abc2a1754b426a8851.mockapi.io/users/${currentUser.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						...userData,
						updatedAt: new Date().toISOString(),
					}),
				}
			)

			if (response.ok) {
				const updatedUser = await response.json()
				onUserUpdate(updatedUser)
				setIsEditing(false)
				alert('Данные успешно сохранены!')
			} else {
				throw new Error('Failed to save')
			}
		} catch (error) {
			console.error('Ошибка сохранения данных:', error)
			onUserUpdate(userData)
			setIsEditing(false)
			alert('Данные сохранены локально')
		}
	}

	const handleInputChange = e => {
		setUserData({
			...userData,
			[e.target.name]: e.target.value,
		})
	}

	const getStatusText = status => {
		switch (status) {
			case 'processing':
				return 'В обработке'
			case 'cooking':
				return 'Готовится'
			case 'delivering':
				return 'Доставляется'
			case 'delivered':
				return 'Доставлен'
			case 'completed':
				return 'Выполнен'
			default:
				return status
		}
	}

	const getStatusColor = status => {
		switch (status) {
			case 'processing':
				return '#fff3cd'
			case 'cooking':
				return '#d1ecf1'
			case 'delivering':
				return '#cce7ff'
			case 'delivered':
				return '#d4edda'
			case 'completed':
				return '#d4edda'
			default:
				return '#e9ecef'
		}
	}

	const getStatusTextColor = status => {
		switch (status) {
			case 'processing':
				return '#856404'
			case 'cooking':
				return '#0c5460'
			case 'delivering':
				return '#004085'
			case 'delivered':
				return '#155724'
			case 'completed':
				return '#155724'
			default:
				return '#495057'
		}
	}

	const formatDate = dateString => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const getTimePassed = orderDate => {
		const now = new Date()
		const orderTime = new Date(orderDate)
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

	// Функция для безопасного отображения pickupPoint
	const renderPickupPoint = pickupPoint => {
		if (!pickupPoint) return null

		if (typeof pickupPoint === 'string') {
			return pickupPoint
		}

		if (typeof pickupPoint === 'object') {
			return (
				pickupPoint.name || pickupPoint.address || JSON.stringify(pickupPoint)
			)
		}

		return String(pickupPoint)
	}

	const sortedOrders = [...orders].sort((a, b) => {
		const aIsActive =
			a.calculatedStatus !== 'delivered' && a.calculatedStatus !== 'completed'
		const bIsActive =
			b.calculatedStatus !== 'delivered' && b.calculatedStatus !== 'completed'

		if (aIsActive && !bIsActive) return -1
		if (!aIsActive && bIsActive) return 1

		return new Date(b.date) - new Date(a.date)
	})

	if (isLoading) {
		return <div className={s.loading}>Загрузка...</div>
	}

	return (
		<div className={s.profilePage}>
			<div className={s.container}>
				<h1 className={s.title}>Мой профиль</h1>

				<div className={s.profileContent}>
					<div className={s.profileInfo}>
						<h2>Личная информация</h2>

						{!isEditing ? (
							<div className={s.infoDisplay}>
								<div className={s.infoItem}>
									<strong>Имя:</strong> {userData.name || 'Не указано'}
								</div>
								<div className={s.infoItem}>
									<strong>Email:</strong> {userData.email || 'Не указан'}
								</div>
								<div className={s.infoItem}>
									<strong>Телефон:</strong> {userData.phone}
								</div>
								<div className={s.infoItem}>
									<strong>Адрес:</strong> {userData.address || 'Не указан'}
								</div>
								<button
									className={s.editBtn}
									onClick={() => setIsEditing(true)}
								>
									Редактировать
								</button>
							</div>
						) : (
							<div className={s.infoEdit}>
								<div className={s.formGroup}>
									<label>Имя:</label>
									<input
										type='text'
										name='name'
										value={userData.name || ''}
										onChange={handleInputChange}
										placeholder='Введите ваше имя'
									/>
								</div>
								<div className={s.formGroup}>
									<label>Email:</label>
									<input
										type='email'
										name='email'
										value={userData.email || ''}
										onChange={handleInputChange}
										placeholder='Введите ваш email'
									/>
								</div>
								<div className={s.formGroup}>
									<label>Телефон:</label>
									<input
										type='tel'
										name='phone'
										value={userData.phone}
										onChange={handleInputChange}
										disabled
									/>
									<small>Телефон нельзя изменить</small>
								</div>
								<div className={s.formGroup}>
									<label>Адрес:</label>
									<input
										type='text'
										name='address'
										value={userData.address || ''}
										onChange={handleInputChange}
										placeholder='Введите ваш адрес'
									/>
								</div>
								<div className={s.editActions}>
									<button className={s.saveBtn} onClick={handleSave}>
										Сохранить
									</button>
									<button
										className={s.cancelBtn}
										onClick={() => setIsEditing(false)}
									>
										Отмена
									</button>
								</div>
							</div>
						)}
					</div>

					<div className={s.ordersHistory}>
						<h2>История заказов</h2>
						{sortedOrders.length === 0 ? (
							<p className={s.noOrders}>У вас пока нет заказов</p>
						) : (
							<div className={s.ordersList}>
								{sortedOrders.map(order => (
									<div key={order.id} className={s.orderItem}>
										<div className={s.orderHeader}>
											<div className={s.orderInfo}>
												<span className={s.orderNumber}>
													Заказ {order.orderNumber}
												</span>
												<span className={s.orderDate}>
													{formatDate(order.date)} • {getTimePassed(order.date)}
												</span>
											</div>
											<span
												className={s.orderStatus}
												style={{
													backgroundColor: getStatusColor(
														order.calculatedStatus
													),
													color: getStatusTextColor(order.calculatedStatus),
												}}
											>
												{getStatusText(order.calculatedStatus)}
											</span>
										</div>

										{(order.calculatedStatus === 'processing' ||
											order.calculatedStatus === 'cooking' ||
											order.calculatedStatus === 'delivering') && (
											<div className={s.progressContainer}>
												<div className={s.progressBar}>
													<div
														className={s.progressFill}
														style={{ width: `${order.progress}%` }}
													></div>
												</div>
												<div className={s.progressSteps}>
													<span
														className={
															order.calculatedStatus === 'processing'
																? s.active
																: ''
														}
													>
														Обработка
													</span>
													<span
														className={
															order.calculatedStatus === 'cooking'
																? s.active
																: ''
														}
													>
														Приготовление
													</span>
													<span
														className={
															order.calculatedStatus === 'delivering'
																? s.active
																: ''
														}
													>
														Доставка
													</span>
													<span
														className={
															order.calculatedStatus === 'delivered'
																? s.active
																: ''
														}
													>
														Завершен
													</span>
												</div>
											</div>
										)}

										<div className={s.orderDetails}>
											<div className={s.orderType}>
												<strong>Тип:</strong>{' '}
												{order.type === 'delivery' ? 'Доставка' : 'Самовывоз'}
											</div>
											<div className={s.orderTotal}>
												<strong>Сумма:</strong> {order.total} руб
											</div>
											<div className={s.orderItems}>
												<strong>Товары:</strong>{' '}
												{order.items
													.map(item => `${item.name} (${item.quantity} шт)`)
													.join(', ')}
											</div>

											{order.deliveryAddress && (
												<div className={s.orderAddress}>
													<strong>Адрес доставки:</strong>{' '}
													{order.deliveryAddress}
												</div>
											)}

											{order.pickupPoint && (
												<div className={s.orderPickup}>
													<strong>Точка самовывоза:</strong>{' '}
													{renderPickupPoint(order.pickupPoint)}
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProfilePage
