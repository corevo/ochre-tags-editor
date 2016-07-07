import React from 'react';

export default class Recommendation extends React.Component {
    static propTypes = {
        recommendations: React.PropTypes.array.isRequired,
        tagClicked: React.PropTypes.func
    };
    render () {
        return (<ul style={{
            listStyle: 'none',
            overflow: 'hidden',
            marginBottom: '10px',
            width: '530px',
            paddingRight: '0px',
            overflowY: 'auto',
            height: '250px'
        }}>
            {this.props.recommendations.map(recommendation => (
                <li key={recommendation} style={{
                        float: 'left',
                        display: 'inline',
                        width: '50%',
                        marginBottom: '10px'
                    }}>
                    <a onClick={this.props.tagClicked.bind(undefined, recommendation)} href="#" className="react-tagsinput-tag" style={{
                            textDecoration: 'none'
                        }}>
                        {recommendation}
                    </a>
                </li>
            ))}
        </ul>);
    }
}
