import {createContext, useContext, useState} from 'react';
import PropTypes from 'prop-types';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({children}) => {
  const [currentWorkspace, setCurrentWorkspace] = useState({
    id: null,
    name: null,
    description: null,
  });
  const [workspaces, setWorkspaces] = useState([]);

  const fetchWorkspaces = async () => {
    const response = await fetch('http://localhost:3010/api/v0/workspaces', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();
    setWorkspaces(data);

    const wsId = currentWorkspace.id;

    if (data.length > 0 && wsId === null) {
      setCurrentWorkspace({
        id: data[0].id,
        name: data[0].name,
        description: data[0].description,
      });
    }
  };

  const workspaceName = currentWorkspace.name;

  const createWorkspace = async (name, description) => {
    const response = await fetch('http://localhost:3010/api/v0/workspaces', {
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

    const newWorkspace = await response.json();
    await fetchWorkspaces();
    return newWorkspace;
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        setCurrentWorkspace,
        workspaces,
        createWorkspace,
        fetchWorkspaces,
        workspaceName,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

WorkspaceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useWorkspace = () => useContext(WorkspaceContext);
