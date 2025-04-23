import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";



import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// Replace with your own date formatter
import { fToNow } from "src/utils/formatTime";
import Scrollbar from "src/components/scrollbar";
import Iconify from "src/components/iconify";
import Microlink from '@microlink/react'; // For link previews


export function DashboardConnects({ title = "Connects", groupedThreads, sx, ...other }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ ...sx, margin: "auto", mt: 4, mb: 4 }} {...other}>
      {/* Card Header */}
      <CardHeader title={title} sx={{ mb: 1 }} />

      {/* Scrollable Content */}
      <Scrollbar sx={{ minHeight: 300, maxHeight: 400 }}>
        <Box sx={{ px: 2 }}>
          {groupedThreads.length > 0 ? (
            groupedThreads.slice(0, 3).map((thread) => (
              <ThreadItem key={thread.companyThread.id} thread={thread} />
            ))
          ) : (
            <Typography variant="h6" color="textSecondary" sx={{ textAlign: "center", mt: 2 }}>
            {"No Connectsh Available"}
            </Typography>
          )}
        </Box>
      </Scrollbar>

      {/* View All Button */}
      <Box sx={{ p: 2, textAlign: "right" }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          onClick={() => navigate("/dashboard/thread")}
        >
          { "View All"}
        </Button>
      </Box>
    </Card>
  );
}

// Individual Thread Item
function ThreadItem({ thread }) {
    const { companyThread, replies } = thread;
    const [showReplies, setShowReplies] = useState(true);
   
    const toggleReplies = () => {
      setShowReplies((prev) => !prev);
    };
  
    // Function to render content (text, image, PDF, link)
  // Helper Functions to Render Content
const renderImages = (images) => {
    if (images?.length > 0) {
      return (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              style={{
                width: "100%",
                maxWidth: "150px",
                height: "auto",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          ))}
        </Box>
      );
    }
    return null;
  };
  
  const renderPDFs = (pdfs) => {
    if (pdfs?.length > 0) {
      return (
        <Box sx={{ mt: 1 }}>
          {pdfs.map((pdf, index) => {
            const pdfName = pdf.split("/").pop().split("?")[0]; // Extract name from URL
            return (
              <Box key={index} sx={{ mt: 1 }}>
                <button
                  onClick={() => window.open(pdf, "_blank")}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    backgroundColor: "#f9f9f9",
                    cursor: "pointer",
                  }}
                >
                 {"View PDF:"} {decodeURIComponent(pdfName)}
                </button>
              </Box>
            );
          })}
        </Box>
      );
    }
    return null;
  };

  const renderVideos = (videos) => {
    if (videos && videos.length > 0) {
      return (
        <div className="videos-container">
          {videos.map((video, index) => (
            <video
              key={index}
              src={video}
              controls
              style={{
                width: "100%",
                maxWidth: "850px",
                height: "auto",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          ))}
        </div>
      );
    }
    return null;
  };
  
  const renderLinks = (links) => {
    if (links?.length > 0) {
      return (
        <Box sx={{ mt: 1 }}>
          {links.map((link, index) => (
            <Typography
              key={index}
              component="a"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "block",
                color: "primary.main",
                textDecoration: "underline",
                mt: 0.5,
              }}
            >
                  <Microlink key={index} url={link} size="small" />
            
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };
  
    return (
        <Box
        sx={{
          py: 2,
          px: 2,
          display: "flex",
          alignItems: "flex-start",
          borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
          "&:last-child": { borderBottom: "none" },
        }}
      >
        {/* Avatar */}
        <Avatar
          variant="rounded"
          alt={companyThread?.User?.firstName}
          src={companyThread?.User?.profilePic}
          sx={{ width: 48, height: 48, flexShrink: 0 }}
        />
  
        {/* Thread Content */}
        <Box sx={{ ml: 2, flexGrow: 1 }}>
          {/* User Name */}
          <Typography variant="subtitle1" noWrap>
            {companyThread?.User?.firstName} {companyThread?.User?.lastName}
          </Typography>
  
          {/* Message */}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {companyThread?.message}
          </Typography>
  
          {/* Render Images */}
          {renderImages(companyThread?.images)}
  
          {/* Render PDFs */}
          {renderPDFs(companyThread?.pdfs)}
  
          {/* Render Links */}
          {renderLinks(companyThread?.links)}
          {renderVideos(companyThread?.videos)}
  
          {/* Time Ago */}
          <Typography variant="caption" color="text.disabled" sx={{ mt: 1 }}>
            {fToNow(companyThread.createdAt)}
          </Typography>
  
          {/* Toggle Replies */}
          {replies?.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <IconButton
                size="small"
                onClick={toggleReplies}
                aria-label={showReplies ? "Hide replies" : "Show replies"}
              >
                {showReplies ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
              <Typography variant="caption" sx={{ ml: 1 }}>
                {showReplies ? "Hide replies" : "Show replies"}
              </Typography>
            </Box>
          )}
  
          {/* Render Replies Recursively */}
          {showReplies && replies?.length > 0 && (
            <Box sx={{ mt: 2, pl: 4, borderLeft: (theme) => `2px solid ${theme.palette.divider}` }}>
              {replies.map((reply) => (
                <ThreadItem key={reply.companyThread.id} thread={reply} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    );
  }
  
  
