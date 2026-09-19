import { Link } from 'react-router-dom';
import { APP_NAME } from '../../utils/constants';
import logo from '../../assets/Logo1.png';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row g-4 align-items-start">
          <div className="col-md-5">
            <img src={logo} alt={APP_NAME} className="footer-logo mb-3" />
            <p className="mb-0" style={{ color: '#c5daf3' }}>
              Plataforma chilena para adopción responsable, apoyo a fundaciones y reportes de emergencias animales.
            </p>
          </div>
          <div className="col-md-3">
            <h6 className="fw-bold mb-3">Explorar</h6>
            <div className="d-flex flex-column gap-2">
              <Link to="/adopciones">Adopciones</Link>
              <Link to="/crowdfunding">Crowdfunding</Link>
              <Link to="/mapa">Mapa de reportes</Link>
              <Link to="/fundaciones">Fundaciones</Link>
            </div>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold mb-3">Participar</h6>
            <div className="d-flex flex-column gap-2">
              <Link to="/publicar-mascota">Publicar mascota</Link>
              <Link to="/reportar">Reportar emergencia</Link>
              <Link to="/donaciones">Donar</Link>
            </div>
          </div>
        </div>
        <hr className="border-secondary my-4 opacity-25" />
        <p className="small mb-0" style={{ color: '#9bb8d9' }}>
          © {new Date().getFullYear()} {APP_NAME}. Datos de demostración marcados como Demo.
        </p>
      </div>
    </footer>
  );
}
