import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import SessionCard from '../components/SessionCard';
import config from '../config';
import './DashboardPage.css';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('join');
  const [sessions, setSessions] = useState([]);
  const [sessionCode, setSessionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  // جلب جلسات المستخدم - مع استخدام useCallback
  const fetchUserSessions = useCallback(async () => {
    try {
      setLoading(true);
      
      // تكوين الهيدر
      const headers = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      // جلب البيانات
      const { data } = await axios.get(`${config.API_URL}/sessions/mysessions`, headers);
      
      setSessions(data.sessions);
      setLoading(false);
    } catch (error) {
      setErrorMessage('حدث خطأ أثناء جلب الجلسات');
      setLoading(false);
    }
  }, [user.token]);
  
  // تحميل الجلسات عند فتح التبويب
  useEffect(() => {
    if (activeTab === 'sessions') {
      fetchUserSessions();
    }
  }, [activeTab, fetchUserSessions]);
  
  // التبديل بين التبويبات
  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };
  
  // معالجة تغيير كود الجلسة
  const handleCodeChange = (e) => {
    // تحويل الحروف إلى كبيرة وإزالة المسافات
    const code = e.target.value.toUpperCase().replace(/\s/g, '');
    setSessionCode(code);
    setErrorMessage('');
    setSuccessMessage('');
  };
  
  // معالجة الانضمام إلى جلسة
  const handleJoinSession = async (e) => {
    e.preventDefault();
    
    // التحقق من إدخال الكود
    if (!sessionCode || sessionCode.length !== 6) {
      setErrorMessage('يرجى إدخال كود صالح مكون من 6 أحرف');
      return;
    }
    
    try {
      setLoading(true);
      
      // تكوين الهيدر
      const headers = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      // إرسال طلب الانضمام
      const { data } = await axios.post(
        `${config.API_URL}/sessions/join`, 
        { code: sessionCode }, 
        headers
      );
      
      setSuccessMessage('تم الانضمام إلى الجلسة بنجاح');
      setLoading(false);
      
      // التوجيه إلى صفحة الجلسة بعد ثانية
      setTimeout(() => {
        navigate(`/session/${data.session._id}`);
      }, 1000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'حدث خطأ أثناء الانضمام إلى الجلسة');
      setLoading(false);
    }
  };
  
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">لوحة التحكم</h1>
        <p className="dashboard-subtitle">
          استكشف التحديات، انضم للجلسات، وشارك توقعاتك مع الآخرين
        </p>
      </div>
      
      <div className="dashboard-tabs">
        <div 
          className={`dashboard-tab ${activeTab === 'join' ? 'active' : ''}`}
          onClick={() => switchTab('join')}
        >
          انضم/أنشئ جلسة
        </div>
        <div 
          className={`dashboard-tab ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => switchTab('sessions')}
        >
          جلساتي
        </div>
        <div className={`tab-indicator ${activeTab === 'sessions' ? 'right' : ''}`}></div>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'join' ? (
          <div className="join-content">
            <div className="join-section">
              <h3 className="subsection-title">كود الجلسة</h3>
              
              {errorMessage && (
                <div className="alert alert-error">{errorMessage}</div>
              )}
              
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              
              <form onSubmit={handleJoinSession}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control session-code-input"
                    placeholder="أدخل كود الجلسة"
                    value={sessionCode}
                    onChange={handleCodeChange}
                    maxLength={6}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-block join-btn"
                  disabled={loading}
                >
                  {loading ? 'جارِ الانضمام...' : 'انضم إلى الجلسة'}
                </button>
              </form>
              
              <div className="divider">
                <span>أو</span>
              </div>
              
              <Link to="/create-session" className="btn btn-secondary btn-block create-btn">
                إنشاء جلسة جديدة
              </Link>
            </div>
          </div>
        ) : (
          <div className="sessions-content">
            <h2 className="section-title">جلساتي</h2>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">جارِ تحميل الجلسات...</p>
              </div>
            ) : (
              <>
                {sessions.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>لا توجد جلسات حتى الآن</p>
                    <Link to="/create-session" className="btn btn-primary">
                      أنشئ جلسة جديدة
                    </Link>
                  </div>
                ) : (
                  <div className="sessions-list">
                    {sessions.map((session) => (
                      <SessionCard key={session._id} session={session} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      <Link to="/create-session" className="floating-btn" title="إنشاء جلسة جديدة">
        +
      </Link>
    </div>
  );
};

export default DashboardPage;