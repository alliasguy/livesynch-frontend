import React from 'react'
import './admindashboard.css'
import Swal from 'sweetalert2'
import axios from "axios"
import { useState, useEffect } from 'react'
import { BsEye, BsEyeSlash, BsImage } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader'
import { FaEllipsisH, FaRegChartBar, FaBars } from "react-icons/fa"
import { MdClose, MdCandlestickChart, MdOutlineShowChart, MdDeleteSweep, MdAddchart } from 'react-icons/md'
import { RxUpload, RxDashboard } from 'react-icons/rx'
import { FiLogOut, FiRefreshCw, FiUsers } from 'react-icons/fi'
import { HiShieldCheck } from 'react-icons/hi'

const Admindashboard = ({ route }) => {

  // ── Data Fetching ──────────────────────────────────────────────────────────
  const fetchTraders = async () => {
    const req = await fetch(`${route}/api/fetchTraders`, {
      headers: { 'Content-Type': 'application/json' }
    })
    const res = await req.json()
    setLoader(false)
    if (res.status === 200) setTraders(res.traders)
    else setTraders([])
  }

  const fetchUsers = async () => {
    const req = await fetch(`${route}/api/getUsers`, {
      headers: { 'Content-Type': 'application/json' }
    })
    const res = await req.json()
    setLoader(false)
    if (res) setUsers(res)
    else setUsers([])
  }

  useEffect(() => {
    setLoader(true)
    fetchUsers()
    fetchTraders()
  }, [])

  // ── Toast ──────────────────────────────────────────────────────────────────
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  // ── Credit User ────────────────────────────────────────────────────────────
  const creditUser = async () => {
    setLoader(true)
    const req = await fetch(`${route}/api/fundwallet`, {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({ amount: userAmount, email: email })
    })
    const res = await req.json()
    setLoader(false)
    if (res.status === 'ok') {
      Toast.fire({ icon: 'success', title: `Account credited with $${res.funded} USD` })
      const data = {
        service_id: 'service_v81s9q6',
        template_id: 'template_kat7an6',
        user_id: 'GZMEJ032T4bAvYE-D',
        template_params: {
          name: `${res.name}`, email: `${res.email}`,
          message: `${res.message}`, reply_to: `support@live-synch.com`,
          subject: `${res.subject}`
        }
      }
      if (res.upline === null) {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      } else {
        const uplineData = {
          service_id: 'service_v81s9q6',
          template_id: 'template_kat7an6',
          user_id: 'GZMEJ032T4bAvYE-D',
          template_params: {
            name: `${res.uplineName}`, email: `${res.uplineEmail}`,
            message: `${res.uplineMessage}`, reply_to: `support@live-synch.com`,
            subject: `${res.uplineSubject}`
          }
        }
        await Promise.all([
          fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }),
          fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(uplineData),
          })
        ])
      }
      setEmail('')
      setUserAmount('')
      fetchUsers()
    } else {
      Toast.fire({ icon: 'error', title: `Something went wrong: ${res.error}` })
    }
  }

  // ── Debit User ─────────────────────────────────────────────────────────────
  const debitUser = async () => {
    setLoader(true)
    const req = await fetch(`${route}/api/debitwallet`, {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({ amount: userAmount, email: email })
    })
    const res = await req.json()
    setLoader(false)
    if (res.status === 'ok') {
      Toast.fire({ icon: 'success', title: `Account debited with $${res.funded} USD` })
      const data = {
        service_id: 'service_v81s9q6',
        template_id: 'template_kat7an6',
        user_id: 'GZMEJ032T4bAvYE-D',
        template_params: {
          name: `${res.name}`, email: `${res.email}`,
          message: `${res.message}`, reply_to: `support@live-synch.com`,
          subject: `${res.subject}`
        }
      }
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setEmail('')
      setUserAmount('')
      fetchUsers()
    } else {
      Toast.fire({ icon: 'error', title: `Amount ${res.funded} exceeds user capital. ${res.error}` })
    }
  }

  // ── Approve Withdraw ───────────────────────────────────────────────────────
  const approveWithdraw = async () => {
    const userDetails = await fetch(`${route}/api/getWithdrawInfo`, {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({ email: activeEmail })
    })
    const awaitedData = await userDetails.json()
    if (awaitedData.amount !== undefined) {
      const data = {
        service_id: 'service_v81s9q6',
        template_id: 'template_kat7an6',
        user_id: 'GZMEJ032T4bAvYE-D',
        template_params: {
          name: `${name}`, email: `${activeEmail}`,
          message: `Congratulations! Your withdrawal $${awaitedData.amount} has been approved.`,
          reply_to: `support@live-synch.com`,
          subject: `Successful Withdrawal`
        }
      }
      Toast.fire({ icon: 'success', title: `Approval email sent` })
      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } else {
      Toast.fire({ icon: 'error', title: `User hasn't made any withdrawal yet` })
    }
  }

  // ── Upgrade User ───────────────────────────────────────────────────────────
  const upgradeUser = async () => {
    setLoader(true)
    const req = await fetch(`${route}/api/upgradeUser`, {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({ amount: userAmount, email: activeEmail })
    })
    const res = await req.json()
    setLoader(false)
    if (res.status === 'ok') {
      Toast.fire({ icon: 'success', title: `Account upgraded by $${res.funded} USD in profit` })
      setShowUpgradeModal(false)
      fetchUsers()
    } else {
      Toast.fire({ icon: 'error', title: `Something went wrong` })
    }
  }

  // ── Distribute Profit ──────────────────────────────────────────────────────
  const applyBulkAllocation = () => {
    if (!copyTraders || copyTraders.length === 0) return
    const newAllocations = {}
    copyTraders.forEach(user => {
      newAllocations[user._id] = { amount: parseFloat(bulkAmount) || 0, type: bulkType }
    })
    setIndividualAllocations(newAllocations)
  }

  const updateTraderLog = async () => {
    try {
      const date = new Date()
      const today = date.toLocaleDateString()
      const masterTradeLog = { ...activeTrader, id: activeTraderId, tradeType: selectedValue || 'profit', date: today }
      const distributions = copyTraders.map(user => {
        const allocation = individualAllocations[user._id] || {}
        return {
          email: user.email, amount: allocation.amount || 0,
          type: allocation.type || 'profit', pair: masterTradeLog.pair || 'Unknown Asset'
        }
      }).filter(d => d.amount > 0)

      setLoader(true)
      const req = await fetch(`${route}/api/distributeProfit`, {
        method: 'POST',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ distributions, traderId: activeTraderId, addToHistory: true, masterTradeLog })
      })
      const res = await req.json()
      setLoader(false)
      if (res.status === 'ok') {
        Toast.fire({ icon: 'success', title: `Profits/Losses distributed successfully!` })
        setShowTraderLogForm(false)
        fetchTraders()
        setIndividualAllocations({})
        setCopyTraders([])
      } else {
        Toast.fire({ icon: 'error', title: `Something went wrong: ${res.error || 'Unknown error'}` })
      }
    } catch (error) {
      console.error(error)
      setLoader(false)
      Toast.fire({ icon: 'error', title: `Client error: ${error.message}` })
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteUser = async (email) => {
    const req = await fetch(`${route}/api/deleteUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const res = await req.json()
    if (res.status === 200) {
      setShowDeletModal(false)
      Toast.fire({ icon: 'success', title: `User successfully deleted` })
      fetchUsers()
    } else {
      Toast.fire({ icon: 'error', title: `Something went wrong` })
    }
  }

  const deleteTrader = async (id) => {
    const req = await fetch(`${route}/api/deleteTrader`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    const res = await req.json()
    if (res.status === 200) {
      setShowDeletModal(false)
      Toast.fire({ icon: 'success', title: `Trader successfully deleted` })
      fetchTraders()
    } else {
      Toast.fire({ icon: 'error', title: `Something went wrong` })
    }
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async () => {
    setLoader(true)
    const req = await fetch(`${route}/api/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const res = await req.json()
    setLoader(false)
    if (res.status === 200) {
      localStorage.setItem('token', res.token || 'admin')
      SetShowFoarm(false)
      setShowDasboard(true)
    } else {
      Toast.fire({ icon: 'error', title: 'Invalid credentials' })
    }
  }

  // ── Create Trader ──────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    firstname: "", lastname: "", winRate: "", avgReturn: "",
    followers: "", riskRewardRatio: "", nationality: "", minimumcapital: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoader(true)
    const FormData = { ...formData, traderImage: showImage }
    try {
      const response = await axios.post(`${route}/api/createTrader`, FormData)
      console.log("Trader created:", response.data)
      setFormData({ firstname: "", lastname: "", winRate: "", avgReturn: "", followers: "", riskRewardRatio: "", nationality: "", minimumCapital: "" })
      setLoader(false)
      Toast.fire({ icon: 'success', title: `Trader successfully created!` })
      fetchTraders()
    } catch (error) {
      setLoader(false)
      Toast.fire({ icon: 'error', title: `Error creating trader: ${error}` })
    }
  }

  const uploadProof = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'upload')
    const req = await fetch('https://api.cloudinary.com/v1_1/duesyx3zu/image/upload', {
      method: 'POST', body: formData,
    })
    const res = await req.json()
    if (res) setShowImage(res.secure_url)
  }

  // ── KYC ───────────────────────────────────────────────────────────────────
  const verifyUserPdtStatus = async (id) => {
    setLoader(true)
    const req = await fetch(`${route}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    await req.json()
    setLoader(false)
    fetchUsers()
  }

  const approveKYC = async (user) => {
    const email = user.email
    const result = await Swal.fire({
      title: 'Approve KYC?',
      text: "This will approve the user's KYC verification",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve',
      cancelButtonText: 'Cancel'
    })
    if (result.isConfirmed) {
      setLoader(true)
      try {
        const response = await fetch(`${route}/api/admin/approveKYC`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
        const data = await response.json()
        setLoader(false)
        if (data.status === 'ok') {
          Toast.fire({ icon: 'success', title: 'KYC Approved Successfully' })
          const emailData = {
            service_id: 'service_v81s9q6',
            template_id: 'template_kat7an6',
            user_id: 'GZMEJ032T4bAvYE-D',
            template_params: {
              name: `${user.firstname}`, email: `${user.email}`,
              message: `Congratulations, ${user.firstname}! Your KYC verification has been approved.`,
              reply_to: `support@live-synch.com`,
              subject: `KYC Verification Approved`
            }
          }
          await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailData),
          })
          fetchUsers()
        } else {
          Toast.fire({ icon: 'error', title: 'Failed to approve KYC' })
        }
      } catch (error) {
        setLoader(false)
        Toast.fire({ icon: 'error', title: 'An error occurred' })
      }
    }
  }

  const rejectKYC = async (email) => {
    const { value: reason } = await Swal.fire({
      title: 'Reject KYC',
      input: 'textarea',
      inputLabel: 'Rejection Reason',
      inputPlaceholder: 'Enter reason for rejection...',
      inputAttributes: { 'aria-label': 'Enter rejection reason' },
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel'
    })
    if (reason) {
      setLoader(true)
      try {
        const response = await fetch(`${route}/api/admin/rejectKYC`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, reason })
        })
        const data = await response.json()
        setLoader(false)
        if (data.status === 'ok') {
          Toast.fire({ icon: 'success', title: 'KYC Rejected' })
          fetchUsers()
        } else {
          Toast.fire({ icon: 'error', title: 'Failed to reject KYC' })
        }
      } catch (error) {
        setLoader(false)
        Toast.fire({ icon: 'error', title: 'An error occurred' })
      }
    }
  }

  // ── State ──────────────────────────────────────────────────────────────────
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [showDeleteModal, setShowDeletModal] = useState(false)
  const [activeEmail, setActiveEmail] = useState('')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showForm, SetShowFoarm] = useState(true)
  const [showDashboard, setShowDasboard] = useState(false)
  const [users, setUsers] = useState()
  const [loader, setLoader] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [userAmount, setUserAmount] = useState()
  const [showModal, setShowModal] = useState(false)
  const [showCreateTrader, setShowCreateTrader] = useState(false)
  const [showTraderLogs, setShowTraderLogs] = useState(false)
  const [showUsers, setShowUsers] = useState(true)
  const [showImage, setShowImage] = useState()
  const [traders, setTraders] = useState([])
  const [activeTrader, setActiveTrader] = useState({})
  const [showTraderLogForm, setShowTraderLogForm] = useState(false)
  const [activeTraderId, setActiveTraderId] = useState()
  const [selectedValue, setSelectedValue] = useState()
  const [debitModal, setDebitModal] = useState(false)
  const [copyTraders, setCopyTraders] = useState([])
  const [individualAllocations, setIndividualAllocations] = useState({})
  const [activeActionMenu, setActiveActionMenu] = useState(null)
  const [activeMenuUser, setActiveMenuUser] = useState(null)
  const [menuPos, setMenuPos] = useState({ top: 'auto', bottom: 'auto', right: 0 })
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [bulkAmount, setBulkAmount] = useState('')
  const [bulkType, setBulkType] = useState('profit')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  useEffect(() => {
    const handleClickOutside = () => setActiveActionMenu(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  // ── Nav Helpers ────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }
  const openCreateTrader = () => {
    setShowCreateTrader(true); setShowTraderLogs(false); setShowUsers(false); setSidebarOpen(false)
  }
  const openTraderLogs = () => {
    setShowTraderLogs(true); setShowUsers(false); setShowCreateTrader(false); setSidebarOpen(false)
  }
  const openUsers = () => {
    setShowCreateTrader(false); setShowTraderLogs(false); setShowUsers(true); setSidebarOpen(false)
  }

  const pageTitle = showUsers ? 'User Management' : showCreateTrader ? 'Create Trader' : 'Trader Logs'

  // ── Trade pair options ─────────────────────────────────────────────────────
  const forexPairs = ['EUR/USD','USD/JPY','XAU/USD','GBP/USD','USD/CHF','AUD/USD','USD/CAD','NZD/USD']
  const indices = [['US30','Dow Jones'],['NAS100','Nasdaq 100'],['SPX500','S&P 500'],['GER40','DAX 40'],['UK100','FTSE 100'],['JPN225','Nikkei 225'],['FRA40','CAC 40'],['AUS200','ASX 200'],['HK50','Hang Seng'],['EU50','Euro Stoxx 50'],['ES35','IBEX 35'],['SWI20','SMI']]
  const cryptos = ['BTC/USD','ETH/USD','XRP/USD','SOL/USD','DOGE/USD','ADA/USD','LTC/USD','BNB/USD','AVAX/USD','TRX/USD','DOT/USD','SHIB/USD','MATIC/USD']
  const stocks = ['AAPL','GOOGL','MSFT','AMZN','META','TSLA','NVDA','NFLX','AMD','INTC','BA','JPM','V','MA','XOM','CVX','BABA','UBER','DIS','KO','NKE','MOVE','REVB','DRCT','IOTR','HCTI','NAMM','ASTI','IOBT']

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="ad-root">
      {loader && <Loader />}

      {/* ════════════════════════ LOGIN ════════════════════════ */}
      {showForm && (
        <div className="ad-login-bg">
          <form className="ad-login-card" onSubmit={(e) => { e.preventDefault(); login() }}>
            <img src="/livesynchlogo3.png" alt="Live-Synch" className="ad-login-logo" />
            <div className="ad-login-title">
              <h2>Welcome, Admin</h2>
              <p>Sign in to access the control panel</p>
            </div>
            <div className="ad-field">
              <label>Email Address</label>
              <input
                type="text"
                placeholder="admin@live-synch.com"
                className="ad-input"
                required
                onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
              />
            </div>
            <div className="ad-field">
              <label>Password</label>
              <div className="ad-input-eye-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="ad-input"
                  required
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value.trim())}
                />
                <button type="button" className="ad-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <BsEye /> : <BsEyeSlash />}
                </button>
              </div>
            </div>
            <button type="submit" className="ad-login-btn">Sign In to Admin Panel</button>
          </form>
        </div>
      )}

      {/* ════════════════════════ DASHBOARD ════════════════════════ */}
      {showDashboard && (
        <div className="ad-layout">

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div className="ad-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
          )}

          {/* ──────────── SIDEBAR ──────────── */}
          <aside className={`ad-sidebar${sidebarOpen ? ' open' : ''}${sidebarCollapsed ? ' collapsed' : ''}`}>

            {/* Brand */}
            <div className="ad-sidebar-header">
              {!sidebarCollapsed && (
                <div className="ad-brand">
                  <img src="/livesynchlogo3.png" alt="Live-Synch" className="ad-sidebar-logo" />
                  <span className="ad-version-tag">v1.0</span>
                </div>
              )}
              <button className="ad-collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title="Toggle sidebar">
                {sidebarCollapsed ? '›' : '‹'}
              </button>
            </div>

            {/* Nav */}
            <nav className="ad-nav">
              {!sidebarCollapsed && <span className="ad-nav-label">Navigation</span>}

              <button className={`ad-nav-item${showUsers ? ' active' : ''}`} onClick={openUsers} title="Users">
                <FiUsers className="ad-nav-icon" />
                {!sidebarCollapsed && <span>Users</span>}
                {!sidebarCollapsed && users && users.length > 0 && (
                  <span className="ad-nav-badge">{users.length}</span>
                )}
              </button>

              <button className={`ad-nav-item${showCreateTrader ? ' active' : ''}`} onClick={openCreateTrader} title="Create Trader">
                <MdAddchart className="ad-nav-icon" />
                {!sidebarCollapsed && <span>Create Trader</span>}
              </button>

              <button className={`ad-nav-item${showTraderLogs ? ' active' : ''}`} onClick={openTraderLogs} title="Trader Logs">
                <FaRegChartBar className="ad-nav-icon" />
                {!sidebarCollapsed && <span>Trader Logs</span>}
                {!sidebarCollapsed && traders && traders.length > 0 && (
                  <span className="ad-nav-badge">{traders.length}</span>
                )}
              </button>
            </nav>

            {/* Footer */}
            <div className="ad-sidebar-footer">
              {!sidebarCollapsed && <span className="ad-nav-label">Account</span>}

              <Link to="/dashboard" className="ad-nav-item footer-link" title="User Dashboard">
                <RxDashboard className="ad-nav-icon" />
                {!sidebarCollapsed && <span>User Dashboard</span>}
              </Link>

              <button className="ad-nav-item ad-nav-danger" onClick={logout} title="Sign Out">
                <FiLogOut className="ad-nav-icon" />
                {!sidebarCollapsed && <span>Sign Out</span>}
              </button>
            </div>

            {/* Status strip */}
            <div className="ad-status-strip">
              <span className="ad-pulse-dot" />
              {!sidebarCollapsed && <span>Admin Mode Active</span>}
            </div>

          </aside>

          {/* ──────────── MAIN ──────────── */}
          <div className="ad-main">

            {/* Page Header */}
            <header className="ad-page-header">
              <button className="ad-hamburger" onClick={() => setSidebarOpen(true)}>
                <FaBars />
              </button>
              <div className="ad-page-header-left">
                <h1 className="ad-page-title">{pageTitle}</h1>
                <div className="ad-page-meta">
                  <span className="ad-live-dot" />
                  <span className="ad-live-label">LIVE</span>
                  <span className="ad-meta-text">· Updated {lastRefresh.toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="ad-page-header-right">
                <button
                  className="ad-refresh-btn"
                  onClick={() => {
                    setLoader(true); fetchUsers(); fetchTraders(); setLastRefresh(new Date())
                  }}
                >
                  <FiRefreshCw /> Refresh
                </button>
                <span className="ad-admin-badge">
                  <HiShieldCheck /> Admin
                </span>
              </div>
            </header>

            {/* ──────────── CONTENT BODY ──────────── */}
            <div className="ad-body">

              {/* ═══ USERS VIEW ═══ */}
              {showUsers && (
                <>
                  {/* User Details Modal */}
                  {showUserDetailsModal && selectedUser && (
                    <div className="ad-modal-backdrop">
                      <div className="ad-modal">
                        <div className="ad-modal-header">
                          <h2>User Details</h2>
                          <button className="ad-modal-close" onClick={() => setShowUserDetailsModal(false)}>
                            <MdClose />
                          </button>
                        </div>
                        <div className="ad-user-details">
                          {[
                            ['Full Name', `${selectedUser.firstname} ${selectedUser.lastname}`],
                            ['Email', selectedUser.email],
                            ['Username', `@${selectedUser.username}`],
                            ['Password', selectedUser.password],
                            ['Balance', `$${selectedUser.funded?.toLocaleString()}`],
                            ['KYC Status', selectedUser.kycStatus || 'Not Submitted'],
                          ].map(([label, val]) => (
                            <div className="ad-detail-row" key={label}>
                              <span className="ad-detail-label">{label}</span>
                              <span className="ad-detail-val">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {users && users.length > 0 ? (
                    <div className="ad-table-wrap">
                      {/* scroll wrapper: only the table scrolls horizontally */}
                      <div className="ad-table-scroll">
                        <table className="ad-table">
                          <thead>
                            <tr>
                              <th>USER</th>
                              <th>KYC STATUS</th>
                              <th>BALANCE</th>
                              <th>CREDIT / DEBIT</th>
                              <th>ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map(refer => (
                              <tr key={refer.email}>
                                <td>
                                  <div className="ad-user-cell">
                                    <span className="ad-user-name">{refer.firstname} {refer.lastname}</span>
                                    <span className="ad-user-email">{refer.email}</span>
                                    <span className="ad-user-handle">@{refer.username}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className={`ad-kyc-badge kyc-${refer.kycStatus || 'pending'}`}>
                                    {refer.kycStatus ? refer.kycStatus.replace('_', ' ') : 'Not Submitted'}
                                  </span>
                                </td>
                                <td>
                                  <span className="ad-mono">${refer.funded?.toLocaleString()}</span>
                                </td>
                                <td>
                                  <div className="ad-credit-debit">
                                    <span className="ad-credit">+${refer.credit || 0}</span>
                                    <span className="ad-debit">-${refer.debit || 0}</span>
                                  </div>
                                </td>
                                <td className="ad-actions-cell">
                                  <button
                                    className="ad-ellipsis-btn"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      const wrap = e.currentTarget.closest('.ad-table-wrap')
                                      const wrapRect = wrap.getBoundingClientRect()
                                      const btnRect = e.currentTarget.getBoundingClientRect()
                                      const spaceBelow = wrapRect.bottom - btnRect.bottom
                                      setMenuPos(spaceBelow > 280
                                        ? { top: btnRect.bottom - wrapRect.top + 4, bottom: 'auto', right: wrapRect.right - btnRect.right }
                                        : { top: 'auto', bottom: wrapRect.bottom - btnRect.top + 4, right: wrapRect.right - btnRect.right }
                                      )
                                      setActiveMenuUser(refer)
                                      setActiveActionMenu(activeActionMenu === refer.email ? null : refer.email)
                                    }}
                                  >
                                    <FaEllipsisH />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* dropdown rendered outside scroll wrapper so it is never clipped */}
                      {activeActionMenu && activeMenuUser && (
                        <div
                          className="ad-action-menu"
                          style={{ top: menuPos.top, bottom: menuPos.bottom, right: menuPos.right }}
                        >
                          <button onClick={() => { setSelectedUser(activeMenuUser); setShowUserDetailsModal(true); setActiveActionMenu(null) }}>
                            View Details
                          </button>
                          <button onClick={() => { setShowModal(true); setEmail(activeMenuUser.email); setActiveActionMenu(null) }}>
                            Credit Account
                          </button>
                          <button onClick={() => { setDebitModal(true); setEmail(activeMenuUser.email); setActiveActionMenu(null) }}>
                            Debit Account
                          </button>
                          <button onClick={() => { setShowUpgradeModal(true); setActiveEmail(activeMenuUser.email); setActiveActionMenu(null) }}>
                            Upgrade User
                          </button>
                          <button onClick={() => { verifyUserPdtStatus(activeMenuUser._id); setActiveActionMenu(null) }}>
                            {activeMenuUser.verified ? 'Lock PDT' : 'Unlock PDT'}
                          </button>
                          <button onClick={() => { setActiveEmail(activeMenuUser.email); setName(activeMenuUser.firstname); approveWithdraw(); setActiveActionMenu(null) }}>
                            Approve Withdraw
                          </button>
                          <button onClick={() => { approveKYC(activeMenuUser); setActiveActionMenu(null) }}>
                            Approve KYC
                          </button>
                          <button className="ad-menu-danger" onClick={() => { rejectKYC(activeMenuUser.email); setActiveActionMenu(null) }}>
                            Reject KYC
                          </button>
                          <div className="ad-menu-divider" />
                          <a href={`mailto:${activeMenuUser.email}`} className="ad-menu-link">
                            Send Email
                          </a>
                          <button className="ad-menu-danger" onClick={() => { setShowDeletModal(true); setActiveEmail(activeMenuUser.email); setActiveActionMenu(null) }}>
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="ad-empty">
                      <FiUsers className="ad-empty-icon" />
                      <p className="ad-empty-text">No registered users yet</p>
                      <Link to="/" className="ad-empty-link">Go to Homepage</Link>
                    </div>
                  )}
                </>
              )}

              {/* ═══ CREATE TRADER VIEW ═══ */}
              {showCreateTrader && (
                <div className="ad-create-trader-wrap">
                  <form className="ad-trader-form" onSubmit={handleSubmit}>
                    <div className="ad-avatar-upload">
                      <div className="ad-avatar-circle">
                        {showImage ? <img src={showImage} alt="Trader" /> : <BsImage />}
                      </div>
                      <label htmlFor="trader-img-input" className="ad-upload-label">
                        <RxUpload />
                        <input
                          type="file"
                          id="trader-img-input"
                          accept=".jpg,.png,.svg,.webp,.jpeg"
                          className="ad-file-hidden"
                          required
                          onChange={(e) => uploadProof(e.target.files[0])}
                        />
                      </label>
                    </div>

                    <div className="ad-form-grid">
                      {[
                        { name: 'firstname', placeholder: 'First Name', type: 'text' },
                        { name: 'lastname', placeholder: 'Last Name', type: 'text' },
                        { name: 'winRate', placeholder: 'Win Rate (e.g. 78%)', type: 'text' },
                        { name: 'avgReturn', placeholder: 'Average Return', type: 'text' },
                        { name: 'followers', placeholder: 'Number of Followers', type: 'text' },
                        { name: 'rrRatio', placeholder: 'Risk / Reward Ratio', type: 'text' },
                        { name: 'nationality', placeholder: 'Nationality', type: 'text' },
                        { name: 'minimumcapital', placeholder: 'Minimum Trading Capital ($)', type: 'number' },
                      ].map(f => (
                        <div className="ad-form-field" key={f.name}>
                          <input
                            type={f.type}
                            name={f.name}
                            placeholder={f.placeholder}
                            value={formData[f.name] || ''}
                            onChange={handleChange}
                            className="ad-form-input"
                          />
                        </div>
                      ))}
                    </div>

                    <button type="submit" className="ad-submit-btn">
                      Add Trader
                    </button>
                  </form>
                </div>
              )}

              {/* ═══ TRADER LOGS VIEW ═══ */}
              {showTraderLogs && traders && (
                <div className="ad-trader-logs-wrap">
                  <h2 className="ad-section-title">
                    All <span className="ad-accent">Traders</span>
                  </h2>
                  <div className="ad-trader-grid">
                    {traders.map(trader => (
                      <div className="ad-trader-card" key={trader._id}>
                        <button className="ad-delete-trader-btn" onClick={() => deleteTrader(trader._id)}>
                          <MdDeleteSweep />
                        </button>
                        <div className="ad-trader-top">
                          <div className="ad-trader-avatar">
                            <img src={trader.traderImage} alt={trader.firstname} />
                          </div>
                          <div className="ad-trader-info">
                            <h3>{trader.firstname} {trader.lastname}</h3>
                            <p>{trader.nationality}</p>
                          </div>
                        </div>
                        <div className="ad-trader-stats">
                          <div className="ad-stat-item">
                            <span className="ad-stat-label">Win Rate</span>
                            <span className="ad-stat-val green">
                              <MdCandlestickChart /> {trader.profitrate}
                            </span>
                          </div>
                          <div className="ad-stat-item">
                            <span className="ad-stat-label">Avg Return</span>
                            <span className="ad-stat-val cyan">
                              <MdOutlineShowChart /> {trader.averagereturn}
                            </span>
                          </div>
                          <div className="ad-stat-item">
                            <span className="ad-stat-label">Min Capital</span>
                            <span className="ad-stat-val gold">${trader.minimumcapital}</span>
                          </div>
                        </div>
                        <button
                          className="ad-update-log-btn"
                          onClick={() => {
                            setShowTraderLogForm(true)
                            setActiveTraderId(trader._id)
                            console.log('[DEBUG] Clicked Update Log for Trader:', trader._id)
                            console.log('[DEBUG] Current Users State:', users)
                            if (users) {
                              const tradersUsers = users.filter(user => user.trader === trader._id)
                              console.log('[DEBUG] Filtered Copy Traders:', tradersUsers)
                              setCopyTraders(tradersUsers)
                              const initialAllocations = {}
                              tradersUsers.forEach(u => { initialAllocations[u._id] = { amount: '', type: 'profit' } })
                              setIndividualAllocations(initialAllocations)
                            }
                          }}
                        >
                          Update Trader's Log
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>{/* /ad-body */}
          </div>{/* /ad-main */}
        </div>
      )}

      {/* ════════════════════════ MODALS ════════════════════════ */}

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div className="ad-modal-backdrop">
          <div className="ad-modal ad-confirm-modal">
            <div className="ad-confirm-icon-wrap">
              <svg stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" width="28" height="28">
                <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Deactivate Account</h3>
            <p>User data will be permanently removed. This action cannot be undone.</p>
            <div className="ad-confirm-actions">
              <button className="ad-btn-danger" onClick={() => deleteUser(activeEmail)}>Deactivate</button>
              <button className="ad-btn-ghost" onClick={() => setShowDeletModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="ad-modal-backdrop">
          <div className="ad-modal">
            <div className="ad-modal-header">
              <h2>Upgrade User Profit</h2>
              <button className="ad-modal-close" onClick={() => setShowUpgradeModal(false)}><MdClose /></button>
            </div>
            <div className="ad-amount-row">
              <input type="tel" placeholder="0.00" className="ad-amount-input" onChange={(e) => setUserAmount(parseInt(e.target.value))} />
              <span className="ad-currency-tag">USD</span>
            </div>
            <div className="ad-modal-actions">
              <button className="ad-btn-ghost" onClick={() => setShowUpgradeModal(false)}>Close</button>
              <button className="ad-btn-primary" onClick={upgradeUser}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Credit Modal */}
      {showModal && (
        <div className="ad-modal-backdrop">
          <div className="ad-modal">
            <div className="ad-modal-header">
              <h2>Credit User</h2>
              <button className="ad-modal-close" onClick={() => setShowModal(false)}><MdClose /></button>
            </div>
            <div className="ad-amount-row">
              <input type="tel" placeholder="0.00" className="ad-amount-input" onChange={(e) => setUserAmount(parseInt(e.target.value))} />
              <span className="ad-currency-tag">USD</span>
            </div>
            <div className="ad-modal-actions">
              <button className="ad-btn-ghost" onClick={() => setShowModal(false)}>Close</button>
              <button className="ad-btn-primary" onClick={creditUser}>Credit</button>
            </div>
          </div>
        </div>
      )}

      {/* Debit Modal */}
      {debitModal && (
        <div className="ad-modal-backdrop">
          <div className="ad-modal">
            <div className="ad-modal-header">
              <h2>Debit User</h2>
              <button className="ad-modal-close" onClick={() => setDebitModal(false)}><MdClose /></button>
            </div>
            <div className="ad-amount-row">
              <input type="tel" placeholder="0.00" className="ad-amount-input" onChange={(e) => setUserAmount(parseInt(e.target.value))} />
              <span className="ad-currency-tag">USD</span>
            </div>
            <div className="ad-modal-actions">
              <button className="ad-btn-ghost" onClick={() => setDebitModal(false)}>Close</button>
              <button className="ad-btn-danger" onClick={debitUser}>Debit</button>
            </div>
          </div>
        </div>
      )}

      {/* Trader Log Form Modal */}
      {showTraderLogForm && (
        <div className="ad-modal-backdrop">
          <div className="ad-modal ad-log-modal">
            <div className="ad-modal-header">
              <h2>Update Trader Logs</h2>
              <button className="ad-modal-close" onClick={() => setShowTraderLogForm(false)}><MdClose /></button>
            </div>
            <div className="ad-modal-body">
              <select
                className="ad-select"
                onChange={(e) => setActiveTrader({ ...activeTrader, pair: e.target.value })}
              >
                <option value="">Select trade pair</option>
                <optgroup label="Forex Pairs">
                  {forexPairs.map(p => <option key={p} value={p}>{p}</option>)}
                </optgroup>
                <optgroup label="Indices">
                  {indices.map(([v, l]) => <option key={v} value={v}>{v} ({l})</option>)}
                </optgroup>
                <optgroup label="Commodities">
                  <option value="XAU/USD">Gold (XAU/USD)</option>
                  <option value="XAG/USD">Silver (XAG/USD)</option>
                  <option value="WTI/USD">Crude Oil WTI</option>
                  <option value="BRENT/USD">Brent Oil</option>
                  <option value="NG/USD">Natural Gas</option>
                  <option value="COPPER">Copper</option>
                  <option value="CORN">Corn</option>
                  <option value="WHEAT">Wheat</option>
                  <option value="SOYBEAN">Soybeans</option>
                  <option value="COFFEE">Coffee</option>
                </optgroup>
                <optgroup label="Bonds">
                  <option value="US10Y">US 10Y Treasury</option>
                  <option value="US30Y">US 30Y Treasury</option>
                  <option value="US5Y">US 5Y Treasury</option>
                  <option value="GER10Y">Germany 10Y Bund</option>
                  <option value="UK10Y">UK 10Y Gilt</option>
                  <option value="JP10Y">Japan 10Y Bond</option>
                </optgroup>
                <optgroup label="Options">
                  <option value="SPX_OPT">S&amp;P 500 Options</option>
                  <option value="NDX_OPT">Nasdaq 100 Options</option>
                  <option value="DJI_OPT">Dow Jones Options</option>
                  <option value="AAPL_OPT">Apple Options</option>
                  <option value="TSLA_OPT">Tesla Options</option>
                  <option value="BTC_OPT">Bitcoin Options</option>
                </optgroup>
                <optgroup label="Cryptos">
                  {cryptos.map(p => <option key={p} value={p}>{p}</option>)}
                </optgroup>
                <optgroup label="Stocks">
                  {stocks.map(s => <option key={s} value={s}>{s}</option>)}
                </optgroup>
              </select>

              <div className="ad-copy-traders-box">
                <div className="ad-copy-traders-title">
                  Copy Traders
                  <span className="ad-copy-count">{copyTraders.length}</span>
                </div>

                {copyTraders.length === 0 ? (
                  <p className="ad-no-traders">No users are copying this trader.</p>
                ) : (
                  <div className="ad-copy-list">
                    {copyTraders.map(user => (
                      <div className="ad-copy-row" key={user._id}>
                        <div className="ad-copy-info">
                          <span className="ad-copy-name">{user.firstname} {user.lastname}</span>
                          <span className="ad-copy-email">{user.email}</span>
                          <span className="ad-copy-bal">Bal: ${user.funded}</span>
                        </div>
                        <div className="ad-copy-inputs">
                          <input
                            type="number"
                            placeholder="Amt"
                            className="ad-copy-amt-input"
                            value={individualAllocations[user._id]?.amount || ''}
                            onChange={(e) => setIndividualAllocations({
                              ...individualAllocations,
                              [user._id]: { ...individualAllocations[user._id], amount: parseFloat(e.target.value) }
                            })}
                          />
                          <select
                            className="ad-copy-type-select"
                            value={individualAllocations[user._id]?.type || 'profit'}
                            onChange={(e) => setIndividualAllocations({
                              ...individualAllocations,
                              [user._id]: { ...individualAllocations[user._id], type: e.target.value }
                            })}
                          >
                            <option value="profit">Profit</option>
                            <option value="loss">Loss</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="ad-modal-actions">
              <button className="ad-btn-ghost" onClick={() => setShowTraderLogForm(false)}>Close</button>
              <button className="ad-btn-primary" onClick={updateTraderLog}>Distribute</button>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}

export default Admindashboard
