import React, { useState } from 'react'
import {
	YMaps,
	Map,
	Placemark,
	GeolocationControl,
	FullscreenControl,
} from 'react-yandex-maps'
import styles from './mapModal.module.scss'

const MapModal = ({ onClose, onOrder, type, currentUser }) => {
	const [selectedAddress, setSelectedAddress] = useState('')
	const [selectedPoint, setSelectedPoint] = useState(null)
	const [comment, setComment] = useState('')
	const [mapState, setMapState] = useState({
		center: type === 'pickup' ? [54.7351, 55.9587] : [54.7351, 55.9587],
		zoom: 11,
	})
	const [deliveryCoords, setDeliveryCoords] = useState(null)

	// Пункты самовывоза
	const pickupPoints = [
		{
			id: 1,
			name: 'ТЦ ЦЕНТРАЛЬНЫЙ',
			address: 'ул. Ленина, 65',
			coords: [54.7289, 55.9472],
			hours: '10:00 - 22:00',
		},
		{
			id: 2,
			name: 'ТЦ ГАЛЕРЕЯ АРТ',
			address: 'пр-т Октября, 31',
			coords: [54.7984, 56.0432],
			hours: '09:00 - 21:00',
		},
		{
			id: 3,
			name: 'ТЦ СЕМЬЯ',
			address: 'ул. Менделеева, 137',
			coords: [54.7843, 56.0847],
			hours: '10:00 - 22:00',
		},
		{
			id: 4,
			name: 'ТЦ ПЛАНЕТА',
			address: 'ул. Энтузиастов, 20',
			coords: [54.7431, 56.0084],
			hours: '09:00 - 23:00',
		},
		{
			id: 5,
			name: 'ТЦ УФА-МОЛЛ',
			address: 'ул. Рубежная, 174',
			coords: [54.8156, 56.0679],
			hours: '10:00 - 22:00',
		},
	]

	// Обработчик клика по карте для доставки
	const handleMapClick = async e => {
		if (type !== 'delivery') return

		const coords = e.get('coords')
		setDeliveryCoords(coords)
		setSelectedAddress('Определяем адрес...')

		// Используем прямое обращение к геокодеру API
		try {
			const response = await fetch(
				`https://geocode-maps.yandex.ru/v1/?apikey=7f70e535-61db-467e-ac09-3a2712982a31&geocode=${coords[1]},${coords[0]}&format=json`
			)

			const data = await response.json()

			if (data.response.GeoObjectCollection.featureMember.length > 0) {
				const address =
					data.response.GeoObjectCollection.featureMember[0].GeoObject.name
				setSelectedAddress(address)
			} else {
				setSelectedAddress('Адрес не определен')
			}
		} catch (error) {
			console.error('Ошибка геокодирования:', error)
			setSelectedAddress('Ошибка определения адреса')
		}
	}

	// Обработчик клика по пункту самовывоза
	const handlePickupPointClick = point => {
		setSelectedPoint(point)
		setSelectedAddress(`${point.name}, ${point.address}`)

		// Центрируем карту на выбранном пункте
		setMapState({
			center: point.coords,
			zoom: 15,
		})
	}

	const handleOrder = () => {
		if (!selectedAddress || selectedAddress === 'Определяем адрес...') {
			alert('Пожалуйста, выберите адрес или пункт выдачи')
			return
		}

		if (type === 'pickup') {
			onOrder({
				name: selectedPoint.name,
				address: selectedPoint.address,
				workingHours: selectedPoint.hours,
				coords: selectedPoint.coords,
			})
		} else {
			onOrder({
				address: selectedAddress,
				comment: comment,
				phone: currentUser.phone,
				coords: deliveryCoords,
			})
		}
	}

	return (
		<div className={styles.modalOverlay} onClick={onClose}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<div className={styles.modalHeader}>
					<h2>
						{type === 'pickup'
							? 'Выберите пункт самовывоза'
							: 'Выберите адрес доставки'}
					</h2>
					<button className={styles.closeBtn} onClick={onClose}>
						×
					</button>
				</div>

				<div className={styles.mapContainer}>
					<YMaps
						query={{
							apikey: '7f70e535-61db-467e-ac09-3a2712982a31',
							lang: 'ru_RU',
						}}
					>
						<Map
							state={mapState}
							width='100%'
							height='400px'
							onClick={handleMapClick}
							modules={['geolocation', 'placemark']}
						>
							{/* Контролы на карте */}
							<GeolocationControl options={{ float: 'left' }} />
							<FullscreenControl />

							{/* Маркеры пунктов самовывоза */}
							{type === 'pickup' &&
								pickupPoints.map(point => (
									<Placemark
										key={point.id}
										geometry={point.coords}
										properties={{
											balloonContent: `
                      <div>
                        <h3>${point.name}</h3>
                        <p>${point.address}</p>
                        <p><strong>Часы работы:</strong> ${point.hours}</p>
                        <p><strong>Время приготовления:</strong> 15-20 минут</p>
                      </div>
                    `,
										}}
										options={{
											preset: 'islands#icon',
											iconColor:
												selectedPoint?.id === point.id ? 'red' : 'blue',
										}}
										onClick={() => handlePickupPointClick(point)}
									/>
								))}

							{/* Маркер для доставки */}
							{type === 'delivery' && deliveryCoords && (
								<Placemark
									geometry={deliveryCoords}
									properties={{
										balloonContent: `
                      <div>
                        <h3>Адрес доставки</h3>
                        <p>${selectedAddress}</p>
                        ${
													comment
														? `<p><strong>Комментарий:</strong> ${comment}</p>`
														: ''
												}
                      </div>
                    `,
									}}
									options={{
										preset: 'islands#homeIcon',
										iconColor: 'green',
									}}
								/>
							)}
						</Map>
					</YMaps>
				</div>

				<div className={styles.addressSection}>
					<div className={styles.selectedAddress}>
						<strong>Выбранный {type === 'pickup' ? 'пункт' : 'адрес'}:</strong>
						<span>{selectedAddress || 'Не выбран'}</span>
					</div>

					{type === 'delivery' && (
						<div className={styles.commentSection}>
							<label>Комментарий для курьера:</label>
							<textarea
								value={comment}
								onChange={e => setComment(e.target.value)}
								placeholder='Например: код домофона, этаж и т.д.'
								rows='3'
							/>
						</div>
					)}

					{type === 'pickup' && selectedPoint && (
						<div className={styles.pointInfo}>
							<h4>Информация о пункте:</h4>
							<p>
								<strong>Адрес:</strong> {selectedPoint.address}
							</p>
							<p>
								<strong>Часы работы:</strong> {selectedPoint.hours}
							</p>
							<p>
								<strong>Время приготовления:</strong> 15-20 минут
							</p>
						</div>
					)}
				</div>

				<div className={styles.modalActions}>
					<button
						className={styles.orderBtn}
						onClick={handleOrder}
						disabled={
							!selectedAddress || selectedAddress === 'Определяем адрес...'
						}
					>
						{type === 'pickup' ? 'Забрать отсюда' : 'Заказать доставку'}
					</button>
					<button className={styles.cancelBtn} onClick={onClose}>
						Отмена
					</button>
				</div>
			</div>
		</div>
	)
}

export default MapModal
