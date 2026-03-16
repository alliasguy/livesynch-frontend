import React, { useState, useEffect } from 'react'
import './landpage.css'
import Header from '../Header/Header'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Tickertape from '../Tickertape'
import { BsArrowRight, BsPlayCircle, BsShieldCheck } from 'react-icons/bs'
import { AiFillStar } from 'react-icons/ai'

const Landpage = () => {
  const navigate = useNavigate()
  // Simple fake live counter for "Active Copiers"
  const [copiers, setCopiers] = useState(12845);

  useEffect(() => {
    const interval = setInterval(() => {
      setCopiers(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className='landpage'>
      <div className="background-effects">
        <div className="glow-orb top-left"></div>
        <div className="glow-orb bottom-right"></div>
        <div className="grid-overlay"></div>
      </div>

      <Header />

      <div className='landpage-hero-wrapper'>
        <motion.div
          className='hero-centered-content'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className='hero-headline'>
            Mirror the World's <br />
            <span className='hero-highlight-text'>Best Traders Automatically</span>
          </h1>

          <p className='hero-subheadline'>
            Connect with Live-Synch to copy top-performing strategies. <br />
            No trading experience required. Your success, synchronized.
          </p>

          <div className='hero-actions'>
            <button className='btn-primary-green' onClick={() => navigate('/signup')}>
              Start Copying
            </button>
          </div>
        </motion.div>
      </div>


      {/* Stats Bar */}
      <div className="stats-bar-section">
        <div className="stat-item">
          <span className="stat-value">127%</span>
          <span className="stat-label">Average ROI</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{copiers.toLocaleString()}</span>
          <span className="stat-label">Active Copiers</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">85+</span>
          <span className="stat-label">Expert Master Traders</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">$4.2M+</span>
          <span className="stat-label">Total Profit Generated</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">24/7</span>
          <span className="stat-label">Dedicated Support</span>
        </div>
      </div>

      {/* Raw Spread Advantage Section */}
      <div className="raw-spread-section">
        <div className="raw-spread-container">
          {/* Left: Visual Widget Mockups */}
          <div className="raw-visuals-col">
            <div className="trader-cards-grid">
              {/* Trader Card 1 */}
              <div className="trader-card">
                <div className="trader-header">
                  <div className="trader-avatar av-1"></div>
                  <div className="trader-info">
                    <span className="name">SarahTrades</span>
                    <span className="strategy">Gold Scalper</span>
                  </div>
                  <div className="rank">#1</div>
                </div>
                <div className="trader-stats">
                  <div className="t-stat">
                    <span className="label">Return</span>
                    <span className="value positive">+482%</span>
                  </div>
                  <div className="t-stat">
                    <span className="label">Risk</span>
                    <span className="value low">Low</span>
                  </div>
                </div>
                <div className="trader-chart-mini">
                  {/* Simple CSS bar chart visualization */}
                  <div className="bar" style={{ height: '40%' }}></div>
                  <div className="bar" style={{ height: '60%' }}></div>
                  <div className="bar" style={{ height: '55%' }}></div>
                  <div className="bar" style={{ height: '80%' }}></div>
                  <div className="bar" style={{ height: '70%' }}></div>
                  <div className="bar" style={{ height: '90%' }}></div>
                  <div className="bar" style={{ height: '100%' }}></div>
                </div>
                <button className="btn-copy-card">Copy</button>
              </div>

              {/* Trader Card 2 */}
              <div className="trader-card glass-effect">
                <div className="trader-header">
                  <div className="trader-avatar av-2"></div>
                  <div className="trader-info">
                    <span className="name">AlexWalker_FX</span>
                    <span className="strategy">Swing Indices</span>
                  </div>
                  <div className="rank">#2</div>
                </div>
                <div className="trader-stats">
                  <div className="t-stat">
                    <span className="label">Return</span>
                    <span className="value positive">+315%</span>
                  </div>
                  <div className="t-stat">
                    <span className="label">Risk</span>
                    <span className="value medium">Med</span>
                  </div>
                </div>
                <div className="trader-chart-mini">
                  <div className="bar" style={{ height: '30%' }}></div>
                  <div className="bar" style={{ height: '45%' }}></div>
                  <div className="bar" style={{ height: '40%' }}></div>
                  <div className="bar" style={{ height: '60%' }}></div>
                  <div className="bar" style={{ height: '55%' }}></div>
                  <div className="bar" style={{ height: '75%' }}></div>
                  <div className="bar" style={{ height: '85%' }}></div>
                </div>
                <button className="btn-copy-card">Copy</button>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="raw-content-col">
            <h2 className="section-headline">Why Choose<br />Live-Synch?</h2>
            <p className="section-desc">
              Copytrading is the difference you have been waiting for. Live-Synch connects you with expert traders from around the globe.
              Automatically mirror their trades, manage your risk, and grow your portfolio without spending hours analyzing the markets.
              <b> Vetted Traders. Transparent Performance. 100% Automated.</b>
            </p>
            <div className="raw-actions">
              <button className="btn-primary-green" onClick={() => navigate('/signup')}>Start Copying</button>
            </div>
          </div>
        </div>
      </div>

      <Tickertape />
    </main>
  )
}

export default Landpage
