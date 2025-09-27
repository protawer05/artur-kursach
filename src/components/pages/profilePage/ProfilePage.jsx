import React, { useState, useEffect } from 'react'
import s from './profilePage.module.scss'

const ProfilePage = ({ currentUser, onUserUpdate }) => {
	const [userData, setUserData] = useState(currentUser)
	const [orders, setOrders] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isEditing, setIsEditing] = useState(false)

	useEffect(() => {
		if (currentUser) {
			setUserData(currentUser)
			fetchOrders()
		}
	}, [currentUser])

	const fetchOrders = async () => {
		try {
			const response = await fetch(
				`https://68d662abc2a1754b426a8851.mockapi.io/orders?userId=${currentUser.id}`
			)
			if (!response.ok) throw new Error('Orders not found')
			const data = await response.json()
			setOrders(Array.isArray(data) ? data : [])
		} catch (error) {
			console.error('Ошибка загрузки заказов:', error)
			setOrders([])
		} finally {
			setIsLoading(false)
		}
	}

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
			// Локальное сохранение
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
			case 'completed':
				return 'Выполнен'
			case 'delivered':
				return 'Доставлен'
			case 'processing':
				return 'В обработке'
			case 'cooking':
				return 'Готовится'
			case 'confirmed':
				return 'В обработке'
			default:
				return status
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
						{orders.length === 0 ? (
							<p className={s.noOrders}>У вас пока нет заказов</p>
						) : (
							<div className={s.ordersList}>
								{orders.map(order => (
									<div key={order.id} className={s.orderItem}>
										<div className={s.orderHeader}>
											<span className={s.orderDate}>
												Заказ от {formatDate(order.date)}
											</span>
											<span className={`${s.orderStatus} ${s[order.status]}`}>
												{getStatusText(order.status)}
											</span>
										</div>
										<div className={s.orderDetails}>
											<div className={s.orderTotal}>
												Сумма: <strong>{order.total} руб</strong>
											</div>
											<div className={s.orderItems}>
												Товары:{' '}
												{order.items
													.map(item => `${item.name} (${item.quantity} шт)`)
													.join(', ')}
											</div>
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
