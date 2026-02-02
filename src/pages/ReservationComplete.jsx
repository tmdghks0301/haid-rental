import './ReservationComplete.css'

function ReservationComplete({ data, onViewStatus }) {
  if (!data) return <div className="loading">로딩 중...</div>

  return (
    <div className="reservation-complete">
      <div className="complete-icon">✓</div>
      <h1 className="complete-title">예약 요청이 완료되었습니다</h1>
      <p className="complete-desc">상담 진행 예정입니다. 완료 후 예약 진행 상태를 알려드리겠습니다.</p>

      <section className="reservation-summary">
        <h3 className="summary-heading">예약 정보 요약</h3>
        <ul className="summary-list">
          <li><span className="label">렌트 유형</span><span className="value">{data.type}</span></li>
          <li><span className="label">차량</span><span className="value">{data.car}</span></li>
          <li><span className="label">이용 형태</span><span className="value">{data.usageType}</span></li>
          <li><span className="label">이용 기간</span><span className="value">{data.duration || '-'}</span></li>
          <li><span className="label">이용 요금</span><span className="value">{data.estimatedPrice || '상담 후 확정'}</span></li>
          <li><span className="label">보험</span><span className="value">{data.insurance || '-'}</span></li>
        </ul>
      </section>

      <p className="notice-text">※ 본 단계는 상담 요청 접수 상태이며, 예약 확정은 상담 및 결제 완료 후 진행됩니다.</p>
      <button type="button" className="cta-button" onClick={onViewStatus}>
        예약 현황 확인
      </button>
    </div>
  )
}

export default ReservationComplete
