import React, { useState } from 'react'
import { userAPI } from '../../services/api'
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
			// Форматируем номер телефона
			const formattedPhone = phone.replace(/\D/g, '')

			// Используем ваш API для логина
			const user = await userAPI.login(formattedPhone)

			// Сохраняем пользователя в localStorage
			localStorage.setItem('currentUser', JSON.stringify(user))
			onLogin(user)
			onClose()
		} catch (error) {
			console.error('Ошибка авторизации:', error)

			// Создаем локального пользователя при ошибке API
			const localUser = {
				id: Date.now().toString(),
				phone: phone.replace(/\D/g, ''),
				name: 'Новый пользователь',
				email: '',
				address: '',
				createdAt: new Date().toISOString(),
			}

			localStorage.setItem('currentUser', JSON.stringify(localUser))
			onLogin(localUser)
			onClose()
		} finally {
			setIsLoading(false)
		}
	}

	const formatPhone = value => {
		const numbers = value.replace(/\D/g, '')
		if (numbers.length <= 1) return numbers
		if (numbers.length <= 4) return `+7 (${numbers.slice(1, 4)}`
		if (numbers.length <= 7)
			return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}`
		if (numbers.length <= 9)
			return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(
				4,
				7
			)}-${numbers.slice(7, 9)}`
		return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(
			7,
			9
		)}-${numbers.slice(9, 11)}`
	}

	const handlePhoneChange = e => {
		const formatted = formatPhone(e.target.value)
		setPhone(formatted)
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
							onChange={handlePhoneChange}
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
