import { useState, useMemo, useEffect, Fragment } from 'react'
import { getLicenses } from '../utils/licenseStorage'
import './ReservationForm.css'

const STEP_LABELS_WHEELCHAIR = ['이용·기간', '인수/반납', '운전자', '탑승 보조기기', '차량', '보험·요금']
const STEP_LABELS_ACCIDENT = ['대차 기간', '이용 지역', '사고 차량', '사고 정보', '보험·추가']

/* 진행률 바 4단계: 실제 step → progress 1~4 */
const PROGRESS_LABELS = ['이용 기간', '예약 정보', '탑승 정보', '확인 및 결제']
function getProgressStep(step, isWheelchair) {
  if (isWheelchair) return step <= 1 ? 1 : step <= 3 ? 2 : step <= 5 ? 3 : 4
  return step <= 1 ? 1 : step <= 2 ? 2 : step <= 4 ? 3 : 4
}

const WHEELCHAIR_DEVICES = [
  { id: '휠체어', label: '휠체어' },
  { id: '침대형휠체어', label: '침대형 휠체어' },
  { id: '전동휠체어', label: '전동 휠체어' },
  { id: '전동스쿠터', label: '전동 스쿠터' },
]

const WHEELCHAIR_CARS = [
  { id: 'wc1', name: '카니발 휠체어카', spec: '7인승 · 리프트', price: 30910, deviceInfo: '휠체어, 침대형 휠체어, 전동 휠체어' },
  { id: 'wc2', name: '스타리아 휠체어카', spec: '9인승 · 슬라이드', price: 35910, deviceInfo: '휠체어, 침대형 휠체어, 전동 휠체어, 전동 스쿠터' },
]
const ACCIDENT_CARS = [
  { id: 'ac1', name: '현대 그랜저 IG', spec: '중형', price: 45000 },
  { id: 'ac2', name: '기아 K5', spec: '중형', price: 42000 },
]

const ACCIDENT_PERIOD_OPTIONS = [1, 2, 3, 5, 7]

const INSURANCE_OPTIONS = [
  { id: 'full', name: '완전보장', priceNum: 18080, desc: '사고 시 0원 부담' },
  { id: 'standard', name: '표준 보장', priceNum: 5550, desc: '사고 시 최대 30만원' },
  { id: 'basic', name: '실속보장', priceNum: 0, desc: '사고 시 최대 70만원' },
]

const FAULT_OPTIONS = ['무과실', '10%', '15%', '20%', '30%', '40%', '50%', '모름']
const TIMING_OPTIONS = ['즉시', '2시간 이내', '오늘 중', '내일 중']

