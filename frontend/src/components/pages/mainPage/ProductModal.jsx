import React, { useState } from 'react'
import s from './productModal.module.scss'

const ProductModal = ({ product, onClose, onAddToCart }) => {
	const [quantity, setQuantity] = useState(1)

	const handleIncrement = () => setQuantity(prev => prev + 1)
	const handleDecrement = () => quantity > 1 && setQuantity(prev => prev - 1)

	const handleAddToCart = () => {
		onAddToCart(product, quantity)
	}

	const handleBackdropClick = e => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	return (
		<div className={s.modalOverlay} onClick={handleBackdropClick}>
			<div className={s.modalContent}>
				<button className={s.closeButton} onClick={onClose}>
					×
				</button>

				<div className={s.modalBody}>
					<div className={s.productImage}>
						<img src={product.thumbnail} alt={product.name} />
					</div>

					<div className={s.productInfo}>
						<h2 className={s.productName}>{product.name}</h2>
						<p className={s.productDescription}>{product.description}</p>

						<div className={s.productDetails}>
							{product.weight && (
								<div className={s.detailItem}>
									<span className={s.detailLabel}>Вес:</span>
									<span className={s.detailValue}>{product.weight}</span>
								</div>
							)}

							{product.volume && (
								<div className={s.detailItem}>
									<span className={s.detailLabel}>Объем:</span>
									<span className={s.detailValue}>{product.volume}</span>
								</div>
							)}

							{product.cookingTime && (
								<div className={s.detailItem}>
									<span className={s.detailLabel}>Время приготовления:</span>
									<span className={s.detailValue}>{product.cookingTime}</span>
								</div>
							)}
						</div>

						{product.ingredients && (
							<div className={s.ingredients}>
								<h3>Состав:</h3>
								<div className={s.ingredientsList}>
									{product.ingredients.map((ingredient, index) => (
										<span key={index} className={s.ingredientTag}>
											{ingredient}
										</span>
									))}
								</div>
							</div>
						)}

						<div className={s.priceSection}>
							<span className={s.price}>{product.price} руб</span>
						</div>

						<div className={s.actions}>
							<div className={s.quantityControls}>
								<button
									className={s.quantityBtn}
									onClick={handleDecrement}
									disabled={quantity <= 1}
								>
									-
								</button>
								<span className={s.quantity}>{quantity} шт</span>
								<button className={s.quantityBtn} onClick={handleIncrement}>
									+
								</button>
							</div>

							<button className={s.addToCartBtn} onClick={handleAddToCart}>
								Добавить в корзину за {product.price * quantity} руб
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductModal
