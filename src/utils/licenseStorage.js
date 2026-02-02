const STORAGE_KEY = 'head_rent_licenses'

/**
 * 등록 면허 정보 (이미지 기준 전체 필드)
 * @typedef {{
 *   id: string
 *   licenseType: string
 *   licenseNumber: string
 *   licenseRegion?: string
 *   residentNumberFront: string
 *   residentNumberBack: string
 *   name: string
 *   phone: string
 *   birth: string
 *   address: string
 *   addressDetail?: string
 *   issueDate: string
 *   renewalDate: string
 *   serialNumber: string
 *   license?: string
 * }} LicenseRecord
 */

function normalizeRecord(r) {
  return {
    ...r,
    licenseNumber: r.licenseNumber ?? r.license ?? '',
    license: r.license ?? r.licenseNumber ?? '',
    name: r.name ?? '',
    phone: r.phone ?? '',
    birth: r.birth ?? '',
    address: r.address ?? '',
  }
}

/** @returns {LicenseRecord[]} */
export function getLicenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const list = JSON.parse(raw)
    return (Array.isArray(list) ? list : []).map(normalizeRecord)
  } catch {
    return []
  }
}

/** @param {string} id @returns {LicenseRecord | null} */
export function getLicenseById(id) {
  return getLicenses().find((r) => r.id === id) ?? null
}

/**
 * @param {Partial<Omit<LicenseRecord, 'id'>> & { name: string, licenseNumber?: string, license?: string, address: string }} data
 * @returns {LicenseRecord}
 */
export function saveLicense(data) {
  const list = getLicenses()
  const id = `lic_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const record = {
    id,
    licenseType: data.licenseType ?? '2종 보통',
    licenseNumber: data.licenseNumber ?? data.license ?? '',
    licenseRegion: data.licenseRegion ?? '',
    residentNumberFront: data.residentNumberFront ?? '',
    residentNumberBack: data.residentNumberBack ?? '',
    name: data.name ?? '',
    phone: data.phone ?? '',
    birth: data.birth ?? '',
    address: data.address ?? '',
    addressDetail: data.addressDetail ?? '',
    issueDate: data.issueDate ?? '',
    renewalDate: data.renewalDate ?? '',
    serialNumber: data.serialNumber ?? '',
    license: data.license ?? data.licenseNumber ?? '',
  }
  list.push(record)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return record
}

/** @param {string} id */
export function removeLicense(id) {
  const list = getLicenses().filter((r) => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}
