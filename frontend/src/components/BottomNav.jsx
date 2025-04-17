import {BottomNavigation, BottomNavigationAction, Paper} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import {useAuth} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';

const BottomNav = () => {
  const {logout} = useAuth();
  const navigate = useNavigate();

  return (
    <Paper sx={
      {position: 'fixed',
        bottom: 0, left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1}}
    elevation={3}
    >
      <BottomNavigation showLabels>
        {/* Home Button */}
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{color: 'primary.main'}}
        />
        <BottomNavigationAction
          label="Logout"
          icon={<LogoutIcon />}
          onClick={logout}
          sx={{color: 'error.main'}}
          aria-label="Logout"
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
