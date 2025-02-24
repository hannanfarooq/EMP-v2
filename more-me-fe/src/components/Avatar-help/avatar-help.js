import Avatar from '@mui/material/Avatar';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DailyAdvise from '../Daily-Advise/daily-advise';

const AnimatedAvatar = styled(Avatar)`
  cursor: pointer;
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  z-index: 999 !important;
  animation: glow 2s ease-in-out infinite;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes glow {
    0% {
      box-shadow: 0 0 5px 5px rgba(0, 255, 0, 0.4);
    }
    50% {
      box-shadow: 0 0 20px 20px rgba(0, 255, 0, 0.8);
    }
    100% {
      box-shadow: 0 0 5px 5px rgba(0, 255, 0, 0.4);
    }
  }
`;

export default function TipsAvatar() {
  const [showAdviseDialog, setShowAdviseDialog] = useState(false);

  const handleAvatarClick = () => {
    setShowAdviseDialog(!showAdviseDialog);
  };

  const handleClose = () => {
    setShowAdviseDialog(false);
  };

  return (
    <div>
      <Tooltip title="Today's Advice">
        <AnimatedAvatar  
          onClick={handleAvatarClick} 
          alt="Tips" 
          src={`${process.env.PUBLIC_URL}/assets/images/avatars/avatar_14.jpg`} 
        />
      </Tooltip>
      <Dialog open={showAdviseDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <DailyAdvise />
        </DialogContent>
      </Dialog>
    </div>
  );
}
