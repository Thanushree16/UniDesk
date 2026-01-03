import { BiBell, BiSearch } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import "./Topbar.css";

export function Topbar() {
  return (
    <div className="topbar">
      <div className="search-box">
        <BiSearch className="search-icon" />
        <input type="text" placeholder="Search for files or subjects..." />
      </div>
      <div className="top-icons">
        <div className="notification-bell">
          <BiBell />
        </div>
        <div className="profile-icon">
          <CgProfile />
        </div>
      </div>
    </div>
  );
}
