import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { MerchGrid } from "@/components/merch-grid"

export default async function MerchPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
            OLYMPIAN STORE
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Gear up like the Gods of Olympus! Premium merchandise to showcase your festival spirit and athletic prowess.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-r from-rose-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-6 py-2 border border-rose-500/30">
              <span className="text-rose-400 font-semibold">🛍️ Shop • Style • Shine 🛍️</span>
            </div>
          </div>
        </div>

        <MerchGrid session={session} />
      </div>
    </div>
  )
}
