import { DeleteForeverOutlined, VisibilityOutlined } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import * as React from 'react';
import EditCampDet from '../campForm/EditCampDet';
import DeleteCampDet from '../DeleteCampDet';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 100,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 13,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));



export default function CustomizedMenus({ data }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isEditModalOpen, setEditModalOpen] = React.useState(false)
  const [selectedData, setSelectedData] = React.useState(null)
  const [formMode, setformMode] = React.useState('')

  const viewRecord = (row, view) => {
    setSelectedData(row);
    setformMode('view');
    handleClose()
    setEditModalOpen(true);
  }

  const editRecord = (row, edit) => {
    setSelectedData(row);
    setformMode('edit');
    handleClose()
    setEditModalOpen(true);
  }

  const [deletePop, setDeletePop] = React.useState(false);
  const [deleteOption, setDeleteOption] = React.useState(false);
  const deleteRecord = (row) => {
    setSelectedData(row);
    handleClose();
    setDeleteOption('Camp')
    setDeletePop(true);
  }

  const [allcamplists, setallCampDet] = React.useState([])
  const apiUrl = process.env.REACT_APP_API_URL;
  const currentUser = localStorage.getItem('userData')
  const userProfile = JSON.parse(currentUser)
  const userId = userProfile ? userProfile.id : null;
  const userRole = userProfile ? userProfile.role : null;


  const fetchData = async () => {
    try {
      const res = await fetch(`${apiUrl}/getAllCampdet`);
      const result = await res.json()
      if (result.status === 'FAILED') {

      } else {
        setallCampDet(result)

      }
    } catch (err) {
      console.log('Error fetching data', err);
    }
  }


  return (
    <div>
      <MoreHorizIcon style={{ fontSize: '15px', transform: 'rotate(90deg)',color:'#326ba8' }}
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      />
      <StyledMenu
      
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => editRecord(data)} disableRipple sx={{ fontSize: '13px' }}>
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={() => viewRecord(data)} disableRipple sx={{ fontSize: '13px' }}>
          <VisibilityOutlined />
          View
        </MenuItem>
        {userRole === "ROLE_SUPER_ADMIN" ?
          <MenuItem onClick={() => deleteRecord(data)} disableRipple sx={{ fontSize: '13px' }}>
            <DeleteForeverOutlined />
            Delete
          </MenuItem> : ''
        }
      </StyledMenu>
      {isEditModalOpen && (
        <EditCampDet fetchData={fetchData} userData={userProfile} data={selectedData} formMode={formMode} isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} />
      )}
      {deletePop && (
        <DeleteCampDet deleteItem={deleteOption} data={selectedData} isDeletePop={deletePop} OnDeletePopClose={() => setDeletePop(false)} userId={userId} fetchData={fetchData} />
      )}
    </div>
  );
}
