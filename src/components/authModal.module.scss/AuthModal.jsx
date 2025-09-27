import React, { useState } from 'react'
import s from './authModal.module.scss'

const AuthModal = ({ onClose, onLogin }) => {
	const [phone, setPhone] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async e => {
		e.preventDefault()

		if (!phone.trim()) {
			alert('Введите номер телефона')
			return
		}

		setIsLoading(true)

		try {
			// Проверяем, есть ли пользователь с таким номером
			const response = await fetch(
				'https://68d662abc2a1754b426a8851.mockapi.io/users'
			)
			const users = await response.json()

			let user = users.find(u => u.phone === phone)

			if (!user) {
				// Создаем нового пользователя
				const newUser = {
					phone: phone,
					name: 'Новый пользователь',
					email: '',
					address: '',
					createdAt: new Date().toISOString(),
				}

				const createResponse = await fetch(
					'https://68d662abc2a1754b426a8851.mockapi.io/users',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(newUser),
					}
				)

				user = await createResponse.json()
			}

			// Сохраняем пользователя в localStorage
			localStorage.setItem('currentUser', JSON.stringify(user))
			onLogin(user)
		} catch (error) {
			console.error('Ошибка авторизации:', error)
			alert('Ошибка при авторизации. Попробуйте еще раз.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className={s.modalOverlay} onClick={onClose}>
			<div className={s.modalContent} onClick={e => e.stopPropagation()}>
				<div className={s.modalHeader}>
					<h2>Вход в аккаунт</h2>
					<button className={s.closeBtn} onClick={onClose}>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className={s.authForm}>
					<div className={s.formGroup}>
						<label>Номер телефона</label>
						<input
							type='tel'
							placeholder='+7 (999) 999-99-99'
							value={phone}
							onChange={e => setPhone(e.target.value)}
							required
						/>
					</div>

					<p className={s.authInfo}>
						Введите ваш номер телефона. Если вы новый пользователь, мы
						автоматически создадим для вас аккаунт.
					</p>

					<button type='submit' className={s.submitBtn} disabled={isLoading}>
						{isLoading ? 'Вход...' : 'Войти'}
					</button>
				</form>
			</div>
		</div>
	)
}

export default AuthModal
