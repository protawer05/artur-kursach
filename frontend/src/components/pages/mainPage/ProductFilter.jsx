import React from 'react'
import styles from './productFilter.module.scss'

const ProductFilter = ({ filters, activeFilter, onFilterChange }) => {
	return (
		<div className={styles.filterContainer}>
			<div className={styles.filterButtons}>
				{filters.map(filter => (
					<button
						key={filter}
						className={`${styles.filterBtn} ${
							activeFilter === filter ? styles.active : ''
						}`}
						onClick={() => onFilterChange(filter)}
					>
						{filter === 'все'
							? 'Все блюда'
							: filter === 'супы'
							? 'Супы'
							: filter === 'горячее'
							? 'Горячие блюда'
							: filter === 'закуски'
							? 'Закуски'
							: filter === 'напитки'
							? 'Напитки'
							: filter}
					</button>
				))}
			</div>
		</div>
	)
}

export default ProductFilter
