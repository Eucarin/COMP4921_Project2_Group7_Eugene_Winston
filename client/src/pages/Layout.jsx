import { Outlet} from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
  return (
    <>
      <nav>
        <Header/>
      </nav>
      <Outlet />
    </>
  )
};

export default Layout;