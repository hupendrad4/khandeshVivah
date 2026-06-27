import { NextResponse } from "next/server"
import { DISTRICTS, getTalukasByDistrict, getVillagesByTaluka } from "@/data/villages"
import { CASTES } from "@/data/castes"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type")
  const districtId = searchParams.get("districtId")
  const talukaId = searchParams.get("talukaId")

  if (type === "districts") {
    const districts = DISTRICTS.map((d) => ({ id: d.id, en: d.en, mr: d.mr }))
    return NextResponse.json({ success: true, data: districts })
  }

  if (type === "castes") {
    const casteList = Object.entries(CASTES).map(([id, c]) => ({
      id,
      en: c.en,
      mr: c.mr,
      subCastes: c.subCastes,
    }))
    return NextResponse.json({ success: true, data: casteList })
  }

  if (type === "talukas" && districtId) {
    const talukas = getTalukasByDistrict(districtId).map((t) => ({ id: t.id, en: t.en, mr: t.mr }))
    return NextResponse.json({ success: true, data: talukas })
  }

  if (type === "villages" && districtId && talukaId) {
    const villages = getVillagesByTaluka(districtId, talukaId)
    return NextResponse.json({ success: true, data: villages })
  }

  return NextResponse.json({ error: "Invalid parameters" }, { status: 400 })
}
