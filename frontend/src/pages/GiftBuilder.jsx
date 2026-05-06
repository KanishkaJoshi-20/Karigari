import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { fetchProducts } from '../redux/slices/productSlice'
import { addToCart } from '../redux/slices/cartSlice'
import { toggleWishlist } from '../redux/slices/wishlistSlice'
import { getImageUrl } from '../utils/getImageUrl'

/* ─── Data ─────────────────────────────────────────────────────────────── */

const OCCASIONS = [
  { value: 'birthday',     label: 'Birthday',     emoji: '🎂' },
  { value: 'anniversary',  label: 'Anniversary',  emoji: '💍' },
  { value: 'baby',         label: 'Baby Shower',  emoji: '🍼' },
  { value: 'housewarming', label: 'Housewarming', emoji: '🏡' },
  { value: 'holiday',      label: 'Holiday',      emoji: '🎁' },
  { value: 'graduation',   label: 'Graduation',   emoji: '🎓' },
]

const RECIPIENTS = [
  { value: 'friend', label: 'Friend', emoji: '👯' },
  { value: 'mom',    label: 'Mom',    emoji: '🌸' },
  { value: 'baby',   label: 'Baby',   emoji: '👶' },
  { value: 'home',   label: 'Home',   emoji: '🛋️' },
  { value: 'pet',    label: 'Pet',    emoji: '🐾' },
  { value: 'self',   label: 'Myself', emoji: '✨' },
]

const STYLES = [
  { value: 'cozy',     label: 'Cozy',     emoji: '☕' },
  { value: 'colorful', label: 'Colorful', emoji: '🌈' },
  { value: 'minimal',  label: 'Minimal',  emoji: '⚪' },
  { value: 'playful',  label: 'Playful',  emoji: '🎠' },
  { value: 'elegant',  label: 'Elegant',  emoji: '🌿' },
]

const BUDGETS = [
  { label: 'Under ₹500',     max: 500  },
  { label: '₹500 – ₹1,000', max: 1000 },
  { label: '₹1,000 – ₹2,000', max: 2000 },
  { label: 'No limit',       max: Infinity },
]

const KEYWORD_MAP = {
  birthday:     ['toy', 'amigurumi', 'colorful', 'gift', 'cute'],
  anniversary:  ['blanket', 'home', 'heart', 'cozy', 'elegant'],
  baby:         ['baby', 'soft', 'booties', 'toy', 'pastel'],
  housewarming: ['home', 'decor', 'coaster', 'blanket', 'cushion'],
  holiday:      ['gift', 'stocking', 'cozy', 'festive'],
  graduation:   ['accessory', 'gift', 'cute', 'keychain'],
  friend:       ['colorful', 'fun', 'accessory', 'toy', 'keychain'],
  mom:          ['cozy', 'blanket', 'decor', 'elegant', 'flower'],
  home:         ['decor', 'blanket', 'cozy', 'cushion', 'coaster'],
  pet:          ['small', 'toy', 'playful', 'cute'],
  self:         ['accessory', 'hair', 'earring', 'purse', 'bag'],
  cozy:         ['blanket', 'warm', 'soft', 'cushion'],
  colorful:     ['colorful', 'bright', 'playful', 'fun'],
  minimal:      ['simple', 'neutral', 'clean', 'elegant'],
  playful:      ['toy', 'cute', 'fun', 'amigurumi'],
  elegant:      ['elegant', 'decor', 'flower', 'earring'],
}

