import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import ProductFilter from './ProductFilter'
import ProductModal from './ProductModal'
import styles from './productList.module.scss'

const ProductList = ({ onAddToCart, searchQuery }) => {
	const [products, setProducts] = useState([])
	const [filteredProducts, setFilteredProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [activeFilter, setActiveFilter] = useState('все')
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [showProductModal, setShowProductModal] = useState(false)

	const filters = ['все', 'супы', 'горячее', 'закуски', 'напитки']

	useEffect(() => {
		fetchProducts()
	}, [])

	// Фильтрация продуктов по поисковому запросу и категории
	useEffect(() => {
		let result = products

		// Применяем поиск
		if (searchQuery) {
			result = result.filter(product =>
				product.name.toLowerCase().includes(searchQuery.toLowerCase())
			)
		}

		// Применяем фильтр по категории
		if (activeFilter !== 'все') {
			result = result.filter(product => product.category === activeFilter)
		}

		setFilteredProducts(result)
	}, [products, searchQuery, activeFilter])

	const fetchProducts = async () => {
		const mockProducts = [
			{
				id: 1,
				name: 'Том Ям',
				price: 290,
				category: 'супы',
				thumbnail:
					'https://cs13.pikabu.ru/post_img/big/2023/03/20/9/1679327108295817795.jpg',
				description:
					'Острый и ароматный тайский суп с креветками, грибами и кокосовым молоком. Подается с рисом.',
				ingredients: [
					'креветки',
					'шампиньоны',
					'кокосовое молоко',
					'лемонграсс',
					'лайм',
					'чили',
				],
				weight: '350г',
				cookingTime: '15-20 мин',
			},
			{
				id: 2,
				name: 'Пад Тай',
				price: 320,
				category: 'горячее',
				thumbnail:
					'https://cs13.pikabu.ru/post_img/big/2023/03/20/9/1679327108295817795.jpg',
				description:
					'Традиционная тайская лапша с креветками, тофу, яйцом и арахисом.',
				ingredients: [
					'рисовая лапша',
					'креветки',
					'тофу',
					'яйцо',
					'ростки бобов',
					'арахис',
				],
				weight: '300г',
				cookingTime: '12-15 мин',
			},
			{
				id: 3,
				name: 'Том Кха',
				price: 310,
				category: 'супы',
				thumbnail:
					'https://cs13.pikabu.ru/post_img/big/2023/03/20/9/1679327108295817795.jpg',
				description:
					'Кремовый суп с курицей и кокосовым молоком, с яркими нотами лемонграсса и лайма.',
				ingredients: [
					'куриное филе',
					'кокосовое молоко',
					'шампиньоны',
					'лемонграсс',
					'лайм',
					'чили',
				],
				weight: '350г',
				cookingTime: '15-20 мин',
			},
			{
				id: 4,
				name: 'Зеленое карри',
				price: 350,
				category: 'горячее',
				thumbnail:
					'https://cs13.pikabu.ru/post_img/big/2023/03/20/9/1679327108295817795.jpg',
				description:
					'Ароматное карри с курицей и овощами в кокосовом молоке с зеленой пастой карри.',
				ingredients: [
					'куриное филе',
					'кокосовое молоко',
					'баклажан',
					'базилик',
					'зеленая паста карри',
				],
				weight: '320г',
				cookingTime: '20-25 мин',
			},
			{
				id: 5,
				name: 'Спринг Роллы',
				price: 280,
				category: 'закуски',
				thumbnail:
					'https://cs13.pikabu.ru/post_img/big/2023/03/20/9/1679327108295817795.jpg',
				description:
					'Хрустящие рисовые роллы с овощами и стеклянной лапшой. Подаются с соусом.',
				ingredients: [
					'рисовые блинчики',
					'морковь',
					'огурец',
					'салат',
					'стеклянная лапша',
					'мята',
				],
				weight: '200г (4 шт)',
				cookingTime: '8-10 мин',
			},
			{
				id: 6,
				name: 'Тайский чай',
				price: 180,
				category: 'напитки',
				thumbnail:
					'https://cs13.pikabu.ru/post_img/big/2023/03/20/9/1679327108295817795.jpg',
				description:
					'Традиционный тайский чай с молоком и специями. Освежающий и бодрящий напиток.',
				ingredients: ['тайский чай', 'сгущенное молоко', 'специи', 'лед'],
				volume: '400мл',
			},
		]
		setProducts(mockProducts)
		setFilteredProducts(mockProducts)
	}

	const handleProductClick = product => {
		setSelectedProduct(product)
		setShowProductModal(true)
	}

	const handleAddToCartFromModal = (product, quantity) => {
		onAddToCart(product, quantity)
		setShowProductModal(false)
	}

	if (loading) return <div className={styles.loading}>Загрузка товаров...</div>
	if (error) return <div className={styles.error}>Ошибка: {error}</div>

	return (
		<div className={styles.container}>
			<ProductFilter
				filters={filters}
				activeFilter={activeFilter}
				onFilterChange={setActiveFilter}
			/>

			{filteredProducts.length === 0 ? (
				<div className={styles.noProducts}>
					<h3>Товары не найдены</h3>
					<p>
						Попробуйте изменить поисковый запрос или выбрать другую категорию
					</p>
				</div>
			) : (
				<div className={styles.productsGrid}>
					{filteredProducts.map(product => (
						<ProductCard
							key={product.id}
							product={product}
							onAddToCart={onAddToCart}
							onProductClick={handleProductClick}
						/>
					))}
				</div>
			)}

			{showProductModal && selectedProduct && (
				<ProductModal
					product={selectedProduct}
					onClose={() => setShowProductModal(false)}
					onAddToCart={handleAddToCartFromModal}
				/>
			)}
		</div>
	)
}

export default ProductList
