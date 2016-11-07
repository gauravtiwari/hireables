// Modules
import React, { Component } from 'react';
import Relay from 'react-relay';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'dialog-polyfill/dialog-polyfill.css';

// Util
import muiTheme from '../../theme.es6';
import Dialog from '../../../utils/dialog.es6';

// Stylesheet
import '../../styles/popup.sass';

class Linkedin extends Component {
  componentDidMount() {
    this.dialog = new Dialog({
      reactNodeId: 'popups-container',
      dialogId: this.popupNode.id,
    });

    this.dialog.toggle();
    this.dialog.get().classList.add('pulse');
    setTimeout(() => {
      this.dialog.get().classList.remove('pulse');
    }, 300);
  }

  render() {
    const { developer } = this.props;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <dialog
          id={`developer-profile-${developer.id}`}
          className="popup"
          ref={node => (this.popupNode = node)}
        >
          <div className="repos">
            {developer.repos.map(repo => (repo.name))}
          </div>
        </dialog>
      </MuiThemeProvider>
    );
  }
}

Linkedin.propTypes = {
  developer: React.PropTypes.object,
};

const LinkedinContainer = Relay.createContainer(
  Linkedin, {
    fragments: {
      developer: () => Relay.QL`
        fragment on Developer {
          id,
          repos,
        }
      `,
    },
  }
);

export default LinkedinContainer;
