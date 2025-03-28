import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import PredictionItem from '../components/PredictionItem';
import config from '../config';
import './SessionPage.css';

const SessionPage = () => {
  const [session, setSession] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { id } = useParams();
  const { user } = useContext(UserContext);
  
  // جلب بيانات الجلسة مع استخدام useCallback
  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      
      // تكوين الهيدر
      const headers = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      // جلب البيانات
      const { data } = await axios.get(`${config.API_URL}/sessions/${id}`, headers);
      
      setSession(data.session);
      setLoading(false);
    } catch (error) {
      setErrorMessage('حدث خطأ أثناء جلب بيانات الجلسة');
      setLoading(false);
    }
  }, [id, user.token]);
  
  // تحميل البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);
  
  // التحقق من أن المستخدم قدم توقعًا بالفعل
  const hasSubmittedPrediction = () => {
    if (!session || !session.predictions) return false;
    
    return session.predictions.some(
      prediction => prediction.user._id === user._id
    );
  };
  
  // نسخ كود الجلسة
  const copySessionCode = () => {
    if (!session) return;
    
    navigator.clipboard.writeText(session.code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('فشل في نسخ النص:', err);
      });
  };
  
  // معالجة تقديم التوقع
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من إدخال التوقع
    if (!prediction.trim()) {
      setErrorMessage('يرجى إدخال توقعك');
      return;
    }
    
    try {
      setSubmitting(true);
      setErrorMessage('');
      
      // تكوين الهيدر
      const headers = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      
      // إرسال التوقع
      const { data } = await axios.post(
        `${config.API_URL}/sessions/predict`,
        { sessionId: id, text: prediction },
        headers
      );
      
      setSession(data.session);
      setSuccessMessage('تم إرسال توقعك بنجاح');
      setPrediction('');
      setSubmitting(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'حدث خطأ أثناء إرسال التوقع');
      setSubmitting(false);
    }
  };
  
  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>جارِ تحميل بيانات الجلسة...</p>
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="error-container">
        <h2>خطأ في تحميل الجلسة</h2>
        <p>{errorMessage}</p>
        <Link to="/dashboard" className="btn btn-primary">
          العودة إلى لوحة التحكم
        </Link>
      </div>
    );
  }

  // هل قدم المستخدم الحالي توقعه
  const userHasPredicted = hasSubmittedPrediction();
  
  return (
    <div className="session-page">
      <div className="session-header">
        <h1 className="session-title">{session.title}</h1>
        
        <div className="session-meta">
          <div className="session-code-container">
            <span className="meta-label">كود الجلسة:</span>
            <span className="session-code">{session.code}</span>
            <button 
              className="copy-btn" 
              onClick={copySessionCode}
              title="نسخ الكود"
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
          
          <div className="session-info">
            <span className="meta-label">تاريخ الإنشاء:</span>
            <span>{formatDate(session.createdAt)}</span>
          </div>
          
          <div className="session-info">
            <span className="meta-label">المشاركون:</span>
            <span>{session.participants.length}/{session.maxPlayers}</span>
          </div>
          
          <div className="session-info">
            <span className="meta-label">الحالة:</span>
            <span className={`session-status ${session.isComplete ? 'complete' : 'active'}`}>
              {session.isComplete ? 'مكتملة' : 'نشطة'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="ses