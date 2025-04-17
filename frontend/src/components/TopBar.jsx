import {AppBar, Toolbar, Typography} from '@mui/material';
import WorkspaceDropdown from './WorkspaceDropdown';
import {useWorkspace} from '../context/WorkspaceContext.jsx';
import {useChannels} from '../context/ChannelsContext.jsx';

const TopBar = () => {
  const {currentWorkspace} = useWorkspace();
  const {currentChannel} = useChannels();

  return (
    <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
      <Toolbar aria-label="topbar">
        {/* Workspace Name */}
        <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
          {currentChannel?.name ? currentChannel?.name : currentWorkspace?.name}
        </Typography>

        {/* Workspace Dropdown */}
        <WorkspaceDropdown />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
