import {useState, useEffect} from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {useChannels} from '../context/ChannelsContext.jsx';
import {useWorkspace} from '../context/WorkspaceContext.jsx';
import {useNavigate} from 'react-router-dom';

const Channels = () => {
  const {currentWorkspace} = useWorkspace();
  const workspaceName = currentWorkspace.name;
  const navigate = useNavigate();
  const {
    fetchChannels, channels, setCurrentChannel, createChannel} = useChannels();
  const [openDialog, setOpenDialog] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDesc, setChannelDesc] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Fetch channels when the workspace changes
  useEffect(() => {
    fetchChannels();
  }, [currentWorkspace.id]);

  // Reset current channel when navigating away from a channel
  useEffect(() => {
    if (!location.pathname.includes('/channel/')) {
      setCurrentChannel({id: null, name: null, description: null});
    }
  }, [location.pathname, setCurrentChannel]);

  // Handle channel click
  const handleChannelClick = (channelName) => {
    const selectedChannel = channels.find((ch) => ch.data.name === channelName);
    if (selectedChannel) {
      setCurrentChannel({
        id: selectedChannel.id,
        name: selectedChannel.data.name,
        description: selectedChannel.data.description,
      });
    }
    navigate(`/workspace/${workspaceName}/channel/${channelName}`);
  };

  const handleCreateChannelClick = () => {
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false);
    setChannelName('');
    setChannelDesc('');
  };

  // Handle channel creation
  const handleCreateChannel = async () => {
    await createChannel(channelName, channelDesc);
    fetchChannels();
    handleDialogClose();
  };

  // Validate the form
  useEffect(() => {
    setIsFormValid(channelName.trim() !== '' && channelDesc.trim() !== '');
  }, [channelName, channelDesc]);

  return (
    <>
      {/* Channels Section Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 16px 8px',
        }}
      >
        <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>
          Channels
        </Typography>
        {/* "Create Channel" Button */}
        <IconButton
          onClick={handleCreateChannelClick}
          aria-label="Create Channel"
          size="small"
          sx={{color: 'primary.main'}}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* List of Channels */}
      <List>
        {channels.map((channel) => (
          <ListItem
            button="true"
            key={channel.id}
            onClick={() => handleChannelClick(channel.data.name)}
            aria-label={`channel ${channel.data.name}`}
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              'paddingLeft': '24px',
            }}
          >
            <ListItemText
              primary={channel.data.name}
              primaryTypographyProps={{fontWeight: 'medium'}}
            />
          </ListItem>
        ))}
      </List>
      <Divider />

      {/* Dialog for creating a new channel */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>New Channel</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Channel Name"
            aria-label="channel name input"
            type="channelname"
            fullWidth
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            error={channelName.trim() === ''}
            helperText={channelName.trim() === '' ? 'Name is required' : ''}
            sx={{marginBottom: '16px'}}
          />
          <TextField
            required
            margin="dense"
            label="Channel Description"
            aria-label="channel description input"
            type="channeldesc"
            fullWidth
            value={channelDesc}
            onChange={(e) => setChannelDesc(e.target.value)}
            error={channelDesc.trim() === ''}
            helperText=
              {channelDesc.trim() === '' ? 'Description is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} aria-label="Cancel">
            Cancel
          </Button>
          <Button
            onClick={handleCreateChannel}
            aria-label="Create"
            disabled={!isFormValid}
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Channels;
