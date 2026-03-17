import React, { useEffect } from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/footer/Footer'
import Contact from '../components/contact/Contact'
import { ImQuotesLeft } from 'react-icons/im'
import { AiFillStar } from 'react-icons/ai'
import '../components/review/review.css'
import './page.css'

const reviewsData = [
  {
    id: 1,
    name: "James Donald",
    text: "I've relied on Live-Synch for more than a year now, and the outcome has been remarkable. This platform links me to expert traders whose moves I can mirror automatically. It removes uncertainty from trading.",
    image: "/24.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "Paul Mossad",
    text: "Live-Synch has totally transformed how I navigate the markets. I wanted to begin trading but wasn't sure how to proceed. Their copytrading system, guided by pros, let me tap into the skills of experienced traders.",
    image: "/83.jpg",
    rating: 5
  },
  {
    id: 3,
    name: "Michael H.",
    text: "Going with Live-Synch has truly been one of my smartest financial choices. Its real-time trade mirroring, paired with a clean interface and transparent analytics, makes it easy to track my account activity.",
    image: "/92.jpg",
    rating: 5
  },
  {
    id: 4,
    name: "Sarah Jenkins",
    text: "The risk management tools are top-notch. I love being able to set my own safety parameters while still letting the master traders do their thing. It's the perfect balance of control and automation.",
    image: "https://i.pravatar.cc/150?u=12",
    rating: 5
  },
  {
    id: 5,
    name: "David Chen",
    text: "I was skeptical about copytrading at first, but the transparency here won me over. Seeing the exact history and win rates of the traders before I allocate capital gives me huge peace of mind.",
    image: "https://i.pravatar.cc/150?u=33",
    rating: 4
  },
  {
    id: 6,
    name: "Emma Watson",
    text: "As someone with a full-time job, I simply don't have the hours to stare at charts. Live-Synch allows my money to work for me while I focus on my career. The automated execution is flawless.",
    image: "https://i.pravatar.cc/150?u=44",
    rating: 5
  },
  {
    id: 7,
    name: "Robert Mckenzie",
    text: "The execution speed is incredible. I've used other copy platforms where slippage ate all my profits, but here the latency is practically non-existent. Highly recommended for serious investors.",
    image: "https://i.pravatar.cc/150?u=55",
    rating: 5
  },
  {
    id: 8,
    name: "Elena Rodriguez",
    text: "The interface is beautiful and intuitive. It took me less than 10 minutes to set up my account, fund it, and start copying my first strategy. Customer support was also very helpful.",
    image: "https://i.pravatar.cc/150?u=66",
    rating: 5
  },
  {
    id: 9,
    name: "Marcus Johnson",
    text: "I appreciate the diversity of strategies available. Whether I want a high-risk crypto approach or a conservative forex strategy, there's a verified master trader for it.",
    image: "https://i.pravatar.cc/150?u=77",
    rating: 4
  },
  {
    id: 10,
    name: "Sophie Clark",
    text: "I've tried learning technical analysis for years with mixed results. Switching to Live-Synch and letting professionals handle the analysis has completely turned my portfolio around.",
    image: "https://i.pravatar.cc/150?u=88",
    rating: 5
  },
  {
    id: 11,
    name: "Alex Thompson",
    text: "The withdrawal process is smooth and fast, which is rare in this industry. It's clear they value their clients' trust above everything else.",
    image: "https://i.pravatar.cc/150?u=99",
    rating: 5
  },
  {
    id: 12,
    name: "Olivia White",
    text: "I love the community aspect. Being able to see what other copiers are doing and which strategies are trending helps me make better decisions about where to allocate my funds.",
    image: "https://i.pravatar.cc/150?u=10",
    rating: 5
  },
  {
    id: 13,
    name: "William Davis",
    text: "The mobile app experience is fantastic. I can check my daily profits, adjust my risk settings, or switch master traders right from my phone while I'm on the go.",
    image: "https://i.pravatar.cc/150?u=11",
    rating: 4
  },
  {
    id: 14,
    name: "Linda Martinez",
    text: "The fact that master traders put their own skin in the game makes a huge difference. Knowing they are risking their own capital alongside mine ensures their interests are totally aligned with mine.",
    image: "https://i.pravatar.cc/150?u=13",
    rating: 5
  },
  {
    id: 15,
    name: "Thomas Anderson",
    text: "Great platform overall. The onboarding was smooth, and the dashboards give me all the metrics I need. The only thing I'd love to see is more stock-focused traders, but the forex and crypto options are superb.",
    image: "https://i.pravatar.cc/150?u=14",
    rating: 4
  },
  {
    id: 16,
    name: "Jessica Taylor",
    text: "I started with a very small account just to test the waters. Seeing consistent 4-5% monthly returns without doing any of the heavy lifting myself convinced me to scale up significantly.",
    image: "https://i.pravatar.cc/150?u=15",
    rating: 5
  },
  {
    id: 17,
    name: "Kevin Wright",
    text: "I manage a few different portfolios for family members, and Live-Synch makes it incredibly easy. The interface allows me to diversify across multiple strategies to keep drawdowns minimal.",
    image: "https://i.pravatar.cc/150?u=16",
    rating: 5
  },
  {
    id: 18,
    name: "Rachel Green",
    text: "The automated risk guard is a lifesaver. I set my maximum acceptable loss on a strategy, and the system automatically disconnects me if that threshold is hit. Simple and effective protection.",
    image: "https://i.pravatar.cc/150?u=17",
    rating: 5
  },
  {
    id: 19,
    name: "Daniel Lee",
    text: "What sets Live-Synch apart is the strict vetting process for their master traders. You don't have to sift through hundreds of amateur accounts—the leaderboard only features verified, consistent professionals.",
    image: "https://i.pravatar.cc/150?u=18",
    rating: 5
  },
  {
    id: 20,
    name: "Amanda Robinson",
    text: "A game changer for passive income. The compounding effect of letting professional traders grow my account while I literally do nothing is something I wish I had discovered a decade ago.",
    image: "https://i.pravatar.cc/150?u=19",
    rating: 5
  }
];

const Reviews = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <main className='review-page-bg' style={{ backgroundColor: '#000', minHeight: '100vh', paddingBottom: '0' }}>
        <Header />
        
        <section className='review-section' style={{ paddingTop: '150px' }}>
          <div className="section-container">
            <div className="section-header center-header" data-aos="fade-up">
              <h2>All Client <span className="highlight-text">Reviews</span></h2>
              <p>Discover what our community of profitable copytraders has to say about their journey to financial freedom.</p>
            </div>

            <div className="review-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              {reviewsData.map((review, index) => (
                <div className="review-glass-card" data-aos="fade-up" data-aos-delay={(index % 3) * 100} key={review.id}>
                  <div className="quote-icon">
                    <ImQuotesLeft />
                  </div>
                  <p className="review-text">
                    "{review.text}"
                  </p>
                  <div className="reviewer-info">
                    <img src={review.image} alt={review.name} className="reviewer-img" />
                    <div>
                      <h4>{review.name}</h4>
                      <div className="stars">
                        {[...Array(review.rating)].map((_, i) => (
                          <AiFillStar key={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default Reviews
