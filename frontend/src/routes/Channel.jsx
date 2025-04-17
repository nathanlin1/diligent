import {useEffect, useState, useRef} from 'react';
import {
  Box,
  Typography,
  Divider,
  CssBaseline,
  CircularProgress,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TopBar from '../components/TopBar';
import {useMessages} from '../context/MessagesContext';
import {useChannels} from '../context/ChannelsContext';
import {useIsMobile} from '../context/IsMobileContext';
import BottomNav from '../components/BottomNav';
import SideNav from '../components/SideNav';
import {useAuth} from '../context/AuthContext';

const Channel = () => {
  const {messages, fetchMessages, createMessage, deleteMessage, loading} =
    useMessages();
  const {currentChannel} = useChannels();
  const [messageInput, setMessageInput] = useState('');
  const isMobile = useIsMobile();
  const {userId} = useAuth();
  const messagesEndRef = useRef(null);

  const channelId = currentChannel.id;

  useEffect(() => {
    if (channelId) {
      fetchMessages(channelId);
    }
  }, [channelId]);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (
      messagesEndRef.current &&
      typeof messagesEndRef.current.scrollIntoView === 'function'
    ) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      await createMessage(channelId, messageInput);
      setMessageInput('');
      await fetchMessages(channelId);
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};

    messages.forEach((message) => {
      const date = message.data.timestamp.split('T')[0];
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
    });

    return groupedMessages;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Group messages
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        marginLeft: {xs: 0, sm: '56px', md: '240px'},
        marginTop: '64px',
      }}
    >
      <CssBaseline />
      <TopBar />
      {!isMobile && <SideNav />}

      <Box
        sx={{
          height: isMobile ? 'calc(100vh - 240px)' : 'calc(100vh - 200px)',
          overflowY: 'auto',
        }}
      >
        <Typography variant="body1" gutterBottom fontSize="1.3rem">
          {currentChannel.description}
        </Typography>
        <Divider sx={{my: 2}} />

        {loading && <CircularProgress />}

        {!loading && messages.length === 0 && (
          <Typography variant="body1">No messages found.</Typography>
        )}
        {!loading &&
          Object.entries(groupedMessages).map(([date, messages]) => (
            <Box key={date} sx={{mb: 4}}>
              <Typography
                variant="subtitle2"
                sx={{
                  textAlign: 'center',
                  backgroundColor: 'background.paper',
                  py: 1,
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                {formatDate(date)}
              </Typography>

              {messages.map((message) => {
                const uidm = message.user_id;
                return (
                  <Box
                    key={message.id}
                    sx={{
                      'mb': 2,
                      'display': 'flex',
                      'alignItems': 'center',
                      'justifyContent': 'space-between',
                      'borderRadius': 1,
                      'p': 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      '&:hover .delete-icon': {
                        visibility: 'visible',
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontSize="1.1rem">
                        <strong>{message.data.owner_name}:</strong>{' '}
                        {message.data.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{color: 'text.secondary'}}
                      >
                        {new Date(message.data.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>

                    {uidm === userId && (
                      <IconButton
                        aria-label="delete message"
                        className="delete-icon"
                        onClick={() => deleteMessage(message.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                );
              })}
            </Box>
          ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: isMobile ? 56 : 0, // Adjust bottom position for mobile
          left: {xs: 0, sm: '56px', md: '240px'},
          right: {xs: 0, sm: '56px', md: '56px'},
          p: 2,
          backgroundColor: 'background.paper',
          zIndex: (theme) => theme.zIndex.drawer,
          maxWidth: {md: 'calc(100% - 296px)'},
        }}
      >
        <TextField
          fullWidth
          type="messagebox"
          variant="outlined"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          sx={{mb: 1}}
          inputProps={{
            'aria-label': 'message input',
          }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSendMessage}
          disabled={!messageInput.trim()}
          aria-label="send button"
        >
          Send
        </Button>
      </Box>

      {/* Show BottomNav only on mobile */}
      {isMobile && <BottomNav />}
    </Box>
  );
};

export default Channel;
