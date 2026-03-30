import { Person2Rounded } from '@mui/icons-material';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import './appbar.css';


function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const currentUser = localStorage.getItem('userData')
  const userProfile = JSON.parse(currentUser)
  const name = userProfile ? userProfile.fullName : null;


  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', gridColumnGap: '10px' }}>
        <div className="header-name">
          {/* <p>Hi, {name.slice(name.lastIndexOf(' ') + 1)}</p> */}
          <h5>Hi, {name.slice(name.lastIndexOf(' ') + 1)}</h5>
          <p>{userProfile.role} </p>
        </div>
        <Tooltip title="Account settings">
          <IconButton style={{ marginLeft: '2px' }}
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, backgroundColor: '#fff', color: '#000', fontWeight: 600 }}>{name.charAt(0)}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Person2Rounded fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem> */}
        {/* <Divider /> */}

        <a href='/logout'>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </a>
      </Menu>
    </>
  );
}

export default AccountMenu;