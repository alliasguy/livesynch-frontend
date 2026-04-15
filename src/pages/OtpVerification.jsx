import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';

const OtpVerification = ({ route }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState('');
    const [loader, setLoader] = useState(false);

    // Get email from navigation state
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            // If no email in state, redirect back to signup or login
            navigate('/signup');
        }
    }, [email, navigate]);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!otp) return;

        setLoader(true);

        try {
            const response = await fetch(`${route}/api/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    otp: otp
                }),
            });

            const result = await response.json();
            setLoader(false);

            if (result.status === 'error') {
                Toast.fire({
                    icon: 'error',
                    title: result.message
                });
                return;
            }

            // Success
            localStorage.setItem('token', result.token);

            // Send Welcome Emails
            const userData = {
                service_id: 'service_7ww480m',
                template_id: 'GZMEJ032T4bAvYE-D',
                user_id: 'xPN9E_hADOXl3h5RZ',
                template_params: {
                    'name': 'Trader', // We might not have name here unless passed in state or returned by verify-otp. 
                    // Verify-OTP backend might need to return user name for this to be perfect. 
                    // For now, using generic or 'Trader'.
                    'email': email,
                    // 'verificationLink': '...' // Not needed for welcome? Or maybe dashboard link.

                }
            };

            const adminData = {
                service_id: 'service_v81s9q6',
                template_id: 'GZMEJ032T4bAvYE-D',
                user_id: 'GZMEJ032T4bAvYE-D',
                template_params: {
                    'name': 'Admin',
                    'email': 'support@live-synch.com',
                    'message': `User ${email} has verified their account.`,
                    'reply_to': 'support@live-synch.com',
                    'subject': 'New User Verification'
                }
            };

            const sendMail = async (data) => {
                try {
                    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data),
                    });
                } catch (err) {
                    console.error("Email error:", err);
                }
            };

            // Send emails in background (don't await to block UI)
            sendMail(userData);
            sendMail(adminData);

            Toast.fire({
                icon: 'success',
                title: 'Account Verified Successfully!'
            });

            navigate('/dashboard');

        } catch (error) {
            setLoader(false);
            console.error("Error verifying OTP:", error);
            Toast.fire({
                icon: 'error',
                title: 'Something went wrong. Please try again.'
            });
        }
    };

    return (
        <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
            <Header />
            {loader && <Loader />}

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '100px',
                paddingBottom: '50px'
            }}>
                <div style={{
                    backgroundColor: '#111',
                    padding: '40px',
                    borderRadius: '10px',
                    width: '100%',
                    maxWidth: '500px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
                }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#00ff00' }}>Verification</h2>
                    <p style={{ textAlign: 'center', marginBottom: '30px', color: '#ccc' }}>
                        We have sent a verification code to <strong>{email}</strong>. Please enter the code below to continue.
                    </p>

                    <form onSubmit={handleVerify}>
                        <div style={{ marginBottom: '25px' }}>
                            <input
                                type="text"
                                placeholder="Enter 6-digit Code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    backgroundColor: '#222',
                                    border: '1px solid #333',
                                    borderRadius: '5px',
                                    color: '#fff',
                                    fontSize: '18px',
                                    textAlign: 'center',
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '15px',
                                backgroundColor: '#00ff00',
                                border: 'none',
                                borderRadius: '5px',
                                color: '#000',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'background 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#00cc00'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#00ff00'}
                        >
                            Verify Account
                        </button>
                    </form>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <span
                            onClick={() => navigate('/signup')}
                            style={{ color: '#00ff00', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Back to Signup
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;
