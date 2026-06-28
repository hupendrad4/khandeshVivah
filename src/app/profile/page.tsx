"use client"

import { useState } from "react"
import Link from "next/link"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/ui/file-upload"
import { Camera, Heart, MessageCircle, Star, Shield, MapPin, GraduationCap, Briefcase, Users, Moon, Apple, X, Lock, Crown, ChevronUp, ChevronDown, Bookmark } from "lucide-react"
import { maskName } from "@/lib/utils"
import { usePaymentGate } from "@/lib/use-payment-gate"
import { useAuthStore } from "@/store/auth-store"
import toast from "react-hot-toast"
import type { PhotoItem } from "@/types"

// Demo toggle — would be replaced by actual auth check
const isViewerPremium = false
const isProfileOwner = false

export default function ProfilePage() {
  const { t, locale } = useI18n()
  const { executeWithGate, isProcessing } = usePaymentGate()
  const { user } = useAuthStore()
  const [gallery, setGallery] = useState<PhotoItem[]>([])
  const [activeTab, setActiveTab] = useState("about")

  const profileName = "प्रिया पाटील"
  const displayName = isViewerPremium || isProfileOwner ? profileName : maskName(profileName, false)

  return (
    <MainLayout>
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="relative h-48 rounded-t-xl bg-gradient-to-br from-[#8f4e00]/20 to-[#435b9f]/20">
                  {gallery[0] ? (
                    <img src={gallery[0].url} alt="" className="h-full w-full rounded-t-xl object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Camera className="h-12 w-12 text-[#8f4e00]/40" />
                    </div>
                  )}
                </div>
                <div className="px-5 pb-5">
                  <div className="relative -mt-12 mb-3">
                    <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
                      {gallery[0] ? (
                        <img src={gallery[0].url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#8f4e00]/10">
                          <Camera className="h-8 w-8 text-[#8f4e00]" />
                        </div>
                      )}
                    </div>
                  </div>
                  <h1 className="text-center text-xl font-bold text-[#1b1c1c]">
                    {displayName}
                    {!isViewerPremium && !isProfileOwner && (
                      <Lock className="ml-1 inline h-4 w-4 text-[#887364]" />
                    )}
                  </h1>
                  <p className="text-center text-sm text-[#554336]">25 yrs, 160 cm | Jalgaon</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Badge variant="success" className="gap-1"><Shield className="h-3 w-3" />Verified</Badge>
                    <Badge variant="premium" className="gap-1"><Star className="h-3 w-3" />Premium</Badge>
                  </div>

                  {!isViewerPremium && !isProfileOwner && (
                    <div className="mt-3 rounded-lg bg-[#F0ADD6] border border-[#8f4e00]/20 p-3 text-center">
                      <Lock className="mx-auto mb-1 h-4 w-4 text-[#8f4e00]" />
                      <p className="text-xs text-[#554336]">
                        {locale === "mr"
                          ? "प्रीमियम सबस्क्रिप्शनवर संपूर्ण प्रोफाइल दिसेल"
                          : "Full profile visible with Premium subscription"}
                      </p>
                      <Link href="/premium">
                        <Button size="sm" variant="gold" className="mt-2 gap-1">
                          <Crown className="h-3 w-3" />
                          {t("profile.viewPremium")}
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 gap-1"
                      disabled={isProcessing}
                      onClick={() => {
                        executeWithGate(
                          async () => {
                            toast.success(t("profile.interestSent"))
                          },
                          "send_interest",
                          undefined,
                        )
                      }}
                    ><Heart className="h-4 w-4" />{t("profile.sendInterest")}</Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isProcessing}
                      onClick={async () => {
                        if (!user?.id) {
                          toast.error(locale === "mr" ? "कृपया प्रथम लॉगिन करा" : "Please login first")
                          return
                        }
                        const res = await fetch("/api/shortlist/toggle", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId: user.id, targetId: user.id }),
                        })
                        const data = await res.json()
                        if (data.success) {
                          toast.success(data.shortlisted ? t("profile.shortlistAdded") : t("profile.shortlistRemoved"))
                        }
                      }}
                    >
                      <Bookmark className="mr-1 h-3 w-3" />{t("profile.shortlist")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1"
                      disabled={isProcessing}
                      onClick={() => {
                        executeWithGate(
                          async () => {
                            toast.success(t("profile.chat") + " coming soon")
                          },
                          "send_message",
                          undefined,
                        )
                      }}
                    ><MessageCircle className="h-4 w-4" />{t("profile.chat")}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="about" className="flex-1">{t("profile.aboutMe")}</TabsTrigger>
                <TabsTrigger value="family" className="flex-1">{t("profile.familyInfo")}</TabsTrigger>
                <TabsTrigger value="horoscope" className="flex-1">{t("profile.horoscope")}</TabsTrigger>
                <TabsTrigger value="gallery" className="flex-1">{t("profile.photoGallery")}</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6 space-y-4">
                <Card>
                  <CardContent className="p-5">
                    <h3 className="mb-3 font-bold text-[#1b1c1c]">{t("profile.aboutMe")}</h3>
                    <p className="text-sm leading-relaxed text-[#554336]">
                      मी एक साधी, प्रामाणिक आणि कुटुंबाभिमुख मुलगी आहे. मला परिचारिका म्हणून सेवा करताना आनंद मिळतो. मला वाचन, गाणे आणि स्वयंपाकाचा छंद आहे.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="divide-y divide-[#F6F3F2] p-0">
                    {[
                      { icon: GraduationCap, label: t("registration.education"), value: "B.Sc. Nursing" },
                      { icon: Briefcase, label: t("registration.occupation"), value: "Staff Nurse" },
                      { icon: MapPin, label: t("registration.village"), value: "Jalgaon" },
                      { icon: Users, label: t("registration.caste"), value: "Leva Patil" },
                      { icon: Moon, label: t("registration.maritalStatus"), value: "Never Married" },
                      { icon: Apple, label: t("registration.foodPreference"), value: "Vegetarian" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-5 py-3">
                        <item.icon className="h-4 w-4 text-[#887364]" />
                        <span className="flex-1 text-sm text-[#554336]">{item.label}</span>
                        <span className="text-sm font-medium text-[#1b1c1c]">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <h3 className="mb-3 font-bold text-[#1b1c1c]">{t("profile.expectations")}</h3>
                    <p className="text-sm leading-relaxed text-[#554336]">
                      मी एक सुशिक्षित, प्रामाणिक आणि कर्तव्यदक्ष जोडीदार शोधत आहे. त्याने माझ्या कुटुंबाला समजून घेणारा आणि आदर देणारा असावा.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="family" className="mt-6">
                <Card>
                  <CardContent className="divide-y divide-[#F6F3F2] p-0">
                    {[
                      { label: t("registration.fatherName"), value: "Suresh Patil" },
                      { label: t("registration.motherName"), value: "Manisha Patil" },
                      { label: t("registration.brothers"), value: "1" },
                      { label: t("registration.sisters"), value: "0" },
                      { label: t("registration.familyType"), value: "Nuclear" },
                      { label: t("registration.familyStatus"), value: "Upper Middle Class" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-[#554336]">{item.label}</span>
                        <span className="text-sm font-medium text-[#1b1c1c]">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="horoscope" className="mt-6">
                <Card>
                  <CardContent className="divide-y divide-[#F6F3F2] p-0">
                    {[
                      { label: "नक्षत्र", value: "रेवती" },
                      { label: "राशी", value: "मीन" },
                      { label: "मांगलिक", value: "अनाल" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-[#554336]">{item.label}</span>
                        <span className="text-sm font-medium text-[#1b1c1c]">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="mt-6 space-y-4">
                <Card>
                  <CardContent className="p-5">
                    <h3 className="mb-4 font-bold text-[#1b1c1c]">{t("profile.photoGallery")}</h3>
                    {gallery.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {gallery.map((photo, i) => (
                      <div key={photo.url} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-[#E4E2E1] transition-shadow hover:shadow-md">
                        <img src={photo.thumbUrl || photo.url} alt="" className="h-full w-full object-cover" />

                        {/* Primary badge */}
                        <button
                          type="button"
                          onClick={() =>
                            setGallery((prev) =>
                              prev.map((p) => ({ ...p, isPrimary: p.url === photo.url })),
                            )
                          }
                          className={`absolute left-1 top-1 rounded-full p-1 transition-all ${
                            photo.isPrimary
                              ? "bg-[#8f4e00] text-white shadow-md"
                              : "bg-black/40 text-white/70 opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <Star className={`h-3.5 w-3.5 ${photo.isPrimary ? "fill-current" : ""}`} />
                        </button>

                        {/* Reorder buttons */}
                        <div className="absolute bottom-1 left-1 flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                          {i > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setGallery((prev) => {
                                  const updated = [...prev]
                                  ;[updated[i - 1], updated[i]] = [updated[i], updated[i - 1]]
                                  return updated
                                })
                              }
                              className="rounded bg-black/50 p-0.5 text-white hover:bg-black/70"
                            >
                              <ChevronUp className="h-3 w-3" />
                            </button>
                          )}
                          {i < gallery.length - 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setGallery((prev) => {
                                  const updated = [...prev]
                                  ;[updated[i], updated[i + 1]] = [updated[i + 1], updated[i]]
                                  return updated
                                })
                              }
                              className="rounded bg-black/50 p-0.5 text-white hover:bg-black/70"
                            >
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() =>
                            setGallery((prev) => {
                              const removed = prev[i]
                              const updated = prev.filter((_, j) => j !== i)
                              if (removed.isPrimary && updated.length > 0) {
                                updated[0] = { ...updated[0], isPrimary: true }
                              }
                              return updated
                            })
                          }
                          className="absolute right-1 top-1 rounded-full bg-red-500 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>

                        {/* Primary label */}
                        {photo.isPrimary && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-white">
                              <Star className="h-2.5 w-2.5 fill-[#8f4e00] text-[#8f4e00]" />
                              Primary
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {gallery.length === 0 && (
                  <p className="text-center text-sm text-[#887364]">
                    {t("profile.noPhotosGallery")}
                  </p>
                )}
                <div className="mt-4">
                  <FileUpload
                    photos={gallery}
                    onPhotosChange={setGallery}
                    onUpload={() => {}}
                    maxFiles={5}
                  />
                </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
