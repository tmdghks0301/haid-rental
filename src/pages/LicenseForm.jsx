import { useState } from 'react'
import { saveLicense } from '../utils/licenseStorage'
import './LicenseForm.css'

const LICENSE_TYPES = [
  { id: '2종 보통', label: '2종 보통' },
  { id: '1종 보통', label: '1종 보통' },
  { id: '2종 대형', label: '2종 대형' },
]

const REGION_OPTIONS = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']

const initialForm = {
  licenseType: '2종 보통',
  licenseRegion: '서울',
  licenseNumber: '',
  residentNumberFront: '',
  residentNumberBack: '',
  name: '',
  phone: '',
  birth: '',
  issueDate: '',
  renewalDate: '',
  serialNumber: '',
  address: '',
  addressDetail: '',
}

function LicenseForm({ existingLicense, onSave, onBack }) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...(existingLicense && {
      licenseType: existingLicense.licenseType || '2종 보통',
      licenseRegion: existingLicense.licenseRegion || '서울',
      licenseNumber: existingLicense.licenseNumber || existingLicense.license || '',
      residentNumberFront: existingLicense.residentNumberFront || '',
      residentNumberBack: existingLicense.residentNumberBack || '',
      name: existingLicense.name || '',
      phone: existingLicense.phone || '',
      birth: existingLicense.birth || '',
      issueDate: existingLicense.issueDate || '',
      renewalDate: existingLicense.renewalDate || '',
      serialNumber: existingLicense.serialNumber || '',
      address: existingLicense.address || '',
      addressDetail: existingLicense.addressDetail || '',
    }),
  }))

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const fullNumber = form.licenseRegion ? `${form.licenseRegion} ${form.licenseNumber}`.trim() : form.licenseNumber
    if (!form.name || !fullNumber || !form.address) {
      alert('이름, 면허번호, 주소를 입력해 주세요.')
      return
    }
    const record = saveLicense({
      licenseType: form.licenseType,
      licenseRegion: form.licenseRegion,
      licenseNumber: fullNumber,
      license: fullNumber,
      residentNumberFront: form.residentNumberFront,
      residentNumberBack: form.residentNumberBack,
      name: form.name,
      phone: form.phone,
      birth: form.birth,
      issueDate: form.issueDate,
      renewalDate: form.renewalDate,
      serialNumber: form.serialNumber,
      address: form.address,
      addressDetail: form.addressDetail,
    })
    onSave(record)
  }

  const maskedResident = (front, back) =>
    front ? `${front}-${(back || '').replace(/./g, '●')}` : '000000-0000000'

  return (
    <div className="license-form-page">
      {existingLicense && (
        <div className="license-card-summary">
          <div className="license-card-photo" />
          <div className="license-card-body">
            <span className="license-card-type">{existingLicense.licenseType || '2종 보통'}</span>
            <h3 className="license-card-title">자동차운전면허증(Driver&apos;s License)</h3>
            <p className="license-card-number">{existingLicense.licenseNumber || existingLicense.license || '00-00-000000-00'}</p>
            <p className="license-card-name">{existingLicense.name}</p>
            <p className="license-card-resident">{maskedResident(existingLicense.residentNumberFront, existingLicense.residentNumberBack)}</p>
            <p className="license-card-address">{existingLicense.address}</p>
            <div className="license-card-meta">
              <span>면허증: {existingLicense.issueDate || '0000.00.00'}</span>
              <span>갱신기간: ~{existingLicense.renewalDate || '0000.00.00'}</span>
              <span>조건: A</span>
              <span>0000.00.00 서울지방경찰청</span>
            </div>
            <p className="license-card-serial">
              <span className="serial-icon">👤</span> {existingLicense.serialNumber || '1234AB'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="license-form" noValidate>
        <div className="form-group">
          <label>면허종류</label>
          <div className="radio-row license-type-row">
            {LICENSE_TYPES.map((t) => (
              <label key={t.id} className="radio-label">
                <input
                  type="radio"
                  name="licenseType"
                  checked={form.licenseType === t.id}
                  onChange={() => update('licenseType', t.id)}
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>면허번호</label>
          <div className="input-row license-number-row">
            <select
              value={form.licenseRegion}
              onChange={(e) => update('licenseRegion', e.target.value)}
              className="license-region-select"
            >
              {REGION_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <span className="input-separator">-</span>
            <input
              type="text"
              value={form.licenseNumber}
              onChange={(e) => update('licenseNumber', e.target.value)}
              placeholder="00 - 000000 - 00"
              className="license-number-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>주민등록번호</label>
          <div className="input-row resident-row">
            <input
              type="text"
              value={form.residentNumberFront}
              onChange={(e) => update('residentNumberFront', e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="앞 6자리"
              maxLength={6}
              className="resident-front"
            />
            <span className="input-separator">-</span>
            <input
              type="password"
              value={form.residentNumberBack}
              onChange={(e) => update('residentNumberBack', e.target.value.replace(/\D/g, '').slice(0, 7))}
              placeholder="●●●●●●●"
              maxLength={7}
              className="resident-back"
            />
          </div>
        </div>

        <div className="form-group date-row">
          <div className="date-field">
            <label>갱신 만료일</label>
            <input
              type="date"
              value={form.renewalDate}
              onChange={(e) => update('renewalDate', e.target.value)}
              placeholder="0000-00-00"
            />
          </div>
          <div className="date-field">
            <label>면허 발급일</label>
            <input
              type="date"
              value={form.issueDate}
              onChange={(e) => update('issueDate', e.target.value)}
              placeholder="0000-00-00"
            />
          </div>
        </div>

        <div className="form-group">
          <label>일련번호</label>
          <input
            type="text"
            value={form.serialNumber}
            onChange={(e) => update('serialNumber', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
            placeholder="영문과 숫자 6자리 입력"
            maxLength={6}
          />
        </div>

        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="이름"
            required
          />
        </div>

        <div className="form-group">
          <label>연락처</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="010-0000-0000"
          />
        </div>

        <div className="form-group">
          <label>생년월일</label>
          <input
            type="date"
            value={form.birth}
            onChange={(e) => update('birth', e.target.value)}
            placeholder="1990-01-01"
          />
        </div>

        <div className="form-group">
          <label>주소</label>
          <button type="button" className="btn-address-search" onClick={() => update('address', '(주소 검색 예정)')}>
            주소 찾기
          </button>
          {form.address && <p className="address-selected">{form.address}</p>}
          <input
            type="text"
            value={form.addressDetail}
            onChange={(e) => update('addressDetail', e.target.value)}
            placeholder="상세주소를 입력해 주세요."
            className="address-detail"
          />
        </div>

        <button type="submit" className="license-form-cta">
          등록하기
        </button>
      </form>
    </div>
  )
}

export default LicenseForm
