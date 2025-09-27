import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import s from './header.module.scss'
import logo from '../assets/Logo.png'
import searchIcon from '../assets/bx_bx-search-alt-2.svg'
import cartIcon from '../assets/Shopping cart.svg'
import phoneIcon from '../assets/phone.svg'

function Header({ cartItemsCount = 0, currentUser, onProfileClick, onLogout }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isScrolled, setIsScrolled] = useState(false)
	const [showUserMenu, setShowUserMenu] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const handleLinkClick = () => {
		setIsMenuOpen(false)
		setShowUserMenu(false)
	}

	const handleProfileLinkClick = e => {
		e.preventDefault()
		if (onProfileClick && !onProfileClick()) {
			return
		}
		navigate('/profile')
		setIsMenuOpen(false)
		setShowUserMenu(false)
	}

	const handleUserMenuToggle = () => {
		setShowUserMenu(!showUserMenu)
	}

	const handleLogoutClick = () => {
		onLogout()
		setShowUserMenu(false)
		setIsMenuOpen(false)
	}

	return (
		<header className={s.header}>
			<Link className={s.logo} to='/' onClick={handleLinkClick}>
				<img src={logo} alt='Foodies Logo' />
			</Link>

			<div className={s.search}>
				<img src={searchIcon} alt='Поиск' />
				<input type='text' placeholder='Поиск' />
			</div>

			<button
				className={`${s.burger} ${isMenuOpen ? s.active : ''}`}
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			>
				<span></span>
				<span></span>
				<span></span>
			</button>

			<nav className={`${s.menu} ${isMenuOpen ? s.active : ''}`}>
				<Link className={s.cart} to='/cart' onClick={handleLinkClick}>
					<img src={cartIcon} alt='Корзина' />
					Корзина
					{cartItemsCount > 0 && (
						<span className={s.cartBadge}>{cartItemsCount}</span>
					)}
				</Link>

				<Link to='/' onClick={handleLinkClick}>
					Меню
				</Link>

				{currentUser ? (
					<div className={s.userMenuContainer}>
						<button className={s.userMenuButton} onClick={handleUserMenuToggle}>
							<div className={s.userAvatar}>
								{currentUser.name
									? currentUser.name.charAt(0).toUpperCase()
									: 'U'}
							</div>
							<span className={s.userName}>
								{currentUser.name || 'Пользователь'}
							</span>
						</button>

						{showUserMenu && (
							<div className={s.userDropdown}>
								<Link
									to='/profile'
									className={s.dropdownItem}
									onClick={handleLinkClick}
								>
									Мой профиль
								</Link>
								<button className={s.dropdownItem} onClick={handleLogoutClick}>
									Выйти
								</button>
							</div>
						)}
					</div>
				) : (
					<a
						href='/profile'
						onClick={handleProfileLinkClick}
						className={s.profileLink}
					>
						Профиль
					</a>
				)}
			</nav>

			<div className={s.phone}>
				<img src={phoneIcon} alt='Телефон' />
				<div>+7 (919) 123-12-31</div>
			</div>
		</header>
	)
}

export default Header
