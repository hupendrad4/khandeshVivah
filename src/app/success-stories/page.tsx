"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Heart, Quote, CheckCircle } from "lucide-react"

const stories = [
  {
    couple: "राजेश & प्रिया पाटील",
    village: "चोपडा, जळगाव",
    date: "Dec 2024",
    story: "खांदेश विवाहमुळे आम्हाला आमचा जोडीदार मिळाला. दोघेही खांदेशातील असल्याने आमची विचारसरणी, संस्कार आणि जीवनशैली जुळून आली. खांदेश विवाह टीमचे खूप खूप आभार!",
    photos: ["https://i.pravatar.cc/200?img=1", "https://i.pravatar.cc/200?img=2"],
  },
  {
    couple: "अमित & स्नेहा जाधव",
    village: "धुळे",
    date: "Nov 2024",
    story: "पालक म्हणून आम्हाला आमच्या मुलीसाठी योग्य जोडीदार शोधणे कठीण जात होते. पण खांदेश विवाहमुळे आम्हाला योग्य मुलगा शोधण्यात मदत झाली. खूप धन्यवाद!",
    photos: ["https://i.pravatar.cc/200?img=3", "https://i.pravatar.cc/200?img=4"],
  },
  {
    couple: "निलेश & रुपाली महाजन",
    village: "नंदुरबार",
    date: "Oct 2024",
    story: "खांदेश विवाह हा फक्त एक विवाह मंच नाही, तर खांदेश समाजासाठी एक परिवार आहे. इथे आम्हाला फक्त जोडीदारच नाही तर एक चांगले कुटुंब मिळाले.",
    photos: ["https://i.pravatar.cc/200?img=5", "https://i.pravatar.cc/200?img=6"],
  },
  {
    couple: "संदीप & वैशाली पवार",
    village: "यावल, जळगाव",
    date: "Sep 2024",
    story: "आम्ही दोघेही शेतकरी कुटुंबातील. खांदेश विवाहमुळे आमच्यासारख्याच पार्श्वभूमीचा जोडीदार मिळाला. आमची लग्नाची सर्व स्वप्ने पूर्ण झाली.",
    photos: ["https://i.pravatar.cc/200?img=7", "https://i.pravatar.cc/200?img=8"],
  },
]

export default function SuccessStoriesPage() {
  const { t } = useI18n()

  return (
    <MainLayout>
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs text-[#887364] hover:text-[#FF21A5]">
          <ChevronLeft className="h-3 w-3" /> {t("common.back")}
        </Link>

        <div className="mb-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-4 text-3xl font-bold text-[#1b1c1c] md:text-4xl">{t("home.successStories")}</h1>
            <p className="mx-auto max-w-2xl text-[#554336]">
              खांदेश विवाहमुळे जुळलेली खरी प्रेम कथा. आमच्या यशस्वी जोडप्यांच्या कथा वाचा.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {stories.map((story, i) => (
            <motion.div
              key={story.couple}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-[#FF21A5]/10 via-[#FF2E96]/5 to-[#D4AF37]/10">
                  <div className="absolute -bottom-8 left-6 flex">
                    <Avatar className="h-16 w-16 border-4 border-white shadow-md">
                      <AvatarImage src={story.photos[0]} />
                      <AvatarFallback>{story.couple[0]}</AvatarFallback>
                    </Avatar>
                    <Avatar className="-ml-4 h-16 w-16 border-4 border-white shadow-md">
                      <AvatarImage src={story.photos[1]} />
                      <AvatarFallback>{story.couple.split("&")[1]?.trim()[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-[#D4AF37]/20" />
                </div>
                <CardContent className="pt-10">
                  <h3 className="text-lg font-bold text-[#1b1c1c]">{story.couple}</h3>
                  <div className="mb-3 flex items-center gap-2 text-xs text-[#887364]">
                    <Heart className="h-3 w-3" /> {story.village} | {story.date}
                  </div>
                  <p className="text-sm leading-relaxed text-[#554336]">"{story.story}"</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-[#50C878]">
                    <CheckCircle className="h-3 w-3" /> {t("common.verified")} {t("home.successCouples")}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
