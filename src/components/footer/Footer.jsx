import React from 'react'
import s from './footer.module.scss'
import instaIcon from '../assets/socials/Dribbble.svg'
import twitterIcon from '../assets/socials/Twitter.svg'
import youtubeIcon from '../assets/socials/Youtube.svg'
import dribbleIcon from '../assets/socials/Dribbble.svg'

const Footer = () => {
	const socialLinks = [
		{
			href: 'https://www.instagram.com/',
			icon: instaIcon,
			alt: 'Instagram',
			label: 'Instagram',
		},
		{
			href: 'https://twitter.com/',
			icon: twitterIcon,
			alt: 'Twitter',
			label: 'Twitter',
		},
		{
			href: 'https://www.youtube.com/',
			icon: youtubeIcon,
			alt: 'YouTube',
			label: 'YouTube',
		},
		{
			href: 'https://dribbble.com/',
			icon: dribbleIcon,
			alt: 'Dribbble',
			label: 'Dribbble',
		},
	]

	return (
		<footer className={s.footer}>
			<div className={s.text}>© 2025 Foodies. Все права защищены</div>

			<div className={s.socials}>
				{socialLinks.map((link, index) => (
					<a
						key={index}
						href={link.href}
						target='_blank'
						rel='noopener noreferrer'
						aria-label={link.label}
					>
						<img src={link.icon} alt={link.alt} />
					</a>
				))}
			</div>
		</footer>
	)
}

export default Footer
