import React from 'react';

export default class Recommendation extends React.Component {
    static propTypes = {
        recommendations: React.PropTypes.array.isRequired,
        tagClicked: React.PropTypes.func
    };
    render () {
        return (<ul style={{
            display: 'flex',
            listStyle: 'none'
        }}>
            {this.props.recommendations.map(recommendation => (
                <li key={recommendation} style={{
                        paddingLeft: '0.5em'
                    }}>
                    <a onClick={this.props.tagClicked.bind(undefined, recommendation)} href="#" className="recommendation">
                        {recommendation}
                    </a>
                </li>
            ))}
        </ul>);
    }
}
