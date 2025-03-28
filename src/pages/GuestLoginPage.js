import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './AuthPages.css';

const GuestLoginPage = () => {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, guestLogin, error, setError } = useContext(UserContext);
  const navigate = useNavigate();
  
  // إذا كان المستخدم مسجلاً، توجيهه إلى لوحة التحكم
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    
    // مسح أي أخطاء سابقة
    return () => {
      if (error) {
        setError(null);
      }
    };
  }, [user, navigate, error, setError]);
  
  const onChange = (e) => {
    setUsername(e.target.value);
    setErrorMessage('');
  };
  
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من إدخال اسم المستخدم
    if (!username) {
      setErrorMessage('يرجى إدخال اسم المستخدم');
      return;
    }
    
    setIsLoading(true);
    
    // محاولة تسجيل الدخول كضيف
    const result = await guestLogin(username);
    
    setIsLoading(false);
    
    if (result.error) {
      setErrorMessage(result.error);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image">
          <div className="auth-image-content">
            <h2 className="auth-image-title">دخول سريع</h2>
            <p className="auth-image-description">
              ادخل كضيف واختبر المنصة بسرعة دون الحاجة لإنشاء حساب كامل
            </p>
          </div>
        </div>
        
        <div className="auth-form">
          <div className="auth-card">
            <h2 className="auth-title">الدخول كضيف</h2>
            
            {errorMessage && (
              <div className="alert alert-error">{errorMessage}</div>
            )}
            
            <form onSubmit={onSubmit}>
              <div className="input-group">
                <label className="input-label" htmlFor="username">اسم المستخدم</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={onChange}
                    placeholder="أدخل اسمك"
                  />
                  <span className="input-icon">👤</span>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-block auth-btn"
                disabled={isLoading}
              >
                {isLoading ? 'جارِ الدخول...' : 'الدخول كضيف'}
              </button>
            </form>
            
            <div className="auth-separator">
              <span>أو</span>
            </div>
            
            <div className="auth-links">
              <p>
                أفضل إنشاء حساب كامل؟{' '}
                <Link to="/register" className="auth-link">
                  إنشاء حساب
                </Link>
              </p>
              <p>
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="auth-link">
                  تسجيل الدخول
                </Link>
              </p>
              <p>
                <Link to="/" className="auth-link">
                  العودة للصفحة الرئيسية
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestLoginPage;