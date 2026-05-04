import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/slices/productSlice'
import ProductGrid from '../components/Products/ProductGrid'

const OCCASIONS = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'baby', label: 'Baby Shower' },
  { value: 'housewarming', label: 'Housewarming' },
  { value: 'holiday', label: 'Holiday' },
]

const RECIPIENTS = [
  { value: 'friend', label: 'Friend' },
  { value: 'mom', label: 'Mom' },
  { value: 'baby', label: 'Baby' },
  { value: 'home', label: 'Home' },
  { value: 'pet', label: 'Pet' },
]

const STYLES = [
  { value: 'cozy', label: 'Cozy' },
  { value: 'colorful', label: 'Colorful' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'playful', label: 'Playful' },
]

const recommendationKeywords = {
  birthday: ['toy', 'amigurumi', 'colorful', 'gift'],
  anniversary: ['blanket', 'home', 'heart', 'cozy'],
  baby: ['baby', 'soft', 'booties', 'toy'],
  housewarming: ['home', 'decor', 'coaster', 'blanket'],
  holiday: ['gift', 'stocking', 'cozy', 'festive'],
  friend: ['colorful', 'fun', 'accessory', 'toy'],
  mom: ['cozy', 'blanket', 'decor', 'elegant'],
  home: ['decor', 'blanket', 'cozy', 'cushion'],
  pet: ['small', 'toy', 'playful', 'cute'],
  cozy: ['blanket', 'warm', 'soft', 'cushion'],
  colorful: ['colorful', 'bright', 'playful', 'fun'],
  minimal: ['simple', 'neutral', 'clean', 'elegant'],
  playful: ['toy', 'cute', 'fun', 'amigurumi'],
}

const getKeywords = (occasion, recipient, style) => {
  return [
    ...(recommendationKeywords[occasion] || []),
    ...(recommendationKeywords[recipient] || []),
    ...(recommendationKeywords[style] || []),
  ]
}

const GiftBuilder = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)
  const [occasion, setOccasion] = useState('birthday')
  const [recipient, setRecipient] = useState('friend')
  const [style, setStyle] = useState('cozy')
  const [giftNote, setGiftNote] = useState('')

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const recommendedProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return []
    }

    const keywords = getKeywords(occasion, recipient, style).map((keyword) => keyword.toLowerCase())

    const matched = products.filter((product) => {
      const name = product.name?.toLowerCase() || ''
      const category = product.category?.toLowerCase() || ''
      const description = product.description?.toLowerCase() || ''

      return keywords.some((keyword) =>
        name.includes(keyword) || category.includes(keyword) || description.includes(keyword),
      )
    })

    return matched.length > 0 ? matched.slice(0, 8) : products.slice(0, 8)
  }, [products, occasion, recipient, style])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-fuchsia-100 via-white to-slate-100 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Crochet Gift Builder</h1>
        <p className="text-gray-700 max-w-3xl mx-auto text-lg">
          Answer a few questions and get curated crochet gift ideas for every occasion.
        </p>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow p-8">
              <h2 className="text-3xl font-semibold mb-4">Build the perfect crochet gift</h2>
              <p className="text-gray-600 mb-8">
                Choose the occasion, recipient, and style. We will recommend crochet items that match your gift mood.
              </p>

              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
                  <select
                    className="w-full border rounded-xl px-4 py-3"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                  >
                    {OCCASIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                  <select
                    className="w-full border rounded-xl px-4 py-3"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  >
                    {RECIPIENTS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                  <select
                    className="w-full border rounded-xl px-4 py-3"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    {STYLES.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gift note</label>
                  <textarea
                    className="w-full border rounded-xl px-4 py-3 min-h-[140px]"
                    placeholder="Write a heartfelt message for the gift…"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-2">This note will be saved for your order summary.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl shadow p-6">
                <h3 className="text-xl font-semibold mb-3">Why this works</h3>
                <p className="text-gray-600 leading-7">
                  We use your answers to match crochet gifts with the right mood, occasion, and recipient. The result is personalized recommendations that feel handcrafted.
                </p>
              </div>
              <div className="bg-white rounded-3xl shadow p-6">
                <h3 className="text-xl font-semibold mb-3">Ready to send</h3>
                <p className="text-gray-600 leading-7">
                  After choosing items, you can save the note and checkout as usual. If you want a custom piece, head to our Custom Crochet page from the menu.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow p-8">
              <h3 className="text-2xl font-semibold mb-4">Your current pick</h3>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-semibold">Occasion:</span> {OCCASIONS.find((o) => o.value === occasion)?.label}</p>
                <p><span className="font-semibold">Recipient:</span> {RECIPIENTS.find((r) => r.value === recipient)?.label}</p>
                <p><span className="font-semibold">Style:</span> {STYLES.find((s) => s.value === style)?.label}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow p-8">
              <h3 className="text-2xl font-semibold mb-4">Gift tip</h3>
              <p className="text-gray-600 leading-7">
                {recipient === 'baby'
                  ? 'Soft textures, pastel colors and gentle shapes make the sweetest baby crochet gifts.'
                  : recipient === 'mom'
                    ? 'Choose comforting, elegant items that can be enjoyed every day.'
                    : recipient === 'pet'
                      ? 'Playful toys and small accessories are a perfect fit for a pet gift.'
                      : 'Bright, cheerful crochet pieces work well for friends and celebrations.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Recommended crochet gifts</h2>
              <p className="text-gray-600">Items selected based on your gift choices.</p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-white p-10 text-center text-gray-600 shadow">Loading recommendations…</div>
          ) : (
            <ProductGrid products={recommendedProducts} />
          )}
        </div>
      </div>
    </div>
  )
}

export default GiftBuilder
