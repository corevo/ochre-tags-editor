import React from 'react';
import request from 'superagent';

export default class Explorer extends React.Component {
    static propTypes = {
        setFiles: React.propTypes.func.isRequired
    }
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            let path = '/api' + nextProps.location.pathname;
            request.get(path).end((err, res) => {
                if (!err) {
                    this.props.setFiles(JSON.parse(res.text));
                }
            });
        }
    }
    render() {
        return (
            <div>
                <h1>{this.props.location.pathname.split("/").reduce((currLink, sublink, index) => {
                        if (index !== 0 && sublink === "")
                            return currLink;
                        currLink.location += `${sublink}/`;
                        currLink.links.push(<a key={currLink.location} href={currLink.location}>{sublink}/</a>);
                        return currLink;
                    }, {
                        location: "",
                        links: []
                    }).links}</h1>
            </div>
        );
    }
}
