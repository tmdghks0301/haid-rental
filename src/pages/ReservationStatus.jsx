import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ReservationStatus.css'

const STEPS = [
  { label: '정보 입력', icon: 'check' },
  { label: '상담 진행', icon: 'chat' },
  { label: '예약 확정', icon: 'car' },
]

function ReservationStatus() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [counselingComplete, setCounselingComplete] = useState(false)
  const [pointUse, setPointUse] = useState(0)
  const paymentAmount = data?.estimatedPrice ? parseInt(String(data.estimatedPrice).replace(/[^0-9]/g, ''), 10) || 52040 : 52040
  const reserveFee = Math.floor(paymentAmount * 0.85)
  const insuranceFee = paymentAmount - reserveFee

  useEffect(() => {
    const saved = localStorage.getItem('reservationData')
    if (saved) {
      setData(JSON.parse(saved))
    } else {
      navigate('/')
    }
  }, [navigate])

  const handlePayment = () => {
    const updated = { ...data, status: 'in_use', paymentComplete: true }
    localStorage.setItem('reservationData', JSON.stringify(updated))
    navigate('/in-use')
  }

  const simulateCounselingComplete = () => {
    setCounselingComplete(true)
    setCurrentStep(2)
    const updated = { ...data, status: 'ready', counselingComplete: true }
    localStorage.setItem('reservationData', JSON.stringify(updated))
  }

  if (!data) return <div className="loading">로딩 중...</div>

  const typeLabel = data.type === 'wheelchair' ? '휠체어카 렌트' : '사고 대차 렌트'
  const usageLabel = data.usageType || data.timing || '-'
  const periodDisplay = data.rentalPeriod && data.rentalTime && data.rentalPeriodEnd && data.rentalTimeEnd
    ? `${data.rentalPeriod.replace(/-/g, '/').slice(5).replace('-', '/')} ${data.rentalTime} → ${data.rentalPeriodEnd.replace(/-/g, '/').slice(5).replace('-', '/')} ${data.rentalTimeEnd}`
    : `${data.rentalPeriod || data.rentalDays || '-'} ${data.rentalTime || ''}`.trim()

  return (
    <div className="reservation-status payment-page">
      <section className="progress-section">
        <h2 className="section-label">예약 진행 상태</h2>
        <div className="progress-steps-visual">
          {STEPS.map((s, i) => (
            <div key={s.label} className={`progress-step-visual ${i < currentStep ? 'done' : ''} ${i === currentStep ? 'active' : ''}`}>
              <div className="step-icon-wrap">
                {i < currentStep ? (
                  <span className="step-icon check">✓</span>
                ) : (
                  <span className={`step-icon ${s.icon === 'chat' ? 'chat' : 'car'}`}>
                    {s.icon === 'chat' ? '💬' : '🚗'}
                  </span>
                )}
              </div>
              <span className="step-label">{s.label}</span>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </section>

      <section className="summary-section">
        <div className="summary-card">
          <ul className="summary-list">
            <li><span className="label">렌트 유형</span><span className="value">{typeLabel}</span></li>
            <li><span className="label">이용 형태</span><span className="value">{usageLabel}</span></li>
            <li><span className="label">이용 기간</span><span className="value">{periodDisplay}</span></li>
            <li><span className="label">이용 요금</span><span className="value">{data.estimatedPrice || '52,040원'}</span></li>
          </ul>
        </div>
      </section>

      {!counselingComplete && currentStep < 2 && (
        <button className="secondary-button" onClick={simulateCounselingComplete}>
          [데모] 상담 완료로 변경
        </button>
      )}

      {counselingComplete && (
        <section className="payment-section">
          <h2 className="section-label">결제</h2>
          <div className="payment-card">
            <div className="payment-row total">
              <span>결제금액</span>
              <span className="payment-amount">총 {paymentAmount.toLocaleString()}원</span>
            </div>
            <div className="payment-breakdown">
              예약금 {reserveFee.toLocaleString()}원, 보험료 {insuranceFee.toLocaleString()}원
            </div>
            <div className="payment-row">
              <span>포인트 사용</span>
              <span className="point-row">
                <span className="point-available">보유 {(30000).toLocaleString()}원</span>
                <input type="text" className="point-input" value={pointUse} onChange={(e) => setPointUse(Number(e.target.value) || 0)} placeholder="0" />
                <span className="point-unit">원</span>
                <button type="button" className="point-full-btn" onClick={() => setPointUse(30000)}>전액 사용</button>
              </span>
            </div>
            <div className="payment-row">
              <span>결제 수단</span>
            </div>
            <label className="payment-method-option">
              <input type="radio" name="paymentMethod" defaultChecked />
              <span>신용/체크카드</span>
            </label>
            <div className="card-register-placeholder">
              <span className="plus-icon">+</span>
              <span>카드 등록하기</span>
            </div>
            <label className="payment-method-option">
              <input type="radio" name="paymentMethod" />
              <span>계좌이체</span>
            </label>
            <p className="terms-notice">약관 동의 후 결제하기를 눌러 진행해 주세요.</p>
            <div className="policy-links">
              <a href="#policy">예약 정책</a>
              <a href="#cancel">취소환불 정책</a>
            </div>
            <button className="cta-button payment-amount-btn" onClick={handlePayment}>
              {paymentAmount.toLocaleString()}원
            </button>
          </div>
          <p className="notice-text">
            ※ 결제 완료 시 상태는 '예약 확정'으로 전환되며, 이용 중 화면으로 이동합니다.
          </p>
        </section>
      )}

      {!counselingComplete && (
        <p className="notice-text">상담 완료 후 결제가 활성화됩니다.</p>
      )}
    </div>
  )
}

export default ReservationStatus
