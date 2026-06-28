const nakshatraMap: Record<string, { lord: string; gana: string; nadi: string; number: number }> = {
  ASHWINI: { lord: "KETU", gana: "DEV", nadi: "ADYA", number: 1 },
  BHARANI: { lord: "VENUS", gana: "MANUSH", nadi: "MADHYA", number: 2 },
  KRITTIKA: { lord: "SUN", gana: "RAKSHAS", nadi: "ANTYA", number: 3 },
  ROHINI: { lord: "MOON", gana: "MANUSH", nadi: "ADYA", number: 4 },
  MRIGASHIRA: { lord: "MARS", gana: "DEV", nadi: "MADHYA", number: 5 },
  ARDRA: { lord: "RAHU", gana: "MANUSH", nadi: "ANTYA", number: 6 },
  PUNARVASU: { lord: "JUPITER", gana: "DEV", nadi: "ADYA", number: 7 },
  PUSHYA: { lord: "SATURN", gana: "DEV", nadi: "MADHYA", number: 8 },
  ASHLESHA: { lord: "MERCURY", gana: "RAKSHAS", nadi: "ANTYA", number: 9 },
  MAGHA: { lord: "KETU", gana: "RAKSHAS", nadi: "ADYA", number: 10 },
  PURVA_PHALGUNI: { lord: "VENUS", gana: "MANUSH", nadi: "MADHYA", number: 11 },
  UTTARA_PHALGUNI: { lord: "SUN", gana: "MANUSH", nadi: "ANTYA", number: 12 },
  HASTA: { lord: "MOON", gana: "DEV", nadi: "ADYA", number: 13 },
  CHITRA: { lord: "MARS", gana: "RAKSHAS", nadi: "MADHYA", number: 14 },
  SWATI: { lord: "RAHU", gana: "DEV", nadi: "ANTYA", number: 15 },
  VISHAKHA: { lord: "JUPITER", gana: "RAKSHAS", nadi: "ADYA", number: 16 },
  ANURADHA: { lord: "SATURN", gana: "DEV", nadi: "MADHYA", number: 17 },
  JYESHTHA: { lord: "MERCURY", gana: "RAKSHAS", nadi: "ANTYA", number: 18 },
  MULA: { lord: "KETU", gana: "RAKSHAS", nadi: "ADYA", number: 19 },
  PURVA_ASHADHA: { lord: "VENUS", gana: "MANUSH", nadi: "MADHYA", number: 20 },
  UTTARA_ASHADHA: { lord: "SUN", gana: "MANUSH", nadi: "ANTYA", number: 21 },
  SHRAVANA: { lord: "MOON", gana: "DEV", nadi: "ADYA", number: 22 },
  DHANISHTA: { lord: "MARS", gana: "RAKSHAS", nadi: "MADHYA", number: 23 },
  SHATABHISHA: { lord: "RAHU", gana: "RAKSHAS", nadi: "ANTYA", number: 24 },
  PURVA_BHADRAPADA: { lord: "JUPITER", gana: "MANUSH", nadi: "ADYA", number: 25 },
  UTTARA_BHADRAPADA: { lord: "SATURN", gana: "MANUSH", nadi: "MADHYA", number: 26 },
  REVATI: { lord: "MERCURY", gana: "DEV", nadi: "ANTYA", number: 27 },
}

const raashiLords: Record<string, string> = {
  MESH: "MARS", VRISHABH: "VENUS", MITHUN: "MERCURY", KARK: "MOON",
  SIMHA: "SUN", KANYA: "MERCURY", TULA: "VENUS", VRISHCHIK: "MARS",
  DHANUSH: "JUPITER", MAKAR: "SATURN", KUMBH: "SATURN", MEEN: "JUPITER",
}

function getNakshatraNumber(nakshatra: string): number {
  return nakshatraMap[nakshatra]?.number ?? 0
}

function getDifference(a: number, b: number): number {
  const diff = Math.abs(a - b)
  return diff <= 13 ? diff : 27 - diff
}

export interface GunaMatchResult {
  total: number
  max: number
  percentage: number
  details: {
    varna: { score: number; max: number; description: string }
    vashya: { score: number; max: number; description: string }
    tara: { score: number; max: number; description: string }
    yoni: { score: number; max: number; description: string }
    grahaMaitri: { score: number; max: number; description: string }
    gana: { score: number; max: number; description: string }
    bhakoota: { score: number; max: number; description: string }
    nadi: { score: number; max: number; description: string }
  }
  verdict: string
}

