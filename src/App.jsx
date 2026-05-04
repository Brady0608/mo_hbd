import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import AdventureMap from './components/AdventureMap'
import WishesGacha from './components/WishesGacha'
import Footer from './components/Footer'
import TornEdge from './components/TornEdge'

export default function App() {
  return (
    <div className="min-h-screen w-full" style={{ background: '#FFF9E3' }}>
      <Navbar />
      <main className="w-full">
        <HeroSection />
        <TornEdge fill="#FFF9E3" flip />
        <AdventureMap />
        <TornEdge fill="#F5EDD4" />
        <WishesGacha />
        <TornEdge fill="#FFF9E3" flip />
      </main>
      <Footer />
    </div>
  )
}
