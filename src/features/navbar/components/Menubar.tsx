import * as React from 'react';
import { Menu } from '@base-ui/react/menu';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton, { type ListItemButtonProps } from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader, { type ListSubheaderProps } from '@mui/material/ListSubheader';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckIcon from '@mui/icons-material/Check';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Divider, { type DividerProps } from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';



const StyledMenubar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingInline: theme.spacing(3),
  backgroundColor: "#1976d2",
  height: "70px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
  boxSizing: 'border-box',
  borderColor: "white"
  
}));





export function Menubar(props: React.ComponentProps<typeof BaseMenubar>) {
  return <BaseMenubar render={<StyledMenubar />} {...props}  />;
}

export function MenuRoot(props: React.ComponentProps<typeof Menu.Root>) {
  return <Menu.Root {...props} />;
}


const StyledTrigger = styled(Button)(({ theme }) => ({
  paddingInline: theme.spacing(2.8),
  color: "white",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1.15rem",
  background: "rgba(255,255,255,0.12)",
  borderRadius: 9999,          // ★ pill shape
  '&:hover': {
    backgroundColor: "rgba(255,255,255,0.22)"
  },
  '&[data-popup-open]': {
    backgroundColor: "rgba(255,255,255,0.28)"
  }
}));

export function MenuTrigger(props: React.ComponentProps<typeof Menu.Trigger>) {
  return (
    <Menu.Trigger
      render={
        <StyledTrigger
          size="small"
          color="inherit"
          disableRipple
          endIcon={<KeyboardArrowDownIcon sx={{ color: "white" }} />}
          sx={{border:"0.5px solid", borderColor:"white"}}
        />
      }
      {...props}
    />
  );
}


export function MenuPortal(props: React.ComponentProps<typeof Menu.Portal>) {
  return <Menu.Portal {...props} />;
}

export function MenuPositioner(props: React.ComponentProps<typeof Menu.Positioner>) {
  return <Menu.Positioner {...props} />;
}

// 
const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: 4,
  borderRadius: 12,      // ★ softer
  minWidth: 180,
  paddingBlock: theme.spacing(0.5),
  boxShadow: "0px 4px 18px rgba(0,0,0,0.18)"
}));

type MenuPopupRenderProps = Parameters<Extract<React.ComponentProps<typeof Menu.Popup>['render'], (...args: any) => any>>[0];
export function MenuPopup(props: React.ComponentProps<typeof Menu.Popup>) {
  return (
    <Menu.Popup
      render={(renderProps: MenuPopupRenderProps) => (
        <StyledPaper elevation={8}>
          <List
            component="div"
            disablePadding
            sx={{ outline: 'none' }}
            {...renderProps}
          >
            {props.children}
          </List>
        </StyledPaper>
      )}
      {...props}
    />
  );
}

interface MenuItemExtendedProps {
  icon?: React.ReactNode;
  secondary?: React.ReactNode;
  hint?: React.ReactNode;
}

export function MenuItem(
  props: React.ComponentProps<typeof Menu.Item> &
    Pick<ListItemButtonProps, 'sx'> &
    MenuItemExtendedProps,
) {
  const { sx, icon, hint, children, secondary, ...other } = props;
  return (
    <Menu.Item
      render={
        
<ListItemButton
  dense
  sx={[
    { 

      gap: 1.5,
      py: 1.2,        
      '& .MuiListItemText-primary': {
        fontSize: "1.2rem",     
        fontWeight: 500
      }
    },
    ...(Array.isArray(sx) ? sx : [sx])
  ]}
/>

      }
      {...other}
    >
      {icon && <ListItemIcon sx={{ minWidth: 'unset' }}>{icon}</ListItemIcon>}
      <ListItemText secondary={secondary}>{children}</ListItemText>
      {hint && (
        <Typography
          sx={{ flexShrink: 0, color: 'text.secondary', typography: 'body2' }}
        >
          {hint}
        </Typography>
      )}
    </Menu.Item>
  );
}

export function MenuSubmenuRoot(
  props: React.ComponentProps<typeof Menu.SubmenuRoot>,
) {
  return <Menu.SubmenuRoot {...props} />;
}

