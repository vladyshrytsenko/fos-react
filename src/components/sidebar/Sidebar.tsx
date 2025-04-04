import "./Sidebar.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar sidebar-dark border-end">
      <div className="sidebar-header border-bottom">
        <div className="sidebar-brand">CoreUI</div>
      </div>
      <ul className="sidebar-nav">
        {/* <li className="nav-title">Nav Title</li> */}
        <li className="nav-item">
          <a className="nav-link active" href="#">
            <i className="nav-icon cil-speedometer"></i> Nav item
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            <i className="nav-icon cil-speedometer"></i> With badge
            <span className="badge bg-primary ms-auto">NEW</span>
          </a>
        </li>
        <li className="nav-item mt-5">
          <a className="nav-link" href="https://coreui.io">
            <i className="nav-icon cil-cloud-download"></i> Download CoreUI
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="https://coreui.io/pro/">
            <i className="nav-icon cil-layers"></i> Try CoreUI
            <strong>PRO</strong>
          </a>
        </li>
      </ul>
      <div className="sidebar-footer border-top d-flex">
        <button className="sidebar-toggler" type="button"></button>
      </div>
    </div>
  );
};

export default Sidebar;
