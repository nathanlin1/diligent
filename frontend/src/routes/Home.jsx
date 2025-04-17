import {Box, CssBaseline, Typography} from '@mui/material';
import TopBar from '../components/TopBar';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';
import {useIsMobile} from '../context/IsMobileContext';
import {useWorkspace} from '../context/WorkspaceContext';

const Home = () => {
  const isMobile = useIsMobile();
  const {currentWorkspace} = useWorkspace();

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline />
      <SideNav />
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: {xs: 0, sm: '56px', md: '240px'},
          marginTop: '64px',
        }}
      >
        {/* Workspace description (only on desktop) */}
        {!isMobile && (
          <Typography variant="body1" gutterBottom>
            {currentWorkspace.description}
          </Typography>
        )}

        {/* Add other content here */}
      </Box>

      {/* TopBar and BottomNav */}
      <TopBar />
      <BottomNav />
    </Box>
  );
};

export default Home;
