import React from 'react';
import { SEO } from '../components/SEO';
import { Navbar, Footer } from '../components/Navigation';
import { Quote, Heart, Shuffle, Quote as QuoteIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface QuoteEntry {
  id: string;
  text: string;
  author: string;
  category: string;
}

const FAVOURITE_QUOTES: QuoteEntry[] = [
  {
    id: '1',
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Inspiration"
  },
  {
    id: '2',
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
    category: "Life"
  },
  {
    id: '3',
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "Leadership"
  },
  {
    id: '4',
    text: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
    category: "Wisdom"
  },
  {
    id: '5',
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Motivation"
  },
  {
    id: '6',
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "Wisdom"
  }
];

export default function QuotesPage() {
  const [quoteOfTheDay, setQuoteOfTheDay] = React.useState<QuoteEntry>(FAVOURITE_QUOTES[0]);

  const handleShuffle = () => {
    const randomQuote = FAVOURITE_QUOTES[Math.floor(Math.random() * FAVOURITE_QUOTES.length)];
    setQuoteOfTheDay(randomQuote);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-black selection:text-white">
      <SEO 
        title="Favorite Quotes" 
        description="A curated collection of words that move us. Thoughts and inspirations from Tazim Sheriff."
        url="https://blog.tazimsheriff.dev/quotes"
      />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero: Quote of the Day */}
        <section className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black text-white p-12 md:p-24 rounded-[40px] relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <QuoteIcon size={200} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <span className="h-[1px] w-12 bg-[#F27D26]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F27D26]">Quote of the Day</span>
              </div>
              
              <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-12 italic max-w-4xl">
                "{quoteOfTheDay.text}"
              </h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm uppercase tracking-widest">— {quoteOfTheDay.author}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">{quoteOfTheDay.category}</p>
                </div>
                
                <button 
                  onClick={handleShuffle}
                  className="bg-white/10 hover:bg-white text-white hover:text-black p-4 rounded-full transition-all group"
                >
                  <Shuffle size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Favourite Quotes Grid */}
        <section>
          <div className="flex items-center justify-between mb-16 px-4">
            <div>
              <h3 className="font-serif text-4xl font-black mb-2 uppercase tracking-tighter">Favourites</h3>
              <p className="text-black/40 text-sm font-medium">Curated collection of words that move us.</p>
            </div>
            <div className="hidden sm:flex space-x-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/20">{FAVOURITE_QUOTES.length} Total</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FAVOURITE_QUOTES.map((quote, index) => (
              <motion.div 
                key={quote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white border border-black/5 p-10 rounded-3xl hover:shadow-2xl hover:-translate-y-2 transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <QuoteIcon size={24} className="text-[#F27D26] opacity-40" />
                  <button className="text-black/10 hover:text-red-500 transition-colors">
                    <Heart size={20} />
                  </button>
                </div>
                
                <p className="font-serif text-xl leading-relaxed mb-10 text-black/80">
                  {quote.text}
                </p>
                
                <div>
                  <p className="font-bold text-xs uppercase tracking-widest">— {quote.author}</p>
                  <span className="inline-block mt-4 px-3 py-1 bg-black/5 rounded-full text-[8px] font-black uppercase tracking-widest text-black/40">
                    {quote.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Inspiration Form */}
        <section className="mt-40 text-center bg-[#F27D26]/5 py-24 px-4 rounded-[40px] border border-[#F27D26]/10">
          <h3 className="font-serif text-4xl font-bold mb-6">Share your silence.</h3>
          <p className="text-black/60 max-w-lg mx-auto mb-10 leading-relaxed font-medium">
            Have a quote that changed your perspective? Send it to us and we might feature it in our daily curation.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input 
              type="text" 
              placeholder="Your favorite quote..." 
              className="flex-1 px-6 py-4 rounded-full border border-black/5 focus:ring-1 focus:ring-black/10 outline-none uppercase text-[10px] font-bold tracking-widest"
            />
            <button className="bg-black text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all shadow-xl shadow-black/10">
              Submit
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
