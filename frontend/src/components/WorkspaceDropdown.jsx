import {useState, useEffect} from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useWorkspace} from '../context/WorkspaceContext';
import {useNavigate} from 'react-router-dom';

const WorkspaceDropdown = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const {workspaces, setCurrentWorkspace, createWorkspace, fetchWorkspaces} =
    useWorkspace();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreateWorkspaceClick = () => {
    setOpenDialog(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setWorkspaceName('');
    setWorkspaceDescription('');
  };

  const handleCreateWorkspace = async () => {
    const newWorkspace = await createWorkspace(
        workspaceName,
        workspaceDescription,
    );
    setCurrentWorkspace({
      id: newWorkspace.id,
      name: newWorkspace.data.name,
      description: newWorkspace.data.description,
    });
    handleDialogClose();
  };

  const handleWorkspaceSelect = (workspaceName) => {
    const selectedWorkspace = workspaces
        .find((ws) => ws.name === workspaceName);
    if (selectedWorkspace) {
      setCurrentWorkspace({
        id: selectedWorkspace.id,
        name: selectedWorkspace.name,
        description: selectedWorkspace.description,
      });
    }

    handleClose();
    navigate('/');
  };

  useEffect(() => {
    setIsFormValid(
        workspaceName.trim() !== '' && workspaceDescription.trim() !== '',
    );
  }, [workspaceName, workspaceDescription]);

  return (
    <div>
      <IconButton
        onClick={handleClick}
        aria-label="workspace menu"
        aria-controls={open ? 'workspace-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{color: 'inherit'}}
      >
        <KeyboardArrowDownIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {/* Display existing workspaces */}
        {workspaces.map((workspace) => (
          <MenuItem
            key={workspace.id}
            onClick={() => handleWorkspaceSelect(workspace.name)}
            aria-label={`workspace ${workspace.name}`}
          >
            <Typography variant="body1">{workspace.name}</Typography>
          </MenuItem>
        ))}

        {/* Divider between workspaces and "Create Workspace" */}
        <Divider />

        {/* "Create Workspace" option at the bottom */}
        <MenuItem
          onClick={handleCreateWorkspaceClick}
          aria-label="create workspace"
        >
          <Typography variant="body1">Create Workspace</Typography>
        </MenuItem>
      </Menu>

      {/* Dialog for creating a new workspace */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Create New Workspace</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Name"
            aria-label="workspace name input"
            type="text"
            fullWidth
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            error={workspaceName.trim() === ''}
            helperText={
              workspaceName.trim() === '' ? 'Workspace Name is required' : ''
            }
          />
          <TextField
            required
            margin="dense"
            label="Workplace Description"
            aria-label="workspace description input"
            type="text"
            fullWidth
            value={workspaceDescription}
            onChange={(e) => setWorkspaceDescription(e.target.value)}
            error={workspaceDescription.trim() === ''}
            helperText={
              workspaceDescription
                  .trim() === '' ? 'Description is required' : ''
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} aria-label="Cancel">
            Cancel
          </Button>
          <Button
            onClick={handleCreateWorkspace}
            aria-label="Create"
            disabled={!isFormValid}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WorkspaceDropdown;
