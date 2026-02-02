import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './InUse.css'

function InUse() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('reservationData')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.status === 'in_use' || parsed.paymentComplete) {
        setData(parsed)
      } else {
        navigate('/reservation-status')
      }
    } else {
      navigate('/')
    }
  }, [navigate])

  const handleExtend = () => {
    alert('연장 요청이 접수되었습니다. 상담 후 연장이 확정됩니다.')
  }

  const handleReturn = () => {
    const updated = { ...data, status: 'completed', returnComplete: true }
    localStorage.setItem('reservationData', JSON.stringify(updated))
    navigate('/use-complete')
  }

  if (!data) return <div className="loading">로딩 중...</div>

  const returnTime = '2/4 (수) 22:00'
  const returnDeadline = '22시 00분까지 반납입니다.'
  const remainingLabel = '이용시간 3시간 남음'
  const currentTimeLabel = '오늘 22:00'
  const carDisplay = data.car ? `${data.car} 123하1234` : '카니발 123하1234'
  const returnLocation = '라임프렌즈 주차장'

  return (
    <div className="in-use">
      <div className="in-use-header-row">
        <span className="remaining-badge">{remainingLabel}</span>
        <span className="current-time-badge">{currentTimeLabel}</span>
      </div>

      <p className="return-deadline">{returnDeadline}</p>
      <p className="car-plate-large">{carDisplay}</p>

      <div className="vehicle-image-wrap">
        <div className="vehicle-image" />
      </div>

      <section className="usage-details">
        <ul className="usage-detail-list">
          <li>
            <span className="label">이용 형태</span>
            <span className="value">{data.type === 'wheelchair' ? '휠체어카 렌트' : (data.usageType || '단기')}</span>
          </li>
          <li>
            <span className="label">이용 요금</span>
            <span className="value">{data.estimatedPrice || '52,040원'}</span>
          </li>
          <li>
            <span className="label">보험</span>
            <span className="value">{data.insurance || '표준 보장'}</span>
          </li>
        </ul>
      </section>

      <section className="return-info">
        <div className="return-info-item">
          <span className="return-icon location">📍</span>
          <div>
            <span className="return-info-label">반납 장소</span>
            <span className="return-info-value">{returnLocation}</span>
          </div>
        </div>
        <div className="return-info-item">
          <span className="return-icon clock">🕐</span>
          <div>
            <span className="return-info-label">반납 시각</span>
            <span className="return-info-value">{returnTime}</span>
          </div>
        </div>
      </section>

      <div className="action-buttons">
        <button type="button" className="btn-extend" onClick={handleExtend}>
          연장하기
        </button>
        <button type="button" className="cta-button btn-return" onClick={handleReturn}>
          반납하기
        </button>
      </div>
    </div>
  )
}

export default InUse
