import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/landingPage.css';

const CAROUSEL_IMAGES = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop', // Gimnasio oscuro
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1920&auto=format&fit=crop', // Pesas
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1920&auto=format&fit=crop'  // Entrenamiento funcional
];

const LandingPage = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Efecto para cambiar la imagen automáticamente cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === CAROUSEL_IMAGES.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#0d0f18', color: '#fff' }}>

            {/* SECCIÓN HERO CON CARRUSEL */}
            <section style={{
                position: 'relative', // Necesario para posicionar las imágenes de fondo
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '85vh',
                padding: '0 20px',
                overflow: 'hidden' // Evita que las imágenes se salgan
            }}>

                {/* Imágenes de fondo del Carrusel */}
                {CAROUSEL_IMAGES.map((img, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: currentIndex === index ? 0.35 : 0, // Opacidad baja para no tapar el texto
                            transition: 'opacity 1.5s ease-in-out', // Efecto de desvanecimiento suave
                            zIndex: 0
                        }}
                    />
                ))}

                {/* Gradiente para fusionar el carrusel con el color de fondo de la app */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '40%',
                    background: 'linear-gradient(to bottom, transparent, #0d0f18)',
                    zIndex: 1
                }} />

                {/* CONTENIDO CENTRAL (Por encima del carrusel) */}
                <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>

                    <span style={{
                        background: 'rgba(79, 70, 229, 0.3)',
                        color: '#818cf8',
                        border: '1px solid rgba(79, 70, 229, 0.6)',
                        padding: '8px 20px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        marginBottom: '24px',
                        backdropFilter: 'blur(5px)' // Efecto vidrio moderno
                    }}>
                        Plataforma Fitness Inteligente
                    </span>

                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '0 0 20px 0', lineHeight: '1.2', textShadow: '0px 4px 15px rgba(0,0,0,0.8)' }}>
                        Lleva tu rendimiento al <span style={{ color: '#818cf8' }}>siguiente nivel</span>
                    </h1>

                    <p style={{ fontSize: '1.2rem', color: '#cbd5e1', marginBottom: '40px', lineHeight: '1.6', maxWidth: '600px', textShadow: '0px 2px 10px rgba(0,0,0,0.8)' }}>
                        Diseña rutinas personalizadas, gestiona tu entrenamiento diario y
                        accede a la mejor selección de suplementos y equipo fitness en un solo lugar.
                    </p>

                    <button
                        onClick={() => navigate('/registro')}
                        style={{
                            backgroundColor: '#4f46e5',
                            color: '#fff',
                            border: 'none',
                            padding: '15px 40px',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.5)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Comenzar Ahora
                    </button>

                    {/* Puntos de navegación del carrusel */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '40px' }}>
                        {CAROUSEL_IMAGES.map((_, idx) => (
                            <div
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: currentIndex === idx ? '#4f46e5' : 'rgba(255,255,255,0.3)',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s'
                                }}
                            />
                        ))}
                    </div>

                </div>
            </section>

            {/* 2. SECCIÓN QUIÉNES SOMOS */}
            <section className="about-section">
                <div className="section-header">
                    <h2>¿Quiénes Somos?</h2>
                    <p>La tecnología al servicio de tu disciplina y tus metas físicas.</p>
                </div>
                <div className="about-grid">
                    <div className="about-card">
                        <h3>Rutinas Inteligentes</h3>
                        <p>Generación de entrenamientos optimizados según tu nivel, espacio disponible y objetivos específicos.</p>
                    </div>
                    <div className="about-card">
                        <h3>Tienda Especializada</h3>
                        <p>Acceso directo a productos, suplementación y equipo deportivo certificado con compra rápida y segura.</p>
                    </div>
                    <div className="about-card">
                        <h3>Seguimiento Continuo</h3>
                        <p>Registra tu progreso día a día, ajusta tu carga de trabajo y mantén la constancia en tu transformación.</p>
                    </div>
                </div>
            </section>

            {/* 3. SECCIÓN MEMBRESÍAS */}
            <section className="plans-section">
                <div className="section-header">
                    <h2>Nuestros Planes y Membresías</h2>
                    <p>Elige el plan que mejor se adapte a tu ritmo de entrenamiento.</p>
                </div>
                <div className="plans-grid">
                    {/* Plan Básico */}
                    <div className="plan-card">
                        <h3>Free</h3>
                        <div className="plan-price">$0 <span>/ mes</span></div>
                        <ul>
                            <li>Acceso a la tienda fitness</li>
                            <li>Generación básica de rutinas</li>
                            <li>Registro de perfil de usuario</li>
                        </ul>
                        <button className="plan-btn" onClick={() => navigate('/register')}>
                            Registrarse Gratis
                        </button>
                    </div>

                    {/* Plan Pro (Destacado) */}
                    <div className="plan-card featured">
                        <span className="plan-badge">Popular</span>
                        <h3>PRO Fit</h3>
                        <div className="plan-price">$29.900 <span>/ mes</span></div>
                        <ul>
                            <li>Rutinas ilimitadas con algoritmos avanzados</li>
                            <li>Descuentos exclusivos en la tienda</li>
                            <li>Historial detallado y analítica de avance</li>
                            <li>Soporte prioritario</li>
                        </ul>
                        <button className="plan-btn featured-btn" onClick={() => navigate('/register')}>
                            Obtener PRO
                        </button>
                    </div>

                    {/* Plan Elite */}
                    <div className="plan-card">
                        <h3>Elite Performance</h3>
                        <div className="plan-price">$59.900 <span>/ mes</span></div>
                        <ul>
                            <li>Todo lo del plan PRO</li>
                            <li>Asesoría personalizada en nutrición</li>
                            <li>Planes de entrenamiento 1 a 1</li>
                            <li>Envío gratis en todos los productos de la tienda</li>
                        </ul>
                        <button className="plan-btn" onClick={() => navigate('/register')}>
                            Unirme como Elite
                        </button>
                    </div>
                </div>
            </section>

            {/* 4. SECCIÓN DÓNDE ENCONTRARNOS Y CONTACTO */}
            <section className="location-section">
                <div className="section-header">
                    <h2>¿Dónde Encontrarnos?</h2>
                    <p>Estamos conectados en la nube y listos para atenderte.</p>
                </div>
                <div className="location-container">
                    <div className="location-info">
                        <div className="info-item">
                            <h4>Ubicación Central</h4>
                            <p>Medellín, Antioquia — Colombia</p>
                        </div>
                        <div className="info-item">
                            <h4>Atención al Cliente</h4>
                            <p>soporte@evolutionfit.com</p>
                            <p>+57 (604) 444-0000</p>
                        </div>
                        <div className="info-item">
                            <h4>Horarios de Soporte</h4>
                            <p>Lunes a Viernes: 6:00 AM – 10:00 PM</p>
                            <p>Sábados y Domingos: 8:00 AM – 6:00 PM</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="landing-footer">
                <p>&copy; {new Date().getFullYear()} EvolutionFit. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default LandingPage;