export function calculateGunaMatch(
  boyNakshatra: string,
  girlNakshatra: string,
  boyRaashi: string,
  girlRaashi: string,
): GunaMatchResult {
  const boyN = nakshatraMap[boyNakshatra]
  const girlN = nakshatraMap[girlNakshatra]

  if (!boyN || !girlN) {
    return {
      total: 0, max: 36, percentage: 0,
      details: {
        varna: { score: 0, max: 1, description: "N/A" },
        vashya: { score: 0, max: 2, description: "N/A" },
        tara: { score: 0, max: 3, description: "N/A" },
        yoni: { score: 0, max: 4, description: "N/A" },
        grahaMaitri: { score: 0, max: 5, description: "N/A" },
        gana: { score: 0, max: 6, description: "N/A" },
        bhakoota: { score: 0, max: 7, description: "N/A" },
        nadi: { score: 0, max: 8, description: "N/A" },
      },
      verdict: "Incomplete horoscope data",
    }
  }

  const isBridesNakshatraEven = girlN.number % 2 === 0
  const diff = getDifference(boyN.number, girlN.number)

  let varna = 0
  const boyRaashiLord = raashiLords[boyRaashi] || ""
  const girlRaashiLord = raashiLords[girlRaashi] || ""
  if (boyRaashiLord === girlRaashiLord) {
    varna = 1
  } else if (
    (boyRaashiLord === "SUN" && girlRaashiLord === "MOON") ||
    (boyRaashiLord === "MOON" && girlRaashiLord === "SUN") ||
    (boyRaashiLord === "JUPITER" && girlRaashiLord === "VENUS") ||
    (boyRaashiLord === "VENUS" && girlRaashiLord === "JUPITER") ||
    (boyRaashiLord === "MARS" && girlRaashiLord === "MERCURY") ||
    (boyRaashiLord === "MERCURY" && girlRaashiLord === "MARS") ||
    (boyRaashiLord === "SATURN" && girlRaashiLord === "RAHU") ||
    (boyRaashiLord === "RAHU" && girlRaashiLord === "SATURN")
  ) {
    varna = 1
  }

  let vashya = 0
  if (boyN.gana === girlN.gana) vashya = 2
  else if (
    (boyN.gana === "DEV" && girlN.gana === "MANUSH") ||
    (boyN.gana === "MANUSH" && girlN.gana === "DEV")
  ) vashya = 1

  let tara = 0
  const taraIndex = (diff % 9) || 9
  if (taraIndex === 1 || taraIndex === 3 || taraIndex === 5 || taraIndex === 7) tara = 3
  else if (taraIndex === 2 || taraIndex === 4 || taraIndex === 6 || taraIndex === 8) tara = 1
  else tara = 2

  let yoni = 0
  const yoniPairs: Record<number, number> = { 1: 2, 2: 1, 3: 4, 4: 3, 5: 6, 6: 5, 7: 8, 8: 7, 9: 10, 10: 9, 11: 12, 12: 11, 13: 14, 14: 13, 15: 16, 16: 15, 17: 18, 18: 17, 19: 20, 20: 19, 21: 22, 22: 21, 23: 24, 24: 23, 25: 26, 26: 25, 27: 27 }
  if (yoniPairs[boyN.number] === girlN.number) yoni = 4
  else if (boyN.number === girlN.number) yoni = 3
  else yoni = 1

  let grahaMaitri = 0
  const friendLords: Record<string, string[]> = {
    SUN: ["MOON", "MARS", "JUPITER"],
    MOON: ["SUN", "MERCURY"],
    MARS: ["SUN", "JUPITER", "MOON"],
    MERCURY: ["SUN", "VENUS", "SATURN"],
    JUPITER: ["SUN", "MARS", "MOON"],
    VENUS: ["SATURN", "MERCURY"],
    SATURN: ["VENUS", "MERCURY"],
    RAHU: ["KETU", "MARS", "VENUS"],
    KETU: ["RAHU", "MARS", "VENUS"],
  }
  const friends = friendLords[boyN.lord] || []
  if (boyN.lord === girlN.lord) grahaMaitri = 5
  else if (friends.includes(girlN.lord)) grahaMaitri = 3
  else grahaMaitri = 1

  let gana = 0
  if (boyN.gana === girlN.gana) gana = 6
  else if (
    (boyN.gana === "DEV" && girlN.gana === "MANUSH") ||
    (boyN.gana === "MANUSH" && girlN.gana === "DEV")
  ) gana = 5
  else if (
    (boyN.gana === "DEV" && girlN.gana === "RAKSHAS") ||
    (boyN.gana === "RAKSHAS" && girlN.gana === "DEV")
  ) gana = 1

  let bhakoota = 0
  const raashiDiff = getNakshatraNumber(boyRaashi === "MESH" ? "ASHWINI" : boyRaashi === "VRISHABH" ? "BHARANI" : boyRaashi === "MITHUN" ? "KRITTIKA" : boyRaashi === "KARK" ? "ROHINI" : boyRaashi === "SIMHA" ? "MRIGASHIRA" : boyRaashi === "KANYA" ? "ARDRA" : boyRaashi === "TULA" ? "PUNARVASU" : boyRaashi === "VRISHCHIK" ? "PUSHYA" : boyRaashi === "DHANUSH" ? "ASHLESHA" : boyRaashi === "MAKAR" ? "MAGHA" : boyRaashi === "KUMBH" ? "PURVA_PHALGUNI" : "UTTARA_PHALGUNI") - getNakshatraNumber(girlRaashi === "MESH" ? "ASHWINI" : girlRaashi === "VRISHABH" ? "BHARANI" : girlRaashi === "MITHUN" ? "KRITTIKA" : girlRaashi === "KARK" ? "ROHINI" : girlRaashi === "SIMHA" ? "MRIGASHIRA" : girlRaashi === "KANYA" ? "ARDRA" : girlRaashi === "TULA" ? "PUNARVASU" : girlRaashi === "VRISHCHIK" ? "PUSHYA" : girlRaashi === "DHANUSH" ? "ASHLESHA" : girlRaashi === "MAKAR" ? "MAGHA" : girlRaashi === "KUMBH" ? "PURVA_PHALGUNI" : "UTTARA_PHALGUNI")
  const raashiDiffMod = ((raashiDiff % 9) + 9) % 9
  if (raashiDiffMod !== 2 && raashiDiffMod !== 4 && raashiDiffMod !== 6 && raashiDiffMod !== 8) bhakoota = 7
  else bhakoota = 2

  let nadi = 0
  if (boyN.nadi !== girlN.nadi) nadi = 8
  else if (boyN.nadi === girlN.nadi) nadi = 0

  const total = varna + vashya + tara + yoni + grahaMaitri + gana + bhakoota + nadi
  const percentage = Math.round((total / 36) * 100)

  const varnaDesc = varna > 0 ? "Compatible" : "Neutral/Incompatible"
  const vashyaDesc = vashya > 0 ? "Compatible" : "Incompatible"
  const taraDesc = tara >= 2 ? "Good" : "Fair"
  const yoniDesc = yoni >= 3 ? "Excellent" : yoni >= 2 ? "Good" : "Neutral"
  const grahaDesc = grahaMaitri >= 3 ? "Good friendship" : "Neutral"
  const ganaDesc = gana >= 5 ? "Excellent" : gana >= 2 ? "Good" : "Poor"
  const bhakootaDesc = bhakoota >= 7 ? "Excellent" : "Fair (some dosha)"
  const nadiDesc = nadi > 0 ? "Excellent" : "Nadi Dosha (not recommended)"

  let verdict = ""
  if (total >= 28) verdict = "Excellent Match - Highly Recommended"
  else if (total >= 22) verdict = "Good Match - Recommended"
  else if (total >= 16) verdict = "Average Match - Can be considered with other factors"
  else verdict = "Poor Match - Not Recommended"

  return {
    total, max: 36, percentage,
    details: {
      varna: { score: varna, max: 1, description: varnaDesc },
      vashya: { score: vashya, max: 2, description: vashyaDesc },
      tara: { score: tara, max: 3, description: taraDesc },
      yoni: { score: yoni, max: 4, description: yoniDesc },
      grahaMaitri: { score: grahaMaitri, max: 5, description: grahaDesc },
      gana: { score: gana, max: 6, description: ganaDesc },
      bhakoota: { score: bhakoota, max: 7, description: bhakootaDesc },
      nadi: { score: nadi, max: 8, description: nadiDesc },
    },
    verdict,
  }
}
