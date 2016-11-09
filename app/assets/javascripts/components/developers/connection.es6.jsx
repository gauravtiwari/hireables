/* global document Routes SE $ */

// Modules
import React, { Component } from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';
import { ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

// Route
import developerRoute from '../../routes/developerRoute.es6';
import LoadingComponent from '../shared/loadingComponent';
import ErrorComponent from '../shared/errorComponent';

// Child Components
import Github from '../shared/icons/github.es6';
import StackOverflow from '../shared/icons/stackoverflow.es6';
import Linkedin from '../shared/icons/linkedin.es6';
import Youtube from '../shared/icons/youtube.es6';

// Child Components
import GithubPopup from './popups/github.es6';
import StackOverflowPopup from './popups/stackoverflow.es6';
import LinkedinPopup from './popups/linkedin.es6';
import YoutubePopup from './popups/youtube.es6';

// Provider connection
import GoogleLogin from '../../connectors/google.es6';
import StackOverflowLogin from '../../connectors/stackexchange.es6';
import LinkedinLogin from '../../connectors/linkedin.es6';

// Mutations
import ConnectOAuth from '../../mutations/developer/connectOauth.es6';

// Map icon component to string names
const iconsMap = new Map();
iconsMap.set('github', Github);
iconsMap.set('stackoverflow', StackOverflow);
iconsMap.set('linkedin', Linkedin);
iconsMap.set('youtube', Youtube);

// Map Popups
const popupsMap = new Map();
popupsMap.set('github', GithubPopup);
popupsMap.set('stackoverflow', StackOverflowPopup);
popupsMap.set('linkedin', LinkedinPopup);
popupsMap.set('youtube', YoutubePopup);

// Map connection js adapters
const adapterMap = new Map();
adapterMap.set('youtube', GoogleLogin);
adapterMap.set('linkedin', LinkedinLogin);
adapterMap.set('stackoverflow', StackOverflowLogin);

class Connection extends Component {
  constructor(props) {
    super(props);
    this.import = this.import.bind(this);
    this.connect = this.connect.bind(this);
    const Adapter = adapterMap.get(props.connection.provider);
    if (Adapter) {
      this.connectionAdapter = new Adapter();
    }
  }

  import() {
    this.connect();
    const { connection, developer } = this.props;
    if (connection.connected) {
      developerRoute.params = {};
      developerRoute.params.id = developer.login;
      const ImportPopup = popupsMap.get(connection.provider);

      ReactDOM.render(
        <Relay.Renderer
          Container={ImportPopup}
          queryConfig={developerRoute}
          environment={Relay.Store}
          render={({ props, error, retry }) => {
            if (props) {
              return (
                <ImportPopup
                  {...props}
                />
              );
            } else if (error) {
              return <ErrorComponent retry={retry} />;
            }
            return <LoadingComponent />;
          }}
        />,
        document.getElementById(`imports-container-${connection.provider}`)
      );
    }
  }

  connect() {
    this.connectionAdapter.authenticate().then((data) => {
      const onFailure = () => false;
      const onSuccess = () => true;

      Relay.Store.commitUpdate(new ConnectOAuth({
        id: this.props.developer.id,
        provider: this.props.connection.provider,
        access_token: data.access_token,
        uid: data.uid.toString(),
      }), { onFailure, onSuccess });
    });
  }

  render() {
    const { connection } = this.props;
    const Icon = iconsMap.get(connection.provider);

    return (
      <div className="list-item">
        <ListItem
          disabled
          innerDivStyle={{ padding: '20px 56px 20px 72px' }}
          leftIcon={<div className={connection.provider}><Icon /></div>}
          rightIconButton={
            <RaisedButton
              style={{ top: 10, right: 20 }}
              primary
              onClick={connection.connected ? this.import : this.connect}
              label={connection.connected ? 'Import' : 'Connect'}
            />
          }
          primaryText={connection.provider}
        />
        <div id={`imports-container-${connection.provider}`} />
      </div>
    );
  }
}

Connection.propTypes = {
  connection: React.PropTypes.object,
  developer: React.PropTypes.object,
};

const ConnectionContainer = Relay.createContainer(Connection, {
  fragments: {
    connection: () => Relay.QL`
      fragment on Connection {
        provider,
        connected,
      }
    `,
  },
});

export default ConnectionContainer;
