import React from 'react';
import Avatar from 'material-ui/Avatar';
import { List, ListItem } from 'material-ui/List';
import _ from 'underscore';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const developerStyle = {
  fontWeight: '500',
  height: '100px',
  backgroundColor: 'white',
};

const LoadingList = () => {
  const emptyPlaceholders = _.map(_.range(0, 50, 1), (elem, index) => (
    <div
      key={index}
      style={developerStyle}
      className="profile--item"
      id={`developer_${elem}`}
    >
      <ListItem
        leftAvatar={
          <Avatar src={'https://placeholdit.imgix.net/~text?w=80&h=80'} size={80} />
        }
        secondaryText={
          <div className="animated-background secondary" />
        }
        primaryText={
          <div className="loading">
            <div className="animated-background" />
          </div>
        }
        disabled
        secondaryTextLines={1}
      />
    </div>
  ));

  return (
    <MuiThemeProvider>
      <List>
        {emptyPlaceholders}
      </List>
    </MuiThemeProvider>
  );
};

export default LoadingList;