const StyledHint = styled(Typography)(({ theme }) => ({
  flexShrink: 0,
  color: (theme.vars || theme).palette.text.secondary,
  ...theme.typography.body2,
}));
export function MenuSubmenuTrigger(
  props: React.ComponentProps<typeof Menu.SubmenuTrigger> &
    Pick<ListItemButtonProps, "sx"> &
    Pick<MenuItemExtendedProps, "icon" | "hint">,
) {
  const { sx, icon, hint, children, ...other } = props;

  return (
    <Menu.SubmenuTrigger
      render={
        <ListItemButton
          dense
          sx={[
            {
              py: 1.2,
              "& .MuiListItemText-primary": {
                fontSize: "1.2rem",   // increase to 1.3rem or 1.4rem if desired
            
              },
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        />
      }
      {...other}
    >
      {icon && <ListItemIcon sx={{ minWidth: 32 }}>{icon}</ListItemIcon>}
      <ListItemText>{children}</ListItemText>
      {hint && <StyledHint>{hint}</StyledHint>}
      <ChevronRightIcon fontSize="small" sx={{ mr: -1 }} />
    </Menu.SubmenuTrigger>
  );
}


export function MenuSeparator(
  props: React.ComponentProps<typeof Menu.Separator> & Pick<DividerProps, 'sx'>,
) {
  const { sx, ...other } = props;
  return (
    <Menu.Separator
      render={<Divider sx={[{ my: 0.5 }, ...(Array.isArray(sx) ? sx : [sx])]} />}
      {...other}
    />
  );
}

export function MenuCheckboxItem(
  props: React.ComponentProps<typeof Menu.CheckboxItem> &
    Pick<MenuItemExtendedProps, 'hint'>,
) {
  const { hint, children, ...other } = props;
  return (
    <Menu.CheckboxItem render={<ListItemButton dense />} {...other}>
      <ListItemIcon sx={{ minWidth: 32 }}>
        <Menu.CheckboxItemIndicator render={<CheckIcon fontSize="small" />} />
      </ListItemIcon>
      <ListItemText>{children}</ListItemText>
      {hint && <StyledHint>{hint}</StyledHint>}
    </Menu.CheckboxItem>
  );
}

export function MenuRadioGroup(props: React.ComponentProps<typeof Menu.RadioGroup>) {
  return <Menu.RadioGroup {...props} />;
}

export function MenuRadioItem(
  props: React.ComponentProps<typeof Menu.RadioItem> &
    Pick<MenuItemExtendedProps, 'hint'>,
) {
  const { hint, children, ...other } = props;
  return (
    <Menu.RadioItem render={<ListItemButton dense />} {...other}>
      <ListItemIcon sx={{ minWidth: 32, position: 'relative' }}>
        <RadioButtonUncheckedIcon fontSize="small" />
        <Menu.RadioItemIndicator
          render={
            <RadioButtonCheckedIcon
              fontSize="small"
              sx={{ position: 'absolute', left: 0 }}
            />
          }
        />
      </ListItemIcon>
      <ListItemText>{children}</ListItemText>
      {hint && <StyledHint>{hint}</StyledHint>}
    </Menu.RadioItem>
  );
}

export function MenuGroup(props: React.ComponentProps<typeof Menu.Group>) {
  return <Menu.Group render={<Box sx={{ position: 'relative' }} />} {...props} />;
}

const StyledSubheader = styled(ListSubheader)(({ theme }) => ({
  position: 'initial',
  paddingBlock: theme.spacing(1),
  backgroundColor: 'transparent',
  ...theme.typography.overline,
  lineHeight: '1.5',
}));

export function MenuGroupLabel(
  props: React.ComponentProps<typeof Menu.GroupLabel> &
    Pick<ListSubheaderProps, 'sx'>,
) {
  const { sx, ...other } = props;
  const subheaderProps: ListSubheaderProps = { sx, component: 'div' };
  return (
    <Menu.GroupLabel render={<StyledSubheader {...subheaderProps} />} {...other} />
  );
}