import React, { useState, useEffect } from 'react'
import s from './deliveryModal.module.scss'

const DeliveryModal = ({ onOrder, onClose }) => {
	const [formData, setFormData] = useState({
		street: '',
		house: '',
		entrance: '',
		apartment: '',
		doorCode: '',
		floor: '',
		phone: '',
		comment: '',
	})

	const handleInputChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}
	useEffect(() => {
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [])
	const handleSubmit = e => {
		e.preventDefault()
		onOrder(formData)
	}

	return (
		<div className={s.modalOverlay} onClick={onClose}>
			<div className={s.modalContent} onClick={e => e.stopPropagation()}>
				<div className={s.modalHeader}>
					<h2>Адрес доставки</h2>
					<button className={s.closeBtn} onClick={onClose}>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className={s.deliveryForm}>
					<div className={s.addressSection}>
						<h3>Адрес</h3>
						<div className={s.formRow}>
							<div className={s.formGroup}>
								<label>Улица</label>
								<input
									type='text'
									name='street'
									value={formData.street}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className={s.formGroup}>
								<label>Дом</label>
								<input
									type='text'
									name='house'
									value={formData.house}
									onChange={handleInputChange}
									required
								/>
							</div>
						</div>

						<div className={s.formRow}>
							<div className={s.formGroup}>
								<label>Подъезд</label>
								<input
									type='text'
									name='entrance'
									value={formData.entrance}
									onChange={handleInputChange}
								/>
							</div>
							<div className={s.formGroup}>
								<label>Квартира</label>
								<input
									type='text'
									name='apartment'
									value={formData.apartment}
									onChange={handleInputChange}
									required
								/>
							</div>
						</div>

						<div className={s.formRow}>
							<div className={s.formGroup}>
								<label>Код двери</label>
								<input
									type='text'
									name='doorCode'
									value={formData.doorCode}
									onChange={handleInputChange}
								/>
							</div>
							<div className={s.formGroup}>
								<label>Этаж</label>
								<input
									type='text'
									name='floor'
									value={formData.floor}
									onChange={handleInputChange}
								/>
							</div>
						</div>
					</div>

					<div className={s.divider}></div>

					<div className={s.contactSection}>
						<h3>Укажите телефон, куда позвонить по готовности заказа</h3>

						<div className={s.formGroup}>
							<label>Телефон</label>
							<input
								type='tel'
								name='phone'
								value={formData.phone}
								onChange={handleInputChange}
								placeholder='Введите Ваш номер телефона'
								required
							/>
						</div>

						<div className={s.formGroup}>
							<label>Комментарий</label>
							<textarea
								name='comment'
								value={formData.comment}
								onChange={handleInputChange}
								placeholder='Оставьте Ваше сообщение'
								rows='3'
							/>
						</div>
					</div>

					<div className={s.modalFooter}>
						<button type='submit' className={s.orderBtn}>
							Оформить заказ
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default DeliveryModal
