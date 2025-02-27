import React, { lazy, Suspense, useContext, useState, useCallback } from 'react';
import Icon from './icons/index';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faFacebookF, faInstagram, faYoutube, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faComment } from "@fortawesome/free-solid-svg-icons";
import Navbar from '../components/Navbar';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Footer from './footer/index'; 

export function FooterContainer() {
  
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const { backendUrl } = useContext(AppContent);
    axios.defaults.withCredentials = true;

    // Optimized function to prevent re-renders
    const onSubmitEmail = useCallback(async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-message`, { email, message });

            if (data.success) {
                toast.success(data.message);
                
                // Clear input fields instead of reloading the page
                setEmail('');
                setMessage('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [email, message, backendUrl]);

    return (
        <Suspense fallback={<div>Loading Footer...</div>}>
            <Footer>
                <Footer.Wrapper>
                    <Footer.Row>
                        <Footer.Column>
                            <Footer.Title>About Me</Footer.Title>
                            <p className='w-100'>
                                Hi, I&apos;m Chaitanya Shinde, a second-year Computer Engineering student at PICT, Pune, with a CGPA of 9.91. 
                                I have a strong passion for full-stack development, specializing in:
                                <br />
                                <strong>Frontend:</strong> HTML, CSS, JavaScript, React, Next.js
                                <br />
                                <strong>Backend:</strong> Node.js, PHP, Python, CPP, C
                                <br />
                                <strong>Database:</strong> MySQL, MongoDB. 
                                <br />
                                I love solving complex coding challenges, participating in hackathons, and building impactful projects.
                                <br />
                                Always open to collaborations, discussions, and new opportunities. Let’s connect! 🚀
                            </p>
                        </Footer.Column>

                        <Footer.Column className="pl-60 w-95">
                            <Footer.Title>Social Media</Footer.Title>
                            <Footer.Link href="https://github.com/cts9505">
                                <FontAwesomeIcon icon={faGithub} className='ml-3 mr-3' /> GitHub
                            </Footer.Link>
                            <Footer.Link href="https://www.linkedin.com/in/chaitanya-shinde-computer/">
                                <FontAwesomeIcon icon={faLinkedin} className='ml-3 mr-3' /> Linkedin
                            </Footer.Link>
                            <Footer.Link href="https://www.instagram.com/_chaitanya_.9505/">
                                <FontAwesomeIcon icon={faInstagram} className='ml-3 mr-3' /> Instagram
                            </Footer.Link>
                            <Footer.Link href="https://www.youtube.com/@chaitanyashindecomputer">
                                <FontAwesomeIcon icon={faYoutube} className='ml-3 mr-3' /> Youtube
                            </Footer.Link>
                            <Footer.Link href="https://www.facebook.com/profile.php?id=61551709142982">
                                <FontAwesomeIcon icon={faFacebookF} className='ml-3 mr-3' /> Facebook
                            </Footer.Link>
                        </Footer.Column>

                        <Footer.Column className="pl-50 w-150 text-sm">
                            <Footer.Title>Contact Me</Footer.Title>
                            <form onSubmit={onSubmitEmail} className='pt-3'>
                                <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#a9a9a9]">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    <input
                                        className="bg-transparent outline-none text-black w-full"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="email"
                                        placeholder="Enter your Email"
                                        required
                                    />
                                </div>
                                <div className="mb-4 flex items-center gap-3 px-5 py-2.5 rounded-xl bg-[#a9a9a9] w-80 h-20">
                                    <FontAwesomeIcon icon={faComment} />
                                    <input
                                        className="bg-transparent outline-none text-black w-full"
                                        onChange={(e) => setMessage(e.target.value)}
                                        value={message}
                                        type="text"
                                        placeholder="Enter your Message"
                                        required
                                    />
                                </div>
                                <button className='w-full py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full'>
                                    Send Message <FontAwesomeIcon icon={faTelegram} className='ml-2' />
                                </button>
                            </form>
                        </Footer.Column>
                    </Footer.Row>
                </Footer.Wrapper>
            </Footer>
        </Suspense>
    );
}
