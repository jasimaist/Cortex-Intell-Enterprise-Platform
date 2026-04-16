import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function Layout() {
  return (
    <>
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
