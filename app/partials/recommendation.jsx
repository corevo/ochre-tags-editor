import React from 'react';

export default class Recommendation extends React.Component {
    static propTypes = {
        recommendations: React.PropTypes.array.isRequired
    }
    render () {
        return (<ul>
            {this.props.recommendations.map(recommendation => (
                <li>
                    <a>
                        {recommendation}
                    </a>
                </li>
            ))}
        </ul>);
    }
}
