import React, { useState, useRef } from 'react';
import {
  Button,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  ClickAwayListener,
  Grow,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
function CustomMenu({
  buttonLabel = 'Menu',
  items = [], // array of { label, icon, onClick }
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Menu">
        <Button ref={anchorRef} onClick={handleToggle}
            color='#ffff'
        >
        <MenuIcon/>
      </Button>
      </Tooltip>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="top"
        transition
        // disablePortal
        sx={{
            zIndex:9999,
        }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper
              sx={{
                padding: 0,
                zIndex:9999,
                borderRadius:"1rem"
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open}>
                  {items.map((item, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        item.onClick && item.onClick();
                        handleClose();
                      }}
                      sx={{
                        display:"flex",
                        flexDirection:"row",
                        gap:1
                      }}
                    >
                      {/* {item.item} */}
                      {item.icon && 
                      <span>
                        {item.icon}
                      </span>
                      }
                      {item.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default CustomMenu;
