import React from 'react';
import Relay from 'react-relay';

const JobTypes = (props) => {
  const badgeStyles = {
    border: '2px solid #000',
    borderRadius: 5,
    display: 'inline-block',
    padding: '0.33em',
    margin: '0.5em',
    textDecoration: 'none',
    color: '#333',
    minWidth: '70px',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: '0.02em',
    fontSize: 12,
    verticalAlign: 'middle',
  };

  const { developer } = props;

  return (
    <div style={{ marginTop: '10px' }}>
      {developer.full_time ?
        <span
          key={Math.random()}
          style={badgeStyles}
        >
          Full-Time
        </span> : ''
      }

      {developer.part_time ?
        <span
          key={Math.random()}
          style={badgeStyles}
        >
          Part-Time
        </span> : ''
      }

      {developer.contract ?
        <span
          key={Math.random()}
          style={badgeStyles}
        >
          Contract
        </span> : ''
      }


      {developer.freelance ?
        <span
          key={Math.random()}
          style={badgeStyles}
        >
          Freelance
        </span> : ''
      }

      {developer.startup ?
        <span
          key={Math.random()}
          style={badgeStyles}
        >
          Startup
        </span> : ''
      }

      {developer.internship ?
        <span
          key={Math.random()}
          style={badgeStyles}
        >
          Internship
        </span> : ''
      }
    </div>
  );
};

JobTypes.propTypes = {
  developer: React.PropTypes.object,
};

const JobTypesContainer = Relay.createContainer(JobTypes, {
  fragments: {
    developer: () => Relay.QL`
      fragment on Developer {
        full_time,
        part_time,
        contract,
        freelance,
        startup,
        internship,
      }
    `,
  },
});

export default JobTypesContainer;