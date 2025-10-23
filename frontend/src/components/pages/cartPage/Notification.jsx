import React from 'react'
import s from './notification.module.scss'

const Notification = ({ show, message, type, onClose }) => {
	if (!show) return null

	return (
		<div className={`${s.notification} ${s[type]}`}>
			<div className={s.content}>
				<span className={s.message}>{message}</span>
				<button className={s.closeBtn} onClick={onClose}>
					×
				</button>
			</div>
		</div>
	)
}

export default Notification
