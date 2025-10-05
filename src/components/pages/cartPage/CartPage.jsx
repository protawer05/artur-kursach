import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PickupModal from './PickupModal'
import DeliveryModal from './DeliveryModal'
import Notification from './Notification'
import s from './cartPage.module.scss'

const CartPage = ({
	cartItems = [],
	onUpdateQuantity,
	onRemoveItem,
	onClearCart,
	currentUser,
}) => {
	const [showPickupModal, setShowPickupModal] = useState(false)
	const [showDeliveryModal, setShowDeliveryModal] = useState(false)
	const [selectedPickupPoint, setSelectedPickupPoint] = useState(null)
	const [notification, setNotification] = useState({
		show: false,
		message: '',
		type: '',
	})

	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	)
	const total = subtotal

	const pickupPoints = [
		{
			id: 1,
			name: 'РЦ НЛО',
			address: 'ул. Якуба Коляса, 37',
			hours: 'Круглосуточно',
			deliveryTime: 'Суши - 15 мин, WOK - 15 мин',
		},
		{
			id: 2,
			name: 'Машерова',
			address: 'пр-т. Машерова, 78',
			hours: '10:00 - 23:00',
			deliveryTime: 'Суши - 15 мин, WOK - 15 мин',
		},
		{
			id: 3,
			name: 'ТЦ Глобо',
			address: 'ул. Уманская, 54',
			hours: '10:00 - 23:00',
			deliveryTime: 'Суши - 15 мин, WOK - 15 мин',
		},
		{
			id: 4,
			name: 'ТЦ Моио',
			address: 'пр. Партизанская, 150а',
			hours: '10:00 - 23:00',
			deliveryTime: 'Суши - 15 мин, WOK - 15 мин',
		},
		{
			id: 5,
			name: 'Притыцкого',
			address: 'ул. Притыцкого, 83',
			hours: '10:00 - 23:00',
			deliveryTime: 'Суши - 15 мин, WOK - 15 мин',
		},
		{
			id: 6,
			name: 'Налибокская',
			address: 'ул. Налибокская, 1',
			hours: '10:00 - 23:00',
			deliveryTime: 'Суши - 15 мин, WOK - 15 мин',
		},
		{
			id: 7,
			name: 'Шафарнянская',
			address: 'ул. Шафарнянская, 11',
			hours: '10:00 - 23:00',
			deliveryTime: 'Суши - 15 мин, WOK - 15 мин',
		},
	]

	const showNotification = (message, type = 'success') => {
		setNotification({ show: true, message, type })
		setTimeout(
			() => setNotification({ show: false, message: '', type: '' }),
			3000
		)
	}

	const handlePickupOrder = async pickupPoint => {
		try {
			if (!currentUser) {
				showNotification(
					'Для оформления заказа необходимо войти в аккаунт',
					'error'
				)
				return
			}

			// Исправлено: передаем только нужные данные, а не весь объект
			const orderData = {
				type: 'pickup',
				items: cartItems,
				pickupPoint: {
					name: pickupPoint.name,
					address: pickupPoint.address,
				}, // Передаем только строки, а не объект
				total,
				status: 'processing',
				date: new Date().toISOString(),
				userId: currentUser.id,
				userPhone: currentUser.phone,
				orderNumber: `ORD-${Date.now()}`,
			}

			const response = await fetch(
				'https://68d662abc2a1754b426a8851.mockapi.io/orders',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(orderData),
				}
			)

			if (response.ok) {
				showNotification(
					'Заказ оформлен успешно! Ожидайте смс с подтверждением.',
					'success'
				)
				onClearCart()
			} else {
				throw new Error('Ошибка при оформлении заказа')
			}
		} catch (error) {
			showNotification(
				'Ошибка при оформлении заказа. Попробуйте еще раз.',
				'error'
			)
		}

		setShowPickupModal(false)
	}

	const handleDeliveryOrder = async deliveryData => {
		try {
			if (!currentUser) {
				showNotification(
					'Для оформления заказа необходимо войти в аккаунт',
					'error'
				)
				return
			}

			const orderData = {
				type: 'delivery',
				items: cartItems,
				deliveryData: {
					street: deliveryData.street,
					house: deliveryData.house,
					entrance: deliveryData.entrance,
					apartment: deliveryData.apartment,
					phone: deliveryData.phone,
				}, // Передаем только нужные поля
				total,
				status: 'processing',
				date: new Date().toISOString(),
				userId: currentUser.id,
				userPhone: currentUser.phone,
				orderNumber: `ORD-${Date.now()}`,
			}

			const response = await fetch(
				'https://68d662abc2a1754b426a8851.mockapi.io/orders',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(orderData),
				}
			)

			if (response.ok) {
				showNotification(
					'Заказ оформлен успешно! Курьер свяжется с вами.',
					'success'
				)
				onClearCart()
			} else {
				throw new Error('Ошибка при оформлении заказа')
			}
		} catch (error) {
			showNotification(
				'Ошибка при оформлении заказа. Попробуйте еще раз.',
				'error'
			)
		}

		setShowDeliveryModal(false)
	}

	return (
		<div className={s.cartPage}>
			<div className={s.container}>
				<h1 className={s.title}>Корзина</h1>

				{cartItems.length === 0 ? (
					<div className={s.emptyCart}>
						<div className={s.emptyCartIcon}>🛒</div>
						<h2>Ваша корзина пуста</h2>
						<p>Добавьте товары из меню, чтобы сделать заказ</p>
						<Link to='/' className={s.continueShopping}>
							Перейти к меню
						</Link>
					</div>
				) : (
					<div className={s.cartContent}>
						<div className={s.itemsList}>
							{cartItems.map(item => (
								<div key={item.id} className={s.cartItem}>
									<div className={s.itemImage}>
										<img src={item.thumbnail} alt={item.name} />
									</div>

									<div className={s.itemInfo}>
										<h3 className={s.itemName}>{item.name}</h3>
										<div className={s.itemPrice}>{item.price} руб</div>
									</div>

									<div className={s.itemControls}>
										<div className={s.quantityControls}>
											<button
												className={s.quantityBtn}
												onClick={() =>
													onUpdateQuantity(item.id, item.quantity - 1)
												}
												disabled={item.quantity <= 1}
											>
												-
											</button>
											<span className={s.quantity}>{item.quantity} шт</span>
											<button
												className={s.quantityBtn}
												onClick={() =>
													onUpdateQuantity(item.id, item.quantity + 1)
												}
											>
												+
											</button>
										</div>

										<button
											className={s.removeBtn}
											onClick={() => onRemoveItem(item.id)}
										>
											Удалить
										</button>
									</div>
								</div>
							))}
						</div>

						<div className={s.orderSummary}>
							<div className={s.totalSection}>
								<div className={s.totalLine}>
									<span>Сумма заказа:</span>
									<span>{subtotal} руб</span>
								</div>

								<div className={s.finalTotal}>
									<span>Итого:</span>
									<span>{total} руб</span>
								</div>
							</div>

							{!currentUser && (
								<div className={s.authWarning}>
									<p>Для оформления заказа необходимо войти в аккаунт</p>
								</div>
							)}

							<div className={s.orderButtons}>
								<button
									className={s.pickupBtn}
									onClick={() => setShowPickupModal(true)}
									disabled={!currentUser}
								>
									Самовывоз
								</button>
								<button
									className={s.deliveryBtn}
									onClick={() => setShowDeliveryModal(true)}
									disabled={!currentUser}
								>
									Доставка
								</button>
							</div>

							<Link to='/' className={s.continueShopping}>
								← Вернуться к покупкам
							</Link>
						</div>
					</div>
				)}

				{showPickupModal && (
					<PickupModal
						pickupPoints={pickupPoints}
						selectedPoint={selectedPickupPoint}
						onSelectPoint={setSelectedPickupPoint}
						onOrder={handlePickupOrder}
						onClose={() => setShowPickupModal(false)}
					/>
				)}

				{showDeliveryModal && (
					<DeliveryModal
						onOrder={handleDeliveryOrder}
						onClose={() => setShowDeliveryModal(false)}
					/>
				)}

				<Notification
					show={notification.show}
					message={notification.message}
					type={notification.type}
					onClose={() =>
						setNotification({ show: false, message: '', type: '' })
					}
				/>
			</div>
		</div>
	)
}

export default CartPage
