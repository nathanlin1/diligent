import {
  Drawer,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import Channels from './Channels';

const SideNav = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={true}
      sx={{
        'width': isMobile ? '100%' : 240,
        'flexShrink': 0,
        '& .MuiDrawer-paper': {
          width: isMobile ? '100%' : 240,
          boxSizing: 'border-box',
          marginTop: '56px',
          backgroundColor: theme.palette.background.paper,
        },
      }}
      aria-label="side navigation"
    >
      <Divider />
      <Channels />
    </Drawer>
  );
};

export default SideNav;
