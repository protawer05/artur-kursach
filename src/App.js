import './App.css'
import Header from './components/header/Header'
import { Routes, Route } from 'react-router-dom'
import ProductList from './components/pages/mainPage/ProductList'
import CartPage from './components/pages/cartPage/CartPage'
import ProfilePage from './components/pages/profilePage/ProfilePage'
import Footer from './components/footer/Footer'
import AuthModal from './components/authModal/AuthModal'
import { useState, useEffect } from 'react'

function App() {
	const [cartItems, setCartItems] = useState([])
	const [currentUser, setCurrentUser] = useState(null)
	const [showAuthModal, setShowAuthModal] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')

	useEffect(() => {
		const savedCart = localStorage.getItem('cartItems')
		const savedUser = localStorage.getItem('currentUser')

		if (savedCart) {
			setCartItems(JSON.parse(savedCart))
		}

		if (savedUser) {
			setCurrentUser(JSON.parse(savedUser))
		}
	}, [])

	useEffect(() => {
		localStorage.setItem('cartItems', JSON.stringify(cartItems))
	}, [cartItems])

	useEffect(() => {
		if (currentUser) {
			localStorage.setItem('currentUser', JSON.stringify(currentUser))
		}
	}, [currentUser])

	const handleAddToCart = (product, quantity) => {
		setCartItems(prevItems => {
			const existingItem = prevItems.find(item => item.id === product.id)

			if (existingItem) {
				return prevItems.map(item =>
					item.id === product.id
						? { ...item, quantity: item.quantity + quantity }
						: item
				)
			} else {
				return [...prevItems, { ...product, quantity }]
			}
		})
	}

	const handleUpdateQuantity = (productId, newQuantity) => {
		if (newQuantity <= 0) {
			handleRemoveItem(productId)
			return
		}

		setCartItems(prevItems =>
			prevItems.map(item =>
				item.id === productId ? { ...item, quantity: newQuantity } : item
			)
		)
	}

	const handleRemoveItem = productId => {
		setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
	}

	const handleClearCart = () => {
		setCartItems([])
	}

	const handleLogin = user => {
		setCurrentUser(user)
		setShowAuthModal(false)
	}

	const handleLogout = () => {
		setCurrentUser(null)
		localStorage.removeItem('currentUser')
	}

	const handleProfileClick = () => {
		if (!currentUser) {
			setShowAuthModal(true)
			return false
		}
		return true
	}

	const handleSearch = query => {
		setSearchQuery(query)
	}

	return (
		<div className='wrapper'>
			<Header
				cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
				currentUser={currentUser}
				onProfileClick={handleProfileClick}
				onLogout={handleLogout}
				onSearch={handleSearch}
			/>

			<div className='content'>
				<Routes>
					<Route
						path='/'
						element={
							<ProductList
								onAddToCart={handleAddToCart}
								searchQuery={searchQuery}
							/>
						}
					/>
					<Route
						path='/cart'
						element={
							<CartPage
								cartItems={cartItems}
								onUpdateQuantity={handleUpdateQuantity}
								onRemoveItem={handleRemoveItem}
								onClearCart={handleClearCart}
								currentUser={currentUser}
							/>
						}
					/>
					<Route
						path='/profile'
						element={
							currentUser ? (
								<ProfilePage
									currentUser={currentUser}
									onUserUpdate={setCurrentUser}
								/>
							) : (
								<div className='auth-required'>
									<h2>Требуется авторизация</h2>
									<p>Пожалуйста, войдите в аккаунт чтобы просмотреть профиль</p>
								</div>
							)
						}
					/>
				</Routes>
			</div>

			<Footer />

			{showAuthModal && (
				<AuthModal
					onClose={() => setShowAuthModal(false)}
					onLogin={handleLogin}
				/>
			)}
		</div>
	)
}

export default App
