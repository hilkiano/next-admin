import React from "react";
import Icon from "@mui/material/Icon";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Link from "next/link";

import { MyBackdrop, myBackdrop } from "../reusable/MyBackdrop";

class NestedList extends React.Component {
  state = { open: {} };

  handleClick = (key) => () => {
    this.setState({ [key]: !this.state[key] });
  };

  showLoading = (message) => {
    myBackdrop(true, message);
  };

  render() {
    const { lists, activeLink, message } = this.props;

    return (
      <div>
        <List component="nav" disablePadding>
          {lists.map(({ name, label, is_parent, icon, url, child }) => {
            const open = this.state[name] || false;
            if (!is_parent) {
              return (
                <div key={name}>
                  <Link href={url}>
                    <ListItemButton
                      onClick={() => this.showLoading(message)}
                      selected={activeLink === name}
                    >
                      <ListItemIcon>
                        <Icon
                          color={activeLink === name ? "primary" : "inherit"}
                        >
                          {icon}
                        </Icon>
                      </ListItemIcon>
                      <ListItemText primary={label} />
                    </ListItemButton>
                  </Link>
                </div>
              );
            } else {
              return (
                <div key={name}>
                  <ListItemButton onClick={this.handleClick(name)}>
                    <ListItemIcon>
                      <Icon>{icon}</Icon>
                    </ListItemIcon>
                    <ListItemText primary={label} />
                    {!open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={!open} timeout="auto">
                    <List component="div" disablePadding>
                      {child.map(
                        ({
                          name: childName,
                          label: childLabel,
                          icon: childIcon,
                          url: childUrl,
                        }) => (
                          <Link key={childName} href={childUrl}>
                            <ListItemButton
                              onClick={() => this.showLoading(message)}
                              selected={activeLink === childName}
                            >
                              <ListItemIcon sx={{ ml: "1em" }}>
                                <Icon
                                  color={
                                    activeLink === childName
                                      ? "primary"
                                      : "inherit"
                                  }
                                >
                                  {childIcon}
                                </Icon>
                              </ListItemIcon>
                              <ListItemText primary={childLabel} />
                            </ListItemButton>
                          </Link>
                        )
                      )}
                    </List>
                  </Collapse>
                </div>
              );
            }
          })}
        </List>
      </div>
    );
  }
}

export default NestedList;
