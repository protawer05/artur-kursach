import React from 'react'
import s from './footer.module.scss'
import instaIcon from '../assets/socials/Dribbble.svg'
import twitterIcon from '../assets/socials/Twitter.svg'
import youtubeIcon from '../assets/socials/Youtube.svg'
import dribbleIcon from '../assets/socials/Dribbble.svg'
export default function Footer() {
	return (
		<div className={s.footer}>
			<div className={s.text}>© 2025 Foodies. Все права защищены</div>
			<div className={s.socials}>
				<a
					href='https://www.instagram.com/'
					target='_blank'
					rel='noopener noreferrer'
					aria-label='Instagram'
				>
					<img src={instaIcon} alt='instagram' />
				</a>
				<a
					href='https://twitter.com/'
					target='_blank'
					rel='noopener noreferrer'
					aria-label='Twitter'
				>
					<img src={twitterIcon} alt='twitter' />
				</a>
				<a
					href='https://www.youtube.com/'
					target='_blank'
					rel='noopener noreferrer'
					aria-label='YouTube'
				>
					<img src={youtubeIcon} alt='youtube' />
				</a>
				<a
					href='https://dribbble.com/'
					target='_blank'
					rel='noopener noreferrer'
					aria-label='Dribbble'
				>
					<img src={dribbleIcon} alt='dribble' />
				</a>
			</div>
		</div>
	)
}
