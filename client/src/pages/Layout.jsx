import { Outlet} from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        {/* <Header/> */}
      </nav>
      <Outlet />
    </>
  )
};

export default Layout;