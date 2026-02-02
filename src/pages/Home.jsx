import './Home.css'

const RENT_TYPES = [
  { id: 'wheelchair', icon: '♿', title: '휠체어카 렌트', desc: '편리한 이동을 위한 휠체어 전용 차량' },
  { id: 'accident', icon: '🚗', title: '사고 대차 렌트', desc: '사고 차량 수리 중 대체 차량 제공' },
]

function Home({ onSelectType }) {
  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">헤이드 렌트카</h1>
        <p className="home-subtitle">안전하고 편리한 차량 렌트 서비스</p>
      </div>
      <div className="rent-type-cards">
        {RENT_TYPES.map((item) => (
          <button
            key={item.id}
            type="button"
            className="rent-type-card"
            onClick={() => onSelectType(item.id)}
          >
            <div className="rent-type-icon">{item.icon}</div>
            <h2 className="rent-type-title">{item.title}</h2>
            <p className="rent-type-desc">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Home
