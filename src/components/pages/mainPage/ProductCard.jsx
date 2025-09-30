import React, { useState } from 'react'
import styles from './productCard.module.scss'

const ProductCard = ({ product, onAddToCart, onProductClick }) => {
	const [quantity, setQuantity] = useState(1)

	const handleIncrement = () => setQuantity(prev => prev + 1)
	const handleDecrement = () => quantity > 1 && setQuantity(prev => prev - 1)

	const handleAddToCart = e => {
		e.stopPropagation()
		onAddToCart(product, quantity)
		setQuantity(1)
	}

	const handleCardClick = () => {
		if (onProductClick) {
			onProductClick(product)
		}
	}

	return (
		<div className={styles.card} onClick={handleCardClick}>
			<div className={styles.imageContainer}>
				<img
					src={product.thumbnail}
					alt={product.name}
					className={styles.thumbnail}
				/>
			</div>

			<div className={styles.cardHeader}>
				<h3 className={styles.productName}>{product.name}</h3>
				<span className={styles.price}>{product.price} руб</span>
			</div>

			<div className={styles.quantityControls}>
				<button
					className={styles.quantityBtn}
					onClick={e => {
						e.stopPropagation()
						handleDecrement()
					}}
					disabled={quantity <= 1}
				>
					-
				</button>
				<span className={styles.quantity}>{quantity} шт</span>
				<button
					className={styles.quantityBtn}
					onClick={e => {
						e.stopPropagation()
						handleIncrement()
					}}
				>
					+
				</button>
			</div>

			<button className={styles.addToCartBtn} onClick={handleAddToCart}>
				В корзину
			</button>

			<div className={styles.total}>
				<span>{quantity} шт</span>
				<span>{product.price * quantity} руб</span>
			</div>
		</div>
	)
}

export default ProductCard