const GIFT_TIPS = {
  baby:   'Soft textures, pastel colors and gentle shapes make the sweetest baby crochet gifts.',
  mom:    'Choose comforting, elegant items that can be enjoyed every day — she deserves it!',
  pet:    'Playful toys and small accessories are perfect for the furry friend in your life.',
  friend: 'Bright, cheerful crochet pieces and keychains work wonderfully for friends.',
  home:   'Coasters, blankets and décor pieces make any space feel more handmade and warm.',
  self:   'Treat yourself! Hair accessories and purses are our most loved self-care picks.',
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

const scoreProduct = (product, keywords) => {
  const text = [
    product.name,
    product.category,
    product.description,
  ].join(' ').toLowerCase()

  return keywords.reduce((score, kw) => score + (text.includes(kw) ? 1 : 0), 0)
}

/* ─── Sub-components ────────────────────────────────────────────────────── */

function ChipSelector({ options, value, onChange, multi = false }) {
  const isSelected = (v) => (multi ? value.includes(v) : value === v)

  const toggle = (v) => {
    if (!multi) { onChange(v); return }
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v))
    } else {
      onChange([...value, v])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => toggle(opt.value)}
          className={`
            inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
            border-2 transition-all duration-200
            ${isSelected(opt.value)
              ? 'bg-primary border-primary text-white shadow-sm shadow-primary/30 scale-105'
              : 'bg-white border-slate-200 text-slate-700 hover:border-primary/50 hover:text-primary'
            }
          `}
        >
          <span>{opt.emoji}</span>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function BudgetChips({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {BUDGETS.map((b) => (
        <button
          key={b.label}
          type="button"
          onClick={() => onChange(b.max)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200
            ${value === b.max
              ? 'bg-primary border-primary text-white shadow-sm shadow-primary/30 scale-105'
              : 'bg-white border-slate-200 text-slate-700 hover:border-primary/50 hover:text-primary'
            }
          `}
        >
          {b.label}
        </button>
      ))}
    </div>
  )
}

function ProductCard({ product, wishlistItems, onAddToCart, onToggleWishlist }) {
  const isWishlisted = wishlistItems?.some((i) => i._id === product._id)

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden group border border-slate-100"
    >
      {/* Image */}
      <Link to={`/product/${product._id}`} className="block relative h-52 overflow-hidden bg-slate-50">
        <img
          src={getImageUrl(product.image || product.images?.[0]?.url)}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); onToggleWishlist(product) }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:scale-110 transition-transform z-10"
          aria-label="Toggle wishlist"
        >
          <span className={`material-symbols-outlined text-[18px] ${isWishlisted ? 'fill-1 text-primary' : 'text-slate-400'}`}>
            favorite
          </span>
        </button>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product._id}`} className="hover:text-primary transition-colors">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-1">{product.name}</h3>
        </Link>
        <p className="text-xs text-slate-400 mb-2">{product.category}</p>

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.numReviews})</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
          <span className="font-bold text-primary">₹{product.price}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-primary transition-colors font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Main Component ────────────────────────────────────────────────────── */

const GIFT_NOTE_KEY = 'karigari_gift_note'

const GiftBuilder = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)
  const { wishlistItems } = useSelector((state) => state.wishlist)

  const [occasion,  setOccasion]  = useState('birthday')
  const [recipient, setRecipient] = useState('friend')
  const [style,     setStyle]     = useState('cozy')
  const [budget,    setBudget]    = useState(Infinity)
  const [giftNote,  setGiftNote]  = useState(() => localStorage.getItem(GIFT_NOTE_KEY) || '')
  const [noteSaved, setNoteSaved] = useState(false)

  useEffect(() => { dispatch(fetchProducts({ limit: 100 })) }, [dispatch])

  // Persist gift note
  const handleNoteChange = (e) => {
    setGiftNote(e.target.value)
    setNoteSaved(false)
  }

  const handleSaveNote = () => {
    localStorage.setItem(GIFT_NOTE_KEY, giftNote)
    setNoteSaved(true)
    toast.success('Gift note saved!', { duration: 1500 })
  }

  const handleAddToCart = useCallback((product) => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: getImageUrl(product.image || product.images?.[0]?.url),
      price: product.price,
      qty: 1,
      countInStock: product.countInStock || 10,
    }))
    toast.success('Added to cart!', { duration: 1000 })
  }, [dispatch])

  const handleToggleWishlist = useCallback((product) => {
    dispatch(toggleWishlist(product))
  }, [dispatch])

  const recommendedProducts = useMemo(() => {
    if (!products?.length) return []

    const keywords = [
      ...(KEYWORD_MAP[occasion]  || []),
      ...(KEYWORD_MAP[recipient] || []),
      ...(KEYWORD_MAP[style]     || []),
    ]

    const budgetFiltered = products.filter((p) => p.price <= budget)

    const scored = budgetFiltered
      .map((p) => ({ product: p, score: scoreProduct(p, keywords) }))
      .sort((a, b) => b.score - a.score)

    // Return up to 8; if none scored, fallback to budget-filtered list
    const matched = scored.filter((x) => x.score > 0).map((x) => x.product)
    return (matched.length > 0 ? matched : budgetFiltered).slice(0, 8)
  }, [products, occasion, recipient, style, budget])

  const tip = GIFT_TIPS[recipient] || 'Bright, cheerful crochet pieces work well for any celebration.'
  const occasionLabel  = OCCASIONS.find((o) => o.value === occasion)
  const recipientLabel = RECIPIENTS.find((r) => r.value === recipient)
  const styleLabel     = STYLES.find((s) => s.value === style)
  const budgetLabel    = BUDGETS.find((b) => b.max === budget)?.label

  return (
    <div className="min-h-screen bg-[#FBF9F6]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#f5ede8] via-white to-[#f0ece8] py-16 px-4 text-center">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #B25A3820 0%, transparent 60%), radial-gradient(circle at 80% 20%, #d4956a18 0%, transparent 50%)' }}
        />
        <div className="relative max-w-2xl mx-auto">
          <span className="inline-block text-4xl mb-3">🎁</span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            Crochet Gift Builder
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            Tell us about the occasion and we'll curate handcrafted crochet gifts that feel made for them.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">

        {/* Builder Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Build the perfect gift</h2>
          <p className="text-slate-500 text-sm mb-8">Choose your preferences — recommendations update instantly.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-7">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">🎉 Occasion</label>
                <ChipSelector options={OCCASIONS} value={occasion} onChange={setOccasion} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">👤 Who's it for?</label>
                <ChipSelector options={RECIPIENTS} value={recipient} onChange={setRecipient} />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-7">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">🎨 Style vibe</label>
                <ChipSelector options={STYLES} value={style} onChange={setStyle} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">💰 Budget</label>
                <BudgetChips value={budget} onChange={setBudget} />
              </div>
            </div>
          </div>

          {/* Gift Note */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">📝 Gift note (optional)</label>
            <textarea
              className="w-full border-2 border-slate-200 focus:border-primary focus:outline-none rounded-xl px-4 py-3 min-h-[100px] text-sm text-slate-700 transition-colors resize-none"
              placeholder="Write a heartfelt message for your gift recipient…"
              value={giftNote}
              onChange={handleNoteChange}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-400">This note will be saved locally and shown on your order summary.</p>
              <button
                onClick={handleSaveNote}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
                  noteSaved
                    ? 'bg-green-50 text-green-600 border border-green-200'
                    : 'bg-primary text-white hover:opacity-90'
                }`}
              >
                {noteSaved ? '✓ Saved' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Summary */}
        <AnimatePresence>
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary/8 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5 flex flex-wrap items-center gap-3"
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">Your pick:</span>
            {[
              { icon: occasionLabel?.emoji,  text: occasionLabel?.label },
              { icon: recipientLabel?.emoji, text: `For ${recipientLabel?.label}` },
              { icon: styleLabel?.emoji,     text: styleLabel?.label },
              { icon: '💰',                  text: budgetLabel },
            ].map((tag) => (
              <span key={tag.text} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                {tag.icon} {tag.text}
              </span>
            ))}

            {/* Tip */}
            <span className="ml-auto text-xs text-slate-500 italic hidden lg:inline">{tip}</span>
          </motion.div>
        </AnimatePresence>

        {/* Recommendations */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Recommended gifts</h2>
              <p className="text-slate-500 text-sm mt-1">
                {loading
                  ? 'Finding the best matches…'
                  : `${recommendedProducts.length} curated picks based on your choices`
                }
              </p>
            </div>
            <Link
              to="/collections/all"
              className="text-sm text-primary font-semibold hover:underline"
            >
              Browse all →
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <p className="text-slate-500 text-sm">Loading recommendations…</p>
            </div>
          ) : recommendedProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <span className="text-4xl mb-3 block">😔</span>
              <p className="text-slate-600 font-medium">No products match your budget for this combination.</p>
              <button
                onClick={() => setBudget(Infinity)}
                className="mt-4 text-primary text-sm font-semibold hover:underline"
              >
                Remove budget limit
              </button>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {recommendedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlistItems={wishlistItems}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '🧶',
              title: 'Handcrafted with love',
              body: 'Every item is hand-crocheted using premium yarn — no two pieces are exactly alike.',
            },
            {
              icon: '📦',
              title: 'Gift-ready packaging',
              body: 'All orders are packed beautifully. Perfect for gifting straight out of the box.',
            },
            {
              icon: '✍️',
              title: 'Custom orders welcome',
              body: 'Need something truly unique? Visit our Custom Crochet page to request a one-of-a-kind piece.',
              link: { to: '/custom-crochet', label: 'Go to Custom Crochet →' },
            },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <span className="text-2xl mb-3 block">{card.icon}</span>
              <h3 className="font-semibold text-slate-900 mb-2">{card.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{card.body}</p>
              {card.link && (
                <Link to={card.link.to} className="mt-3 inline-block text-sm text-primary font-semibold hover:underline">
                  {card.link.label}
                </Link>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default GiftBuilder
