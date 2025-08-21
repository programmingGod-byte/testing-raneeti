import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { EventsGrid } from "@/components/events-grid"

export default async function EventsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
            ARENA OF CHAMPIONS
          </h1>
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Step into the arena where legends are born. Choose your battleground and prove your worth among the Gods of
            Olympus.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-gradient-to-r from-amber-500/20 to-red-500/20 backdrop-blur-sm rounded-full px-6 py-2 border border-amber-500/30">
              <span className="text-amber-400 font-semibold">🏆 Compete • Conquer • Celebrate 🏆</span>
            </div>
          </div>
        </div>

        <EventsGrid session={session} />
      </div>
    </div>
  )
}
