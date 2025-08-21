"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShoppingBag, ShoppingCart, Star, Heart, Search, X, Plus, Minus } from "lucide-react"
import type { Merch } from "@/lib/models/Merch"
import type { Session } from "next-auth"

interface MerchGridProps {
  session: Session | null
}

export function MerchGrid({ session }: MerchGridProps) {
  const [merch, setMerch] = useState<Merch[]>([])
  const [filteredMerch, setFilteredMerch] = useState<Merch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [ordering, setOrdering] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Merch | null>(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetchMerch()
  }, [])

  useEffect(() => {
    const filtered = merch.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
        default:
          return a.title.localeCompare(b.title)
      }
    })

    setFilteredMerch(filtered)
  }, [merch, searchTerm, sortBy])

  const fetchMerch = async () => {
    try {
      const response = await fetch("/api/merch")
      if (response.ok) {
        const data = await response.json()
        setMerch(data)
      }
    } catch (error) {
      console.error("Error fetching merch:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrder = async (merchId: string, size: string) => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (!size) {
      setMessage({ type: "error", text: "Please select a size" })
      return
    }

    setOrdering(merchId)
    setMessage(null)

    try {
      const response = await fetch("/api/merch/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchId, size, quantity }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Order placed successfully!" })
        setSelectedProduct(null)
        setSelectedSize("")
        setQuantity(1)
      } else {
        setMessage({ type: "error", text: data.error || "Order failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setOrdering(null)
    }
  }

  const openProductModal = (product: Merch) => {
    setSelectedProduct(product)
    setSelectedImageIndex(0)
    setSelectedSize("")
    setQuantity(1)
  }

  const toggleFavorite = (merchId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(merchId)) {
        newFavorites.delete(merchId)
      } else {
        newFavorites.add(merchId)
      }
      return newFavorites
    })
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
        <p className="mt-4 text-slate-400">Loading merchandise...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert
          className={
            message.type === "success" ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"
          }
        >
          <AlertDescription className={message.type === "success" ? "text-green-400" : "text-red-400"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search merchandise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-600 text-slate-200 placeholder-slate-400"
              />
            </div>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-slate-900/50 border-slate-600 text-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredMerch.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            {searchTerm ? "No merchandise found" : "No Merchandise Available"}
          </h3>
          <p className="text-slate-500">
            {searchTerm ? "Try adjusting your search terms" : "Merchandise will be available soon. Stay tuned!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMerch.map((item) => {
            const isFavorite = favorites.has(item._id?.toString() || "")

            return (
              <div
                key={item._id?.toString()}
                className="group relative cursor-pointer"
                onClick={() => openProductModal(item)}
              >
                <div className="relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 group-hover:border-rose-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-rose-500/10">
                  <div className="relative w-full h-80 overflow-hidden">
                    <img
                      src={item.images[0] || "/placeholder.svg?height=400&width=400&query=sports merchandise hoodie"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-slate-200 line-clamp-2 mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-rose-600 text-sm px-3 py-1">₹{item.price}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">4.5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(item._id?.toString() || "")
                    }}
                    className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                  </Button>

                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge className="bg-amber-500/90 text-black text-xs font-medium">Click to View</Badge>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-5xl bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">{selectedProduct?.title}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-lg bg-slate-800">
                  <img
                    src={
                      selectedProduct.images[selectedImageIndex] ||
                      "/placeholder.svg?height=500&width=500&query=sports merchandise"
                    }
                    alt={selectedProduct.title}
                    className="w-full h-96 object-cover"
                  />
                </div>

                {selectedProduct.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {selectedProduct.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`${selectedProduct.title} ${index + 1}`}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-colors flex-shrink-0 ${
                          selectedImageIndex === index ? "border-rose-500" : "border-slate-600 hover:border-slate-500"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product details section */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.5 (128 reviews)</span>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-rose-500">₹{selectedProduct.price}</span>
                  <Badge className="bg-green-600">In Stock</Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Size</label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {selectedProduct.sizes.map((size) => (
                          <SelectItem key={size} value={size} className="text-white">
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="border-slate-600 text-white hover:bg-slate-800"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="border-slate-600 text-white hover:bg-slate-800"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => handleOrder(selectedProduct._id?.toString() || "", selectedSize)}
                    disabled={ordering === selectedProduct._id?.toString() || !session || !selectedSize}
                    className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-medium py-3 text-lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {ordering === selectedProduct._id?.toString()
                      ? "Processing..."
                      : !session
                        ? "Login to Order"
                        : `Add to Cart - ₹${selectedProduct.price * quantity}`}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => toggleFavorite(selectedProduct._id?.toString() || "")}
                    className="w-full border-slate-600 text-white hover:bg-slate-800"
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${favorites.has(selectedProduct._id?.toString() || "") ? "fill-rose-500 text-rose-500" : ""}`}
                    />
                    {favorites.has(selectedProduct._id?.toString() || "") ? "Remove from Wishlist" : "Add to Wishlist"}
                  </Button>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>• Free shipping on orders above ₹999</p>
                  <p>• 7-day return policy</p>
                  <p>• Official RANN-NEETI merchandise</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
