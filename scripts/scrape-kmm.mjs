const BASE = "https://www.khandeshmarathamarriage.com"

const DISTRICT_MAP = {
  "जळगाव": "JALGAON", "धुळे": "DHULE", "नंदुरबार": "NANDURBAR",
  "नाशिक": "NASHIK_NORTH", "छत्रपती संभाजी नगर": "JALGAON",
}

const GENDER_MAP = { "स्त्री": "FEMALE", "पुरुष": "MALE" }
const MARITAL_MAP = { "अविवाहित": "NEVER_MARRIED", "घटस्फोटित": "DIVORCED", "विधवा": "WIDOWED", "विदुर": "WIDOWED" }

function field(html, label) {
  const re = new RegExp(`<strong>${label}:</strong>\\s*([^<]*)`, "i")
  const m = html.match(re)
  return m ? m[1].trim() : ""
}

function parseProfile(html, id) {
  const name = field(html, "नाव").replace(/^(कु\.?\s*|चि\.?\s*|डॉ\.?\s*)/, "").trim()
  const genderRaw = field(html, "लिंग")
  const dobRaw = field(html, "जन्मतारीख")
  const heightRaw = field(html, "उंची")
  const education = field(html, "शिक्षण")
  const occupation = field(html, "व्यवसाय").replace(/\([^)]*\)\s*$/, "").trim()
  const income = field(html, "उत्पन्न")
  const residence = field(html, "रेसिडेन्स")
  const maritalRaw = field(html, "विवाह स्थिती")
  const fatherDistrict = field(html, "वडिलांच्या गावाचा जिल्हा")
  const expectationsMatch = field(html, "वयाचा फरक")
  const description = field(html, "वर्णन")

  const gender = GENDER_MAP[genderRaw] || (id.startsWith("KG") ? "FEMALE" : "MALE")
  const maritalStatus = MARITAL_MAP[maritalRaw] || "NEVER_MARRIED"
  const district = DISTRICT_MAP[fatherDistrict] || "JALGAON"

  let dateOfBirth = null
  if (dobRaw) {
    const parts = dobRaw.split("/")
    if (parts.length === 3) dateOfBirth = `${parts[2]}-${parts[1]}-${parts[0]}`
  }

  let height = null
  if (heightRaw) {
    const h = parseFloat(heightRaw)
    if (!isNaN(h)) height = Math.round(h * 30.48)
  }

  const photoUrls = []
  const photoRe = /<img[^>]+src="(https:\/\/images\.khandeshmarathamarriage\.com\/[^"]+)"/g
  let m
  while ((m = photoRe.exec(html)) !== null) {
    if (!photoUrls.includes(m[1])) photoUrls.push(m[1])
  }

  return {
    sourceId: id, gender, name, dateOfBirth, height, education, occupation,
    income: income || null, residence, maritalStatus, district,
    photoUrls: photoUrls.slice(0, 3),
    aboutMe: description || `नमस्कार, मी ${name}.`,
    expectations: expectationsMatch || "सुशिक्षित, सुसंस्कृत जोडीदार.",
    religion: "HINDU", caste: "MARATHA", motherTongue: "Marathi",
    state: "Maharashtra", country: "India",
  }
}

async function main() {
  const allProfiles = []
  // Girls: KG4500-KG5100, Boys: KB5400-KB6420
  const GIRLS = Array.from({ length: 600 }, (_, i) => `KG${4500 + i}`)
  const BOYS = Array.from({ length: 1020 }, (_, i) => `KB${5400 + i}`)
  const ids = [...GIRLS, ...BOYS]
  let scraped = 0; let checked = 0

  for (const id of ids) {
    checked++
    if (checked % 20 === 0) console.log(`Checked ${checked}/${ids.length}, scraped ${scraped}`)
    try {
      const res = await fetch(`${BASE}/member/${id}`, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; KhandeshLagna/1.0)" },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) continue
      const html = await res.text()
      if (!html.includes("प्राथमिक माहिती")) continue
      const profile = parseProfile(html, id)
      if (profile.name) {
        allProfiles.push(profile)
        scraped++
      }
    } catch {
      // skip
    }
  }

  const fs = await import("fs")
  fs.writeFileSync("scripts/kmm-data.json", JSON.stringify(allProfiles, null, 2))
  console.log(`\nDone! Checked ${checked} IDs, scraped ${scraped} profiles → scripts/kmm-data.json`)
}

main().catch(console.error)
