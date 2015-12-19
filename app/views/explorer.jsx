import React from 'react';
import { Link } from 'react-router';
import request from 'superagent';

export default class Explorer extends React.Component {
    static propTypes = {
        setFiles: React.PropTypes.func,
        files: React.PropTypes.array
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
        let path = this.props.location.pathname;
        if (path[path.length - 1] === '/')
            path = path.substr(0, path.length - 1);
        return (
            <div>
                <h1>{path.split("/").reduce((currLink, sublink, index) => {
                        if (index !== 0 && sublink === "")
                            return currLink;
                        currLink.location += `${sublink}/`;
                        currLink.links.push(<Link key={currLink.location} to={currLink.location}>{sublink}/</Link>);
                        return currLink;
                    }, {
                        location: "",
                        links: []
                    }).links}</h1>
                <hr />
                { this.props.files ?
                    <ul style={{
                            listStyle: 'none'
                        }}>
                        { this.props.files.map(file => (
                            <li key={file}>
                                <Link to={`${path}${file}`}>{file}</Link>
                            </li>
                        ))}
                    </ul>
                : undefined }
            </div>
        );
    }
}
