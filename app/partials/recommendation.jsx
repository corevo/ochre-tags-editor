import React from 'react';

export default class Recommendation extends React.Component {
    static propTypes = {
        recommendations: React.PropTypes.array.isRequired
    }
    render () {
        return (<ul style={{
            display: 'flex',
            listStyle: 'none'
        }}>
            {this.props.recommendations.map(recommendation => (
                <li style={{
                        paddingLeft: '0.5em'
                    }}>
                    <a href="#" className="recommendation">
                        {recommendation}
                    </a>
                </li>
            ))}
        </ul>);
    }
}
