import { useState } from 'react'
import './InUse.css'

function parseDurationDays(str) {
  if (!str || str === '상담 후 확정') return 0
  const m = String(str).match(/(\d+)\s*일/)
  return m ? parseInt(m[1], 10) : 0
}

function timeToMinutes(timeStr) {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60) % 24
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function formatReturnTimeLabel(dateStr, timeStr) {
  if (!dateStr || !timeStr) return '오늘 23:00'
  const d = new Date(dateStr + 'T' + timeStr + ':00')
  const today = new Date()
  const isToday = dateStr === today.toISOString().slice(0, 10)
  return isToday ? `오늘 ${timeStr}` : `${dateStr.slice(5, 7)}/${dateStr.slice(8, 10)} ${timeStr}`
}

const FEE_PER_MINUTE = 169 // 30분 기준 약 5,070원

function InUse({ data, onExtend, onReturn }) {
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [extendMinutes, setExtendMinutes] = useState(0)
  const [extendEndDate, setExtendEndDate] = useState(data?.endDate || '')
  const [extendEndTime, setExtendEndTime] = useState(data?.endTime || '')
  const [extendDays, setExtendDays] = useState(0)

  if (!data) return <div className="loading">로딩 중...</div>

  const isAccident = data.type === '사고 대차 렌트'
  const currentDays = isAccident ? parseDurationDays(data.duration) : 0

  const baseEndDate = data.endDate || new Date().toISOString().slice(0, 10)
  const baseEndTime = data.endTime || '23:00'
  const baseEndMinutes = timeToMinutes(baseEndTime)
  const newEndTotalMinutes = baseEndMinutes + extendMinutes
  const newEndTime = minutesToTime(newEndTotalMinutes % (24 * 60))
  const rolloverDays = Math.floor(newEndTotalMinutes / (24 * 60))
  const newEndDate = rolloverDays > 0
    ? (() => {
        const d = new Date(baseEndDate + 'T12:00:00')
        d.setDate(d.getDate() + rolloverDays)
        return d.toISOString().slice(0, 10)
      })()
    : baseEndDate
  const additionalFee = extendMinutes * FEE_PER_MINUTE
  const maxExtendMinutes = Math.max(0, 24 * 60 - baseEndMinutes)
  const maxExtendLabel = maxExtendMinutes >= 60
    ? `${Math.floor(maxExtendMinutes / 60)}시간 ${maxExtendMinutes % 60}분`
    : `${maxExtendMinutes}분`

  const openExtendModal = () => {
    setExtendMinutes(0)
    setExtendEndDate(data.endDate || '')
    setExtendEndTime(data.endTime || '')
    setExtendDays(0)
    setShowExtendModal(true)
  }

  const addExtendMinutes = (mins) => {
    setExtendMinutes((prev) => Math.min(prev + mins, Math.max(maxExtendMinutes, 0)))
  }

  const handleExtendConfirm = () => {
    if (isAccident) {
      const newDays = currentDays + extendDays
      if (newDays <= currentDays) return
      onExtend({ ...data, duration: `${newDays}일` })
    } else {
      const prevExtendedFee = data.extendedAdditionalFee || 0
      onExtend({
        ...data,
        endDate: newEndDate,
        endTime: newEndTime,
        extendedAdditionalFee: prevExtendedFee + additionalFee,
      })
    }
    setShowExtendModal(false)
  }

  return (
    <div className="in-use">
      {isAccident ? (
        <div className="in-use-header">
          <span className="remaining-badge">대차 이용 중</span>
          <span className="return-time">이용 기간: {data.duration && data.duration !== '상담 후 확정' ? data.duration : '-'}</span>
        </div>
      ) : (
        <>
          <div className="in-use-header">
            <span className="remaining-badge">이용 중</span>
            <span className="return-time">반납 시각 {data.endTime || '22:00'}</span>
          </div>
          <p className="return-deadline">{(data.endDate ? `${data.endDate} ` : '')}{data.endTime || '22:00'}까지 반납입니다.</p>
        </>
      )}

      <section className="vehicle-section">
        <div className="vehicle-image" />
        <p className="vehicle-name">{data.car || (isAccident ? '상담 후 확정' : '차량')} {!isAccident && '· 123하1234'}</p>
      </section>

      <section className="usage-details">
        <h3 className="details-heading">예약 정보</h3>
        <ul className="details-list">
          {isAccident ? (
            <>
              <li><span className="label">대차 이용 기간</span><span className="value">{data.duration || '-'}</span></li>
              <li><span className="label">이용 지역</span><span className="value">{data.region || '-'}</span></li>
              <li><span className="label">이용 요금</span><span className="value">{data.estimatedPrice && data.estimatedPrice !== '상담 후 확정' ? data.estimatedPrice : '-'}</span></li>
              {data.insuranceCompany && (
                <li><span className="label">보험사</span><span className="value">{data.insuranceCompany}</span></li>
              )}
            </>
          ) : (
            <>
              <li><span className="label">이용 형태</span><span className="value">{data.usageType}</span></li>
              <li><span className="label">이용 요금</span><span className="value">{data.estimatedPrice && data.estimatedPrice !== '상담 후 확정' ? data.estimatedPrice : '-'}</span></li>
              <li><span className="label">보험</span><span className="value">{data.insurance || '-'}</span></li>
            </>
          )}
        </ul>
      </section>

      {!isAccident && (
        <section className="return-info">
          <div className="return-item">
            <span className="return-icon">📍</span>
            <div>
              <span className="return-label">반납 장소</span>
              <span className="return-value">{data.returnLocation || '라임프렌즈 주차장'}</span>
            </div>
          </div>
        </section>
      )}
      {isAccident && (
        <p className="return-deadline accident-return-notice">수리 완료 후 반납 일정은 상담을 통해 안내됩니다.</p>
      )}

      <div className="action-buttons">
        <button type="button" className="btn-extend" onClick={openExtendModal}>
          연장하기
        </button>
        <button type="button" className="cta-button btn-return" onClick={onReturn}>
          반납하기
        </button>
      </div>
      <p className="in-use-notice">
        {isAccident ? '연장·반납 일정은 상담 후 확정됩니다.' : '연장은 상담 후 확정됩니다. 반납 요청 시 이용 완료 처리됩니다.'}
      </p>

      {showExtendModal && (
        <div className="extend-overlay" onClick={() => setShowExtendModal(false)} aria-hidden="true">
          <div className="extend-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="extend-modal-title">{isAccident ? '렌트 기간 연장' : '반납 시각 연장하기'}</h3>
            {isAccident ? (
              <>
                <p className="extend-modal-hint">현재 이용 기간: {data.duration || '-'}</p>
                <div className="extend-form-group">
                  <label>연장 일수</label>
                  <div className="extend-days-btns">
                    {[1, 2, 3, 5, 7].map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`extend-day-btn ${extendDays === d ? 'active' : ''}`}
                        onClick={() => setExtendDays(d)}
                      >
                        +{d}일
                      </button>
                    ))}
                  </div>
                  <p className="extend-result">
                    연장 후: {currentDays + extendDays}일
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="extend-modal-hint extend-available">연장 가능 시간 {maxExtendLabel}</p>
                <div className="extend-info-row">
                  <span className="extend-info-label">반납시각</span>
                  <span className="extend-info-value">{formatReturnTimeLabel(newEndDate, newEndTime)}</span>
                </div>
                <div className="extend-info-row">
                  <span className="extend-info-label">추가 결제 요금</span>
                  <span className="extend-info-value fee">+ {additionalFee.toLocaleString()}원</span>
                </div>
                <div className="extend-time-btns">
                  <button type="button" className="extend-time-btn" onClick={() => addExtendMinutes(10)} disabled={extendMinutes >= maxExtendMinutes}>
                    + 10분
                  </button>
                  <button type="button" className="extend-time-btn" onClick={() => addExtendMinutes(30)} disabled={extendMinutes >= maxExtendMinutes}>
                    + 30분
                  </button>
                  <button type="button" className="extend-time-btn" onClick={() => addExtendMinutes(60)} disabled={extendMinutes >= maxExtendMinutes}>
                    + 60분
                  </button>
                  <button type="button" className="extend-time-btn reset" onClick={() => setExtendMinutes(0)}>
                    재설정
                  </button>
                </div>
              </>
            )}
            <div className="extend-modal-actions">
              <button type="button" className="extend-btn-cancel" onClick={() => setShowExtendModal(false)}>
                취소
              </button>
              <button
                type="button"
                className="cta-button extend-btn-confirm"
                onClick={handleExtendConfirm}
                disabled={isAccident ? extendDays <= 0 : extendMinutes <= 0}
              >
                연장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InUse
