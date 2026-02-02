import { useState } from 'react'
import './ReservationStatus.css'

const STEPS = [
  { label: '예약 요청', icon: '✓' },
  { label: '상담 중', icon: '💬' },
  { label: '이용 예정', icon: '🚗' },
]

function ReservationStatus({ data, onPayment, onBack }) {
  const [counselingDone, setCounselingDone] = useState(false)
  const [pointUse, setPointUse] = useState(0)
  const paymentAmount = data?.estimatedPrice ? parseInt(String(data.estimatedPrice).replace(/[^0-9]/g, ''), 10) || 50000 : 50000

  if (!data) return <div className="loading">로딩 중...</div>

  const handlePayment = () => {
    onPayment()
  }

  return (
    <div className="reservation-status">
      <section className="progress-section">
        <h2 className="section-label">예약 진행 상태</h2>
        <div className="progress-steps">
          {STEPS.map((s, i) => (
            <div key={s.label} className={`progress-step ${counselingDone && i < 2 ? 'done' : ''} ${!counselingDone && i === 0 ? 'active' : ''} ${counselingDone && i === 1 ? 'active' : ''}`}>
              <span className="step-icon">{s.icon}</span>
              <span className="step-label">{s.label}</span>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </section>

      <section className="summary-section">
        <h2 className="section-label">예약 요약 정보</h2>
        <ul className="summary-list">
          <li><span className="label">렌트 유형</span><span className="value">{data.type}</span></li>
          <li><span className="label">차량</span><span className="value">{data.car}</span></li>
          <li><span className="label">이용 기간</span><span className="value">{data.duration || '-'}</span></li>
          <li><span className="label">이용 요금</span><span className="value">{data.estimatedPrice}</span></li>
        </ul>
      </section>

      {!counselingDone && (
        <button type="button" className="secondary-btn" onClick={() => setCounselingDone(true)}>
          [데모] 상담 완료로 변경
        </button>
      )}

      {counselingDone && (
        <section className="payment-section">
          <h2 className="section-label">결제</h2>
          <div className="payment-card">
            <div className="payment-row total">
              <span>결제금액</span>
              <span className="payment-amount">총 {paymentAmount.toLocaleString()}원</span>
            </div>
            <div className="payment-row">
              <span>포인트 사용</span>
              <span>
                보유 30,000원 <input type="number" className="point-input" value={pointUse} onChange={(e) => setPointUse(Number(e.target.value) || 0)} placeholder="0" /> 원
              </span>
            </div>
            <div className="payment-row">
              <span>결제 수단</span>
            </div>
            <label className="payment-method"><input type="radio" name="pm" defaultChecked /> 신용/체크카드</label>
            <label className="payment-method"><input type="radio" name="pm" /> 계좌이체</label>
            <p className="terms-notice">약관 동의 후 결제해 주세요.</p>
            <button type="button" className="cta-button payment-btn" onClick={handlePayment}>
              결제 {paymentAmount.toLocaleString()}원
            </button>
          </div>
          <p className="notice-text">※ 결제 완료 시 상태는 '이용 예정'으로 전환됩니다.</p>
        </section>
      )}
    </div>
  )
}

export default ReservationStatus
