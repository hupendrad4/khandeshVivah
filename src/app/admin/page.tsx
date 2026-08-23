"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users, UserCheck, Shield, Star, Search, MoreVertical, CheckCircle, X,
} from "lucide-react"

const stats = [
  { label: "admin.totalUsers", value: "25,847", icon: Users, change: "+12%", color: "text-[#D4AF37]" },
  { label: "admin.activeUsers", value: "8,234", icon: UserCheck, change: "+8%", color: "text-[#50C878]" },
  { label: "admin.premiumUsers", value: "1,847", icon: Star, change: "+23%", color: "text-[#D4AF37]" },
  { label: "admin.pendingVerifications", value: "342", icon: Shield, change: "-5%", color: "text-[#9B1B30]" },
]

const recentUsers = [
  { name: "प्रिया पाटील", mobile: "+91 98765 43210", date: "2 hours ago", status: "verified", role: "Bride" },
  { name: "राजेश पाटील", mobile: "+91 98765 43211", date: "5 hours ago", status: "pending", role: "Groom" },
  { name: "अमित जाधव", mobile: "+91 98765 43212", date: "1 day ago", status: "verified", role: "Groom" },
  { name: "स्नेहा जाधव", mobile: "+91 98765 43213", date: "2 days ago", status: "rejected", role: "Bride" },
]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function AdminPage() {
  const { t, locale } = useI18n()

  return (
    <MainLayout>
      <div className="relative min-h-[30vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#9B1B30]/80 via-[#D4AF37]/70 to-[#9B1B30]/90" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-white font-label-md mb-4"
          >
            <Shield className="h-4 w-4" />
            Super Admin
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3">{t("admin.dashboard")}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/80 text-lg">
            {locale === "mr" ? "खांदेश विवाह अॅडमिन पॅनल" : "Khandesh Vivah Admin Panel"}
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10 bg-mandala-ornamental">
        <div className="ornamental-corner-tl" /><div className="ornamental-corner-br" />

        <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="bg-surface-container-low border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                  <span className="text-xs font-medium text-[#50C878]">{s.change}</span>
                </div>
                <p className="text-2xl font-bold text-[#1b1c1c]">{s.value}</p>
                <p className="text-xs text-[#C4A0A3]">{t(s.label as any)}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6 overflow-x-auto scrollbar-hide">
            <TabsTrigger value="users">{t("admin.userManagement")}</TabsTrigger>
            <TabsTrigger value="verification">{t("admin.profileVerification")}</TabsTrigger>
            <TabsTrigger value="payments">{t("admin.payments")}</TabsTrigger>
            <TabsTrigger value="reports">{t("admin.reports")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("admin.analytics")}</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-surface-container-low border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C4A0A3]" />
                    <Input placeholder={t("common.search")} className="pl-9" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">{locale === "mr" ? "निर्यात" : "Export"}</Button>
                    <Button size="sm">+ {locale === "mr" ? "वापरकर्ता जोडा" : "Add User"}</Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E8B8BC] text-left text-xs text-[#C4A0A3]">
                        <th className="pb-3 font-medium">{locale === "mr" ? "वापरकर्ता" : "User"}</th>
                        <th className="pb-3 font-medium">{locale === "mr" ? "मोबाइल" : "Mobile"}</th>
                        <th className="pb-3 font-medium">{locale === "mr" ? "भूमिका" : "Role"}</th>
                        <th className="pb-3 font-medium">{locale === "mr" ? "स्थिती" : "Status"}</th>
                        <th className="pb-3 font-medium">{locale === "mr" ? "सामील झाले" : "Joined"}</th>
                        <th className="pb-3 font-medium">{locale === "mr" ? "कृती" : "Action"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((u) => (
                        <tr key={u.name} className="border-b border-[#F5D0D4]">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs bg-[#9B1B30]/10 text-[#9B1B30]">{u.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-[#1b1c1c]">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-[#5C4B4D]">{u.mobile}</td>
                          <td className="py-3"><Badge variant="outline">{u.role}</Badge></td>
                          <td className="py-3">
                            <Badge variant={u.status === "verified" ? "success" : u.status === "pending" ? "default" : "destructive"}>
                              {u.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-xs text-[#C4A0A3]">{u.date}</td>
                          <td className="py-3">
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card className="bg-surface-container-low border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="space-y-4">
                  {[
                    { name: "प्रिया पाटील", doc: "Aadhaar Card", status: "pending", submitted: "2 hours ago" },
                    { name: "राजेश पाटील", doc: "PAN Card", status: "pending", submitted: "5 hours ago" },
                    { name: "अमित जाधव", doc: "Driving License", status: "approved", submitted: "1 day ago" },
                    { name: "स्नेहा जाधव", doc: "Passport", status: "rejected", submitted: "2 days ago" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-xl bg-[#ebe7e4] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#9B1B30]/10 text-[#9B1B30]">{item.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[#1b1c1c]">{item.name}</p>
                          <p className="text-xs text-[#C4A0A3]">{item.doc} | {item.submitted}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {item.status === "pending" && (
                          <>
                            <Button size="sm" variant="default"><CheckCircle className="mr-1 h-4 w-4" />{locale === "mr" ? "मंजूर" : "Approve"}</Button>
                            <Button size="sm" variant="outline"><X className="mr-1 h-4 w-4" />{locale === "mr" ? "नाकारा" : "Reject"}</Button>
                          </>
                        )}
                        <Badge variant={item.status === "approved" ? "success" : item.status === "rejected" ? "destructive" : "default"}>
                          {item.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
