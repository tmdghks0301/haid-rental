import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ReservationForm.css'

const WHEELCHAIR_OPTIONS = [
  { id: '휠체어', label: '휠체어' },
  { id: '침대형휠체어', label: '침대형휠체어' },
  { id: '전동휠체어', label: '전동휠체어' },
  { id: '전동스쿠터', label: '전동스쿠터' },
  { id: '사용하지않음', label: '사용하지않음' },
]

const CARS_WITH_PRICE = [
  { id: '카니발', name: '카니발', price: '30,910' },
  { id: '스타렉스1', name: '스타렉스', price: '30,910' },
  { id: '스타렉스2', name: '스타렉스', price: '30,910' },
  { id: '카니발2', name: '카니발', price: '30,910' },
  { id: '카니발3', name: '카니발', price: '30,910' },
]

const INSURANCE_CARDS = [
  { id: '완전보장', name: '완전보장', desc: '사고 시 0원 부담, 장거리 이동 중 사고 견인 및 긁기 쉬운 타이어·휠파손 보장', price: '+ 18,080원', priceNum: 18080 },
  { id: '표준 보장', name: '표준 보장', desc: '사고 시 최대 30만원 부담', price: '+ 5,550원', priceNum: 5550 },
  { id: '실속보장', name: '실속보장', desc: '사고 시 최대 70만원 부담', price: '무료', priceNum: 0 },
]

const FAULT_OPTIONS = ['무과실', '10%', '15%', '20%', '30%', '40%', '50%', '모름']
const TIMING_OPTIONS = ['즉시', '2시간 이내', '오늘 중', '내일 중']
const CARS = ['현대 그랜저 IG', '기아 K5', '현대 소나타', '기아 K8']
const INSURANCES = ['자차 면제 가입', '자차 10만원', '자차 30만원']

const WHEELCHAIR_STEPS = ['이용시간 설정', '탑승 보조기기', '차량 선택', '보험·요약']
const ACCIDENT_STEPS = ['기본 정보', '사고·배차 정보', '추가 선택', '차량·보험']

const SPECIAL_NOTES_MAX = 200

