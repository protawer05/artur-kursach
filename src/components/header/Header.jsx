import React from 'react'
import s from './header.module.scss'
import logo from '../assets/Logo.png'
import searchIcon from '../assets/bx_bx-search-alt-2.svg'
import cartIcon from '../assets/Shopping cart.svg'
import phoneIcon from '../assets/phone.svg'
import { Link } from 'react-router-dom'
function Header() {
	return (
		<header className={s.header}>
			<Link className={s.logo} to='/'>
				<img src={logo} alt='logo' />
			</Link>
			<div className={s.search}>
				<img src={searchIcon} alt='searchIcon' />
				<input type='text' name='search' id='search' placeholder='Поиск' />
			</div>
			<nav className={s.menu}>
				<Link className={s.cart} to='/cart'>
					<img src={cartIcon} alt='cart' />
				</Link>
				<Link to='/' className=''>
					Меню
				</Link>
				<Link to='/profile' className=''>
					Профиль
				</Link>
			</nav>
			<div className={s.phone}>
				<img src={phoneIcon} alt='phone' />
				<div className=''>+79191231231</div>
			</div>
		</header>
	)
}

export default Header
