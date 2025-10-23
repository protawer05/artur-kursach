import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import ProductFilter from './ProductFilter'
import ProductModal from './ProductModal'
import styles from './productList.module.scss'
import { productAPI } from '../../../services/api'
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
		try {
			const data = await productAPI.getProducts()

			// Преобразуем данные из базы
			const formattedProducts = data.map(product => ({
				...product,
				ingredients: product.ingredients ? product.ingredients.split(',') : [],
			}))

			setProducts(formattedProducts)
			setFilteredProducts(formattedProducts)
		} catch (err) {
			console.error('Ошибка загрузки товаров:', err)
			setError(err.message)
		} finally {
			setLoading(false)
		}
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
