import { useEffect } from "react";
import { LeftPanel } from "../components/LeftPanel";
import { Topbar } from "../components/Topbar";
import { BiUpload, BiEdit } from "react-icons/bi";
import "./UploadPage.css";

export function UploadPage() {
  useEffect(() => {
    document.title = "Upload Files | UniDesk";
  }, []);

  return (
    <div className="dashboard-layout">
      <LeftPanel />

      <main className="main upload-main">
        <Topbar />

        {/* Upload Section */}
        <h2 className="upload-title">Upload Your Files</h2>

        <div className="upload-box">
          <BiUpload className="upload-icon" />
          <p>
            Drag & Drop or <span>Choose file</span> to upload
          </p>
        </div>

        {/* Uploaded Files */}
        <h3 className="uploaded-title">Uploaded Files</h3>

        <div className="uploaded-container">
          <div className="uploaded-file">
            <div className="file-left">
              <div className="file-icon">PPT</div>
              <div className="file-info">
                <h4>BDA Unit-1.ppt</h4>
                <p>Uploaded in BDA (Subject)</p>
              </div>
            </div>

            <BiEdit className="edit-icon" />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="upload-footer">
          <button className="clear-btn">Clear</button>
          <button className="next-btn">Next</button>
        </div>
      </main>
    </div>
  );
}
