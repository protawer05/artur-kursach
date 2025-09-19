import './App.css'
import Header from './components/header/Header'
import { Routes, Route } from 'react-router-dom'
import MainPage from './components/pages/mainPage/MainPage'
import Footer from './components/footer/Footer'
function App() {
	return (
		<div className='wrapper'>
			<Header />
			<div className='content'>
				<Routes>
					<Route path='/' element={<MainPage />} />
				</Routes>
			</div>
			<Footer />
		</div>
	)
}

export default App
