import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import CloseIcon from '@mui/icons-material/Close';

const DynamicText = styled('div')`
    display: inline-block;
    white-space: pre-wrap; /* Allow line breaks */
    @keyframes fadeIn {
        0% { opacity: 0; }
        20% { opacity: 1; }
        100% { opacity: 1; }
    }
    
    .char-animation {
        opacity: 0;
        animation: fadeIn 0.1s forwards;
    }
`;

const TipIcon = styled(EmojiObjectsIcon)`
  color: #ffeb3b; /* Bright yellow color for the emoji */
  font-size: 2.5rem;
  animation: bounce 2s infinite;

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0); 
    }
    40% {
      transform: translateY(-10px); 
    }
    60% {
      transform: translateY(-5px); 
    }
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const DailyAdvise = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const text = `Hi, ${currentUser.user.firstName} I understand that you are feeling on edge and you are worrying. This is driven by you not sleeping well and are not 100% healthy. To help with your anciousness …...........`;
        const chars = text.split("");
        const container = document.getElementById("word-container");

        if (container) {
            container.innerHTML = ''; // Clear existing content
            chars.forEach((char, index) => {
                setTimeout(() => {
                    const span = document.createElement("span");
                    span.textContent = char;
                    span.className = "char-animation";
                    container.appendChild(span);
                }, index * 50); // Adjust the delay as needed
            });
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    if (!open) return null;

    return (
        <div id="advice-container" style={{ padding: '20px', margin: 'auto' }}>
            <h1><TipIcon /> Daily Advise </h1>
            <DynamicText id="word-container"></DynamicText>
            {/* <CloseButton onClick={handleClose}>
                <CloseIcon />
            </CloseButton> */}
        </div>
    );
};

export default DailyAdvise;
