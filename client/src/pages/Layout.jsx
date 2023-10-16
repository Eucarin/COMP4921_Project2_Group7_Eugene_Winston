import { Outlet} from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <div>
          THIS IS A NAV BAR DIV
        </div>
      </nav>
      <Outlet />
    </>
  )
};

export default Layout;