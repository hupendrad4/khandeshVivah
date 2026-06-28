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
  Users, UserCheck, Shield, DollarSign, Activity, Settings,
  TrendingUp, BarChart3, Search, MoreVertical, CheckCircle, X,
  Star, Clock, FileText, MessageCircle, Bell, AlertTriangle,
} from "lucide-react"

const stats = [
  { label: "admin.totalUsers", value: "25,847", icon: Users, change: "+12%", color: "text-[#435b9f]" },
  { label: "admin.activeUsers", value: "8,234", icon: UserCheck, change: "+8%", color: "text-[#50C878]" },
  { label: "admin.premiumUsers", value: "1,847", icon: Star, change: "+23%", color: "text-[#d3ae36]" },
  { label: "admin.pendingVerifications", value: "342", icon: Shield, change: "-5%", color: "text-[#8f4e00]" },
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
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1b1c1c]">{t("admin.dashboard")}</h1>
            <p className="text-sm text-[#554336]">{locale === "mr" ? "खांदेश विवाह अॅडमिन पॅनल" : "Khandesh Vivah Admin Panel"}</p>
          </div>
          <Badge variant="premium" className="gap-1"><Shield className="h-3 w-3" /> Super Admin</Badge>
        </motion.div>

        <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                  <span className="text-xs font-medium text-[#50C878]">{s.change}</span>
                </div>
                <p className="text-2xl font-bold text-[#1b1c1c]">{s.value}</p>
                <p className="text-xs text-[#887364]">{t(s.label as any)}</p>
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
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#887364]" />
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
                      <tr className="border-b border-[#E4E2E1] text-left text-xs text-[#887364]">
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
                        <tr key={u.name} className="border-b border-[#F0EDED]">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">{u.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-[#1b1c1c]">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-[#554336]">{u.mobile}</td>
                          <td className="py-3"><Badge variant="outline">{u.role}</Badge></td>
                          <td className="py-3">
                            <Badge variant={u.status === "verified" ? "success" : u.status === "pending" ? "default" : "destructive"}>
                              {u.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-xs text-[#887364]">{u.date}</td>
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
            <Card>
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
                      className="flex items-center justify-between rounded-xl bg-[#F6F3F2] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10"><AvatarFallback>{item.name[0]}</AvatarFallback></Avatar>
                        <div>
                          <p className="font-medium text-[#1b1c1c]">{item.name}</p>
                          <p className="text-xs text-[#887364]">{item.doc} | {item.submitted}</p>
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
