import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import MapModal from '../../mapModal/MapModal'
import Notification from './Notification'
import { orderAPI } from '../../../services/api'
import s from './cartPage.module.scss'

const CartPage = ({
	cartItems = [],
	onUpdateQuantity,
	onRemoveItem,
	onClearCart,
	currentUser,
}) => {
	const [showMapModal, setShowMapModal] = useState(false) // ОДНО МОДАЛЬНОЕ ОКНО
	const [orderType, setOrderType] = useState(null) // 'pickup' или 'delivery'
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

			const orderData = {
				type: 'pickup',
				items: cartItems,
				pickupPoint: {
					name: pickupPoint.name,
					address: pickupPoint.address,
					workingHours: pickupPoint.workingHours,
				},
				total,
				userId: parseInt(currentUser.id),
				userPhone: currentUser.phone,
				orderNumber: `ORD-${Date.now()}`,
			}

			await orderAPI.createOrder(orderData)

			showNotification(
				'Заказ оформлен успешно! Ожидайте смс с подтверждением.',
				'success'
			)
			onClearCart()
			setShowMapModal(false)
		} catch (error) {
			console.error('Ошибка при оформлении заказа:', error)
			showNotification(
				'Ошибка при оформлении заказа. Попробуйте еще раз.',
				'error'
			)
		}
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
					address: deliveryData.address,
					comment: deliveryData.comment,
					phone: deliveryData.phone,
				},
				total,
				userId: parseInt(currentUser.id),
				userPhone: currentUser.phone,
				orderNumber: `ORD-${Date.now()}`,
			}

			await orderAPI.createOrder(orderData)

			showNotification(
				'Заказ оформлен успешно! Курьер свяжется с вами.',
				'success'
			)
			onClearCart()
			setShowMapModal(false)
		} catch (error) {
			console.error('Ошибка при оформлении заказа:', error)
			showNotification(
				'Ошибка при оформлении заказа. Попробуйте еще раз.',
				'error'
			)
		}
	}

	const handleOrderClick = type => {
		setOrderType(type)
		setShowMapModal(true)
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
									onClick={() => handleOrderClick('pickup')}
									disabled={!currentUser}
								>
									Самовывоз
								</button>
								<button
									className={s.deliveryBtn}
									onClick={() => handleOrderClick('delivery')}
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

				{/* ОДНО МОДАЛЬНОЕ ОКНО ДЛЯ ВСЕХ ТИПОВ ЗАКАЗА */}
				{showMapModal && (
					<MapModal
						type={orderType}
						onClose={() => setShowMapModal(false)}
						onOrder={
							orderType === 'pickup' ? handlePickupOrder : handleDeliveryOrder
						}
						currentUser={currentUser}
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
