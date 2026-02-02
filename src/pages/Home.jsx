import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">헤이드 렌트카</h1>
        <p className="home-subtitle">안전하고 편리한 차량 렌트 서비스</p>
      </div>

      <div className="rent-type-cards">
        <Link to="/service/wheelchair" className="rent-type-card">
          <div className="rent-type-icon">♿</div>
          <h2 className="rent-type-title">휠체어카 렌트</h2>
          <p className="rent-type-desc">편리한 이동을 위한 휠체어 전용 차량</p>
        </Link>
        <Link to="/service/accident" className="rent-type-card">
          <div className="rent-type-icon">🚗</div>
          <h2 className="rent-type-title">사고 대차 렌트</h2>
          <p className="rent-type-desc">사고 차량 수리 중 대체 차량 제공</p>
        </Link>
      </div>
    </div>
  )
}

export default Home
