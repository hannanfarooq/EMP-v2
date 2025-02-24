import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { getNotificationsByUserId, markAllNotificationsAsRead } from 'src/api';
import { socket } from 'src/App';

// Notification Popover Component
export default function NotificationsPopover() {

  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const totalUnRead = notifications&& notifications.filter((item) => !item.isRead).length;

  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsByUserId(currentUser.token, currentUser.user.id);
      setNotifications(res.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    socket.on('EmitNotification', (allNotifications) => {
      if (currentUser) {
        // Filter notifications for the current user
        const userNotifications = allNotifications.filter(
          (notification) => notification.userId === currentUser.user.id
        );

        setNotifications(userNotifications);
      }
    });
   
    
  });


  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = async() => {


  await  markAllNotificationsAsRead(currentUser.token,currentUser.user.id)
   
  };

  return (
    <>
      <IconButton color={anchorEl ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <NotificationList title="New" notifications={notifications && notifications.slice(0, 2)} />
          <NotificationList title="Before that" notifications={notifications &&notifications.slice(2)} />
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationList({ title, notifications }) {
  return (
    <List
      disablePadding
      subheader={
        <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
          {title}
        </ListSubheader>
      }
    >
      {notifications &&notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </List>
  );
}

NotificationList.propTypes = {
  title: PropTypes.string.isRequired,
  notifications: PropTypes.array.isRequired,
};

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isRead === false && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    isRead: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string,
    type: PropTypes.string,
    metadata: PropTypes.object,
  }),
};

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        {`: ${notification.message}`}
      </Typography>
    </Typography>
  );

  const icons = {
    Task: '/assets/icons/ic_notification_task.svg',
    Info: '/assets/icons/ic_notification_info.svg',
    Warning: '/assets/icons/ic_notification_warning.svg',
    Success: '/assets/icons/ic_notification_success.svg',
  };

  return {
    avatar: icons[notification.type] ? <img alt={notification.title} src={icons[notification.type]} /> : null,
    title,
  };
}
