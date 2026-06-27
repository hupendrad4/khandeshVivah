"use client"

import { useSignIn } from "@clerk/nextjs"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"
import toast from "react-hot-toast"

export default function ClerkGoogleLogin() {
  const { t } = useI18n()
  const { signIn, isLoaded } = useSignIn()

  const handleGoogleLogin = async () => {
    if (!isLoaded) return
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      })
    } catch {
      toast.error(t("auth.loginFailed"))
    }
  }

  return (
    <Button variant="outline" className="w-full gap-2" size="lg" onClick={handleGoogleLogin} disabled={!isLoaded}>
      <Chrome className="h-5 w-5" /> {t("auth.loginWithGoogle")}
    </Button>
  )
}
