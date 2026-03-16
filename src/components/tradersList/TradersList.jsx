import React from 'react'
import './traderslist.css'
import { motion } from 'framer-motion'

const TradersList = () => {
  return (
    <section className='feature-stats-section'>
      {/* Traders Promo Section (White Card) */}
      <div className="spreads-promo-container">
        <div className="spreads-card">
          <div className="spreads-text-col">
            <h2 className="spreads-headline">Curated Strategies.<br />Proven Results.</h2>
            <ul className="spreads-list">
              <li>
                <span className="check-icon">✓</span>
                Verified track records with transparent history.
              </li>
              <li>
                <span className="check-icon">✓</span>
                One-click sync to mirror trades instantly.
              </li>
              <li>
                <span className="check-icon">✓</span>
                Filter by risk, return, and trading style.
              </li>
            </ul>
            <button className="btn-pricing">View All Master Traders</button>
          </div>

          <div className="spreads-visual-col">
            {/* CSS Phone Mockup */}
            <div className="phone-mockup">
              <div className="phone-screen">
                {/* Simplified App Header */}
                <div className="app-header">
                  <span className="menu-icon">☰</span>
                  <span>Top Traders</span>
                  <div className="app-icons">
                    <span>🔍</span><span>⚡</span>
                  </div>
                </div>
                {/* Trader List */}
                <div className="trader-row">
                  <div className="t-avatar av-3"></div>
                  <div className="t-details">
                    <span className="t-name">CryptoKing_99</span>
                    <span className="t-sub">Scalper • High Risk</span>
                  </div>
                  <div className="t-return positive">+1240%</div>
                </div>
                <div className="trader-row active-row">
                  <div className="t-avatar av-4"></div>
                  <div className="t-details">
                    <span className="t-name">SafeGrowth_FX</span>
                    <span className="t-sub">Swing • Low Risk</span>
                  </div>
                  <div className="t-return positive">+85%</div>
                </div>
                <div className="trader-row">
                  <div className="t-avatar av-5"></div>
                  <div className="t-details">
                    <span className="t-name">GlobalMacro</span>
                    <span className="t-sub">Day • Med Risk</span>
                  </div>
                  <div className="t-return positive">+312%</div>
                </div>
                <div className="trader-row">
                  <div className="t-avatar av-1"></div>
                  <div className="t-details">
                    <span className="t-name">GoldRush_X</span>
                    <span className="t-sub">Scalper • Med Risk</span>
                  </div>
                  <div className="t-return positive">+156%</div>
                </div>
              </div>

              {/* Floating Widget Overlay - Copier Alert */}
              <div className="floating-spread-widget">
                <div className="f-header">
                  <span className="f-symbol">New Copier!</span>
                  <span className="f-change">Just Now</span>
                </div>
                <div className="f-body-copy">
                  <div className="f-avatar-group">
                    <div className="f-avatar-s av-user"></div>
                    <span>linked to</span>
                    <div className="f-avatar-s av-4"></div>
                  </div>
                  <span className="f-action"><b>John D.</b> started copying <b>SafeGrowth_FX</b> with $5,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TradersList