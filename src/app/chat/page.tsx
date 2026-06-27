"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Image, Phone, Video, MoreVertical, ChevronLeft } from "lucide-react"

const conversations = [
  { name: "राजेश पाटील", lastMsg: "नमस्कार, मला तुमच्या प्रोफाइलमध्ये रस आहे.", time: "2m", online: true, unread: 2, photo: "https://i.pravatar.cc/100?img=11" },
  { name: "अमित जाधव", lastMsg: "हो, मी जळगावातच आहे.", time: "1h", online: false, unread: 0, photo: "https://i.pravatar.cc/100?img=12" },
  { name: "निलेश महाजन", lastMsg: "धन्यवाद! मी लवकरच उत्तर देईन.", time: "3h", online: true, unread: 1, photo: "https://i.pravatar.cc/100?img=13" },
  { name: "संजय सोनवणे", lastMsg: "तुमचं प्रोफाइल खूप छान आहे.", time: "1d", online: false, unread: 0, photo: "https://i.pravatar.cc/100?img=14" },
]

const messages = [
  { id: 1, from: "them", text: "नमस्कार! मला तुमच्या प्रोफाइलमध्ये खूप रस आहे.", time: "10:30 AM" },
  { id: 2, from: "me", text: "नमस्कार! धन्यवाद. तुमच्याबद्दल थोडी माहिती सांगाल?", time: "10:32 AM" },
  { id: 3, from: "them", text: "होय नक्की. मी राजेश पाटील. मी चोपडा, जळगावचा रहिवासी. मी पुण्यात सॉफ्टवेअर अभियंता आहे.", time: "10:33 AM" },
  { id: 4, from: "me", text: "छान! मी प्रिया. मीही पुण्यातच आहे. बी.ई. कॉम्प्युटर केलं आहे.", time: "10:35 AM" },
  { id: 5, from: "them", text: "खूप छान! तुमचं कुटुंब कुठे आहे?", time: "10:36 AM" },
]

export default function ChatPage() {
  const { t, locale } = useI18n()
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [messageText, setMessageText] = useState("")

  return (
    <MainLayout>
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-container px-4 py-4 md:px-6 lg:px-10">
        <div className={`w-full md:w-80 lg:w-96 border-r border-[#E4E2E1] ${selectedChat !== null ? "hidden md:block" : "block"}`}>
          <div className="mb-4">
            <h1 className="text-xl font-bold text-[#1b1c1c]">{t("chat.messages")}</h1>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#887364]" />
              <Input placeholder={t("common.search")} className="pl-9" />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.name}
                  onClick={() => setSelectedChat(1)}
                  className={`w-full rounded-xl p-3 text-left transition-colors hover:bg-[#F6F3F2] ${selectedChat ? "bg-[#F6F3F2]" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conv.photo} />
                        <AvatarFallback>{conv.name[0]}</AvatarFallback>
                      </Avatar>
                      {conv.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#50C878] border-2 border-white" />}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-[#1b1c1c]">{conv.name}</p>
                        <span className="text-xs text-[#887364]">{conv.time}</span>
                      </div>
                      <p className="truncate text-sm text-[#887364]">{conv.lastMsg}</p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge variant="default" className="ml-auto h-5 min-w-5 px-1.5 text-xs">{conv.unread}</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className={`flex flex-1 flex-col ${selectedChat === null ? "hidden md:flex" : "flex"}`}>
          {selectedChat ? (
            <>
              <div className="flex items-center gap-3 border-b border-[#E4E2E1] p-4">
                <button onClick={() => setSelectedChat(null)} className="md:hidden">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://i.pravatar.cc/100?img=11" />
                  <AvatarFallback>RP</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-[#1b1c1c]">राजेश पाटील</p>
                  <p className="text-xs text-[#50C878]">{t("chat.online")}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon"><Phone className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon"><Video className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl p-3 ${
                        msg.from === "me"
                          ? "bg-[#FF21A5] text-white rounded-br-sm"
                          : "bg-[#F6F3F2] text-[#1b1c1c] rounded-bl-sm"
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`mt-1 text-right text-[10px] ${msg.from === "me" ? "text-white/70" : "text-[#887364]"}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t border-[#E4E2E1] p-4">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon"><Image className="h-5 w-5 text-[#887364]" /></Button>
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={t("chat.typeMessage")}
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && setMessageText("")}
                  />
                  <Button size="icon"><Send className="h-5 w-5" /></Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 rounded-full bg-[#FF21A5]/5 p-6">
                  <Send className="h-10 w-10 text-[#FF21A5]/40" />
                </div>
                <h3 className="text-lg font-semibold text-[#1b1c1c]">{t("chat.noMessages")}</h3>
                <p className="text-sm text-[#554336]">{t("chat.startConversation")}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
