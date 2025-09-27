import React, { useState } from 'react'
import ProductCard from './ProductCard'
import ProductFilter from './ProductFilter'
import styles from './productList.module.scss'

const ProductList = ({ onAddToCart }) => {
	const initialProducts = [
		{
			id: 1,
			name: 'Том Ям',
			price: 290,
			category: 'супы',
			thumbnail:
				'https://cs13.pikabu.ru/post_img/big/2023/03/20/9/1679327108295817795.jpg',
		},
		{
			id: 2,
			name: 'Пад Тай',
			price: 320,
			category: 'основные',
			thumbnail:
				'https://cs13.pikabu.ru/post_img/big/2023/03/20/9/1679327108295817795.jpg',
		},
		{
			id: 3,
			name: 'Том Кха',
			price: 310,
			category: 'супы',
			thumbnail:
				'https://cs13.pikabu.ru/post_img/big/2023/03/20/9/1679327108295817795.jpg',
		},
		{
			id: 4,
			name: 'Грин Карри',
			price: 350,
			category: 'карри',
			thumbnail:
				'https://cs13.pikabu.ru/post_img/big/2023/03/20/9/1679327108295817795.jpg',
		},
		{
			id: 5,
			name: 'Спринг Роллы',
			price: 280,
			category: 'закуски',
			thumbnail:
				'https://cs13.pikabu.ru/post_img/big/2023/03/20/9/1679327108295817795.jpg',
		},
	]

	const [products] = useState(initialProducts)
	const [activeFilter, setActiveFilter] = useState('все')

	const filters = ['все', 'супы', 'основные', 'карри', 'закуски']

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
