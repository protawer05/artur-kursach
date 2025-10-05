import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import ProductFilter from './ProductFilter'
import ProductModal from './ProductModal'
import styles from './productList.module.scss'

const ProductList = ({ onAddToCart, searchQuery }) => {
	const [products, setProducts] = useState([])
	const [filteredProducts, setFilteredProducts] = useState([])

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
					'https://s3.smartofood.ru/kitaika_kaluga_ru/menu/241d6f0a-39b0-5124-af80-ff153767f6e1.png',
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
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3FrDUjq-BhQ4crtEACbwtI23laESYrEQsLA&s',
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
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3FrDUjq-BhQ4crtEACbwtI23laESYrEQsLA&s',
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
					'https://kotanyi-ru.imgix.net/wp-content/uploads/2024/10/Green-Curry_website.jpg?auto=format,compress',
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
					'https://img.iamcook.ru/2023/upl/recipes/cat/u-6630ade7f00813b5eba6e176d9d93af8.jpg',
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
					'https://media.istockphoto.com/id/2147495755/ru/%D1%84%D0%BE%D1%82%D0%BE/%D1%82%D0%B0%D0%B9%D1%81%D0%BA%D0%B8%D0%B9-%D1%87%D0%B0%D0%B9%D0%BD%D1%8B%D0%B9-%D0%BD%D0%B0%D0%BF%D0%B8%D1%82%D0%BE%D0%BA.jpg?s=612x612&w=0&k=20&c=g2WeMGcYEU4rVyolRf4JJpfKLB6qgn0TIY7PeGGuiAo=',
				description:
					'Традиционный тайский чай с молоком и специями. Освежающий и бодрящий напиток.',
				ingredients: ['тайский чай', 'сгущенное молоко', 'специи', 'лед'],
				volume: '400мл',
			},
			{
				id: 7,
				name: 'Пепперони',
				price: 450,
				category: 'пицца',
				thumbnail:
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGPNKi1810nFv3iWzh80guAWBavXUXgXlRmQ&s',
				description:
					'Классическая пицца с острыми колбасками пепперони и расплавленным сыром моцарелла.',
				ingredients: [
					'тесто для пиццы',
					'соус томатный',
					'сыр моцарелла',
					'пепперони',
					'специи',
				],
				weight: '550г (30см)',
				cookingTime: '12-15 мин',
			},
			{
				id: 8,
				name: 'Чизбургер',
				price: 320,
				category: 'бургеры',
				thumbnail:
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMVI8wfW3qpKI_zDBNJLEx0Nwh49DJlv3dVg&s',
				description:
					'Сочная котла из говядины с сыром Чеддер, свежими овощами и фирменным соусом.',
				ingredients: [
					'булка бриошь',
					'говяжья котла',
					'сыр Чеддер',
					'помидор',
					'салат айсберг',
					'красный лук',
					'фирменный соус',
				],
				weight: '350г',
				cookingTime: '10 мин',
			},
			{
				id: 9,
				name: 'Цезарь с курицей',
				price: 380,
				category: 'салаты',
				thumbnail:
					'https://images.gastronom.ru/LoVJjeEYXJQ3vR2Yn8WtlivB0eZ78Rtu417zEnX1mZs/pr:recipe-cover-image/g:ce/rs:auto:0:0:0/L2Ntcy9hbGwtaW1hZ2VzL2IxMzU5MzRkLWI1OTAtNDQ4Zi05MjA3LWQ5YzEzM2M2ODZlNy5qcGc.webp',
				description:
					'Знаменитый салат с хрустящими гренками, нежным цыпленком и соусом Цезарь.',
				ingredients: [
					'салат романо',
					'куриное филе-гриль',
					'гренки',
					'сыр Пармезан',
					'соус Цезарь',
				],
				weight: '280г',
				cookingTime: '7 мин',
			},
			{
				id: 10,
				name: 'Кола',
				price: 150,
				category: 'напитки',
				thumbnail:
					'https://www.waterbaikal.ru/image/cache/catalog/soki-napitki/limonad/coca-cola/coca-cola-033-poland-768x576.jpeg',
				description: 'Освежающий газированный напиток.',
				ingredients: ['кола', 'лед'],
				volume: '500мл',
			},
			{
				id: 11,
				name: 'Маргарита',
				price: 420,
				category: 'пицца',
				thumbnail:
					'https://cdn.vkuso.ru/uploads/116430_domashnyaya-picca-margarita-s-mocarelloj-i-parmezanom_1649094920.jpg',
				description:
					'Итальянская классика с томатным соусом, моцареллой и свежим базиликом.',
				ingredients: [
					'тесто для пиццы',
					'соус томатный',
					'сыр моцарелла',
					'помидоры',
					'базилик свежий',
				],
				weight: '520г (30см)',
				cookingTime: '10-12 мин',
			},
			{
				id: 12,
				name: 'Картофель Фри',
				price: 180,
				category: 'закуски',
				thumbnail:
					'https://cdn-ru6.foodpicasso.com/assets/2024/11/18/dbd03e3266651a98c80ad87602327d02---jpg_1000x_103c0_convert.jpg',
				description:
					'Золотистый и хрустящий картофель с щепоткой морской соли.',
				ingredients: ['картофель', 'масло растительное', 'соль'],
				weight: '150г',
				cookingTime: '8 мин',
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
