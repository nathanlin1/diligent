import {createContext, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {useChannels} from './ChannelsContext';

// Create the MessagesContext
const MessagesContext = createContext();

// Provider component
export const MessagesProvider = ({children}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const {currentChannel} = useChannels();
  const cId = currentChannel.id;

  const fetchMessages = async () => {
    setLoading(true);
    const response = await fetch(`http://localhost:3010/api/v0/channels/${cId}/messages`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();
    setMessages(data);

    setLoading(false);
  };

  const createMessage = async (channelId, content) => {
    const response = await fetch(`http://localhost:3010/api/v0/channels/${channelId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({content}),
    });

    const newMessage = await response.json();
    await fetchMessages();
    return newMessage;
  };

  const deleteMessage = async (messageId) => {
    await fetch(`http://localhost:3010/api/v0/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    await fetchMessages();
  };

  return (
    <MessagesContext.Provider value={{
      messages,
      fetchMessages,
      createMessage,
      deleteMessage,
      loading,
    }}>
      {children}
    </MessagesContext.Provider>
  );
};

MessagesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the MessagesContext
export const useMessages = () => useContext(MessagesContext);
