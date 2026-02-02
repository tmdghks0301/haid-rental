import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ReservationComplete.css'

function ReservationComplete() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('reservationData')
    if (saved) {
      setData(JSON.parse(saved))
    } else {
      navigate('/')
    }
  }, [navigate])

  const handleViewStatus = () => {
    navigate('/reservation-status')
  }

  if (!data) return <div className="loading">로딩 중...</div>

  const typeLabel = data.type === 'wheelchair' ? '휠체어카 렌트' : '사고 대차 렌트'
  const usageLabel = data.usageType || data.timing || '-'

  const formatDate = (d) => d && d.replace(/-/g, '/').replace(/^(\d{4})\/(\d{2})\/(\d{2})$/, '$2/$3')
  const periodDisplay = data.rentalPeriod && data.rentalTime && data.rentalPeriodEnd && data.rentalTimeEnd
    ? `${formatDate(data.rentalPeriod)} ${data.rentalTime} → ${formatDate(data.rentalPeriodEnd)} ${data.rentalTimeEnd}`
    : (data.rentalPeriod && data.rentalTime ? `${formatDate(data.rentalPeriod)} ${data.rentalTime}` : null) || data.rentalDays || '-'
  const carDisplay = data.type === 'wheelchair' && data.car ? `${data.car} - 휠체어 카` : (data.car || '-')

  return (
    <div className="reservation-complete">
      <div className="complete-icon">✓</div>
      <h1 className="complete-title">예약 요청이 완료되었습니다!</h1>
      <p className="complete-desc">
        상담 진행 후 예약 진행 상태를 알려드리겠습니다.
      </p>

      <section className="reservation-summary">
        <ul className="summary-list">
          <li>
            <span className="label">차량</span>
            <span className="value">{carDisplay}</span>
          </li>
          <li>
            <span className="label">이용 형태</span>
            <span className="value">{usageLabel}</span>
          </li>
          <li>
            <span className="label">이용 기간</span>
            <span className="value">{periodDisplay}</span>
          </li>
          <li>
            <span className="label">이용 요금</span>
            <span className="value">{data.estimatedPrice || '상담 후 확정'}</span>
          </li>
          <li>
            <span className="label">보험</span>
            <span className="value">{data.insurance || '-'}</span>
          </li>
        </ul>
      </section>

      <button className="cta-button cta-with-arrow" onClick={handleViewStatus}>
        예약 현황 확인 &gt;
      </button>
    </div>
  )
}

export default ReservationComplete