function calcDuration(startDate, startTime, endDate, endTime) {
  if (!startDate || !startTime || !endDate || !endTime) return null
  const start = new Date(`${startDate}T${startTime}:00`)
  const end = new Date(`${endDate}T${endTime}:00`)
  if (end <= start) return null
  const diffMs = end - start
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  const hours = Math.round((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  if (days > 0 && hours > 0) return `${days}일 ${hours}시간`
  if (days > 0) return `${days}일`
  return `${hours}시간`
}

function parseTimeHM(str) {
  if (!str) return { h: 0, m: 0 }
  const [h, m] = str.split(':').map(Number)
  return { h: isNaN(h) ? 0 : h, m: isNaN(m) ? 0 : m }
}

function formatTimeHM(h, m) {
  return `${String(h ?? 0).padStart(2, '0')}:${String(m ?? 0).padStart(2, '0')}`
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

function getCalendarGrid(displayDate) {
  const year = displayDate.getFullYear()
  const month = displayDate.getMonth()
  const first = new Date(year, month, 1)
  const startDow = first.getDay()
  const start = new Date(first)
  start.setDate(start.getDate() - startDow)
  const grid = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const dateStr = d.toISOString().slice(0, 10)
    grid.push({
      dateStr,
      day: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
      dayOfWeek: d.getDay(),
    })
  }
  return grid
}

const initialForm = {
  usageType: '단기',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  pickupLocation: '',
  returnLocation: '',
  sameReturn: false,
  driverName: '',
  driverPhone: '',
  driverBirth: '',
  driverLicense: '',
  driverAddress: '',
  carId: '',
  wheelchairDevice: '',
  specialNotes: '',
  driverAge: '만 21세 이상',
  region: '',
  carNumber: '',
  accidentCarName: '',
  carCategory: '국산차',
  faultRatio: '',
  timing: '',
  insuranceId: '',
  insurancePriceNum: 0,
  accidentExtra: '',
  accidentPeriodDays: '',
  insuranceCompany: '',
  accidentReportNo: '',
  hopeCar: '',
  addSecondDriver: false,
  accidentPeriodCustom: '',
}

function ReservationForm({ type, step: stepProp, onStepChange, onComplete, onBack, onOpenLicenseRegister, preFillLicense, onClearPreFillLicense }) {
  const isWheelchair = type === 'wheelchair'
  const [internalStep, setInternalStep] = useState(1)
  const step = stepProp ?? internalStep
  const setStep = (s) => (onStepChange ? onStepChange(s) : setInternalStep(s))
  const [form, setForm] = useState(initialForm)
  const [savedLicenses, setSavedLicenses] = useState([])
  const [selectedLicenseId, setSelectedLicenseId] = useState(null)
  const [showLicenseSelect, setShowLicenseSelect] = useState(false)
  const [displayMonth, setDisplayMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))

  useEffect(() => {
    if (isWheelchair && step === 3) setSavedLicenses(getLicenses())
  }, [isWheelchair, step])

  useEffect(() => {
    if (isWheelchair && step === 3 && preFillLicense) {
      loadLicense(preFillLicense)
      setSelectedLicenseId(preFillLicense.id)
      onClearPreFillLicense?.()
    }
  }, [isWheelchair, step, preFillLicense])

  useEffect(() => {
    if (isWheelchair && step === 3 && savedLicenses.length >= 1 && !selectedLicenseId) {
      loadLicense(savedLicenses[0])
    }
  }, [isWheelchair, step, savedLicenses, selectedLicenseId])

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }))

  const loadLicense = (lic) => {
    if (!lic) return
    const licenseNum = lic.licenseNumber || lic.license || ''
    const fullAddress = [lic.address, lic.addressDetail].filter(Boolean).join(' ').trim() || lic.address || ''
    setForm((p) => ({
      ...p,
      driverName: lic.name || p.driverName,
      driverPhone: lic.phone || p.driverPhone,
      driverBirth: lic.birth || p.driverBirth,
      driverLicense: licenseNum,
      driverAddress: fullAddress,
    }))
    setSelectedLicenseId(lic.id)
  }

  const duration = useMemo(
    () => calcDuration(form.startDate, form.startTime, form.endDate, form.endTime),
    [form.startDate, form.startTime, form.endDate, form.endTime]
  )

  const startHM = parseTimeHM(form.startTime)
  const endHM = parseTimeHM(form.endTime)
  const setStartHM = (h, m) => update('startTime', formatTimeHM(h, m))
  const setEndHM = (h, m) => update('endTime', formatTimeHM(h, m))

  const calendarGrid = useMemo(() => getCalendarGrid(displayMonth), [displayMonth])
  const isInRange = (dateStr) => {
    if (!form.startDate || !form.endDate) return false
    return dateStr >= form.startDate && dateStr <= form.endDate
  }
  const isStartOrEnd = (dateStr) => dateStr === form.startDate || dateStr === form.endDate
  const handleDateClick = (dateStr) => {
    if (!form.startDate || (form.startDate && form.endDate)) {
      update('startDate', dateStr)
      update('endDate', '')
      return
    }
    if (dateStr < form.startDate) {
      update('endDate', form.startDate)
      update('startDate', dateStr)
    } else {
      update('endDate', dateStr)
    }
  }

  const summaryLine = form.startDate && form.startTime && form.endDate && form.endTime
    ? `${form.startDate.slice(5, 7)}/${form.startDate.slice(8, 10)} ${form.startTime} → ${form.endDate.slice(5, 7)}/${form.endDate.slice(8, 10)} ${form.endTime}`
    : ''

  const stepLabels = isWheelchair ? STEP_LABELS_WHEELCHAIR : STEP_LABELS_ACCIDENT
  const carList = isWheelchair ? WHEELCHAIR_CARS : ACCIDENT_CARS
  const selectedCar = carList.find((c) => c.id === form.carId)
  const baseFee = selectedCar ? selectedCar.price : 0
  const totalPrice = baseFee + (form.insurancePriceNum || 0)

  const getCompletePayload = () => {
    const typeLabel = isWheelchair ? '휠체어카 렌트' : '사고 대차 렌트'
    const accidentDuration = !isWheelchair && (form.accidentPeriodDays === 'custom' ? form.accidentPeriodCustom : form.accidentPeriodDays ? `${form.accidentPeriodDays}일` : '')
    return {
      type: typeLabel,
      car: isWheelchair ? (selectedCar?.name || '') : (form.hopeCar || ''),
      usageType: form.usageType,
      duration: isWheelchair ? duration : accidentDuration,
      startDate: form.startDate,
      startTime: form.startTime,
      endDate: form.endDate,
      endTime: form.endTime,
      pickupLocation: form.pickupLocation,
      returnLocation: form.sameReturn ? form.pickupLocation : form.returnLocation,
      estimatedPrice: isWheelchair ? `${totalPrice.toLocaleString()}원` : '상담 후 확정',
      insurance: INSURANCE_OPTIONS.find((i) => i.id === form.insuranceId)?.name || '',
      region: form.region,
      insuranceCompany: form.insuranceCompany,
      accidentReportNo: form.accidentReportNo,
      hopeCar: form.hopeCar,
    }
  }

  const [showConfirm, setShowConfirm] = useState(false)

  const maxStep = stepLabels.length
  const handleNext = (e) => {
    e.preventDefault()
    if (step < maxStep) {
      setStep(step + 1)
      return
    }
    setShowConfirm(true)
  }

  const handleConfirmReservation = () => {
    onComplete(getCompletePayload())
    setShowConfirm(false)
  }

  const isLast = step === maxStep
  const progressStep = getProgressStep(step, isWheelchair)

  return (
    <div className="reservation-form-page">
      <div className="progress-wrap">
        <div className="progress-stepper">
          {PROGRESS_LABELS.map((label, i) => {
            const n = i + 1
            const done = n < progressStep
            const active = n === progressStep
            return (
              <Fragment key={`progress-${n}`}>
                <div className={`progress-step-item ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
                  <div className="progress-step-dot">{n}</div>
                  <span className="progress-step-label">{label}</span>
                </div>
                {i < PROGRESS_LABELS.length - 1 && (
                  <div className={`progress-step-line ${progressStep > n ? 'done' : ''}`} aria-hidden="true" />
                )}
              </Fragment>
            )
          })}
        </div>
      </div>

      <form onSubmit={handleNext} className="reservation-form" noValidate>
        {/* Step 1: 휠체어 = 이용시간 설정 / 사고대차 = 대차 이용 기간 */}
        {step === 1 && isWheelchair && (
          <div className="form-step step-time-settings">
            <h2 className="step-heading step-title-main">이용시간 설정</h2>

            <div className="time-settings-box">
              <div className="time-setting-row">
                <label>시작 시간</label>
                <div className="time-inputs">
                  <input type="number" min={0} max={23} value={startHM.h || ''} onChange={(e) => setStartHM(Number(e.target.value) || 0, startHM.m)} placeholder="00" className="time-h" />
                  <span className="time-unit">시</span>
                  <input type="number" min={0} max={59} value={startHM.m || ''} onChange={(e) => setStartHM(startHM.h, Number(e.target.value) || 0)} placeholder="00" className="time-m" />
                  <span className="time-unit">분</span>
                </div>
              </div>
              <div className="time-setting-row">
                <label>반납 시간</label>
                <div className="time-inputs">
                  <input type="number" min={0} max={23} value={endHM.h || ''} onChange={(e) => setEndHM(Number(e.target.value) || 0, endHM.m)} placeholder="00" className="time-h" />
                  <span className="time-unit">시</span>
                  <input type="number" min={0} max={59} value={endHM.m || ''} onChange={(e) => setEndHM(endHM.h, Number(e.target.value) || 0)} placeholder="00" className="time-m" />
                  <span className="time-unit">분</span>
                </div>
              </div>
            </div>

            <div className="calendar-wrap">
              <div className="calendar-header">
                <button type="button" className="calendar-nav" onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1))} aria-label="이전 달">&lt;</button>
                <span className="calendar-month">{displayMonth.getFullYear()}년 {MONTH_NAMES[displayMonth.getMonth()]}</span>
                <button type="button" className="calendar-nav" onClick={() => setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1))} aria-label="다음 달">&gt;</button>
              </div>
              <div className="calendar-weekdays">
                {WEEKDAYS.map((w, i) => (
                  <span key={i} className={`weekday ${i === 0 || i === 6 ? 'weekend' : ''}`}>{w}</span>
                ))}
              </div>
              <div className="calendar-grid">
                {calendarGrid.map((cell) => (
                  <button
                    key={cell.dateStr}
                    type="button"
                    className={`calendar-day ${!cell.isCurrentMonth ? 'other-month' : ''} ${isInRange(cell.dateStr) ? 'in-range' : ''} ${isStartOrEnd(cell.dateStr) ? 'selected' : ''} ${cell.dayOfWeek === 0 || cell.dayOfWeek === 6 ? 'weekend' : ''}`}
                    onClick={() => handleDateClick(cell.dateStr)}
                  >
                    {cell.day}
                  </button>
                ))}
              </div>
            </div>

            {duration && (
              <div className="reservation-summary-box">
                <p className="summary-duration">{duration} 예약</p>
                {summaryLine && <p className="summary-range">{summaryLine}</p>}
              </div>
            )}
          </div>
        )}

        {/* Step 1: 사고 대차 - 대차 이용 기간 */}
        {step === 1 && !isWheelchair && (
          <div className="form-step">
            <h2 className="step-heading">대차 이용 기간</h2>
            <p className="form-hint">※ 실제 이용 시작·종료 시각은 상담을 통해 확정됩니다.</p>
            <div className="period-options">
              {ACCIDENT_PERIOD_OPTIONS.map((days) => (
                <button
                  key={days}
                  type="button"
                  className={`period-btn ${form.accidentPeriodDays === days ? 'active' : ''}`}
                  onClick={() => update('accidentPeriodDays', days)}
                >
                  {days}일
                </button>
              ))}
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.accidentPeriodDays === 'custom'} onChange={(e) => update('accidentPeriodDays', e.target.checked ? 'custom' : '')} />
                직접 입력 (선택)
              </label>
              {form.accidentPeriodDays === 'custom' && (
                <input type="text" value={form.accidentPeriodCustom || ''} onChange={(e) => update('accidentPeriodCustom', e.target.value)} placeholder="예: 3일" className="input-below" />
              )}
            </div>
          </div>
        )}

        {/* Step 2: 휠체어 = 인수/반납 / 사고대차 = 이용 지역 */}
        {step === 2 && isWheelchair && (
          <div className="form-step">
            <h2 className="step-heading">인수 / 반납 장소</h2>
            <p className="form-hint">※ 지도에는 회사가 사전 등록한 장소만 핀으로 표시됩니다. 임의 위치 선택 불가.</p>
            <div className="location-card-placeholder">
              <p className="location-placeholder-text">지도에서 장소 선택 시 하단에 표시됩니다.</p>
              {form.pickupLocation && <p className="location-selected">{form.pickupLocation}</p>}
              <div className="location-actions">
                <input type="text" value={form.pickupLocation} onChange={(e) => update('pickupLocation', e.target.value)} placeholder="인수 장소 (지도에서 선택)" className="location-input" />
                <button type="button" className="btn-pin" onClick={() => { /* 지도 열기 (추후 구현) */ }} aria-label="지도에서 인수 장소 선택">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.sameReturn} onChange={(e) => update('sameReturn', e.target.checked)} />
                인수 장소와 동일
              </label>
              {!form.sameReturn && (
                <div className="location-actions return-location">
                  <input type="text" value={form.returnLocation} onChange={(e) => update('returnLocation', e.target.value)} placeholder="반납 장소 (지도에서 선택)" className="location-input" />
                  <button type="button" className="btn-pin" onClick={() => { /* 지도 열기 (추후 구현) */ }} aria-label="지도에서 반납 장소 선택">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        {step === 2 && !isWheelchair && (
          <div className="form-step">
            <h2 className="step-heading">이용 지역</h2>
            <p className="form-hint">대차 이용 지역을 선택해 주세요. (필수)</p>
            <div className="form-group">
              <label>이용 지역 *</label>
              <input type="text" value={form.region} onChange={(e) => update('region', e.target.value)} placeholder="예: 서울시 강남구" />
            </div>
          </div>
        )}

        {/* Step 3: 휠체어 = 운전자 정보 / 사고대차 = 사고 차량 정보 */}
        {step === 3 && isWheelchair && (
          <div className="form-step">
            <h2 className="step-heading">운전자 정보</h2>
            <p className="form-hint">※ 면허 선택/등록 시 유효성 조회(정지/취소/만료 여부) 수행 · 입력 정보는 계약서 자동 생성에 사용</p>

            <div className="form-group">
              <label>이름 *</label>
              <input type="text" value={form.driverName} onChange={(e) => update('driverName', e.target.value)} placeholder="홍길동" />
            </div>
            <div className="form-group">
              <label>연락처 *</label>
              <input type="text" value={form.driverPhone} onChange={(e) => update('driverPhone', e.target.value)} placeholder="010-0000-0000" />
            </div>
            <div className="form-group">
              <label>생년월일 *</label>
              <input type="text" value={form.driverBirth} onChange={(e) => update('driverBirth', e.target.value)} placeholder="1990-01-01" />
            </div>
            <div className="form-group">
              <label>주소 *</label>
              <button type="button" className="btn-address-search" onClick={() => update('driverAddress', '(주소 검색 예정)')}>
                주소 찾기
              </button>
              {form.driverAddress && <p className="address-selected">{form.driverAddress}</p>}
            </div>

            {savedLicenses.length === 0 ? (
              <div className="form-group">
                <label>면허 정보 *</label>
                <button type="button" className="btn-license-register-inline btn-license-only" onClick={onOpenLicenseRegister}>
                  면허 등록
                </button>
              </div>
            ) : (
              <div className="form-group">
                <label>면허 정보</label>
                {(() => {
                  const selected = savedLicenses.find((l) => l.id === selectedLicenseId) || savedLicenses[0]
                  return (
                    <>
                      <p className="license-summary">
                        등록된 면허: {selected.name} · {selected.licenseType || '2종 보통'} · {selected.licenseNumber || selected.license} (사용 가능)
                      </p>
                      {showLicenseSelect && savedLicenses.length > 1 && (
                        <select
                          value={selectedLicenseId || ''}
                          onChange={(e) => {
                            const id = e.target.value
                            const lic = savedLicenses.find((l) => l.id === id)
                            if (lic) {
                              loadLicense(lic)
                              setShowLicenseSelect(false)
                            }
                          }}
                          className="license-select license-select-inline"
                        >
                          {savedLicenses.map((lic) => (
                            <option key={lic.id} value={lic.id}>
                              {lic.name} · {lic.licenseNumber || lic.license} (사용 가능)
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        type="button"
                        className="btn-license-change"
                        onClick={() =>
                          savedLicenses.length === 1 ? onOpenLicenseRegister() : setShowLicenseSelect((v) => !v)
                        }
                      >
                        {savedLicenses.length === 1 ? '면허 추가 등록' : showLicenseSelect ? '선택 닫기' : '다른 면허로 변경'}
                      </button>
                    </>
                  )
                })()}
              </div>
            )}

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.addSecondDriver} onChange={(e) => update('addSecondDriver', e.target.checked)} />
                제2 운전자 추가 (선택)
              </label>
              {form.addSecondDriver && (
                <p className="form-hint">제2 운전자도 동일하게 면허 선택/등록 후 정보를 입력해 주세요.</p>
              )}
            </div>
          </div>
        )}
        {step === 3 && !isWheelchair && (
          <div className="form-step">
            <h2 className="step-heading">사고 차량 정보</h2>
            <div className="form-group">
              <label>차량 번호</label>
              <div className="input-with-btn">
                <input type="text" value={form.carNumber} onChange={(e) => update('carNumber', e.target.value)} placeholder="12가 3456" />
                <button type="button" className="btn-small">조회</button>
              </div>
            </div>
            <div className="form-group">
              <label>차량명</label>
              <input type="text" value={form.accidentCarName} onChange={(e) => update('accidentCarName', e.target.value)} placeholder="예: 현대 그랜저" />
            </div>
            <div className="form-group">
              <label>차량 구분</label>
              <div className="radio-row">
                <label><input type="radio" name="cat" checked={form.carCategory === '국산차'} onChange={() => update('carCategory', '국산차')} /> 국산차</label>
                <label><input type="radio" name="cat" checked={form.carCategory === '수입차'} onChange={() => update('carCategory', '수입차')} /> 수입차</label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: 휠체어 = 탑승 보조기기 선택 / 사고대차 = 사고 정보 */}
        {step === 4 && isWheelchair && (
          <div className="form-step">
            <h2 className="step-heading">탑승 보조기기 선택</h2>
            <p className="form-hint">※ 보조기기 정보는 안전한 탑승 및 차량 매칭을 위해 필수 입력</p>
            <div className="form-group">
              <label>탑승 보조기기 유형 *</label>
              <div className="device-grid">
                {WHEELCHAIR_DEVICES.map((d) => (
                  <button key={d.id} type="button" className={`device-card ${form.wheelchairDevice === d.id ? 'selected' : ''}`} onClick={() => update('wheelchairDevice', d.id)}>
                    <span className="device-icon">♿</span>
                    <span className="device-label">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>특이사항 (선택)</label>
              <textarea value={form.specialNotes} onChange={(e) => update('specialNotes', e.target.value)} placeholder="추가로 전달할 사항" rows={3} />
            </div>
          </div>
        )}
        {step === 4 && !isWheelchair && (
          <div className="form-step">
            <h2 className="step-heading">사고 정보</h2>
            <div className="form-group">
              <label>운전자 나이 기준</label>
              <div className="radio-row">
                <label><input type="radio" name="age" checked={form.driverAge === '만 21세 이상'} onChange={() => update('driverAge', '만 21세 이상')} /> 만 21세 이상</label>
                <label><input type="radio" name="age" checked={form.driverAge === '만 26세 이상'} onChange={() => update('driverAge', '만 26세 이상')} /> 만 26세 이상</label>
              </div>
            </div>
            <div className="form-group">
              <label>고객 예상 과실 비율</label>
              <select value={form.faultRatio} onChange={(e) => update('faultRatio', e.target.value)}>
                <option value="">선택</option>
                {FAULT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>배차 요청 시점</label>
              <select value={form.timing} onChange={(e) => update('timing', e.target.value)}>
                <option value="">선택</option>
                {TIMING_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 5: 휠체어 = 차량 선택 / 사고대차 = 보험 정보 + 추가 요청 */}
        {step === 5 && isWheelchair && (
          <div className="form-step">
            <h2 className="step-heading">차량 선택</h2>
            <p className="form-hint">휠체어카 전용 차량 · 탑승 가능 보조기기 정보를 확인해 주세요.</p>
            <ul className="car-list">
              {carList.map((car) => (
                <li key={car.id} className="car-list-item">
                  <div className="car-thumb" />
                  <div className="car-info">
                    <span className="car-name">{car.name}</span>
                    <span className="car-spec">{car.spec} · {car.price.toLocaleString()}원</span>
                    {car.deviceInfo && <span className="car-device-info">탑승 가능: {car.deviceInfo}</span>}
                  </div>
                  <label className="car-radio">
                    <input type="radio" name="car" checked={form.carId === car.id} onChange={() => update('carId', car.id)} />
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
        {step === 5 && !isWheelchair && (
          <div className="form-step">
            <h2 className="step-heading">보험 정보</h2>
            <div className="form-group">
              <label>보험사명</label>
              <input type="text" value={form.insuranceCompany} onChange={(e) => update('insuranceCompany', e.target.value)} placeholder="예: OO손해보험" />
            </div>
            <div className="form-group">
              <label>사고 접수 번호 (선택)</label>
              <input type="text" value={form.accidentReportNo} onChange={(e) => update('accidentReportNo', e.target.value)} placeholder="접수 번호" />
            </div>
            <h3 className="subsection-title">추가 요청 정보 (선택)</h3>
            <div className="form-group">
              <label>희망 차량</label>
              <input type="text" value={form.hopeCar} onChange={(e) => update('hopeCar', e.target.value)} placeholder="희망 차량" />
            </div>
            <div className="form-group">
              <label>추가 요청 사항</label>
              <textarea value={form.accidentExtra} onChange={(e) => update('accidentExtra', e.target.value)} placeholder="추가로 전달할 사항" rows={3} />
            </div>
          </div>
        )}

        {/* Step 6: 휠체어 = 보험·요금 / 사고대차 = 차량·요금 안내 + CTA */}
        {step === 6 && isWheelchair && (
          <div className="form-step">
            <h2 className="step-heading">보험 / 요금</h2>
            <div className="form-group">
              <label>보험 선택</label>
              <div className="insurance-cards">
                {INSURANCE_OPTIONS.map((ins) => (
                  <button
                    key={ins.id}
                    type="button"
                    className={`insurance-card ${form.insuranceId === ins.id ? 'selected' : ''}`}
                    onClick={() => { update('insuranceId', ins.id); update('insurancePriceNum', ins.priceNum) }}
                  >
                    <div className="insurance-name">{ins.name}</div>
                    <div className="insurance-desc">{ins.desc}</div>
                    <div className="insurance-price">{ins.priceNum > 0 ? `+ ${ins.priceNum.toLocaleString()}원` : '무료'}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="price-footer">
              <div className="price-row"><span>대여 요금</span><span>{baseFee > 0 ? `${baseFee.toLocaleString()}원` : '-'}</span></div>
              <div className="price-row"><span>보험료</span><span>{form.insurancePriceNum !== undefined ? `${(form.insurancePriceNum || 0).toLocaleString()}원` : '-'}</span></div>
              <div className="price-row total"><span>예상 결제 금액</span><span>{totalPrice > 0 ? `${totalPrice.toLocaleString()}원` : '-'}</span></div>
            </div>
          </div>
        )}
        <div className="form-actions">
          <span />
          <button type="submit" className="cta-button">
            {step === 1 && isWheelchair ? '탑승 정보 입력하기' : isLast ? '예약 요청하기' : '다음'}
          </button>
        </div>
      </form>

      {showConfirm && (() => {
        const summary = getCompletePayload()
        return (
          <div className="confirm-overlay" onClick={() => setShowConfirm(false)} aria-hidden="true">
            <div className="confirm-popup" onClick={(e) => e.stopPropagation()}>
              <p className="confirm-message">예약 하시겠습니까?</p>
              <div className="confirm-summary">
                <div className="confirm-summary-row"><span className="confirm-summary-label">예약 유형</span><span>{summary.type}</span></div>
                {isWheelchair && (
                  <div className="confirm-summary-row"><span className="confirm-summary-label">이용 형태</span><span>{summary.usageType || '-'}</span></div>
                )}
                <div className="confirm-summary-row">
                  <span className="confirm-summary-label">이용 기간</span>
                  <span>
                    {isWheelchair && summary.startDate && summary.startTime && summary.endDate && summary.endTime
                      ? `${summary.startDate} ${summary.startTime} ~ ${summary.endDate} ${summary.endTime}`
                      : (summary.duration || '-')}
                  </span>
                </div>
                {isWheelchair && (
                  <div className="confirm-summary-row">
                    <span className="confirm-summary-label">인수/반납</span>
                    <span>{[summary.pickupLocation || '-', summary.returnLocation || '-'].join(' → ')}</span>
                  </div>
                )}
                {!isWheelchair && (
                  <div className="confirm-summary-row"><span className="confirm-summary-label">이용 지역</span><span>{summary.region || '-'}</span></div>
                )}
                <div className="confirm-summary-row">
                  <span className="confirm-summary-label">{isWheelchair ? '차량' : '희망 차량'}</span>
                  <span>{summary.car || summary.hopeCar || '-'}</span>
                </div>
                <div className="confirm-summary-row">
                  <span className="confirm-summary-label">예상 요금</span>
                  <span>{summary.estimatedPrice && summary.estimatedPrice !== '상담 후 확정' ? summary.estimatedPrice : '-'}</span>
                </div>
                <div className="confirm-summary-row"><span className="confirm-summary-label">보험</span><span>{summary.insurance || '-'}</span></div>
                {!isWheelchair && (
                  <div className="confirm-summary-row"><span className="confirm-summary-label">보험사</span><span>{summary.insuranceCompany || '-'}</span></div>
                )}
              </div>
              <div className="confirm-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowConfirm(false)}>취소</button>
                <button type="button" className="cta-button" onClick={handleConfirmReservation}>확인</button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

export default ReservationForm
