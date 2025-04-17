import {createContext, useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {useWorkspace} from './WorkspaceContext';

const ChannelsContext = createContext();

export const ChannelsProvider = ({children}) => {
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState({
    id: null, name: null, description: null,
  });
  const {currentWorkspace} = useWorkspace();
  const wsId = currentWorkspace.id;

  const fetchChannels = async () => {
    if (!currentWorkspace.id) return;

    const response = await fetch(`http://localhost:3010/api/v0/workspaces/${wsId}/channels`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();
    setChannels(data);
  };

  const createChannel = async (name, description) => {
    await fetch(`http://localhost:3010/api/v0/workspaces/${wsId}/channels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name,
        description,
      }),
    });

    await fetchChannels();
  };

  return (
    <ChannelsContext.Provider value={{
      channels,
      setChannels,
      fetchChannels,
      currentChannel,
      setCurrentChannel,
      createChannel}}>
      {children}
    </ChannelsContext.Provider>
  );
};

ChannelsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useChannels = () => useContext(ChannelsContext);
