import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './HomePage.css';

const HomePage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // إذا كان المستخدم مسجلاً، توجيهه إلى لوحة التحكم
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // للمراوحة بين الظهور التدريجي للعناصر
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');
    const slideElements = document.querySelectorAll('.slide-in');
    
    fadeElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 * index);
    });
    
    slideElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
      }, 200 * index);
    });
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="welcome-card fade-in">
          <div className="welcome-header">
            <h1 className="welcome-title">مرحبًا بك في PredictBattle</h1>
            <p className="welcome-subtitle">منصة توقعات تفاعلية للمجموعات</p>
          </div>
          
          <div className="welcome-content">
            <p>
              شارك مع أصدقائك وزملائك في تحديات تتنبأ فيها بالمستقبل في مختلف المجالات.
              قم بإنشاء جلسات توقع، وادعو المشاركين، وقارن توقعاتكم في واجهة سهلة ومبهجة.
            </p>
          </div>
          
          <div className="welcome-actions">
            <Link to="/login" className="btn btn-primary btn-block mb-2">
              تسجيل الدخول
            </Link>
            <Link to="/register" className="btn btn-secondary btn-block mb-2">
              إنشاء حساب
            </Link>
            <Link to="/guest" className="btn btn-text btn-block">
              الدخول كضيف
            </Link>
          </div>
        </div>
      </section>
      
      <section className="features-section">
        <h2 className="section-title">ماذا يمكنك أن تفعل؟</h2>
        <p className="section-subtitle">
          منصة PredictBattle تمنحك تجربة فريدة لتحدي أصدقائك وزملائك في سباق التوقعات المستقبلية
        </p>
        
        <div className="features-grid">
          <div className="feature-card fade-in">
            <div>
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">إنشاء جلسات</h3>
              <p className="feature-description">
                أنشئ جلسات توقع حول أي موضوع تهتم به، من الرياضة إلى السياسة والعلوم وأكثر من ذلك
              </p>
            </div>
          </div>
          
          <div className="feature-card fade-in">
            <div>
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">دعوة الأصدقاء</h3>
              <p className="feature-description">
                شارك رمز الجلسة المكون من 6 أحرف لدعوة الآخرين للانضمام والمشاركة في التوقعات
              </p>
            </div>
          </div>
          
          <div className="feature-card fade-in">
            <div>
              <div className="feature-icon">🔮</div>
              <h3 className="feature-title">قدم توقعاتك</h3>
              <p className="feature-description">
                أدخل توقعاتك في مختلف المواضيع والتحديات وسجل رأيك حول الأحداث المستقبلية
              </p>
            </div>
          </div>
          
          <div className="feature-card fade-in">
            <div>
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">قارن الآراء</h3>
              <p className="feature-description">
                اطلع على توقعات الآخرين وقارنها بتوقعاتك لمعرفة تنوع الآراء والرؤى المختلفة
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">ابدأ المنافسة الآن!</h2>
          <p className="cta-description">
            انضم إلى مجتمع المتنبئين وشارك في تحديات التوقعات الممتعة والتفاعلية
          </p>
          <Link to="/register" className="cta-btn">
            إنشاء حساب مجاني
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;