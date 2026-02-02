import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './UseComplete.css'

function UseComplete() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('reservationData')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.status === 'completed' || parsed.returnComplete) {
        setData(parsed)
      } else {
        navigate('/reservation-status')
      }
    } else {
      navigate('/')
    }
  }, [navigate])

  const handleHome = () => {
    localStorage.removeItem('reservationData')
    navigate('/')
  }

  if (!data) return <div className="loading">로딩 중...</div>

  const typeLabel = data.type === 'wheelchair' ? '휠체어카 렌트' : '사고 대차 렌트'

  return (
    <div className="use-complete">
      <div className="complete-icon">✓</div>
      <h1 className="complete-title">이용이 완료되었습니다</h1>
      <p className="complete-desc">
        이용해 주셔서 감사합니다.
      </p>

      <section className="summary-section">
        <h2 className="section-label">이용 요약</h2>
        <ul className="summary-list">
          <li>
            <span className="label">차량</span>
            <span className="value">{data.car || '-'}</span>
          </li>
          <li>
            <span className="label">렌트 유형</span>
            <span className="value">{typeLabel}</span>
          </li>
          <li>
            <span className="label">이용 형태</span>
            <span className="value">{data.usageType || '-'}</span>
          </li>
          <li>
            <span className="label">이용 기간</span>
            <span className="value">
              {data.rentalPeriod || data.rentalDays || '-'}
              {data.rentalTime && ` ${data.rentalTime}`}
            </span>
          </li>
          <li>
            <span className="label">이용 요금</span>
            <span className="value">{data.estimatedPrice || '50,000원'}</span>
          </li>
          <li>
            <span className="label">보험</span>
            <span className="value">{data.insurance || '-'}</span>
          </li>
        </ul>
      </section>

      <button className="cta-button" onClick={handleHome}>
        홈으로
      </button>
    </div>
  )
}

export default UseComplete
