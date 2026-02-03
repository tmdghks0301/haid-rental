import { useState } from 'react'
import './UseComplete.css'

function UseComplete({ data, onHome }) {
  const [additionalFeePaid, setAdditionalFeePaid] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(null) // 'card' | 'transfer'
  if (!data) return <div className="loading">로딩 중...</div>

  const hasExtendedFee = (data.extendedAdditionalFee || 0) > 0

  const handlePayAdditionalFee = () => {
    setAdditionalFeePaid(true)
  }

  return (
    <div className="use-complete">
      <div className="complete-icon">✓</div>
      <h1 className="complete-title">이용이 완료되었습니다</h1>
      <p className="complete-desc">이용해 주셔서 감사합니다.</p>

      <section className="summary-section">
        <h2 className="section-label">이용 요약 정보</h2>
        <ul className="summary-list">
          <li><span className="label">차량</span><span className="value">{data.car}</span></li>
          <li><span className="label">이용 형태</span><span className="value">{data.usageType}</span></li>
          <li><span className="label">이용 기간</span><span className="value">{data.duration || '-'}</span></li>
          <li><span className="label">이용 요금</span><span className="value">{data.estimatedPrice}</span></li>
          <li><span className="label">보험</span><span className="value">{data.insurance}</span></li>
        </ul>
      </section>

      {hasExtendedFee && (
        <section className="additional-fee-section payment-section">
          <h2 className="section-label">추가 요금 결제</h2>
          {additionalFeePaid ? (
            <p className="additional-fee-paid">결제가 완료되었습니다.</p>
          ) : (
            <div className="payment-card">
              <div className="payment-row total">
                <span>결제금액</span>
                <span className="payment-amount">총 {(data.extendedAdditionalFee || 0).toLocaleString()}원</span>
              </div>
              <div className="payment-row">
                <span>결제 수단</span>
              </div>
              <label className="payment-method">
                <input
                  type="radio"
                  name="additionalPm"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                신용/체크카드
              </label>
              <label className="payment-method">
                <input
                  type="radio"
                  name="additionalPm"
                  checked={paymentMethod === 'transfer'}
                  onChange={() => setPaymentMethod('transfer')}
                />
                계좌이체
              </label>
              <p className="terms-notice">약관 동의 후 결제해 주세요.</p>
              <button
                type="button"
                className="cta-button payment-btn"
                onClick={handlePayAdditionalFee}
                disabled={!paymentMethod}
              >
                결제 {(data.extendedAdditionalFee || 0).toLocaleString()}원
              </button>
            </div>
          )}
        </section>
      )}

      <button type="button" className="cta-button" onClick={onHome}>
        홈으로
      </button>
    </div>
  )
}

export default UseComplete
