import React, { useState, useEffect } from 'react'
import s from './pickupModal.module.scss'

const PickupModal = ({
	pickupPoints,
	selectedPoint,
	onSelectPoint,
	onOrder,
	onClose,
}) => {
	const [view, setView] = useState('list') // 'list' или 'map'
	const [selectedPointId, setSelectedPointId] = useState(
		selectedPoint?.id || null
	)

	const handleSelectPoint = point => {
		setSelectedPointId(point.id)
		onSelectPoint(point)
	}
	useEffect(() => {
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [])
	const handleOrder = () => {
		if (selectedPointId) {
			const point = pickupPoints.find(p => p.id === selectedPointId)
			onOrder(point)
		}
	}

	return (
		<div className={s.modalOverlay} onClick={onClose}>
			<div className={s.modalContent} onClick={e => e.stopPropagation()}>
				<div className={s.modalHeader}>
					<h2>Точки самовывоза</h2>
					<button className={s.closeBtn} onClick={onClose}>
						×
					</button>
				</div>

				<div className={s.viewToggle}>
					<button
						className={`${s.toggleBtn} ${view === 'list' ? s.active : ''}`}
						onClick={() => setView('list')}
					>
						Список
					</button>
					<button
						className={`${s.toggleBtn} ${view === 'map' ? s.active : ''}`}
						onClick={() => setView('map')}
					>
						Карта
					</button>
				</div>

				{selectedPointId && (
					<div className={s.selectedPoint}>
						<strong>Выбранная точка:</strong>
						<span>
							{pickupPoints.find(p => p.id === selectedPointId)?.address}
						</span>
					</div>
				)}

				<div className={s.divider}></div>

				<div className={s.pickupList}>
					{pickupPoints.map(point => (
						<div
							key={point.id}
							className={`${s.pickupPoint} ${
								selectedPointId === point.id ? s.selected : ''
							}`}
							onClick={() => handleSelectPoint(point)}
						>
							<div className={s.pointHeader}>
								<h3>{point.name}</h3>
								<div className={s.radio}>
									<input
										type='radio'
										name='pickupPoint'
										checked={selectedPointId === point.id}
										onChange={() => handleSelectPoint(point)}
									/>
								</div>
							</div>
							<p className={s.address}>{point.address}</p>
							<p className={s.hours}>Режим работы: {point.hours}</p>
							<p className={s.deliveryTime}>{point.deliveryTime}</p>
						</div>
					))}
				</div>

				<div className={s.modalFooter}>
					<button
						className={s.orderBtn}
						onClick={handleOrder}
						disabled={!selectedPointId}
					>
						Оформить заказ
					</button>
				</div>
			</div>
		</div>
	)
}

export default PickupModal
