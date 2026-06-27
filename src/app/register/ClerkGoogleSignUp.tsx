"use client"

import { useSignUp } from "@clerk/nextjs"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"
import toast from "react-hot-toast"

export default function ClerkGoogleSignUp() {
  const { t } = useI18n()
  const { signUp, isLoaded } = useSignUp()

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/register",
      })
    } catch {
      toast.error(t("auth.loginFailed"))
    }
  }

  return (
    <Button variant="outline" className="w-full gap-2" size="lg" onClick={handleGoogleSignUp} disabled={!isLoaded}>
      <Chrome className="h-5 w-5" /> {t("auth.registerWithGoogle")}
    </Button>
  )
}
