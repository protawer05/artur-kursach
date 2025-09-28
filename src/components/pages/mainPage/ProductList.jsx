import React, { useState } from 'react'
import ProductCard from './ProductCard'
import ProductFilter from './ProductFilter'
import styles from './productList.module.scss'

const ProductList = ({ onAddToCart }) => {
	const initialProducts = [
		{
			id: 1,
			name: 'Спринг роллы',
			price: 280,
			category: 'закуски',
			thumbnail:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnD4Z-qc0M2axIeXHmvxMhWXnGkANnRvqTmA&s',
		},
		{
			id: 2,
			name: 'Салат с папайей',
			price: 260,
			category: 'салаты',
			thumbnail:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY8-RhiuKOXPECJTbZuE_YRYeG67ioexOL9w&s',
		},
		{
			id: 3,
			name: 'Сет роллов',
			price: 720,
			category: 'сеты',
			thumbnail:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA1Z1QYIA9ddG2y9CahvPJLm1y8CRpkLP-NA&s',
		},
		{
			id: 4,
			name: 'Набор для компании',
			price: 1200,
			category: 'наборы',
			thumbnail:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDcyCIwcKerOU75FJH4ep4eWayr-TJ03QLxA&s',
		},
		{
			id: 5,
			name: 'Мини-сет закусок',
			price: 540,
			category: 'сеты',
			thumbnail:
				'https://deliveryfood.ru/pageimage/mini-zakuski-dlya-fursheta-foto.webp',
		},
	]

	const [products] = useState(initialProducts)
	const [activeFilter, setActiveFilter] = useState('все')

	const filters = ['все', 'наборы', 'сеты', 'закуски', 'салаты']

	const filteredProducts =
		activeFilter === 'все'
			? products
			: products.filter(product => product.category === activeFilter)

	const handleAddToCart = (product, quantity) => {
		if (onAddToCart) {
			onAddToCart(product, quantity)
		}
	}

	return (
		<div className={styles.container}>
			<ProductFilter
				filters={filters}
				activeFilter={activeFilter}
				onFilterChange={setActiveFilter}
			/>

			<div className={styles.productsGrid}>
				{filteredProducts.map(product => (
					<ProductCard
						key={product.id}
						product={product}
						onAddToCart={handleAddToCart}
					/>
				))}
			</div>
		</div>
	)
}

export default ProductList