function ReservationForm() {
  const { type } = useParams()
  const navigate = useNavigate()
  const isWheelchair = type === 'wheelchair'
  const isAccident = type === 'accident'

  const totalSteps = isWheelchair ? 4 : 4
  const stepLabels = isWheelchair ? WHEELCHAIR_STEPS : ACCIDENT_STEPS

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    car: '',
    carId: '',
    insurance: '',
    insurancePriceNum: 0,
    usageType: '단기',
    rentalPeriod: '',
    rentalPeriodEnd: '',
    rentalTime: '',
    rentalTimeEnd: '',
    wheelchairType: '',
    specialNotes: '',
    driverAge: '만 21세 이상',
    region: '',
    carNumber: '',
    carName: '',
    carCategory: '국산차',
    faultRatio: '',
    timing: '',
    insuranceInfo: '',
    acceptNumber: '',
    rentalDays: '',
    preferredCar: '',
    extraRequests: '',
  })

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const progressPercent = (step / totalSteps) * 100

  const canGoNext = () => {
    if (isWheelchair) {
      if (step === 1) return formData.rentalPeriod && formData.rentalTime && formData.rentalPeriodEnd && formData.rentalTimeEnd
      if (step === 2) return !!formData.wheelchairType
      if (step === 3) return !!formData.carId
      if (step === 4) return !!formData.insurance
    }
    if (isAccident) {
      if (step === 1) return !!formData.region && !!formData.carNumber && !!formData.carName
      if (step === 2) return true
      if (step === 3) return true
      if (step === 4) return formData.car && formData.insurance
    }
    return false
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (step < totalSteps) {
      if (step === 1 && isWheelchair && (!formData.rentalPeriod || !formData.rentalTime || !formData.rentalPeriodEnd || !formData.rentalTimeEnd)) {
        alert('시작·반납 날짜와 시간을 입력해 주세요.')
        return
      }
      if (step === 1 && isAccident && (!formData.region || !formData.carNumber || !formData.carName)) {
        alert('필수 항목(이용 지역, 차량 번호, 차량명)을 입력해 주세요.')
        return
      }
      if (step === 2 && isWheelchair && !formData.wheelchairType) {
        alert('탑승 보조기기 유형을 선택해 주세요.')
        return
      }
      if (step === 3 && isWheelchair && !formData.carId) {
        alert('차량을 선택해 주세요.')
        return
      }
      if (step === 4 && isWheelchair && !formData.insurance) {
        alert('보험을 선택해 주세요.')
        return
      }
      if (step === totalSteps && isAccident && (!formData.car || !formData.insurance)) {
        alert('차량과 보험을 선택해 주세요.')
        return
      }
      setStep((s) => s + 1)
    }
  }

  const handlePrev = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  const totalPrice = isWheelchair && formData.insurance
    ? 30910 + (formData.insurancePriceNum || 0)
    : 52040

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canGoNext()) {
      alert('필수 항목을 입력해 주세요.')
      return
    }
    const estimatedPrice = isWheelchair ? `${totalPrice.toLocaleString()}원` : '52,040원'
    localStorage.setItem('reservationData', JSON.stringify({
      type,
      ...formData,
      car: isWheelchair ? (CARS_WITH_PRICE.find(c => c.id === formData.carId)?.name || formData.car) : formData.car,
      estimatedPrice,
      createdAt: new Date().toISOString(),
    }))
    navigate('/reservation-complete')
  }

  if (type !== 'wheelchair' && type !== 'accident') {
    navigate('/')
    return null
  }

  const isLastStep = step === totalSteps

  const getTimeSummary = () => {
    if (!formData.rentalPeriod || !formData.rentalPeriodEnd || !formData.rentalTime || !formData.rentalTimeEnd) return null
    const start = `${formData.rentalPeriod} ${formData.rentalTime}`.replace(/-/g, '/').replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$2/$3')
    const end = `${formData.rentalPeriodEnd} ${formData.rentalTimeEnd}`.replace(/-/g, '/').replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$2/$3')
    return `${start} → ${end}`
  }

  const nextButtonText = () => {
    if (isWheelchair) {
      if (step === 1) return '탑승 정보 입력하기 >'
      if (step === 2) return '차량 선택하기 >'
      if (step === 3) return '보험 선택하기 >'
      return '예약 요청 >'
    }
    return isLastStep ? '예약 요청하기' : '다음'
  }

  return (
    <div className="reservation-form-page">
      {stepLabels.length > 0 && (
        <>
          <div className="progress-wrap">
            <div className="progress-step-labels">
              {stepLabels.map((label, i) => (
                <span key={label} className={`progress-step-label ${i + 1 <= step ? 'active' : ''}`}>
                  {i + 1}. {label}
                </span>
              ))}
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="progress-text">{step} / {totalSteps}</div>
          </div>
        </>
      )}

      <form onSubmit={isLastStep ? handleSubmit : handleNext} className="reservation-form">
        {/* ========== 휠체어카 Step 1: 이용시간 설정 ========== */}
        {isWheelchair && step === 1 && (
          <div className="form-step">
            <h2 className="step-heading">이용시간 설정</h2>
            <div className="tabs">
              <button type="button" className={`tab ${formData.usageType === '단기' ? 'active' : ''}`} onClick={() => updateField('usageType', '단기')}>단기이용</button>
              <button type="button" className={`tab ${formData.usageType === '장기' ? 'active' : ''}`} onClick={() => updateField('usageType', '장기')}>장기이용</button>
            </div>
            <div className="form-group">
              <label>시작 시간</label>
              <div className="time-row">
                <input type="date" value={formData.rentalPeriod} onChange={(e) => updateField('rentalPeriod', e.target.value)} required />
                <input type="time" value={formData.rentalTime} onChange={(e) => updateField('rentalTime', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label>반납 시간</label>
              <div className="time-row">
                <input type="date" value={formData.rentalPeriodEnd} onChange={(e) => updateField('rentalPeriodEnd', e.target.value)} required />
                <input type="time" value={formData.rentalTimeEnd} onChange={(e) => updateField('rentalTimeEnd', e.target.value)} required />
              </div>
            </div>
            {getTimeSummary() && (
              <div className="summary-box">
                <div className="summary-line">1일 3시간 예약</div>
                <div className="summary-line highlight">{getTimeSummary()}</div>
              </div>
            )}
          </div>
        )}

        {/* ========== 휠체어카 Step 2: 탑승 보조기기 ========== */}
        {isWheelchair && step === 2 && (
          <div className="form-step">
            <h2 className="step-heading">탑승 보조기기 유형</h2>
            <div className="device-grid">
              {WHEELCHAIR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`device-card ${formData.wheelchairType === opt.id ? 'selected' : ''}`}
                  onClick={() => updateField('wheelchairType', opt.id)}
                >
                  <span className="device-icon">{opt.id === '사용하지않음' ? '—' : '♿'}</span>
                  <span className="device-label">{opt.label}</span>
                </button>
              ))}
            </div>
            <div className="form-group">
              <label>특이사항(선택)</label>
              <textarea
                value={formData.specialNotes}
                onChange={(e) => updateField('specialNotes', e.target.value.slice(0, SPECIAL_NOTES_MAX))}
                placeholder="추가로 전달해야 할 사항을 적어주세요."
                rows={3}
                maxLength={SPECIAL_NOTES_MAX}
              />
              <span className="char-count">{formData.specialNotes.length}/{SPECIAL_NOTES_MAX}</span>
            </div>
          </div>
        )}

        {/* ========== 휠체어카 Step 3: 이용 가능한 차량 ========== */}
        {isWheelchair && step === 3 && (
          <div className="form-step">
            <h2 className="step-heading">이용 가능한 차량</h2>
            <ul className="car-list">
              {CARS_WITH_PRICE.map((car) => (
                <li key={car.id} className="car-list-item">
                  <div className="car-thumb" />
                  <div className="car-info">
                    <span className="car-name">{car.name}</span>
                    <span className="car-price">{Number(car.price).toLocaleString()}원</span>
                  </div>
                  <label className="car-radio">
                    <input type="radio" name="car" checked={formData.carId === car.id} onChange={() => updateField('carId', car.id)} />
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ========== 휠체어카 Step 4: 차량 요약 + 보험 ========== */}
        {isWheelchair && step === 4 && (
          <div className="form-step">
            <div className="vehicle-summary-card">
              <div className="vehicle-thumb" />
              <div className="vehicle-detail">
                <div className="vehicle-name">{formData.carId ? CARS_WITH_PRICE.find(c => c.id === formData.carId)?.name : ''} - 휠체어 카</div>
                <div className="vehicle-fuel">경유</div>
              </div>
            </div>
            <div className="usage-time-summary">
              <h3 className="subsection-title">이용시간</h3>
              <p className="usage-total">총 1일 3시간</p>
              <p className="usage-range">{getTimeSummary() || '-'}</p>
            </div>
            <div className="insurance-section">
              <h3 className="subsection-title">보험 및 보장 상품</h3>
              <p className="insurance-note">보험은 기본 포함되어 있습니다.</p>
              <div className="insurance-cards">
                {INSURANCE_CARDS.map((ins) => (
                  <button
                    key={ins.id}
                    type="button"
                    className={`insurance-card ${formData.insurance === ins.id ? 'selected' : ''}`}
                    onClick={() => { updateField('insurance', ins.id); updateField('insurancePriceNum', ins.priceNum) }}
                  >
                    <div className="insurance-name">{ins.name}</div>
                    <div className="insurance-desc">{ins.desc}</div>
                    <div className="insurance-price">{ins.price}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========== 사고대차 Step 1~4 (기존 유지) ========== */}
        {isAccident && step === 1 && (
          <div className="form-step">
            <div className="form-group">
              <label>운전자 나이 기준</label>
              <div className="radio-group">
                <label className="radio-label"><input type="radio" name="driverAge" checked={formData.driverAge === '만 21세 이상'} onChange={() => updateField('driverAge', '만 21세 이상')} /> 만 21세 이상</label>
                <label className="radio-label"><input type="radio" name="driverAge" checked={formData.driverAge === '만 26세 이상'} onChange={() => updateField('driverAge', '만 26세 이상')} /> 만 26세 이상</label>
              </div>
            </div>
            <div className="form-group">
              <label>이용 지역 <span className="required">*</span></label>
              <input type="text" value={formData.region} onChange={(e) => updateField('region', e.target.value)} placeholder="예: 서울시 강남구" required />
            </div>
            <div className="form-group">
              <label>차량 번호</label>
              <div className="input-with-button">
                <input type="text" value={formData.carNumber} onChange={(e) => updateField('carNumber', e.target.value)} placeholder="12가 3456" />
                <button type="button" className="lookup-btn">조회</button>
              </div>
            </div>
            <div className="form-group">
              <label>차량명</label>
              <input type="text" value={formData.carName} onChange={(e) => updateField('carName', e.target.value)} placeholder="예: 현대 그랜저" />
            </div>
            <div className="form-group">
              <label>차량 구분</label>
              <div className="radio-group">
                <label className="radio-label"><input type="radio" name="carCategory" checked={formData.carCategory === '국산차'} onChange={() => updateField('carCategory', '국산차')} /> 국산차</label>
                <label className="radio-label"><input type="radio" name="carCategory" checked={formData.carCategory === '수입차'} onChange={() => updateField('carCategory', '수입차')} /> 수입차</label>
              </div>
            </div>
          </div>
        )}
        {isAccident && step === 2 && (
          <div className="form-step">
            <div className="form-group">
              <label>고객 예상 과실 비율</label>
              <select value={formData.faultRatio} onChange={(e) => updateField('faultRatio', e.target.value)}>
                <option value="">선택하세요</option>
                {FAULT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>배차 요청 시점</label>
              <select value={formData.timing} onChange={(e) => updateField('timing', e.target.value)}>
                <option value="">선택하세요</option>
                {TIMING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>보험사 정보 및 접수 번호 (선택)</label>
              <input type="text" value={formData.insuranceInfo} onChange={(e) => updateField('insuranceInfo', e.target.value)} placeholder="보험사명 / 접수번호" />
            </div>
          </div>
        )}
        {isAccident && step === 3 && (
          <div className="form-step">
            <div className="form-group">
              <label>대차 필요 기간 (선택)</label>
              <input type="text" value={formData.rentalDays} onChange={(e) => updateField('rentalDays', e.target.value)} placeholder="예: 7일" />
            </div>
            <div className="form-group">
              <label>희망 차량 (선택)</label>
              <input type="text" value={formData.preferredCar} onChange={(e) => updateField('preferredCar', e.target.value)} placeholder="예: 중형차" />
            </div>
            <div className="form-group">
              <label>추가 요청 사항 (선택)</label>
              <textarea value={formData.extraRequests} onChange={(e) => updateField('extraRequests', e.target.value)} placeholder="추가로 안내할 사항이 있으시면 입력해 주세요." rows={3} />
            </div>
          </div>
        )}
        {isAccident && step === 4 && (
          <div className="form-step">
            <div className="form-group">
              <label>차량 선택</label>
              <select value={formData.car} onChange={(e) => updateField('car', e.target.value)} required>
                <option value="">선택하세요</option>
                {CARS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>보험 선택</label>
              <select value={formData.insurance} onChange={(e) => updateField('insurance', e.target.value)} required>
                <option value="">선택하세요</option>
                {INSURANCES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
        )}

        <div className={`form-actions ${step === 1 ? 'form-actions-single' : ''}`}>
          {step > 1 ? <button type="button" className="btn-prev" onClick={handlePrev}>이전</button> : <span />}
          <button type="submit" className="cta-button form-submit-btn">
            {nextButtonText()}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReservationForm
