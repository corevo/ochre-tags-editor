import React from 'react';
require('font-awesome-webpack');

export default class Icon extends React.Component {
    static propTypes = {
        ext: React.PropTypes.string.isRequired,
        height: React.PropTypes.string
    }
    render () {
        return (
            <i className="fa fa-file-pdf-o" style={{
                fontSize: '100px',
                margin: '0 auto 10px auto',
                display: 'block',
                textAlign: 'center'
            }}></i>
        );
    }
}
